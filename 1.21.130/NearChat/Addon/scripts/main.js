/** ________________________________________________________ */
import { world, ScoreboardIdentity, ScoreboardIdentityType, system, Player } from "@minecraft/server"
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui"
import "./lib"
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
const toBool = (data) => data === 1
const boolTo = (data) => data === true ? 1 : 0
/** ________________________________________________________ */
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}
system.run(() => createScore("chatDistance"))
/** ________________________________________________________ */
function calDis(pl1, pl2) {
    const dx = pl1.x - pl2.x;
    const dy = pl1.y - pl2.y;
    const dz = pl1.z - pl2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
/** ________________________________________________________ */
world.beforeEvents.itemUse.subscribe(
    ({ source, itemStack }) =>
        itemStack?.typeId === 'aitji:nearchat' &&
        source.hasTag('Admin') &&
        system.run(() => {
            let chatRang, messageBool, AdminBool, TellAdminBool
            try {
                messageBool = toBool(getScore('chatDistance', 'messageToggle', true)) || false
                AdminBool = toBool(getScore('chatDistance', 'AdminToggle', true)) || false
                chatRang = getScore('chatDistance', 'chatRang', true) || 15
                TellAdminBool = toBool(getScore('chatDistance', 'TellAdminToggle', true)) || false
            } catch { }
            chatRang = chatRang < 1 ? '15' : chatRang

            const form = new ModalFormData()
            form.title(`§l§8» §rNearChat§8 «`)
            form.textField(`§c» §cSubscribe §f@aitji.\n§a» §fระยะห่างที่เห็นแชท`, `ex: "${chatRang}"`, { defaultValue: String(chatRang) })
            form.toggle(`§e»§f แสดงข้อความเมื่อไม่มีใครอยู่ใกล้เคียง`, { defaultValue: messageBool })
            form.toggle(`§e»§f "Admin" เห็นข้อความทั้งหมด`, { defaultValue: AdminBool })
            form.toggle(`§e»§f การพิมพ์ของ "Admin" จะเห็นทั้งหมด`, { defaultValue: TellAdminBool })

            form.show(source).then(({ canceled, formValues }) => {
                if (canceled) return

                const [range, msg, admin, tell] = formValues
                if (!range || range < 1 || isNaN(Number(range))) return source.sendMessage(`§7กรุณาใส่ตัวเลขที่§cมากกว่า 0§7 ในระยะห่างที่เห็นแชท`)

                let obj = world.scoreboard.getObjective('chatDistance') || world.scoreboard.addObjective('chatDistance', 'Chat Distance')
                obj.getParticipants().forEach(p => obj.removeParticipant(p))
                obj.setScore('chatRang', Number(range))
                obj.setScore('messageToggle', Number(boolTo(msg)))
                obj.setScore('AdminToggle', Number(boolTo(admin)))
                obj.setScore('TellAdminToggle', Number(boolTo(tell)))
                source.sendMessage(`§fChat Distance is now §aSaved!§r`)
            })
        })
)
/** ________________________________________________________ */
world.beforeEvents.chatSend.subscribe(data => {
    data.cancel = true

    let radius, isMsgShown, isAdminSaw, isTellAdmin
    try {
        isMsgShown = toBool(getScore("chatDistance", "messageToggle", true)) || false
        isAdminSaw = toBool(getScore("chatDistance", "AdminToggle", true)) || false
        radius = getScore("chatDistance", "chatRang", true) || false
        isTellAdmin = toBool(getScore("chatDistance", "TellAdminToggle", true)) || false
    } catch (UwU) { }
    radius = radius < 1 ? '15' : radius

    const { sender, message } = data
    const { location: playerPos } = sender;

    if (sender.hasTag("Admin") && isTellAdmin) return world.sendMessage(`<${sender.name}> ${message}`)
    sender.sendMessage(`§f <${sender.name}> ${message}§r`)

    world.getPlayers({ excludeNames: [sender.name] }).forEach(plr => {
        if (plr.hasTag("Admin") && isAdminSaw) return plr.sendMessage(`<${sender.name}> ${message}`)

        if (plr !== sender) {
            if (calDis(playerPos, plr.location) <= Number(radius)) plr.sendMessage(`<${sender.name}> ${message}`)
            else if (isMsgShown) plr.sendMessage(`§o§7*${sender.name} ส่งข้อความ..*`)
        }
    });
});
/** ________________________________________________________ */