import { world, system, scoreboardIdentity } from "@minecraft/server";

const colors = ["§f", `§0`, `§g`, `§e`, `§4`, `§c`, `§6`, `§5`, `§d`, `§1`, `§9`, `§3`, `§b`, `§2`, `§a`, `§8`, `§7`]
system.runInterval(() => {
    const color = world.scoreboard.getObjective('color')
    for (const player of world.getAllPlayers()) player.nameTag = `${colors[color.getScore(player) || 0] || '§f'}${player.name}§r`
})