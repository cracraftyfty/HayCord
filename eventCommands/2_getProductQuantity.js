//Import Modules
const settings = require('../database/settings.json');
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if(!interaction.isSelectMenu()) return
    if(!customId.startsWith('product')) return
    
    let productName = interaction.values[0].split('-')[1].split('_').join(' ')

    if(settings.cost_exclusions.includes(productName)){
        comps = [
            new TextInputComponent()
                .setCustomId(`${member.id}-1`)
                .setLabel("Quantity")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(10)
                .setPlaceholder(`Enter the quantity of ${productName}`)
                .setRequired(true),
            new TextInputComponent()
                .setCustomId(`${member.id}-2`)  
                .setLabel("Price per Piece")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(20)
                .setPlaceholder(`Enter the price per piece for${productName}`)
                .setRequired(true)
        ]
    }else{
        comps = [
            new TextInputComponent()
                .setCustomId(`${member.id}-1`)
                .setLabel("Quantity")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(10)
                .setPlaceholder(`Enter the quantity of ${productName}`)
                .setRequired(true),
            new TextInputComponent()
                .setCustomId(`${member.id}-2`)
                .setLabel("Multiplier")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(10)
                .setPlaceholder(`Enter the price multiplier for${productName}`)
                .setRequired(true)
        ]
    }

    discordModals(client);
    const modal = new Modal() 
    .setCustomId(`productAdd-${interaction.values[0].split('-')[1]}`)
    .setTitle(`HayCord | Calculator`)
    .addComponents(comps);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        interaction.reply(e.message ? e.message : e);
    })
}