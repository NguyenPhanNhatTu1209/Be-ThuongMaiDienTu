const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const DoanhNghiep = new Schema({
  TenDoanhNghiep: {type:String, required: true,},
  Logo: {type:String,required: true,},
  SoDienThoai: {type:String, required: true,},
  Email: {type:String,required: true,},
  DiaChi: { type: String,required: true,},
  GiayPhep: { type: String,required: true,},
  Password: { type: String,required: true,},
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

module.exports=mongoose.model('enterprises', DoanhNghiep);