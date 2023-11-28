const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const symbolRegex = /[~`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/]/;

module.exports = {
  generateAccessToken: async (user) => {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return token;
  },
  decodePayload: async (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  },
  isValidEmail: async (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  },
  isValidPasswords: async (password) => {
    if (password.length < 8) {
      return false;
    }
    let characterTypeCount = 0;
    if (uppercaseRegex.test(password)) {
      characterTypeCount++;
    }

    if (lowercaseRegex.test(password)) {
      characterTypeCount++;
    }

    if (numberRegex.test(password)) {
      characterTypeCount++;
    }

    if (symbolRegex.test(password)) {
      characterTypeCount++;
    }
    if (characterTypeCount < 3) {
      return false;
    }
    return true;
  },
  encryptPassword: async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
  },
  isPasswordCorrect: async (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },
};
