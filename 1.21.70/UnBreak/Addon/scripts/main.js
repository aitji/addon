import { Player, ScoreboardIdentityType, system, world } from "@minecraft/server"
import { ModalFormData } from '@minecraft/server-ui'
/** ________________________________________________ */
/**
 * @param {String} objective 
 * @param {String} target 
 * @param {boolean} useZero 
 * @returns {number}
 */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) ?? 0
        }
        return obj.getScore(target.scoreboardIdentity) ?? 0
    } catch {
        return useZero ? 0 : NaN
    }
}
/** ________________________________________________ */
/**
 * @param {number} data 
 * @returns {boolean}
 */
function toBool(data) {
    if (data === 0) return false
    if (data === 1) return true
    return false
}
/** ________________________________________________ */
/**
 * @param {boolean} data 
 * @returns {number}
 */
function boolTo(data) {
    if (data === false) return 0
    if (data === true) return 1
    return 0
}
/** ________________________________________________ */
/**
 * @param {string} scoreboardName 
 * @returns {null}
 */
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
    world.getDimension("overworld").runCommand(`scoreboard players reset * unbreak`)
    world.getDimension("overworld").runCommand(`scoreboard players set "tag⌁build" unbreak 2`)
    world.getDimension("overworld").runCommand(`scoreboard players set "breaktext⌁§c[!] ห้ามทุบบล็อก!§r" unbreak 2`)
    world.getDimension("overworld").runCommand(`scoreboard players set "placetext⌁§c[!] ห้ามวางบล็อก!§r" unbreak 2`)
    world.getDimension("overworld").runCommand(`scoreboard players set "parbreak" unbreak 1`)
    world.getDimension("overworld").runCommand(`scoreboard players set "parplace" unbreak 1`)
    world.getDimension("overworld").runCommand(`scoreboard players set "popbreak" unbreak 1`)
    world.getDimension("overworld").runCommand(`scoreboard players set "popplace" unbreak 1`)
    world.getDimension("overworld").runCommand(`scoreboard players set "dashbreak" unbreak 1`)
    world.getDimension("overworld").runCommand(`playsound random.orb @s`)
}
/** ________________________________________________ */
/**
 * @param {Player} target 
 * @param {number} horizontalStrength 
 * @param {number} verticalStrength 
 * @param {Player} pro 
 */
function applyDash(target, horizontalStrength, verticalStrength, pro) {
    const di = pro.getViewDirection()
    const hStrength = Math.sqrt(di.x ** 2 + di.z ** 2) * horizontalStrength
    const vStrength = di.y * verticalStrength
    target.applyKnockback(di.x, di.z, hStrength, vStrength)
}
/** ________________________________________________ */
/**
 * @param {String} objectiveId 
 * @returns {Array}
 */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** ________________________________________________ */
system.run(() => createScore("unbreak"))
/** ________________________________________________ */
world.beforeEvents.playerBreakBlock.subscribe((data) => {
    const pl = data.player
    const [tag, breaktext, placetext, parbreak, parplace, popbreak, popplace, dashbreak] = get();
    if (pl.hasTag(tag ?? "build")) return
    data.cancel = true

    if (breaktext.trim() !== "") pl.sendMessage(breaktext ?? `§c[!] Hey Don't Break this block!`)
    if (parbreak) pl.runCommand(`particle minecraft:villager_angry ${data.block.x} ${data.block.y + 1.5} ${data.block.z}`)
    if (parbreak) pl.runCommand(`particle minecraft:egg_destroy_emitter ${data.block.x} ${data.block.y + 1} ${data.block.z}`)
    if (popbreak) pl.runCommand(`playsound random.pop @a[r=5]`)
    if (dashbreak) system.run(() => applyDash(pl, 0, -0.2, pl))
})
/** ________________________________________________ */
world.beforeEvents.playerPlaceBlock.subscribe(data => {
    const pl = data.player
    const [tag, breaktext, placetext, parbreak, parplace, popbreak, popplace, dashbreak] = get();
    if (pl.hasTag(tag ?? "build")) return
    data.cancel = true

    if (placetext.trim() !== "") pl.sendMessage(placetext ?? `§c[!] Hey Don't Place that block!`)
    if (parplace) pl.runCommand(`particle minecraft:villager_angry ${data.block.x} ${data.block.y + 1.5} ${data.block.z}`)
    if (parplace) pl.runCommand(`particle minecraft:egg_destroy_emitter ${data.block.x} ${data.block.y + 1} ${data.block.z}`)
    if (popplace) pl.runCommand(`playsound random.pop @a[r=5]`)
})
/** ________________________________________________ */
world.beforeEvents.itemUse.subscribe((data) => {
    const pl = data.source
    const item = data.itemStack
    if (item.typeId === "minecraft:apple" && pl.hasTag("Admin")) system.run(() => settings(pl))
})
/** ________________________________________________ */
/**
 * @param {Player} pl 
 */
