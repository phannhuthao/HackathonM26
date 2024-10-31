import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import Admin from '../components/Admin.vue'
import Product from '../components/Product.vue'
import User from '../components/User.vue'
import DoashBoard from '../components/DoashBoard.vue'



const routes = [
  { path: '/admin', name:'admin',component: Admin 
    ,children:[
        { path: 'manger-product', component: Product , name:"manger-product"},
        { path: 'manger-user', component: User, name: "manger-user"},
        { path: 'dashboard', component: DoashBoard, name: "dashboard"},
        
    ]
  },
  
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})