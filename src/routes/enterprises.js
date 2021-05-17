const express = require("express");
const router = express.Router();

const doanhnghiepController = require("../app/Controllers/DoanhNghiepController.js");

router.get("/show-product-type", doanhnghiepController.ShowProductType);

router.post(
  "/create-shipping-package",
  doanhnghiepController.CreateShippingPackage
);
router.put(
  "/update-shipping-package",
  doanhnghiepController.UpdateShippingPackage
);
router.delete(
  "/delete-shipping-package",
  doanhnghiepController.DeleteShippingPackage
);
router.get("/show-shipping-package", doanhnghiepController.ShowShippingPackage);
router.get(
  "/show-shipping-package-by-enterprise",
  doanhnghiepController.ShowShippingPackageByEnterprise
);
router.get("/show-goidoanhnghiep", doanhnghiepController.showGoiDN);
router.get("/show-order-by-customers", doanhnghiepController.ShowOrderByCustomers);
router.put("/update-delivering-order", doanhnghiepController.UpdateDeliveringOrder);
router.put("/update-delivered-order", doanhnghiepController.UpdateDeliveredOrder);
router.get("/show-product-type", doanhnghiepController.ShowProductType);
router.post("/create-bill-package", doanhnghiepController.CreateBillPackage);
router.get("/show-order-in-one-week-by-enterprise", doanhnghiepController.ShowOrderByOneWeek);
router.get("/show-order-in-three-month-by-enterprise", doanhnghiepController.ShowOrderByThreeMonth);
router.get("/show-order-in-one-year-by-enterprise", doanhnghiepController.ShowOrderByOneYear);



//router.get('/create', khachhangController.create);
// router.post('/register',doanhnghiepController.register);
// router.post('/login',doanhnghiepController.login);
// router.post('/handle-form-actions',courseController.handleFormActions);
// router.get('/:id/edit',courseController.edit);
// router.put('/:id',courseController.update);
// router.patch('/:id/restore', courseController.restore);
// router.delete('/:id',courseController.delete);
// router.delete('/:id/force',courseController.forceDelete);
// router.get('/:slug', courseController.show);
module.exports = router;
