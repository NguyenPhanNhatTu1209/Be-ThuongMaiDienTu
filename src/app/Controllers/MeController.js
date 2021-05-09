const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const DiaChi = require("../Models/DiaChi");
const Order = require("../Models/Order");
const PaypalModel = require("../Models/Paypal");
const DonHangDichVu = require("../Models/DonHangDichVu");
const LoaiHangHoaSanPham = require("../Models/LoaiHangHoa");
const paypal = require("paypal-rest-sdk");
const bcrypt = require("bcrypt");

const { createToken, verifyToken } = require("./index");
const Paypal = require("../Models/Paypal");
class MeController {
  //get me/information / get || post put delete
  async information(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id,Status:"ACTIVE" }); //muc dich la lay role
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
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
  //put me/edit-profile
  async editProfile(req, res, next) {
    const { Ten, SoDienThoai, DiaChi } = req.body;
    var updateValue = { SoDienThoai, DiaChi };
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var result = await TaiKhoan.findOne({ _id ,Status:"ACTIVE"}); //muc dich la lay role
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

  //Put me/change-password
  async ChangePassword(req, res, next) {
    try {
      const passwordOld = req.body.PasswordOld;
      const passwordNew = req.body.PasswordNew;
      const confirmPassword = req.body.ConfirmPassword;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id ,Status:"ACTIVE"});
      if (result != null) {
        const isEqualPassword = await bcrypt.compare(
          passwordOld,
          result.Password
        );
        if (isEqualPassword) {
          if (passwordNew == confirmPassword) {
            const hashPassword = await bcrypt.hash(passwordNew, 5);
            result.Password = hashPassword;
            result.save();
            res.status(200).send({
              Success: "Change Password Success",
            });
          } else {
            res.status(400).send({
              error: "New password is not same same password confirm",
            });
          }
        } else {
          res.status(400).send({
            error: " Wrong Old Password ",
          });
        }
      }
    } catch (error) {
      res.status(500).send({
        error: error,
      });
    }
  }

  //get me/show-product-type
  async ShowProductType(req, res, next) {
    try {
      var result = await LoaiHangHoaSanPham.find({ Status: "ACTIVE" });
      if (result != null) {
        res.status(200).send({
          data: result,
          error: "null",
        });
      } else {
        res.status(404).send({
          data: "",
          error: "Not found product type",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }

  async PaymentSuccess(req, res, next) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const price = req.query.price;
    const idDonHang = req.query.idDonHang;
    var update = { ThanhToan: "Đã Thanh Toán" };
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: `${price}`,
          },
        },
      ],
    };
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          res.send("Payment Fail");
        } else {
          var resultDonHang = await Order.findOneAndUpdate(
            { _id: idDonHang },
            update,
            {
              new: true,
            }
          );

          await PaypalModel.create({
            id_Order: idDonHang,
            Transaction: price,
            id_Paypal: payment.transactions[0].related_resources[0].sale.id,
          });

          res.send({
            message: "Success",
            paymentId: payment.transactions[0].related_resources[0].sale.id,
            id_Order: idDonHang,
          });
        }
      }
    );
  }
  //get me/successPackageBill
  async PaymentSuccessBillPackage(req, res, next) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const price = req.query.price;
    const idDonHang = req.query.idDonHang;
    var update = { ThanhToan: "Đã Thanh Toán" };
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: `${price}`,
          },
        },
      ],
    };
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          res.send("Payment Fail");
        } else {
          var donHangDichVu = await DonHangDichVu.findOneAndUpdate(
            { _id: idDonHang },
            update,
            {
              new: true,
            }
          );
          var resultDN = await DoanhNghiep.findOne({
            _id: donHangDichVu._doc.id_DoanhNghiep,
          });
          if (resultDN == null) {
            var resultGoiDV = await GoiKhachHang.findOne({
              DeleteAt: "False",
              _id: donHangDichVu._doc.id_GoiDichVu,
            });
            const {
              TenDichVuKhachHang,
              KhoiLuongToiDa,
              SoDonHang,
              GiamGia,
            } = resultGoiDV;
            var soNgay = resultGoiDV.HanSuDung;
            // Create new Date instance
            var date = new Date();
            // Add a day
            date.setDate(date.getDate() + soNgay);
            const updateKH = {
              TenDichVuKhachHang,
              KhoiLuongToiDa,
              NgayHetHan: date,
              SoDonHang,
              GiamGia,
            };
            var resultKH = await KhachHang.findOne({
              _id: donHangDichVu._doc.id_KhachHang,
            });
            await KhachHang.findOneAndUpdate(
              { _id: donHangDichVu._doc.id_KhachHang },
              updateKH,
              {
                new: true,
              }
            );
          } else {
            var resultGoiDV = await GoiDoanhNghiep.findOne({
              DeleteAt: "False",
              _id: donHangDichVu._doc.id_GoiDichVu,
            });
            const { TenGoi, SoDonHang } = resultGoiDV;
            var soNgay = resultGoiDV.HanSuDung;
            // Create new Date instance
            var date = new Date();
            // Add a day
            date.setDate(date.getDate() + soNgay);
            const updateDN = { TenGoi, NgayHetHan: date, SoDonHang };
            await DoanhNghiep.findOneAndUpdate(
              { _id: donHangDichVu._doc.id_DoanhNghiep },
              updateDN,
              {
                new: true,
              }
            );
          }
          
          res.send({
            message: "Success",
            payment,
          });
        }
      }
    );
  }
  async CancelPaymentBillPackage(req, res, next) {
    res.send("Payment is canceled");
  }
  async CancelPayment(req, res, next) {
    res.send("Payment is canceled");
  }
  //post me/refund
  async RefundPayment(req, res, next) {
    const {id_Order} = req.body;
    const resultPaypal = await PaypalModel.findOne({id_Order});
    const data = {
      amount: {
        total: `${resultPaypal.Transaction}`,
        currency: "USD",
      },
    };

    paypal.sale.refund(resultPaypal.id_Paypal, data, function (error, refund) {
      if (error) {
        res.status(400).send({
          msg: "Refund fail!",
          data: "",
          error: error,
        });
      } else {
        res.status(200).send({
          msg: "Refund success!",
          data: refund,
          error: "",
        });
      }
    });
  }
}
module.exports = new MeController();
