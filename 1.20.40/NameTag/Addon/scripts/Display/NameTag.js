/** ------------------- */
import { world, system, scoreboardIdentity } from "@minecraft/server";
/** @ aitji Script @ */
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
/** ------------------- */
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        let color = getScore("color", player);
        let colors = ["§f", `§0`, `§g`, `§e`, `§4`, `§c`, `§6`, `§5`, `§d`, `§1`, `§9`, `§3`, `§b`, `§2`, `§a`, `§8`, `§7`]
        player.nameTag = `${colors[color] ?? `§f`}${player.name}§r`;
    }
});
/** ------------------- */