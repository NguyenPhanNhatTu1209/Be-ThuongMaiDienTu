const express = require("express");
const router = express.Router();

const khachhangController = require("../app/Controllers/KhachHangController.js");

router.get("/show_goikhachhang", khachhangController.showGoiKH);
router.post("/create-donhang", khachhangController.TaoDonHang);
router.put("/confirm-donhang", khachhangController.XacNhanDonHang);
router.delete("/delete-donhang", khachhangController.HuyDonHang);
router.post("/create-bill-package", khachhangController.CreateBillPackage);


module.exports = router;
