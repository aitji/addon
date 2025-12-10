import { world, system } from "@minecraft/server"
system.beforeEvents.watchdogTerminate.subscribe((d) => (d.cancel = true))

const KEY = "NameTag"
const instructions = `§cNameTag §7ติดตั้งแล้ว

§l§7#เปลี่ยนสีผู้เล่น§r
§7สำหรับใส่สีชื่อในเกม "color"
§7เพื่อเปลี่ยนสีชื่อผู้เล่นใช้คำสั่ง §c/scoreboard players set @s color [สีที่ต้องการ]
§7-0 §fWhite
§7-1 §0Black
§7-2 §eYellow
§7-3 §gMine Coin Gold
§7-4 §4Dark Red
§7-5 §cRed
§7-6 §6Orange
§7-7 §5Dark Purple
§7-8 §dLight Purple
§7-9 §1Dark Blue
§7-10 §9Blue
§7-11 §3Dark Aqua
§7-12 §bAqua
§7-13 §2Green
§7-14 §aLime
§7-15 §8Dark Gray
§7-16 §7Gray

§7§l##สีใหม่§r
§7-17 §hQuartz
§7-18 §iIron
§7-19 §jNetherite
§7-20 §mRedstone
§7-21 §nCopper
§7-22 §pGold
§7-23 §qEmerald
§7-24 §sDiamond
§7-25 §tLapis Lazuli
§7-26 §uAmethyst
§7-27 §vResin
§o§7*หากเลขสีไม่ถูกต้อง ตัวเลขจะวนกลับไปนับจาก 0 ใหม่ §c(color % 27)

§7ใช้คำสั่ง §c/tag @s add Admin §7เพื่อเข้าเป็นผู้ดูแล ของแอดออนนี้
§7ผู้ทำแอดออน §caitji §7(1.21.130)
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