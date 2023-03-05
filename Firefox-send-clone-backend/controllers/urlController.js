const Url = require('../models/Url');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.createUrl = async (req, res, next) => {

  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { originalName, name } = req.body;

  const url = new Url();
  url.url = shortid.generate();
  url.name = name;
  url.originalName = originalName;

  if(req.user){
    const { password, downloads } = req.body;

    if(downloads){
      url.downloads = downloads;
    }

    if(password){
      const salt = await bcrypt.genSalt(10);
      url.password = await bcrypt.hash(password, salt);
    }

    url.author = req.user.id;
  }

  try {
    await url.save();
    return res.json({ msg: `${url.url}` });
    next();
  } catch (error) {
    console.log(error);
  }
}

exports.fullUrl = async (req, res) => {
  try {
    const urls = await Url.find({}).select('url -_id');
    res.json({urls});
  } catch (error) {
    console.log(error);
  }
}

exports.hasPassword = async (req, res, next) => {
  const url = await Url.findOne({ url: req.params.url });

  if(!url){
    res.status(404).json({ msg: 'File not found' });
    return next();
  }

  if(url.password){
    return res.json({ password: true, url: url.url });
  }

  next();
}

exports.verifyPassword = async (req, res, next) => {

  const { url } = req.params;
  const { password } = req.body;

  const urlData = await Url.findOne({ url });

  if(bcrypt.compareSync(password, urlData.password)){
    next();
  } else {
    return res.status(401).json({ msg: 'Incorrect password' });
  }
}

exports.getUrl = async (req, res, next) => {

  const url = await Url.findOne({ url: req.params.url });

  if(!url){
    res.status(404).json({ msg: 'File not found' });
    return next();
  }

  res.json({ file: url.name, password: false });

  next();
}