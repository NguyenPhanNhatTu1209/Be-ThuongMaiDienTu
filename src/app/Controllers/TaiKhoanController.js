require("dotenv").config();
const TaiKhoan = require("../Models/TaiKhoan");
const KhachHang = require("../Models/KhachHang");
const DoanhNghiep = require("../Models/DoanhNghiep");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { UploadImage } = require("./index");

const {
  createToken,
  verifyToken,
  createTokenTime,
  makePassword,
} = require("./index");
const { fileURLToPath } = require("url");

class TaiKhoanController {
  //Post auth/login
  async login(req, res, next) {
    try{
      const { Email, Password } = req.body;
      var result = await TaiKhoan.findOne({ Email, Status: "ACTIVE" });
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
          error: "Email not found or Email Inactive",
        });
      }
    }
    catch(error)
    {
      res.status(500).send({
        data: "",
        error: error,
      });
    }
  }
  //Post customers/register-khachhang
  async registerKhachHang(req, res, next) {
    try {
      const { Email, Password, TenKhachHang, SoDienThoai, DiaChi } = req.body;
      const Role = "KHACHHANG";
      const result = await TaiKhoan.findOne({ Email });
      console.log(result);
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

        const token = await createToken(`${id_account}`);
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
        var url = `https://be-b010.herokuapp.com/auth/verify-email/${token}`;
        console.log(customer._doc.Email);
        var mailOptions = {
          to: customer._doc.Email,
          from: process.env.EmailAdmin,
          subject: "Verify Email",
          text: "Please follow this link to verify Email " + url,
        };
        smtpTransport.sendMail(mailOptions, function (error, response) {
          if (error) {
            res.status(400).send({
              error: "Gửi không thành công",
            });
          } else {
            res.status(200).send({
              data: customer,
              Success: "Đã gửi Email thành công",
            });
          }
        });
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
  //put customers/verify-Email
  async verifyEmail(req, res, next) {
    try {
      const token = req.params.token;
      const data = await verifyToken(token);
      const _id = data;
      console.log(_id);
      var result = await TaiKhoan.findOne({ _id });
      if (result != null) {
        var update = { Status: "ACTIVE" };
        await TaiKhoan.findOneAndUpdate({ _id }, update, {
          new: true,
        });
        res.status(200).send({
          data: "Kích hoạt thành công",
          error: "null",
        });
      } else {
        res.status(400).send({
          error: "No Email",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Token hết hạn!");
    }
  }
  //Post auth/register-doanhnghiep
  async registerDoanhNghiep(req, res, next) {
    try {
      const Role = "DOANHNGHIEP";
      const logo = req.files["logo"][0];
      const doc = req.files["doc"][0];
      const nameLogo = logo.filename;
      const nameDoc = doc.filename;
      const emailDN = req.body.Email;
      const passwordDN = req.body.Password;
      const tenDN = req.body.TenDoanhNghiep;
      const sdtDN = req.body.SoDienThoai;
      const diaChiDN = req.body.DiaChi;
      const urlLogo = await UploadImage(nameLogo, "Logos/");
      const urlDoc = await UploadImage(nameDoc, "Docs/");
      const result = await TaiKhoan.findOne({ Email: emailDN });
      if (result == null) {
        const hashPassword = await bcrypt.hash(passwordDN, 5);
        const account = await TaiKhoan.create({
          Email: emailDN,
          Password: hashPassword,
          Role,
        });
        const id_account = account._id;
        const doanhNghiep = await DoanhNghiep.create({
          TenDoanhNghiep: tenDN,
          Email: emailDN,
          SoDienThoai: sdtDN,
          DiaChi: diaChiDN,
          id_account,
          GiayPhep: urlDoc,
          Logo: urlLogo,
          TrangThai: "INACTIVE",
        });
        const token = await createToken(`${id_account}`);
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
        var url = `https://be-b010.herokuapp.com/auth/verify-email/${token}`;
        var mailOptions = {
          to: doanhNghiep._doc.Email,
          from: process.env.EmailAdmin,
          subject: "Verify Email",
          text: "Please follow this link to verify Email " + url,
        };
        smtpTransport.sendMail(mailOptions, function (error, response) {
          if (error) {
            res.status(400).send({
              error: "Gửi không thành công",
            });
          } else {
            res.status(200).send({
              data: doanhNghiep,
              Success: "Đã gửi Email thành công",
            });
          }
        });
      } else {
        res.status(400).send({
          error: "Email đã tồn tại",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "Đăng ký thất bại",
      });
    }
  }

  //Post auth/forgot-password
  async QuenMatKhau(req, res, next) {
    // const { Email, Password, TenDoanhNghiep, SoDienThoai, DiaChi, GiayPhep } = req.body;
    try {
      const EmailTK = req.body.EmailTK;
      const result = await TaiKhoan.findOne({ Email: EmailTK });
      if (result != null) {
        const token = await createTokenTime(`${result._id}`);
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
        var url = `https://be-b010.herokuapp.com/auth/reset-password/${token}`;
        var mailOptions = {
          to: result.Email,
          from: process.env.EmailAdmin,
          subject: "Password Reset",
          text: "Please follow this link to reset your password " + url,
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
      res.status(500).send({
        error: error,
      });
    }
  }
  //Post auth/reset-password/:token
  async ResetPassword(req, res, next) {
    // const { Email, Password, TenDoanhNghiep, SoDienThoai, DiaChi, GiayPhep } = req.body;
    try {
      const token = req.params.token;
      const data = await verifyToken(token);
      const _id = data.data;
      var result = await TaiKhoan.findOne({ _id });
      console.log(result);
      if (result != null) {
        var passwordNew = makePassword(6);
        const hashPassword = await bcrypt.hash(passwordNew, 5);
        var updateValue = { Password: hashPassword };
        await TaiKhoan.findOneAndUpdate({ _id }, updateValue, {
          new: true,
        });
        res.status(200).send(`Mật khẩu mới của bạn là: ${passwordNew}`);
      } else {
        res.status(400).send({
          error: "No Email",
        });
      }
    } catch (error) {
      res.status(400).send("Token hết hạn");
    }
  }
}

module.exports = new TaiKhoanController();
