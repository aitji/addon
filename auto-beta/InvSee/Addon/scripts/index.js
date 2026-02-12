import { system, world, ItemComponentTypes } from "@minecraft/server"
import "./lib"

world.beforeEvents.chatSend.subscribe(data => {
    const { sender, message } = data

    if ((
        !sender.hasTag('Admin') &&
        !sender.hasTag('op')
    ) || !message.startsWith("!")) return

    const args = message.slice(1).split(/ +/)
    const cmd = args.shift().toLowerCase().trim()

    if (cmd === "invsee") {
        data.cancel = true
        invsee(data, args)
    }
})

function invsee(data, args) {
    const { sender: player } = data
    if (!args.length) return player.sendMessage("§7You need to provide whos §finventory §7to view!§r")

    let member
    for (const pl of world.getPlayers())
        if (pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
            member = pl
            break
        }

    if (!member) return player.sendMessage("§7Couldn't find that §fplayer.§r")

    const container = member.getComponent('inventory').container
    if (container.size === container.emptySlotsCount)
        return player.sendMessage(`§r§f${member.name}'s§7 inventory is empty.§r`)

    let inventory = `§f${member.name}'s §7inventory:§r\n\n`

    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i)
        if (!item) continue

        const name = item.typeId.replace("minecraft:", "").replace(/_/g, " ").toLowerCase().replace(/\b[a-z]/g, l => l.toUpperCase())
        inventory += `§7Slot §f${i}§7: §f${name}:§r§o${item.nameTag || '§r'}§r §7x${item.amount}§r\n`

        const enchComp = item.getComponent(ItemComponentTypes.Enchantable)
        if (enchComp?.enchantments) {
            for (const ench of enchComp.enchantments) {
                const enchName = ench.type.id.charAt(0).toUpperCase() + ench.type.id.slice(1)
                inventory += `§7       | §f${enchName}§7:§f${ench.level}§r\n`
            }
        }
    }

    player.sendMessage(`§r§c§l§ฟ*-*-*-*-*-*-*-*-*§r\n${inventory}§r§c§l§ฟ*-*-*-*-*-*-*-*-*§r`)
}