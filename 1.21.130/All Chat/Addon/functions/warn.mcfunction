execute unless score counter "aitjilib" matches ..99999 run scoreboard objectives add "aitjilib" dummy
execute unless score counter "aitjilib" matches ..99999 run scoreboard players set counter "aitjilib" 80
execute unless score counter "aitjilib" matches ..99999 run scoreboard players set addon "aitjilib" 0
execute unless score counter "aitjilib" matches ..99999 run scoreboard players set heartbeat "aitjilib" 0
execute unless score counter "aitjilib" matches ..99999 run scriptevent aitji-lib:heartbeat

execute unless score heartbeat "aitjilib" matches 1 run scriptevent aitji-lib:heartbeat All Chat
execute unless score heartbeat "aitjilib" matches 1 run scoreboard players set heartbeat "aitjilib" 1

scoreboard players remove counter "aitjilib" 1
execute if score addon "aitjilib" matches 2.. run scoreboard players operation counter "aitjilib" += addon "aitjilib"
execute if score addon "aitjilib" matches 2.. run scoreboard players remove counter "aitjilib" 1

execute unless score api "aitjilib" matches 1 if score counter "aitjilib" matches ..0 run tellraw @a {"rawtext":[{"translate":"§c§c@aitji Library §l§cไม่สามารถ§r§7ติดตั้งแอดออนได้\n\nกรุณา§cเปิด Beta APIs§7 เพื่อให้แอดออนนี้สามารถใช้งานได้\nหากเปิดแล้วแต่ยังเห็นข้อความนี้ กรุณาอัพเดท§cแอดออน§r"}]}
execute unless score api "aitjilib" matches 1 if score counter "aitjilib" matches ..0 run tellraw @a {"rawtext":[{"translate":"§7หรือหากต้องการข้อมูลเพิ่มเติมสำหรับการลงแอดออน §caitji.is-a.dev/support#how-do-i-install-x-addon\n§7ผู้ทำแอดออน §caitji §7(1.21.130)\n \n§7ติดต่อปัญหาได้ที่ §caitji.is-a.dev/discord\n§7----------------------------"}]}

execute unless score api "aitjilib" matches 0 if score counter "aitjilib" matches ..0 run scoreboard players set api "aitjilib" 0
execute if score counter "aitjilib" matches ..0 run scoreboard players set counter "aitjilib" 300

scoreboard players set addon "aitjilib" 0
scoreboard players set heartbeat "aitjilib" 0