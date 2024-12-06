const multer = require('multer');
const fs = require('fs');
const path = require('path');
const express = require("express");

module.exports = ()=>{
    const uploadDir = path.join(__dirname, '../public/images');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, `${Date.now()}${ext}`);
            },
        })
    });
};