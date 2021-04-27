const TaiKhoan = require('../Models/TaiKhoan');
const KhachHang = require('../Models/KhachHang');
const DoanhNghiep = require('../Models/DoanhNghiep');
const GoiKhachHang = require('../Models/GoiKhachHang');
const GoiDoanhNghiep = require('../Models/GoiDoanhNghiep');
const bcrypt = require('bcrypt');
const { createToken,verifyToken } = require('./index');

class AdminController {
     //Post admin/create-goikhachhang  
    async creategoiKH(req, res, next) {
        // const { TenDichVu,ThongTin,KhoiLuongToiDa,ChiPhi,HanSuDung,SoDonHang,GiamGia } = req.body;
        const token = req.get('Authorization').replace('Bearer ', '');
        const _id = await verifyToken(token);
        var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
        if (result != null) {
            const roleDT = result.Role;
            if (roleDT == "ADMIN") {
                var resultKH = await GoiKhachHang.create(req.body);
                res.status(200).send({
                    "data": resultKH,
                    "error": "null",
                });
            }
            else {
                res.status(404).send({
                    "data": "",
                    "error": "No Authentication",
                });
            }
        } else {
            res.status(404).send({
                "data": '',
                "error": "Not found user!",
            });
        }
    }

   

}

module.exports = new AdminController();