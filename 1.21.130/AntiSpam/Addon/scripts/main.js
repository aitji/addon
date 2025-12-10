import { ScoreboardIdentityType, world, system } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"
import "./lib"

system.run(() => {
    world.scoreboard.getObjective("chatsettings")
        ? ""
        : world.scoreboard.addObjective("chatsettings")
    world.scoreboard.getObjective("delay")
        ? ""
        : world.scoreboard.addObjective("delay")
})

function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter((data) => data.type === ScoreboardIdentityType.FakePlayer)
        .map((data) => data.displayName)
}

function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == "string")
            return (
                obj.getScore(
                    obj.getParticipants().find((v) => v.displayName == target)
                ) || 0
            )
        return obj.getScore(target.scoreboardIdentity) || 0
    } catch {
        return useZero ? 0 : NaN
    }
}

world.beforeEvents.itemUse.subscribe(
    ({ source, itemStack }) =>
        source.hasTag("Admin") &&
        itemStack.typeId === "aitji:antispam" &&
        system.run(() => {
            let text, cps
            try {
                const setting = getFakePlayer("chatsettings")
                text =
                    setting
                        .filter((s) => s.startsWith("text:"))
                        .join("")
                        .split(":")[1] || "Hey Hey Slow Down please"
                cps = getScore("chatsettings", "cps", true) || 0
            } catch { }

            const form = new ModalFormData()
            form.title(`[§r §lServer Anti Spam§r ]`)
            form.slider(`§c§l»§r§c Subscribe §f@aitji.§r\n\n§e§l» §r§fดีเลย์ของ§eแชทต่อวินาที§r`, 0, 10, { valueStep: 1, defaultValue: Number(cps) || 0, tooltip: "นี่คือดีเลย์ของผู้เล่นในการส่งข้อความในแชท", })
            form.textField(
                `§c§l» §r§fข้อความเตือนเมื่อ§cสแปม`,
                `ex: Hey Hey Slow Down please`,
                {
                    defaultValue: text || "Hey Hey Slow Down please",
                    tooltip: "ข้อความนี้จะถูกส่งไปยังผู้เล่นเมื่อสแปมแชท",
                }
            )

            form.show(source).then(({ canceled, formValues }) => {
                if (canceled) return
                const chatsettings =
                    world.scoreboard.getObjective("chatsettings") ||
                    world.scoreboard.addObjective("chatsettings", "Chat Settings")

                chatsettings
                    .getParticipants()
                    .forEach((p) => chatsettings.removeParticipant(p))
                chatsettings.setScore("cps", Number(formValues[0]))
                chatsettings.setScore(`text:${formValues[1]}`, 1)
                source.sendMessage(`§fAntiSpam is now §aSaved!§r`)
            })
        })
)

// <aitji> if im not lazy i should use system.currentTick, so no loop need
system.runInterval(() => {
    const delay = world.scoreboard.getObjective('delay')

    for (const player of world.getPlayers()) {
        const count = getScore('delay', player, true) || 0

        if (count > 0) delay.setScore(player, count - 1)
        else delay.removeParticipant(player)
    }
}, 20)

world.beforeEvents.chatSend.subscribe((data) => {
    const { sender } = data

    const senderCPS = getScore("delay", sender, true) || 0
    let setting, text, cps
    try {
        setting = getFakePlayer("chatsettings")
        text = setting
            .filter((str) => str.startsWith("text:"))
            .join("")
            .split(":")[1]
        cps = getScore("chatsettings", "cps", true) || 0
    } catch (lemmyface) { }

    if (senderCPS > 0) {
        sender.sendMessage(`${text === '' ? '' : text + '§7: '}§c${senderCPS || 0}`)
        data.cancel = true
        return
    }

    const delay = world.scoreboard.getObjective("delay")
    system.run(() => delay.setScore(sender, cps || 0))
})
