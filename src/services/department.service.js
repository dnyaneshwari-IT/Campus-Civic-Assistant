const pool = require("../config/database");

async function getAllDepartments() {
    const [departments] = await pool.execute(
        `SELECT id, name, description, is_active
         FROM departments
         WHERE is_active = 1
         ORDER BY id`
    );

    return departments;
}

module.exports = {
    getAllDepartments
};