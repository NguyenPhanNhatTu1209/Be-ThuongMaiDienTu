const mongoose = require('mongoose');
async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/DoAnThuongMaiDienTu', {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,},);
    console.log('Success');
  } 
  catch (error) {
    console.log('fail');
  }
}
module.exports ={connect};