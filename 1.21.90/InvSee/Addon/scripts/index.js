import { system, world } from "@minecraft/server"
import { invsee } from "./invsee"
const prefix = "!"
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)

world.beforeEvents.chatSend.subscribe(data => {
    let pl = data.sender
    if (pl.hasTag('op')) commandHandler(pl, data)
})

export function commandHandler(player, message) {
    if (typeof player !== "object") throw TypeError(`player is type of ${typeof player}. Expected "object"`)
    if (typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object"`)

    if (!message.message.startsWith(prefix)) return;
    const args = message.message.slice(prefix.length).split(/ +/)
    const cmd = args.shift().toLowerCase().trim()

    if (cmd === "invsee") {
        message.cancel = true
        invsee(message, args)
    }
}