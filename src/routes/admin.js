const express = require("express");
const router = express.Router();

const adminController = require("../app/Controllers/AdminController");

//router.get('/create', khachhangController.create);
router.post("/create-goikhachhang", adminController.creategoiKH);
router.post("/create-goidoanhnghiep", adminController.creategoiDN);
router.put("/update-goidoanhnghiep", adminController.updategoiDN);
router.put("/update-goikhachhang", adminController.updategoiKH);
router.put("/deleted-goikhachhang", adminController.deleteGoiKH);
router.put("/deleted-goidoanhnghiep", adminController.deleteGoiDN);
router.put("/confirm-doanhnghiep", adminController.DuyetDoanhNghiep);
router.get("/show-customers", adminController.ShowCustomers);
router.put("/editprofile-customer", adminController.EditProfileCustomer);
router.get("/show-enterprises", adminController.ShowEnterprises);
router.get("/show-enterprises-inactive", adminController.ShowEnterprisesInactive);
router.get("/show-enterprises-active", adminController.ShowEnterprisesActive);
router.put("/editprofile-enterprise", adminController.EditProfileEnterprise);
router.get("/show-product-type", adminController.ShowProductType);
router.post("/create-product-type", adminController.CreateProductType);
router.put("/update-product-type", adminController.UpdateProductType);
router.put("/delete-product-type", adminController.DeleteProductType);
router.get("/search-khachhang", adminController.SearchKH);
router.get("/show-thongke-thang", adminController.ShowThongKeThang);
router.get("/show-thongke-thang-truoc", adminController.ShowThongKeThangTruoc);
router.get("/hach-toan-doi-soat-trong-thang", adminController.HachToanDoiSoatTrongThang);
router.get("/hach-toan-doi-soat-thang-truoc", adminController.HachToanDoiSoatThangTruoc);
router.get("/show-thong-ke-30ngay", adminController.ShowThongKe30Ngay);






// router.post('/handle-form-actions',courseController.handleFormActions);
// router.get('/:id/edit',courseController.edit);
// router.put('/:id',courseController.update);
// router.patch('/:id/restore', courseController.restore);
// router.delete('/:id',courseController.delete);
// router.delete('/:id/force',courseController.forceDelete);
// router.get('/:slug', courseController.show);
module.exports = router;
