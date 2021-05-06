const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const Order = require("../Models/Order");
const DonHangDichVu = require("../Models/DonHangDichVu");
const GoiVanChuyen = require("../Models/GoiVanChuyen");
const LoaiHangHoaSanPham = require("../Models/LoaiHangHoa");

const { verifyToken, Payment, FormatDollar , paymentMethodPackage } = require("./index");
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
  // Post customers/create-donhang
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
          var ngayHetHanGoiKhachHang = resultKH._doc.NgayHetHan;
          var ngayThucTai = Date.now();
          var soLuongDonHangGoiKhachHang = resultKH._doc.SoDonHang;
          var ngayHetHanGoiDoanhNghiep = resultDoanhNghiep._doc.NgayHetHan;
          if (
            update.KhoiLuong > resultKH._doc.KhoiLuongToiDa ||
            ngayThucTai > ngayHetHanGoiKhachHang ||
            soLuongDonHangGoiKhachHang == 0
          ) {
            if (update.KhoiLuong > khoiLuongBatBuoc) {
              res.status(400).send({
                data: "",
                error: "Gói vận chuyển này không thích hợp với số ký",
              });
            } else {
              giamGiaTaiKhoan = 0;
              update.GiamGia = giamGiaTaiKhoan + giamGiaShipping;
              var tongGiamgia = update.GiamGia;
              var chiPhiVanChuyen = parseFloat(resultGoiShipping._doc.ChiPhi);
              chiPhiVanChuyen =
                chiPhiVanChuyen - (chiPhiVanChuyen * tongGiamgia) / 100;
              var tienDo = chiPhiVanChuyen / 23050;
              var formatDollar = FormatDollar(tienDo);
              update.TongChiPhi = chiPhiVanChuyen.toString();
              var resultOrder = await Order.create(update);
              var idDonHangMoiTao = resultOrder._doc._id;
              var resultPayment;
              Payment(formatDollar,idDonHangMoiTao,async function (error, payment) {
                if (error) {
                  resultPayment = error;
                } else {
                  for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                      resultPayment = payment.links[i].href;
                      update.TongChiPhi = chiPhiVanChuyen.toString();
                      var soLuongDonHangDoanhNghiep =
                        resultDoanhNghiep._doc.SoDonHang;
                      if (
                        soLuongDonHangDoanhNghiep > 0 &&
                        ngayThucTai <= ngayHetHanGoiDoanhNghiep
                      ) {
                        soLuongDonHangDoanhNghiep =
                          soLuongDonHangDoanhNghiep - 1;
                        resultDoanhNghiep._doc.SoDonHang = soLuongDonHangDoanhNghiep;
                        await DoanhNghiep.findOneAndUpdate(
                          { _id: update.id_DoanhNghiep },
                          resultDoanhNghiep._doc,
                          {
                            new: true,
                          }
                        );
                        res.status(200).send({
                          data: resultPayment,
                          error:
                            "Gói khách hàng không được sử dụng vì không hợp lệ",
                        });
                      } else {
                        res.status(200).send({
                          data: "null",
                          error:
                            "Gói vận chuyển hết hiệu lực vui lòng chọn gói khác",
                        });
                      }
                    }
                  }
                }
              });
            }
          } else {
            if (update.KhoiLuong > khoiLuongBatBuoc) {
              res.status(400).send({
                data: "",
                error: "Gói vận chuyển này không thích hợp với số ký",
              });
            } else {
              update.GiamGia = giamGiaTaiKhoan + giamGiaShipping;
              var tongGiamgia = update.GiamGia;
              var chiPhiVanChuyen = parseFloat(resultGoiShipping._doc.ChiPhi);
              chiPhiVanChuyen =
                chiPhiVanChuyen - (chiPhiVanChuyen * tongGiamgia) / 100;
              var tienDo = chiPhiVanChuyen / 23050;
              var formatDollar = FormatDollar(tienDo);
              update.TongChiPhi = String(chiPhiVanChuyen);
              var resultOrder = await Order.create(update);
              var idDonHangMoiTao = resultOrder._doc._id;
              var resultPayment;
              Payment(formatDollar,idDonHangMoiTao, async function (error, payment) {
                if (error) {
                  resultPayment = error;
                } else {
                  for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                      resultPayment = payment.links[i].href;
                      var soLuongDonHangDoanhNghiep =
                        resultDoanhNghiep._doc.SoDonHang;
                      if (
                        soLuongDonHangDoanhNghiep > 0 &&
                        ngayThucTai <= ngayHetHanGoiDoanhNghiep
                      ) {
                        soLuongDonHangDoanhNghiep =
                          soLuongDonHangDoanhNghiep - 1;
                        resultDoanhNghiep._doc.SoDonHang = soLuongDonHangDoanhNghiep;
                        await DoanhNghiep.findOneAndUpdate(
                          { _id: update.id_DoanhNghiep },
                          resultDoanhNghiep._doc,
                          {
                            new: true,
                          }
                        );
                        var soLuongDonHang = resultKH._doc.SoDonHang;
                        soLuongDonHang = soLuongDonHang - 1;
                        resultKH._doc.SoDonHang = soLuongDonHang;
                        await KhachHang.findOneAndUpdate(
                          { id_account: _id },
                          resultKH._doc,
                          {
                            new: true,
                          }
                        );                     
                        res.status(200).send({
                          data: resultPayment,
                          error: "null",
                        });
                      } else {
                        res.status(200).send({
                          data: "null",
                          error:
                            "Gói vận chuyển hết hiệu lực vui lòng chọn gói khác",
                        });
                      }
                    }
                  }
                }
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
        var resultdonHang = await Order.findOne({ _id: idDonHangKhachHang });
        var idCongTy = resultdonHang._doc.id_DoanhNghiep;
        var idKhachHang = resultdonHang._doc.id_KhachHang;
        var resultKhachHang = await KhachHang.findOne({ _id: idKhachHang });
        var resultDoanhNghiep = await DoanhNghiep.findOne({ _id: idCongTy });
        var soDonHangKH = resultKhachHang._doc.SoDonHang + 1;
        var SoDonHangDN = resultDoanhNghiep._doc.SoDonHang + 1;
        var updateKH = { SoDonHang: soDonHangKH };
        var updateDN = { SoDonHang: SoDonHangDN };
        await KhachHang.findOneAndUpdate({ _id: idKhachHang }, updateKH, {
          new: true,
        });
        await DoanhNghiep.findOneAndUpdate({ _id: idCongTy }, updateDN, {
          new: true,
        });
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

  // Post customers/create-bill-package
  async CreateBillPackage(req, res, next) {
    try {
      var {
        TenGoi,
        ChiPhi,
        ThanhToan,
        id_GoiDichVu,
        id_DoanhNghiep,
        id_KhachHang,
      } = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = {
        TenGoi,
        ChiPhi,
        ThanhToan,
        id_GoiDichVu,
        id_DoanhNghiep,
        id_KhachHang,
      };
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "KHACHHANG") {
          var resultGoiDichVu =  await GoiKhachHang.findOne({_id: update.id_GoiDichVu});
          if(resultGoiDichVu != null)
          {
            update.TenGoi = resultGoiDichVu._doc.TenDichVuKhachHang;
            update.ChiPhi = resultGoiDichVu._doc.ChiPhi;
            var resultKH =  await KhachHang.findOne({id_account: _id });
            update.id_KhachHang = resultKH._doc._id;
            var chiPhi = parseFloat(update.ChiPhi);
            var tienDo = chiPhi / 23050;
            var formatDollar = FormatDollar(tienDo);
            var resultBillPackage = await DonHangDichVu.create(update);
            var idDonHangMoiTao = resultBillPackage._doc._id;
            var resultPayment;
            var ngayHienTai = new Date();
            ngayHienTai.setDate(ngayHienTai.getDate());
            var ngayHetHan = resultKH._doc.NgayHetHan;
            var soDonHangHienTai = resultKH._doc.SoDonHang;
            if(ngayHienTai<= ngayHetHan && soDonHangHienTai>0)
            {
              res.status(400).send({
                data: "",
                error: "Gói của bạn vẫn còn hiệu lực",
              });
            }
            else
            {
              paymentMethodPackage(formatDollar,idDonHangMoiTao, async function (error, payment) {
                if (error) {
                  resultPayment = error;
                } else {
                  for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                      resultPayment = payment.links[i].href; 
                      res.status(200).send({
                        data: resultPayment,
                        error: "null",
                      });         
                      }
                    }
                  }
              });
            }
          }
          else{
            res.status(404).send({
              data: "",
              error: "Not found Package!",
            });
          }
          
      } else {
        res.status(404).send({
          data: "",
          error: "Not found user!",
        });
       }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: error,
      });
    }
  }
}

module.exports = new KhachHangController();
