const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { createToken, verifyToken, createTokenTime, makePassword } = require("./index");

class TaiKhoanController {
  //Post auth/login
  async login(req, res, next) {
    const { Email, Password } = req.body;
    var result = await TaiKhoan.findOne({ Email });
    if (result != null) {
      const isEqualPassword = await bcrypt.compare(Password, result.Password);
      if (isEqualPassword) {
        const token = await createToken(`${result._id}`);
        result._doc.token = token;
        res.status(200).send({
          data: result,
          error: "null",
        });
      } else {
        res.status(400).send({
          error: "Wrong password!",
        });
      }
    } else {
      res.status(404).send({
        error: "Email not found!",
      });
    }
  }
  //Post customers/register-khachhang
  async registerKhachHang(req, res, next) {
    const { Email, Password, TenKhachHang, SoDienThoai, DiaChi } = req.body;
    const Role = "KHACHHANG";
    try {
      const result = await TaiKhoan.findOne({ Email });
      if (result == null) {
        const hashPassword = await bcrypt.hash(Password, 5);
        const account = await TaiKhoan.create({
          Email,
          Password: hashPassword,
          Role,
        });
        const id_account = account._id;
        const customer = await KhachHang.create({
          TenKhachHang,
          Email,
          SoDienThoai,
          DiaChi,
          id_account,
        });
        console.log(customer);
        res.status(200).send(customer);
      } else {
        res.status(400).send({
          error: "Dang ky that bai",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: "Dang ky that bai",
      });
    }
  }
  //Post enterprises/register-doanhnghiep
  async registerDoanhNghiep(req, res, next) {
    const {
      Email,
      Password,
      TenDoanhNghiep,
      SoDienThoai,
      DiaChi,
      GiayPhep,
    } = req.body;
    const Role = "DOANHNGHIEP";
    try {
      const result = await TaiKhoan.findOne({ Email });
      if (result == null) {
        const hashPassword = await bcrypt.hash(Password, 5);
        const account = await TaiKhoan.create({
          Email,
          Password: hashPassword,
          Role,
        });
        const id_account = account._id;
        const customer = await DoanhNghiep.create({
          TenDoanhNghiep,
          Email,
          SoDienThoai,
          DiaChi,
          id_account,
          GiayPhep,
          TrangThai: "INACTIVE",
        });
        res.status(200).send(customer);
      } else {
        res.status(400).send({
          error: "Dang ky that bai",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: "Dang ky that bai",
      });
    }
  }
  async QuenMatKhau(req, res, next) {
    // const { Email, Password, TenDoanhNghiep, SoDienThoai, DiaChi, GiayPhep } = req.body;
    try {
      const EmailTK = req.body.EmailTK;
      console.log(EmailTK);
      const result = await TaiKhoan.findOne({ Email: EmailTK });
      if (result != null) {
        const token = await createTokenTime(`${result._id}`);
        console.log(token);
        var smtpTransport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            user: "nguyenphannhattu@gmail.com",
            pass: "123456AsZx",
          },
        });
        var mailOptions = {
          to: result.Email,
          from: "nguyenphannhattu@gmail.com",
          subject: "Password Reset",
          html: `Press <a href=http://${req.headers.host}/auth/reset-password/${token}> here </a> to change password.`,
        };
        smtpTransport.sendMail(mailOptions, function (error, response) {
          if (error) {
            res.status(400).send({
              error: "Gửi không thành công",
            });
          } else {
            res.status(200).send({
              Success: "Đã gửi Email thành công",
            });
          }
        });
      } else {
        res.status(400).send({
          error: "No Email",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: error,
      });
    }
  }

  async ResetPassword(req, res, next) {
    // const { Email, Password, TenDoanhNghiep, SoDienThoai, DiaChi, GiayPhep } = req.body;
    try {
      const token = req.params.token;
      const data = await verifyToken(token);
      const _id = data.data;
      var result = await TaiKhoan.findOne({ _id });
      console.log(result);
      if (result != null) {

        var passwordNew= makePassword(6);
        const hashPassword = await bcrypt.hash(passwordNew, 5);
        var updateValue= {Password: hashPassword}
        await TaiKhoan.findOneAndUpdate({ _id},
            updateValue, {
            new: true
        });
        res.status(200).send(
            `Mật khẩu mới của bạn là: ${passwordNew}`
        )
      } else {
        res.status(400).send({
          error: "No Email",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: error,
      });
    }
  }


}

module.exports = new TaiKhoanController();
