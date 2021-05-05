const express = require("express");
const router = express.Router();

const meController = require("../app/Controllers/MeController");
const diachiController = require("../app/Controllers/DiaChiController");

//router.get('/create', khachhangController.create);
router.get("/information", meController.information);
router.put("/edit-profile", meController.editProfile);
router.post("/add-address", diachiController.ThemDiaChi);
router.put("/edit-address", diachiController.SuaDiaChi);
router.delete("/delete-address", diachiController.XoaDiaChi);
router.put("/choose_goidichvukhachhang", meController.ChonGoiDichVuKH);
router.put("/choose_goidichvudoanhnghiep", meController.ChonGoiDichVuDN);
router.put("/change-password", meController.ChangePassword);
router.get("/show-product-type", meController.ShowProductType);
router.get('/success', meController.PaymentSuccess);
router.get('/cancel', meController.CancelPayment);
router.get('/successPackageBill', meController.PaymentSuccessBillPackage);
router.get('/cancelPackageBill', meController.CancelPaymentBillPackage);



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
