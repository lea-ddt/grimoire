const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

const {getAllBooks, getBestRatedBooks, getBook, addBook, updateBook, deleteBook, addRating} = require('../controllers/stuff');
// const {compressImages} = require("../middleware/compress-images");

router.get('/', getAllBooks);
router.get('/bestrating', getBestRatedBooks);
router.get('/:id', getBook);
router.post('/', auth, multer, addBook);
router.put('/:id', auth, multer, updateBook);
router.delete('/:id', auth, deleteBook);
router.post('/:id/rating', auth, addRating);

module.exports = router;