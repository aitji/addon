import { world, system, Player } from "@minecraft/server";
import { color } from "./call/function";
/** _______________________________________________________________ */
let tick = 0
system.runInterval(() => {
    tick++

    const delay = world.scoreboard.getObjective('delay')
    for (const player of world.getPlayers()) {
        player.nameTag = color(player) + player.name

        if (tick >= 20) {
            tick = 0
            const count = delay.getScore(player) || 0
            delay.addScore(player, -1)
            if (count - 1 <= 0) delay.removeParticipant(player)
        }
    }
}, 1)
/** _______________________________________________________________ */
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return
    const chatroom = world.scoreboard.getObjective('chatroom')
    chatroom.addScore(player, 0)
})
/** _______________________________________________________________ */