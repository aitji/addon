execute unless score counter "aitjilib" matches ..99999 run scoreboard objectives add "aitjilib" dummy
execute unless score counter "aitjilib" matches ..99999 run scoreboard players set counter "aitjilib" 80

execute unless score api "aitjilib" matches 1 run scoreboard players remove counter "aitjilib" 1

execute unless score api "aitjilib" matches 1 if score counter "aitjilib" matches ..0 run tellraw @a {"rawtext":[{"translate":"§c§cAll Chat §l§cไม่สามารถ§r§7ติดตั้งได้\n\nกรุณา§cเปิด Beta APIs§7 เพื่อให้แอดออนนี้สามารถใช้งานได้\nหากต้องการข้อมูลเพิ่มเติมสำหรับการลงแอดออน §caitji.is-a.dev/support#how-do-i-install-x-addon"}]}
execute unless score api "aitjilib" matches 1 if score counter "aitjilib" matches ..0 run tellraw @a {"rawtext":[{"translate":"§7\nผู้ทำแอดออน §caitji §7(1.21.111)\n§7ติดต่อปัญหาได้ที่ §caitji.is-a.dev/discord\n§7----------------------------"}]}
execute unless score api "aitjilib" matches 1 if score counter "aitjilib" matches ..0 run scoreboard players set counter "aitjilib" 300
