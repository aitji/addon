/** -------------------------------- */
import { world } from "@minecraft/server"
/** @ InwAitJi Script @ */
/** -------------------------------- */
world.beforeEvents.chatSend.subscribe(data =>{
    data.cancel = true;
    let player = data.sender
    let message = data.message
    world.sendMessage(`<${player.nameTag}> ${message}`)
})