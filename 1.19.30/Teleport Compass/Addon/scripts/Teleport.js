/** --------------------- */
import { world } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
/** @ AitJi Script @ */
/** --------------------- */
world.events.beforeItemUse.subscribe(data => {
    let pl = data.source
    let item = data.item
    if (item.typeId === "minecraft:recovery_compass" && pl.hasTag(`Admin`)) {
        teleport(pl);
    }
})
/** --------------------- */
function teleport(pl) {
    pl.runCommand(`playsound random.pop @s ~~~ 50`);
    let form = new ActionFormData();
    let players = [...world.getPlayers()];
    form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
    form.body(`§fPlayer Online: §c${players.length}§f \nClick §cPlayer§f to Teleport`);
    players.map(function (player) {
        let randoms = Math.floor(Math.random() * 2)
        if (randoms == 0) {
            form.button(`${player.name}\n§7Click Here`, "textures/ui/icon_alex");
        }
        if (randoms == 1) {
            form.button(`${player.name}\n§7Click Here`, "textures/ui/icon_steve");
        }
    });
    form.show(pl).then((res) => {
        if (res.isCanceled)
            return;
        let selection = players[res.selection];
        pl.teleport(selection.location, selection.dimension, pl.rotation.x, pl.rotation.y);
    });
}
/** --------------------- */

/**
 * @author AitJi Gamer
 * @description This Script was created by AitJi Gamer
 * @copyright 2021-2022 AitJi Gamer
 * @youtube https://www.youtube.com/@aitji.
 */