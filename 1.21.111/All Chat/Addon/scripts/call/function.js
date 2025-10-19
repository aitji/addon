import { world, system, Player, ScoreboardIdentityType } from "@minecraft/server";
/** _______________________________________________________________ */
/**
 * @param {String} objective 
 * @param {Player | String} target 
 * @param {Boolean} useZero 
 * @returns {Number}
 */
export function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective) || world.scoreboard.addObjective(objective, objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) || 0
        }
        return obj.getScore(target.scoreboardIdentity) || 0
    } catch {
        return useZero ? 0 : NaN
    }
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 * @returns {String}
 */
export function color(pl) {
    const colors = ['f', '0', 'g', 'e', '4', 'c', '6', '5', 'd', '1', '9', '3', 'b', '2', 'a', '8', '7', 'h', 'i', 'j', 'm', 'n', 'p', 'q', 's', 't', 'u', 'v']
    const user = Math.abs(getScore("color", pl) || 0) % colors.length
    return '§' + colors[user]
}
/** _______________________________________________________________ */
/**
 * @param {String} objectiveId 
 * @returns {Array}
 */
export function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** _______________________________________________________________ */
/**
 * @param {String} scoreboardName 
 * @returns {null}
 */
export function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}
/** _______________________________________________________________ */
/**
 * @param {Number} data 
 * @returns {Boolean}
 */
export const toBool = v => v === 1 || v === true
/** _______________________________________________________________ */
/**
 * @param {Boolean} data 
 * @returns {Number}
 */
export function boolTo(data) {
    if (data === false) return 0
    if (data === true) return 1
    return 0
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl1 
 * @param {Player} pl2 
 * @returns {Number}
 */
export function CalDistance(pl1, pl2) {
    const dx = pl1.x - pl2.x;
    const dy = pl1.y - pl2.y;
    const dz = pl1.z - pl2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}