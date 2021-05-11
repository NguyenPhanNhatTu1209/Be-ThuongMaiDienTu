const express = require("express");
const router = express.Router();
const diachiController = require("../app/Controllers/DiaChiController");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'doc', maxCount: 1 }]);
const meController = require("../app/Controllers/MeController");

//router.get('/create', khachhangController.create);

router.get("/information", meController.information);
router.put("/edit-profile-enterprise",cpUpload, meController.editProfileDN);
router.put("/edit-profile-customer", meController.editProfileKH);
router.post("/add-address", diachiController.ThemDiaChi);
router.put("/edit-address", diachiController.SuaDiaChi);
router.delete("/delete-address", diachiController.XoaDiaChi);
router.put("/change-password", meController.ChangePassword);
router.get("/show-product-type", meController.ShowProductType);
router.get('/success', meController.PaymentSuccess);
router.get('/cancel', meController.CancelPayment);
router.get('/successPackageBill', meController.PaymentSuccessBillPackage);
router.get('/cancelPackageBill', meController.CancelPaymentBillPackage);
router.post('/refund', meController.RefundPayment)



// router.post('/register-doanhnghiep',meController.registerDoanhNghiep);
// router.post('/login',meController.login);

// router.post('/handle-form-actions',courseController.handleFormActions);
// router.get('/:id/edit',courseController.edit);
// router.put('/:id',courseController.update);
// router.patch('/:id/restore', courseController.restore);
// router.delete('/:id',courseController.delete);
// router.delete('/:id/force',courseController.forceDelete);
// router.get('/:slug', courseController.show);
module.exports = router;
