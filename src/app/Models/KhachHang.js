const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KhachHang = new Schema(
  {
    TenKhachHang: { type: String, required: true },
    Email: { type: String, required: true },
    SoDienThoai: { type: String, required: true },
    TenDichVuKhachHang: { type: String, default: null },
    KhoiLuongToiDa: { type: Number, default: null },
    NgayHetHan: { type: Date, default: null },
    SoDonHang: { type: Number, default: null },
    GiamGia: { type: Number, default: 0 },
    id_account: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin
// mongoose.plugin(slug);
// Course.plugin(mongooseDelete, {
//   overrideMethods: 'all',
//    deletedAt : true,
//  });

module.exports = mongoose.model("customer", KhachHang);
