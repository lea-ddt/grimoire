const sharp = require('sharp');
const fs = require("fs");
const path = require("path");

exports.compressImages = (req, res, next) => {
    if (req.file) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            fs.unlink(req.file.path, () => {}); // supprimer le fichier si non autorisé
            return res.status(400).json({ error: 'Format d\'image non autorisé. Seuls jpg, jpeg et png sont acceptés.' });
        }

        sharp(req.file.path)
            .resize({ height: 1080 })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile('images/' + req.file.filename + '.webp', (err, info) => {
                if (err) {
                    return res.status(400).json({ error: 'Erreur lors de la compression de l\'image.' });
                }

                fs.unlink(req.file.path, () => {
                    req.file.path = 'images/' + req.file.filename + '.webp';
                    next();
                });
            });
    } else {
        next();
    }
};
