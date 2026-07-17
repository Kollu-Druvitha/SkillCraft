// dashboard.js
// Handles everything on dashboard.html: listing, searching, adding,
// editing and deleting students, plus logout.

// Redirect to login if not authenticated
requireAuth();

// ---------- Element references ----------
const userNameDisplay = document.getElementById('userNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const totalStudentsEl = document.getElementById('totalStudents');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');

const studentsTableBody = document.getElementById('studentsTableBody');
const noStudentsMsg = document.getElementById('noStudentsMsg');

const openAddModalBtn = document.getElementById('openAddModalBtn');
const studentModal = document.getElementById('studentModal');
const modalTitle = document.getElementById('modalTitle');
const studentForm = document.getElementById('studentForm');
const cancelModalBtn = document.getElementById('cancelModalBtn');

const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

let studentIdPendingDelete = null;

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userNameDisplay.textContent = user.name ? `Hi, ${user.name}` : '';
  loadStudents();
});

// ---------- Logout ----------
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

// ---------- Load / Render Students ----------
async function loadStudents(keyword = '') {
  try {
    const endpoint = keyword ? `/students?keyword=${encodeURIComponent(keyword)}` : '/students';
    const students = await apiRequest(endpoint, 'GET');
    renderStudents(students);
    totalStudentsEl.textContent = students.length;
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function renderStudents(students) {
  studentsTableBody.innerHTML = '';

  if (!students || students.length === 0) {
    noStudentsMsg.classList.remove('hidden');
    return;
  }
  noStudentsMsg.classList.add('hidden');

  students.forEach((student) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(student.rollNumber)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.phone || '-')}</td>
      <td>${escapeHtml(student.course)}</td>
      <td>${escapeHtml(String(student.year))}</td>
      <td>
        <button class="btn btn-secondary action-btn" data-action="edit" data-id="${student._id}">Edit</button>
        <button class="btn btn-danger action-btn" data-action="delete" data-id="${student._id}">Delete</button>
      </td>
    `;
    studentsTableBody.appendChild(row);
  });
}

// Basic HTML escaping to avoid rendering issues with special characters
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Search ----------
searchBtn.addEventListener('click', () => {
  loadStudents(searchInput.value.trim());
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    loadStudents(searchInput.value.trim());
  }
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  loadStudents();
});

// ---------- Add / Edit Modal ----------
openAddModalBtn.addEventListener('click', () => {
  openStudentModal('add');
});

cancelModalBtn.addEventListener('click', () => {
  closeStudentModal();
});

function openStudentModal(mode, student = null) {
  studentForm.reset();
  document.getElementById('studentId').value = '';

  if (mode === 'edit' && student) {
    modalTitle.textContent = 'Edit Student';
    document.getElementById('studentId').value = student._id;
    document.getElementById('name').value = student.name;
    document.getElementById('rollNumber').value = student.rollNumber;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('course').value = student.course;
    document.getElementById('year').value = student.year;
    document.getElementById('address').value = student.address || '';
  } else {
    modalTitle.textContent = 'Add Student';
  }

  studentModal.classList.remove('hidden');
}

function closeStudentModal() {
  studentModal.classList.add('hidden');
}

// ---------- Add / Edit Submit ----------
studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('studentId').value;

  const payload = {
    name: document.getElementById('name').value.trim(),
    rollNumber: document.getElementById('rollNumber').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    course: document.getElementById('course').value.trim(),
    year: Number(document.getElementById('year').value),
    address: document.getElementById('address').value.trim()
  };

  try {
    if (id) {
      // Edit existing student
      await apiRequest(`/students/${id}`, 'PUT', payload);
      showAlert('Student updated successfully', 'success');
    } else {
      // Add new student
      await apiRequest('/students', 'POST', payload);
      showAlert('Student added successfully', 'success');
    }

    closeStudentModal();
    loadStudents(searchInput.value.trim());
  } catch (error) {
    showAlert(error.message, 'error');
  }
});

// ---------- Edit / Delete button clicks (event delegation) ----------
studentsTableBody.addEventListener('click', async (e) => {
  const target = e.target;
  const id = target.getAttribute('data-id');
  const action = target.getAttribute('data-action');

  if (!id || !action) return;

  if (action === 'edit') {
    try {
      const student = await apiRequest(`/students/${id}`, 'GET');
      openStudentModal('edit', student);
    } catch (error) {
      showAlert(error.message, 'error');
    }
  }

  if (action === 'delete') {
    studentIdPendingDelete = id;
    deleteModal.classList.remove('hidden');
  }
});

// ---------- Delete Confirmation ----------
cancelDeleteBtn.addEventListener('click', () => {
  studentIdPendingDelete = null;
  deleteModal.classList.add('hidden');
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!studentIdPendingDelete) return;

  try {
    await apiRequest(`/students/${studentIdPendingDelete}`, 'DELETE');
    showAlert('Student deleted successfully', 'success');
    deleteModal.classList.add('hidden');
    studentIdPendingDelete = null;
    loadStudents(searchInput.value.trim());
  } catch (error) {
    showAlert(error.message, 'error');
  }
});
