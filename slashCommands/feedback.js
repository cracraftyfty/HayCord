const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
module.exports = {
    name: "feedback",
    description: "Submit your feedback", 
    cooldown: 5,
    memberpermissions: [],
    requiredroles: [], 
    alloweduserids: [],
    options: [],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;

        let comp = [
            new TextInputComponent()
                .setCustomId(`issue`)
                .setLabel("Feedback")
                .setStyle("LONG")
                .setMinLength(1)
                .setMaxLength(2000)
                .setPlaceholder("What is your feedback?")
                .setRequired(true)
        ]

        discordModals(client);
        const modal = new Modal()
        .setCustomId(`feedback_${member.id}`)
        .setTitle('HayCord | Feedback')
        .addComponents(comp);
        await showModal(modal, {
            client: client,
            interaction: interaction
        }).catch(e => {
            interaction.reply(e.message ? e.message : e);
        })
    }
}