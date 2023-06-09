//Import Modules
const { MessageEmbed } = require("discord.js");
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if(!interaction.isButton()) return
    if(!customId.startsWith('view')) return

    //Read File
    let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
    let msg = ''

    if(Object.keys(userFile.cart).length === 0) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} Calculater has nothing to show, Its empty`)
        ],
        ephemeral: true
    })

    let options = []

    for(let product in userFile.cart){
        if(settings.cost_exclusions.includes(product)){
            msg += `- **${nwc(userFile.cart[product][0])}**x **${cap(product)}** [**${nwc(userFile.cart[product][1])} per piece**]\n`
            options.push({
                label: `${nwc(userFile.cart[product][0])}x ${cap(product)}`,
                value: `${product}-${userFile.cart[product][0]}-${userFile.cart[product][1]}`
            })
        }else{
            msg += `- **${nwc(userFile.cart[product][0])}**x **${cap(product)}** [**x${nwc(userFile.cart[product][1])} MP**]\n`
            options.push({
                label: `${nwc(userFile.cart[product][0])}x ${cap(product)}`,
                value: `${product}-${userFile.cart[product][0]}-${userFile.cart[product][1]}`
            })
        }
    }



    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Your total products in the calculator:\n\n${msg}`)
            .setTimestamp()
            .setFooter({
                text: `Select the items from the menu to remove them from calculator`,
                iconURL: guild.iconURL()
            })
        ],
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId(`cartRemove`)
                .setPlaceholder('Choose the product to remove/edit')
                .addOptions(options)
            ),
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId(`calculate`)
                .setLabel('Calculate')
                .setEmoji('⌨️')
                .setStyle('SUCCESS')
            )
        ],
        ephemeral: true
    })

    client.channels.cache.get('1096091742228463749').send({
        embeds: [
            new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({
                name: `${member.user.tag} | ID: ${member.id}`,
                iconURL: member.user.avatarURL()
            })
            .setDescription(`${settings.emotes.check} ${member} viewed their calculator. Cart details mentioned below\n\n${msg}`)
        ]
    })

}