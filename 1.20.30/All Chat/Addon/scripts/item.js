import { Player, system, world } from "@minecraft/server"
import { ActionFormData } from '@minecraft/server-ui'
import { anti_spam, chat_room, near_chat, rank_chat } from "./call/gui"
/** _______________________________________________________________ */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack
    try {
        if (item?.typeId === "minecraft:paper" && item?.nameTag.toLocaleLowerCase().trim().includes("setting") && pl.hasTag("Admin")) {
            main_menu(pl)
        }
    } catch (e) { }
})
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
function main_menu(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§bChat§f Combiner`)
        form.body(`§c§l»§r§c Subscribe §f@aitji\n\n§fเลือกแอดออนที่ต้องการแก้ไข`)
        form.button(`§lAnti §mSpam\n§rCLICK HERE`)
        form.button(`§l§eRank §r§lChat\n§rCLICK HERE`)
        form.button(`§l§9Chat §r§lRoom\n§rCLICK HERE`)
        form.button(`§l§bNEAR §r§lRoom\n§rCLICK HERE`)
        form.show(pl).then(res => {
            if (res.selection === 0) anti_spam(pl)
            if (res.selection === 1) rank_chat(pl)
            if (res.selection === 2) chat_room(pl)
            if (res.selection === 3) near_chat(pl)
        })
    })
}
/** _______________________________________________________________ */