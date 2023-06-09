//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const fs = require('fs');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if(!interaction.isButton()) return
    if(!customId.startsWith('reset')) return

    //console.log(interaction.message.components[interaction.message.components.length-1])

    //read file
    let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
    userFile.cart = {}

    fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userFile, null, 4))

    
    /* interaction.message.components[interaction.message.components.length-1] =  new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId(`calculate`)
            .setLabel('Calculate')
            .setEmoji('⌨️')
            .setStyle('SUCCESS'),
        new Discord.MessageButton()
            .setCustomId('reset')
            .setLabel('Reset Done')
            .setEmoji('♻️')
            .setStyle('DANGER')
            .setDisabled(true),
        new Discord.MessageButton()
            .setCustomId('view')
            .setLabel('View Calculator')
            .setEmoji('🔍')
            .setStyle('SECONDARY')
    ) */

    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${settings.emotes.check} Calculator reset done.`)
        ],
        ephemeral: true
    })

    client.channels.cache.get('1096089690752430181').send({
        embeds: [
            new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({
                name: `${member.user.tag} | ID: ${member.id}`,
                iconURL: member.user.avatarURL()
            })
            .setDescription(`${settings.emotes.check} ${member} reset their calculator`)
        ]
    })
}