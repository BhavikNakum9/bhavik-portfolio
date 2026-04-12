// Admin Dashboard Functions

function renderAdminUsers() {
    const list = document.getElementById('admin-users-list');
    if (!list) return;

    const users = db.getUsers();
    list.innerHTML = '';

    users.forEach(u => {
        const tr = document.createElement('tr');
        // Status Badge Style
        let statusStyle = 'background: #d1fae5; color: #047857;';
        if (u.status === 'pending') statusStyle = 'background: #fef3c7; color: #b45309;';

        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <div style="width:30px; height:30px; background:var(--primary-color); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">
                        ${u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        ${u.name}<br>
                        <span style="font-size: 0.75rem; color: var(--text-light);">${u.phone || ''}</span>
                    </div>
                </div>
            </td>
            <td>${u.email}</td>
            <td>
                <span style="padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; ${statusStyle}">
                    ${u.status ? u.status.toUpperCase() : 'ACTIVE'}
                </span>
            </td>
            <td>
                ${u.status === 'pending' ? `
                    <button onclick="approveUser('${u.email}')" class="btn btn-outline" style="padding: 2px 8px; color: green; border-color: green; margin-right: 5px;">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="rejectUser('${u.email}')" class="btn btn-outline" style="padding: 2px 8px; color: red; border-color: red;">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
                ${u.role !== 'admin' && u.status !== 'pending' ? `
                <button onclick="adminDeleteAccount('${u.email}')" style="color:red; background:none; border:none; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </td>
        `;
        list.appendChild(tr);
    });
}

function approveUser(email) {
    if (!confirm(`Approve registration for ${email}?`)) return;
    try {
        const adminEmail = JSON.parse(localStorage.getItem('user')).email;
        db.adminUpdateUser(adminEmail, email, { status: 'active' });

        // Simulate SMS
        alert(`[PRIME PROPERTIES] SMS SENT to ${email}:\n\nCongratulations! Your account has been APPROVED by the admin. You can now log in to view premium properties.`);

        showToast(`User ${email} approved`, 'success');
        renderAdminUsers();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

function rejectUser(email) {
    if (!confirm(`Reject and delete registration for ${email}?`)) return;
    try {
        const adminEmail = JSON.parse(localStorage.getItem('user')).email;
        db.adminDeleteUser(adminEmail, email);

        // Simulate SMS
        alert(`[PRIME PROPERTIES] SMS SENT to ${email}:\n\nYour account request has been declined by the administrator.`);

        showToast(`User ${email} rejected`, 'info');
        renderAdminUsers();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

function adminDeleteAccount(email) {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        db.adminDeleteUser(currentUser.email, email);
        showToast(`User ${email} deleted`, 'success');
        renderAdminUsers();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

function renderAdminBookings() {
    const list = document.getElementById('admin-all-bookings-list');
    if (!list) return;

    const bookings = JSON.parse(localStorage.getItem('prime_bookings')) || [];
    const users = JSON.parse(localStorage.getItem('prime_users')) || [];

    // Analytics
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalUsers = users.filter(u => u.role === 'public').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;

    // Analytics Dashboard Header
    const dashboardHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h4 style="margin: 0; color: var(--text-light); font-size: 0.9rem;">Total Revenue</h4>
                <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary-color); margin-top: 0.5rem;">
                    ₹${(totalRevenue / 10000000).toFixed(2)} Cr
                </div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h4 style="margin: 0; color: var(--text-light); font-size: 0.9rem;">Active Users</h4>
                <div style="font-size: 1.8rem; font-weight: 700; color: #10b981; margin-top: 0.5rem;">
                    ${totalUsers}
                </div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h4 style="margin: 0; color: var(--text-light); font-size: 0.9rem;">Pending Approvals</h4>
                <div style="font-size: 1.8rem; font-weight: 700; color: #f59e0b; margin-top: 0.5rem;">
                    ${pendingUsers}
                </div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h4 style="margin: 0; color: var(--text-light); font-size: 0.9rem;">Total Bookings</h4>
                <div style="font-size: 1.8rem; font-weight: 700; color: var(--secondary-color); margin-top: 0.5rem;">
                    ${bookings.length}
                </div>
            </div>
        </div>
        <h3 style="margin-bottom: 1rem;">Excel Booking Data (Sorted by Date)</h3>
    `;

    if (bookings.length === 0) {
        list.innerHTML = dashboardHTML + '<p style="text-align:center; padding:2rem;">No bookings found.</p>';
        return;
    }

    // Sort: Newest First
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.date) - new Date(a.date));

    const rows = sortedBookings.map(b => `
        <div class="booking-card" style="border-left: 4px solid var(--secondary-color);">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <strong>${b.propertyTitle}</strong>
                <span style="font-weight:bold;">₹${b.amount.toLocaleString('en-IN')}</span>
            </div>
            <div style="font-size:0.9rem; color:var(--text-light); display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem;">
                <span>User: ${b.userEmail}</span>
                <span>Date: ${new Date(b.date).toLocaleDateString()}</span>
                <span>ID: ${b.id}</span>
                <span style="color:green; font-weight:600;">${b.status}</span>
            </div>
        </div>
    `).join('');

    list.innerHTML = dashboardHTML + rows;
}

function exportAllBookingsToExcel() {
    const bookings = JSON.parse(localStorage.getItem('prime_bookings')) || [];
    if (!bookings.length) {
        showToast('No booking data to export', 'info');
        return;
    }

    // Prepare data for Excel
    const data = bookings.map(b => ({
        'Booking ID': b.id,
        'Property': b.propertyTitle,
        'User Email': b.userEmail,
        'Amount': b.amount,
        'Date': new Date(b.date).toLocaleDateString(),
        'Payment Method': b.paymentMethod || 'Online',
        'Status': b.status
    }));

    // Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Bookings");

    // Adjust column widths
    const wscols = [
        { wch: 15 }, // ID
        { wch: 30 }, // Title
        { wch: 25 }, // Email
        { wch: 12 }, // Amount
        { wch: 15 }, // Date
        { wch: 15 }, // Method
        { wch: 12 }  // Status
    ];
    worksheet['!cols'] = wscols;

    // Export File
    XLSX.writeFile(workbook, `Prime_Bookings_All_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('All bookings exported to Excel!', 'success');
}

// Expose to window for app.js to call
window.renderAdminUsers = renderAdminUsers;
window.renderAdminBookings = renderAdminBookings;
window.adminDeleteAccount = adminDeleteAccount;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.exportAllBookingsToExcel = exportAllBookingsToExcel;
