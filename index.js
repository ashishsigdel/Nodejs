import express from "express";
import dotenv from "dotenv";
dotenv.config();
import stripePackage from "stripe";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Node.js Express Book",
            description: "Full stack in javascript course book.",
          },
          unit_amount: 50 * 100, // Amount in cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Coding T-shirt",
            description: "Nodejs printed tshirt.",
          },
          unit_amount: 20 * 100, // Amount in cents
        },
        quantity: 3,
      },
    ],
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US", "NP"],
    },
    success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
  });
  //   console.log(session);

  res.redirect(303, session.url);
});

app.get("/complete", async (req, res) => {
  const result = Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ["payment_intent.payment_method"],
    }),
    stripe.checkout.sessions.listLineItems(req.query.session_id),
  ]);

  console.log(JSON.stringify(await result));

  res.status(200).send("Payment was successful");
});

app.get("/cancel", async (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running at 3000!!!");
});
