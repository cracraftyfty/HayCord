//here the event starts
const config = require(`../../botconfig/config.json`);
module.exports = (client, id) => {
    console.log(`[${config.console_tag}] || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Shard #${id} Reconnecting || <==> ||`)
}