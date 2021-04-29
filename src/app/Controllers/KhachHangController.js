const TaiKhoan = require('../Models/TaiKhoan');
const KhachHang = require('../Models/KhachHang');
const DoanhNghiep = require('../Models/DoanhNghiep');
const GoiKhachHang = require('../Models/GoiKhachHang');
const GoiDoanhNghiep = require('../Models/GoiDoanhNghiep');
const Order = require('../Models/Order');

const { verifyToken } = require('./index');
class KhachHangController {

    //get customers/show_goikhachhang 
    async showGoiKH(req, res, next) {
        var result = await GoiKhachHang.find({DeleteAt: "False"}); //muc dich la lay role
        if (result != null) {
                res.status(200).send({
                    "data": result,
                    "error": "null",
                });
            
        } else {
            res.status(404).send({
                "data": '',
                "error": "No package",
            });
        }
    }
    async ChonGoiDichVu(req, res, next) {
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

    // async CreateOrder(req, res, next) {
    //     const {TenNguoiNhan,SoDienThoaiNguoiNhan,NoiLayHang,NoiGiaoHang,TrangThai,KhoiLuong,TenLoaiHang,GiaGia,TongChiPhi,id_goiDV,id_KhachHang} = req.body;
    //     const token = req.get('Authorization').replace('Bearer ', '');
    //     const _id = await verifyToken(token);
    //     const id_goiDV =  
    //     var result = await TaiKhoan.findOne({ _id}); //muc dich la lay role
    //     if (result != null) {
    //         const roleDT = result.Role;
    //         if (roleDT == "KHACHHANG") {
    //             var resultDN = await Order.create(req.body);
    //             res.status(200).send({
    //                 "data": resultDN,
    //                 "error": "null",
    //             });
    //         }
    //         else {
    //             res.status(404).send({
    //                 "data": "",
    //                 "error": "No Authentication",
    //             });
    //         }
    //     } else {
    //         res.status(404).send({
    //             "data": '',
    //             "error": "Not found user!",
    //         });
    //     }
    // }
}

module.exports = new KhachHangController();