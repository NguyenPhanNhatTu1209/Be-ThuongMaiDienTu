const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoaiHangHoa = new Schema(
  {
    LoaiHangHoa: { type: String, required: true },
    SoKy: { type: Number, required: true },
    Status: {type: String, default: "ACTIVE"}
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("product_type", LoaiHangHoa);
