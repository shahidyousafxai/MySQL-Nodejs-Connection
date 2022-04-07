const bcrypt = require("bcrypt");
require("dotenv").config();

// Function to hash users password
const hash = async (password) => {
    const salt = await bcrypt.genSalt(16);
    password = await bcrypt.hash(password.toString(), salt.toString());
    return password;
};

// Function to compare hashed password's
const compare = async (hash, pass) => {
    return bcrypt.compare(hash, pass);
};


module.exports = {
    hash,
    compare,
};