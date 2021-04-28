const express = require('express');
const router = express.Router();

const doanhnghiepController = require('../app/Controllers/DoanhNghiepController.js');

router.get('/show_goidoanhnghiep', doanhnghiepController.showGoiDN);
// router.post('/register',doanhnghiepController.register);
// router.post('/login',doanhnghiepController.login);
// router.post('/handle-form-actions',courseController.handleFormActions);   
// router.get('/:id/edit',courseController.edit);
// router.put('/:id',courseController.update);
// router.patch('/:id/restore', courseController.restore);
// router.delete('/:id',courseController.delete);
// router.delete('/:id/force',courseController.forceDelete);
// router.get('/:slug', courseController.show);
module.exports = router;