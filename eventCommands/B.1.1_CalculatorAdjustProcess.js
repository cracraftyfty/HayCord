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
    if(!customId.startsWith('calculatorAdjust')) return
    
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

        if(Object.keys(userFile.cart).length === 0) return interaction.update({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} Calculator is now empty`)
            ],
            components: []
        })
        
        let msg = ''
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

        interaction.update({
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
                )
            ],
            ephemeral: true
        })

        client.channels.cache.get('1096094188866633769').send({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({
                    name: `${member.user.tag} | ID: ${member.id}`,
                    iconURL: member.user.avatarURL()
                })
                .setDescription(`${settings.emotes.check} ${member} adjusted calculator. Changed **${nwc(qty)}x ${cap(product)}**\n\nUpdated Calculator:\n${msg}`)
            ]
        })
        
    }else{
        interaction.update({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} Calculator is now empty`)
            ],
            components: []
        })
    }
}