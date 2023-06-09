const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const settings = require('../database/settings.json');
module.exports = {
    name: "register",
    description: "register your farm level", 
    cooldown: 5,
    memberpermissions: [],
    requiredroles: [], 
    alloweduserids: [],
    options: [
        {"Integer": { name: "farm_level", description: "Mention your Farm level", required: true }}
    ],
    run: async (client, interaction) => {
        const {guild, member} = interaction;

        let farmLevel = interaction.options.getInteger('farm_level') 

        if(farmLevel <= 0) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Farm level cannot be lower than 1`)
            ],
            ephemeral: true
        })


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
            if(input === 'file_dont_exist') return createFile(farmLevel)
            file = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

            file.farm_level = farmLevel
            file.cart = {}
            fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(file, null, 4))

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${settings.emotes.check} Farm Level registered as **${farmLevel}**, Now you will only view things your farm level allows. To change it, simply run the command again`)
                ],
                ephemeral: true
            })

            client.channels.cache.get('1096089398023553054').send({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${member.user.tag} | ID: ${member.id}`,
                        iconURL: member.user.avatarURL()
                    })
                    .setDescription(`${settings.emotes.check} ${member} registered farm level **${farmLevel}**`)
                ]
            })
        }

        //Create Profile
        async function createFile(farmLevel){
            let userTemplate = JSON.parse(fs.readFileSync(`./database/userTemplate.json`))
            userTemplate.details.discordID = member.id
            userTemplate.details.discordTag = member.user.tag
            userTemplate.farm_level = farmLevel
            fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
        }
    }
}