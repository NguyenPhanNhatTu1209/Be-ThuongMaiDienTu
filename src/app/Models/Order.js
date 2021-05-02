const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = new Schema({
  TenNguoiNhan: {type:String, required: true,},
  SoDienThoaiNguoiNhan: {type:String,required: true,},
  NoiLayHang: { type: String,required: true,},
  NoiGiaoHang: { type: String,required: true,},
  TrangThai: { type: String,required: true,},
  KhoiLuong: { type: Number,required: true,},
  TenLoaiHang: { type: String,required: true,},
  GiamGia: { type: Number,required: null,},
  TongChiPhi: { type: String,required: true,},
  id_KhachHang: {type: String, default: null},
},{
  timestamps: true,
});

// add plugin
// mongoose.plugin(slug);
// Course.plugin(mongooseDelete, { 
//   overrideMethods: 'all',
//    deletedAt : true,
//  });

module.exports=mongoose.model('order', Order);