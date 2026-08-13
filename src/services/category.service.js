const pool = require("../config/database");

async function getAllCategories() {
    const [categories] = await pool.execute(
        `SELECT id, name, description, is_active
         FROM categories
         WHERE is_active = 1
         ORDER BY id`
    );

    return categories;
}

module.exports = {
    getAllCategories
};