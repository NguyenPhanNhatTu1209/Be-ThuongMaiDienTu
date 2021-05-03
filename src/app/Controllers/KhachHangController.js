const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const Order = require("../Models/Order");
const GoiVanChuyen = require("../Models/GoiVanChuyen");
const LoaiHangHoaSanPham = require("../Models/LoaiHangHoa");

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
      var {
        TenNguoiNhan,
        SoDienThoaiNguoiNhan,
        NoiLayHang,
        NoiGiaoHang,
        TrangThai,
        KhoiLuong,
        LoaiHangHoa,
        TenLoaiHang,
        GiamGia,
        TongChiPhi,
        ThanhToan,
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
        TrangThai,
        KhoiLuong,
        LoaiHangHoa,
        TenLoaiHang,
        GiamGia,
        TongChiPhi,
        ThanhToan,
        id_KhachHang,
        id_DoanhNghiep,
        id_GoiShipping,
      };
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "KHACHHANG") {
          var resultKH = await KhachHang.findOne({ id_account: _id });
          var resultGoiShipping = await GoiVanChuyen.findOne({
            _id: update.id_GoiShipping,
          });
          var resultLoaiHangHoa = await LoaiHangHoaSanPham.findOne({
            _id: resultGoiShipping._doc.IdLoaiHangHoa,
          });
          var giamGiaTaiKhoan = resultKH._doc.GiamGia;
          var giamGiaShipping = resultGoiShipping._doc.KhuyenMai;
          update.LoaiHangHoa = resultLoaiHangHoa.LoaiHangHoa;
          var khoiLuongBatBuoc = resultLoaiHangHoa.SoKy;
          update.id_KhachHang = resultKH._doc._id;
          update.id_DoanhNghiep = resultGoiShipping._doc.IdCongTy;
          var resultDoanhNghiep = await DoanhNghiep.findOne({
            _id: update.id_DoanhNghiep,
          });
          if(update.KhoiLuong > resultKH._doc.KhoiLuongToiDa)
          {
            if(update.KhoiLuong > khoiLuongBatBuoc)
            {
              res.status(400).send({
                data: "",
                error: "Gói vận chuyển này không thích hợp với số ký",
              });
            }
            else
            {
              giamGiaTaiKhoan= 0;
              update.GiamGia = giamGiaTaiKhoan + giamGiaShipping;
              var tongGiamgia = update.GiamGia;
              var chiPhiVanChuyen = parseFloat(resultGoiShipping._doc.ChiPhi);
              chiPhiVanChuyen = chiPhiVanChuyen-((chiPhiVanChuyen*tongGiamgia)/100);
              update.TongChiPhi = String(chiPhiVanChuyen);
              var soLuongDonHangDoanhNghiep = resultDoanhNghiep._doc.SoDonHang;
              soLuongDonHangDoanhNghiep = soLuongDonHangDoanhNghiep - 1;
              resultDoanhNghiep._doc.SoDonHang = soLuongDonHangDoanhNghiep;
              await DoanhNghiep.findOneAndUpdate(
                {_id:   update.id_DoanhNghiep},
                resultDoanhNghiep._doc,
                {
                  new: true,
                }
              );
              var resultOrder = await Order.create(update);
              res.status(200).send({
                data: resultOrder,
                error: "Gói khách hàng không được sử dụng",
              });
            }
          }
          else
          {
            if(update.KhoiLuong > khoiLuongBatBuoc)
            {
              res.status(400).send({
                data: "",
                error: "Gói vận chuyển này không thích hợp với số ký",
              });
            }
            else
            {
              update.GiamGia = giamGiaTaiKhoan + giamGiaShipping;
              var tongGiamgia = update.GiamGia;
              var chiPhiVanChuyen = parseFloat(resultGoiShipping._doc.ChiPhi);
              chiPhiVanChuyen = chiPhiVanChuyen-((chiPhiVanChuyen*tongGiamgia)/100);
              update.TongChiPhi = String(chiPhiVanChuyen);
              var soLuongDonHangDoanhNghiep = resultDoanhNghiep._doc.SoDonHang;
              soLuongDonHangDoanhNghiep = soLuongDonHangDoanhNghiep - 1;
              resultDoanhNghiep._doc.SoDonHang = soLuongDonHangDoanhNghiep;
              await DoanhNghiep.findOneAndUpdate(
                {_id:   update.id_DoanhNghiep},
                resultDoanhNghiep._doc,
                {
                  new: true,
                }
              );
              var soLuongDonHang = resultKH._doc.SoDonHang;
              soLuongDonHang = soLuongDonHang-1;
              resultKH._doc.SoDonHang = soLuongDonHang;
              await KhachHang.findOneAndUpdate(
                { id_account: _id },
                resultKH._doc,
                {
                  new: true,
                }
              );
              var resultOrder = await Order.create(update);
              res.status(200).send({
                data: resultOrder,
                error: "null",
              });
            }
          }
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
