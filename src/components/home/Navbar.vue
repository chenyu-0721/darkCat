<template>
	<div class="w-full flex items-center justify-between px-4 py-3 md:py-6 md:hidden">
		<div class="text-[32px] font-bold text-white">CAT</div>

		<img
			src="/png/stream.png"
			class="w-8 h-8 md:hidden cursor-pointer"
			@click="isOpen = !isOpen"
		/>
	</div>

	<ul
		:class="[
			'transition-all duration-300 ease-in-out',
			isOpen ? 'flex' : 'hidden',
			'md:flex flex-col md:flex-row items-start md:items-center justify-start md:justify-end space-y-4 md:space-y-0 md:space-x-[55px]',
			'text-white text-lg font-medium px-4 py-4 md:px-0 md:py-0',
			'bg-[#1e1e1e] md:bg-transparent',
			'rounded-lg shadow-md md:shadow-none',
			'z-50 md:z-auto my-10',
		]"
	>
		<li
			v-for="(nav, index) in navs"
			:key="index"
			:class="[
				nav.isActive ? 'text-[#EFC862] underline' : 'text-white',
				'cursor-pointer hover:text-[#EFC862] hover:underline',
			]"
			@click="handleNavClick(index)"
		>
			{{ nav.name }}
		</li>
		<li class="cursor-pointer ml-[25px]">
			<img
				src="/svg/Search_rounded.svg"
				class="w-6 h-6"
			/>
		</li>
	</ul>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const props = defineProps({
	navs: {
		type: Array,
		default: () => [],
	},
})

const handleNavClick = index => {
	props.navs.forEach((nav, i) => {
		nav.isActive = i === index
	})
	isOpen.value = false
}
</script>
