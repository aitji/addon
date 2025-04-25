import { ItemStack, world, system } from "@minecraft/server";
/** ------------------------------------------- */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
        }
        return obj.getScore(target.scoreboard)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** ------------------------------------------- */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** ------------------------------------------- */
system.runInterval(() => {
    try {
        let bandittag, bandititem, banditmoney, banditpermoney, officertag, servermoneyobj
        try {
            let setting = getFakePlayer('bosettings')
            bandittag = setting.filter(str => str.startsWith('bandittag:')).join('').split(":")[1]
            bandititem = setting.filter(str => str.startsWith('bandititem:')).join('').split(":")[1]
            banditmoney = setting.filter(str => str.startsWith('banditmoney:')).join('').split(":")[1]
            banditpermoney = setting.filter(str => str.startsWith('banditpermoney:')).join('').split(":")[1]
            officertag = setting.filter(str => str.startsWith('officertag:')).join('').split(":")[1]
            servermoneyobj = setting.filter(str => str.startsWith('servermoneyobj:')).join('').split(":")[1]
        } catch (e) { }
        if (bandittag === "" || bandittag === undefined) bandittag = `bandit`
        if (bandititem === "" || bandititem === undefined) bandititem = `tripwire_hook`
        if (banditmoney === "" || banditmoney === undefined) banditmoney = `true`
        if (banditpermoney === "" || banditpermoney === undefined) banditpermoney = `5`
        if (officertag === "" || officertag === undefined) officertag = `officer`
        if (servermoneyobj === "" || servermoneyobj === undefined) servermoneyobj = `money`
        if (banditmoney === `true`) {
            banditmoney = true
        } else {
            banditmoney = false
        }
        world.getAllPlayers().map(pl => {
            if (pl.hasTag(bandittag)) {
                const inv = (pl.getComponent('inventory')).container
                const item = inv.getItem(pl.selectedSlot)
                if (item.typeId === `minecraft:${bandititem}`) {
                    pl.getEntitiesFromViewDirection().map(plr => {
                        if (plr.hasTag(officertag) && plr.hasTag(bandittag)) return
                        plr.runCommandAsync('tag @s add gotst')
                        pl.runCommandAsync(`testfor @e[r=2.5,tag="gotst"]`).then(e => {
                            const money = getScore(servermoneyobj, plr, true)
                            if (money > banditpermoney) {
                                pl.sendMessage(`§r§l§8| §r§fYou stealing §a${banditpermoney} Money §ffrom §c${plr.name ?? plr.typeId}`)
                                try { plr.sendMessage(`§r§l§8| §r§cYou got stealing §4${banditpermoney} Money §cfrom §4${pl.name ?? pl.typeId}`) } catch (e) { }
                                plr.runCommandAsync(`scoreboard players remove @s "${servermoneyobj}" ${banditpermoney}`)
                                pl.runCommandAsync(`scoreboard players add @s "${servermoneyobj}" ${banditpermoney}`)
                            }
                        })
                        plr.runCommandAsync('tag @s remove gotst')
                    })
                }
            }
        })
    } catch (e) {

    }
}, 20)
/** ------------------------------------------- */
/**
 * @author aitji.
 * @description This Script was created by aitji.
 * @copyright 2023-2024 aitji.
 * @youtube https://www.youtube.com/@aitji../
 */
/** ------------------------------------------- */