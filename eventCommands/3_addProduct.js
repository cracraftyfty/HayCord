//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if(!customId.startsWith('productAdd')) return

    let qty = parseInt(interaction.fields.getTextInputValue(`${member.id}-1`))
    let multiplier = parseInt(interaction.fields.getTextInputValue(`${member.id}-2`))

    let productName = customId.split('-')[1].split('_').join(' ')
    
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

    //Read file
    let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
    if(userFile.cart.hasOwnProperty(productName)) userFile.cart[productName] =  [qty, multiplier]
    else userFile.cart[productName] = [qty, multiplier]

    fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userFile, null, 4))

    

    //Log
    if(settings.cost_exclusions.includes(productName)){
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} **${nwc(qty)}x ${cap(productName)}** with **x${multiplier}** multiplier added to calculator. [Total: **${nwc(userFile.cart[productName][0])}x ${cap(productName)}** [**${nwc(userFile.cart[productName][1])} per piece**]  in calculator]`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`calculate`)
                        .setLabel('Calculate')
                        .setEmoji('⌨️')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId(`remove-${productName}-${qty}`)
                        .setLabel(`Undo Action`)
                        .setEmoji(settings.emotes.warn)
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId(`adjust-${productName}-${qty}-${multiplier}`)
                        .setLabel(`Adjust Quantity`)
                        .setEmoji(settings.emotes.loading)
                        .setStyle('PRIMARY')
                )
            ],
            ephemeral: true
        })

        client.channels.cache.get('1096077235959640145').send({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({
                    name: `${member.user.tag} | ID: ${member.id}`,
                    iconURL: member.user.avatarURL()
                })
                .setDescription(`${settings.emotes.check} ${member} added **${nwc(qty)}x ${cap(productName)}** with price per piece of **${nwc(multiplier)} <:Coins:1095759818461040811>**`)
            ]
        })
    }else{
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} **${nwc(qty)}x ${cap(productName)}** with **x${multiplier}** multiplier added to calculator. [Total: **${nwc(userFile.cart[productName][0])}x ${cap(productName)}** [**x${nwc(userFile.cart[productName][1])} MP**]  in calculator]`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`remove-${productName}-${qty}`)
                        .setLabel(`Undo Action`)
                        .setEmoji(settings.emotes.warn)
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId(`adjust-${productName}-${qty}-${multiplier}`)
                        .setLabel(`Adjust Quantity`)
                        .setEmoji(settings.emotes.loading)
                        .setStyle('PRIMARY')
                )
            ],
            ephemeral: true
        })

        client.channels.cache.get('1096077235959640145').send({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({
                    name: `${member.user.tag} | ID: ${member.id}`,
                    iconURL: member.user.avatarURL()
                })
                .setDescription(`${settings.emotes.check} ${member} added **${nwc(qty)}x ${cap(productName)}** with a multiplier **${multiplier}x MP**`)
            ]
        })
    }
}