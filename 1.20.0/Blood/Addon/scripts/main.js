/** -------------------------------------- */
import { system, world } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
world.afterEvents.entityHurt.subscribe(data => { try { for (let i = 0; i < Math.ceil(data.damage / 2); i++) data.hurtEntity.runCommandAsync(`particle blood ~~~`) } catch (aitji) { } })
/** -------------------------------------- */