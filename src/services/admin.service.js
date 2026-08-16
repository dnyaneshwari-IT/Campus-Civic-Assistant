const pool = require("../config/database");

async function getAllUsers() {
    const [users] = await pool.execute(
        `SELECT
            id,
            name,
            email,
            role,
            department_id,
            is_active,
            created_at,
            updated_at
         FROM users
         ORDER BY id ASC`
    );

    return users;
}

async function updateUserStatus(userId, isActive) {
    const [result] = await pool.execute(
        `UPDATE users
         SET is_active = ?
         WHERE id = ?`,
        [isActive, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    const [users] = await pool.execute(
        `SELECT
            id,
            name,
            email,
            role,
            department_id,
            is_active,
            created_at,
            updated_at
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [userId]
    );

    return users[0];
}

module.exports = {
    getAllUsers,
    updateUserStatus
};