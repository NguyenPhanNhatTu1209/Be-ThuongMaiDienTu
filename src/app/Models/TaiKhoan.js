const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const TaiKhoan = new Schema({
  Email: {type:String,required: true,},
  Password: { type: String,required: true,},
  Role: { type: String,required: true,},
  resetPasswordToken: { type: String,default: null,},
  resetPasswordExpires: { type: Date,default: null,}
},{
  timestamps: true,
});

// add plugin
// mongoose.plugin(slug);
// Course.plugin(mongooseDelete, { 
//   overrideMethods: 'all',
//    deletedAt : true,
//  });

module.exports=mongoose.model('account', TaiKhoan);