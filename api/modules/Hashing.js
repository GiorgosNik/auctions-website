const bcrypt = require('bcrypt');

async function encode(password) {
  return await bcrypt.hash(password.toString(), 10);
}

function compare(password){
  const validPassword = bcrypt.compare(password, hashedPassword);
}

module.exports = encode;