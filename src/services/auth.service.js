const bcrypt = require("bcrypt");
const pool = require("../config/database");
const ROLES = require("../utils/roles");
const { generateToken } = require("../utils/jwt");

async function registerUser({ name, email, password }) {

    if (!name || !email || !password) {
        throw new Error("Name, email and password are required");
    }

    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@")) {
        throw new Error("Invalid email address");
    }

    const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [normalizedEmail]
    );

    if (existingUsers.length > 0) {
        throw new Error("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)`,
        [name.trim(), normalizedEmail, passwordHash, ROLES.STUDENT]
    );

    return {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        role: ROLES.STUDENT
    };
}
async function loginUser({ email, password }) {

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
        `SELECT id, name, email, password_hash, role, is_active
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [normalizedEmail]
    );

    if (users.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = users[0];

    if (!user.is_active) {
        throw new Error("Account is inactive");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken({
        userId: user.id,
        role: user.role
    });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
}

module.exports = {
    registerUser,
    loginUser
};