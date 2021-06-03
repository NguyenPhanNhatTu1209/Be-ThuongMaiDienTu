const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Paypal = new Schema({
  id_Paypal: { type: String, required: true },
  Transaction: { type: String, required: true },
  id_Order: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("paypal", Paypal);