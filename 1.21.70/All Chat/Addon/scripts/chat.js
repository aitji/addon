import { ScoreboardIdentityType, world, system, Player } from "@minecraft/server"
import { ModalFormData } from '@minecraft/server-ui'
import { CalDistance, color, getFakePlayer, getScore } from "./call/function"
system.beforeEvents.watchdogTerminate.subscribe(d => d.cancel = true)
/** _______________________________________________________________ */
const RankPrefix = "rank:"
const def = "§7Player"
/** _______________________________________________________________ */
const safeGet = (arr, key, def) => {
    try { return arr.filter(x => x.startsWith(key)).join('').split("⌁")[1] ?? def }
    catch { return def }
}
/** _______________________________________________________________ */
function send_style(pl, msg) {
    const chatroom = getScore('chatroom', pl, true) ?? 0
    const setting = getFakePlayer('rankchat')
    const setting2 = getFakePlayer('chatroomSetting')
    const chatprefix = safeGet(setting, 'chatprefix⌁', RankPrefix)
    const chatdef = safeGet(setting, 'chatdef⌁', def)

    const kingTag = safeGet(setting2, 'kingTag⌁', 'king')
    const allSeeAdmin = toBool(getScore("chatroomSetting", "allSeeAdmin", true))
    const adminSeeAll = toBool(getScore("chatroomSetting", "adminSeeAll", true))

    const ranks = pl.getTags()
        .filter(t => t.startsWith(chatprefix))
        .map(t => t.slice(chatprefix.length))
        .join("§r§i, §r") || chatdef

    const msgFormatted = `§r§l§i[§r${ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${msg}`
    const plPos = pl.location

    pl.sendMessage(msgFormatted)

    let players = world.getAllPlayers().filter(p => p.name !== pl.name)
    let radius = getScore("chatDistance", "chatRang", true) ?? 15
    const toggles = {
        msg: toBool(getScore("chatDistance", "messageToggle", true)),
        admin: toBool(getScore("chatDistance", "AdminToggle", true)),
        tell: toBool(getScore("chatDistance", "TellAdminToggle", true))
    }

    for (let p of players) {
        const sameRoom = getScore('chatroom', p, true) ?? 0

        if (p.hasTag("Admin") && toggles.admin) {
            p.sendMessage(msgFormatted)
            continue
        }

        const dist = CalDistance(plPos, p.location)
        if (dist > radius) {
            if (toggles.msg) p.sendMessage(`§f${color(pl)}${pl.name} ได้§cส่ง§fข้อความ..`)
            continue
        }

        const isAdmin = p.hasTag(kingTag)
        const plIsAdmin = pl.hasTag(kingTag)

        if (isAdmin && adminSeeAll) {
            p.sendMessage(msgFormatted)
            continue
        }

        if (plIsAdmin && allSeeAdmin) {
            p.sendMessage(msgFormatted)
            continue
        }

        if (chatroom === sameRoom) p.sendMessage(msgFormatted)
    }
}
/** _______________________________________________________________ */
world.beforeEvents.chatSend.subscribe(e => {
    const pl = e.sender
    const msg = e.message
    e.cancel = true

    const delay = getScore('delay', pl, true) ?? 0
    const setting = getFakePlayer('chatsettings')
    const text = setting.find(x => x.startsWith('text:'))?.split(":")[1] ?? ''
    const cps = getScore('chatsettings', 'cps', true) ?? 0

    if (delay > 0) {
        pl.sendMessage(`${text} §7: §c${delay}`)
        return
    }

    const delayr = world.scoreboard.getObjective('delay')
    delayr.setScore(pl, Number(cps))
    send_style(pl, msg)
})
/** _______________________________________________________________ */