const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true}
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

