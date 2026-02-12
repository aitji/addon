import { world, system } from "@minecraft/server"
system.beforeEvents.watchdogTerminate.subscribe((d) => (d.cancel = true))

const KEY = "All Chat"
const instructions = `§cAll Chat §7ติดตั้งแล้ว

§l§7#ไอเท็มที่ต้องใช้ §r§c(จำเป็น*)
§c-รหัสไอเท็ม   §7: aitji:antispam
§c-แท็กแอดมิน  §7: Admin

§7ใช้คำสั่ง §c/tag @s add Admin §7เพื่อเข้าเป็นผู้ดูแล ของแอดออนนี้
§7ผู้ทำแอดออน §caitji §7(beta)
§7ติดต่อปัญหาได้ที่ §caitji.is-a.dev/discord

§8ข้อความนี้จะแสดงแค่ผู้ดูแลเซิร์ฟเวอร์เท่านั้น
§8จะไม่ปรากฏแก่ให้ผู้เล่นในเซิร์ฟเวอร์
§7----------------------------`

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) return
  world.scoreboard.getObjective("aitjilib").setScore("api", 1)
  if (player.commandPermissionLevel < 2) return

  let ticks = 0
  const id = system.runInterval(() => {
    if (!player.isValid) return

    const pos = player.location
    if (pos && !isNaN(pos.x)) {
      system.clearRun(id)
      system.runTimeout(() => player.sendMessage(instructions), 60)
    }

    if (ticks++ > 200) system.clearRun(id)
  }, 60)
})

system.afterEvents.scriptEventReceive.subscribe(({ id, message }) => {
  if (message !== KEY) return
  const lib = world.scoreboard.getObjective("aitjilib")

  switch (id) {
    case 'aitji-lib:heartbeat':
      lib.addScore(`addon`, 1)
      lib.setScore("api", 1)
    default: return
  }
}, { namespaces: ["aitji-lib"] })