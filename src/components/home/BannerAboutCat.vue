<script setup>
import { ref, onMounted } from 'vue'

const fullText = `The cat is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family.`

const displayedText = ref('')

onMounted(() => {
	let index = 0
	const speed = 20

	const interval = setInterval(() => {
		if (index < fullText.length) {
			displayedText.value += fullText[index]
			index++
		} else {
			clearInterval(interval)
		}
	}, speed)
})
</script>

<template>
	<div class="min-w-[320px] gap-6 hidden lg:flex lg:flex-col">
		<div>
			<span class="text-[28px] text-white">/ 01</span>
			<div
				class="w-full mt-2 h-[1px] bg-[linear-gradient(to_right,#EFC862_50%,#707070_50%)]"
			></div>
		</div>
		<div>
			<ul class="flex flex-col gap-2">
				<li class="text-white text-[21px]">About Cat</li>
				<li class="text-[13px] text-[#646464]">Senses</li>
				<li class="text-[13px] text-[#646464]">Behavior</li>
			</ul>
		</div>
	</div>

	<div class="max-w-[400px] flex flex-col justify-start gap-6">
		<div class="text-[36px] md:text-[70px] text-white font-bold text-left">Eat Everyday</div>
		<div
			class="text-[14px] md:text-[20px] text-white whitespace-pre-line leading-relaxed"
			style="font-family: 'Noto Sans', sans-serif"
		>
			{{ displayedText }}
		</div>
	</div>
</template>
