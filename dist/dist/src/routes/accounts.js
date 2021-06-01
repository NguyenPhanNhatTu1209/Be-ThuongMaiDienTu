const express = require("express");
const router = express.Router();
var multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
const taikhoanController = require("../app/Controllers/TaiKhoanController");
var cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'doc', maxCount: 1 }]);
//router.get('/create', khachhangController.create);
router.post("/register-khachhang", taikhoanController.registerKhachHang);
router.post("/register-doanhnghiep", cpUpload, taikhoanController.registerDoanhNghiep);
router.post("/login", taikhoanController.login);
router.post("/forgot-password", taikhoanController.QuenMatKhau);
router.get("/reset-password/:token", taikhoanController.ResetPassword);
router.get("/verify-email/:token", taikhoanController.verifyEmail);

// router.post('/handle-form-actions',courseController.handleFormActions);
// router.get('/:id/edit',courseController.edit);
// router.put('/:id',courseController.update);
// router.patch('/:id/restore', courseController.restore);
// router.delete('/:id',courseController.delete);
// router.delete('/:id/force',courseController.forceDelete);
// router.get('/:slug', courseController.show);
module.exports = router;