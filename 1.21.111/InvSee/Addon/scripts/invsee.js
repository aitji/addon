import * as Minecraft from "@minecraft/server"
const World = Minecraft.world

export function invsee(message, args) {
    if (typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender
    if (args.length === 0) return player.sendMessage("§7You need to provide whos §finventory §7to view!§r")

    for (const pl of World.getPlayers()) if (pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        var member = pl
        break
    }

    if (typeof member === "undefined") return player.sendMessage("§7Couldn't find that §fplayer.§r")
    const container = member.getComponent('inventory').container

    if (container.size === container.emptySlotsCount) {
        player.sendMessage(`§r§f${member.name}'s§7 inventory is empty.§r`)
        return
    }

    let inventory = `§f${member.name}'s §7inventory:§r\n\n`

    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i)
        if (!item) continue

        let str = item.typeId
        str = str.replace("minecraft:", "").replace(/_/g, " ").toLowerCase().replace(/\b[a-z]/g, l => l.toUpperCase())

        inventory += `§r§7Slot §f${i}§7: §f${str}:§r§o${item.nameTag || '§r'}§r §7x${item.amount}§r\n`

        const enchantable = item.getComponent(Minecraft.ItemComponentTypes.Enchantable)
        if (enchantable && enchantable.enchantments) {
            const enchantments = enchantable.enchantments
            const iterator = enchantments[Symbol.iterator]()
            const loopIterator = (iterator) => {
                const { value, done } = iterator.next()
                if (done) return
                const enchantData = value

                let enchantmentName = enchantData.type.id
                enchantmentName = enchantmentName.charAt(0).toUpperCase() + enchantmentName.slice(1)

                inventory += `§7       | §f${enchantmentName}§7:§f${enchantData.level}§r\n`

                loopIterator(iterator)
            }
            loopIterator(iterator)
        }
    }

    player.sendMessage(`§r§c§l§ฟ*-*-*-*-*-*-*-*-*§r\n${inventory}§r§c§l§ฟ*-*-*-*-*-*-*-*-*§r`)
}