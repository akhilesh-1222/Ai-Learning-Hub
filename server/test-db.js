import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://Akhileshyadav:Akhil2026@cluster0.lax7ogg.mongodb.net/codex-hackathone?appName=Cluster0";
console.log("Connecting to:", MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
