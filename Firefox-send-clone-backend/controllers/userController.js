const User = require('../models/Users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newUser = async (req, res) => {

  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  // Check if user is already registered
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if(user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Create a new user
  user = new User(req.body);

  // Hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  try {
    await user.save();
    res.json({ msg: 'User created successfully' });
  } catch (error) {
    console.log(error);
  }
};