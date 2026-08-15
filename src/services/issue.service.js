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

async function getIssuesForAuthority(departmentId) {
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
         WHERE i.department_id = ?
         ORDER BY i.created_at DESC`,
        [departmentId]
    );

    return issues;
}

async function assignIssue(issueId, authorityId, departmentId) {
    const [issues] = await pool.execute(
        `SELECT id, department_id
         FROM issues
         WHERE id = ?
         LIMIT 1`,
        [issueId]
    );

    if (issues.length === 0) {
        throw new Error("ISSUE_NOT_FOUND");
    }

    const issue = issues[0];

    if (Number(issue.department_id) !== Number(departmentId)) {
        throw new Error("DEPARTMENT_ACCESS_DENIED");
    }

    const [result] = await pool.execute(
        `UPDATE issues
         SET assigned_to = ?,
             status = 'ASSIGNED',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [authorityId, issueId]
    );

    if (result.affectedRows === 0) {
        throw new Error("ASSIGNMENT_FAILED");
    }

    const [updatedIssues] = await pool.execute(
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
         LIMIT 1`,
        [issueId]
    );

    return updatedIssues[0];
}

async function updateIssueStatus(
    issueId,
    newStatus,
    departmentId
) {
    const [issues] = await pool.execute(
        `SELECT
            id,
            department_id,
            status
         FROM issues
         WHERE id = ?
         LIMIT 1`,
        [issueId]
    );

    if (issues.length === 0) {
        throw new Error("ISSUE_NOT_FOUND");
    }

    const issue = issues[0];

    if (
        Number(issue.department_id) !==
        Number(departmentId)
    ) {
        throw new Error("DEPARTMENT_ACCESS_DENIED");
    }

    const allowedTransitions = {
        SUBMITTED: ["ASSIGNED"],
        ASSIGNED: ["IN_PROGRESS"],
        IN_PROGRESS: ["RESOLVED"],
        RESOLVED: []
    };

    const allowedNextStatuses =
        allowedTransitions[issue.status];

    if (
        !allowedNextStatuses ||
        !allowedNextStatuses.includes(newStatus)
    ) {
        throw new Error("INVALID_STATUS_TRANSITION");
    }

    const [result] = await pool.execute(
        `UPDATE issues
         SET status = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [newStatus, issueId]
    );

    if (result.affectedRows === 0) {
        throw new Error("STATUS_UPDATE_FAILED");
    }

    const [updatedIssues] = await pool.execute(
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
         LIMIT 1`,
        [issueId]
    );

    return updatedIssues[0];
}

async function updateIssuePriority(
    issueId,
    newPriority,
    departmentId
) {
    const allowedPriorities = [
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT"
    ];

    if (!allowedPriorities.includes(newPriority)) {
        throw new Error("INVALID_PRIORITY");
    }

    const [issues] = await pool.execute(
        `SELECT
            id,
            department_id
         FROM issues
         WHERE id = ?
         LIMIT 1`,
        [issueId]
    );

    if (issues.length === 0) {
        throw new Error("ISSUE_NOT_FOUND");
    }

    const issue = issues[0];

    if (
        Number(issue.department_id) !==
        Number(departmentId)
    ) {
        throw new Error("DEPARTMENT_ACCESS_DENIED");
    }

    const [result] = await pool.execute(
        `UPDATE issues
         SET priority = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [newPriority, issueId]
    );

    if (result.affectedRows === 0) {
        throw new Error("PRIORITY_UPDATE_FAILED");
    }

    const [updatedIssues] = await pool.execute(
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
         LIMIT 1`,
        [issueId]
    );

    return updatedIssues[0];
}

async function addIssueUpdate(
    issueId,
    updatedBy,
    departmentId,
    message
) {
    const [issues] = await pool.execute(
        `SELECT
            id,
            department_id
         FROM issues
         WHERE id = ?
         LIMIT 1`,
        [issueId]
    );

    if (issues.length === 0) {
        throw new Error("ISSUE_NOT_FOUND");
    }

    const issue = issues[0];

    if (
        Number(issue.department_id) !==
        Number(departmentId)
    ) {
        throw new Error("DEPARTMENT_ACCESS_DENIED");
    }

    const [result] = await pool.execute(
        `INSERT INTO issue_updates
        (
            issue_id,
            updated_by,
            message
        )
        VALUES (?, ?, ?)`,
        [
            issueId,
            updatedBy,
            message
        ]
    );

    const [updates] = await pool.execute(
        `SELECT
            iu.id,
            iu.issue_id,
            iu.updated_by,
            u.name AS updated_by_name,
            iu.message,
            iu.created_at
         FROM issue_updates iu
         INNER JOIN users u
             ON iu.updated_by = u.id
         WHERE iu.id = ?
         LIMIT 1`,
        [result.insertId]
    );

    return updates[0];
}

async function getIssueUpdates(
    issueId,
    userId,
    userRole,
    departmentId
) {
    const [issues] = await pool.execute(
        `SELECT
            id,
            reported_by,
            department_id
         FROM issues
         WHERE id = ?
         LIMIT 1`,
        [issueId]
    );

    if (issues.length === 0) {
        throw new Error("ISSUE_NOT_FOUND");
    }

    const issue = issues[0];

    if (userRole === "STUDENT") {
        if (Number(issue.reported_by) !== Number(userId)) {
            throw new Error("ACCESS_DENIED");
        }
    }

    if (userRole === "AUTHORITY") {
        if (
            Number(issue.department_id) !==
            Number(departmentId)
        ) {
            throw new Error("DEPARTMENT_ACCESS_DENIED");
        }
    }

    const [updates] = await pool.execute(
        `SELECT
            iu.id,
            iu.issue_id,
            iu.updated_by,
            u.name AS updated_by_name,
            iu.message,
            iu.created_at
         FROM issue_updates iu
         INNER JOIN users u
             ON iu.updated_by = u.id
         WHERE iu.issue_id = ?
         ORDER BY iu.created_at ASC`,
        [issueId]
    );

    return updates;
}

module.exports = {
    createIssue,
    getIssuesByUser,
    getIssueById,
    getIssuesForAuthority,
    assignIssue,
    updateIssueStatus,
    updateIssuePriority,
    addIssueUpdate,
    getIssueUpdates
};