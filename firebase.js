// firebase.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Replace with the path to your service account JSON key
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "portfolio-e550f.appspot.com",
  });
}

const bucket = admin.storage().bucket();
export { bucket };
