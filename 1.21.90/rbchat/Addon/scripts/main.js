import { world, system, ScoreboardIdentityType } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
const obj = "rbchat"
const debug = true

system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
system.run(() => {
    world.sendMessage(`§7§l| §r§9RBChat§f has been §cReloaded§r`)
    cs(String(obj))
    cs(String(`${obj}.setting`))
})

world.beforeEvents.itemUse.subscribe((data) => {
    const pl = data.source

    if (data.itemStack?.typeId === "aitji:rbchat" && pl.hasTag("Admin")) {
        system.run(() => {
            const form = new ModalFormData()
            const {
                hide_, maxMsg_, cutoffMsg_,
                sound_, soundType_, soundLength_,
                maxLine_, below_, colorBoo_, base_
            } = gvIng()

            form.title(`§l§pRB Chat's§r Setting`)
            form.textField(`§m»§f ระยะเวลาก่อน§mแชทจะหาย§fไป\n§7(โดยใช้ §ltick§r§7 | โดยที่ §l20tick§r§7 เท่ากับ §l1s§r§7)`, `เช่น › §l60§r`, { defaultValue: hide_ })
            form.textField(`§4»§f จำนวนข้อความสูงสุดที่แสดงก่อนจะ§4ถูกตัด`, `เช่น › §l16§r`, { defaultValue: maxMsg_ })
            form.textField(`§c»§f คำสุดท้ายก่อนข้อความจะ§4ถูกตัด§f\n§7(ตัวอย่าง "§lHello Wo..§r§7")`, `เช่น › §l..§r`, { defaultValue: cutoffMsg_ })
            form.toggle(`§6»§f เสียงเมื่อ§6ส่งข้อความ`, { defaultValue: cov(true, sound_) })
            form.textField(`§p»§f ประเภทของ§pเสียง§fที่จะเล่น`, `เช่น › §lrandom.pop§r`, { defaultValue: soundType_ })
            form.textField(`§g»§f ระยะทางของ§gเสียง`, `เช่น › §l@a[r=>>...<<]§r`, { defaultValue: soundLength_ })
            form.textField(`§e»§f จำนวน§eบรรทัด§fสูงสุดสำหรับการแสดงใน§eป้ายชื่อ`, `เช่น › §l3§r`, { defaultValue: maxLine_ })
            form.textField(`§q»§f ข้อความ§qระหว่าง§fชื่อและแชท`, `เช่น › §l\\n\\n§r`, { defaultValue: below_ })
            form.toggle(`§2»§f เปิดใช้งานสี§2จางลง§fเมื่อใกล้หาย`, { defaultValue: cov(true, colorBoo_) })
            form.textField(`§a»§f สไตล์หน้าข้อความ`, `เช่น › §o§l$§r§oo§r §r§7$=unicode(U+00A7)`, { defaultValue: base_ })
            form.show(pl).then((res) => {
                if (res.canceled) return
                pl.playSound('random.pop')
                pl.sendMessage(`§e» §fกำลัง§l§eบันทึกข้อมูล§r§f กรุณารอ§e§lสักครู่§r§f. .`)
                let rbchatSet = world.scoreboard.getObjective('rbchat.setting')
                if (!rbchatSet) {
                    world.scoreboard.addObjective('rbchat.setting', 'rbchat.setting')
                    rbchatSet = world.scoreboard.getObjective('rbchat.setting')
                }

                try {
                    rbchatSet.getParticipants().forEach(e => rbchatSet.removeParticipant(e))
                    rbchatSet.setScore(`hide|${res.formValues[0]}`, 0)
                    rbchatSet.setScore(`maxMsg|${res.formValues[1]}`, 1)
                    rbchatSet.setScore(`cutoffMsg|${res.formValues[2]}`, 2)
                    rbchatSet.setScore(`sound|${cov(false, res.formValues[3])}`, 3)
                    rbchatSet.setScore(`soundType|${res.formValues[4]}`, 4)
                    rbchatSet.setScore(`soundLength|${res.formValues[5]}`, 5)
                    rbchatSet.setScore(`maxLine|${res.formValues[6]}`, 6)
                    rbchatSet.setScore(`below|${res.formValues[7]}`, 7)
                    rbchatSet.setScore(`colorBoo|${cov(false, res.formValues[8])}`, 8)
                    rbchatSet.setScore(`base|${res.formValues[9]}`, 9)
                    pl.sendMessage(`§a» §fบันทึกข้อมูล§a§lเรียบร้อย§r§fแล้ว!`)
                    pl.playSound(`random.orb`)
                } catch (error) {
                    pl.playSound(`note.pling`)
                    pl.sendMessage(`§4[!]» §fบันทึกข้อมูล§4§lไม่สำเร็จ§r§fหรัสข้อผิดพลาด\n§7${error}`)
                }
            })
        })
    }
})

