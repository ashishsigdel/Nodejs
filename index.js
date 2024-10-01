import express from "express";
import multer from "multer";
import { promisify } from "util";
import { Readable } from "stream";
import { bucket } from "./firebase.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const upload = multer({
  storage: multer.memoryStorage(),
}).single("image");

const uploadMiddleware = promisify(upload);

app.get("/", (req, res) => {
  res.json("Working");
});

app.post("/create", async (req, res) => {
  await uploadMiddleware(req, res);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(fileName);

  const stream = Readable.from(req.file.buffer);

  const streamUpload = stream.pipe(
    file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    })
  );

  await new Promise((resolve, reject) => {
    streamUpload.on("finish", resolve);
    streamUpload.on("error", reject);
  });

  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  res
    .status(200)
    .json({ message: "File uploaded successfully", url: publicUrl });
});

app.listen(3000, () => {
  console.log("Server is running at 3000!!!");
});
