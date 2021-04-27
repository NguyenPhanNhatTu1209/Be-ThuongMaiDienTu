const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const GoiDoanhNghiep = new Schema({
  ThongTin: {type:String, required: true,},
  NgayBatDau: {type:Date,required: true,},
  NgayKetThuc: {type:Date, required: true,},
  ChiPhi: {type:String,required: true,},
  TenGoi: { type: String,required: true,},
  HanSuDung: { type: String,required: true,},
  SoDonHang: { type: Number,required: true,},
},{
  timestamps: true,
});

// hello
// add plugin
// mongoose.plugin(slug);
// Course.plugin(mongooseDelete, { 
//   overrideMethods: 'all',
//    deletedAt : true,
//  });

module.exports=mongoose.model('enterprise_package', GoiDoanhNghiep);