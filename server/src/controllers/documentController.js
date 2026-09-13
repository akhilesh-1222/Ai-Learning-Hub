// Document controller with pdf-parse fix
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ai } from '../lib/gemini.js';
import UploadedNote from '../models/UploadedNote.js';
import NoteEmbedding from '../models/NoteEmbedding.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

// @desc    Upload PDF, extract text, chunk and embed
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    // 1. Extract text using pdf-parse

    const pdfData = await pdfParse(fileBuffer);
    console.log("PDF Data:", pdfData);
    console.log("Extracted Text Length:", pdfData.text?.length);
    console.log("Extracted Text Preview:", pdfData.text?.substring(0, 300));

    const text = pdfData.text;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // 2. Chunk text using LangChain
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitText(text);

    // 3. Save UploadedNote record
    const note = await UploadedNote.create({
      userId: req.user._id,
      fileName,
      fileSize,
    });

    // If there is no Gemini API key, we skip embedding creation to avoid crashing
    if (!process.env.GEMINI_API_KEY) {
      return res.status(201).json({
        message: 'File uploaded and text extracted. Embeddings skipped due to missing GEMINI_API_KEY.',
        note,
      });
    }

    // 4. Generate embeddings and save to DB (Safely capped for free tier resources)
    const MAX_FREE_CHUNKS = 25; // Protects Gemini free rate limits & Render memory
    const safeChunks = chunks.slice(0, MAX_FREE_CHUNKS);
    const noteEmbeddings = [];
    const batchSize = 10; // Safer batch size

    try {
      for (let i = 0; i < safeChunks.length; i += batchSize) {
        const chunkBatch = safeChunks.slice(i, i + batchSize);
        
        const response = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: chunkBatch,
        });

        const vectors = response.embeddings?.map(emb => emb.values) || [];

        for (let j = 0; j < chunkBatch.length; j++) {
          if (vectors[j]) {
            noteEmbeddings.push({
              noteId: note._id,
              userId: req.user._id,
              textChunk: chunkBatch[j],
              embedding: vectors[j],
            });
          }
        }
      }

      if (noteEmbeddings.length > 0) {
        await NoteEmbedding.insertMany(noteEmbeddings);
      }
    } catch (embedError) {
      console.warn("Embedding generation warning (file saved without full vector index):", embedError.message);
      // Still return 201 so user can view the document and text without a hard crash
      return res.status(201).json({
        message: 'File uploaded and text extracted. AI indexing partially limited on free tier.',
        note,
        chunksCount: safeChunks.length,
      });
    }

    res.status(201).json({
      message: 'File processed and indexed successfully',
      note,
      chunksCount: safeChunks.length,
    });
  } catch (error) {
    console.error('Error in uploadDocument:', error);
    res.status(500).json({ message: `Server error: ${error.message || 'Unknown error'}` });
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res) => {
  try {
    const documents = await UploadedNote.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a document, its embeddings, and associated chats
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await UploadedNote.findOne({ _id: documentId, userId: req.user._id });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Find and delete all associated chats and messages
    const chats = await Chat.find({ noteId: documentId, userId: req.user._id });
    const chatIds = chats.map(c => c._id);
    await Message.deleteMany({ chatId: { $in: chatIds } });
    await Chat.deleteMany({ noteId: documentId, userId: req.user._id });

    // Delete embeddings
    await NoteEmbedding.deleteMany({ noteId: documentId, userId: req.user._id });

    // Delete the document itself
    await UploadedNote.deleteOne({ _id: documentId });

    res.status(200).json({ message: 'Document and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
