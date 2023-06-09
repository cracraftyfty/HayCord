//Import Modules
const { MessageEmbed } = require("discord.js");
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if(!customId.startsWith('productAdjust')) return
    
    let qty = parseInt(interaction.fields.getTextInputValue(`${member.id}-1`))
    let multiplier = parseInt(interaction.fields.getTextInputValue(`${member.id}-2`))


    let product = customId.split('-')[1]
    let currentQty = customId.split('-')[2]

    if(isNaN(qty) || qty < 0) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} Quantity should be a positive integer`)
        ],
        ephemeral: true
    })

    if(isNaN(multiplier) || multiplier < 0) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} Multiplier should be a positive integer`)
        ],
        ephemeral: true
    })

    //readFile
    let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

    if(userFile.cart.hasOwnProperty(product)){
        
        userFile.cart[product][0] = qty
        userFile.cart[product][1] = multiplier

        if(qty === 0) delete userFile.cart[product]
        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userFile, null, 4))

        interaction.update({
            embeds: [
                new MessageEmbed()
                .setColor('BLUE')
                .setDescription(`${settings.emotes.check} Adjusted quantity for **${cap(product)}** from **${nwc(currentQty)}** to **${nwc(qty)}** with **${nwc(multiplier)}x** Multiplier`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`useless-1`)
                    .setLabel(`Adjust Successful`)
                    .setEmoji(settings.emotes.check)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
                )
            ]
        })

        client.channels.cache.get('1096086199594131567').send({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({
                    name: `${member.user.tag} | ID: ${member.id}`,
                    iconURL: member.user.avatarURL()
                })
                .setDescription(`${settings.emotes.check} ${member} adjusted quantity of **${cap(product)}** from **${nwc(currentQty)}** -> **${nwc(qty)}**`)
            ]
        })
        
    }else{
        interaction.update({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.warn} You do not have any **${cap(product)}** stored in the calculator`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`usSFSFDFeless-1`)
                    .setLabel(`Item Dont Exist`)
                    .setEmoji(settings.emotes.warn)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
                )
            ]
        })
    }
}