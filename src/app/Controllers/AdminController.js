require("dotenv").config();
const TaiKhoan = require("../Models/TaiKhoan");
const GoiKhachHang = require("../Models/GoiKhachHang");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep");
const { verifyToken } = require("./index");
const DoanhNghiep = require("../Models/DoanhNghiep");
const KhachHang = require("../Models/KhachHang");
const LoaiHangHoaSanPham = require("../Models/LoaiHangHoa");
const nodemailer = require("nodemailer");
const DonHangDichVu = require("../Models/DonHangDichVu");
const Order = require("../Models/Order");

class AdminController {
  //Post admin/create-goikhachhang
  async creategoiKH(req, res, next) {
    try {
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
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
  //Post admin/create-goidoanhnghiep
  async creategoiDN(req, res, next) {
    try {
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
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
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
            res.status(200).send({
              data: "",
              error: "No Package",
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
          var check = await GoiDoanhNghiep.findOne({ _id: idGoiDoanhNghiep });
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
              text: "Tài khoản doanh nghiệp của bạn đã được kích hoạt.",
            };
            smtpTransport.sendMail(
              mailOptions,
              async function (error, response) {
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
              }
            );
          } else {
            res.status(400).send({
              data: "",
              error: "No Enterpriese",
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
          var resultDN = await DoanhNghiep.find({}).sort({ createdAt: -1 });
          res.status(200).send({
            data: resultDN,
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
  //Get admin/show-enterprises-inactive
  async ShowEnterprisesInactive(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var resultDN = await DoanhNghiep.find({
            TrangThai: "INACTIVE",
          }).sort({ createdAt: -1 });
          res.status(200).send({
            data: resultDN,
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
  //Get admin/show-enterprises-active
  async ShowEnterprisesActive(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var resultDN = await DoanhNghiep.find({ TrangThai: "ACTIVE" });
          res.status(200).send({
            data: resultDN,
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

  //get admin/show-product-type
  async ShowProductType(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
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

  //Post admin/create-product-type
  async CreateProductType(req, res, next) {
    try {
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
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }

  //Put admin/update-product-type
  async UpdateProductType(req, res, next) {
    try {
      const _idLoaiSanPham = req.body.idLoaiSanPham;
      const { LoaiHangHoa, SoKy } = req.body;
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
            { _id: _idLoaiSanPham },
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
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
  //Put admin/delete-product-type
  async DeleteProductType(req, res, next) {
    try {
      const _idLoaiSanPham = req.body.idLoaiSanPham;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var updateValue = {
        Status: "INACTIVE",
      };
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var resultLoaiSanPham = await LoaiHangHoaSanPham.findOneAndUpdate(
            { _id: _idLoaiSanPham },
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
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
  //get admin/show-thongke-thang
  async ShowThongKeThang(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var doanhnghiep = await DoanhNghiep.find({ TrangThai: "ACTIVE" });
          var resultThongKeDN = [];
          var resultTong = {
            TongTien: "",
            TongTienGiam: "",
            TongDonHang: "",
            TongTienDuaDoanhNghiep: "",
          };
          var tienDoanhNghiep;
          var tienGiamGia;
          var soDonHang;
          var tongTienDoanhNghiep = 0;
          var tongTienGiamGia = 0;
          var tongSoDonHang = 0;
          var tienLayDoanhNghiep = 0;
          var tienDuaDoanhNghiep = 0;
          var ngayHienTai = new Date();
          ngayHienTai.setDate(ngayHienTai.getDate());
          var thanghientai = ngayHienTai.getMonth();
          for (let i = 0; i < doanhnghiep.length; i++) {
            tienDoanhNghiep = 0;
            tienGiamGia = 0;
            soDonHang = 0;
            tienLayDoanhNghiep = 0;
            tienDuaDoanhNghiep = 0;
            var IDDoanhNgiep = doanhnghiep[i]._doc._id;
            var donHang = await Order.find({
              id_DoanhNghiep: IDDoanhNgiep,
              $or: [{ ThanhToan: "PayPal" }, { ThanhToan: "VnPay" }],
              TrangThai: "Đã Nhận Hàng",
            });
            var updateDN = {
              idDoanhNgiep: "",
              TenDoanhNghiep: "",
              TienDuaDoanhNghiep: "",
              TienLayDoanhNghiep: "",
              TienDoanhNghiep: "",
              TienGiamGia: "",
              SoDonHang: "",
              LogoDoanhNghiep: "",
            };
            for (let j = 0; j < donHang.length; j++) {
              var checkThang = donHang[j]._doc.updatedAt.getMonth();
              if (thanghientai == checkThang) {
                tienDoanhNghiep =
                  parseFloat(donHang[j]._doc.TongChiPhi) + tienDoanhNghiep;
                soDonHang++;
                tienGiamGia =
                  parseFloat(donHang[j]._doc.TienGiamGia) + tienGiamGia;
              }
            }
            updateDN.idDoanhNgiep = IDDoanhNgiep;
            updateDN.TienDoanhNghiep = tienDoanhNghiep.toString();
            updateDN.TienGiamGia = tienGiamGia.toString();
            updateDN.SoDonHang = soDonHang.toString();
            updateDN.LogoDoanhNghiep = doanhnghiep[i]._doc.Logo;
            updateDN.TenDoanhNghiep = doanhnghiep[i]._doc.TenDoanhNghiep;
            tienDuaDoanhNghiep = tienDoanhNghiep + tienGiamGia;
            tienLayDoanhNghiep = (tienDuaDoanhNghiep * 5) / 100;
            updateDN.TienDuaDoanhNghiep = tienDuaDoanhNghiep.toString();
            updateDN.TienLayDoanhNghiep = tienLayDoanhNghiep.toString();
            tongTienDoanhNghiep = tongTienDoanhNghiep + tienDoanhNghiep;
            tongSoDonHang = soDonHang + tongSoDonHang;
            tongTienGiamGia = tongTienGiamGia + tienGiamGia;
            resultThongKeDN[i] = updateDN;
          }
          resultTong.TongTien = tongTienDoanhNghiep.toString();
          resultTong.TongTienGiam = tongTienGiamGia.toString();
          resultTong.TongDonHang = tongSoDonHang.toString();
          resultTong.TongTienDuaDoanhNghiep = (
            tongTienDoanhNghiep + tongTienGiamGia
          ).toString();
          var donHangDichVu = await DonHangDichVu.find({
            $or: [
              { ThanhToan: "PayPal" },
              { ThanhToan: "VnPay" },
              { ThanhToan: "Đã Thanh Toán" },
            ],
          });
          var tienGoiDichVu = 0;
          var soGoiDaMua = 0;
          for (let i = 0; i < donHangDichVu.length; i++) {
            var checkThang = donHangDichVu[i]._doc.updatedAt.getMonth();
            if (checkThang == thanghientai) {
              tienGoiDichVu =
                parseFloat(donHangDichVu[i]._doc.ChiPhi) + tienGoiDichVu;
              soGoiDaMua++;
            }
          }
          var resultGoi = {
            TienGoiDichVu: tienGoiDichVu.toString(),
            SoGoiDaBan: soGoiDaMua.toString(),
          };
          var tongTatCaTien =
            tienGoiDichVu +
            tongTienDoanhNghiep +
            ((tongTienDoanhNghiep + tongTienGiamGia) * 5) / 100;
          var tienLoi = tongTatCaTien - tongTienGiamGia - tongTienDoanhNghiep;
          var resultTongTien = {
            TongTatCaTien: tongTatCaTien.toString(),
            TienLoi: tienLoi.toString(),
          };
          res.status(200).send({
            dataDN: resultThongKeDN,
            dataTongDN: resultTong,
            dataGoi: resultGoi,
            dataTongTien: resultTongTien,
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
      console.log(error);
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
  //get admin/show-thongke-thang-truoc
  async ShowThongKeThangTruoc(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var doanhnghiep = await DoanhNghiep.find({ TrangThai: "ACTIVE" });
          var resultThongKeDN = [];
          var resultTong = {
            TongTien: "",
            TongTienGiam: "",
            TongDonHang: "",
            TongTienDuaDoanhNghiep: "",
          };
          var tienDoanhNghiep;
          var tienGiamGia;
          var soDonHang;
          var tongTienDoanhNghiep = 0;
          var tongTienGiamGia = 0;
          var tongSoDonHang = 0;
          var tienLayDoanhNghiep = 0;
          var tienDuaDoanhNghiep = 0;
          var ngayHienTai = new Date();
          ngayHienTai.setDate(ngayHienTai.getDate());
          var thanghientai = ngayHienTai.getMonth() - 1;
          for (let i = 0; i < doanhnghiep.length; i++) {
            tienDoanhNghiep = 0;
            tienGiamGia = 0;
            soDonHang = 0;
            tienLayDoanhNghiep = 0;
            tienDuaDoanhNghiep = 0;
            var IDDoanhNgiep = doanhnghiep[i]._doc._id;
            var donHang = await Order.find({
              id_DoanhNghiep: IDDoanhNgiep,
              $or: [{ ThanhToan: "PayPal" }, { ThanhToan: "VnPay" }],
              TrangThai: "Đã Nhận Hàng",
            });
            var updateDN = {
              idDoanhNgiep: "",
              TenDoanhNghiep: "",
              TienDuaDoanhNghiep: "",
              TienLayDoanhNghiep: "",
              TienDoanhNghiep: "",
              TienGiamGia: "",
              SoDonHang: "",
              LogoDoanhNghiep: "",
            };
            for (let j = 0; j < donHang.length; j++) {
              var checkThang = donHang[j]._doc.updatedAt.getMonth();
              if (thanghientai == checkThang) {
                tienDoanhNghiep =
                  parseFloat(donHang[j]._doc.TongChiPhi) + tienDoanhNghiep;
                soDonHang++;
                tienGiamGia =
                  parseFloat(donHang[j]._doc.TienGiamGia) + tienGiamGia;
              }
            }
            updateDN.idDoanhNgiep = IDDoanhNgiep;
            updateDN.TienDoanhNghiep = tienDoanhNghiep.toString();
            updateDN.TienGiamGia = tienGiamGia.toString();
            updateDN.SoDonHang = soDonHang.toString();
            updateDN.LogoDoanhNghiep = doanhnghiep[i]._doc.Logo;
            updateDN.TenDoanhNghiep = doanhnghiep[i]._doc.TenDoanhNghiep;
            tienDuaDoanhNghiep = tienDoanhNghiep + tienGiamGia;
            tienLayDoanhNghiep = (tienDuaDoanhNghiep * 5) / 100;
            updateDN.TienDuaDoanhNghiep = tienDuaDoanhNghiep.toString();
            updateDN.TienLayDoanhNghiep = tienLayDoanhNghiep.toString();
            tongTienDoanhNghiep = tongTienDoanhNghiep + tienDoanhNghiep;
            tongSoDonHang = soDonHang + tongSoDonHang;
            tongTienGiamGia = tongTienGiamGia + tienGiamGia;
            resultThongKeDN[i] = updateDN;
          }
          resultTong.TongTien = tongTienDoanhNghiep.toString();
          resultTong.TongTienGiam = tongTienGiamGia.toString();
          resultTong.TongDonHang = tongSoDonHang.toString();
          resultTong.TongTienDuaDoanhNghiep = (
            tongTienDoanhNghiep + tongTienGiamGia
          ).toString();
          var donHangDichVu = await DonHangDichVu.find({
            $or: [
              { ThanhToan: "PayPal" },
              { ThanhToan: "VnPay" },
              { ThanhToan: "Đã Thanh Toán" },
            ],
          });
          var tienGoiDichVu = 0;
          var soGoiDaMua = 0;
          for (let i = 0; i < donHangDichVu.length; i++) {
            var checkThang = donHangDichVu[i]._doc.updatedAt.getMonth();
            if (checkThang == thanghientai) {
              tienGoiDichVu =
                parseFloat(donHangDichVu[i]._doc.ChiPhi) + tienGoiDichVu;
              soGoiDaMua++;
            }
          }
          var resultGoi = {
            TienGoiDichVu: tienGoiDichVu.toString(),
            SoGoiDaBan: soGoiDaMua.toString(),
          };
          var tongTatCaTien =
            tienGoiDichVu +
            tongTienDoanhNghiep +
            ((tongTienDoanhNghiep + tongTienGiamGia) * 5) / 100;
          var tienLoi = tongTatCaTien - tongTienGiamGia - tongTienDoanhNghiep;
          var resultTongTien = {
            TongTatCaTien: tongTatCaTien.toString(),
            TienLoi: tienLoi.toString(),
          };
          res.status(200).send({
            dataDN: resultThongKeDN,
            dataTongDN: resultTong,
            dataGoi: resultGoi,
            dataTongTien: resultTongTien,
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
      console.log(error);
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }

  //get admin/hoach-toan-doi-soat-trong-thang
  async HachToanDoiSoatTrongThang(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var idDN = req.query.IDDoanhNghiep;
          var resultTong = {
            TenDoanhNghiep: "",
            TienDuaDoanhNghiep: "",
            TienLayDoanhNghiep: "",
            TienGiamGia: "",
            TienDoanhNghiepThuDuoc: "",
            SoDonHang: "",
          };
          var resultDonHang = [];
          var tienDoanhNghiep = 0;
          var tienGiamGia = 0;
          var soDonHang = 0;
          var tienLayDoanhNghiep = 0;
          var tienDuaDoanhNghiep = 0;
          var ngayHienTai = new Date();
          ngayHienTai.setDate(ngayHienTai.getDate());
          var thanghientai = ngayHienTai.getMonth();
          var doanhnghiep = await DoanhNghiep.find({
            _id: idDN,
            TrangThai: "ACTIVE",
          });
          var donHang = await Order.find({
            id_DoanhNghiep: idDN,
            $or: [{ ThanhToan: "PayPal" }, { ThanhToan: "VnPay" }],
            TrangThai: "Đã Nhận Hàng",
          });
          var dem=0;
          for (let i = 0; i < donHang.length; i++) {
            var checkThang = donHang[i]._doc.updatedAt.getMonth();
            if (thanghientai == checkThang) {
              tienDoanhNghiep =
                parseFloat(donHang[i]._doc.TongChiPhi) + tienDoanhNghiep;
              soDonHang++;
              tienGiamGia =
                parseFloat(donHang[i]._doc.TienGiamGia) + tienGiamGia;
              resultDonHang[dem] = donHang[i];
              dem++;
            }
          }
          tienDuaDoanhNghiep = tienDoanhNghiep + tienGiamGia;
          tienLayDoanhNghiep = (tienDuaDoanhNghiep * 5) / 100;
          resultTong.TenDoanhNghiep = doanhnghiep.TenDoanhNghiep;
          resultTong.TienDoanhNghiepThuDuoc = tienDoanhNghiep.toString();
          resultTong.TienGiamGia = tienGiamGia.toString();
          resultTong.SoDonHang = soDonHang.toString();
          resultTong.TienLayDoanhNghiep = tienLayDoanhNghiep.toString();
          resultTong.TienDuaDoanhNghiep = tienDuaDoanhNghiep.toString();
          res.status(200).send({
            dataOrder: resultDonHang,
            dataDN: resultTong,
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
      console.log(error);
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
  //get admin/hoach-toan-doi-soat-thang-truoc
  async HachToanDoiSoatThangTruoc(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var idDN = req.query.IDDoanhNghiep;
          var resultDonHang = [];
          var resultTong = {
            TenDoanhNghiep: "",
            TienDuaDoanhNghiep: "",
            TienLayDoanhNghiep: "",
            TienGiamGia: "",
            TienDoanhNghiepThuDuoc: "",
            SoDonHang:"",
          };
          var tienDoanhNghiep = 0;
          var tienGiamGia = 0;
          var soDonHang = 0;
          var tienLayDoanhNghiep = 0;
          var tienDuaDoanhNghiep = 0;
          var dem =0;
          var ngayHienTai = new Date();
          ngayHienTai.setDate(ngayHienTai.getDate());
          var thanghientai = ngayHienTai.getMonth() - 1;
          var doanhnghiep = await DoanhNghiep.find({
            _id: idDN,
            TrangThai: "ACTIVE",
          });
          var donHang = await Order.find({
            id_DoanhNghiep: idDN,
            $or: [{ ThanhToan: "PayPal" }, { ThanhToan: "VnPay" }],
            TrangThai: "Đã Nhận Hàng",
          });
          for (let i = 0; i < donHang.length; i++) {
            var checkThang = donHang[i]._doc.updatedAt.getMonth();
            if (thanghientai === checkThang) {
              tienDoanhNghiep =
                parseFloat(donHang[i]._doc.TongChiPhi) + tienDoanhNghiep;
              soDonHang++;
              tienGiamGia =
                parseFloat(donHang[i]._doc.TienGiamGia) + tienGiamGia;
              resultDonHang[dem] = donHang[i];
              dem++;
            }
          }
          tienDuaDoanhNghiep = tienDoanhNghiep + tienGiamGia;
          tienLayDoanhNghiep = (tienDuaDoanhNghiep * 5) / 100;
          resultTong.TenDoanhNghiep = doanhnghiep.TenDoanhNghiep;
          resultTong.TienDoanhNghiepThuDuoc = tienDoanhNghiep.toString();
          resultTong.TienGiamGia = tienGiamGia.toString();
          resultTong.SoDonHang = soDonHang.toString();
          resultTong.TienLayDoanhNghiep = tienLayDoanhNghiep.toString();
          resultTong.TienDuaDoanhNghiep = tienDuaDoanhNghiep.toString();
          res.status(200).send({
            dataOrder: resultDonHang,
            dataDN: resultTong,
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
      console.log(error);
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
//get admin/show-thong-ke-30Ngay
async ShowThongKe30Ngay(req, res, next) {
  try {
    const token = req.get("Authorization").replace("Bearer ", "");
    const _id = await verifyToken(token);
    var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
    if (result != null) {
      const roleDT = result.Role;
      if (roleDT == "ADMIN") {
        var ngayHienTai = new Date();
        ngayHienTai.setDate(ngayHienTai.getDate());
        var ngayXet = new Date();
        ngayXet.setDate(ngayXet.getDate() - 30);
        var tien1Ngay = 0;
        var tienGiamGia1Ngay = 0;
        var soDonHang1Ngay = 0;
        console.log(ngayHienTai);
        console.log(ngayXet);
        console.log(ngayXet.getDate());
        var result = [];
        // var day = 60 * 60 * 24 * 1000*(1);
        var checkNgay = new Date(ngayXet.getTime());
        var layNgayXet = checkNgay.getDate();
        var layThangxet = checkNgay.getMonth();
        var layNamXet = checkNgay.getFullYear();
        for(let i=0;i<30;i++)
        {
          tien1Ngay = 0;
          tienGiamGia1Ngay = 0;
          soDonHang1Ngay = 0;
          var ngaySoSanhLon = new Date(layNamXet, layThangxet, layNgayXet+i+2);
          var ngaySoSanhBe = new Date(layNamXet, layThangxet, layNgayXet+i+3);
          // console.log(ngaySoSanhLon);
          // console.log(ngaySoSanhBe);
          // console.log("**********")
          var donHang1Ngay = await Order.find({updatedAt: { $gte: ngaySoSanhLon },createdAt: { $lte: ngaySoSanhBe },$or: [{ ThanhToan: "PayPal" }, { ThanhToan: "VnPay" }],TrangThai: "Đã Nhận Hàng", });
          // var donHang1Ngay = await Order.find({ $and:[{ updateAt: {$gte: ngaySoSanhLon} }, {updateAt: {$lt: ngaySoSanhBe}}],$or: [{ ThanhToan: "PayPal" }, { ThanhToan: "VnPay" }],TrangThai: "Đã Nhận Hàng",});
          soDonHang1Ngay = donHang1Ngay.length;
          for(let j=0;j<donHang1Ngay.length;j++)
          {
            console.log(donHang1Ngay[j]._doc);
            tien1Ngay= parseFloat(donHang1Ngay[j].TongChiPhi)+tien1Ngay;
            tienGiamGia1Ngay = parseFloat(donHang1Ngay[j].TienGiamGia)+ tienGiamGia1Ngay;
          }
          var update= {
            TienDonHang1Ngay: tien1Ngay.toString(),
            TienGiamGia1Ngay: tienGiamGia1Ngay.toString(),
            SoDonHang1Ngay: soDonHang1Ngay.toString(),
          }
          result[i] = update;
        }
        res.status(200).send({
          data: result,
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
    console.log(error);
    res.status(500).send({
      data: "",
      error: error,
    });
  }
}
  async SearchKH(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
      if (result != null) {
        const roleDT = result.Role;
        if (roleDT == "ADMIN") {
          var title = req.query.title;
          var resultKH = await KhachHang.find({
            $or: [
              { Email: new RegExp(title) },
              { SoDienThoai: new RegExp(title) },
            ],
          });
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
}

module.exports = new AdminController();