function settings(pl) {
    const form = new ModalFormData()
    const [tag, breaktext, placetext, parbreak, parplace, popbreak, popplace, dashbreak] = get();

    form.title(`§9Unbreak§r Settings`)
    form.textField(`§fแท็กสำหรับ §eคนสร้าง:\n§f(ค่าเริ่มต้น: §7build§f)`, `เขียนแท็กที่นี่~`, tag)
    form.textField(`§fข้อความเตือน [§cตอน ทุบบล็อก§f]\n§fการเว้นว่างจะทำให้ไม่แสดงข้อความ`, `เขียนข้อความ ๆ`, breaktext)
    form.textField(`§fข้อความเตือน [§aตอน วางบล็อก§f]\n§fการเว้นว่างจะทำให้ไม่แสดงข้อความ`, `เขียนข้อความ ๆ`, placetext)

    form.toggle(`§fพาร์ทิเคิล~ [§cตอน ทุบบล็อก§f]`, parbreak)
    form.toggle(`§fพาร์ทิเคิล~ [§aตอน วางบล็อก§f]`, parplace)

    form.toggle(`§fเสียง §ePOP§f [§cตอน ทุบบล็อก§f]`, popbreak)
    form.toggle(`§fเสียง §ePOP§f~ [§aตอน วางบล็อก§f]`, popplace)
    form.toggle(`§fเด้ง§eผู้เล่น§fขึ้นเล็กน้อย§f~ [§cตอน ทุบบล็อก§f]`, dashbreak)
    form.show(pl).then((res) => {
        if (res.canceled) return
        const resu = res.formValues
        pl.runCommand(`scoreboard players reset * unbreak`)
        pl.runCommand(`scoreboard players set "tag⌁${resu[0]}" unbreak 2`)
        pl.runCommand(`scoreboard players set "breaktext⌁${resu[1]}" unbreak 2`)
        pl.runCommand(`scoreboard players set "placetext⌁${resu[2]}" unbreak 2`)
        pl.runCommand(`scoreboard players set "parbreak" unbreak ${boolTo(resu[3])}`)
        pl.runCommand(`scoreboard players set "parplace" unbreak ${boolTo(resu[4])}`)
        pl.runCommand(`scoreboard players set "popbreak" unbreak ${boolTo(resu[5])}`)
        pl.runCommand(`scoreboard players set "popplace" unbreak ${boolTo(resu[6])}`)
        pl.runCommand(`scoreboard players set "dashbreak" unbreak ${boolTo(resu[7])}`)
        pl.runCommand(`playsound random.orb @s`)
        pl.sendMessage(`§l§aบันทึก§r§fข้อมูลแล้ว~`)
    })
}
/** ________________________________________________ */
/**
 * @returns {Array}
 */
function get() {
    let tag, breaktext, placetext, parbreak, parplace, popbreak, popplace, dashbreak;
    try {
        let setting = getFakePlayer('unbreak');
        tag = setting.find(str => str.startsWith('tag⌁'))?.split("⌁")[1] || "build";
        breaktext = setting.find(str => str.startsWith('breaktext⌁'))?.split("⌁")[1];
        placetext = setting.find(str => str.startsWith('placetext⌁'))?.split("⌁")[1];

        parbreak = toBool(getScore("unbreak", "parbreak", true))
        parplace = toBool(getScore("unbreak", "parplace", true))
        popbreak = toBool(getScore("unbreak", "popbreak", true))
        popplace = toBool(getScore("unbreak", "popplace", true))
        dashbreak = toBool(getScore("unbreak", "dashbreak", true))
        if (breaktext.trim() === "") breaktext = "";
        if (placetext.trim() === "") placetext = "";
    } catch (UwU) { }

    return [tag, breaktext ?? "§c[!] ห้ามทุบบล็อก!§r", placetext ?? "§c[!] ห้ามวางบล็อก!§r", parbreak, parplace, popbreak, popplace, dashbreak];
}
/** ________________________________________________ */