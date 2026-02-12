import { world, system } from "@minecraft/server"

function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective) || world.scoreboard.addObjective(objective, objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) || 0
        }
        return obj.getScore(target.scoreboardIdentity) || 0
    } catch {
        return useZero ? 0 : NaN
    }
}

function getColor(pl) {
    const colors = ['f', '0', 'g', 'e', '4', 'c', '6', '5', 'd', '1', '9', '3', 'b', '2', 'a', '8', '7', 'h', 'i', 'j', 'm', 'n', 'p', 'q', 's', 't', 'u', 'v']
    const user = Math.abs(getScore("color", pl) || 0) % colors.length
    return '§' + colors[user]
}

system.runInterval(() => {
    for (const player of world.getAllPlayers())
        player.nameTag = `${getColor(player)}${player.name}§r`
}, 20)