const cov = (ntb, i) => ntb ? String(i) === "1" : i ? "1" : "0";
const os = () => Math.floor(Date.now() / 1000)
function gvIng(o = obj) {
    const l = get(`${o}.setting`);
    const gv = (k, v) => (
        l.find(r => r.startsWith(`${k}|`)
        ) || "").split(`${k}|`)[1] || v

    return {
        hide_: gv('hide', '60'),
        maxMsg_: gv('maxMsg', '16'),
        cutoffMsg_: gv('cutoffMsg', '..'),
        sound_: gv('sound', '1'),
        soundType_: gv('soundType', 'random.pop'),
        soundLength_: gv('soundLength', '15'),
        maxLine_: gv('maxLine', '3'),
        below_: gv('below', '\\n\\n'),
        colorBoo_: gv('colorBoo', '1'),
        base_: gv('base', '§o')
    }
}

function cs(n) {
    if (world.scoreboard.getObjective(n)) return
    world.scoreboard.addObjective(n, n)
}

function get(id, end = "") {
    try {
        return world.scoreboard
            .getObjective(id)
            .getParticipants()
            .filter((d) => (
                d.type === ScoreboardIdentityType.FakePlayer) &&
                d.displayName.endsWith(end)
            )
            .map(d => d.displayName)
    } catch (e) {
        cs(id)
        world.sendMessage(`§4[!] §c${id}§r §cยังไม่ได้ถูกสร้าง\n§c§oระบบได้ทำการสร้างให้อัตโนมัติ`)
        return []
    }
}

function gsc(oj, pla) {
    try {
        const obj = world.scoreboard.getObjective(oj)
        if (typeof pla == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == pla)) || 0
        }
        return obj.getScore(pla.scoreboardIdentity) || 0
    } catch {
        return 0
    }
}

system.runInterval(() => {
    const plr = world.getAllPlayers()
    let allMsg = []
    let {
        hide_, maxMsg_, cutoffMsg_,
        sound_, soundType_, soundLength_,
        maxLine_, below_, colorBoo_, base_
    } = gvIng()
    plr.forEach(pl => {
        allMsg = get(obj, `▶${pl.name}`) || []
        if (allMsg.length == 0) {
            pl.nameTag = `${pl.name}`
            return
        }

        allMsg = allMsg
            .sort((a, b) => b.split("▶")[1] - a.split("▶")[1])
            .slice(0, Math.round(Number(maxLine_)))
            .sort((a, b) => a.split("▶")[1] - b.split("▶")[1])

        let display = []
        allMsg.map(data => {
            let color = ''
            if (cov(true, colorBoo_)) {
                let val = gsc(obj, `${data}`) || 0
                let p = (val / Math.round(Number(hide_))) * 100
                if (p >= 80) color = "§f"
                else if (p >= 50) color = "§7"
                else if (p >= 0) color = "§8"
                else {
                    if (dev) world.sendMessage(`invalid color (%%)`)
                    color = ""
                }

            }
            display.push(`${base_}${color}${data.split("▶")[0].replace(/§./g, "")}§r`)
        })

        pl.nameTag = `${display.join("\n")}§r${below_.replace(/\\n/g, "\n")}${pl.name}`
    })
    allMsg = get(obj) || []
    allMsg.forEach((am, i) => {
        const objecti = world.scoreboard.getObjective(obj)

        if (gsc(obj, am) <= 0) {
            if (debug) world.sendMessage(`§4${i}: §o${am}§r §mtime out`)
            objecti.removeParticipant(am)
        } else objecti.addScore(am, -1)
    })
}, 1)

world.beforeEvents.chatSend.subscribe(async (data) => {
    let { sender, message } = data
    let {
        hide_, maxMsg_, cutoffMsg_,
        sound_, soundType_, soundLength_,
        maxLine_, below_, colorBoo_, base_
    } = gvIng()

    message = `${message.substring(0, Math.round(Number(maxMsg_)))}${message.length > Math.round(Number(maxMsg_)) ? cutoffMsg_ : ''}`

    const obje = world.scoreboard.getObjective(obj)
    system.run(() => {
        obje.setScore(`${message}▶${os()}▶${sender.name}`, Number(Math.round(Number(hide_))))
        if (debug) world.sendMessage(`§a: §o${message}▶${os()}▶${sender.name}§r §qadded`)
        if (cov(true, sound_)) sender.runCommand(`playsound ${soundType_} @a[r=${soundLength_}]`)
    })
})