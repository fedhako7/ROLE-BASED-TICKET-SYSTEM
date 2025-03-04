const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at' } }

);


module.exports = mongoose.model("User", UserSchema);
