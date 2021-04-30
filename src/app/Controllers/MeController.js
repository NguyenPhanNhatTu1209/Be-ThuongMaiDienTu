const TaiKhoan = require('../Models/TaiKhoan');
const KhachHang = require('../Models/KhachHang');
const DoanhNghiep = require('../Models/DoanhNghiep');
const GoiKhachHang = require('../Models/GoiKhachHang');
const GoiDoanhNghiep = require('../Models/GoiDoanhNghiep');
const Order = require('../Models/Order');


const { createToken, verifyToken } = require('./index');
class MeController {
    //get me/information / get || post put delete
    async information(req, res, next) {
        const token = req.get('Authorization').replace('Bearer ', '');
        const _id = await verifyToken(token);
        var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
        if (result != null) {
            const roleDT = result.Role;
            if (roleDT == "KHACHHANG") {
                var resultKH = await KhachHang.findOne({ id_account: _id });
                const resultAddress = await DiaChi.find({ id_account: _id }); // find All address by id account
                resultKH._doc.address = resultAddress; // them vao bien resultKH 1 key la address va` gia' tri la bien resultAddress vua tim dc o dong tren
                res.status(200).send({
                    "data": resultKH,
                    "error": "null",
                });
            }
            else {
                var resultDN = await DoanhNghiep.findOne({ id_account: _id });
                res.status(200).send({
                    "data": resultDN,
                    "error": "null",
                });
            }
        } else {
            res.status(404).send({
                "data": '',
                "error": "Not found user!",
            });
        }
    }

    async editProfile(req, res, next) {
        const { Ten, SoDienThoai, DiaChi } = req.body;
        var updateValue = { SoDienThoai, DiaChi };
        const token = req.get('Authorization').replace('Bearer ', '');
        const _id = await verifyToken(token);
        var result = await TaiKhoan.findOne({ _id }); //muc dich la lay role
        if (result != null) {
            const roleDT = result.Role;
            if (roleDT == "KHACHHANG") {
                updateValue.TenKhachHang = Ten;
                var resultKH = await KhachHang.findOneAndUpdate({ id_account: _id },
                    updateValue, {
                    new: true
                });
                res.status(200).send({
                    "data": resultKH,
                    "error": "null",
                });
            }
            else {
                updateValue.TenDoanhNghiep = Ten;
                var resultDN = await DoanhNghiep.findOneAndUpdate({ id_account: _id },
                    updateValue, {
                    new: true
                });
                res.status(200).send({
                    "data": resultDN,
                    "error": "null",
                });
            }
        } else {
            res.status(404).send({
                "data": '',
                "error": "Not found user!",
            });
        }
    }
    // PUT me/choose_goidichvukhachhang
    async ChonGoiDichVuKH(req, res, next) {
        // const { TenDichVuKhachHang, KhoiLuongToiDa, HanSuDung,SoDonHang,GiamGia } = req.body;
        var idGoiDichVuKhachHang =  req.body.idGoiDV;
        const token = req.get('Authorization').replace('Bearer ', '');
        const _id = await verifyToken(token);
        var resultKH = await TaiKhoan.findOne({ _id }); //muc dich la lay role
        var resultGoiDV = await GoiKhachHang.findOne({DeleteAt: "False" , _id: idGoiDichVuKhachHang});
        const { TenDichVuKhachHang, KhoiLuongToiDa, HanSuDung,SoDonHang,GiamGia } = resultGoiDV;
        const update = { TenDichVuKhachHang, KhoiLuongToiDa, HanSuDung,SoDonHang,GiamGia };
        if (resultKH != null) {
            const roleDT = resultKH.Role;
            if (roleDT == "KHACHHANG") {
                var resultKH = await KhachHang.findOneAndUpdate({ id_account: _id },
                    update, {
                    new: true
                });
                res.status(200).send({
                    "data": resultKH,
                    "error": "null",
                });
            }
            else {
                res.status(404).send({
                    "data": '',
                    "error": "No Package",
                });
            }
        } else {
            res.status(404).send({
                "data": '',
                "error": "Not found user!",
            });
        }
    }

        // PUT me/choose_goidichvudoanhnghiep
        async ChonGoiDichVuDN(req, res, next) {
            // const { TenGoi, HanSuDung,SoDonHang } = req.body;
            var idGoiDichVuDoanhNghiep =  req.body.idGoiDN;
            const token = req.get('Authorization').replace('Bearer ', '');
            const _id = await verifyToken(token);
            var resultDN = await TaiKhoan.findOne({ _id }); //muc dich la lay role
            var resultGoiDV = await GoiDoanhNghiep.findOne({DeleteAt: "False" , _id: idGoiDichVuDoanhNghiep});
            console.log(resultGoiDV);
            const { TenGoi, HanSuDung,SoDonHang } = resultGoiDV;
            const update = { TenGoi, HanSuDung,SoDonHang };
            if (resultDN != null) {
                const roleDT = resultDN.Role;
                if (roleDT == "DOANHNGHIEP") {
                    var resultDN = await DoanhNghiep.findOneAndUpdate({ id_account: _id },
                        update, {
                        new: true
                    });
                    res.status(200).send({
                        "data": resultDN,
                        "error": "null",
                    });
                }
                else {
                    res.status(404).send({
                        "data": '',
                        "error": "No Package",
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

module.exports = new MeController();