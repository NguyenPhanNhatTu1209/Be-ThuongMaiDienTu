const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoiVanChuyen = new Schema(
  {
    LoaiHangHoa: { type: String, required: true },
    LoaiVanChuyen: { type: String, required: true },
    GiaKm: { type: String, required: true },
    GiaKg: { type: String, required: true },
    KhuyenMai: { type: Number, default: 0 },
    IdCongTy: { type: String, required: true },
    Status: { type: String, default: "ACTIVE" },
  },
  {
    timestamps: true,
  }
);

// hello
// add plugin
// mongoose.plugin(slug);
// Course.plugin(mongooseDelete, {
//   overrideMethods: 'all',
//    deletedAt : true,
//  });

module.exports = mongoose.model("shipping_package", GoiVanChuyen);
