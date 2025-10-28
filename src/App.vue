<template>
	<div class="flex flex-col md:flex-row min-h-screen p-4 md:space-x-4 space-y-4 md:space-y-0">
		<!-- 1. 預設人員名單 -->
		<div class="w-full md:w-1/6 bg-white p-4 rounded shadow flex flex-col space-y-2">
			<h2 class="font-bold text-center text-lg mb-2">預設人員名單</h2>
			<div
				v-for="p in availablePlayers"
				:key="p.name"
			>
				<button
					@click="addToTeam(p.name)"
					class="w-full text-left p-2 border rounded bg-gray-100 hover:bg-gray-200"
				>
					{{ p.name }}
				</button>
			</div>
			<div class="mt-2">
				<input
					v-model="newPlayer"
					type="text"
					placeholder="手動加入隊伍"
					class="border rounded px-2 py-1 w-full"
				/>
				<button
					@click="addToTeam(newPlayer)"
					class="mt-1 w-full bg-green-500 text-white rounded px-2 py-1 hover:bg-green-600"
				>
					加入隊伍
				</button>
			</div>
		</div>

		<!-- 2. 隊伍欄位 -->
		<div class="w-full md:w-1/6 bg-white p-4 rounded shadow flex flex-col space-y-2">
			<h2 class="font-bold text-center text-lg mb-2">隊伍欄位 (最多8人)</h2>
			<div
				v-for="p in team"
				:key="p.name"
				class="p-2 border rounded bg-blue-100 flex justify-between items-center"
			>
				<span>{{ p.name }}</span>
				<button
					@click="removeFromTeam(p.name)"
					class="text-red-500 font-bold px-2"
				>
					X
				</button>
			</div>
			<p
				v-if="team.length === 0"
				class="text-gray-500 text-sm text-center mt-2"
			>
				點擊左側人員加入隊伍或手動輸入
			</p>
		</div>

		<!-- 3. 販賣設定 -->
		<div class="w-full md:w-1/6 bg-white p-4 rounded shadow flex flex-col space-y-2">
			<h2 class="font-bold text-center text-lg mb-2">販賣設定</h2>
			<div class="flex flex-col space-y-1">
				<div
					v-for="(sale, index) in salesConfig"
					:key="index"
					class="flex space-x-1 items-center"
				>
					<select
						v-model="sale.from"
						class="border rounded px-2 py-1 flex-1"
					>
						<option
							disabled
							value=""
						>
							賣方
						</option>
						<option
							v-for="p in team"
							:key="p.name"
							:disabled="isSellerUsed(p.name, index)"
						>
							{{ p.name }}
						</option>
					</select>
					<span>→</span>
					<select
						v-model="sale.to"
						class="border rounded px-2 py-1 flex-1"
					>
						<option
							disabled
							value=""
						>
							買方
						</option>
						<option
							v-for="p in team"
							:key="p.name + 'buy'"
						>
							{{ p.name }}
						</option>
					</select>
					<button
						@click="removeSale(index)"
						class="bg-red-500 text-white px-1 rounded"
					>
						X
					</button>
				</div>
				<button
					@click="addSale"
					class="bg-green-500 text-white px-2 py-1 rounded mt-2 hover:bg-green-600"
				>
					新增販賣
				</button>
			</div>
		</div>

		<!-- 4. 分配珠子 -->
		<div class="w-full md:w-1/6 bg-white p-4 rounded shadow flex flex-col space-y-2">
			<h2 class="font-bold text-center text-lg mb-2">分配珠子</h2>
			<input
				v-model.number="roundBeads"
				type="number"
				placeholder="輸入珠子數量"
				class="border rounded px-2 py-1"
			/>
			<button
				@click="distributeBeads"
				class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
			>
				分配珠子
			</button>
			<button
				@click="finalDistribute"
				class="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
			>
				最後一回合
			</button>
			<button
				@click="undoLastRound"
				class="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
			>
				返回上一步
			</button>
			<button
				v-if="hasFinalRound"
				@click="downloadReport"
				class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-4"
			>
				📥 下載紀錄
			</button>
		</div>

		<!-- 5. 回合紀錄 -->
		<div class="w-full md:w-2/6 bg-gray-50 p-4 rounded shadow overflow-y-auto h-[100vh]">
			<h2 class="font-bold mb-2 text-lg">回合紀錄</h2>
			<div
				v-for="(round, i) in rounds"
				:key="i"
				class="mb-2"
			>
				<div class="font-semibold text-blue-600">
					=== 回合 {{ i + 1 }} 珠子 {{ round.beads }}{{ round.isFinal ? ' End' : '' }} ===
				</div>
				<ul class="list-decimal ml-4">
					<li
						v-for="entry in round.distribution"
						:key="entry.name + entry.note"
					>
						{{ entry.name }} {{ entry.note }}
					</li>
				</ul>
			</div>
		</div>

		<!-- 6. 總珠子數 -->
		<div class="w-full md:w-1/6 bg-white p-4 rounded shadow flex flex-col space-y-2">
			<h2 class="font-bold text-center text-lg mb-2">總珠子數</h2>
			<p class="font-semibold text-gray-700">總珠子數：{{ totalBeads }}</p>
			<p
				v-if="randomBeads > 0"
				class="font-semibold text-gray-700"
			>
				隨機：{{ randomBeads }}
			</p>
			<ul class="list-disc ml-6 text-gray-700">
				<li
					v-for="p in team"
					:key="p.name"
				>
					{{ p.name }} {{ p.beads }} 顆
				</li>
			</ul>
			<h3 class="font-semibold mt-2">販賣紀錄</h3>
			<ul class="list-disc ml-6 text-gray-700">
				<li
					v-for="s in sales"
					:key="s.from + s.to"
				>
					{{ s.from }} → {{ s.to }} {{ s.count }} 顆
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const availablePlayers = ref([
	{ name: '86' },
	{ name: '方哥' },
	{ name: '尹月' },
	{ name: '冰龍' },
	{ name: '爆肝' },
	{ name: '小不點寶寶' },
	{ name: '大D' },
	{ name: '小艾' },
])

