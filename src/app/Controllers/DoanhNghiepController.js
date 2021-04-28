const TaiKhoan = require('../Models/TaiKhoan');
const KhachHang = require('../Models/KhachHang');
const DoanhNghiep = require('../Models/DoanhNghiep');
const GoiKhachHang = require('../Models/GoiKhachHang');
const GoiDoanhNghiep = require('../Models/GoiDoanhNghiep');
const { createToken, verifyToken } = require('./index');
class DoanhNghiepController {
  //GET enterprises/show_goidoanhnghiep
  async showGoiDN(req, res, next) {
    var result = await GoiDoanhNghiep.find({DeleteAt: "False"});
    console.log(result);
    if (result != null) {
      res.status(200).send({
        "data": result,
        "error": "null",
      });

    } else {
      res.status(404).send({
        "data": '',
        "error": "No package",
      });
    }
  }

}

module.exports = new DoanhNghiepController();