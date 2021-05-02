const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const Order = require("../Models/Order");
const GoiVanChuyen = require("../Models/GoiVanChuyen");
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

  // Post me/create-donhang
  async TaoDonHang(req, res, next) {
    try {
      const {
        TenNguoiNhan,
        SoDienThoaiNguoiNhan,
        NoiLayHang,
        NoiGiaoHang,
        KhoiLuong,
        TenLoaiHang,
        TongChiPhi,
        GiamGia,
        id_KhachHang,
        id_DoanhNghiep,
        id_GoiShipping,
      } = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = {
        TenNguoiNhan,
        SoDienThoaiNguoiNhan,
        NoiLayHang,
        NoiGiaoHang,
        KhoiLuong,
        TenLoaiHang,
        TongChiPhi,
        id_KhachHang,
        id_DoanhNghiep,
        id_GoiShipping,
      };
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        var resultGoiShipping = await GoiVanChuyen.findOne({
          _id: update.id_GoiShipping,
        });
        if (roleDT == "KHACHHANG") {
          var resultKH = await KhachHang.findOne({ id_account: _id });
          const giamGiaTaiKhoan = resultKH._doc.GiamGia;
          const giamGiaShipping = resultGoiShipping._doc.KhuyenMai;

          update.GiamGia = giamGiaTaiKhoan + giamGiaShipping;
          update.id_KhachHang = resultKH._doc._id;
          if(update.KhoiLuong > resultKH._doc.KhoiLuongToiDa)
          {
            res.status(404).send({
              data: "",
              error: "No Authentication",
            });
          }
          var resultOrder = await Order.create(update);
          res.status(200).send({
            data: resultOrder,
            error: "null",
          });
        } else {
          res.status(404).send({
            data: "",
            error: "No Authentication",
          });
        }
      } else {
        res.status(404).send({
          data: "",
          error: "Not found user!",
        });
      }
    } catch (error) {
      res.status(500).send({
        error: error,
      });
    }
  }
  // Put me/confirm-donhang
  async XacNhanDonHang(req, res, next) {
    var idDonHangKhachHang = req.body.idDonHang;
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var update = { TrangThai: "Đã Nhận Hàng" };
    var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    if (result != null) {
      const roleDT = result.Role;
      if (roleDT == "KHACHHANG") {
        var resultOrder = await Order.findOneAndUpdate(
          { _id: idDonHangKhachHang },
          update,
          {
            new: true,
          }
        );
        res.status(200).send({
          data: resultOrder,
          error: "null",
        });
      } else {
        res.status(404).send({
          data: "",
          error: "No Authentication",
        });
      }
    } else {
      res.status(404).send({
        data: "",
        error: "Not found user!",
      });
    }
  }

  // Delete me/delete-donhang
  async HuyDonHang(req, res, next) {
    var idDonHangKhachHang = req.body.idDonHang;
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var update = { TrangThai: "Đã Hủy Đơn" };
    var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    if (result != null) {
      const roleDT = result.Role;
      if (roleDT == "KHACHHANG") {
        var resultOrder = await Order.findOneAndUpdate(
          { _id: idDonHangKhachHang },
          update,
          {
            new: true,
          }
        );
        res.status(200).send({
          data: resultOrder,
          error: "null",
        });
      } else {
        res.status(404).send({
          data: "",
          error: "No Authentication",
        });
      }
    } else {
      res.status(404).send({
        data: "",
        error: "Not found user!",
      });
    }
  }
}

module.exports = new KhachHangController();
