<template>
    <div class="header">
      <h1>Manage User</h1>
      <button class="btnAdd" @click="openForm">Add New User</button>
    </div>
  
    <form class="d-flex mx-auto">
      <input type="search" placeholder="Search by name or email...." v-model="searchQuery" />
    </form>
  
    <table class="table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Date</th>
          <th>Email</th>
          <th colspan="2">Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in filteredUsers()" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.gender ? 'Male' : 'Female' }}</td>
          <td>{{ user.dateOfBirth }}</td>
          <td>{{ user.email }}</td>
          <td><button class="btnEdit" @click="editUser(user)">Edit</button></td>
          <td><button class="btnDelete" @click="confirmDelete(user.id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
  
    <!-- Add/Edit User Form -->
    <div v-if="showForm" class="form-container">
      <form class="form">
        <h1>{{ isEditing ? 'Edit User' : 'Add New User' }}</h1>
        <p>Name</p>
        <input type="text" v-model="newUser.name" required />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
  
        <p>Gender</p>
        <input type="radio" v-model="newUser.gender" value="Male" /> Male
        <input type="radio" v-model="newUser.gender" value="Female" /> Female
        <input type="radio" v-model="newUser.gender" value="Other" /> Other
  
        <p>Date Of Birth</p>
        <input type="date" v-model="newUser.dateOfBirth" required />
        <span v-if="errors.date" class="error">{{ errors.date }}</span>
  
        <p>Email</p>
        <input type="email" v-model="newUser.email" required />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
  
        <div class="form-buttons">
          <button type="button" @click="closeForm">Close</button>
          <button type="button" @click="saveUser">{{ isEditing ? 'Save' : 'Add' }}</button>
        </div>
      </form>
    </div>
  
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Xác nhận</h3>
        <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>
        <div class="modal-buttons">
          <button @click="closeDeleteModal" class="btnCancel">Cancel</button>
          <button @click="deleteUser" class="btnDelete">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';

const showForm = ref(false);
const showDeleteModal = ref(false);
const users = ref([]);
const newUser = ref({
  id: null,
  name: "",
  gender: "",
  dateOfBirth: "",
  email: ""
});
const errors = ref({});
const deleteUserId = ref(null);
const isEditing = ref(false);
const searchQuery = ref("");


onMounted(() => {
  const storedUsers = JSON.parse(localStorage.getItem('users'));
  users.value = storedUsers || [
  { id: 1, name: "John Doe", gender: true, dateOfBirth: "1990-01-01", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", gender: false, dateOfBirth: "1992-03-15", email: "jane.smith@example.com" },
  { id: 3, name: "Mike Johnson", gender: true, dateOfBirth: "1988-06-21", email: "mike.johnson@example.com" },
  { id: 4, name: "Emily Davis", gender: false, dateOfBirth: "1995-07-12", email: "emily.davis@example.com" },
  { id: 5, name: "Robert Brown", gender: false, dateOfBirth: "1987-11-30", email: "robert.brown@example.com" },
  { id: 6, name: "Lisa White", gender: true, dateOfBirth: "1993-02-19", email: "lisa.white@example.com" },
  { id: 7, name: "David Miller", gender: false, dateOfBirth: "1994-09-10", email: "david.miller@example.com" },
  { id: 8, name: "Sarah Wilson", gender: true, dateOfBirth: "1991-05-25", email: "sarah.wilson@example.com" },
  { id: 9, name: "Chris Lee", gender: false, dateOfBirth: "1990-12-11", email: "chris.lee@example.com" },
  { id: 10, name: "Anna Taylor", gender: true, dateOfBirth: "1989-08-17", email: "anna.taylor@example.com" },
  ];
  localStorage.setItem('users', JSON.stringify(users.value));
});

function openForm() {
  showForm.value = true;
  newUser.value = { id: null, name: "", gender: "", dateOfBirth: "", email: "" };
  isEditing.value = false; // Reset to false when opening form for new user
}

function closeForm() {
  showForm.value = false;
}

function saveUser() {
  if (validateForm()) {
    if (isEditing.value) {
      // Update existing user
      const userIndex = users.value.findIndex(user => user.id === newUser.value.id);
      if (userIndex !== -1) {
        users.value[userIndex] = { ...newUser.value }; // Update user
      }
    } else {
      // Add new user
      newUser.value.id = users.value.length ? Math.max(...users.value.map(user => user.id)) + 1 : 1;
      users.value.push({ ...newUser.value });
    }
    localStorage.setItem('users', JSON.stringify(users.value)); 
    closeForm(); 
  }
}

function validateForm() {
  errors.value = {};
  const currentDate = new Date();
  const birthDate = new Date(newUser.value.dateOfBirth);

  if (!newUser.value.name) {
    errors.value.name = "Tên không được để trống.";
  }

  if (!newUser.value.email) {
    errors.value.email = "Email không được để trống.";
  } else if (!validateEmail(newUser.value.email)) {
    errors.value.email = "Email không đúng định dạng.";
  } else if (isEmailDuplicate(newUser.value.email)) {
    errors.value.email = "Email đã tồn tại.";
  }

  if (!newUser.value.dateOfBirth) {
    errors.value.date = "Ngày sinh không được để trống.";
  } else if (birthDate > currentDate) {
    errors.value.date = "Ngày sinh không được lớn hơn ngày hiện tại.";
  }

  return Object.keys(errors.value).length === 0;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isEmailDuplicate(email) {
  return users.value.some(user => user.email === email && user.id !== newUser.value.id);
}

function confirmDelete(id) {
  deleteUserId.value = id;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deleteUserId.value = null;
}

function deleteUser() {
  users.value = users.value.filter(user => user.id !== deleteUserId.value);
  localStorage.setItem('users', JSON.stringify(users.value)); 
  closeDeleteModal(); 
}

// Edit user 
function editUser(user) {
  newUser.value = { ...user }; 
  isEditing.value = true; // Set editing state to true
  showForm.value = true; 
}

function filteredUsers() {
  return users.value.filter(user => 
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
}


</script>

  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .table {
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
  }
  
  .table th,
  .table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  .btnEdit {
    background-color: orange;
    color: white;
    border: none;
  }
  
  .btnDelete {
    background-color: red;
    color: white;
    border: none;
  }
  
  .btnAdd {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    height: 35px;
    width: 150px;
  }
  
  .btnEdit,
  .btnDelete {
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  .form-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 30px 40px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    width: 400px;
    max-width: 90%;
    z-index: 1000;
  }
  
  .form h1 {
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
  
  .form p {
    margin-bottom: 5px;
    font-weight: 600;
  }
  
  .form input[type="text"],
  .form input[type="date"],
  .form input[type="email"] {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  .form input[type="radio"] {
    margin-right: 5px;
  }
  
  .form-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .form-buttons button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .form-buttons button:first-child {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .form-buttons button:last-child {
    background-color: #3b82f6;
    color: white;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  .modal h3 {
    margin-bottom: 20px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .modal-buttons button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btnCancel {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .btnDelete {
    background-color: red;
    color: white;
  }
  
  .error {
    color: red;
    font-size: 12px;
  }
  </style>
  