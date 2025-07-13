import { Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

let moneyObj = "money"
let bankObj = "bank"
let moveStep = 1

function getScore(objective, target, useZero = true) {
	try {
		const obj = world.scoreboard.getObjective(objective)
		if (typeof target == 'string') {
			return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) || (useZero ? 0 : NaN)
		}
		return obj.getScore(target.scoreboardIdentity) || (useZero ? 0 : NaN)
	} catch {
		return useZero ? 0 : NaN
	}
}

function getText(player, get) {
	const pl = player
	const players = world.getAllPlayers()
	let go = ''
	if (player.hasTag("eng")) {
		if (get === "title") go = `§e»§c ${player.name}'s §fInterface §e«§r`
		if (get === "welcomeBody") go = `§fHi! §c${player.name}§f, Welcome to Server Menu\nLet §csee§f what do you want?§r`
		if (get === "b1") go = `§8Lobby/Hub`
		if (get === "b2") go = `§8Bank`
		if (get === "b3") go = `§8Player Details`
		if (get === "b4") go = `§8Langues`
		if (get === "back") go = `§8Back`

		if (get === "bankBody") go = `§fWelcome §c${pl.name}§f to §eBANK §fMenu What do you want to do?`
		if (get === "withdraw") go = `§8Withdraw Money`
		if (get === "deposit") go = `§8Deposit Money`

		if (get === "withdrawMsgFail") go = `§7> §fSorry You didn't have §cmoney§f in Bank §7<`
		if (get === "withdrawBody") go = `§fHi §c${pl.name}§f Slider You §aMoney§f in bank back to you §6Pocket §fScrolling`
		if (get === "withdrawDone") go = `§7> §fYou has been §aWithdraw §fYou Money for `

		if (get === "depositMsgFail") go = `§7> §fSorry You didn't have any §cmoney§f §7<`
		if (get === "depositBody") go = `§fHi ${pl.name} Slider You §aMoney§f in you §6Pocket to the §eBank! §fScrolling `
		if (get === "depositDone") go = `§7> §fYou has been §cDeposit §fYou Money for `

		if (get === "detailsBody") go = `Player Online: ${players.length} \nAll §cPlayer§f In This Server..`
	} else if (player.hasTag("th")) {
		if (get === "title") go = `§e» §fเมนูของ §c${player.name}'s  §e«§r`
		if (get === "welcomeBody") go = `§fสวัสดี! §c${player.name}§f, ยินดีต้อนรับสู่ เมนูของ เซิร์ฟเวอร์นี้\n§fมา§cดู§f กันดีกว่าว่า§cคุณ§fจะทำอะไร!§r`
		if (get === "b1") go = `§8ล็อบบี้`
		if (get === "b2") go = `§8ธนาคาร`
		if (get === "b3") go = `§8รายละเอียดผู้เล่น`
		if (get === "b4") go = `§8ภาษา`
		if (get === "back") go = `§8ย้อนกลับ`

		if (get === "bankBody") go = `§fยินดีต้อนรับ §c${pl.name}§f สู่ §eเมนู ธนาคาร §fคุณต้องการทำธุรกรรมอะไร?`
		if (get === "withdraw") go = `§8ถอนเงิน`
		if (get === "deposit") go = `§8ฝากเงิน`
		if (get === "withdrawMsgFail") go = `§7> §fขอโทษด้วยคุณไม่มี เงินใน§cบัชชีธนาคาร§fเลย.. §7<`
		if (get === "withdrawDone") go = `§7> §fคุณได้ §aถอนเงิน §fจำนวน `

		if (get === "depositMsgFail") go = `§7> §fขอโทษด้วยคุณ§cไม่มี§fเงินเลยสักบาทเดียว §7<`
		if (get === "depositBody") go = `§fสวัสดี ${pl.name} §fเลื่อนเพื่อฝากเงินเข้า §eธนาคาร §fกำลังเลื่อนอยู่ที่ `
		if (get === "depositDone") go = `§7> §fคุณได้ทำการ §cฝากเงิน §fจำนวน `

		if (get === "detailsBody") go = `§fผู้เล่นออนไลน์ ทั้งหมด:§a ${players.length} \n§fรายชื่อผู้เล่นที่อยู่ในเซิร์ฟเวอร์ทั้งหมด..`
	} else {
		return `§4player tag wasn't found\nerror contact: §cDiscord.gg/z4Mu55phPw`
	}
	return go
}

function menu(player) {
	system.run(() => {
		let form = new ActionFormData()
		form.title(getText(player, 'title'))
		form.body(getText(player, 'welcomeBody'))
		form.button(getText(player, 'b1'))
		form.button(getText(player, 'b2'))
		form.button(getText(player, 'b3'))
		form.button(getText(player, 'b4'))
		form.show(player).then((res) => {
			if (res.selection === 0) player.runCommandAsync(`tp @s 0 -60 0`)
			if (res.selection === 1) bank(player)
			if (res.selection === 2) details(player)
			if (res.selection === 3) handel(player, true)
		})
	})
}

