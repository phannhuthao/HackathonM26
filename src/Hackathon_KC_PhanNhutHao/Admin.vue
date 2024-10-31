<script setup lang="ts">

</script>

<template>
  <div class="container">
    <aside class="sidebar">
      <Router-link :to="{name: 'dashboard'}"> <button>DashBoard</button></Router-link>
      <Router-link :to="{name: 'manger-user'}"> <button>Manger User</button></Router-link>
      <Router-link :to="{name: 'manger-product'}"> <button>Manger Product</button></Router-link>
    </aside>
  </div>

  <div >
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

.sidebar {
  display: flex;
  background-color: black;
  color: white;
  padding: 10px;
  width: 2000px;
}

.sidebar button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  margin-right: 10px; /* Giãn cách giữa các nút */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển đổi cho hover */
}

.sidebar button:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Màu nền cho hover */
}

</style>



