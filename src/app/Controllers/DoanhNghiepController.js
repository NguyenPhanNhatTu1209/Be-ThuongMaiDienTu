const DoanhNghiep = require("../Models/DoanhNghiep");
const GoiVanChuyen = require("../Models/GoiVanChuyen");
const TaiKhoan = require("../Models/TaiKhoan");
const GoiDoanhNghiep = require("../Models/GoiDoanhNghiep")
const { verifyToken } = require("../Controllers/index");
const { get } = require("../../routes/enterprises");

class DoanhNghiepController {

    //GET enterprises/show-goidoanhnghiep
    async showGoiDN(req, res, next) {
      var result = await GoiDoanhNghiep.find({DeleteAt: "False"});
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
  async CreateShippingPackage(req, res, next) {
    try {
      var createData = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id });
      if (userDb.Role == "DOANHNGHIEP") {
        createData.IdCongTy = _id;
        const shippingPackage = await GoiVanChuyen.create(createData);
        res.status(200).send({
          data: shippingPackage,
          error: "",
        });
      } else {
        res.status(400).send({
          data: "",
          error: "User is not DoanhNghiep Role",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  async UpdateShippingPackage(req, res, next) {
    try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id });
      console.log(userDb._id);
      if (userDb.Role == "DOANHNGHIEP") {
        const shippingPackage = await GoiVanChuyen.find({
          IdCongTy: userDb._id,
          Status: "ACTIVE",
        });
        console.log(shippingPackage);
        res.status(200).send({
          data: shippingPackage,
          error: "",
        });
      } else {
        res.status(400).send({
          data: "",
          error: "User is not DoanhNghiep Role",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }

  async DeleteShippingPackage(req, res, next) {
    try {
      var { idPackage } = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id });
      if (userDb.Role == "DOANHNGHIEP") {
        const shippingPackage = await GoiVanChuyen.findOneAndUpdate(
          { _id: idPackage },
          { Status: "DELETED" },
          { new: true }
        );
        res.status(200).send({
          data: shippingPackage,
          error: "Package is deleted",
        });
      } else {
        res.status(400).send({
          data: "",
          error: "User is not DoanhNghiep Role",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }
  //Get enterprises/show-shipping-package
  async ShowShippingPackage(req, res, next) {
    try {
      const updateData = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      const userDb = await TaiKhoan.findOne({ _id });
      if (userDb.Role == "DOANHNGHIEP") {
        const shippingPackage = await GoiVanChuyen.findOneAndUpdate(
          { _id: updateData._id },
          updateData,
          { new: true }
        );
        res.status(200).send({
          data: shippingPackage,
          error: "",
        });
      } else {
        res.status(400).send({
          data: "",
          error: "User is not DoanhNghiep Role",
        });
      }
    } catch (error) {
      res.status(500).send({
        data: error,
        error: "Internal Server Error",
      });
    }
  }
}

module.exports = new DoanhNghiepController();
