import { system, world } from "@minecraft/server";
import { createScore } from "./function";
/** _______________________________________________________________ */
system.run(() => {
    createScore("chatsettings")
    createScore("delay")
    createScore("color")
    createScore("rankchat")
    createScore("chatroom")
    createScore("chatroomSetting")
    createScore("chatDistance")
})
/** _______________________________________________________________ */