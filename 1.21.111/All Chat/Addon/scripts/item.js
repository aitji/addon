import { system, world } from '@minecraft/server'
import { ActionFormData } from '@minecraft/server-ui'
import { anti_spam, chat_room, near_chat, rank_chat } from './call/gui'

world.beforeEvents.itemUse.subscribe(
	({ source, itemStack }) =>
		itemStack?.typeId === 'aitji:allchat' &&
		source.hasTag('Admin') &&
		system.run(() => {
			const form = new ActionFormData()
			form.title(`§bChat§f Combiner`)
			form.body(`§c§l»§r§c Subscribe §f@aitji.\n\n§fเลือกแอดออนที่ต้องการแก้ไข`)
			form.button(`§lAnti §mSpam\n§rCLICK HERE`)
			form.button(`§l§eRank §r§lChat\n§rCLICK HERE`)
			form.button(`§l§9Chat §r§lRoom\n§rCLICK HERE`)
			form.button(`§l§bNEAR §r§lRoom\n§rCLICK HERE`)
			form.show(source).then(({ selection }) => [anti_spam, rank_chat, chat_room, near_chat][selection]?.(source))
		})
)