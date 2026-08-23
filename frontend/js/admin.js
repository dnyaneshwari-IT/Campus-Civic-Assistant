const API_BASE_URL = "http://localhost:5000/api/v1";

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");


// --------------------------------------------------
// Authentication check
// --------------------------------------------------

if (!token || !storedUser) {
    window.location.href = "login.html";
}

const currentUser = JSON.parse(storedUser);


// Only ADMIN can access this page

if (currentUser.role !== "ADMIN") {
    alert("Access denied. Admin account required.");

    window.location.href = "login.html";
}


// Display admin name

document.getElementById("adminName").textContent =
    currentUser.name;


// --------------------------------------------------
// API helper
// --------------------------------------------------

async function apiRequest(url, options = {}) {

    const response = await fetch(
        `${API_BASE_URL}${url}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`,

                ...(options.headers || {})
            }
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {

        throw new Error(
            result.message || "Request failed"
        );
    }

    return result;
}


// --------------------------------------------------
// Load users
// --------------------------------------------------

async function loadUsers() {

    const tableBody =
        document.getElementById("usersTableBody");

    const errorElement =
        document.getElementById("userError");

    errorElement.textContent = "";

    tableBody.innerHTML = `
        <tr>
            <td colspan="7">
                Loading users...
            </td>
        </tr>
    `;

    try {

        const result =
            await apiRequest("/admin/users");

        const users = result.data;

        updateUserStatistics(users);

        if (users.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No users found.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            users.map(user => {

                const statusClass =
                    user.is_active
                        ? "status-active"
                        : "status-inactive";

                const statusText =
                    user.is_active
                        ? "ACTIVE"
                        : "INACTIVE";

                return `
                    <tr>

                        <td>${user.id}</td>

                        <td>${escapeHtml(user.name)}</td>

                        <td>${escapeHtml(user.email)}</td>

                        <td>
                            ${escapeHtml(user.role)}
                        </td>

                        <td>
                            ${user.department_id ?? "-"}
                        </td>

                        <td class="${statusClass}">
                            ${statusText}
                        </td>

                        <td>

                            <button
                                class="action-button ${
                                    user.is_active
                                        ? "deactivate-button"
                                        : "activate-button"
                                }"
                                onclick="toggleUserStatus(
                                    ${user.id},
                                    ${user.is_active}
                                )"
                            >
                                ${
                                    user.is_active
                                        ? "Deactivate"
                                        : "Activate"
                                }
                            </button>

                        </td>

                    </tr>
                `;

            }).join("");

    } catch (error) {

        console.error(
            "Load users error:",
            error
        );

        errorElement.textContent =
            error.message;
    }
}


// --------------------------------------------------
// Statistics
// --------------------------------------------------

function updateUserStatistics(users) {

    const total =
        users.length;

    const active =
        users.filter(
            user => user.is_active
        ).length;

    const inactive =
        total - active;

    document.getElementById(
        "totalUsers"
    ).textContent = total;

    document.getElementById(
        "activeUsers"
    ).textContent = active;

    document.getElementById(
        "inactiveUsers"
    ).textContent = inactive;
}


// --------------------------------------------------
// Activate / Deactivate user
// --------------------------------------------------

async function toggleUserStatus(
    userId,
    currentStatus
) {

    const newStatus =
        !Boolean(currentStatus);

    const confirmation =
        newStatus
            ? "Activate this user?"
            : "Deactivate this user?";

    if (!confirm(confirmation)) {
        return;
    }

    try {

        await apiRequest(
            `/admin/users/${userId}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    is_active: newStatus
                })
            }
        );

        await loadUsers();

    } catch (error) {

        console.error(
            "Update user status error:",
            error
        );

        alert(error.message);
    }
}


// --------------------------------------------------
// Load issues
// --------------------------------------------------

async function loadIssues() {

    const tableBody =
        document.getElementById(
            "issuesTableBody"
        );

    const errorElement =
        document.getElementById(
            "issueError"
        );

    errorElement.textContent = "";

    tableBody.innerHTML = `
        <tr>
            <td colspan="7">
                Loading issues...
            </td>
        </tr>
    `;

    try {

        const result =
            await apiRequest(
                "/issues/admin/all"
            );

        const issues =
            result.data;

        document.getElementById(
            "totalIssues"
        ).textContent = issues.length;

        if (issues.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No issues found.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            issues.map(issue => {

                return `
                    <tr>

                        <td>
                            ${issue.id}
                        </td>

                        <td>
                            ${escapeHtml(
                                issue.title
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                issue.reported_by_name
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                issue.department_name
                            )}
                        </td>

                        <td>
                            ${
                                issue.assigned_to_name
                                    ? escapeHtml(
                                        issue.assigned_to_name
                                    )
                                    : "-"
                            }
                        </td>

                        <td>
                            <span class="status-badge">
                                ${escapeHtml(
                                    issue.status
                                )}
                            </span>
                        </td>

                        <td>
                            <span class="status-badge">
                                ${escapeHtml(
                                    issue.priority
                                )}
                            </span>
                        </td>

                    </tr>
                `;

            }).join("");

    } catch (error) {

        console.error(
            "Load issues error:",
            error
        );

        errorElement.textContent =
            error.message;
    }
}


// --------------------------------------------------
// Logout
// --------------------------------------------------

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";
        }
    );


// --------------------------------------------------
// Refresh buttons
// --------------------------------------------------

document
    .getElementById(
        "refreshUsersButton"
    )
    .addEventListener(
        "click",
        loadUsers
    );


document
    .getElementById(
        "refreshIssuesButton"
    )
    .addEventListener(
        "click",
        loadIssues
    );


// --------------------------------------------------
// Basic HTML escaping
// --------------------------------------------------

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// --------------------------------------------------
// Initial loading
// --------------------------------------------------

loadUsers();
loadIssues();