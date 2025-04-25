/** ------------------- */
import { world } from "@minecraft/server";
/** @ aitji Script @ */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective);
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target));

        return obj.getScore(target.scoreboard);
    }
    catch {
        return useZero ? 0 : NaN;
    }
}
/** ------------------- */
world.events.tick.subscribe(data => {
    for (const player of world.getPlayers()) {
        let color = getScore("color", player);
        /** Color
         * ------------------
         * "" - White
         * 16.. - White
         * ..0 - White
         * ------------------
         * 0 - White
         * 1 - Black
         * 2 - Light Yellow
         * 3 - Dark Yellow
         * 4 - Dark Red
         * 5 - Light Red
         * 6 - orange
         * 7 - Prple
         * 8 - Pink
         * 9 - Bue
         * 10 - Glow Blue?
         * 11 - Cyan
         * 12 - Light Blue
         * 13 - Dark Green
         * 14 - Light Green
         * 15 - Dark Grey
         * 16 - Light Grey
         * 
         * I hate Basic AitJi Code Really Much << AitJi >>
         */
         if (color < 0) {
            player.nameTag = `§f${player.name}§r`;

        if (color === 0) {
            player.nameTag = `§f${player.name}§r`;

        if (color === 1) {
            player.nameTag = `§0${player.name}§r`;

        if (color === 2) {
            player.nameTag = `§g${player.name}§r`;

        if (color === 3) {
            player.nameTag = `§e${player.name}§r`;

        if (color === 4) {
            player.nameTag = `§4${player.name}§r`;

        if (color === 5) {
            player.nameTag = `§c${player.name}§r`;

        if (color === 6) {
            player.nameTag = `§6${player.name}§r`;

        if (color === 7) {
            player.nameTag = `§5${player.name}§r`;

        if (color === 8) {
            player.nameTag = `§d${player.name}§r`;

        if (color === 9) {
            player.nameTag = `§1${player.name}§r`;

        if (color === 10) {
            player.nameTag = `§9${player.name}§r`;

        if (color === 11) {
            player.nameTag = `§3${player.name}§r`;

        if (color === 12) {
            player.nameTag = `§b${player.name}§r`;

        if (color === 13) {
            player.nameTag = `§2${player.name}§r`;

        if (color === 14) {
            player.nameTag = `§a${player.name}§r`;
        }
        if (color === 15) {
            player.nameTag = `§8${player.name}§r`;

        if (color === 16) {
            player.nameTag = `§7${player.name}§r`;
        }
        if (color > 16) {
            player.nameTag = `§f${player.name}§r`;

    }
});
/** ------------------- */