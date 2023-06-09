//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const fs = require('fs');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if(!interaction.isButton()) return
    if(!customId.startsWith('calculate')) return

    //Fetch Entry
    /* let multiplier = parseInt(interaction.fields.getTextInputValue(member.id))

    if(isNaN(multiplier) || multiplier < 1) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} Multiplier should be a positive integer greater than 0`)
        ],
        ephemeral: true
    }) */

    //read file
    let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
    let itemFile = JSON.parse(fs.readFileSync(`./database/factories.json`))

    if(Object.keys(userFile.cart).length === 0) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} Calculator is empty, please add products to calculator using the menus`)
        ],
        ephemeral: true
    })

    let msg = ''
    let cost = {
        "blanket": 1098,
        "rings": 824,
        "bacon and eggs": 201,
        "wooly chaps": 309
    }

    let cartProducts = {}
    let total_max_sales_price = 0
    for(let product in userFile.cart){
        for(let factories in itemFile){
            for(let item in itemFile[factories].items){
                if(item === product){
                    if(settings.cost_exclusions.includes(item)){                   
                        total_max_sales_price += userFile.cart[product][0]*userFile.cart[product][1]
                        cartProducts[product] = userFile.cart[product][0]*userFile.cart[product][1]
                    }else{    
                        total_max_sales_price += (itemFile[factories].items[item].price_to_sell*userFile.cart[product][0])*userFile.cart[product][1]
                        cartProducts[product] = (itemFile[factories].items[item].price_to_sell*userFile.cart[product][0])*userFile.cart[product][1]
                    }
                    //console.log(`${product.toUpperCase()} [${nwc(itemFile[factories].items[item].price_to_sell*userFile.cart[product])}] found in ${factories.toUpperCase()}`)
                }
            }
        }
    }

    //return console.log(cartProducts)

    for(let products in cartProducts){
        //console.log(`Max Price: ${Math.floor(cartProducts[products]/cost.rings)} <:Diamond_Ring:1095759822886023250> | 1x Ring: ${cartProducts[products]%cost.rings} <:Coins:1095759818461040811>`, cartProducts[products])
        if(settings.cost_exclusions.includes(products)){
            msg += `- [**${nwc(userFile.cart[products][1])} each**] ${nwc(userFile.cart[products][0])}x ${cap(products)} **[**${nwc(cartProducts[products])} <:Coins:1095759818461040811> **|** ${nwc((cartProducts[products]/cost.rings).toFixed(2))} <:Diamond_Ring:1095759822886023250> **|** ${nwc((cartProducts[products]/cost.blanket).toFixed(2))} <:Blanket:1095759816028336160>\n`
        }else{
            msg += `- [**x${nwc(userFile.cart[products][1])} MP**] ${nwc(userFile.cart[products][0])}x ${cap(products)} **[**${nwc(cartProducts[products])} <:Coins:1095759818461040811> **|** ${nwc((cartProducts[products]/cost.rings).toFixed(2))} <:Diamond_Ring:1095759822886023250> **|** ${nwc((cartProducts[products]/cost.blanket).toFixed(2))} <:Blanket:1095759816028336160>**]**\n`
        }
    }

    msg += `\n\nTotal Price: **${nwc(total_max_sales_price)}** <:Coins:1095759818461040811>\n<:Bacon_and_Eggs:1096006493372948530> Needed: ${nwc(Math.ceil((total_max_sales_price)/cost["bacon and eggs"]))} <:Bacon_and_Eggs:1096006493372948530> **[**MP ${nwc(Math.floor((total_max_sales_price)/cost["bacon and eggs"]))} <:Bacon_and_Eggs:1096006493372948530> **|** 1x <:Bacon_and_Eggs:1096006493372948530> at ${nwc((total_max_sales_price)%cost["bacon and eggs"])} <:Coins:1095759818461040811>**]**\n<:Wooly_Chaps:1096006497965723729> Needed: ${nwc(Math.ceil((total_max_sales_price)/cost["wooly chaps"]))} <:Wooly_Chaps:1096006497965723729> **[**MP ${nwc(Math.floor((total_max_sales_price)/cost["wooly chaps"]))} <:Wooly_Chaps:1096006497965723729> **|** 1x <:Wooly_Chaps:1096006497965723729> at ${nwc((total_max_sales_price)%cost["wooly chaps"])} <:Coins:1095759818461040811>**]**\n<:Diamond_Ring:1095759822886023250> Needed: ${nwc(Math.ceil((total_max_sales_price)/cost.rings))} <:Diamond_Ring:1095759822886023250> **[**MP ${nwc(Math.floor((total_max_sales_price)/cost.rings))} <:Diamond_Ring:1095759822886023250> **|** 1x <:Diamond_Ring:1095759822886023250> at ${nwc((total_max_sales_price)%cost.rings)} <:Coins:1095759818461040811>**]**\n<:Blanket:1095759816028336160> Needed:  ${nwc(Math.ceil((total_max_sales_price)/cost.blanket))} <:Blanket:1095759816028336160> **[**MP ${nwc(Math.floor((total_max_sales_price)/cost.blanket))} <:Blanket:1095759816028336160> **|** 1x <:Blanket:1095759816028336160> at ${nwc((total_max_sales_price)%cost.blanket)} <:Coins:1095759818461040811>**]**`

    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setTitle('HayCord | Calculator')
            .setThumbnail(ee.footericon)
            .setURL(ee.footericon)
            .setDescription(msg)
            .setTimestamp()
            .setFooter({
                text: `Rings and Blankets are calculated Max Price after the respective Multipliers`,
                iconURL: ee.footericon
            })
        ],
        ephemeral: true
    })

    client.channels.cache.get('1096095010191069274').send({
        embeds: [
            new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({
                name: `${member.user.tag} | ID: ${member.id}`,
                iconURL: member.user.avatarURL()
            })
            .setDescription(`${settings.emotes.check} ${member}'s Calculator results\n\n${msg}`)
        ]
    })

    //${nwc(multiplier)}x MP: **${nwc(total_max_sales_price*multiplier)}** <:Coins:1095759818461040811>
}