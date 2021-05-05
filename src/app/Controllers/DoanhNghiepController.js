const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiVanChuyen = require("../Models/GoiVanChuyen");
const TaiKhoan = require("../Models/TaiKhoan");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const { verifyToken,paymentMethodPackage,FormatDollar } = require("../Controllers/index");
const Order = require("../Models/Order");
const DonHangDichVu = require("../Models/DonHangDichVu");

const { get } = require("../../routes/enterprises");

class DoanhNghiepController {
  //GET enterprises/show-goidoanhnghiep
  async showGoiDN(req, res, next) {
    var result = await GoiDoanhNghiep.find({ DeleteAt: "False" });
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
  async CreateShippingPackage(req, res, next) {
    try {
      var createData = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id });
      if (userDb.Role == "DOANHNGHIEP") {
        createData.IdCongTy = (
          await DoanhNghiep.findOne({ id_account: _id })
        )._id;
        const resultDoanhNghiep = await DoanhNghiep.findOne({_id: createData.IdCongTy});
        var trangThaiDoanhNghiep = resultDoanhNghiep._doc.TrangThai;
        if (trangThaiDoanhNghiep == "ACTIVE") {
          const shippingPackage = await GoiVanChuyen.create(createData);
          res.status(200).send({
            data: shippingPackage,
            error: "",
          });
        }
        else
        {
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
      const userDb = await TaiKhoan.findOne({ _id });
      if (userDb.Role == "DOANHNGHIEP") {
        createData.IdCongTy = (
          await DoanhNghiep.findOne({ id_account: _id })
        )._id;
        const resultDoanhNghiep = await DoanhNghiep.findOne({_id: createData.IdCongTy});
        var trangThaiDoanhNghiep = resultDoanhNghiep._doc.TrangThai;
        if(trangThaiDoanhNghiep=="ACTIVE")
        {
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
        }
        else
        {
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
      const userDb = await TaiKhoan.findOne({ _id });
      if (userDb.Role == "DOANHNGHIEP") {
        const resultDoanhNghiep = await DoanhNghiep.findOne({id_account: _id});
        var trangThaiDoanhNghiep = resultDoanhNghiep._doc.TrangThai;
        if(trangThaiDoanhNghiep=="ACTIVE")
        {
          const shippingPackage = await GoiVanChuyen.findOneAndUpdate(
            { _id: idPackage },
            { Status: "DELETED" },
            { new: true }
          );
          res.status(200).send({
            data: shippingPackage,
            error: "Package is deleted",
          });
        }
        else
        {
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
        error: "",
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
      const IdCongTy = (await DoanhNghiep.findOne({ id_account: _id }))._id;
      if (IdCongTy != null) {
        const shippingPackage = await GoiVanChuyen.find({
          IdCongTy,
          Status: "ACTIVE",
        });
        res.status(200).send({
          data: shippingPackage,
          error: "",
        });
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
  //Get enterprises/show-order-by-customers

  async ShowOrderByCustomers(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const IdCongTy = (await DoanhNghiep.findOne({ id_account: _id }))._id;
      if (IdCongTy != null) {
        const donHang = await Order.find({
          id_DoanhNghiep: IdCongTy,
        });
        res.status(200).send({
          data: donHang,
          error: "",
        });
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


  //Put enterprises/update-delivering-order

  async UpdateDeliveringOrder(req, res, next) {
    try {
      var idDonHangKhachHang = req.body.idDonHang;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var update = { TrangThai: "Đang Giao" };
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      const IdCongTy = (await DoanhNghiep.findOne({ id_account: _id }))._id;
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var resultOrder = await Order.findOneAndUpdate(
            { _id: idDonHangKhachHang, id_DoanhNghiep: IdCongTy},
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
        var update = { TrangThai: "Đã Giao" };
        var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
        const IdCongTy = (await DoanhNghiep.findOne({ id_account: _id }))._id;
        if (result != null) {
          const roleDT = result.Role;
          if (roleDT == "DOANHNGHIEP") {
            var resultOrder = await Order.findOneAndUpdate(
              { _id: idDonHangKhachHang, id_DoanhNghiep: IdCongTy},
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
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "DOANHNGHIEP") {
          var resultGoiDichVu =  await GoiDoanhNghiep.findOne({_id: update.id_GoiDichVu,DeleteAt: "False"});
          if(resultGoiDichVu != null)
          {
            update.TenGoi = resultGoiDichVu._doc.TenGoi;
            update.ChiPhi = resultGoiDichVu._doc.ChiPhi;
            var resultDN =  await DoanhNghiep.findOne({id_account: _id });
            update.id_DoanhNghiep = resultDN._doc._id;
            var chiPhi = parseFloat(update.ChiPhi);
            var tienDo = chiPhi / 23050;
            var formatDollar = FormatDollar(tienDo);
            var resultBillPackage = await DonHangDichVu.create(update);
            var idDonHangMoiTao = resultBillPackage._doc._id;
            var resultPayment;
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

module.exports = new DoanhNghiepController();
