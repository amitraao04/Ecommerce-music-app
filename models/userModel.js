// This code defines a Mongoose schema for a User model in a MongoDB database.
// The schema includes fields for name, email, and password, with validation rules.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
