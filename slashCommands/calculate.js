const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const Discord = require('discord.js');
const fs = require('fs');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
module.exports = {
    name: "calculate",
    description: "Calculate things?", 
    cooldown: 5,
    memberpermissions: [],
    requiredroles: [], 
    alloweduserids: [],
    options: [],
    run: async (client, interaction) => {
        const {guild, member} = interaction;
        
        //Check if user file exists
        if(fs.existsSync(`./database/users/${member.id}.json`)){
            let file = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`)) //Read user file
            //Check if farm level is registered
            if(!file.farm_level){
                send_reply('level_unregistered')
            }else{
                send_reply('level_registered')
            }
        }else{
            send_reply('file_dont_exist')
        }

        async function send_reply(input){
            let file
            if(input === 'file_dont_exist') createFile()
            else file = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
            let embed = new MessageEmbed()
            .setTitle('HayCord | Calculator')
            .setColor('GREEN')
            .setThumbnail(guild.iconURL())
            .setURL(ee.footericon)
            .setAuthor({
                name: `Made By: Craft#6739`
            })
            .setTimestamp()
            if(input === 'level_unregistered'){
                embed.setDescription(`Select the production factory in with the item your looking is produced\nNOTE: Your hayday level is not registered, please register your level using /register and then the menu below will only show the factories you can access`)
                embed.setFooter({text: `Register your level using /register`, iconURL: ee.footericon})
            }else{
                try{
                    embed.setDescription(`Select the production factory in with the item your looking is produced.\nSince your level is registered (lvl ${file.farm_level}) only the factories that you have access to are available in the menu/s below`)
                    embed.setFooter({
                        text: ee.footertext,
                        iconURL: ee.footericon
                    })
                }catch{
                    client.channels.cache.get('1096569918901723238').send({
                        embeds: [
                            new MessageEmbed()
                            .setColor('RANDOM')
                            .setAuthor({
                                name: `${member.user.tag} | ID: ${member.id}`,
                                iconURL: member.user.avatarURL()
                            })
                            .setDescription(`${settings.emotes.check} ${member} used calculate slash command however [FARM_LEVEL] was undefined\n\n\`Cannot read properties of undefined (reading 'farm_level')
                            at send_reply (C:\Users\CraftTech\Desktop\HayCord\slashCommands\calculate.js:58:156)
                            at Object.run (C:\Users\CraftTech\Desktop\HayCord\slashCommands\calculate.js:38:13)
                            at module.exports (C:\Users\CraftTech\Desktop\HayCord\events\guild\interactionCreate.js:70:11)
                            at Client.emit (node:events:525:35)
                            at InteractionCreateAction.handle (C:\Users\CraftTech\Desktop\HayCord\node_modules\discord.js\src\client\actions\InteractionCreate.js:83:12)
                            at module.exports [as INTERACTION_CREATE] (C:\Users\CraftTech\Desktop\HayCord\node_modules\discord.js\src\client\websocket\handlers\INTERACTION_CREATE.js:4:36)
                            at WebSocketManager.handlePacket (C:\Users\CraftTech\Desktop\HayCord\node_modules\discord.js\src\client\websocket\WebSocketManager.js:346:31)
                            at WebSocketShard.onPacket (C:\Users\CraftTech\Desktop\HayCord\node_modules\discord.js\src\client\websocket\WebSocketShard.js:493:22)
                            at WebSocketShard.onMessage (C:\Users\CraftTech\Desktop\HayCord\node_modules\discord.js\src\client\websocket\WebSocketShard.js:327:10)
                            at callListener (C:\Users\CraftTech\Desktop\HayCord\node_modules\ws\lib\event-target.js:290:14)\``)
                        ]
                    })

                    embed.setDescription(`Select the production factory in with the item your looking is produced.\nSince your level is registered only the factories that you have access to are available in the menu/s below`)
                    embed.setFooter({
                        text: ee.footertext,
                        iconURL: ee.footericon
                    })
                }
            }

            //Process Components here
            let comps = []
            let options = []
            let keys = []
            let itemFile = JSON.parse(fs.readFileSync(`./database/factories.json`))
            if(input === 'level_registered'){
                for(let factory in itemFile){
                    if(itemFile[factory].level <= file.farm_level){
                        keys.push(factory)
                    }
                }
            }else keys = Object.keys(itemFile)
        
            let count = 0
            let totalCount = 0
            keys.forEach(factory => {
                count++
                totalCount++
                if(count >= 25) {
                    console.log(`Count Reset`,options.length, keys.length)
                    comps.push(
                        new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                                .setCustomId(`factory-${totalCount}-${member.id}`)
                                .setPlaceholder('Choose the factory from menu below')
                                .addOptions(options)
                        )
                    )
                    count = 0
                    options = []
                }else{
                    /* const index = keys.indexOf(factory);
                    if (index > -1) { 
                        keys.splice(index, 1); 
                    } */

                    options.push({
                        label: cap(factory),
                        description: itemFile[factory].menu_description,
                        value: `factory-${factory.split(' ').join('_')}`
                    })
                }

                /* if(keys.length > 0 && keys.length <= 25) {
                    console.log(options.length)
                    comps.push(
                        new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                                .setCustomId(`factory-${totalCount}-${member.id}`)
                                .setPlaceholder('Choose the factory from menu below')
                                .addOptions(options)
                        )
                    )
                } */
            })

            if(options.length > 0){
                comps.push(
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId(`factory-${totalCount}-${member.id}`)
                            .setPlaceholder('Choose the factory from menu below')
                            .addOptions(options)
                    )
                )
            }
            
            comps.push(
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`calculate`)
                        .setLabel('Calculate')
                        .setEmoji('⌨️')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('reset')
                        .setLabel('Reset Calculator')
                        .setEmoji('♻️')
                        .setStyle('DANGER'),
                    new Discord.MessageButton()
                        .setCustomId('view')
                        .setLabel('View Calculator')
                        .setEmoji('🔍')
                        .setStyle('SECONDARY')
                )
            )

            interaction.reply({
                embeds : [embed],
                components: comps,
                ephemeral: true
            })


            //Log
            client.channels.cache.get('1096065843240124416').send({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${member.user.tag} | ID: ${member.id}`,
                        iconURL: member.user.avatarURL()
                    })
                    .setDescription(`${settings.emotes.check} ${member} used calculate slash command`)
                ]
            })
        } 

        //Create Profile
        async function createFile(){
            let userTemplate = JSON.parse(fs.readFileSync(`./database/userTemplate.json`))
            userTemplate.details.discordID = member.id
            userTemplate.details.discordTag = member.user.tag
            userTemplate.farm_level = ''
            fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
        }
    }
}