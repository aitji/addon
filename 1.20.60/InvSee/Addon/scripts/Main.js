import { system } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
import "./Display/Chat"

/**
 * @author "aitji"
 * @youtube AitJi Gamer
 * @copyright 2022-2023
 * @settings เปิด Beta API ด้วยนะ :>
 */