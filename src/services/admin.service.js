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

module.exports = {
    getAllUsers
};