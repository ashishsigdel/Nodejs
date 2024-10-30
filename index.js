import express from "express";
import nodemailer from "nodemailer";

const app = express();

app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "1aasissigdel@gmail.com",
    pass: "mnjo jddb flmr wovz",
  },
});

// POST route to send an email
app.post("/send", async (req, res) => {
  const email = "aasis.sgdl75@gmail.com";
  const otp = 123456;

  const htmlTemplate = `
    <h1>Your OTP Code</h1>
    <p>Use the following OTP code to complete your verification:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 10 minutes.</p>
  `;

  const mailOptions = {
    from: "a.asis.sigdel02@gmail.com",
    to: email,
    subject: "Your OTP Code",
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("OTP email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send OTP email.");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("running at 3000");
});
