const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Order = new Schema(
  {
    TenNguoiNhan: { type: String, required: true },
    SoDienThoaiNguoiNhan: { type: String, required: true },
    NoiLayHang: { type: String, required: true },
    NoiGiaoHang: { type: String, required: true },
    TrangThai: { type: String, default: "Chờ xác nhận" },
    KhoiLuong: { type: Number, required: true },
    LoaiHangHoa:{ type: String, required: true },
    TenLoaiHang: { type: String, required: true },
    GiamGia: { type: Number, default: 0 },
    TongChiPhi: { type: String, required: true },
    ThanhToan:{type: String, default: "Chưa thanh toán"},
    TienGiamGia:{type:String, default: null},
    id_KhachHang: { type: String, default: null },
    id_DoanhNghiep: { type: String, default: null },
    id_GoiShipping: { type: String, default: null },
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

module.exports = mongoose.model("order", Order);
