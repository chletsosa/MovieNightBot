const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'dm',
    description: "Directly messages a given user.",
    usage: "-mn-dm [user mention]",
    async execute(message, args){
        const mentioned_member = await message.mentions.members.last();

        mentioned_member.send('https://cdn.discordapp.com/attachments/746557111504207912/789566203609743400/9a2.png');
    }
}