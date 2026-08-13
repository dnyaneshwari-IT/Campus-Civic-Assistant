const pool = require("../config/database");

async function createIssue({
    title,
    description,
    categoryId,
    departmentId,
    locationText,
    latitude,
    longitude,
    reportedBy
}) {
    const [result] = await pool.execute(
        `INSERT INTO issues
        (
            title,
            description,
            reported_by,
            category_id,
            department_id,
            status,
            priority,
            location_text,
            latitude,
            longitude
        )
        VALUES (?, ?, ?, ?, ?, 'SUBMITTED', 'MEDIUM', ?, ?, ?)`,
        [
            title,
            description,
            reportedBy,
            categoryId,
            departmentId,
            locationText || null,
            latitude ?? null,
            longitude ?? null
        ]
    );

    return {
        id: result.insertId,
        title,
        description,
        reportedBy,
        categoryId,
        departmentId,
        status: "SUBMITTED",
        priority: "MEDIUM",
        locationText: locationText || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null
    };
}

module.exports = {
    createIssue
};