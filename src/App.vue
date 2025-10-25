<template>
	<div class="min-h-screen bg-gray-100 flex flex-col items-center p-8">
		<h1 class="text-3xl font-bold mb-6 text-indigo-600">🎲 多回合珠子分配系統</h1>

		<!-- 輸入區 -->
		<div class="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4">
			<div>
				<label class="block font-semibold mb-1 text-gray-700"
					>輸入名稱（至少 7 人）：</label
				>
				<div
					v-for="(name, index) in names"
					:key="index"
					class="flex mb-2 gap-2"
				>
					<input
						v-model="names[index]"
						type="text"
						class="flex-1 border border-gray-300 rounded-lg p-2"
						placeholder="名稱"
					/>
					<button
						class="bg-red-500 text-white px-2 rounded hover:bg-red-600"
						@click="removeName(index)"
						v-if="names.length > 1"
					>
						✕
					</button>
				</div>
				<button
					class="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
					@click="addName"
				>
					➕ 新增一位
				</button>
			</div>

			<div>
				<label class="block font-semibold mb-1 text-gray-700"
					>每回合珠子數量（以逗號分隔）：</label
				>
				<input
					v-model="roundInputs"
					type="text"
					class="w-full border border-gray-300 rounded-lg p-2"
					placeholder="例如：3,4,5,8"
				/>
			</div>

			<div class="text-center">
				<button
					class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
					@click="startDistribution"
				>
					開始分配
				</button>
			</div>
		</div>

		<!-- 結果 -->
		<div
			v-if="results.length"
			class="mt-10 w-full max-w-2xl"
		>
			<h2 class="text-xl font-semibold mb-4 text-gray-800">分配結果</h2>

			<div
				v-for="(round, i) in results"
				:key="i"
				class="bg-white p-4 rounded-lg shadow-sm mb-4"
			>
				<h3 class="font-semibold text-indigo-600 mb-2">第 {{ i + 1 }} 回合</h3>
				<ul class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
					<li
						v-for="(r, idx) in round"
						:key="idx"
					>
						{{ r.name }}：<span class="font-bold">{{ r.beads }}</span> 顆
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const names = ref(['a', 'b', 'c', 'd', 'e', 'f', 'g'])
const roundInputs = ref('')
const results = ref([])

const addName = () => {
	names.value.push('')
}

const removeName = index => {
	names.value.splice(index, 1)
}

const startDistribution = () => {
	const validNames = names.value.filter(n => n.trim() !== '')
	if (validNames.length < 7) {
		alert('請至少輸入 7 位名稱')
		return
	}

	const roundBeads = roundInputs.value
		.split(',')
		.map(v => parseInt(v.trim()))
		.filter(v => !isNaN(v) && v > 0)

	if (roundBeads.length === 0) {
		alert('請輸入正確的珠子數量（例如 3,4,5,8）')
		return
	}

	results.value = []
	let startIndex = 0

	roundBeads.forEach((beads, roundIndex) => {
		const distribution = validNames.map(name => ({ name, beads: 0 }))
		let currentIndex = startIndex

		// 分配珠子
		for (let i = 0; i < beads; i++) {
			distribution[currentIndex].beads++
			currentIndex = (currentIndex + 1) % validNames.length
		}

		// 若是最後一輪且有多餘，隨機分配剩餘珠子
		const totalGiven = distribution.reduce((a, b) => a + b.beads, 0)
		if (roundIndex === roundBeads.length - 1 && totalGiven < beads) {
			const remaining = beads - totalGiven
			for (let i = 0; i < remaining; i++) {
				const randomIndex = Math.floor(Math.random() * validNames.length)
				distribution[randomIndex].beads++
			}
		}

		results.value.push(distribution)
		startIndex = currentIndex // 下一輪從接續的人開始
	})
}
</script>

<style>
body {
	font-family: 'Inter', sans-serif;
}
</style>
