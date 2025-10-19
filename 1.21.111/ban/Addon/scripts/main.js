import { ScoreboardIdentityType, system, world, } from "@minecraft/server"
import { ModalFormData, ActionFormData, FormCancelationReason, ModalFormResponse, ActionFormResponse, } from "@minecraft/server-ui"
import "./lib"

world.afterEvents.chatSend.subscribe((data) => {
    const { sender, message } = data
    if (sender.hasTag("Admin")) {
        system.run(() => {
            const command = message.toLowerCase()
            let ban = getFakePlayer("banlist")
            if (command.startsWith(`!`)) {
                if (
                    command === `!ui` ||
                    command === `!help` ||
                    command === `!?` ||
                    command === `!gui` ||
                    command === `!menu`
                ) {
                    sender.sendMessage(`§7ปิดหน้าต่างแชทเพื่อเปิดเมนู`)
                    admin_ui(sender)
                }

                if (command.startsWith("!ban ")) {
                    let ta = command.split("!ban ")[1].toLocaleLowerCase()
                    let ban_find = ban.find((key) => key.split("|")[1].toLowerCase().trim() === ta.trim())
                    if (ban_find) {
                        sender.sendMessage(`§r§7${ta} ถูกแบนไปแล้ว\nแบนโดย: ${ban_find.split("|")[3]}\nด้วยเหตุผล: ${ban_find.split("|")[2]}\nเวลา: ${linux_to_time(ban_find.split("|")[4])}`)
                        return
                    }
                    sender.runCommand(`scoreboard players set "ban|${ta.toLowerCase()}|${`ไม่ได้ระบุเหตุผล`}|${sender.name}|${linux_time()}" banlist 0`)
                    let plr = world.getAllPlayers().find(key => key.name.toLowerCase().trim() === ta.trim().toLowerCase())
                    request_ban(plr)
                    sender.sendMessage(`§fแบนผู้เล่น ${ta} แล้ว`)
                }
                if (command.startsWith("!unban ")) {
                    let ta = command.split("!unban ")[1].toLocaleLowerCase()
                    let ban_find = ban.find((key) => key.split("|")[1].toLowerCase().trim() === ta.trim())
                    if (!ban_find) {
                        sender.sendMessage(`§r§7${ta} ไม่ได้ถูกแบน ลองใช้คำสั่ง !list เพื่อดูคนที่ถูกแบน หรือปลดแบนผ่านเมนูโดย !ui`)
                        return
                    }
                    sender.runCommand(`scoreboard players reset "${ban_find}" banlist`)
                    sender.sendMessage(`§aปลดแบนผู้เล่น ${ta} แล้ว`)
                }
                if (
                    command === `!list` ||
                    command === `!view` ||
                    command === `!see`
                ) {
                    sender.sendMessage(`รายชื่อผู้ที่ถูกแบนทั้งหมด\n§o* ดูข้อมูลเพิ่มเติมโดย !ui\n\n§r${(ban.map((b, i) => `§7${i + 1}. §f${b.split("|")[1]} §7${b.split("|")[2]}`)).join("\n")}`)
                }
            }
        })
    }
})

