import { system, world } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"
/** --------------[ UwU - aitji ]-------------- */
try {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add time dummy`)
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add timesettings dummy`)
} catch (Subscribe_aitji) {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add timesettings dummy`)
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add time dummy`)
}
/** --------------[ UwU - aitji ]-------------- */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target === 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) || (useZero ? 0 : NaN)
        }
        return obj.getScore(target.scoreboardIdentity) || (useZero ? 0 : NaN)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** --------------[ UwU - aitji ]-------------- */
function set(name, value) {
    world.getDimension('overworld').runCommandAsync(`scoreboard players set "${name}" time ${value}`)
}
/** --------------[ UwU - aitji ]-------------- */
system.runInterval(() => {
    let GMT = 7
    try { GMT = getScore('timesettings', 'gmt', true) }
    catch (error) { console.error("Error fetching GMT:", error) }

    const date = new Date()
    date.setHours(date.getHours() + GMT)
    set('sec', date.getSeconds())
    set('min', date.getMinutes())
    set('hour', date.getHours())
    set('day', date.getDate())
    set('month', date.getMonth())
    set('year', date.getFullYear() + (GMT === 0 ? 543 : 0))
}, 20);
/** --------------[ UwU - aitji ]-------------- */
world.beforeEvents.itemUse.subscribe(data => {
    const { source: pl, itemStack: item } = data
    if (item.typeId === "minecraft:clock" && pl.hasTag("Admin")) timeSetting(pl)
})
/** --------------[ UwU - aitji ]-------------- */
function timeSetting(player) {
    system.run(() => {
        const form = new ModalFormData()
        const YearArray = ["§l§8พุทธราช [พ.ศ.]§r", "§l§8คริสต์ศักราช [ค.ศ.]§r"]

        form.title(`§l§8Real Time Settings§r`);
        form.dropdown(`\n§r§f§lไง §e@"${player.name}"§f\nกรุณาเลือกว่าตั้งการใช้ปี §bพ.ศ.§f หรือ §bค.ส.§r`, YearArray)
        form.textField(`§r§l§fGMT เท่าไรดีหรอ? (ไทย: 7)§r`, `§r`, "7")

        form.show(player).then(res => {
            if (!res.canceled) {
                const yearSetting = res.formValues[0] === 0 ? 1 : 0
                const gmtSetting = parseInt(res.formValues[1] || 7)

                player.runCommandAsync(`scoreboard players set year timesettings ${yearSetting}`)
                player.runCommandAsync(`scoreboard players set gmt timesettings ${gmtSetting}`)

                const yearMessage = yearSetting === 1 ? "พุทธราช [พ.ศ.]" : "คริสต์ศักราช [ค.ศ.]"
                player.sendMessage(`§8§l| §r§l§fYear Toggle has set to: §7§l${yearMessage}`)
                player.sendMessage(`§8§l| §r§l§ฟ§fGMT has set to: §7${gmtSetting}`)
            }
        })
    })
}
/** --------------[ UwU - aitji ]-------------- */
