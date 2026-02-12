import { Player, system, world } from '@minecraft/server'
import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui'
import { boolTo, getFakePlayer, getScore, toBool } from './function'

/**@param {Player} pl*/
export function anti_spam(pl) {
	let text, cps
	try {
		const setting = getFakePlayer('chatsettings')
		text = setting
			.filter(s => s.startsWith('text:'))
			.join('')
			.split(':')[1] || 'Hey Hey Slow Down please'
		cps = getScore('chatsettings', 'cps', true) || 0
	} catch { }

	const form = new ModalFormData()
	form.title(`[§r §lServer Anti Spam§r ]`)
	form.slider(`§c§l»§r§c Subscribe §f@aitji.§r\n\n§e§l» §r§fดีเลย์ของ§eแชทต่อวินาที§r`, 0, 10, { valueStep: 1, defaultValue: Number(cps) || 0, tooltip: 'นี่คือดีเลย์ของผู้เล่นในการส่งข้อความในแชท' })
	form.textField(`§c§l» §r§fข้อความเตือนเมื่อ§cสแปม`, `ex: Hey Hey Slow Down please`, { defaultValue: text || 'Hey Hey Slow Down please', tooltip: 'ข้อความนี้จะถูกส่งไปยังผู้เล่นเมื่อสแปมแชท' })

	form.show(pl).then(({ canceled, formValues }) => {
		if (canceled) return
		const chatsettings = world.scoreboard.getObjective('chatsettings') || world.scoreboard.addObjective('chatsettings', 'Chat Settings')

		chatsettings.getParticipants().forEach(p => chatsettings.removeParticipant(p))
		chatsettings.setScore('cps', Number(formValues[0]))
		chatsettings.setScore(`text:${formValues[1]}`, 1)
		pl.sendMessage(`§fAntiSpam is now §aSaved!§r`)
	})
}

/**@param {Player} pl*/
export function rank_chat(pl) {
	let chatprefix, chatdef
	try {
		const setting = getFakePlayer('rankchat')
		chatprefix = setting
			.filter(x => x.startsWith('chatprefix⌁'))
			.join('')
			.split('⌁')[1] || 'rank:'
		chatdef = setting
			.filter(x => x.startsWith('chatdef⌁'))
			.join('')
			.split('⌁')[1] || '§7Player'
	} catch { }

	const form = new ModalFormData()
	form.title(`§l§8» §rRankChat §l§8«`)
	form.textField(`§c§l»§r§c Subscribe §f@aitji.§r\n\n§l§a»§r §fคำนำหน้า(Prefix) ของ §aRank Chat`, `ex: "${chatprefix}"`, { defaultValue: chatprefix })
	form.textField(`§l§e»§r§e Rank §fเริ่มต้นของผู้เล่น`, `ex: "${chatdef}"`, { defaultValue: chatdef })
	form.show(pl).then(({ canceled, formValues }) => {
		if (canceled) return

		const [valPrefix, valDef] = formValues
		if (!valPrefix || !valDef) return pl.sendMessage(`§l§7| §r§fกรุณากรอก§eข้อมูล§fให้ครบถ้วน`)
		const rankchat = world.scoreboard.getObjective('rankchat') || world.scoreboard.addObjective('rankchat', 'Rank Chat')

		rankchat.getParticipants().forEach(p => rankchat.removeParticipant(p))
		rankchat.setScore(`chatprefix⌁${valPrefix}`, 1)
		rankchat.setScore(`chatdef⌁${valDef}`, 1)
		pl.sendMessage(`§fRank Chat is now §aSaved!§r`)
	})
}

/**@param {Player} pl*/
export function chat_room(pl) {
	let kingTag, allSeeAdmin, adminSeeAll
	try {
		const setting = getFakePlayer('chatroomSetting')
		kingTag = setting
			.filter(x => x.startsWith('kingTag⌁'))
			.join('')
			.split('⌁')[1] || 'king'
		allSeeAdmin = toBool(getScore('chatroomSetting', 'allSeeAdmin', true)) || false
		adminSeeAll = toBool(getScore('chatroomSetting', 'adminSeeAll', true)) || false
	} catch { }

	const form = new ModalFormData()
	form.title(`§l§8» §rChat Room §l§8«`)
	form.textField(`§c§l»§r§c Subscribe §f@aitji.§r\nChatRoom §aKingTag`, `ex: "${kingTag}"`, { defaultValue: kingTag })
	form.toggle(`§e»§f ทุกคนเห็นข้อความของ §e${kingTag}`, { defaultValue: allSeeAdmin })
	form.toggle(`§e» §e${kingTag} §fเห็นข้อความของทุกคน`, { defaultValue: adminSeeAll })
	form.show(pl).then(({ canceled, formValues }) => {
		if (canceled) return

		const [king, seeAll, adminSee] = formValues
		const obj = world.scoreboard.getObjective('chatroomSetting') || world.scoreboard.addObjective('chatroomSetting', 'Chat Room Setting')

		obj.getParticipants().forEach(p => obj.removeParticipant(p))
		obj.setScore('allSeeAdmin', Number(boolTo(seeAll)))
		obj.setScore('adminSeeAll', Number(boolTo(adminSee)))
		obj.setScore(`kingTag⌁${king || 'king'}`, 0)
		pl.sendMessage(`§fChat Room is now §aSaved!§r`)
	})
}

/**@param {Player} pl*/
export function near_chat(pl) {
	let chatRang, messageBool, AdminBool, TellAdminBool
	try {
		messageBool = toBool(getScore('chatDistance', 'messageToggle', true)) || false
		AdminBool = toBool(getScore('chatDistance', 'AdminToggle', true)) || false
		chatRang = getScore('chatDistance', 'chatRang', true) || 15
		TellAdminBool = toBool(getScore('chatDistance', 'TellAdminToggle', true)) || false
	} catch { }
	chatRang = chatRang < 1 ? '15' : chatRang

	const form = new ModalFormData()
	form.title(`§l§8» §rNearChat§8 «`)
	form.textField(`§c» §cSubscribe §f@aitji.\n§a» §fระยะห่างที่เห็นแชท`, `ex: "${chatRang}"`, { defaultValue: String(chatRang) })
	form.toggle(`§e»§f แสดงข้อความเมื่อไม่มีใครอยู่ใกล้เคียง`, { defaultValue: messageBool })
	form.toggle(`§e»§f "Admin" เห็นข้อความทั้งหมด`, { defaultValue: AdminBool })
	form.toggle(`§e»§f การพิมพ์ของ "Admin" จะเห็นทั้งหมด`, { defaultValue: TellAdminBool })

	form.show(pl).then(({ canceled, formValues }) => {
		if (canceled) return

		const [range, msg, admin, tell] = formValues
		if (!range || range < 1 || isNaN(Number(range))) return pl.sendMessage(`§7กรุณาใส่ตัวเลขที่§cมากกว่า 0§7 ในระยะห่างที่เห็นแชท`)

		let obj = world.scoreboard.getObjective('chatDistance') || world.scoreboard.addObjective('chatDistance', 'Chat Distance')
		obj.getParticipants().forEach(p => obj.removeParticipant(p))
		obj.setScore('chatRang', Number(range))
		obj.setScore('messageToggle', Number(boolTo(msg)))
		obj.setScore('AdminToggle', Number(boolTo(admin)))
		obj.setScore('TellAdminToggle', Number(boolTo(tell)))
		pl.sendMessage(`§fChat Distance is now §aSaved!§r`)
	})
}