const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonHangDichVu = new Schema(
  {
    TenGoi: { type: String, required: true },
    ChiPhi: { type: String, required: true },
    ThanhToan: { type: String, default: "Chưa thanh toán" },
    id_GoiDichVu: { type: String, default: null },
    id_DoanhNghiep: { type: String, default: null },
    id_KhachHang: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("bill_package", DonHangDichVu);