import { system, world } from "@minecraft/server";
import { createScore } from "./function";
/** _______________________________________________________________ */
system.run(() => {
    world.sendMessage("§l§7________________________")
    createScore("chatsettings")
    world.sendMessage("§l§cAnti Spam §r§fhas been loaded §a(1/2)")
    createScore("delay")
    world.sendMessage("§l§cAnti Spam §r§fhas been loaded §a(2/2)")
    createScore("color")
    world.sendMessage("§l§cColor Name §r§fhas been loaded §a(1/1)")
    createScore("rankchat")
    world.sendMessage("§l§cRank Chat §r§fhas been loaded §a(1/1)")
    createScore("chatroom")
    world.sendMessage("§l§cChat Room §r§fhas been loaded §a(1/2)")
    createScore("chatroomSetting")
    world.sendMessage("§l§cChat Room §r§fhas been loaded §a(2/2)")
    createScore("chatDistance")
    world.sendMessage("§l§cNear Chat §r§fhas been loaded §a(1/1)")
    world.sendMessage("§l§7_______________________")
})
/** _______________________________________________________________ */