const bcrypt = require("bcrypt");

const validPassword = async (password,hashedPassword) => {
    return  await bcrypt.compare(password,hashedPassword);
};

module.exports = validPassword;