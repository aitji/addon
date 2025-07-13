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
    let setting, text, cps
    try {
        setting = getFakePlayer('chatsettings')
        text = setting.filter(str => str.startsWith('text:')).join('').split(":")[1]
        cps = getScore('chatsettings', 'cps', true) || 0
    } catch { }

    const form = new ModalFormData()
    form.title(`[§r §lServer Anti Spam§r ]`)
    form.slider(`\nPlease slider this for chat delay per seconds\nChat Delay`, 0, 10, { valueStep: 1, defaultValue: Number(cps) || 0, tooltip: "This is the delay for player to send chat message" })
    form.textField(`Warning message when spam`, `ex: Hey Hey Slow Down please`, { defaultValue: text || "Hey Hey Slow Down please", tooltip: "This message will be sent to player when they spam chat" })

    form.show(pl).then(res => {
        if (res.canceled) return
        let chatsettings = world.scoreboard.getObjective('chatsettings')
        if (!chatsettings) {
            world.scoreboard.addObjective('chatsettings', 'Chat Settings')
            chatsettings = world.scoreboard.getObjective('chatsettings')
        }

        chatsettings.getParticipants().forEach(participant => chatsettings.removeParticipant(participant))
        chatsettings.setScore("cps", Number(res.formValues[0]))
        chatsettings.setScore(`text:${res.formValues[1]}`, 1)
        pl.sendMessage(`§r§7§l| §r§fChat Per Seconds has set to §c"${res.formValues[0]}"`)
        pl.sendMessage(`§r§7§l| §r§fThe Message has set to §c"${res.formValues[1]}"`)
    })
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
export function rank_chat(pl) {
    let chatprefix, chatdef
    try {
        let setting = getFakePlayer('rankchat')
        chatprefix = setting.filter(str => str.startsWith('chatprefix⌁')).join('').split("⌁")[1]
        chatdef = setting.filter(str => str.startsWith('chatdef⌁')).join('').split("⌁")[1]
    } catch { }
    if (chatprefix === "" || chatprefix === undefined) chatprefix = RankPrefix
    if (chatdef === "" || chatdef === undefined) chatdef = def
    const form = new ModalFormData()
    form.title(`§l§8» §r§0RankChat §l§8«`)
    form.textField(`§c§l»§r§c Subscribe §f@aitji.§r\n\n§l§a»§r§f Rank Chat §aPrefix§f ex: §o"rank:"§r\n§l§a»§r§l §aคำนำหน้า§fก่อน Rank เช่น §o"rank:"§r`, `ex: "${chatprefix || `rank:`}"`, { defaultValue: chatprefix, tooltip: "This is the prefix for rank chat, ex: 'rank:'" })
    form.textField(`§l§e»§r§f Rank Chat §eDefault§f ex: §o"§7Player§f"§r\n§l§e»§r§l §fยศ§eเริ่มต้น §fเช่น §o"§7ผู้เล่น§f"§r`, `ex: "${chatdef || `§7player`}"`, { defaultValue: chatdef, tooltip: "This is the default rank for players who don't have a rank set, ex: '§7Player'" })
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

        let rankchat = world.scoreboard.getObjective('rankchat')
        if (!rankchat) {
            world.scoreboard.addObjective('rankchat', 'Rank Chat')
            rank_chat = world.scoreboard.getObjective('rankchat')
        }

        rankchat.getParticipants().forEach(participant => rankchat.removeParticipant(participant))
        const all = [chatprefix, chatdef]
        for (let i = 0; i < all.length; i++) {
            var on = false
            if (all[i] === chatprefix) rankchat.setScore(`chatprefix⌁${res.formValues[0]}`, i + 1), on = true
            if (all[i] === chatdef) rankchat.setScore(`chatdef⌁${res.formValues[1]}`, i + 1), on = true

            if (on === false) rankchat.setScore(all[i].toString(), i + 1)
        }
        pl.sendMessage(`§fRank Chat is now §aSaved!§r`)
    })
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
export function chat_room(pl) {
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
    form.textField(`§c§l»§r§c Subscribe §f@aitji.§r\n\n§l§a»§r§f ChatRoom §aKingTag§f ex: §o"king", "spy"§r`, `ex: "${kingTag || `king`}"`, { defaultValue: kingTag, tooltip: "This is the tag for the king in chat room, ex: 'king'" })
    form.toggle(`§e»§f Everyone See §e${kingTag || `king`}?`, { defaultValue: allSeeAdmin || false, tooltip: "If enabled, everyone can see the king's messages" })
    form.toggle(`§e» §e${kingTag || `king`} §fSee Everyone?`, { defaultValue: adminSeeAll || false, tooltip: "If enabled, the king can see everyone's messages" })
    form.show(pl).then(res => {
        if (res.canceled) return
        const resu = res.formValues
        let chatroomSetting = world.scoreboard.getObjective('chatroomSetting')
        if (!chatroomSetting) {
            world.scoreboard.addObjective('chatroomSetting', 'Chat Room Setting')
            chatroomSetting = world.scoreboard.getObjective('chatroomSetting')
        }

        chatroomSetting.getParticipants().forEach(participant => chatroomSetting.removeParticipant(participant))
        chatroomSetting.setScore(`allSeeAdmin`, Number(boolTo(resu[1])))
        chatroomSetting.setScore(`adminSeeAll`, Number(boolTo(resu[2])))
        chatroomSetting.setScore(`kingTag⌁${resu[0] || `king`}`, 0)

        pl.sendMessage(`§fChat Room is now §aSaved!§r`)
    })
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 */
export function near_chat(pl) {
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
    form.textField(`§c» §cSubscribe §f@aitji.\n\n§l§a» §fกำหนดระยะของแชท:\n§7» §iไม่สามารถน้อยกว่า 0 ได้..`, `ex: "13"`, { defaultValue: String(chatRang || ''), tooltip: "This is the distance for near chat, ex: '13'" })
    form.toggle(`§l§fขึ้นข้อความเมื่อไม่ได้รับ§eข้อความ§fไหม§f:`, { defaultValue: messageToggle || false, tooltip: "If enabled, it will show a message when no one is nearby" })
    form.toggle(`§l§f"Admin" เห็นทุก§aข้อความ§f:`, { defaultValue: AdminToggle || false, tooltip: "If enabled, admins can see all messages in near chat" })
    form.toggle(`§l§f"Admin" พิมพ์แล้ว§aเห็น§fทุกคน§f:`, { defaultValue: TellAdminToggle || false, tooltip: "If enabled, admins can see all messages in near chat" })
    form.show(pl).then(res => {
        if (res.canceled) return
        const resu = res.formValues
        if (res.formValues[0] === "" || res.formValues[0] === undefined) return pl.sendMessage(`§l§fกรุณากรอก§eข้อมูล§fให้ครบถ้วน`)
        if (resu[0] < 1) return pl.sendMessage(`§l§fระยะของ §eข้อความ §fไม่สามารถน้อยกว่า 0 ได้`)
        if (isNaN(Number(resu[0])) || resu[0].toString().toLowerCase().includes('e')) return pl.sendMessage(`§l§fระยะของไม่สามารถเป็น§eข้อความ§fได้ กรุณากรอกเป็นตัวเลขเท่านั้น`)

        let chatDistance = world.scoreboard.getObjective('chatDistance')
        if (!chatDistance) {
            world.scoreboard.addObjective('chatDistance', 'Chat Distance')
            chatDistance = world.scoreboard.getObjective('chatDistance')
        }
        chatDistance.getParticipants().forEach(participant => chatDistance.removeParticipant(participant))
        chatDistance.setScore(`chatRang`, Number(resu[0]))
        chatDistance.setScore(`messageToggle`, Number(boolTo(resu[1])))
        chatDistance.setScore(`AdminToggle`, Number(boolTo(resu[2])))
        chatDistance.setScore(`TellAdminToggle`, Number(boolTo(resu[3])))

        pl.sendMessage(`§fChat Distance is now §aSaved!§r`)
    })
}
/** _______________________________________________________________ */