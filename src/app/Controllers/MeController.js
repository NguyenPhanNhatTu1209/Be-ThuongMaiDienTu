const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const DiaChi = require("../Models/DiaChi");
const Order = require("../Models/Order");
const bcrypt = require("bcrypt");

const { createToken, verifyToken } = require("./index");
class MeController {
  //get me/information / get || post put delete
  async information(req, res, next) {
    try
    {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "KHACHHANG") {
          var resultKH = await KhachHang.findOne({ id_account: _id });
          const resultAddress = await DiaChi.find({ id_account: _id }); // find All address by id account
          resultKH._doc.address = resultAddress; // them vao bien resultKH 1 key la address va` gia' tri la bien resultAddress vua tim dc o dong tren
          res.status(200).send({
            data: resultKH,
            error: "null",
          });
        } else {
          var resultDN = await DoanhNghiep.findOne({ id_account: _id });
          res.status(200).send({
            data: resultDN,
            error: "null",
          });
        }
      } else {
        res.status(404).send({
          data: "",
          error: "Not found user!",
        });
      }
    }
    catch (error)
    {
      console.log(error);
      res.status(500).send({
        data: "",
        error: error,
      });
    }

  }

  async editProfile(req, res, next) {
    const { Ten, SoDienThoai, DiaChi } = req.body;
    var updateValue = { SoDienThoai, DiaChi };
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    if (result != null) {
      const roleDT = result.Role;
      if (roleDT == "KHACHHANG") {
        updateValue.TenKhachHang = Ten;
        var resultKH = await KhachHang.findOneAndUpdate(
          { id_account: _id },
          updateValue,
          {
            new: true,
          }
        );
        res.status(200).send({
          data: resultKH,
          error: "null",
        });
      } else {
        updateValue.TenDoanhNghiep = Ten;
        var resultDN = await DoanhNghiep.findOneAndUpdate(
          { id_account: _id },
          updateValue,
          {
            new: true,
          }
        );
        res.status(200).send({
          data: resultDN,
          error: "null",
        });
      }
    } else {
      res.status(404).send({
        data: "",
        error: "Not found user!",
      });
    }
  }
  // PUT me/choose_goidichvukhachhang
  async ChonGoiDichVuKH(req, res, next) {
    // const { TenDichVuKhachHang, KhoiLuongToiDa, HanSuDung,SoDonHang,GiamGia } = req.body;
    var idGoiDichVuKhachHang = req.body.idGoiDV;
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var resultKH = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    var resultGoiDV = await GoiKhachHang.findOne({
      DeleteAt: "False",
      _id: idGoiDichVuKhachHang,
    });
    const {
      TenDichVuKhachHang,
      KhoiLuongToiDa,
      HanSuDung,
      SoDonHang,
      GiamGia,
    } = resultGoiDV;
    const update = {
      TenDichVuKhachHang,
      KhoiLuongToiDa,
      HanSuDung,
      SoDonHang,
      GiamGia,
    };
    if (resultKH != null) {
      const roleDT = resultKH.Role;
      if (roleDT == "KHACHHANG") {
        var resultKH = await KhachHang.findOneAndUpdate(
          { id_account: _id },
          update,
          {
            new: true,
          }
        );
        res.status(200).send({
          data: resultKH,
          error: "null",
        });
      } else {
        res.status(404).send({
          data: "",
          error: "No Package",
        });
      }
    } else {
      res.status(404).send({
        data: "",
        error: "Not found user!",
      });
    }
  }

  // PUT me/choose_goidichvudoanhnghiep
  async ChonGoiDichVuDN(req, res, next) {
    // const { TenGoi, HanSuDung,SoDonHang } = req.body;
    var idGoiDichVuDoanhNghiep = req.body.idGoiDN;
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var resultDN = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    var resultGoiDV = await GoiDoanhNghiep.findOne({
      DeleteAt: "False",
      _id: idGoiDichVuDoanhNghiep,
    });
    const { TenGoi, HanSuDung, SoDonHang } = resultGoiDV;
    const update = { TenGoi, HanSuDung, SoDonHang };
    if (resultDN != null) {
      const roleDT = resultDN.Role;
      if (roleDT == "DOANHNGHIEP") {
        var resultDN = await DoanhNghiep.findOneAndUpdate(
          { id_account: _id },
          update,
          {
            new: true,
          }
        );
        res.status(200).send({
          data: resultDN,
          error: "null",
        });
      } else {
        res.status(404).send({
          data: "",
          error: "No Package",
        });
      }
    } else {
      res.status(404).send({
        data: "",
        error: "Not found user!",
      });
    }
  }
  // Post me/create-donhang
  async TaoDonHang(req, res, next) {
    const {
      TenNguoiNhan,
      SoDienThoaiNguoiNhan,
      NoiLayHang,
      NoiGiaoHang,
      TrangThai,
      KhoiLuong,
      TenLoaiHang,
      TongChiPhi,
      GiamGia,
      id_KhachHang,
    } = req.body;
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var update = {
      TenNguoiNhan,
      SoDienThoaiNguoiNhan,
      NoiLayHang,
      NoiGiaoHang,
      TrangThai,
      KhoiLuong,
      TenLoaiHang,
      TongChiPhi,
      id_KhachHang,
    };
    var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    if (result != null) {
      const roleDT = result.Role;
      if (roleDT == "KHACHHANG") {
        var resultKH = await KhachHang.findOne({ id_account: _id });
        update.GiamGia = resultKH._doc.GiamGia;
        update.id_KhachHang = resultKH._doc._id;
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

  //Put me/change-password
  async ChangePassword(req, res, next) {
    const passwordOld = req.body.PasswordOld;
    const passwordNew = req.body.PasswordNew;
    const confirmPassword = req.body.ConfirmPassword;
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var result = await TaiKhoan.findOne({ _id }); 
    if (result != null) {
      const isEqualPassword = await bcrypt.compare(passwordOld, result.Password);
      if(isEqualPassword)
      {
        if(passwordNew == confirmPassword)
        {
          const hashPassword = await bcrypt.hash(passwordNew, 5);
          var updateValue= {Password: hashPassword}
          await TaiKhoan.findOneAndUpdate({ _id},
            updateValue, {
            new: true
        });
        res.status(200).send({
          error: "Change Password Success",
        });
        }
        else
        {
          res.status(400).send({
            error: "New password is not same same password confirm",
          });
        }
      }
      else{
        res.status(400).send({
          error: " Wrong Old Password ",
        });
      }
    

    }
  }



}

module.exports = new MeController();
