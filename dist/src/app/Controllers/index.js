var jwt = require("jsonwebtoken");
const paypal = require("paypal-rest-sdk");
const PaypalModel = require("../Models/Paypal");
const bucket = require("../../config/firebase/firebase");
const uuid = require('uuid-v4');
const fs = require('fs');
async function createToken(idUser) {
  const token = await jwt.sign(idUser, process.env.ACCESS_TOKEN);
  return token;
}

async function createTokenTime(idUser) {
  const token = await jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 60,
    data: idUser
  }, process.env.ACCESS_TOKEN);
  return token;
}

async function verifyToken(token) {
  const idUser = await jwt.verify(token, process.env.ACCESS_TOKEN);
  return idUser;
}

function makePassword(length) {
  var result = [];
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join("");
}
function FormatDollar(tienDo) {
  var tienDo2f = Math.round(tienDo * 100) / 100;
  var tienDo3f = Math.round(tienDo * 1000) / 1000;
  return tienDo % tienDo2f == 0 ? tienDo2f : tienDo2f > tienDo3f ? tienDo2f : tienDo2f + 0.01;
}

function paymentMethod(price, idDonHang, next) {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: `http:///localhost:3000/me/success?price=${price}&idDonHang=${idDonHang}`,
      cancel_url: "http://localhost:3000/me/cancel"
    },
    transactions: [{
      item_list: {
        items: [{
          name: "Phí vận chuyển",
          sku: "001",
          price: `${price}`,
          currency: "USD",
          quantity: 1
        }]
      },
      amount: {
        currency: "USD",
        total: `${price}`
      },
      description: "Phí vận chuyển SuperHub"
    }]
  };
  paypal.payment.create(create_payment_json, async (error, payment) => {
    await next(error, payment);
  });
}

function paymentMethodPackage(price, idDonHang, next) {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: `http:///localhost:3000/me/successPackageBill?price=${price}&idDonHang=${idDonHang}`,
      cancel_url: "http://localhost:3000/me/cancelPackageBill"
    },
    transactions: [{
      item_list: {
        items: [{
          name: "Phí vận chuyển",
          sku: "001",
          price: `${price}`,
          currency: "USD",
          quantity: 1
        }]
      },
      amount: {
        currency: "USD",
        total: `${price}`
      },
      description: "Phí vận chuyển SuperHub"
    }]
  };
  paypal.payment.create(create_payment_json, async (error, payment) => {
    await next(error, payment);
  });
}

async function RefundPayment(id_Order, next) {
  const resultPaypal = await PaypalModel.findOne({ id_Order });
  const data = {
    amount: {
      total: `${resultPaypal.Transaction}`,
      currency: "USD"
    }
  };

  paypal.sale.refund(resultPaypal.id_Paypal, data, async function (error, refund) {
    await next(error, refund);
  });
}

async function UploadImage(name, folder) {
  const path = "./uploads/" + name;
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: uuid()
    },
    contentType: "image/png",
    cacheControl: "public, max-age=31536000"
  };

  const tasks = await bucket.upload(path, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: metadata,
    destination: folder + name
  });

  const urls = await tasks[0].getSignedUrl({
    action: "read",
    expires: "03-09-2491"
  });

  // Delete image
  fs.unlinkSync(path);

  return urls[0];
}

module.exports = {
  createToken,
  verifyToken,
  createTokenTime,
  makePassword,
  Payment: paymentMethod,
  FormatDollar,
  paymentMethodPackage,
  RefundPayment,
  UploadImage
};