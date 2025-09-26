import "./server/item"
import "./officer/attack"
import "./bandit/steal"
import { system } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
/** ------------------------------------------- */
/**
 * @author aitji
 * @description This Script was created by aitji
 * @copyright 2023-2024 aitji
 * @youtube https://www.youtube.com/channel/UCphyxbOnunOu0FcNLYPPXJw?sub_confirmation=1/
 */
/** ------------------------------------------- */