var Discord = require(`discord.js`);
const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton
} = require('discord.js')
var config = require(`../../botconfig/config.json`);
var settings = require(`../../botconfig/settings.json`);
var ee = require(`../../botconfig/embed.json`);
const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
    name: "test2",
    category: "Owner",
    aliases: ["changebotavatar", "botavatar", "botprofilepicture", "botpfp"],
    cooldown: 5,
    usage: "changeavatar <Imagelink/Image>",
    description: "Changes the Avatar of the BOT: I SUGGEST YOU TO DO IT LIKE THAT: Type the command in the Chat, attach an Image to the Command (not via link, just add it) press enter",
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        
        message.delete()

        //Verify
        /* await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Melbourne Adventures - Civilian Verification')
                .setDescription('Press the Verify button below and submit your **CITY NAME** and **STEAM NAME** in the bot')
                .setThumbnail(message.guild.iconURL())
                .setURL(ee.footericon)
                .setColor('BLUE')
                .setFooter({text: ee.footertext, iconURL: ee.footericon})
            ], 
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('verify')
                        .setLabel('Verify')
                        .setEmoji('🔖')
                        .setStyle('PRIMARY')
                )
            ]},
        ) */
        
        //Register Details
        /* await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Melbourne Adventures - Staff Registration')
                .setDescription('Press the register button below and submit your **CITY NAME**, **CITY PH NUMBER** and **STEAM NAME** in the bot')
                .setThumbnail(message.guild.iconURL())
                .setURL(ee.footericon)
                .setColor('BLUE')
                .setFooter({text: ee.footertext, iconURL: ee.footericon})
            ], 
            components: [new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('register')
                        .setLabel('Register Details')
                        .setEmoji('🔖')
                        .setStyle('PRIMARY')
                )
            ]},
        ) */

        //Clocker
        /* await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Melbourne Adventures | Time Tracker')
                .setDescription('Press the desired buttons below to perform the certain activity')
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
                .setURL(ee.footericon)
                //.setImage(message.guild.iconURL())
                .setColor('BLUE')
                .setFooter(ee.footertext, ee.footericon)
            ], 
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('on')
                        .setLabel('Clock On')
                        .setEmoji('🟠')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('off')
                        .setLabel('Clock Off')
                        .setEmoji('🔵')
                        .setStyle('DANGER'),
                    new Discord.MessageButton()
                        .setCustomId('profile')
                        .setLabel('Profile')
                        .setEmoji('📃')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('lb')
                        .setLabel('Leaderboard')
                        .setEmoji('📑')
                        .setStyle('SECONDARY')
                ),
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('onleave')
                        .setLabel('Mark On-Leave')
                        .setEmoji('<:slonleave:1008626218054201425>')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('offleave')
                        .setLabel('Mark Off-Leave')
                        .setEmoji('<:sloffleave:1008626215860572221> ')
                        .setStyle('DANGER')
                )
            ]},
        ) */

        //Live Feed
        /* await message.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor('BLUE')
                .setTitle('Melbourne Adventures - Live Feed')
                .setDescription('PLACEHOLDER_MESSAGE')
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
            ]
        }) */

        /* await message.channel.send({
            embeds: [new Discord.MessageEmbed()
            .setTitle('Melbourne Adventures - Civilian Registration')
            .setDescription('Press the register button below and submit your **CITY NAME**, **CITY PH NUMBER** and **STEAM NAME** in the bot')
            .setThumbnail(message.guild.iconURL())
            .setURL(ee.footericon)
            .setColor('BLUE')
            .setFooter({text: ee.footertext, iconURL: ee.footericon})
            ], 
            components: [new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('register')
                        .setLabel('Register Details')
                        .setEmoji('🔖')
                        .setStyle('PRIMARY')
                )
            ]},
        ) */


        //APPLY HERE
        /* await message.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor('BLUE')
                .setTitle('Corrections Victoria - Cell Tracker')
                .setDescription('PLACEHOLDER_MESSAGE')
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
            ]
        }) */

        client.on('interactionCreate', interaction => {
            interaction.reply({content: 'Command in development', ephemeral: true})
        })
    }
}

/* 
new Discord.MessageButton()
    .setCustomId('on')
    .setLabel('Clock on')
    .setEmoji('🟢')
    .setStyle('PRIMARY'),
*/