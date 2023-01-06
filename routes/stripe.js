const express = require("express");
const Stripe = require("stripe");

require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  //   const customer = await stripe.customers.create({
  //     metadata: {
  //       userId: req.body.userId,
  //       cart: JSON.stringify(req.body.cartItems),
  //     },
  //   });
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "INR",
        product_data: {
          name: item.name,
          images: [item.Image],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: { allowed_countries: ["IN"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "inr" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    // customer: customer.id,
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});

// stripe webhook

// let endpointSecret;

// endpointSecret =
//   "whsec_96c5055fa9205a9d5ba240e666d4aa844afcbfc52debe3a5eaef8dbb6d15c873";

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (req, res) => {
//     const sig = request.headers["stripe-signature"];
//     let data;
//     let eventType;
//     if (endpointSecret) {
//       let event;

//       try {
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//         console.log("webhook verified");
//       } catch (err) {
//         response.status(400).send(`Webhook Error: ${err.message}`);
//         console.log("webhook error");
//         return;
//       }
//       data = event.data.object;
//       eventType = event.type;
//     } else {
//       data = req.body.data.object;
//       eventType = req.body.type;
//     }

// Handle the event
// if (eventType === "checkout.session.completed") {
//   stripe.customers
//     .retrieve(data.customer)
//     .then((customer) => {
//       console.log(customer);
//       console.log("data:", data);
//     })
//     .catch((err) => console.log(err.message));
// }

// Return a 200 response to acknowledge receipt of the event
//     res.send().end();
//   }
// );

module.exports = router;
