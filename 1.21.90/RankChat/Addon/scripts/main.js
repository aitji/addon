import { ScoreboardIdentityType, system, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true);
/** ________________________________________________________ */
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}
system.run(() => {
    world.sendMessage(`§l§8| §r§fServer has been §cReloaded!!`)
    createScore("rankchat")
})
/** _________________________________________________________ */
let RankPrefix = "rank:";
let def = "§7Player";

function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** ________________________________________________________ */
world.beforeEvents.chatSend.subscribe((data) => {
    let chatprefix, chatdef
    try {
        let setting = getFakePlayer('rankchat')
        chatprefix = setting.filter(str => str.startsWith('chatprefix⌁')).join('').split("⌁")[1]
        chatdef = setting.filter(str => str.startsWith('chatdef⌁')).join('').split("⌁")[1]
    } catch (UwU) { }
    if (chatprefix === "" || chatprefix === undefined) chatprefix = RankPrefix
    if (chatdef === "" || chatdef === undefined) chatdef = def
    let ranks = data.sender
        .getTags()
        .map((ovo) => {
            if (!ovo.startsWith(chatprefix ?? RankPrefix))
                return null;
            return ovo.substring(chatprefix.length ?? RankPrefix.length);
        })
        .filter((uwu) => uwu)
        .join("§r§i, §r");

    const message = data.message;
    data.cancel = true;
    world.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§7 ${data.sender.name}:§r§f ${message}`);
});
/** ________________________________________________________ */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack

    if (item.typeId == "minecraft:compass" && pl.hasTag("Admin")) {
        try { system.run(() => rsetting(pl)) } catch (OvO) { pl.sendMessage(`§r§l§fไม่สามารถเปิด §cGUI\n§fError: §7${OvO ?? `§r§l§7ไม่สามารถหาข้อผิดพลาดได้`}`) }
    }
})
/** ________________________________________________________ */
function rsetting(pl) {
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
/** ________________________________________________________ */