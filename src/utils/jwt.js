const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            role: user.role,
            departmentId: user.departmentId || null
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );
}

function verifyToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
}

module.exports = {
    generateToken,
    verifyToken
};