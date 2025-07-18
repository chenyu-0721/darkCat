import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'

const routes = [
	{
		path: '/',
		name: 'test',
		component: home,
	},
]

const router = createRouter({
	history: createWebHistory('/darkCat/'),
	routes,
})

export default router
