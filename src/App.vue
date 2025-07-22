<script setup>
import { ref } from 'vue'
import Aside from './components/home/Aside.vue'
import Navbar from './components/home/Navbar.vue'
import Footer from './components/home/Footer.vue'

const navs = ref([
	{
		name: 'Home',
		isActive: true,
	},
	{
		name: 'Article',
		isActive: false,
	},
	{
		name: 'About',
		isActive: false,
	},
	{
		name: 'Location',
		isActive: false,
	},
	{
		name: 'News',
		isActive: false,
	},
])
</script>

<template>
	<div class="bg-gradient-to-b bg-[#313132] to-bg-[#161618]">
		<div class="max-w-[1440px] min-h-screen navbar mx-auto flex flex-col lg:flex-row">
			<div class="py-2 px-6 lg:p-10 border-0 lg:border-r lg:border-[#707070] hidden lg:flex">
				<Aside />
			</div>
			<div class="w-full h-full min-h-screen flex flex-col justify-between">
				<div class="md:px-[55px]">
					<Navbar :navs="navs" />

					<router-view />
				</div>
				<Footer />
			</div>
		</div>
	</div>
</template>

<style scoped>
.navbar {
	background-image: url('/png/cat.png');
	background-repeat: no-repeat;
	background-position: 65%;
	background-size: contain;
}
</style>
