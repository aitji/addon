/** ------------------- */
import { system, world } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
import "./Display/NameTag"
import "./Display/Chat"
/** ------------------- */