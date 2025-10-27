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
		</div>

		<!-- 5. 回合紀錄 -->
		<div class="w-full md:w-2/6 bg-gray-50 p-4 rounded shadow overflow-y-auto h-[60vh]">
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
const salesConfig = ref([]) // {from, to}
const sales = ref([])
const salesHistory = ref([]) // 記錄每個回合的銷售狀態
const lastIndex = ref(0)
const randomBeads = ref(0) // 隨機珠子數（多出來的部分）
const totalBeads = computed(() => team.value.reduce((sum, p) => sum + (p.beads || 0), 0))

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

function distributeRound(beadCount, isFinal = false) {
	const n = team.value.length
	if (!beadCount || n === 0) return
	team.value.forEach(p => {
		if (p.beads === undefined) p.beads = 0
	})

	const result = []
	let remaining = beadCount
	let idx = lastIndex.value
	const baseOrder = []

	// 建立當前回合的隊伍順序
	for (let i = 0; i < n; i++) baseOrder.push(team.value[(idx + i) % n])

	// 保存當前狀態（撤銷時需要還原）
	history.value.push(JSON.parse(JSON.stringify(team.value)))
	salesHistory.value.push(JSON.parse(JSON.stringify(sales.value)))

	if (isFinal) {
		// 最後一回合：計算總珠子數，計算基數，補足沒達到的，餘數算隨機

		// 1. 計算總珠子數（前面回合 + 最後一回合）
		// 前面回合的珠子已經分配完了，計算前面所有回合的珠子總數
		const previousRoundsTotal = rounds.value.reduce((sum, round) => sum + round.beads, 0)
		const totalShouldBe = previousRoundsTotal + beadCount
		const n = team.value.length

		// 2. 計算每人應該有的基數
		const basePerPerson = Math.floor(totalShouldBe / n)
		const remainder = totalShouldBe % n // 餘數

		// 3. 計算每個人實際上應該有的珠子數（包括自己拿到的 + 賣掉的）
		const playerCurrentTotal = team.value.map(p => {
			const sold = sales.value
				.filter(s => s.from === p.name)
				.reduce((sum, s) => sum + s.count, 0)
			return {
				name: p.name,
				beads: p.beads || 0,
				total: (p.beads || 0) + sold, // 目前珠子 + 賣掉的珠子
			}
		})

		// 4. 先找出所有沒達到基數的人，按照隊伍順序補給他們
		let remaining = beadCount

		// 找出所有需要補珠子的人（目前持有的珠子數 < 基數）
		const playersNeedMoreNames = playerCurrentTotal
			.filter(p => p.beads < basePerPerson)
			.map(p => p.name)

		// 如果所有人都達到基數了，那所有珠子都算隨機搶
		if (playersNeedMoreNames.length === 0) {
			const takerNames = team.value.map(p => p.name)
			for (let i = 0; i < remaining; i++) {
				result.push({ name: takerNames.join(' '), note: '搶' })
			}
			randomBeads.value = remaining
		} else {
			// 從 lastIndex 開始，按照隊伍順序找出需要補珠子的人
			let idx = lastIndex.value

			while (remaining > 0) {
				let hasAnyNeed = false

				for (let i = 0; i < n && remaining > 0; i++) {
					const player = team.value[(idx + i) % n]
					const playerInfo = playerCurrentTotal.find(x => x.name === player.name)

					// 如果這個人還需要補珠子（檢查 beads 而不是用 list）
					if (playerInfo.beads < basePerPerson) {
						hasAnyNeed = true

						// 分配一顆珠子
						const sale = salesConfig.value.find(s => s.from === player.name)
						if (sale && sale.to) {
							const buyer = team.value.find(p => p.name === sale.to)
							if (buyer) {
								buyer.beads++
								playerInfo.beads++ // 更新 playerInfo 的 beads（即使販賣，也算該人分配到了）
								// 紀錄販賣顆數
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
							playerInfo.beads++ // 更新 playerInfo 的 beads
							result.push({ name: player.name, note: '' })
						}
						remaining--
					}
				}

				// 如果所有人都達到基數了，停止補珠
				if (!hasAnyNeed) break
			}

			// 剩下的珠子是「需要補珠子的人」搶的
			if (remaining > 0) {
				// 重新計算目前還需要補珠子的人
				const currentPlayersNeedMore = playerCurrentTotal
					.filter(p => p.beads < basePerPerson)
					.map(p => p.name)

				// 如果有需要補珠子的人，他們搶；如果沒有（所有人都達標了），所有人搶
				const takerNames =
					currentPlayersNeedMore.length > 0
						? team.value
								.filter(p => currentPlayersNeedMore.includes(p.name))
								.map(p => p.name)
						: team.value.map(p => p.name)

				for (let i = 0; i < remaining; i++) {
					result.push({ name: takerNames.join(' '), note: '搶' })
				}
				randomBeads.value = remaining
			}
		}

		lastIndex.value = 0
	} else {
		while (remaining > 0) {
			const player = baseOrder[0]
			baseOrder.push(baseOrder.shift()) // 輪流
			remaining--

			// 處理販賣
			const sale = salesConfig.value.find(s => s.from === player.name)
			if (sale) {
				const buyer = team.value.find(p => p.name === sale.to)
				if (buyer) {
					buyer.beads++
					// 紀錄販賣顆數
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
		lastIndex.value = team.value.findIndex(p => p.name === baseOrder[0].name)
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

	// 如果是最後一回合，需要恢復狀態
	if (lastRound.isFinal) {
		// 恢復隊伍和販賣狀態
		if (history.value.length === 0) return
		const lastState = history.value.pop()
		const lastSalesState = salesHistory.value.pop()
		team.value = lastState.map(p => ({ ...p }))
		sales.value = lastSalesState.map(s => ({ ...s }))
		randomBeads.value = 0
		rounds.value.pop()
		return
	}

	// 否則需要恢復歷史狀態
	if (history.value.length === 0) return
	const lastState = history.value.pop()
	const lastSalesState = salesHistory.value.pop()
	team.value = lastState.map(p => ({ ...p }))
	sales.value = lastSalesState.map(s => ({ ...s }))
	rounds.value.pop()
}
</script>
