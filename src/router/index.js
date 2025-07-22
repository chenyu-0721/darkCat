import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: home,
	},
	// {
	// 	path: '/article',
	// 	name: 'article',
	// 	component: article,
	// },
]

const router = createRouter({
	history: createWebHistory('/darkCat/'),
	routes,
})

export default router
