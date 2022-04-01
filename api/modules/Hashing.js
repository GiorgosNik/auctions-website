const bcrypt = require('bcrypt');

async function encode(password) {
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
}

async function compare(password){
  const validPassword = await bcrypt.compare(password, hashedPassword);
}

module.exports = { encode };