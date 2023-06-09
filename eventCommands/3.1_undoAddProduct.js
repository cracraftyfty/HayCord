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
    if(!customId.startsWith('remove')) return

    //Read userfile
    let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

    let qty = customId.split('-')[2]
    let product = customId.split('-')[1]

    if(userFile.cart.hasOwnProperty(product)){
        if(userFile.cart[product][0] >= qty){
            userFile.cart[product][0] -= qty
            if(userFile.cart[product][0] === 0) delete userFile.cart[product]
            fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userFile, null, 4))

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`${settings.emotes.check} **${nwc(qty)}x ${cap(product)}** removed from calculator`)
                ],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`uselessdfdsf-1`)
                        .setLabel(`Undo Successful`)
                        .setEmoji(settings.emotes.check)
                        .setStyle('SECONDARY')
                        .setDisabled(true),
                        new Discord.MessageButton()
                        .setCustomId(`calculate`)
                        .setLabel('Calculate')
                        .setEmoji('⌨️')
                        .setStyle('SUCCESS')
                    )
                ]
            })
            client.channels.cache.get('1096084135824592937').send({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${member.user.tag} | ID: ${member.id}`,
                        iconURL: member.user.avatarURL()
                    })
                    .setDescription(`${settings.emotes.check} ${member} performed an UNDO function, Removed: **${qty}x ${cap(product)}**`)
                ]
            })
        }else{
            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${settings.emotes.warn} You do not have enough **${cap(product)}** stored in the calculator. Stored Amount: **${userFile.cart[product][0]}x ${product} [x${userFile.cart[product][1]} MP]**`)
                ],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`useleFSFss-1`)
                        .setLabel(`Not Enough Quantity`)
                        .setEmoji(settings.emotes.warn)
                        .setStyle('SECONDARY')
                        .setDisabled(true)
                    )
                ]
            })
        }
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
                    .setCustomId(`uASDAseless-1`)
                    .setLabel(`Item Dont Exist`)
                    .setEmoji(settings.emotes.warn)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
                )
            ]
        })
    }
}