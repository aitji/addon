/** ________________________________________________________ */
import { world, system, ScoreboardIdentityType } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true);
world.sendMessage(`§l§8| §r§fServer[Chat Room] has been §c§lLoaded!!`)
/** ________________________________________________________ */
createScore("chatroom")
createScore("chatroomSetting")
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}
/** _________________________________________________________ */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** ________________________________________________________ */
function toBool(data) {
    if (data === 0) return false
    if (data === 1) return true
    return false
}
function boolTo(data) {
    if (data === false) return 0
    if (data === true) return 1
    return 0
}
/** ________________________________________________________ */
world.beforeEvents.itemUse.subscribe((data) => {
    const pl = data.source
    const item = data.itemStack
    if (item?.typeId === "minecraft:paper" && pl.hasTag("Admin")) {
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

            form.title(`§l§8» §r§7Chat Room §l§8«`)
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

                pl.sendMessage(`§fChat Distance is now §aSaved!§r`)
            })
        })
    }
})
/** ________________________________________________________ */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
        }
        return obj.getScore(target.scoreboardIdentity)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** ________________________________________________________ */
world.beforeEvents.chatSend.subscribe((data) => {
    const pl = data.sender;
    const msg = data.message;
    data.cancel = true
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
    let chatroom = getScore('chatroom', pl, true) ?? 0
    world.getAllPlayers().map(plr => {
        let plrchatroom = getScore('chatroom', plr, true) ?? 0
        if (plr.hasTag(kingTag) && adminSeeAll) {
            if (pl.hasTag(kingTag)) plr.sendMessage(`§f<§e${pl.name}§f>§f ${msg}§r`);
            else plr.sendMessage(`§f<${pl.name}>§f ${msg}§r`);
            return
        }
        if (pl.hasTag(kingTag) && allSeeAdmin) {
            plr.sendMessage(`§f<§e${pl.name}§f>§f ${msg}§r`);
            return
        }
        if (plrchatroom === chatroom) {
            if (pl.hasTag(kingTag)) plr.sendMessage(`§f<§e${pl.name}§f>§f ${msg}§r`);
            else plr.sendMessage(`§f<${pl.name}>§f ${msg}§r`);
            return
        }
    });
});
system.runInterval(() => {
    world.getDimension("overworld").runCommandAsync(`scoreboard players add @a chatroom 0`)
})
/** ________________________________________________________ */