const team = ref([])
const newPlayer = ref('')
const roundBeads = ref(0)
const rounds = ref([])
const history = ref([])
const salesConfig = ref([])
const sales = ref([])
const salesHistory = ref([])
const lastIndex = ref(0)
const lastIndexHistory = ref([])
const randomBeads = ref(0)
const totalBeads = computed(() => team.value.reduce((sum, p) => sum + (p.beads || 0), 0))
const hasFinalRound = computed(() => rounds.value.some(r => r.isFinal))

function addToTeam(name) {
	if (!name) return
	if (team.value.length >= 8) return alert('隊伍最多 8 人')
	if (team.value.find(p => p.name === name)) return
	team.value.push({ name, beads: 0 })
	newPlayer.value = ''
}

function removeFromTeam(name) {
	const idx = team.value.findIndex(p => p.name === name)
	if (idx !== -1) team.value.splice(idx, 1)
}

function addSale() {
	salesConfig.value.push({ from: '', to: '' })
}

function removeSale(index) {
	salesConfig.value.splice(index, 1)
}

function isSellerUsed(name, currentIndex) {
	return salesConfig.value.some((sale, idx) => idx !== currentIndex && sale.from === name)
}

function distributeRound(beadCount, isFinal = false) {
	const n = team.value.length
	if (!beadCount || n === 0) return
	team.value.forEach(p => {
		if (p.beads === undefined) p.beads = 0
	})

	const result = []
	let remaining = beadCount
	let idx = rounds.value.length === 0 ? 0 : (lastIndex.value + 1) % n
	const baseOrder = []

	for (let i = 0; i < n; i++) baseOrder.push(team.value[(idx + i) % n])

	history.value.push(JSON.parse(JSON.stringify(team.value)))
	salesHistory.value.push(JSON.parse(JSON.stringify(sales.value)))
	lastIndexHistory.value.push(lastIndex.value)

	if (isFinal) {
		const peopleUntilFirstPerson = idx === 0 ? n : n - idx

		if (beadCount <= peopleUntilFirstPerson) {
			if (beadCount < peopleUntilFirstPerson) {
				const whoWillBeInThisRound = []
				for (let i = 0; i < peopleUntilFirstPerson; i++) {
					whoWillBeInThisRound.push(baseOrder[i].name)
				}

				for (let i = 0; i < beadCount; i++) {
					result.push({ name: whoWillBeInThisRound.join(' '), note: '搶' })
				}
				randomBeads.value = beadCount
			} else {
				for (let i = 0; i < beadCount; i++) {
					const player = baseOrder[i]
					const sale = salesConfig.value.find(s => s.from === player.name)
					if (sale && sale.to) {
						const buyer = team.value.find(p => p.name === sale.to)
						if (buyer) {
							buyer.beads++
							let s = sales.value.find(
								x => x.from === player.name && x.to === buyer.name,
							)
							if (!s)
								sales.value.push({
									from: player.name,
									to: buyer.name,
									count: 1,
								})
							else s.count++
							result.push({ name: buyer.name, note: `${player.name}賣` })
						}
					} else {
						player.beads++
						result.push({ name: player.name, note: '' })
					}
				}
			}
		} else {
			for (let i = 0; i < peopleUntilFirstPerson; i++) {
				const player = baseOrder[i]
				const sale = salesConfig.value.find(s => s.from === player.name)
				if (sale && sale.to) {
					const buyer = team.value.find(p => p.name === sale.to)
					if (buyer) {
						buyer.beads++
						let s = sales.value.find(x => x.from === player.name && x.to === buyer.name)
						if (!s)
							sales.value.push({
								from: player.name,
								to: buyer.name,
								count: 1,
							})
						else s.count++
						result.push({ name: buyer.name, note: `${player.name}賣` })
					}
				} else {
					player.beads++
					result.push({ name: player.name, note: '' })
				}
			}

			const remainingBeads = beadCount - peopleUntilFirstPerson
			const allNames = team.value.map(p => p.name).join(' ')
			for (let i = 0; i < remainingBeads; i++) {
				result.push({ name: allNames, note: '搶' })
			}
			randomBeads.value = remainingBeads
		}

		lastIndex.value = 0
	} else {
		while (remaining > 0) {
			const player = baseOrder[0]
			baseOrder.push(baseOrder.shift())
			remaining--

			const sale = salesConfig.value.find(s => s.from === player.name)
			if (sale && sale.to) {
				const buyer = team.value.find(p => p.name === sale.to)
				if (buyer) {
					buyer.beads++
					let s = sales.value.find(x => x.from === player.name && x.to === buyer.name)
					if (!s) sales.value.push({ from: player.name, to: buyer.name, count: 1 })
					else s.count++
					result.push({ name: buyer.name, note: `${player.name}賣` })
				} else {
					player.beads++
					result.push({ name: player.name, note: '' })
				}
			} else {
				player.beads++
				result.push({ name: player.name, note: '' })
			}
		}
		lastIndex.value = (idx + beadCount - 1) % n
	}

	rounds.value.push({ beads: beadCount, distribution: result, isFinal })
	roundBeads.value = 0
}

