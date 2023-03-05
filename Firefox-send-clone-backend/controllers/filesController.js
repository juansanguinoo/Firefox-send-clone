const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Url = require('../models/Url');

exports.uploadFile = async (req, res, next) => {

  const multerConfig = {
    limits : { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads')
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, `${shortid.generate()}${extension}`);
      }
    }),
  }
  
  const upload = multer(multerConfig).single('file');

  upload(req, res, async(error) => {

    if(!error) {
      res.json({ file: req.file.filename })
    } else {
      console.log(error);
      return next();
    }
  })
}

exports.deleteFile = async (req, res) => {
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
  } catch (error) {
    console.log(error);
  }
}

exports.downloadFile = async (req, res, next) => {

  const { file } = req.params;
  const url = await Url.findOne({ url: file });

  const fileDownloads = __dirname + '/../uploads/' + url.name;
  res.download(fileDownloads);

  const { downloads, name } = url;

  if(downloads === 1){
    req.file = name;
    await Url.findOneAndRemove(url.id);
    next();
    
  } else {
    url.downloads--;
    await url.save();
  }
}