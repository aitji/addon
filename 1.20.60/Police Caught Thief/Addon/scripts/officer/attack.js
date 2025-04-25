import { ItemStack, world } from "@minecraft/server";
/** ------------------------------------------- */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** ------------------------------------------- */
world.afterEvents.entityHitEntity.subscribe(data => {
    try {
        const pl = data.entity
        const entity = data.hitEntity
        /** [ Get ] */
        let bandittag, bandititem, banditmoney, banditpermoney, officertag, officeritem, servertp, servermoneyobj
        try {
            let setting = getFakePlayer('bosettings')
            bandittag = setting.filter(str => str.startsWith('bandittag:')).join('').split(":")[1]
            bandititem = setting.filter(str => str.startsWith('bandititem:')).join('').split(":")[1]
            banditmoney = setting.filter(str => str.startsWith('banditmoney:')).join('').split(":")[1]
            banditpermoney = setting.filter(str => str.startsWith('banditpermoney:')).join('').split(":")[1]
            officertag = setting.filter(str => str.startsWith('officertag:')).join('').split(":")[1]
            officeritem = setting.filter(str => str.startsWith('officeritem:')).join('').split(":")[1]
            servertp = setting.filter(str => str.startsWith('servertp:')).join('').split(":")[1]
            servermoneyobj = setting.filter(str => str.startsWith('servermoneyobj:')).join('').split(":")[1]
        } catch (e) { }
        if (bandittag === "" || bandittag === undefined) bandittag = `bandit`
        if (bandititem === "" || bandititem === undefined) bandititem = `tripwire_hook`
        if (banditmoney === "" || banditmoney === undefined) banditmoney = `true`
        if (banditpermoney === "" || banditpermoney === undefined) banditpermoney = `5`
        if (officertag === "" || officertag === undefined) officertag = `officer`
        if (officeritem === "" || officeritem === undefined) officeritem = `stick`
        if (servertp === "" || servertp === undefined) servertp = `0 -60 7`
        if (servermoneyobj === "" || servermoneyobj === undefined) servermoneyobj = `money`
        if (banditmoney === `true`) {
            banditmoney = true
        } else {
            banditmoney = false
        }
        if (!entity.hasTag(bandittag)) return
        const inv = (pl.getComponent('inventory')).container
        const item = inv.getItem(pl.selectedSlot)
        if (pl.hasTag(officertag) && item.typeId === `minecraft:${officeritem}`) {
            pl.sendMessage(`§r§l§8| §r§fYou catch a §7${entity.name ?? entity.typeId} §r§fand send to the jail!`)
            entity.runCommandAsync(`tp @s ${servertp}`)
        }
    } catch (e) {

    }
})

/** ------------------------------------------- */
/**
 * @author aitji
 * @description This Script was created by aitji
 * @copyright 2023-2024 aitji
 * @youtube https://www.youtube.com/@aitji./
 */
/** ------------------------------------------- */