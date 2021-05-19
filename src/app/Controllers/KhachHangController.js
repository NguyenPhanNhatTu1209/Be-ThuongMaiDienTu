const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const Order = require("../Models/Order");
const DonHangDichVu = require("../Models/DonHangDichVu");
const GoiVanChuyen = require("../Models/GoiVanChuyen");
const LoaiHangHoaSanPham = require("../Models/LoaiHangHoa");
const DiaChi = require("../Models/DiaChi");
const {
  verifyToken,
  Payment,
  FormatDollar,
  paymentMethodPackage,
  RefundPayment,
  sortObject,
} = require("./index");
const LoaiHangHoa = require("../Models/LoaiHangHoa");
class KhachHangController {
  //get customers/show_goikhachhang
  async showGoiKH(req, res, next) {
    try {
      var result = await GoiKhachHang.find({ DeleteAt: "False" });
      if (result != null) {
        res.status(200).send({
          data: result,
        });
      } else {
        res.status(404).send({
          data: "",
          error: "No package",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: error,
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
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
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
              Payment(
                formatDollar,
                idDonHangMoiTao,
                async function (error, payment) {
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
                }
              );
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
              Payment(
                formatDollar,
                idDonHangMoiTao,
                async function (error, payment) {
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
                }
              );
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
    try {
      var idDonHangKhachHang = req.body.idDonHang;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = { TrangThai: "Đã Nhận Hàng" };
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
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
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }

  // Delete me/delete-donhang (paypal ==> refund)
  async HuyDonHang(req, res, next) {
    try {
      var idDonHangKhachHang = req.body.idDonHang;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = { TrangThai: "Đã Hủy Đơn" };
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "KHACHHANG") {
          var resultdonHang = await Order.findOne({ _id: idDonHangKhachHang });
          var phuongThucThanhToan = resultdonHang._doc.ThanhToan;
          if (phuongThucThanhToan == "PayPal") {
            var idCongTy = resultdonHang._doc.id_DoanhNghiep;
            var idKhachHang = resultdonHang._doc.id_KhachHang;
            var resultKhachHang = await KhachHang.findOne({ _id: idKhachHang });
            var resultDoanhNghiep = await DoanhNghiep.findOne({
              _id: idCongTy,
            });
            var soDonHangKH = resultKhachHang._doc.SoDonHang + 1;
            var SoDonHangDN = resultDoanhNghiep._doc.SoDonHang + 1;
            var updateKH = { SoDonHang: soDonHangKH };
            var updateDN = { SoDonHang: SoDonHangDN };
            var id_Order = resultdonHang._id;
            var resultRefund;
            RefundPayment(id_Order, async function (error, refund) {
              if (error) {
                resultRefund = error;
                res.status(400).send({
                  error: resultRefund,
                });
              } else {
                resultRefund = refund;
                await KhachHang.findOneAndUpdate(
                  { _id: idKhachHang },
                  updateKH,
                  {
                    new: true,
                  }
                );
                await DoanhNghiep.findOneAndUpdate(
                  { _id: idCongTy },
                  updateDN,
                  {
                    new: true,
                  }
                );
                var resultOrder = await Order.findOneAndUpdate(
                  { _id: idDonHangKhachHang },
                  update,
                  {
                    new: true,
                  }
                );
                res.status(200).send({
                  data: resultOrder,
                  refund: resultRefund,
                  error: "null",
                });
              }
            });
          } else {
            var idCongTy = resultdonHang._doc.id_DoanhNghiep;
            var idKhachHang = resultdonHang._doc.id_KhachHang;
            var resultKhachHang = await KhachHang.findOne({ _id: idKhachHang });
            var resultDoanhNghiep = await DoanhNghiep.findOne({
              _id: idCongTy,
            });
            var soDonHangKH = resultKhachHang._doc.SoDonHang + 1;
            var SoDonHangDN = resultDoanhNghiep._doc.SoDonHang + 1;
            var updateKH = { SoDonHang: soDonHangKH };
            var updateDN = { SoDonHang: SoDonHangDN };
            var id_Order = resultdonHang._id;
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
        data: "",
        error: error,
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
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "KHACHHANG") {
          var resultGoiDichVu = await GoiKhachHang.findOne({
            _id: update.id_GoiDichVu,
          });
          if (resultGoiDichVu != null) {
            update.TenGoi = resultGoiDichVu._doc.TenDichVuKhachHang;
            update.ChiPhi = resultGoiDichVu._doc.ChiPhi;
            var resultKH = await KhachHang.findOne({ id_account: _id });
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
            if (ngayHienTai <= ngayHetHan && soDonHangHienTai > 0) {
              res.status(400).send({
                data: "",
                error: "Gói của bạn vẫn còn hiệu lực",
              });
            } else {
              paymentMethodPackage(
                formatDollar,
                idDonHangMoiTao,
                async function (error, payment) {
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
                }
              );
            }
          } else {
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
  //Post customers/create_payment_vnpayurl
  async CreatePaymentVnpayurl(req, res, next) {
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
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
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
              update.TongChiPhi = chiPhiVanChuyen.toString();
              console.log(chiPhiVanChuyen);
              var resultOrder = await Order.create(update);
              var idDonHangMoiTao = resultOrder._doc._id;
              var resultPayment;
              var ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

              var dateFormat = require("dateformat");

              var tmnCode = "JCO3SG7X";
              var secretKey = "BKPYNKKKBEAZCHZFHLIXKMXXCODHEVSU";
              var vnpUrl = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
              var returnUrl = "http://54.255.93.14/me/vnpay_return";

              var date = new Date();

              var createDate = dateFormat(date, "yyyymmddHHmmss");
              var orderId = dateFormat(date, "HHmmss");
              var amount = chiPhiVanChuyen.toString();
              var bankCode = "NCB";
              var id = `${idDonHangMoiTao}`;
              var orderInfo = id;
              var orderType = "payment";
              var locale = "vn";

              var currCode = "VND";
              var vnp_Params = {};
              vnp_Params["vnp_Version"] = "2";
              vnp_Params["vnp_Command"] = "pay";
              vnp_Params["vnp_TmnCode"] = tmnCode;
              // vnp_Params['vnp_Merchant'] = ''
              vnp_Params["vnp_Locale"] = locale;
              vnp_Params["vnp_CurrCode"] = currCode;
              vnp_Params["vnp_TxnRef"] = orderId;
              vnp_Params["vnp_OrderInfo"] = orderInfo;
              vnp_Params["vnp_OrderType"] = orderType;
              // id don
              vnp_Params["vnp_Amount"] = amount * 100;
              vnp_Params["vnp_ReturnUrl"] = returnUrl;
              vnp_Params["vnp_IpAddr"] = ipAddr;
              vnp_Params["vnp_CreateDate"] = createDate;
              if (bankCode !== null && bankCode !== "") {
                vnp_Params["vnp_BankCode"] = bankCode;
              }

              vnp_Params = sortObject(vnp_Params);

              var querystring = require("qs");
              var signData =
                secretKey +
                querystring.stringify(vnp_Params, { encode: false });

              var sha256 = require("sha256");

              var secureHash = sha256(signData);

              vnp_Params["vnp_SecureHashType"] = "SHA256";
              vnp_Params["vnp_SecureHash"] = secureHash;
              vnpUrl +=
                "?" + querystring.stringify(vnp_Params, { encode: true });
              resultPayment = vnpUrl;
              update.TongChiPhi = chiPhiVanChuyen.toString();
              var soLuongDonHangDoanhNghiep = resultDoanhNghiep._doc.SoDonHang;
              if (
                soLuongDonHangDoanhNghiep > 0 &&
                ngayThucTai <= ngayHetHanGoiDoanhNghiep
              ) {
                soLuongDonHangDoanhNghiep = soLuongDonHangDoanhNghiep - 1;
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
                  error: "Gói khách hàng không được sử dụng vì không hợp lệ",
                });
              } else {
                res.status(200).send({
                  data: "null",
                  error: "Gói vận chuyển hết hiệu lực vui lòng chọn gói khác",
                });
              }
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
              console.log(chiPhiVanChuyen);
              update.TongChiPhi = String(chiPhiVanChuyen);
              var resultOrder = await Order.create(update);
              var idDonHangMoiTao = resultOrder._doc._id;
              var resultPayment;

              var ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

              var dateFormat = require("dateformat");

              var tmnCode = "JCO3SG7X";
              var secretKey = "BKPYNKKKBEAZCHZFHLIXKMXXCODHEVSU";
              var vnpUrl = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
              var returnUrl = "http://54.255.93.14/me/vnpay_return";
              var id = `${idDonHangMoiTao}`;

              var date = new Date();

              var createDate = dateFormat(date, "yyyymmddHHmmss");
              var orderId = dateFormat(date, "HHmmss");
              var amount = chiPhiVanChuyen.toString();
              var bankCode = "NCB";

              var orderInfo = id;
              var orderType = "payment";
              var locale = "vn";

              var currCode = "VND";
              var vnp_Params = {};
              vnp_Params["vnp_Version"] = "2";
              vnp_Params["vnp_Command"] = "pay";
              vnp_Params["vnp_TmnCode"] = tmnCode;
              // vnp_Params['vnp_Merchant'] = ''
              vnp_Params["vnp_Locale"] = locale;
              vnp_Params["vnp_CurrCode"] = currCode;
              vnp_Params["vnp_TxnRef"] = orderId;
              vnp_Params["vnp_OrderInfo"] = orderInfo;
              vnp_Params["vnp_OrderType"] = orderType;
              vnp_Params["vnp_Amount"] = amount * 100;
              vnp_Params["vnp_ReturnUrl"] = returnUrl;
              vnp_Params["vnp_IpAddr"] = ipAddr;
              vnp_Params["vnp_CreateDate"] = createDate;
              if (bankCode !== null && bankCode !== "") {
                vnp_Params["vnp_BankCode"] = bankCode;
              }

              vnp_Params = sortObject(vnp_Params);

              var querystring = require("qs");
              var signData =
                secretKey +
                querystring.stringify(vnp_Params, { encode: false });

              var sha256 = require("sha256");

              var secureHash = sha256(signData);

              vnp_Params["vnp_SecureHashType"] = "SHA256";
              vnp_Params["vnp_SecureHash"] = secureHash;
              vnpUrl +=
                "?" + querystring.stringify(vnp_Params, { encode: true });
              resultPayment = vnpUrl;
              var soLuongDonHangDoanhNghiep = resultDoanhNghiep._doc.SoDonHang;
              if (
                soLuongDonHangDoanhNghiep > 0 &&
                ngayThucTai <= ngayHetHanGoiDoanhNghiep
              ) {
                soLuongDonHangDoanhNghiep = soLuongDonHangDoanhNghiep - 1;
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
                  error: "Gói vận chuyển hết hiệu lực vui lòng chọn gói khác",
                });
              }
              //         }
              //       }
              //     }
              //   }
              // );
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
      console.log(error);
      res.status(500).send({
        error: error,
      });
    }
  }

  // Post customers/create_payment_vnpayurl_package
  async CreatePaymentVnpayurlPackage(req, res, next) {
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
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        console.log(roleDT);
        if (roleDT == "KHACHHANG") {
          var resultGoiDichVu = await GoiKhachHang.findOne({
            _id: update.id_GoiDichVu,
          });
          if (resultGoiDichVu != null) {
            update.TenGoi = resultGoiDichVu._doc.TenDichVuKhachHang;
            update.ChiPhi = resultGoiDichVu._doc.ChiPhi;
            var resultKH = await KhachHang.findOne({ id_account: _id });
            update.id_KhachHang = resultKH._doc._id;
            var chiPhi = parseFloat(update.ChiPhi);
            var resultBillPackage = await DonHangDichVu.create(update);
            var idDonHangMoiTao = resultBillPackage._doc._id;
            var resultPayment;
            var ngayHienTai = new Date();
            ngayHienTai.setDate(ngayHienTai.getDate());
            var ngayHetHan = resultKH._doc.NgayHetHan;
            var soDonHangHienTai = resultKH._doc.SoDonHang;
            if (ngayHienTai <= ngayHetHan && soDonHangHienTai > 0) {
              res.status(400).send({
                data: "",
                error: "Gói của bạn vẫn còn hiệu lực",
              });
            } else {
              var ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

              var dateFormat = require("dateformat");

              var tmnCode = "JCO3SG7X";
              var secretKey = "BKPYNKKKBEAZCHZFHLIXKMXXCODHEVSU";
              var vnpUrl = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
              var returnUrl = "http://54.255.93.14/me/vnpay_return_package";

              var date = new Date();

              var createDate = dateFormat(date, "yyyymmddHHmmss");
              var orderId = dateFormat(date, "HHmmss");
              var amount = chiPhi.toString();
              var bankCode = "NCB";
              var id = `${idDonHangMoiTao}`;
              var orderInfo = id;
              var orderType = "payment";
              var locale = "vn";

              var currCode = "VND";
              var vnp_Params = {};
              vnp_Params["vnp_Version"] = "2";
              vnp_Params["vnp_Command"] = "pay";
              vnp_Params["vnp_TmnCode"] = tmnCode;
              // vnp_Params['vnp_Merchant'] = ''
              vnp_Params["vnp_Locale"] = locale;
              vnp_Params["vnp_CurrCode"] = currCode;
              vnp_Params["vnp_TxnRef"] = orderId;
              vnp_Params["vnp_OrderInfo"] = orderInfo;
              vnp_Params["vnp_OrderType"] = orderType;
              // id don
              vnp_Params["vnp_Amount"] = amount * 100;
              vnp_Params["vnp_ReturnUrl"] = returnUrl;
              vnp_Params["vnp_IpAddr"] = ipAddr;
              vnp_Params["vnp_CreateDate"] = createDate;
              if (bankCode !== null && bankCode !== "") {
                vnp_Params["vnp_BankCode"] = bankCode;
              }

              vnp_Params = sortObject(vnp_Params);

              var querystring = require("qs");
              var signData =
                secretKey +
                querystring.stringify(vnp_Params, { encode: false });

              var sha256 = require("sha256");

              var secureHash = sha256(signData);

              vnp_Params["vnp_SecureHashType"] = "SHA256";
              vnp_Params["vnp_SecureHash"] = secureHash;
              vnpUrl +=
                "?" + querystring.stringify(vnp_Params, { encode: true });
              resultPayment = vnpUrl;
              res.status(200).send({
                data: resultPayment,
                error: "null",
              });
            }
          } else {
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
  //get customers/show_diachi
  async showDiaChi(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "KHACHHANG") {
          var resultAddr = await DiaChi.find({ id_account: _id });
          res.status(200).send({
            data: resultAddr,
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
        data: "",
      });
    }
  }

  //get show-order
  async ShowOrder(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = { TrangThai: "Đã Nhận Hàng" };
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "KHACHHANG") {
          var user = await KhachHang.findOne({ id_account: _id });
          var idKhachHang = user._doc._id;
          var resultOrder = await Order.find({ id_KhachHang: idKhachHang });
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
        data: "",
        error: error,
      });
    }
  }
  //Get customers/show-shipping-package
  async ShowShippingPackage(req, res, next) {
    try {
      const shippingPackage = await GoiVanChuyen.find({ Status: "ACTIVE" });
      var mangShippingPackage = [];
      mangShippingPackage = shippingPackage;
      if (mangShippingPackage.length != 0) {
        for (let i = 0; i < mangShippingPackage.length; i++) {
          var _idLoaiHangHoa = mangShippingPackage[i]._doc.IdLoaiHangHoa;
          var productType = await LoaiHangHoa.findOne({ _id: _idLoaiHangHoa });
          var tenHangHoa = productType._doc.LoaiHangHoa;
          mangShippingPackage[i]._doc.LoaiHangHoa = tenHangHoa;
        }
        res.status(200).send({
          data: mangShippingPackage,
        });
      } else {
        res.status(200).send({
          data: mangShippingPackage,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  //Get customers/show-discount-user
  async ShowDiscount(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var resultTK = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (resultTK != null) {
        var resultUser = await KhachHang.findOne({
          id_account: resultTK._doc._id,
        });
        var ngayHienTai = new Date();
        ngayHienTai.setDate(ngayHienTai.getDate());
        console.log(resultUser);
        var ngayHetHan = resultUser._doc.NgayHetHan;
        var soDonHangHienTai = resultUser._doc.SoDonHang;
        var giamGia = 0;
        if (ngayHetHan >= ngayHienTai && soDonHangHienTai > 0) {
          giamGia = resultUser._doc.GiamGia;
        } else {
          giamGia = 0;
        }

        res.status(200).send({
          data: giamGia,
        });
      } else {
        res.status(404).send({
          data: "",
          error: "Not found user!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }
}

module.exports = new KhachHangController();
