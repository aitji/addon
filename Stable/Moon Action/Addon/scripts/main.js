import { world, system, Player } from "@minecraft/server"

const OBJECTIVES = {
    "pl:level": "pl:level",
    "pl:xp": "pl:xp",
    "pl:hp": "pl:hp",
    "pl:maxhp": "pl:maxhp",
    "pl:deaths": "pl:deaths",
    "pl:kills": "pl:kills"
}

const message = [
    `§7Hey §eHost §7this message from §e@aitji`,
    `§8only world host can saw this message`,
    ``,
    `§fScoreboard:`,
    `§7pl:level - player's level`,
    `§7pl:xp - player's exp`,
    `§7pl:hp - player's current health`,
    `§7pl:maxhp - player's effective health §8(health boost are count)`,
    `§7pl:deaths - count how many times got killed by player`,
    `§7pl:kills - count how many times kill other player`,
    ``,
    `§fPlayer Tags:`,
    `§7action:moving - player's velocity§8(xyz) §7isn't equal to zero`,
    `§7action:climbing - player are climbing §8(e.g. ladder, vine)`,
    `§7action:falling - player are falling from sky`,
    `§7action:flying - player are flying §8(creative mode, ability command)`,
    `§7action:gliding - player are gliding §8(elytra)`,
    `§7action:inwater - player inside water §8(count waterlog block)`,
    `§7action:jumping - player are jumping`,
    `§7action:onground - player is on the ground`,
    `§7action:sneaking - player are sneaking`,
    `§7action:running - player are running/sprinting`,
    `§7action:swimming - player are swimming`,
    `§7action:sleeping - player are sleeping`,
    `§7action:emoting - player are emoting`,
    ``,
    `§fActions:`,
    `§7dmg:§fNUMBER §7- apply §fNUMBER§7 damage(s) to player §8(tag @s add "dmg:4")`,
    `§7fire:§fNUMBER §7- make player hoter for §fNUMBER §7second(s) §8(tag @s add "fire:12")`,
    `§7kick:§fSTRING §7- kick player from world with reason follow by §fSTRING §8(tag @s add "kick:good bye!")`,
]

Object.entries(OBJECTIVES).forEach(([name]) => {
    if (!world.scoreboard.getObjective(name))
        world.scoreboard.addObjective(name, name)
})

const scoreboards = {
    level: world.scoreboard.getObjective('pl:level'),
    maxhp: world.scoreboard.getObjective('pl:maxhp'),
    xp: world.scoreboard.getObjective('pl:xp'),
    hp: world.scoreboard.getObjective('pl:hp'),
    deaths: world.scoreboard.getObjective('pl:deaths'),
    kills: world.scoreboard.getObjective('pl:kills')
}

world.afterEvents.entityHurt.subscribe(
    ({ hurtEntity, damageSource }) => {
        const health = hurtEntity.getComponent("health")

        if (health.currentValue <= 0) {
            scoreboards.deaths.addScore(hurtEntity, 1)
            if (damageSource.damagingEntity instanceof Player)
                scoreboards.kills.addScore(damageSource.damagingEntity, 1)
        }
    },
    { entityTypes: ["minecraft:player"] }
)

const ACTION_TAGS = {
    "action:moving": (plr) => {
        const velocity = plr.getVelocity()
        return plr.isGliding || plr.isJumping || plr.isSprinting ||
            velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0
    },
    "action:climbing": (plr) => plr.isClimbing,
    "action:falling": (plr) => plr.isFalling,
    "action:flying": (plr) => plr.isFlying,
    "action:gliding": (plr) => plr.isGliding,
    "action:inwater": (plr) => plr.isInWater,
    "action:jumping": (plr) => plr.isJumping,
    "action:onground": (plr) => plr.isOnGround,
    "action:sneaking": (plr) => plr.isSneaking,
    "action:running": (plr) => plr.isSprinting,
    "action:swimming": (plr) => plr.isSwimming,
    "action:sleeping": (plr) => plr.isSleeping,
    "action:emoting": (plr) => plr.isEmoting
}

function processTags(player, tags) {
    for (const tag of tags) {

        if (tag.startsWith("dmg:")) {
            player.removeTag(tag)
            const damage = Math.ceil(Number(tag.split(":")[1])) || 0
            if (damage > 0) player.applyDamage(damage)
        } else if (tag.startsWith("fire:")) {
            player.removeTag(tag)
            const duration = Math.ceil(Number(tag.split(":")[1])) || 0
            if (duration > 0) player.setOnFire(duration, true)
        } else if (tag.startsWith("kick:")) {
            player.removeTag(tag)
            const reason = tag.split(":")[1] || ''
            try { player.runCommand(`kick "${player.name}" ${reason}`) }
            catch (e) { world.sendMessage('§cThe host may not be kicked from the game.') }
        }
    }
}

let count = 0
system.runInterval(() => {
    const players = world.getAllPlayers()

    for (const player of players) {
        if (player.id === '-4294967295') player.addTag("perm:host")
        else if (player.hasTag("perm:host")) player.removeTag("perm:host")

        for (const [tag, checkFunc] of Object.entries(ACTION_TAGS)) {
            const hasTag = player.hasTag(tag)
            const haveTag = checkFunc(player)

            if (haveTag && !hasTag) player.addTag(tag)
            else if (!haveTag && hasTag) player.removeTag(tag)
        }

        const health = player.getComponent("health")
        scoreboards.hp.setScore(player, Math.ceil(health.currentValue))
        scoreboards.maxhp.setScore(player, Math.ceil(health.effectiveMax))
        scoreboards.level.setScore(player, Math.floor(player.level || 0))
        scoreboards.xp.setScore(player, player.getTotalXp())

        if (count > 6) processTags(player, player.getTags())
    }

    if (count > 6) count = 0
    count++
}, 1)

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return
    const oldId = player.getTags().find(e => e.startsWith('id:'))?.replace('id:')
    if (oldId && oldId !== player.id) {
        player.removeTag(oldId)
        player.addTag(player.id)
    }

    if (player.id !== '-4294967295') return
    const ids = system.runInterval(() => {
        if (!player.isValid()) return

        system.clearRun(ids)
        system.runTimeout(() => player.sendMessage(message.join("\n")), 60)
    }, 6)
})