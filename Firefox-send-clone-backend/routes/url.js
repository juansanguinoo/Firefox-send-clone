const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
  [
    check('name', 'Upload a file').not().isEmpty(),
    check('originalName', 'Upload a file').not().isEmpty()
  ],
  auth,
  urlController.createUrl
);

router.get('/',
  urlController.fullUrl
)

router.get('/:url',
  urlController.hasPassword,
  urlController.getUrl,
)

router.post('/:url',
  urlController.verifyPassword,
  urlController.getUrl,
)

module.exports = router;