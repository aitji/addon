import { ScoreboardIdentityType, world, system } from "@minecraft/server";
import { ModalFormData } from '@minecraft/server-ui'
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
system.run(() => {
    world.scoreboard.getObjective("chatsettings") ? '' : world.scoreboard.addObjective("chatsettings")
    world.scoreboard.getObjective("delay") ? '' : world.scoreboard.addObjective("delay")
})
/** --------------------------------------------- */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** --------------------------------------------- */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) || 0
        return obj.getScore(target.scoreboardIdentity) || 0
    } catch {
        return useZero ? 0 : NaN
    }
}
/** --------------------------------------------- */
world.beforeEvents.itemUse.subscribe((data) => {
    const pl = data.source
    const item = data.itemStack
    data.cancel = true

    if (pl.hasTag('Admin') && item.typeId === "minecraft:compass") system.run(() => antispamui(pl))
})
/** --------------------------------------------- */
function antispamui(pl) {
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
        pl.runCommand(`scoreboard players reset * chatsettings`)
        pl.runCommand(`scoreboard players set cps chatsettings ${res.formValues[0]}`)
        pl.runCommand(`scoreboard players set "text:${res.formValues[1]}" chatsettings 1`)
        pl.sendMessage(`§r§7§l| §r§fChat Per Seconds has set to §c"${res.formValues[0]}"`)
        pl.sendMessage(`§r§7§l| §r§fThe Message has set to §c"${res.formValues[1]}"`)
    })
}
/** --------------------------------------------- */
system.runInterval(() => {
    const delay = world.scoreboard.getObjective('delay')
    for (const player of world.getPlayers()) {
        const count = delay.getScore(player) || 0
        delay.addScore(player, -1)
        if (count - 1 <= 0) delay.removeParticipant(player)
    }
}, 20)
/** --------------------------------------------- */
world.beforeEvents.chatSend.subscribe((data) => {
    system.run(() => {
        const pl = data.sender
        const msg = data.message
        const mindcps = getScore('delay', pl, true) ?? 0
        let setting, text, cps
        try {
            setting = getFakePlayer('chatsettings')
            text = setting.filter(str => str.startsWith('text:')).join('').split(":")[1]
            cps = getScore('chatsettings', 'cps', true) ?? 0
        } catch (lemmyface) { }

        if (mindcps > 0) {
            pl.sendMessage(`${text ?? ``} §7: §c${mindcps ?? 0}`)
            data.cancel = true
            return
        }
        pl.runCommand(`scoreboard players set @s delay ${cps ?? 0}`)
    })
})
/** --------------------------------------------- */