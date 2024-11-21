const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('node:fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        // Log the entire req.files object
        console.log('req.files:', req.files);

        // Check if req.files is populated
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send({ msg: "No files were uploaded" });
        }

        // Extract the file from req.files
        const fileKey = Object.keys(req.files)[0];
        const file = req.files[fileKey];

        // Log the key and file object
        console.log('Key:', fileKey);
        console.log('File:', file);

        if (!file) {
            return res.status(400).send({ msg: "File object is missing" });
        }

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "Size too large" });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File format is incorrect" });
        }

        cloudinary.uploader.upload(file.tempFilePath, { folder: 'test' }, async (err, result) => {
            if (err) throw err;

            removeTmp(file.tempFilePath);

            res.json({ public_id: result.public_id, url: result.secure_url });
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: "No images selected" });

        cloudinary.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;

            res.json({ msg: "Deleted" });
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    });
};

module.exports = router;
