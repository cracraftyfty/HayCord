//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const Discord = require('discord.js');
const moment = require('moment-timezone');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if([`feedback_${member.id}`].includes(customId)){
        
        //let processID = interaction.components[2].components.customId
        //return console.log(customId, interaction.components[2].components.customId)
        let issue = interaction.fields.getTextInputValue(`issue`)
       
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('HayCord | Feedback')
                .setDescription(`${settings.emotes.check} Feedback Registered! Thanks for your input`)
                .setColor('GREEN')
            ], 
            ephemeral: true
        })

        
        log_channel = client.channels.cache.get('1096695916255252480')

        let embed = new Discord.MessageEmbed()
        .setColor(ee.color)
        .setTitle(cap(`HayCord | Feedback`))
        .setDescription(issue)
        .setTimestamp()
        .setFooter({
            text: `From: ${member.user.tag} (ID: ${member.id})`,
            iconURL: ee.footericon
        })
        log_channel.send({
            embeds: [embed]
        })
    }
}