import { invsee } from "./invsee";
import config from "./config";
/** -------------------------------- */
const prefix = "!"
/** -------------------------------- */
export function commandHandler(player, message) {
    if (typeof player !== "object") throw TypeError(`player is type of ${typeof player}. Expected "object"`);
    if (typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object"`);

    if (!message.message.startsWith(prefix)) return;

    const args = message.message.slice(prefix.length).split(/ +/);

    const command = args.shift().toLowerCase().trim();

    let commandData;
    let commandName;
    if (typeof config.customcommands[command] === "object") {
        commandData = config.customcommands[command];
        commandName = command;
    } else {
        for (const cmd of Object.keys(config.customcommands)) {
            const data = config.customcommands[cmd];
            if (typeof data !== "object" || typeof data.aliases === "undefined" || !data.aliases.includes(command)) continue;
            commandData = data;
            commandName = cmd;
            break;
        }
        if (typeof commandData === "undefined") return;
    }
    message.cancel = true;
    if (commandData.requiredTags.length >= 1 && commandData.requiredTags.some(tag => !player.hasTag('op'))) {
        return;
    }

    if (commandData.enabled === false) {
        return;
    }
    else if (commandName === "invsee") invsee(message, args);
    else return
}

/**
 * @author "aitji"
 * @youtube AitJi Gamer
 * @copyright 2022-2023
 * @settings เปิด Beta API ด้วยนะ :>
 */