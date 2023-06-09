//Import Modules
const settings = require('../database/settings.json');
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if(!interaction.isSelectMenu()) return
    if(!customId.startsWith('cartRemove')) return

    let product = interaction.values[0].split('-')[0]
    let currentQty = parseInt(interaction.values[0].split('-')[1])

    if(settings.cost_exclusions.includes(product)){
        comps = [
            new TextInputComponent()
                .setCustomId(`${member.id}-1`)
                .setLabel("Quantity")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(10)
                .setPlaceholder(`Enter the quantity of ${product}`)
                .setRequired(true),
            new TextInputComponent()
                .setCustomId(`${member.id}-2`)
                .setLabel("Price per Piece")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(20)
                .setPlaceholder(`Enter the price per piece for${product}`)
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
                .setPlaceholder(`Enter the quantity of ${product}`)
                .setRequired(true),
            new TextInputComponent()
                .setCustomId(`${member.id}-2`)
                .setLabel("Multiplier")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(10)
                .setPlaceholder(`Enter the price multiplier for${product}`)
                .setRequired(true)
        ]
    }

    discordModals(client);
    const modal = new Modal() 
    .setCustomId(`calculatorAdjust-${product}-${currentQty}`)
    .setTitle(`HayCord | Calculator`)
    .addComponents(comps);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        interaction.reply(e.message ? e.message : e);
    })

    //Forwarded to ./eventCommands/3.2.1_AdjustProductProcess.js
}