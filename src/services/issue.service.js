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

async function getIssuesByUser(userId) {
    const [issues] = await pool.execute(
        `SELECT
            i.id,
            i.title,
            i.description,
            i.reported_by,
            i.category_id,
            c.name AS category_name,
            i.department_id,
            d.name AS department_name,
            i.assigned_to,
            i.status,
            i.priority,
            i.location_text,
            i.latitude,
            i.longitude,
            i.created_at,
            i.updated_at
         FROM issues i
         INNER JOIN categories c
             ON i.category_id = c.id
         INNER JOIN departments d
             ON i.department_id = d.id
         WHERE i.reported_by = ?
         ORDER BY i.created_at DESC`,
        [userId]
    );

    return issues;
}

async function getIssueById(issueId, userId) {
    const [issues] = await pool.execute(
        `SELECT
            i.id,
            i.title,
            i.description,
            i.reported_by,
            i.category_id,
            c.name AS category_name,
            i.department_id,
            d.name AS department_name,
            i.assigned_to,
            i.status,
            i.priority,
            i.location_text,
            i.latitude,
            i.longitude,
            i.created_at,
            i.updated_at
         FROM issues i
         INNER JOIN categories c
             ON i.category_id = c.id
         INNER JOIN departments d
             ON i.department_id = d.id
         WHERE i.id = ?
           AND i.reported_by = ?
         LIMIT 1`,
        [issueId, userId]
    );

    return issues[0] || null;
}

module.exports = {
    createIssue,
    getIssuesByUser,
    getIssueById
};