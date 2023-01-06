const { object } = require("joi");
const { default: mongoose } = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    CustomerId: { type: String },
    paymentIntentId: { type: String },
    products: [
      {
        id: { type: String },
        name: { type: String },
        brand: { type: String },
        desc: { type: String },
        price: { type: String },
        Image: { type: String },
        cartQuantity: { type: Number },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    Shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
exports.Order = Order;