function bank(pl) {
	system.run(() => {
		pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
		let form = new ActionFormData();
		form.title(getText(pl, 'title'));
		form.body(getText(pl, 'bankBody'));
		form.button(getText(pl, 'back'));
		form.button(getText(pl, 'withdraw'));
		form.button(getText(pl, 'deposit'));
		form.show(pl).then((res) => {
			if (res.selection === 0) return menu(pl)
			if (res.selection === 1) withdraw(pl)
			if (res.selection === 2) deposit(pl)
		})
	})
}

function withdraw(pl) {
	system.run(() => {
		pl.runCommandAsync(`scoreboard players add @s ${bankObj} 0`)
		pl.runCommandAsync(`scoreboard players add @s ${moneyObj} 0`)
		let bank = getScore('bank', pl, true) || 0
		if (bank <= 0) {
			pl.runCommandAsync(`playsound random.break @s ~~~ 50`);
			pl.sendMessage(getText(pl, 'withdrawMsgFail'))
		} else {
			pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
			let form = new ModalFormData();
			form.title(getText(pl, 'title'))
			let move = moveStep
			if (moveStep > bank) move = 1
			form.slider(getText(pl, 'withdrawBody'), 0, bank, move)
			form.show(pl).then((res) => {
				pl.runCommandAsync(`scoreboard players add @s ${moneyObj} ${res.formValues[0]}`)
				pl.runCommandAsync(`scoreboard players remove @s ${bankObj} ${res.formValues[0]}`)
				pl.sendMessage(`${getText(pl, 'withdrawDone')} §c${res.formValues[0]} §7<`)
			})
		}
	})
}

function deposit(pl) {
	system.run(() => {
		pl.runCommandAsync(`scoreboard players add @s ${bankObj} 0`)
		pl.runCommandAsync(`scoreboard players add @s ${moneyObj} 0`)
		let money = getScore('money', pl, true) || 0
		if (money <= 0) {
			pl.runCommandAsync(`playsound random.break @s ~~~ 50`);
			pl.sendMessage(getText(pl, 'depositMsgFail'))
		} else {
			pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
			let form = new ModalFormData();
			form.title(getText(pl, 'title'))
			let move = moveStep
			if (moveStep > money) move = 1
			form.slider(getText(pl, 'depositBody'), 0, money, move)
			form.show(pl).then((res) => {
				pl.runCommandAsync(`scoreboard players add @s ${bankObj} ${res.formValues[0]}`)
				pl.runCommandAsync(`scoreboard players remove @s ${moneyObj} ${res.formValues[0]}`)
				pl.sendMessage(`${getText(pl, 'depositDone')} §c${res.formValues[0]} §7<`)
			})
		}
	})
}

function details(pl) {
	system.run(() => {
		pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
		let form = new ActionFormData();
		let players = [...world.getAllPlayers()];
		form.title(getText(pl, 'title'));
		form.body(getText(pl, 'detailBody'));
		form.button(getText(pl, 'back'))
		players.map(function (player) {
			let textures = ['alex', 'steve']
			form.button(`${player.name}`, `textures/ui/icon_${textures[Math.floor(Math.random() * 2)]}`)
		})
		form.show(pl).then((res) => {
			if (res.isCanceled) return
			return menu(pl)
		})
	})
}

function handel(pl, force = false) {
	system.run(() => {
		if (force) bet(pl)
		else if (pl.hasTag('th') || pl.hasTag('eng')) menu(pl)
		else bet(pl)
	})
}

function bet(pl) {
	let form = new ActionFormData()
	form.title(`§e»§c ${pl.name}'s §fInterface §e«§r`)
	form.body(`§l§fplease pick up your §alang§f!\n§l§fกรุณาเลือก §aภาษา §fของคุณ!§r`)
	form.button(`§l§8English§r`);
	form.button(`§l§8ภาษาไทย§r`);
	form.show(pl).then((res) => {
		if (res.canceled) return
		pl.runCommandAsync(`tag @s remove th`)
		pl.runCommandAsync(`tag @s remove eng`)
		if (res.selection === 0) {
			pl.sendMessage(`§7> §fLangues: §aEnglish §7<`)
			pl.runCommandAsync(`tag @s add eng`)
		}
		if (res.selection === 1) {
			pl.sendMessage(`§7> §fภาษา: §aไทย §7<`)
			pl.runCommandAsync(`tag @s add th`)
		}
		system.runTimeout(() => handel(pl), 5)
	})
}

world.beforeEvents.itemUse.subscribe((data) => {
	let pl = data.source
	let item = data.itemStack

	if (item.typeId === "minecraft:clock") handel(pl)
})