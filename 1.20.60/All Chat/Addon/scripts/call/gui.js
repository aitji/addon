import { Player, system, world } from "@minecraft/server"
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui"
import { boolTo, getFakePlayer, getScore, toBool } from "./function"
/** _______________________________________________________________ */
let RankPrefix = "rank:";
let def = "§7Player";
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
export function anti_spam(pl) {
    system.run(() => {
        let setting, text, cps
        try {
            setting = getFakePlayer('chatsettings')
            text = setting.filter(str => str.startsWith('text:')).join('').split(":")[1]
            cps = getScore('chatsettings', 'cps', true) ?? 0
        } catch (UwU) { }
        const form = new ModalFormData()
        form.title(`[§r §lServer Anti Spam§r ]`)
        form.slider(`\nPlease silder this for chat delay per seconds\nChat Delay`, 0, 10, 1, cps ?? 0)
        form.textField(`Warning message when spam`, `ex: Hey Hey Slow Down please`, text ?? "Slow Down please")
        form.show(pl).then(res => {
            if (res.canceled) return
            pl.runCommandAsync(`scoreboard players reset * chatsettings`)
            pl.runCommandAsync(`scoreboard players set cps chatsettings ${res.formValues[0]}`)
            pl.runCommandAsync(`scoreboard players set "text:${res.formValues[1]}" chatsettings 1`)
            pl.sendMessage(`§r§7§l| §r§fChat Per Seconds has set to §c"${res.formValues[0]}"`)
            pl.sendMessage(`§r§7§l| §r§fThe Message has set to §c"${res.formValues[1]}"`)
        })
    })
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
export function rank_chat(pl) {
    system.run(() => {
        let chatprefix, chatdef
        try {
            let setting = getFakePlayer('rankchat')
            chatprefix = setting.filter(str => str.startsWith('chatprefix⌁')).join('').split("⌁")[1]
            chatdef = setting.filter(str => str.startsWith('chatdef⌁')).join('').split("⌁")[1]
        } catch (UwU) { }
        if (chatprefix === "" || chatprefix === undefined) chatprefix = RankPrefix
        if (chatdef === "" || chatdef === undefined) chatdef = def
        const form = new ModalFormData()
        form.title(`§l§8» §r§0RankChat §l§8«`)
        form.textField(`§c§l»§r§c Subscribe §f@aitji§r\n\n§l§a»§r§f Rank Chat §aPrefix§f ex: §o"rank:"§r\n§l§a»§r§l §aคำนำหน้า§fก่อน Rank เช่น §o"rank:"§r`, `ex: "${chatprefix ?? `rank:`}"`, chatprefix)
        form.textField(`§l§e»§r§f Rank Chat §eDefault§f ex: §o"§7Player§f"§r\n§l§e»§r§l §fยศ§eเริ่มต้น §fเช่น §o"§7ผู้เล่น§f"§r`, `ex: "${chatdef ?? `§7player`}"`, chatdef)
        form.show(pl).then(res => {
            if (res.canceled) return
            if (res.formValues[0] === "" || res.formValues[0] === undefined || res.formValues[1] === "" || res.formValues[1] === undefined) {
                pl.sendMessage(`§l§fกรุณากรอก§eข้อมูล§fให้ครบถ้วน`)
                return
            }
            let chatprefix, chatdef
            try {
                let setting = getFakePlayer('rankchat')
                chatprefix = setting.filter(str => str.startsWith('chatprefix⌁')).join('')
                chatdef = setting.filter(str => str.startsWith('chatdef⌁')).join('')
            } catch (e) { }
            if (chatprefix === "" || chatprefix === undefined) chatprefix = `chatprefix⌁${RankPrefix}`
            if (chatdef === "" || chatdef === undefined) chatdef = `chatdef⌁${def}`

            pl.runCommandAsync(`scoreboard players reset * rankchat`)
            const all = [chatprefix, chatdef]
            for (let i = 0; i < all.length; i++) {
                var on = false
                if (all[i] === chatprefix) {
                    pl.runCommandAsync(`scoreboard players set "chatprefix⌁${res.formValues[0]}" rankchat ${i + 1}`)
                    on = true
                }
                if (all[i] === chatdef) {
                    pl.runCommandAsync(`scoreboard players set "chatdef⌁${res.formValues[1]}" rankchat ${i + 1}`)
                    on = true
                }

                if (on === false) pl.runCommandAsync(`scoreboard players set "${all[i]}" rankchat ${i + 1}`)
            }
            pl.sendMessage(`§fRank Chat is now §aSaved!§r`)
        })
    })
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
export function chat_room(pl){
    system.run(() => {
        let kingTag, allSeeAdmin, adminSeeAll
        try {
            let setting = getFakePlayer('chatroomSetting')
            kingTag = setting.filter(str => str.startsWith('kingTag⌁')).join('').split("⌁")[1]
            allSeeAdmin = toBool(getScore("chatroomSetting", "allSeeAdmin", true))
            adminSeeAll = toBool(getScore("chatroomSetting", "adminSeeAll", true))
        } catch (UwU) { }
        if (kingTag === "" || kingTag === undefined) kingTag = "king"
        if (allSeeAdmin === "" || allSeeAdmin === undefined) allSeeAdmin = false
        if (adminSeeAll === "" || adminSeeAll === undefined) adminSeeAll = false

        const form = new ModalFormData()

        form.title(`§l§8» §r§0Chat Room §l§8«`)
        form.textField(`§c§l»§r§c Subscribe §f@aitji§r\n\n§l§a»§r§f ChatRoom §aKingTag§f ex: §o"king"§r`, `ex: "${kingTag ?? `king`}"`, kingTag)
        form.toggle(`§e»§f Everyone See §e${kingTag ?? `king`}?`, allSeeAdmin ?? false)
        form.toggle(`§e» §e${kingTag ?? `king`} §fSee Everyone?`, adminSeeAll ?? false)
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.formValues
            pl.runCommandAsync(`scoreboard players reset * chatroomSetting`)
            pl.runCommandAsync(`scoreboard players set allSeeAdmin chatroomSetting 0`)
            pl.runCommandAsync(`scoreboard players set adminSeeAll chatroomSetting 0`)

            pl.runCommandAsync(`scoreboard players set "kingTag⌁${resu[0] ?? `king`}" chatroomSetting 0`)
            pl.runCommandAsync(`scoreboard players set allSeeAdmin chatroomSetting ${boolTo(resu[1])}`)
            pl.runCommandAsync(`scoreboard players set adminSeeAll chatroomSetting ${boolTo(resu[2])}`)

            pl.sendMessage(`§fChat Room is now §aSaved!§r`)
        })
    })
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
export function near_chat(pl) {
    system.run(() => {
        let chatRang, messageToggle, AdminToggle, TellAdminToggle
        try {
            messageToggle = toBool(getScore("chatDistance", "messageToggle", true))
            AdminToggle = toBool(getScore("chatDistance", "AdminToggle", true))
            chatRang = getScore("chatDistance", "chatRang", true)
            TellAdminToggle = toBool(getScore("chatDistance", "TellAdminToggle", true))
        } catch (UwU) { }
        if (chatRang === "" || chatRang === undefined || chatRang < 1) chatRang = "15"
        if (messageToggle === "" || messageToggle === undefined) messageToggle = false
        if (AdminToggle === "" || AdminToggle === undefined) AdminToggle = false
        if (TellAdminToggle === "" || TellAdminToggle === undefined) TellAdminToggle = false

        const form = new ModalFormData()
        form.title(`§l§8» §r§0NearChat§8 «`)
        form.textField(`§c» §cSubscribe §f@aitji\n\n§l§a» §fกำหนดระยะของแชท:\n§7» §iไม่สามารถน้อยกว่า 0 ได้..`, `ex: "13"`, `${chatRang}`)
        form.toggle(`§l§fขึ้นข้อความเมื่อไม่ได้รับ§eข้อความ§fไหม§f:`, messageToggle)
        form.toggle(`§l§f"Admin" เห็นทุก§aข้อความ§f:`, AdminToggle)
        form.toggle(`§l§f"Admin" พิมพ์แล้ว§aเห็น§fทุกคน§f:`, TellAdminToggle)
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.formValues
            if (res.formValues[0] === "" || res.formValues[0] === undefined) {
                pl.sendMessage(`§l§fกรุณากรอก§eข้อมูล§fให้ครบถ้วน`)
                return
            }
            if (resu[0] < 1) {
                pl.sendMessage(`§l§fระยะของ §eข้อความ §fไม่สามารถน้อยกว่า 0 ได้`)
                return
            }
            pl.runCommandAsync(`scoreboard players reset * chatDistance`)
            pl.runCommandAsync(`scoreboard players set chatRang chatDistance 15`)
            pl.runCommandAsync(`scoreboard players set messageToggle chatDistance 0`)
            pl.runCommandAsync(`scoreboard players set AdminToggle chatDistance 0`)
            pl.runCommandAsync(`scoreboard players set TellAdminToggle chatDistance 0`)

            pl.runCommandAsync(`scoreboard players set chatRang chatDistance ${resu[0]}`)
            pl.runCommandAsync(`scoreboard players set messageToggle chatDistance ${boolTo(resu[1])}`)
            pl.runCommandAsync(`scoreboard players set AdminToggle chatDistance ${boolTo(resu[2])}`)
            pl.runCommandAsync(`scoreboard players set TellAdminToggle chatDistance ${boolTo(resu[3])}`)

            pl.sendMessage(`§fChat Distance is now §aSaved!§r`)
        })
    })
}
/** _______________________________________________________________ */