function distributeBeads() {
	distributeRound(roundBeads.value)
}

function finalDistribute() {
	distributeRound(roundBeads.value, true)
}

function undoLastRound() {
	if (rounds.value.length === 0) return
	const lastRound = rounds.value[rounds.value.length - 1]

	if (history.value.length === 0) return
	const lastState = history.value.pop()
	const lastSalesState = salesHistory.value.pop()
	const lastIndexState = lastIndexHistory.value.pop()

	team.value = lastState.map(p => ({ ...p }))
	sales.value = lastSalesState.map(s => ({ ...s }))
	lastIndex.value = lastIndexState
	rounds.value.pop()

	if (lastRound.isFinal) {
		randomBeads.value = 0
	}
}

function downloadReport() {
	let content = '='.repeat(50) + '\n'
	content += '珠子分配紀錄\n'
	content += '='.repeat(50) + '\n\n'

	// 回合紀錄
	content += '【回合紀錄】\n\n'
	rounds.value.forEach((round, i) => {
		content += `=== 回合 ${i + 1} 珠子 ${round.beads}${round.isFinal ? ' End' : ''} ===\n`
		round.distribution.forEach((entry, idx) => {
			content += `${idx + 1}. ${entry.name} ${entry.note}\n`
		})
		content += '\n'
	})

	// 總珠子數
	content += '='.repeat(50) + '\n'
	content += '【總珠子數】\n\n'
	content += `總珠子數：${totalBeads.value}\n`
	if (randomBeads.value > 0) {
		content += `隨機：${randomBeads.value}\n`
	}
	content += '\n'
	team.value.forEach(p => {
		content += `${p.name} ${p.beads} 顆\n`
	})

	// 販賣紀錄
	if (sales.value.length > 0) {
		content += '\n' + '='.repeat(50) + '\n'
		content += '【販賣紀錄】\n\n'
		sales.value.forEach(s => {
			content += `${s.from} → ${s.to} ${s.count} 顆\n`
		})
	}

	content += '\n' + '='.repeat(50) + '\n'
	content += `生成時間：${new Date().toLocaleString('zh-TW')}\n`

	// 創建下載
	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `珠子分配紀錄_${new Date().getTime()}.txt`
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	URL.revokeObjectURL(url)
}
</script>
