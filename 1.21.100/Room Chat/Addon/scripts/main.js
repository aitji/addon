/** ________________________________________________________ */
import { world, system, ScoreboardIdentityType } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true);
/** ________________________________________________________ */
system.run(() => {
    world.sendMessage(`§l§8| §r§fServer[Chat Room] has been §c§lLoaded!!`)
    createScore("chatroom")
    createScore("chatroomSetting")
})
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
    if (item?.typeId === "minecraft:paper" && pl.hasTag("Admin")) system.run(() => {
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
    })
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

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return
    const chatroom = world.scoreboard.getObjective('chatroom')
    chatroom.addScore(player, 0)
})
/** ________________________________________________________ */