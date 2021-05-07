
require("dotenv").config();
const TaiKhoan = require("../Models/TaiKhoan");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const { verifyToken } = require("./index");
const DoanhNghiep = require("../Models/DoanhNghiep");
const KhachHang = require("../Models/KhachHang");
const LoaiHangHoaSanPham = require("../Models/LoaiHangHoa");
const nodemailer = require("nodemailer");


class AdminController {
  //Post admin/create-goikhachhang
  async creategoiKH(req, res, next) {
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    if (result != null) {
      const roleDT = result.Role;
      if (roleDT == "ADMIN") {
        var resultKH = await GoiKhachHang.create(req.body);
        res.status(200).send({
          data: resultKH,
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
  //Post admin/create-goidoanhnghiep
  async creategoiDN(req, res, next) {
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    if (result != null) {
      const roleDT = result.Role;
      if (roleDT == "ADMIN") {
        var resultDN = await GoiDoanhNghiep.create(req.body);
        res.status(200).send({
          data: resultDN,
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

  //Put admin/update-goidoanhnghiep
  async updategoiDN(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const {
        TenGoi,
        ThongTin,
        ChiPhi,
        HanSuDung,
        SoDonHang,
        idGoiDoanhNghiep,
      } = req.body;
      var updateValue = { TenGoi, ThongTin, ChiPhi, HanSuDung, SoDonHang };
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var check = await GoiDoanhNghiep.findOne({ _id: idGoiDoanhNghiep });
          if (check != null) {
            var resultDN = await GoiDoanhNghiep.findOneAndUpdate(
              { _id: idGoiDoanhNghiep },
              updateValue,
              {
                new: true,
              }
            );
            res.status(200).send({
              data: resultDN,
              error: "null",
            });
          } else {
            res.status(400).send({
              data: "",
              error: "No Package",
            });
          }
        } else {
          res.status(400).send({
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

  //Put admin/update-goikhachhang
  async updategoiKH(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const {
        TenDichVuKhachHang,
        ThongTin,
        KhoiLuongToiDa,
        ChiPhi,
        HanSuDung,
        SoDonHang,
        GiamGia,
        idGoiKhachHang,
      } = req.body;
      var updateValue = {
        TenDichVuKhachHang,
        ThongTin,
        KhoiLuongToiDa,
        ChiPhi,
        HanSuDung,
        SoDonHang,
        GiamGia,
      };
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var check = await GoiKhachHang.findOne({ _id: idGoiKhachHang });
          if (check != null) {
            var resultKH = await GoiKhachHang.findOneAndUpdate(
              { _id: idGoiKhachHang },
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
            res.status(400).send({
              data: "",
              error: "No Package",
            });
          }
        } else {
          res.status(400).send({
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
  // Delete admin/deleted-goikhachhang
  async deleteGoiKH(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const { DeleteAt, idGoiKhachHang } = req.body;
      var updateValue = { DeleteAt: "True" };
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var check = await GoiKhachHang.findOne({ _id: idGoiKhachHang });
          if (check != null) {
            var resultKH = await GoiKhachHang.findOneAndUpdate(
              { _id: idGoiKhachHang },
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
            res.status(400).send({
              data: "",
              error: "No Package",
            });
          }
        } else {
          res.status(400).send({
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
  // Delete admin/deleted-goidoanhnghiep
  async deleteGoiDN(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const { DeleteAt, idGoiDoanhNghiep } = req.body;
      var updateValue = { DeleteAt: "True" };
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var check = await Order.findOne({ _id: idGoiDoanhNghiep });
          if (check != null) {
            var resultKH = await GoiDoanhNghiep.findOneAndUpdate(
              { _id: idGoiDoanhNghiep },
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
            res.status(400).send({
              data: "",
              error: "No Package",
            });
          }
        } else {
          res.status(400).send({
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
  //Put admin/confirm-doanhnghiep
  async DuyetDoanhNghiep(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const { idDoanhNghiep } = req.body;
      var updateValue = { idDoanhNghiep };
      updateValue = { TrangThai: "ACTIVE" };
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var check = await DoanhNghiep.findOne({ _id: idDoanhNghiep });
          if (check != null) {
            var EmailDN = check.Email;
            var smtpTransport = nodemailer.createTransport({
              service: "gmail", //smtp.gmail.com  //in place of service use host...
              secure: false, //true
              port: 25, //465
              auth: {
                user: process.env.EmailAdmin,
                pass: process.env.PasswordAdmin,
              },
              tls: {
                rejectUnauthorized: false,
              },
            });
            var mailOptions = {
              to: EmailDN,
              from: process.env.EmailAdmin,
              subject: "Enterprise Active",
              text: 'Tài khoản doanh nghiệp của bạn đã được kích hoạt.',
            };
             smtpTransport.sendMail(mailOptions, async function (error, response) {
              if (error) {
                console.log(error);
                res.status(400).send({
                  data: "null",
                  error: "Gửi không thành công",
                });
              } else {
                var resultKH = await DoanhNghiep.findOneAndUpdate(
                  { _id: idDoanhNghiep },
                  updateValue,
                  {
                    new: true,
                  }
                );
                res.status(200).send({
                  Data: resultKH,
                  Success: "Đã gửi Email thành công",
                  error: "null",
                });
              }
            });
          } else {
            res.status(400).send({
              data: "",
              error: "No Enterpriese",
            });
          }
        } else {
          res.status(400).send({
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

  //Get admin/show-customers
  async ShowCustomers(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var resultKH = await KhachHang.find({});
          res.status(200).send({
            data: resultKH,
            error: "null",
          });
        } else {
          res.status(404).send({
            data: "",
            error: "No Authorization",
          });
        }
      } else {
        res.status(404).send({
          data: "",
          error: "No Account",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }

  //put admin/edit-custommer
  async EditProfileCustomer(req, res, next) {
    try {
      const { Ten, SoDienThoai, DiaChi } = req.body;
      var updateValue = { SoDienThoai, DiaChi };
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var idKH = req.body.idKhachHang;
          updateValue.TenKhachHang = Ten;
          var resultKH = await KhachHang.findOneAndUpdate(
            { _id: idKH },
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
          res.status(404).send({
            data: "",
            error: "No Authorization",
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
  //Get admin/show-enterprises
  async ShowEnterprises(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var resultDN = await DoanhNghiep.find({});
          res.status(200).send({
            data: resultDN,
            error: "null",
          });
        } else {
          res.status(404).send({
            data: "",
            error: "No Authorization",
          });
        }
      } else {
        res.status(404).send({
          data: "",
          error: "No Account",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }

  //put admin/edit-enterprises
  async EditProfileEnterprise(req, res, next) {
    try {
      const { Ten, SoDienThoai, DiaChi } = req.body;
      var updateValue = { SoDienThoai, DiaChi };
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var idKH = req.body.idDoanhNghiep;
          updateValue.TenDoanhNghiep = Ten;
          var resultDN = await DoanhNghiep.findOneAndUpdate(
            { _id: idKH },
            updateValue,
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
            error: "No Authorization",
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

   //Post admin/create-product-type
   async CreateProductType(req, res, next) {
    try
    {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var resultLoaiSanPham = await LoaiHangHoaSanPham.create(req.body);
          res.status(200).send({
            data: resultLoaiSanPham,
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
    catch (error)
    {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }

     //Put admin/update-product-type
     async UpdateProductType(req, res, next) {
      try
      {
        const _idLoaiSanPham = req.body.idLoaiSanPham;
        const {LoaiHangHoa,SoKy} = req.body;
        const token = req.get("Authorization").replace("Bearer ", "");
        const _id = await verifyToken(token);
        var updateValue = {
          LoaiHangHoa,
          SoKy,
        };
        var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
        if (result != null) {
          const roleDT = result.Role;
          if (roleDT == "ADMIN") { 
            var resultLoaiSanPham = await LoaiHangHoaSanPham.findOneAndUpdate(
              { _id: _idLoaiSanPham},
              updateValue,
              {
                new: true,
              }
            );
            res.status(200).send({
              data: resultLoaiSanPham,
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
      catch (error)
      {
        res.status(500).send({
          data: "",
          error: error,
        });
      }
    }
     //Delete admin/delete-product-type
     async DeleteProductType(req, res, next) {
      try
      {
        const _idLoaiSanPham = req.body.idLoaiSanPham;
        const token = req.get("Authorization").replace("Bearer ", "");
        const _id = await verifyToken(token);
        var updateValue = {
          Status: "INACTIVE"
        };
        var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
        if (result != null) {
          const roleDT = result.Role;
          if (roleDT == "ADMIN") { 
            var resultLoaiSanPham = await LoaiHangHoaSanPham.findOneAndUpdate(
              { _id: _idLoaiSanPham},
              updateValue,
              {
                new: true,
              }
            );
            res.status(200).send({
              data: resultLoaiSanPham,
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
      catch (error)
      {
        res.status(500).send({
          data: "",
          error: error,
        });
      }
    }

}

module.exports = new AdminController();
