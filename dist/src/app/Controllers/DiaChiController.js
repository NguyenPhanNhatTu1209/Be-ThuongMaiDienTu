const DiaChi = require("../Models/DiaChi");
const { verifyToken } = require("./index");

class DiaChiController {
  async ThemDiaChi(req, res, next) {
    try {
      const { address } = req.body;
      const token = req.get("Authorization").replace("Bearer ", "");
      const _id = await verifyToken(token);
      console.log(_id);
      const result = await DiaChi.create({ address, id_account: _id });
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error
      });
    }
  }

  async SuaDiaChi(req, res, next) {
    try {
      const { _id, address } = req.body;
      const result = await DiaChi.findOneAndUpdate({ _id }, { address }, { new: true });
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error
      });
    }
  }

  async XoaDiaChi(req, res, next) {
    try {
      const { _id } = req.body;
      const result = await DiaChi.findOneAndDelete({ _id });
      res.status(200).send({
        data: "address is deleted",
        error: ""
      });
    } catch (error) {
      res.status(500).send({
        data: "",
        error: error
      });
    }
  }
}

module.exports = new DiaChiController();