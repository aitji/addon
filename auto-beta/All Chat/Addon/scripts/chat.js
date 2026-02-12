import { ScoreboardIdentityType, world, system, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui'
import { CalDistance, color, getFakePlayer, getScore, toBool } from './call/function'

const safeGet = (arr, key, def) => {
	try {
		return (
			arr
				.filter(x => x.startsWith(key))
				.join('')
				.split('⌁')[1] || def
		)
	} catch {
		return def
	}
}

function send_style(pl, msg) {
	const chatroom = getScore('chatroom', pl, true) || 0
	const setting = getFakePlayer('rankchat')
	const setting2 = getFakePlayer('chatroomSetting')

	const chatprefix = safeGet(setting, 'chatprefix⌁', 'rank:')
	const chatdef = safeGet(setting, 'chatdef⌁', '§7Player')

	const kingTag = safeGet(setting2, 'kingTag⌁', 'king')
	const allSeeAdmin = toBool(getScore('chatroomSetting', 'allSeeAdmin', true))
	const adminSeeAll = toBool(getScore('chatroomSetting', 'adminSeeAll', true))

	const ranks =
		pl
			.getTags()
			.filter(t => t.startsWith(chatprefix))
			.map(t => t.slice(chatprefix.length))
			.join('§r§i, §r') || chatdef
	const msgFormatted = `§r§l§i[§r${ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${msg}`
	const plPos = pl.location

	pl.sendMessage(msgFormatted)

	const radius = getScore('chatDistance', 'chatRang', true) || 15
	const toggles = {
		msg: toBool(getScore('chatDistance', 'messageToggle', true)),
		admin: toBool(getScore('chatDistance', 'AdminToggle', true)),
		tell: toBool(getScore('chatDistance', 'TellAdminToggle', true))
	}

	for (const p of world.getPlayers({excludeNames: [pl.name]})) {
		const sameRoom = getScore('chatroom', p, true) || 0
		const isAdmin = p.hasTag(kingTag)
		const plIsAdmin = pl.hasTag(kingTag)
		const dist = CalDistance(plPos, p.location)

		if (isAdmin && toggles.admin) p.sendMessage(msgFormatted)
		else if (plIsAdmin && allSeeAdmin) p.sendMessage(msgFormatted)
		else if (isAdmin && adminSeeAll) p.sendMessage(msgFormatted)
		else if (dist <= radius || chatroom === sameRoom) p.sendMessage(msgFormatted)
		else if (toggles.msg) p.sendMessage(`§7*${color(pl)}${pl.name} ส่งข้อความ..*`)
	}
}

world.beforeEvents.chatSend.subscribe((data) => {
	const { sender, message } = data
	data.cancel = true

	const delay = getScore('delay', sender, true) || 0
	const setting = getFakePlayer('chatsettings')
	const text = setting.find(x => x.startsWith('text:'))?.ssenderit(':')[1] || ''
	const cps = getScore('chatsettings', 'cps', true) || 0

	if (delay > 0) return sender.sendMessage(`${text} §7: §c${delay}`)

	const delayr = world.scoreboard.getObjective('delay')
	system.run(() => delayr.setScore(sender, Number(cps)))
	send_style(sender, message)
})