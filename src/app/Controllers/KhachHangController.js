const TaiKhoan = require('../models/TaiKhoan');
const KhachHang = require('../models/KhachHang');
const DoanhNghiep = require('../Models/DoanhNghiep');
const bcrypt = require('bcrypt');
const { createToken, verifyToken } = require('./index');
class KhachHangController {
      //Post custommers/information
      async login(req, res, next) {
        const { Email, Password } = req.body;
        var result = await TaiKhoan.findOne({ Email })
        if (result != null) {
            const isEqualPassword = await bcrypt.compare(Password, result.Password);
            if (isEqualPassword) {
                const roleDT= result.Role;
                if(roleDT=="KHACHHANG")
                res.status(200).send({
                    "data": result,
                    "token": token,
                    "error": "null",
                });
            }
            else {
                res.status(400).send({
                    'error': 'Wrong password!',
                });
            }
        } else {
            res.status(404).send({
                'error': 'Email not found!',
            });
        }
    }

}

module.exports = new KhachHangController();