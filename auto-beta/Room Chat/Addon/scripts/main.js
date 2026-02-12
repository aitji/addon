/** ________________________________________________________ */
import { world, system, ScoreboardIdentityType } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"
import "./lib"
/** ________________________________________________________ */
system.run(() => {
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
const toBool = (data) => data === 1
const boolTo = (data) => data === true ? 1 : 0
/** ________________________________________________________ */
world.beforeEvents.itemUse.subscribe(
    ({ source, itemStack }) =>
        itemStack?.typeId === "aitji:roomchat" &&
        source.hasTag("Admin") &&
        system.run(() => {
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
            form.show(source).then(({ canceled, formValues }) => {
                if (canceled) return

                const [king, seeAll, adminSee] = formValues
                const obj = world.scoreboard.getObjective('chatroomSetting') || world.scoreboard.addObjective('chatroomSetting', 'Chat Room Setting')

                obj.getParticipants().forEach(p => obj.removeParticipant(p))
                obj.setScore('allSeeAdmin', Number(boolTo(seeAll)))
                obj.setScore('adminSeeAll', Number(boolTo(adminSee)))
                obj.setScore(`kingTag⌁${king || 'king'}`, 0)
                source.sendMessage(`§fChat Room is now §aSaved!§r`)
            })
        })
)
/** ________________________________________________________ */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective) || world.scoreboard.addObjective(objective)
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
    const { sender, message } = data
    data.cancel = true

    const chatroom = getScore('chatroom', sender, true) || 0
    let kingTag, allSeeAdmin, adminSeeAll
    try {
        const setting = getFakePlayer('chatroomSetting')
        kingTag = setting.filter(str => str.startsWith('kingTag⌁')).join('').split("⌁")[1] || 'king'
        allSeeAdmin = toBool(getScore("chatroomSetting", "allSeeAdmin", true)) || false
        adminSeeAll = toBool(getScore("chatroomSetting", "adminSeeAll", true)) || false
    } catch (UwU) { }

    for (const plr of world.getPlayers()) {
        let plrchatroom = getScore('chatroom', plr, true) || 0

        if (plr.hasTag(kingTag) && adminSeeAll) {
            if (sender.hasTag(kingTag)) plr.sendMessage(`§f<§e${sender.name}§f>§f ${message}§r`)
            else plr.sendMessage(`§f<${sender.name}>§f ${message}§r`)
        } else if (sender.hasTag(kingTag) && allSeeAdmin) {
            plr.sendMessage(`§f<§e${sender.name}§f>§f ${message}§r`)
        } else if (plrchatroom === chatroom) {
            if (sender.hasTag(kingTag)) plr.sendMessage(`§f<§e${sender.name}§f>§f ${message}§r`)
            else plr.sendMessage(`§f<${sender.name}>§f ${message}§r`)
        }
    }
})

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return

    const chatroom = world.scoreboard.getObjective('chatroom') || world.scoreboard.addObjective('chatroom')
    chatroom.addScore(player, 0)
})
/** ________________________________________________________ */