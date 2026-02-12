import { ScoreboardIdentityType, system, world } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"
import "./lib"
/** ________________________________________________________ */
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}
system.run(() => createScore("rankchat"))
/** _________________________________________________________ */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** ________________________________________________________ */
world.beforeEvents.chatSend.subscribe((data) => {
    const { sender, message } = data
    let chatprefix, chatdef
    try {
        const setting = getFakePlayer('rankchat')
        chatprefix = setting
            .filter(x => x.startsWith('chatprefix⌁'))
            .join('')
            .split('⌁')[1] || 'rank:'
        chatdef = setting
            .filter(x => x.startsWith('chatdef⌁'))
            .join('')
            .split('⌁')[1] || '§7Player'
    } catch { }

    const ranks = sender
        .getTags()
        .filter(t => t.startsWith(chatprefix))
        .map(t => t.slice(chatprefix.length))
        .join('§r§i, §r') || chatdef

    data.cancel = true
    world.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef || '§7Player') : ranks}§r§l§i]§r§7 ${sender.name}:§r§f ${message}`)
})
/** ________________________________________________________ */
world.beforeEvents.itemUse.subscribe(
    ({ source, itemStack }) =>
        itemStack?.typeId === 'aitji:rankchat' &&
        source.hasTag('Admin') &&
        system.run(() => {
            let chatprefix, chatdef
            try {
                const setting = getFakePlayer('rankchat')
                chatprefix = setting
                    .filter(x => x.startsWith('chatprefix⌁'))
                    .join('')
                    .split('⌁')[1] || 'rank:'
                chatdef = setting
                    .filter(x => x.startsWith('chatdef⌁'))
                    .join('')
                    .split('⌁')[1] || '§7Player'
            } catch { }

            const form = new ModalFormData()
            form.title(`§l§8» §rRankChat §l§8«`)
            form.textField(`§c§l»§r§c Subscribe §f@aitji.§r\n\n§l§a»§r §fคำนำหน้า(Prefix) ของ §aRank Chat`, `ex: "${chatprefix}"`, { defaultValue: chatprefix })
            form.textField(`§l§e»§r§e Rank §fเริ่มต้นของผู้เล่น`, `ex: "${chatdef}"`, { defaultValue: chatdef })
            form.show(source).then(({ canceled, formValues }) => {
                if (canceled) return

                const [valPrefix, valDef] = formValues
                if (!valPrefix || !valDef) return source.sendMessage(`§l§7| §r§fกรุณากรอก§eข้อมูล§fให้ครบถ้วน`)
                const rankchat = world.scoreboard.getObjective('rankchat') || world.scoreboard.addObjective('rankchat', 'Rank Chat')

                rankchat.getParticipants().forEach(p => rankchat.removeParticipant(p))
                rankchat.setScore(`chatprefix⌁${valPrefix}`, 1)
                rankchat.setScore(`chatdef⌁${valDef}`, 1)
                source.sendMessage(`§fRank Chat is now §aSaved!§r`)
            })
        })
)
/** ________________________________________________________ */