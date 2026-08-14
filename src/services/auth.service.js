const pool = require("../config/database");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

async function registerUser({ name, email, password }) {
    const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existingUsers.length > 0) {
        throw new Error("EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
        `INSERT INTO users
        (name, email, password_hash, role)
        VALUES (?, ?, ?, 'STUDENT')`,
        [name, email, passwordHash]
    );

    return {
        id: result.insertId,
        name,
        email,
        role: "STUDENT"
    };
}

async function loginUser({ email, password }) {
    const [users] = await pool.execute(
        `SELECT
            id,
            name,
            email,
            password_hash,
            role,
            department_id,
            is_active
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
    );

    if (users.length === 0) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const user = users[0];

    if (!user.is_active) {
        throw new Error("ACCOUNT_INACTIVE");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
        departmentId: user.department_id
    });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            departmentId: user.department_id
        },
        token
    };
}

module.exports = {
    registerUser,
    loginUser
};