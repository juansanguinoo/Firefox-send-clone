const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: 'variables.env' });

exports.authUser = async (req, res, next) => {

  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(401).json({ msg: 'The user does not exist' });
    return next();
  }

  if (bcrypt.compareSync(password, user.password)){
    const token = jwt.sign({
      id: user._id,
      name: user.name,
      email: user.email
    }, process.env.SECRET, {
      expiresIn: '8h'
    });

    res.json({ token });
  }
  else{
    res.status(401).json({ msg: 'Incorrect password' });
    return next();
  }
}

exports.authenticatedUser = (req, res, next) => {
  res.json({ user: req.user })
}