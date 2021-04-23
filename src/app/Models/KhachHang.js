const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const KhachHang = new Schema({
  TenKhachHang: {type:String, required: true,},
  GioiTinh: {type:String,required: true,},
  NamSinh: {type:String, required: true,},
  Email: {type:String,required: true,},
  SoDienThoai: { type: String,required: true,},
  DiaChi: { type: String,required: true,},
  Password: { type: String,required: true,},

},{
  timestamps: true,
});

// add plugin
// mongoose.plugin(slug);
// Course.plugin(mongooseDelete, { 
//   overrideMethods: 'all',
//    deletedAt : true,
//  });

module.exports=mongoose.model('customer', KhachHang);