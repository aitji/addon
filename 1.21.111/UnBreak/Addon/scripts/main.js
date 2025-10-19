import { Player, ScoreboardIdentityType, system, world } from "@minecraft/server"
import { ModalFormData } from '@minecraft/server-ui'
import "./lib"
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
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) || 0
        }
        return obj.getScore(target.scoreboardIdentity) || 0
    } catch {
        return useZero ? 0 : NaN
    }
}
/** ________________________________________________ */
const toBool = (data) => data === 1
const boolTo = (data) => data === true ? 1 : 0
/** ________________________________________________ */
/**
 * @param {string} scoreboardName 
 * @returns {null}
 */
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return

    const objective = world.scoreboard.addObjective(scoreboardName, scoreboardName)
    objective.getParticipants().forEach(p => objective.removeParticipant(p))

    const fakr = [
        ['tag⌁build', 2],
        ['breaktext⌁§c[!] ห้ามทุบบล็อก!§r', 2],
        ['placetext⌁§c[!] ห้ามวางบล็อก!§r', 2],
        ['parbreak', 1],
        ['parplace', 1],
        ['popbreak', 1],
        ['popplace', 1]
    ]

    fakr.forEach(([name, score]) => objective.setScore(name, score))
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
    const [tag, breaktext, placetext, parbreak, parplace, popbreak, popplace] = get()
    if (pl.hasTag(tag || "build")) return
    data.cancel = true

    if (breaktext.trim() !== '') pl.sendMessage(breaktext || `§c[!] Hey Don't Break this block!`)
    system.run(() => {
        if (popbreak) pl.runCommand(`playsound random.pop @a[r=5]`)
        if (parbreak) {
            pl.spawnParticle('minecraft:villager_angry', { x: data.block.x + .5, y: data.block.y + 1.5, z: data.block.z + .5 })
            pl.spawnParticle('minecraft:egg_destroy_emitter', { x: data.block.x + .5, y: data.block.y + 1, z: data.block.z + .5 })
        }
    })
})
/** ________________________________________________ */
world.beforeEvents.playerPlaceBlock.subscribe(data => {
    const pl = data.player
    const [tag, breaktext, placetext, parbreak, parplace, popbreak, popplace] = get()
    if (pl.hasTag(tag || "build")) return
    data.cancel = true

    if (placetext.trim() !== "") pl.sendMessage(placetext || `§c[!] Hey Don't Place that block!`)
    system.run(() => {
        if (popplace) pl.runCommand(`playsound random.pop @a[r=5]`)
        if (parplace) {
            pl.spawnParticle('minecraft:villager_angry', { x: data.block.x + .5, y: data.block.y + 1.5, z: data.block.z + .5 })
            pl.spawnParticle('minecraft:egg_destroy_emitter', { x: data.block.x + .5, y: data.block.y + 1, z: data.block.z + .5 })
        }
    })
})
/** ________________________________________________ */
world.beforeEvents.itemUse.subscribe(({ source, itemStack }) =>
    itemStack.typeId === "minecraft:apple" &&
    source.hasTag("Admin") &&
    system.run(() => {
        const form = new ModalFormData()
        const [tag, breaktext, placetext, parbreak, parplace, popbreak, popplace] = get()

        form.title(`§9Unbreak§r Settings`)
        form.textField(`§fแท็กสำหรับ §eคนสร้าง:\n§f(ค่าเริ่มต้น: §7build§f)`, `เขียนแท็กที่นี่~`, { defaultValue: tag })
        form.textField(`§fข้อความเตือน [§cตอน ทุบบล็อก§f]\n§fการเว้นว่างจะทำให้ไม่แสดงข้อความ`, `เขียนข้อความ ๆ`, { defaultValue: breaktext })
        form.textField(`§fข้อความเตือน [§aตอน วางบล็อก§f]\n§fการเว้นว่างจะทำให้ไม่แสดงข้อความ`, `เขียนข้อความ ๆ`, { defaultValue: placetext })

        form.toggle(`§fพาร์ทิเคิล [§cตอน ทุบบล็อก§f]`, { defaultValue: parbreak })
        form.toggle(`§fพาร์ทิเคิล [§aตอน วางบล็อก§f]`, { defaultValue: parplace })

        form.toggle(`§fเสียง §ePOP§f [§cตอน ทุบบล็อก§f]`, { defaultValue: popbreak })
        form.toggle(`§fเสียง §ePOP§f [§aตอน วางบล็อก§f]`, { defaultValue: popplace })
        form.show(source).then((res) => {
            if (res.canceled) return
            const resu = res.formValues
            const unbreak_ = world.scoreboard.getObjective('unbreak')
            unbreak_.getParticipants().forEach(e => unbreak_.removeParticipant(e))

            unbreak_.setScore(`tag⌁${resu[0]}`, 2)
            unbreak_.setScore(`breaktext⌁${resu[1]}`, 2)
            unbreak_.setScore(`placetext⌁${resu[2]}`, 2)
            unbreak_.setScore("parbreak", boolTo(resu[3]))
            unbreak_.setScore("parplace", boolTo(resu[4]))
            unbreak_.setScore("popbreak", boolTo(resu[5]))
            unbreak_.setScore("popplace", boolTo(resu[6]))

            source.playSound('random.orb')
            source.sendMessage(`§l§aบันทึก§r§fข้อมูลแล้ว~`)
        })
    })
)
/** ________________________________________________ */
/**
 * @returns {Array}
 */
function get() {
    let tag, breaktext, placetext, parbreak, parplace, popbreak, popplace
    try {
        let setting = getFakePlayer('unbreak')
        tag = setting.find(str => str.startsWith('tag⌁'))?.split("⌁")[1] || "build"
        breaktext = setting.find(str => str.startsWith('breaktext⌁'))?.split("⌁")[1]
        placetext = setting.find(str => str.startsWith('placetext⌁'))?.split("⌁")[1]

        parbreak = toBool(getScore("unbreak", "parbreak", true))
        parplace = toBool(getScore("unbreak", "parplace", true))
        popbreak = toBool(getScore("unbreak", "popbreak", false))
        popplace = toBool(getScore("unbreak", "popplace", false))
        if (breaktext.trim() === "") breaktext = ""
        if (placetext.trim() === "") placetext = ""
    } catch (UwU) { }

    return [tag, breaktext || "§c[!] ห้ามทุบบล็อก!§r", placetext || "§c[!] ห้ามวางบล็อก!§r", parbreak, parplace, popbreak, popplace]
}
/** ________________________________________________ */