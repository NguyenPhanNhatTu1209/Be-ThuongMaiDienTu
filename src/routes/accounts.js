const express = require("express");
const router = express.Router();

const taikhoanController = require("../app/Controllers/TaiKhoanController");

//router.get('/create', khachhangController.create);
router.post("/register-khachhang", taikhoanController.registerKhachHang);
router.post("/register-doanhnghiep", taikhoanController.registerDoanhNghiep);
router.post("/login", taikhoanController.login);
router.post("/forgot-password", taikhoanController.QuenMatKhau);
router.get("/reset-password/:token", taikhoanController.ResetPassword);

// router.post('/handle-form-actions',courseController.handleFormActions);
// router.get('/:id/edit',courseController.edit);
// router.put('/:id',courseController.update);
// router.patch('/:id/restore', courseController.restore);
// router.delete('/:id',courseController.delete);
// router.delete('/:id/force',courseController.forceDelete);
// router.get('/:slug', courseController.show);
module.exports = router;