function admin_ui(pl) {
    let form = new ActionFormData()
    form.title(`§l@aitji.'s Ban System`)
    form.body(`§r  §rต้องการความช่วยเหลือหรือไม่?\nงั้นมาดูสิว่าคุณต้องการอะไร`)
    form.button(`§lช่วยเหลือด้านคำสั่ง\n§r§0กดเพื่อดูรายละเอียด`)
    form.button(`§lรายชื่อผู้โดนแบน\n§r§0กดเพื่อดูรายชื่อ`)
    form.button(`§lแบนผู้เล่น\n§r§0กดเพื่อแบนผู้เล่นผ่านเมนู`)
    form.button(`§lปลดแบนผู้เล่น\n§r§0กดเพื่อปลดแบนผู้เล่นผ่านเมนู`)

    forceShow(pl, form).then((res) => {
        if (res instanceof ActionFormResponse) {
            switch (res.selection) {
                case 0:
                    let cmd_form = new ActionFormData()
                    cmd_form.title(`§l@aitji.'s Command`)
                    cmd_form.body(`§r  §rนี่คือคำสั่งลัดต่าง ๆ สำหรับแอดออน §lแบน/ปลดแบน§r อักษรขึ้นต้นของแอดออนคือ §l!§r\n\n\n§e!§r[ui/gui/menu/help/?]\n §7เพื่อทำการเปิดหน้าต่างช่วยเหลือต่าง ๆ§r\n\n§e!§rban <ชื่อผู้เล่น>\n §7แบนผู้เล่นที่มีชื่อดังกล่าว§r\n\n§e!§runban§r <ชื่อผู้เล่น>\n §7ปลดแบนผู้เล่นที่มีชื่อดังกล่าว§r\n\n§e!§r[list/view/see]\n §7ดูรายชื่อผู้ที่โดนแบนทั้งหมดในเซิร์ฟเวอร์`)
                    cmd_form.button(`§lย้อนกลับ\n§r§0ย้อนกลับไปหน้าหลัก`)
                    cmd_form.show(pl).then((res) => {
                        if (res instanceof ActionFormResponse && res.selection === 0) {
                            return admin_ui(pl)
                        }
                    })
                    break
                case 1:
                    let list_form = new ActionFormData()
                    list_form.title(`§l@aitji.'s List`)
                    let ban = getBan() || []
                    let des = []
                    ban.forEach((key, i) => {
                        des.push(`§7${i + 1}/${ban.length}.§f ${key.split("|")[1]}\n§r§7 | Reason: §r${key.split("|")[2]}\n§r§7 | By: §r${key.split("|")[3]} \n§r§7 | Date: §r${linux_to_time(key.split("|")[4])}`)
                    })
                    list_form.body(`§r  §rนี่คือรายชื่อผู้ที่โดนแบนทั้งหมดในเซิร์ฟเวอร์\nโดยมีผู้ที่ถูกแบนทั้งหมด: ${ban.length}\n\n${des.join("\n\n")}`)
                    list_form.button(`§lย้อนกลับ\n§r§0ย้อนกลับไปหน้าหลัก`)
                    list_form.show(pl).then((res) => {
                        if (res instanceof ActionFormResponse && res.selection === 0) {
                            return admin_ui(pl)
                        }
                    })
                    break
                case 2:
                    let modalForm = new ModalFormData()
                    const allPl = world.getAllPlayers()
                    let display = [`เพิ่มผู้เล่นอื่น ๆ`]
                    allPl.map((key, i) => {
                        if (key.name === pl.name) display.push(`${key.name} §9(ตัวคุณเอง)§r`)
                        else if (key.hasTag("Admin")) display.push(`${key.name} §c(แอดมิน)§r`)
                        else display.push(`${key.name}`)
                    })
                    modalForm.title(`§l@aitji.'s Ban(Online)`)
                    modalForm.dr(`กรุณาเลือกผู้เล่นที่ต้องการแบน`, display)
                    modalForm.textField(`เหตุผล`, `(ไม่จำเป็นต้องระบุ)`)
                    forceShow(pl, modalForm).then((res1) => {
                        if (res1.formValues[0] !== 0) {
                            const ban = getBan()
                            const sel = allPl[res1.formValues[0] - 1]
                            if (sel) {
                                const name = sel.name || ""
                                const ban_find = ban.find((key) => key.split("|")[1].toLowerCase() === name.toLowerCase())
                                if (ban_find) {
                                    pl.sendMessage(
                                        `§r§7${name} ถูกแบนไปแล้ว\nแบนโดย: ${ban_find.split("|")[3]}\nด้วยเหตุผล: ${ban_find.split("|")[2]}\nเวลา: ${linux_to_time(
                                            ban_find.split("|")[4]
                                        )}`
                                    )
                                } else {
                                    pl.runCommand(`scoreboard players set "ban|${name.toLowerCase()}|${res1.formValues[1] || `ไม่ได้ระบุเหตุผล`}|${pl.name}|${linux_time()}" banlist 0`)
                                    pl.sendMessage(`§r§fได้ทำการแบนผู้เล่น §o${name}§r§f เรียบร้อยแล้ว`)
                                    try {
                                        let fp = world.getAllPlayers().find(na => na.name.toLowerCase().trim() === name.toLowerCase().trim())
                                        request_ban(fp)
                                        pl.sendMessage(`§7${name} ถูกเพิ่มไปยังระบบแล้ว`)
                                    } catch (e) {
                                        pl.sendMessage(`§4ระบบไม่สามารถแบนผู้เล่นดังกล่าวได้เนื่องจาก \n§c${e}`)
                                    }
                                }
                            } else {
                                console.error(`Selected player is undefined: ${e}`)
                            }
                        }
                        if (res1.formValues[0] === 0) {
                            let otherForm = new ModalFormData()
                            otherForm.title(`§l@aitji.'s Ban(Other)`)
                            otherForm.textField(`§rระบุชื่อผู้เล่นที่จะแบน`, `เช่น: ${pl.name}`) // 0
                            otherForm.textField(`§r§7 | §fเหตุผล`, `(ไม่จำเป็นต้องระบุ)`, res1.formValues[1] || ``) // 1
                            forceShow(pl, otherForm).then((res) => {
                                if (res instanceof ModalFormResponse && !res.canceled) {
                                    const resu = res.formValues
                                    const ban = getBan()
                                    const ban_find = ban.find((key) => key.split("|")[1].toLowerCase() === resu[0].toLowerCase())
                                    if (ban_find) {
                                        pl.sendMessage(
                                            `§r§7${resu[0]} ถูกแบนไปแล้ว\nแบนโดย: ${ban_find.split("|")[3]}\nด้วยเหตุผล: ${ban_find.split("|")[2]}\nเวลา: ${linux_to_time(
                                                ban_find.split("|")[4]
                                            )}`
                                        )
                                    } else {
                                        pl.runCommand(`scoreboard players set "ban|${resu[0].toLowerCase()}|${resu[1] || `ไม่ได้ระบุเหตุผล`}|${pl.name}|${linux_time()}" banlist 0`)
                                        pl.sendMessage(`§r§fได้ทำการแบนผู้เล่น §o${resu[0]}§r§f เรียบร้อยแล้ว`)
                                        request_ban(world.getAllPlayers().find((key) => key.name.toLowerCase().trim() === resu[0].trim().toLowerCase()))
                                    }
                                }
                            })
                        }
                    })
                    break
                case 3:
                    let all = getBan() || []
                    if (all <= 0) {
                        pl.sendMessage(`ไม่มีคนโดนแบนเลย ._.`)
                        return
                    }
                    let dis = all.map((key) => key.split("|")[1])
                    let form = new ModalFormData()
                    form.title(`§l@aitji.'s UnBan`)
                    form.dropdown(`เลือกผู้เล่นที่ต้องการปลดแบน`, dis)
                    forceShow(pl, form).then((res) => {
                        if (res.canceled) return
                        pl.runCommand(`scoreboard players reset "${all[res?.formValues[0]]}" banlist`)
                        pl.sendMessage(`§fปลดแบน ${all[res?.formValues[0]].split("|")[1]} แล้ว`)
                    })
                    break
                default:
                    break
            }
        }
    })
}

