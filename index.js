const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/connectdb');
mongoose.connection.once('open',function(){
    console.log('Ket noi duoc thuc hien');
})