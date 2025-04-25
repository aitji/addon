/** ------------------- */
import { world, system } from "@minecraft/server";
/** @ aitji Script @ */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective);
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target));
        }
        return obj.getScore(target.scoreboard);
    }
    catch {
        return useZero ? 0 : NaN;
    }
}
/** ------------------- */
system.runInterval(data => {
    for (const player of world.getPlayers()) {
        let color = getScore("color", player);
        let colors = ["§f",`§0`,`§g`,`§e`,`§4`,`§c`,`§6`,`§5`,`§d`,`§1`,`§9`,`§3`,`§b`,`§2`,`§a`,`§8`,`§7`]
        player.nameTag = `${colors[color] ?? `§f`}${player.name}§r`;
        if (color < 0) player.nameTag = `§f${player.name}§r`;
        if (color > 16) player.nameTag = `§f${player.name}§r`;
    }
});
/** ------------------- */