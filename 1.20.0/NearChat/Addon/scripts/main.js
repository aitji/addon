/** ________________________________________________________ */
import { world, ScoreboardIdentity, ScoreboardIdentityType, system, Player } from "@minecraft/server"
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui"
system.beforeEvents.watchdogTerminate.subscribe((data) => data.cancel = true)
world.sendMessage(`§l§8| §r§fDistance Chat Now §cReload!!`)
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
createScore("chatDistance")
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}
/** ________________________________________________________ */
function CalDistance(pl1, pl2) {
    const dx = pl1.x - pl2.x;
    const dy = pl1.y - pl2.y;
    const dz = pl1.z - pl2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
/** ________________________________________________________ */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack

    if (item.typeId === "minecraft:paper" && pl.hasTag("Admin")) menu(pl)
})
/** ________________________________________________________ */
world.beforeEvents.chatSend.subscribe(data => {
    let radius, messageToggle, AdminToggle, TellAdminToggle
    try {
        messageToggle = toBool(getScore("chatDistance", "messageToggle", true))
        AdminToggle = toBool(getScore("chatDistance", "AdminToggle", true))
        radius = getScore("chatDistance", "chatRang", true)
        TellAdminToggle = toBool(getScore("chatDistance", "TellAdminToggle", true))
    } catch (UwU) { }
    if (radius === "" || radius === undefined || radius < 1) radius = "15"
    if (messageToggle === "" || messageToggle === undefined) messageToggle = false
    if (AdminToggle === "" || AdminToggle === undefined) AdminToggle = false
    if (TellAdminToggle === "" || TellAdminToggle === undefined) TellAdminToggle = false

    const pl = data.sender;
    const msg = data.message;
    data.cancel = true
    const plPosition = pl.location;
    if (pl.hasTag("Admin") && TellAdminToggle) {
        world.sendMessage(`<${pl.name}> ${msg}`)
        return
    }
    pl.sendMessage(`§f <${pl.name}> ${msg}§r`)
    world.getAllPlayers().filter(plrs => pl.name !== plrs.name).forEach(plr => {
        if (plr.hasTag("Admin") && AdminToggle) {
            plr.sendMessage(`<${pl.name}> ${msg}`)
            return
        }
        if (plr !== pl) {
            const plrPosition = plr.location;
            const distance = CalDistance(plPosition, plrPosition);

            if (distance <= Number(radius)) plr.sendMessage(`<${pl.name}> ${msg}`)
            else {
                if (messageToggle) plr.sendMessage(`§l§f${pl.name} ได้§cส่ง§fข้อความ..`)
                else return
            }
        }
    });
});
/** ________________________________________________________ */
// Hover pl = world.getAllPlayers().filter(plr = plr.hasTag("Admin"))[0]
function menu(pl) {
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
        form.title(`§l§8» §r§7NearChat§8 «`)
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
/** ________________________________________________________ */