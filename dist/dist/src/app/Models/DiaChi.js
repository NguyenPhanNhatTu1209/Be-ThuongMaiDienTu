const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiaChi = new Schema({
  address: { type: String, required: true },
  id_account: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("address", DiaChi);