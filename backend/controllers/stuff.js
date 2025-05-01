const Book = require('../models/Thing');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

exports.getBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
}

// Find 3 books with the best average rating in the books collection using mongoose function
exports.getBestRatedBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
}

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
    } : { ...req.body };

    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId !== req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.findOneAndUpdate({ _id: req.params.id }, bookObject)
                        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId !== req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

// Add rating to book and recalculate average rating
exports.addRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book.ratings.some(rating => rating.userId === req.body.userId)) {
                book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
                book.averageRating = parseFloat((book.ratings.reduce((a, b) => a + b.grade, 0) / book.ratings.length).toFixed(1));

                Book.findOneAndUpdate({ _id: req.params.id }, { $push: { ratings: { userId: req.body.userId, grade: req.body.rating } }, $set: { averageRating: book.averageRating } }, {new: true})
                    .then((bookModified) => res.status(200).json(bookModified))
                    .catch(error => res.status(400).json({ error }));
            }
            else res.status(401).json({ message: 'Vous avez déjà publié une note !' });
        })
        .catch(error => res.status(400).json({ error }));
}