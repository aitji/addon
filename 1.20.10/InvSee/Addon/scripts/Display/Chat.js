import { world } from "@minecraft/server"
import { commandHandler } from "../invsee/handel"
/** ----------------------------------- */
world.beforeEvents.chatSend.subscribe(data => {
    let pl = data.sender
    if(pl.hasTag('op')){
        commandHandler(pl, data)
    }
})

/**
 * @author "aitji"
 * @youtube AitJi Gamer
 * @copyright 2022-2023
 * @settings เปิด Beta API ด้วยนะ :>
 */