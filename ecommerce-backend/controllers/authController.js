const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already exists' });

  const user = await User.create({ name, email, password });
  const emailToken = createToken(user._id);

  const url = `http://localhost:5000/api/auth/verify/${emailToken}`;
  await sendEmail(email, 'Verify your email', `<a href="${url}">Click to verify</a>`);

  res.status(201).json({ message: 'Signup success! Check email to verify.' });
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: 'Email verified! You can log in.' });
  } catch {
    res.status(400).json({ message: 'Verification failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVerified) return res.status(401).json({ message: 'Invalid credentials or not verified' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Incorrect password' });

  const token = createToken(user._id);
  res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role } });
};
