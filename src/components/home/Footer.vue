<script setup></script>

<template>
	<div class="w-full h-full px-10 bg-black/40 backdrop-blur-md flex flex-col lg:flex-row gap-6">
		<div
			class="w-full lg:w-1/2 flex flex-col gap-4 md:gap-6 text-bold text-[14px] md:text-base pt-5 md:py-5"
		>
			<span class="text-white tracking-[.2em]">EVENT</span>
			<div>
				<p class="text-[#A1A1A1] tracking-[.2em]">Cat’s Foods @Anythings About Cat Club</p>
				<p class="text-white tracking-[.2em]">SF - Sat, July 14 / 15-17PM</p>
			</div>
			<div class="flex flex-row gap-4">
				<div class="bg-[#EFC862] rounded-full h-3 w-3"></div>
				<div class="bg-[#A1A1A1] rounded-full h-3 w-3"></div>
				<div class="bg-[#A1A1A1] rounded-full h-3 w-3"></div>
			</div>
		</div>
		<div class="w-full lg:w-1/2 flex flex-row-reverse items-center lg:flex-row gap-6">
			<img
				src="/png/Left.png"
				class="object-cover w-20 md:w-1/4 lg:w-full h-full"
			/>
			<div class="flex flex-col gap-4 md:gap-6 pb-5 md:py-5 text-[14px] md:text-base">
				<span class="text-white tracking-[.2em]">NEWS</span>
				<p class="text-white tracking-[.2em]">
					The average lifespan of pet cats has risen in recent decades.
				</p>
				<p class="text-[#EFC862] tracking-[.2em]">Read more</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
p span {
	font-family: 'Noto Sans', sans-serif;
}
</style>
