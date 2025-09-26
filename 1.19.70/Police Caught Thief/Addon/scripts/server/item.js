import { ScoreboardIdentityType, world } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
const World = world
try { world.getDimension("overworld").runCommandAsync(`scoreboard objectives add bosettings dummy`) } catch (e) { }
/** ------------------------------------------- */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.fakePlayer)
        .map(data => data.displayName)
}
/** ------------------------------------------- */
function getScore(objective, target, useZero = true) {
    try {
        const obj = World.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
        }
        return obj.getScore(target.scoreboard)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** ------------------------------------------- */
world.events.beforeItemUse.subscribe(data => {
    const pl = data.source
    const item = data.item

    if (item.typeId === "minecraft:compass") {
        if (pl.hasTag('Admin')) selectionui(pl)
    }
})
/** ------------------------------------------- */
function selectionui(pl) {
    const form = new ActionFormData()
    form.title(`§8Selection Menu`)
    form.body(`§fSelction to edit a §bOfficer §for §cBandit§f or §eServer\n\n§7@aitji </>§r`)
    form.button(`§8Officer\n§7Click Here`)
    form.button(`§8Bandit\n§7Click Here`)
    form.button(`§8Server\n§7Click Here`)
    form.button(`§4Reset\n§7Click Here`)
    form.show(pl).then(res => {
        if (res.selection === 0) officer(pl)
        if (res.selection === 1) bandit(pl)
        if (res.selection === 2) servers(pl)
        if (res.selection === 3) {
            const form = new ActionFormData()
            form.title(`§r§fAre you sure??`)
            form.body(`§fAre you really sure to §cReset???§r`)
            form.button(`§cYes`)
            form.button(`§cNo`)
            form.show(pl).then(res => {
                if (res.selection === 0) {
                    let officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj
                    officertag = `officertag:officer`
                    officeritem = `officeritem:stick`

                    bandittag = `bandittag:bandit`
                    bandititem = `bandititem:tripwire_hook`
                    banditmoney = `banditmoney:true`
                    banditpermoney = `banditpermoney:5`

                    servertp = `servertp:0 -60 7`
                    servermoneyobj = `servermoneyobj:money`

                    pl.runCommandAsync(`scoreboard players reset * bosettings`)
                    const all = [officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj]
                    for (let i = 0; i < all.length; i++) pl.runCommandAsync(`scoreboard players set "${all[i]}" bosettings ${i + 1}`)
                    pl.sendMessage(`§r§8§l|§r§f All Data has been §cRemoved`)
                }
            })
        }
    })
}
/** ------------------------------------------- */
function officer(pl) {
    let officertag, officeritem
    try {
        let setting = getFakePlayer('bosettings')
        officertag = setting.filter(str => str.startsWith('officertag:')).join('').split(":")[1]
        officeritem = setting.filter(str => str.startsWith('officeritem:')).join('').split(":")[1]
    } catch (e) { }
    if (officertag === "" || officertag === undefined) officertag = `officer`
    if (officeritem === "" || officeritem === undefined) officeritem = `stick`
    const form = new ModalFormData()
    form.title(`§8Officer Settings`)
    form.textField(`§fofficer Tag:`, (officertag ?? `officertag:officer`), (officertag ?? `officertag:officer`))
    form.textField(`§fofficer Item:`, (officeritem ?? `officeritem:stick`), (officeritem ?? `officeritem:stick`))
    form.show(pl).then(res => {
        if (res.canceled) return
        let officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj
        try {
            let setting = getFakePlayer('bosettings')
            officertag = setting.filter(str => str.startsWith('officertag')).join('')
            officeritem = setting.filter(str => str.startsWith('officeritem:')).join('')

            bandittag = setting.filter(str => str.startsWith('bandittag:')).join('')
            bandititem = setting.filter(str => str.startsWith('bandititem:')).join('')
            banditmoney = setting.filter(str => str.startsWith('banditmoney:')).join('')
            banditpermoney = setting.filter(str => str.startsWith('banditpermoney:')).join('')

            servertp = setting.filter(str => str.startsWith('servertp:')).join('')
            servermoneyobj = setting.filter(str => str.startsWith('servermoneyobj:')).join('')
        } catch (e) { }
        if (officertag === "" || officertag === undefined) officertag = `officertag:officer`
        if (officeritem === "" || officeritem === undefined) officeritem = `officeritem:stick`

        if (bandittag === "" || bandittag === undefined) bandittag = `bandittag:bandit`
        if (bandititem === "" || bandititem === undefined) bandititem = `bandititem:tripwire_hook`
        if (banditmoney === "" || banditmoney === undefined) banditmoney = `banditmoney:true`
        if (banditpermoney === "" || banditpermoney === undefined) banditpermoney = `banditpermoney:5`

        if (servertp === "" || servertp === undefined) servertp = `servertp:0 -60 7`
        if (servermoneyobj === "" || servermoneyobj === undefined) servermoneyobj = `servermoneyobj:money`

        pl.runCommandAsync(`scoreboard players reset * bosettings`)
        const all = [officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj]
        for (let i = 0; i < all.length; i++) {
            var on = false
            if (all[i] === officertag) {
                pl.runCommandAsync(`scoreboard players set "officertag:${res.formValues[0]}" bosettings ${i + 1}`)
                on = true
            }
            if (all[i] === officeritem) {
                pl.runCommandAsync(`scoreboard players set "officeritem:${res.formValues[1]}" bosettings ${i + 1}`)
                on = true
            }

            if (on === false) pl.runCommandAsync(`scoreboard players set "${all[i]}" bosettings ${i + 1}`)
        }

        pl.sendMessage(`§r§l§8| §r§fSettings is now §asaved§r`)
    })
}
/** ------------------------------------------- */
function bandit(pl) {
    let bandittag, bandititem, banditmoney, banditpermoney
    try {
        let setting = getFakePlayer('bosettings')
        bandittag = setting.filter(str => str.startsWith('bandittag:')).join('').split(":")[1]
        bandititem = setting.filter(str => str.startsWith('bandititem:')).join('').split(":")[1]
        banditmoney = setting.filter(str => str.startsWith('banditmoney:')).join('').split(":")[1]
        banditpermoney = setting.filter(str => str.startsWith('banditpermoney:')).join('').split(":")[1]
    } catch (e) { }
    if (bandittag === "" || bandittag === undefined) bandittag = `bandit`
    if (bandititem === "" || bandititem === undefined) bandititem = `tripwire_hook`
    if (banditmoney === "" || banditmoney === undefined) banditmoney = `true`
    if (banditpermoney === "" || banditpermoney === undefined) banditpermoney = `5`
    if (banditmoney === `true`) {
        banditmoney = true
    } else {
        banditmoney = false
    }

    const form = new ModalFormData()
    form.title(`§8Bandit Settings`)
    form.textField(`§fBandit Tag:`, (bandittag ?? `bandit`), (bandittag ?? `bandit`))
    form.textField(`§fBandit Item:`, (bandititem ?? `tripwire_hook`), (bandititem ?? `tripwire_hook`))
    form.toggle(`§fBandit can Steal Money?`, (banditmoney ?? true))
    form.textField(`§fBandit Get .(?). Money every 1sec`, (banditpermoney ?? `5`), (banditpermoney ?? `5`))
    form.show(pl).then(res => {
        if (res.canceled) return
        let officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj
        try {
            let setting = getFakePlayer('bosettings')
            officertag = setting.filter(str => str.startsWith('officertag')).join('')
            officeritem = setting.filter(str => str.startsWith('officeritem:')).join('')

            bandittag = setting.filter(str => str.startsWith('bandittag:')).join('')
            bandititem = setting.filter(str => str.startsWith('bandititem:')).join('')
            banditmoney = setting.filter(str => str.startsWith('banditmoney:')).join('')
            banditpermoney = setting.filter(str => str.startsWith('banditpermoney:')).join('')

            servertp = setting.filter(str => str.startsWith('servertp:')).join('')
            servermoneyobj = setting.filter(str => str.startsWith('servermoneyobj:')).join('')
        } catch (e) { }
        if (officertag === "" || officertag === undefined) officertag = `officertag:officer`
        if (officeritem === "" || officeritem === undefined) officeritem = `officeritem:stick`

        if (bandittag === "" || bandittag === undefined) bandittag = `bandittag:bandit`
        if (bandititem === "" || bandititem === undefined) bandititem = `bandititem:stick`
        if (banditmoney === "" || banditmoney === undefined) banditmoney = `banditmoney:true`
        if (banditpermoney === "" || banditpermoney === undefined) banditpermoney = `banditpermoney:5`

        if (servertp === "" || servertp === undefined) servertp = `servertp:0 -60 7`
        if (servermoneyobj === "" || servermoneyobj === undefined) servermoneyobj = `servermoneyobj:money`

        pl.runCommandAsync(`scoreboard players reset * bosettings`)
        const all = [officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj]
        for (let i = 0; i < all.length; i++) {
            var on = false
            if (all[i] === bandittag) {
                pl.runCommandAsync(`scoreboard players set "bandittag:${res.formValues[0]}" bosettings ${i + 1}`)
                on = true
            }
            if (all[i] === bandititem) {
                pl.runCommandAsync(`scoreboard players set "bandititem:${res.formValues[1]}" bosettings ${i + 1}`)
                on = true
            }
            if (all[i] === banditmoney) {
                pl.runCommandAsync(`scoreboard players set "banditmoney:${res.formValues[2]}" bosettings ${i + 1}`)
                on = true
            }
            if (all[i] === banditpermoney) {
                pl.runCommandAsync(`scoreboard players set "banditpermoney:${res.formValues[3]}" bosettings ${i + 1}`)
                on = true
            }

            if (on === false) pl.runCommandAsync(`scoreboard players set "${all[i]}" bosettings ${i + 1}`)
        }

        pl.sendMessage(`§r§l§8| §r§fSettings is now §asaved§r`)
    })
}
/** ------------------------------------------- */
function servers(pl) {
    let servertp, servermoneyobj
    try {
        let setting = getFakePlayer('bosettings')
        servertp = setting.filter(str => str.startsWith('servertp:')).join('').split(":")[1]
        servermoneyobj = setting.filter(str => str.startsWith('servermoneyobj:')).join('').split(":")[1]
    } catch (e) { }
    if (servertp === "" || servertp === undefined) servertp = `0 -60 7`
    if (servermoneyobj === "" || servermoneyobj === undefined) servermoneyobj = `money`

    const form = new ModalFormData()
    form.title(`§8Server Settings`)
    form.textField(`§fJail (xyz)?`, (servertp ?? `0 -60 7`), (servertp ?? `0 -60 7`))
    form.textField(`§fMoney obj:`, (servermoneyobj ?? `money`), (servermoneyobj ?? `money`))
    form.show(pl).then(res => {
        if (res.canceled) return
        let officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj
        try {
            let setting = getFakePlayer('bosettings')
            officertag = setting.filter(str => str.startsWith('officertag')).join('')
            officeritem = setting.filter(str => str.startsWith('officeritem:')).join('')

            bandittag = setting.filter(str => str.startsWith('bandittag:')).join('')
            bandititem = setting.filter(str => str.startsWith('bandititem:')).join('')
            banditmoney = setting.filter(str => str.startsWith('banditmoney:')).join('')
            banditpermoney = setting.filter(str => str.startsWith('banditpermoney:')).join('')

            servertp = setting.filter(str => str.startsWith('servertp:')).join('')
            servermoneyobj = setting.filter(str => str.startsWith('servermoneyobj:')).join('')
        } catch (e) { }
        if (officertag === "" || officertag === undefined) officertag = `officertag:officer`
        if (officeritem === "" || officeritem === undefined) officeritem = `officeritem:stick`

        if (bandittag === "" || bandittag === undefined) bandittag = `bandittag:bandit`
        if (bandititem === "" || bandititem === undefined) bandititem = `bandititem:stick`
        if (banditmoney === "" || banditmoney === undefined) banditmoney = `banditmoney:true`
        if (banditpermoney === "" || banditpermoney === undefined) banditpermoney = `banditpermoney:5`

        if (servertp === "" || servertp === undefined) servertp = `servertp:0 -60 7`
        if (servermoneyobj === "" || servermoneyobj === undefined) servermoneyobj = `servermoneyobj:money`

        pl.runCommandAsync(`scoreboard players reset * bosettings`)
        const all = [officertag, officeritem, bandittag, bandititem, banditmoney, banditpermoney, servertp, servermoneyobj]
        for (let i = 0; i < all.length; i++) {
            var on = false
            if (all[i] === servertp) {
                pl.runCommandAsync(`scoreboard players set "servertp:${res.formValues[0]}" bosettings ${i + 1}`)
                on = true
            }
            if (all[i] === servermoneyobj) {
                pl.runCommandAsync(`scoreboard players set "servermoneyobj:${res.formValues[1]}" bosettings ${i + 1}`)
                on = true
            }

            if (on === false) pl.runCommandAsync(`scoreboard players set "${all[i]}" bosettings ${i + 1}`)
        }

        pl.sendMessage(`§r§l§8| §r§fSettings is now §asaved§r`)
    })
}
/** ------------------------------------------- */
/**
 * @author aitji
 * @description This Script was created by aitji
 * @copyright 2023-2024 aitji
 * @youtube https://www.youtube.com/channel/UCphyxbOnunOu0FcNLYPPXJw?sub_confirmation=1/
 */
/** ------------------------------------------- */