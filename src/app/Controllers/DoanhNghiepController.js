const DoanhNghiep = require('../Models/DoanhNghiep');
class DoanhNghiepController {
  //GET enterprises/login
  async login(req, res, next) {
    const { Email, Password } = req.body
    const result = await DoanhNghiep.findOne({ Email, Password })
    if (result != null) {
      res.status(200).send(result)
    } else {
      res.status(400).send({
        'error': 'Login that bai!',
      });
    }
  }
  //Post enterprises/register
  async register(req, res, next) {
    // res.json(req.body);
    const formData = req.body;
    try {
      const result = await DoanhNghiep.create(formData);
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

module.exports = new DoanhNghiepController();