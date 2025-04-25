import { system, world } from "@minecraft/server";
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
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
        }
        return obj.getScore(target.scoreboardIdentity)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** --------------[ UwU - aitji ]-------------- */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack

    if (item.typeId === "minecraft:clock" && pl.hasTag("Admin")) {
        timeSetting(pl)
    }
})
/** --------------[ UwU - aitji ]-------------- */
system.runInterval(aitji => {
    let years
    let gmts = 7
    try {
        years = getScore('timesettings', 'year', true)
        gmts = getScore('timesettings', 'gmt', true)
    } catch (Like_aitji_VideoNow) { }
    let addyear
    if (years === 0) addyear = 0; else addyear = 543;

    const format = (date) => date.toString()
    let date = new Date();
    let h = date.getHours() + (gmts ?? 7)
    let hour = format(h >= 24 ? h - 24 : h)
    let min = format(date.getMinutes())
    let sec = format(date.getSeconds())
    let day = format(date.getDate())
    let month = format(date.getMonth())
    let year = format(date.getFullYear() + (addyear ?? 0))

    world.getDimension('overworld').runCommandAsync(`scoreboard players set sec time ${sec}`)
    world.getDimension('overworld').runCommandAsync(`scoreboard players set min time ${min}`)
    world.getDimension('overworld').runCommandAsync(`scoreboard players set hour time ${hour}`)
    world.getDimension('overworld').runCommandAsync(`scoreboard players set day time ${day}`)
    world.getDimension('overworld').runCommandAsync(`scoreboard players set month time ${month}`)
    world.getDimension('overworld').runCommandAsync(`scoreboard players set year time ${year}`)
})
/** --------------[ UwU - aitji ]-------------- */
function timeSetting(pl) {
    system.run(() => {
        let years
        let gmts = ""
        try {
            years = getScore('timesettings', 'year', true)
            gmts = getScore('timesettings', 'gmt', true)
        } catch (Like_aitji_VideoNow) { }
        if (gmts === 0) {
            gmts = ""
        }
        const form = new ModalFormData()
        const yeararray = [
            "§l§8พุทธราช [พ.ศ.]§r",
            "§l§8คริสต์ศักราช [ค.ศ.]§r",
        ]
        form.title(`§l§8Real Time Settings§r`)
        form.dropdown(`\n§r§f§lไง §e@"${pl.name}"§f\nกรุณาเลือกว่าตั้งการใช้ปี §bพ.ศ.§f หรือ §bค.ส.§r`, yeararray, years)
        form.textField(`§r§l§fGMT เท่าไรดีหรอ? (ไทย: 7)§r`, `§r`, gmts.toString())
        form.show(pl).then(res => {
            if (!res.canceled) {
                if (res.formValues[0] === 0) {
                    pl.runCommandAsync(`scoreboard players set year timesettings 1`)
                    pl.sendMessage(`§8§l| §r§l§fYear Toggle has set to: §7§lพุทธราช [พ.ศ.]`)
                } else {
                    pl.runCommandAsync(`scoreboard players set year timesettings 0`)
                    pl.sendMessage(`§8§l| §r§l§fYear Toggle has set to: §7§lคริสต์ศักราช [ค.ศ.]`)
                }

                pl.runCommandAsync(`scoreboard players set gmt timesettings ${res.formValues[1] ?? 7}`)

                pl.sendMessage(`§8§l| §r§l§ฟ§fGMT has set to: §7${res.formValues[1]}`)
            }
        })
    })
}
/** --------------[ UwU - aitji ]-------------- */