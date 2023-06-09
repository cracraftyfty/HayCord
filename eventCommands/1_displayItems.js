//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if(!interaction.isSelectMenu()) return
    if(!customId.startsWith('factory')) return
    
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
        //fetch input
        let name = interaction.values[0].split('-')[1].split('_').join(' ')
        
        //read factories file
        let itemFile = JSON.parse(fs.readFileSync(`./database/factories.json`))
        let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

        let embed = new MessageEmbed()
        .setTitle(`HayDay | ${cap(name)}`)
        .setColor('GREEN')
        .setThumbnail(guild.iconURL())
        .setURL(ee.footericon)
        .setAuthor({
            name: `Made By: Craft#6739`
        })
        .setTimestamp()
        if(input === 'level_unregistered'){
            embed.setDescription(`Select the product from the menu below\nNOTE: Your hayday level is not registered, please register your level using /register and then the menu below will only show the products you can access\n\nNumbers in the square brackets [x] represents the quantity of product stored in the calculator, Please reset the calculator if you want to start afresh`)
            embed.setFooter({text: `Register your level using /register`, iconURL: ee.footericon})
        }else{
            embed.setDescription(`Select the product from the menu below.\nSince your level is registered (lvl ${userFile.farm_level}) only the products that you have access to are available in the menu/s below\n\nNumbers in the square brackets [x] represents the quantity of product stored in the calculator, Please reset the calculator if you want to start afresh`)
            embed.setFooter({
                text: ee.footertext,
                iconURL: ee.footericon
            })
        }


        //Process Components here
        let comps = []
        let options = []
        let keys = []

        if(input === 'level_registered'){
            for(let product in itemFile[name].items){
                if(itemFile[name].items[product].level <= userFile.farm_level){
                    keys.push(product)
                }
            }
        }else keys = Object.keys(itemFile[name].items)

        let count = 0
        let totalCount = 0

        keys.forEach(product => {
            count++
            totalCount++
            if(count >= 25) {
                comps.push(
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId(`product-${member.id}-${totalCount}`)
                            .setPlaceholder('Choose the product from menu below')
                            .addOptions(options)
                        //options
                    )
                )
                count = 0
                options = []
            }else{
                if(userFile.cart.hasOwnProperty(product)){
                    options.push({
                        label: `[${nwc(userFile.cart[product][0])}x] ${cap(product)}`,
                        description: `Max Sales Price: ${nwc(itemFile[name].items[product].price_to_sell*userFile.cart[product][0])} coins`,
                        value: `product-${product.split(' ').join('_')}`
                    })
                }else{
                    options.push({
                        label: `[0x] ${cap(product)}`,
                        description: `Max Sales Price: ${nwc(itemFile[name].items[product].price_to_sell)} coins`,
                        value: `product-${product.split(' ').join('_')}`
                    })
                }
            }
            if(totalCount === keys.length) comps.push(
                new Discord.MessageActionRow()
                .addComponents(
                    //options
                    new Discord.MessageSelectMenu()
                    .setCustomId(`product-${member.id}-${totalCount}`)
                    .setPlaceholder('Choose the product from menu below')
                    .addOptions(options)
                )
            )
        })

        //Log
        client.channels.cache.get('1096072065934708806').send({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({
                    name: `${member.user.tag} | ID: ${member.id}`,
                    iconURL: member.user.avatarURL()
                })
                .setDescription(`${settings.emotes.check} ${member} selected the factory **${cap(name)}**`)
            ]
        })
        
        interaction.reply({
            embeds: [embed],
            components: comps,
            ephemeral: true
        })
    }
}