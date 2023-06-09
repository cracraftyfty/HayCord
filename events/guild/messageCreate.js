//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const fs = require('fs')
const nwc = require('../../functions/nwc.js');
const cap = require('../../functions/cap.js');
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
module.exports = async (client, message) => {
    if(!message.guild || !message.channel || message.author.bot) return;
    if(message.channel.partial) await message.channel.fetch();
    if(message.partial) await message.fetch();


}
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
