import { world } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe(data => {
    data.cancel = true
    const { sender: player, message } = data
    world.sendMessage(`<${player.nameTag}> ${message}`)
})