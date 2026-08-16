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

async function updateAuthorityDepartment(userId, departmentId) {
    const [users] = await pool.execute(
        `SELECT
            id,
            role
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [userId]
    );

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    if (users[0].role !== "AUTHORITY") {
        throw new Error("USER_NOT_AUTHORITY");
    }

    const [departments] = await pool.execute(
        `SELECT id
         FROM departments
         WHERE id = ?
         LIMIT 1`,
        [departmentId]
    );

    if (departments.length === 0) {
        throw new Error("DEPARTMENT_NOT_FOUND");
    }

    await pool.execute(
        `UPDATE users
         SET department_id = ?
         WHERE id = ?`,
        [departmentId, userId]
    );

    const [updatedUsers] = await pool.execute(
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

    return updatedUsers[0];
}

module.exports = {
    getAllUsers,
    updateUserStatus,
    updateAuthorityDepartment
};