world.afterEvents.playerSpawn.subscribe(data => {
    const pl = data.player
    const ban = getBan()
    const find = ban.find(key => key.split("|")[1].toLowerCase().trim() === pl.name.trim().toLowerCase())
    if (find) {
        request_ban(pl)
    }
})

function request_ban(pl) {
    wait(20).then(() => {
        const ban = getBan()
        const find = ban.find(key => key.split("|")[1].toLowerCase().trim() === pl.name.trim().toLowerCase())
        if (!find) return
        world.getDimension("overworld").runCommand(`kick "${pl.name}" \n§r\n คุณถูกแบนจากเซิร์ฟเวอร์ด้วยเหตุผล: ${find.split("|")[2]}\nแบนโดย: ${find.split("|")[3]}\nเวลา: ${linux_to_time(find.split("|")[4])}`)
    })

}

function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}

system.run(() => createScore("banlist"))
const getBan = () => getFakePlayer("banlist").filter(key => key.startsWith(`ban|`)) || []
const linux_time = () => Math.floor(new Date().getTime() / 1000)

function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}

function linux_to_time(linuxTime) {
    const unixTimeMillis = linuxTime * 1000
    const date = new Date(unixTimeMillis)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString()
    let h = (date.getHours() + 7).toString().padStart(2, '0')
    let hours = h >= 24 ? h - 24 : h
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const formattedTime = `${day}/${month}/${year} (${hours}:${minutes})`
    return formattedTime
}

async function forceShow(player, form, timeout = Infinity) {
    const startTick = system.currentTick
    while (system.currentTick - startTick < timeout) {
        const response = await form.show(player)
        if (response.cancelationReason !== FormCancelationReason.UserBusy) {
            return response
        }
    }
    throw new Error(`Timed out after ${timeout} ticks`)
}

function wait(ticks) {
    return new Promise((resolve) => {
        system.runTimeout(resolve, ticks)
    })
}