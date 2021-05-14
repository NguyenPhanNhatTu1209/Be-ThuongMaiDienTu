const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiVanChuyen = require("../Models/GoiVanChuyen");
const TaiKhoan = require("../Models/TaiKhoan");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const LoaiHangHoaSanPham = require("../Models/LoaiHangHoa");
const {
  verifyToken,
  paymentMethodPackage,
  FormatDollar,
} = require("../Controllers/index");
const Order = require("../Models/Order");
const DonHangDichVu = require("../Models/DonHangDichVu");

const { get } = require("../../routes/enterprises");

class DoanhNghiepController {
  //GET enterprises/show-goidoanhnghiep (show all package )
  async showGoiDN(req, res, next) {
    var result = await GoiDoanhNghiep.find({ DeleteAt: "False" });
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
  }
  async CreateShippingPackage(req, res, next) {
    try {
      var createData = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id, Status: "ACTIVE" });
      if (userDb.Role == "DOANHNGHIEP") {
        createData.IdCongTy = (
          await DoanhNghiep.findOne({ id_account: _id })
        )._id;
        const resultDoanhNghiep = await DoanhNghiep.findOne({
          _id: createData.IdCongTy,
        });
        var trangThaiDoanhNghiep = resultDoanhNghiep._doc.TrangThai;
        if (trangThaiDoanhNghiep == "ACTIVE") {
          const shippingPackage = await GoiVanChuyen.create(createData);
          res.status(200).send({
            data: shippingPackage,
            error: "",
          });
        } else {
          res.status(400).send({
            data: "",
            error: "Enterprise No Active",
          });
        }
      } else {
        res.status(400).send({
          data: "",
          error: "User is not DoanhNghiep Role",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  async UpdateShippingPackage(req, res, next) {
    try {
      var createData = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const idPackageOld = req.body.idPackageOld;
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id, Status: "ACTIVE" });
      if (userDb.Role == "DOANHNGHIEP") {
        createData.IdCongTy = (
          await DoanhNghiep.findOne({ id_account: _id })
        )._id;
        const resultDoanhNghiep = await DoanhNghiep.findOne({
          _id: createData.IdCongTy,
        });
        var trangThaiDoanhNghiep = resultDoanhNghiep._doc.TrangThai;
        if (trangThaiDoanhNghiep == "ACTIVE") {
          const shippingPackageOld = await GoiVanChuyen.findOneAndUpdate(
            { _id: idPackageOld, Status: "ACTIVE" },
            { Status: "INACTIVE" }
          );
          if (shippingPackageOld != null) {
            const shippingPackageNew = await GoiVanChuyen.create(createData);
            res.status(200).send({
              data: shippingPackageNew,
              error: "",
            });
          } else {
            res.status(404).send({
              data: "",
              error: "Not found Package",
            });
          }
        } else {
          res.status(400).send({
            data: "",
            error: "Enterprise No Active",
          });
        }
      } else {
        res.status(400).send({
          data: "",
          error: "User is not DoanhNghiep Role",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  async DeleteShippingPackage(req, res, next) {
    try {
      var { idPackage } = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id, Status: "ACTIVE" });
      if (userDb.Role == "DOANHNGHIEP") {
        const resultDoanhNghiep = await DoanhNghiep.findOne({
          id_account: _id,
        });
        var trangThaiDoanhNghiep = resultDoanhNghiep._doc.TrangThai;
        if (trangThaiDoanhNghiep == "ACTIVE") {
          const shippingPackage = await GoiVanChuyen.findOneAndUpdate(
            { _id: idPackage },
            { Status: "DELETED" },
            { new: true }
          );
          res.status(200).send({
            data: shippingPackage,
            error: "Package is deleted",
          });
        } else {
          res.status(400).send({
            data: "",
            error: "Enterprise No Active",
          });
        }
      } else {
        res.status(400).send({
          data: "",
          error: "User is not DoanhNghiep Role",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }
  //Get enterprises/show-shipping-package
  async ShowShippingPackage(req, res, next) {
    try {
      const shippingPackage = await GoiVanChuyen.find({ Status: "ACTIVE" });
      res.status(200).send({
        data: shippingPackage,
      });
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }
  //Get enterprises/show-shipping-package-by-enterprise
  async ShowShippingPackageByEnterprise(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const IdCongTy = (
        await DoanhNghiep.findOne({ id_account: _id, TrangThai: "ACTIVE" })
      )._id;
      if (IdCongTy != null) {
        const shippingPackage = await GoiVanChuyen.find({
          IdCongTy,
          Status: "ACTIVE",
        });
        res.status(200).send({
          data: shippingPackage,
        });
      } else {
        res.status(400).send({
          data: "",
          error: "Not Enterprise",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }
  //Get enterprises/show-order-by-customers

  async ShowOrderByCustomers(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const IdCongTy = (
        await DoanhNghiep.findOne({ id_account: _id, TrangThai: "ACTIVE" })
      )._id;
      if (IdCongTy != null) {
        const donHang = await Order.find({
          id_DoanhNghiep: IdCongTy,
        });
        res.status(200).send({
          data: donHang,
        });
      } else {
        res.status(400).send({
          data: "",
          error: "Enterprise not found",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  //Put enterprises/update-delivering-order

  async UpdateDeliveringOrder(req, res, next) {
    try {
      var idDonHangKhachHang = req.body.idDonHang;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = { TrangThai: "Đang Giao" };
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      const IdCongTy = (
        await DoanhNghiep.findOne({ id_account: _id, TrangThai: "ACTIVE" })
      )._id;
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var resultOrder = await Order.findOneAndUpdate(
            { _id: idDonHangKhachHang, id_DoanhNghiep: IdCongTy },
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
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  //Put enterprises/update-delivered-order

  async UpdateDeliveredOrder(req, res, next) {
    try {
      var idDonHangKhachHang = req.body.idDonHang;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = { TrangThai: "Đã Nhận Hàng" };
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      const IdCongTy = (await DoanhNghiep.findOne({ id_account: _id }))._id;
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var resultOrder = await Order.findOneAndUpdate(
            { _id: idDonHangKhachHang, id_DoanhNghiep: IdCongTy },
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
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  // Post enterprises/create-bill-package
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
        if (roleDT == "DOANHNGHIEP") {
          var resultGoiDichVu = await GoiDoanhNghiep.findOne({
            _id: update.id_GoiDichVu,
            DeleteAt: "False",
          });
          if (resultGoiDichVu != null) {
            update.TenGoi = resultGoiDichVu._doc.TenGoi;
            update.ChiPhi = resultGoiDichVu._doc.ChiPhi;
            var resultDN = await DoanhNghiep.findOne({ id_account: _id });
            update.id_DoanhNghiep = resultDN._doc._id;
            var chiPhi = parseFloat(update.ChiPhi);
            var tienDo = chiPhi / 23050;
            var formatDollar = FormatDollar(tienDo);
            var resultBillPackage = await DonHangDichVu.create(update);
            var idDonHangMoiTao = resultBillPackage._doc._id;
            var resultPayment;
            var ngayHienTai = new Date();
            ngayHienTai.setDate(ngayHienTai.getDate());
            var ngayHetHan = resultDN._doc.NgayHetHan;
            var soDonHangHienTai = resultDN._doc.SoDonHang;
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

  //Get enterprises/show-order-in-one-week-by-enterprise
  async ShowOrderByOneWeek(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var idCongTy = await (
            await DoanhNghiep.findOne({ id_account: result._doc._id })
          )._id;
          var ngayHienTai = new Date();
          ngayHienTai.setDate(ngayHienTai.getDate());
          var ngayXet = new Date();
          ngayXet.setDate(ngayXet.getDate() - 7);
          var result = {
            ngay1: {
              donhang: 0,
              doanhthu: "",
            },
            ngay2: {
              donhang: 0,
              doanhthu: "",
            },
            ngay3: {
              donhang: 0,
              doanhthu: "",
            },
            ngay4: {
              donhang: 0,
              doanhthu: "",
            },
            ngay5: {
              donhang: 0,
              doanhthu: "",
            },
            ngay6: {
              donhang: 0,
              doanhthu: "",
            },
            ngay7: {
              donhang: 0,
              doanhthu: "",
            },
          };
          var thongKeDonHang = await Order.find({
            id_DoanhNghiep: idCongTy,
            updatedAt: { $gte: ngayXet },
            ThanhToan: "Đã Thanh Toán",
            TrangThai: "Đã Nhận Hàng",
          });
          var tongTien = 0;

          var soNgayHienTai = ngayHienTai.getDate();
          var soDonHangNgay1 = 0;
          var soDonHangNgay2 = 0;
          var soDonHangNgay3 = 0;
          var soDonHangNgay4 = 0;
          var soDonHangNgay5 = 0;
          var soDonHangNgay6 = 0;
          var soDonHangNgay7 = 0;
          var soTienNgay1 = 0;
          var soTienNgay2 = 0;
          var soTienNgay3 = 0;
          var soTienNgay4 = 0;
          var soTienNgay5 = 0;
          var soTienNgay6 = 0;
          var soTienNgay7 = 0;
          for (var i = 0; i < thongKeDonHang.length; i++) {
            var chiPhi = parseFloat(thongKeDonHang[i]._doc.TongChiPhi);
            var ngay = thongKeDonHang[i]._doc.updatedAt;
            var xetSoNgay = new Date();
            xetSoNgay = Math.abs(ngayHienTai - ngay);
            const diffDays = Math.ceil(xetSoNgay / (1000 * 60 * 60 * 24));
            console.log(diffDays);
            //Ngày 1 là ngày xa nhất và ngày 7 là ngày gần với ngày thực tại nhất
            if (diffDays == 1) {
              soDonHangNgay7 = soDonHangNgay7 + 1;
              soTienNgay7 = soTienNgay7 + chiPhi;
            } else if (diffDays == 2) {
              soDonHangNgay6 = soDonHangNgay6 + 1;
              soTienNgay6 = soTienNgay6 + chiPhi;
            } else if (diffDays == 3) {
              soDonHangNgay5 = soDonHangNgay5 + 1;
              soTienNgay5 = soTienNgay5 + chiPhi;
            } else if (diffDays == 4) {
              soDonHangNgay4 = soDonHangNgay4 + 1;
              soTienNgay4 = soTienNgay4 + chiPhi;
            } else if (diffDays == 5) {
              soDonHangNgay3 = soDonHangNgay3 + 1;
              soTienNgay3 = soTienNgay3 + chiPhi;
            } else if (diffDays == 6) {
              soDonHangNgay2 = soDonHangNgay2 + 1;
              soTienNgay2 = soTienNgay2 + chiPhi;
            } else if (diffDays == 7) {
              soDonHangNgay1 = soDonHangNgay1 + 1;
              soTienNgay1 = soTienNgay1 + chiPhi;
            }
          }
          soTienNgay1 = soTienNgay1.toString();
          result.ngay1.donhang = soDonHangNgay1;
          result.ngay1.doanhthu = soTienNgay1;
          soTienNgay2 = soTienNgay2.toString();
          result.ngay2.donhang = soDonHangNgay2;
          result.ngay2.doanhthu = soTienNgay2;
          soTienNgay3 = soTienNgay3.toString();
          result.ngay3.donhang = soDonHangNgay3;
          result.ngay3.doanhthu = soTienNgay3;
          soTienNgay4 = soTienNgay4.toString();
          result.ngay4.donhang = soDonHangNgay4;
          result.ngay4.doanhthu = soTienNgay4;
          soTienNgay5 = soTienNgay5.toString();
          result.ngay5.donhang = soDonHangNgay5;
          result.ngay5.doanhthu = soTienNgay5;
          soTienNgay6 = soTienNgay6.toString();
          result.ngay6.donhang = soDonHangNgay6;
          result.ngay6.doanhthu = soTienNgay6;
          soTienNgay7 = soTienNgay7.toString();
          result.ngay7.donhang = soDonHangNgay7;
          result.ngay7.doanhthu = soTienNgay7;
          if (thongKeDonHang[0] != null) {
            res.status(200).send({
              data: result,
            });
          } else {
            res.status(404).send({
              data: "No order",
              error: "",
            });
          }
        }
      } else {
        res.status(404).send({
          data: "",
          error: "Not Autheraziton",
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

  //Get enterprises/show-order-in-three-month-by-enterprise
  async ShowOrderByThreeMonth(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var idCongTy = await (
            await DoanhNghiep.findOne({ id_account: result._doc._id })
          )._id;
          var ngayHienTai = new Date();
          ngayHienTai.setDate(ngayHienTai.getDate());
          var ngayXet = new Date();
          ngayXet.setDate(ngayXet.getDate() - 90);
          var result = {
            thangthu1: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu2: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu3: {
              donhang: 0,
              doanhthu: "",
            },
          };
          var thongKeDonHang = await Order.find({
            id_DoanhNghiep: idCongTy,
            updatedAt: { $gte: ngayXet },
            ThanhToan: "Đã Thanh Toán",
            TrangThai: "Đã Nhận Hàng",
          });
          var soDonHangThang1 = 0;
          var soDonHangThang2 = 0;
          var soDonHangThang3 = 0;
          var soTienThang1 = 0;
          var soTienThang2 = 0;
          var soTienThang3 = 0;
          var soThang = ngayHienTai.getMonth();
          var soThangThu1;
          var soThangThu2;
          if (soThang == 0) {
            soThangThu1 = 10;
            soThangThu2 = 11;
          } else if (soThang == 1) {
            soThangThu1 = 11;
            soThangThu2 = 0;
          } else {
            soThangThu1 = soThang - 2;
            soThangThu2 = soThang - 1;
          }
          for (var i = 0; i < thongKeDonHang.length; i++) {
            var chiPhi = parseFloat(thongKeDonHang[i]._doc.TongChiPhi);
            var checkThang = thongKeDonHang[i]._doc.updatedAt.getMonth();
            //Tháng thứ 1 là ngày xa nhất và Tháng thứ 3 là ngày gần với ngày thực tại nhất
            if (checkThang == soThang) {
              soDonHangThang3 = soDonHangThang3 + 1;
              soTienThang3 = soTienThang3 + chiPhi;
            } else if (checkThang == soThangThu1) {
              soDonHangThang1 = soDonHangThang1 + 1;
              soTienThang1 = soTienThang1 + chiPhi;
            } else if (checkThang == soThangThu2) {
              soDonHangThang2 = soDonHangThang2 + 1;
              soTienThang2 = soTienThang2 + chiPhi;
            }
          }
          soTienThang1 = soTienThang1.toString();
          result.thangthu1.donhang = soDonHangThang1;
          result.thangthu1.doanhthu = soTienThang1;
          soTienThang2 = soTienThang2.toString();
          result.thangthu2.donhang = soDonHangThang2;
          result.thangthu2.doanhthu = soTienThang2;
          soTienThang3 = soTienThang3.toString();
          result.thangthu3.donhang = soDonHangThang3;
          result.thangthu3.doanhthu = soTienThang3;
          if (thongKeDonHang[0] != null) {
            res.status(200).send({
              data: result,
            });
          } else {
            res.status(404).send({
              data: "No order",
              error: "",
            });
          }
        }
      } else {
        res.status(404).send({
          data: "",
          error: "Not Autheraziton",
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

  //Get enterprises/show-order-in-one-year-by-enterprise
  async ShowOrderByOneYear(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id, Status: "ACTIVE" }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var idCongTy = await (
            await DoanhNghiep.findOne({ id_account: result._doc._id })
          )._id;
          var ngayHienTai = new Date();
          ngayHienTai.setDate(ngayHienTai.getDate());
          var ngayXet = new Date();
          ngayXet.setDate(ngayXet.getDate() - 365);
          var result = {
            thangthu1: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu2: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu3: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu4: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu5: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu6: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu7: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu8: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu9: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu10: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu11: {
              donhang: 0,
              doanhthu: "",
            },
            thangthu12: {
              donhang: 0,
              doanhthu: "",
            },
          };
          var thongKeDonHang = await Order.find({
            id_DoanhNghiep: idCongTy,
            updatedAt: { $gte: ngayXet },
            ThanhToan: "Đã Thanh Toán",
            TrangThai: "Đã Nhận Hàng",
          });
          var soDonHangThang1 = 0;
          var soDonHangThang2 = 0;
          var soDonHangThang3 = 0;
          var soDonHangThang4 = 0;
          var soDonHangThang5 = 0;
          var soDonHangThang6 = 0;
          var soDonHangThang7 = 0;
          var soDonHangThang8 = 0;
          var soDonHangThang9 = 0;
          var soDonHangThang10 = 0;
          var soDonHangThang11 = 0;
          var soDonHangThang12 = 0;
          var soTienThang1 = 0;
          var soTienThang2 = 0;
          var soTienThang3 = 0;
          var soTienThang4 = 0;
          var soTienThang5 = 0;
          var soTienThang6 = 0;
          var soTienThang7 = 0;
          var soTienThang8 = 0;
          var soTienThang9 = 0;
          var soTienThang10 = 0;
          var soTienThang11 = 0;
          var soTienThang12 = 0;
          var soNam = ngayHienTai.getFullYear();
          for (var i = 0; i < thongKeDonHang.length; i++) {
            var chiPhi = parseFloat(thongKeDonHang[i]._doc.TongChiPhi);
            var checkThang = thongKeDonHang[i]._doc.updatedAt.getMonth();
            var checkNam = thongKeDonHang[i]._doc.updatedAt.getFullYear();
            if (checkThang == 0 && checkNam == soNam) {
              soDonHangThang1 = soDonHangThang1 + 1;
              soTienThang1 = soTienThang1 + chiPhi;
            } else if (checkThang == 1 && checkNam == soNam) {
              soDonHangThang2 = soDonHangThang2 + 1;
              soTienThang2 = soTienThang2 + chiPhi;
            } else if (checkThang == 2 && checkNam == soNam) {
              soDonHangThang3 = soDonHangThang3 + 1;
              soTienThang3 = soTienThang3 + chiPhi;
            } else if (checkThang == 3 && checkNam == soNam) {
              soDonHangThang4 = soDonHangThang4 + 1;
              soTienThang4 = soTienThang4 + chiPhi;
            } else if (checkThang == 4 && checkNam == soNam) {
              soDonHangThang5 = soDonHangThang5 + 1;
              soTienThang5 = soTienThang5 + chiPhi;
            } else if (checkThang == 5 && checkNam == soNam) {
              soDonHangThang6 = soDonHangThang6 + 1;
              soTienThang6 = soTienThang6 + chiPhi;
            } else if (checkThang == 6 && checkNam == soNam) {
              soDonHangThang7 = soDonHangThang7 + 1;
              soTienThang7 = soTienThang7 + chiPhi;
            } else if (checkThang == 7 && checkNam == soNam) {
              soDonHangThang8 = soDonHangThang8 + 1;
              soTienThang8 = soTienThang8 + chiPhi;
            } else if (checkThang == 8 && checkNam == soNam) {
              soDonHangThang9 = soDonHangThang9 + 1;
              soTienThang9 = soTienThang9 + chiPhi;
            } else if (checkThang == 9 && checkNam == soNam) {
              soDonHangThang10 = soDonHangThang10 + 1;
              soTienThang10 = soTienThang10 + chiPhi;
            } else if (checkThang == 10 && checkNam == soNam) {
              soDonHangThang11 = soDonHangThang11 + 1;
              soTienThang11 = soTienThang11 + chiPhi;
            } else if (checkThang == 11 && checkNam == soNam) {
              soDonHangThang12 = soDonHangThang12 + 1;
              soTienThang12 = soTienThang12 + chiPhi;
            }
          }
          soTienThang1 = soTienThang1.toString();
          result.thangthu1.donhang = soDonHangThang1;
          result.thangthu1.doanhthu = soTienThang1;
          soTienThang2 = soTienThang2.toString();
          result.thangthu2.donhang = soDonHangThang2;
          result.thangthu2.doanhthu = soTienThang2;
          soTienThang3 = soTienThang3.toString();
          result.thangthu3.donhang = soDonHangThang3;
          result.thangthu3.doanhthu = soTienThang3;
          soTienThang4 = soTienThang4.toString();
          result.thangthu4.donhang = soDonHangThang4;
          result.thangthu4.doanhthu = soTienThang4;
          soTienThang5 = soTienThang5.toString();
          result.thangthu5.donhang = soDonHangThang5;
          result.thangthu5.doanhthu = soTienThang5;
          soTienThang6 = soTienThang6.toString();
          result.thangthu6.donhang = soDonHangThang6;
          result.thangthu6.doanhthu = soTienThang6;
          soTienThang7 = soTienThang7.toString();
          result.thangthu7.donhang = soDonHangThang7;
          result.thangthu7.doanhthu = soTienThang7;
          soTienThang3 = soTienThang3.toString();
          result.thangthu3.donhang = soDonHangThang3;
          result.thangthu3.doanhthu = soTienThang3;
          soTienThang8 = soTienThang8.toString();
          result.thangthu8.donhang = soDonHangThang8;
          result.thangthu8.doanhthu = soTienThang8;
          soTienThang9 = soTienThang9.toString();
          result.thangthu9.donhang = soDonHangThang9;
          result.thangthu9.doanhthu = soTienThang9;
          soTienThang10 = soTienThang10.toString();
          result.thangthu10.donhang = soDonHangThang10;
          result.thangthu10.doanhthu = soTienThang10;
          soTienThang11 = soTienThang11.toString();
          result.thangthu11.donhang = soDonHangThang11;
          result.thangthu11.doanhthu = soTienThang11;
          soTienThang12 = soTienThang12.toString();
          result.thangthu12.donhang = soDonHangThang12;
          result.thangthu12.doanhthu = soTienThang12;
          if (thongKeDonHang[0] != null) {
            res.status(200).send({
              data: result,
            });
          } else {
            res.status(404).send({
              data: "No order",
              error: "",
            });
          }
        }
      } else {
        res.status(404).send({
          data: "",
          error: "Not Autheraziton",
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

  //get enterprise/show-product-type
  async ShowProductType(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var resultLoaiSanPham = await LoaiHangHoaSanPham.find();
          res.status(200).send({
            data: resultLoaiSanPham,
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
}

module.exports = new DoanhNghiepController();
