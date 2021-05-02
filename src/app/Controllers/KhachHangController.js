const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const Order = require("../Models/Order");

const { verifyToken } = require("./index");
class KhachHangController {
  //get customers/show_goikhachhang
  async showGoiKH(req, res, next) {
    var result = await GoiKhachHang.find({ DeleteAt: "False" });
    if (result != null) {
      res.status(200).send({
        data: result,
        error: "null",
      });
    } else {
      res.status(404).send({
        data: "",
        error: "No package",
      });
    }
  }
}

module.exports = new KhachHangController();
