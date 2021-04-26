const KhachHang = require('../models/KhachHang');
class KhachHangController {
  //GET KhachHang/login
  async login(req, res, next) {
    const { Email, Password } = req.body;
    const result = await KhachHang.findOne({ Email, Password })
    if (result != null) {
      res.status(200).send(result);
    } else {
      res.status(400).send({
        'error': 'Login that bai!',
      });
    }
  }
  //Post customers/register
  async register(req, res, next) {
    // res.json(req.body);
    const formData = req.body;
    try {
      const result = await KhachHang.create(formData);
      if (result != null) {
        res.status(200).send(result);
      } else {
        res.status(400).send({
          'error': 'Dang ky that bai',
        });
      }
    }
    catch (error)
    {
      res.status(400).send({
        'error': 'Dang ky that bai',
      });
    }
  }
}

module.exports = new KhachHangController();