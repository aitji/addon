/** -------------------------------------- */
import { world } from "@minecraft/server"
world.events.entityHurt.subscribe(data => { try { for (let i = 0; i < Math.ceil(data.damage / 2); i++) data.hurtEntity.runCommandAsync(`particle blood ~~~`) } catch (InwAitJi) { } })
/** -------------------------------------- */