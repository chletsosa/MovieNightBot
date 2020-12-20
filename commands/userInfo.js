const { formatDate } = require("../functions.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "userInfo",
    description: "Finds and prints user information.",
    usage: "-mn-userInfo [user mention]",
    async execute(message, args){

        const member = await message.mentions.members.last();

        //Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(", ") || 'none';

        //User variables
        const created = formatDate(member.user.createdAt);
        console.log(member.user.avatarURL);
        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)
            .addField('Member information:', stripIndents`**> Display Name:** ${member.displayName}
                **> Joined at:** ${joined}
                **> Roles:** ${roles}`, true)
            .addField('User information:', stripIndents`
                **> ID:** ${member.user.id} 
                **> Username**: ${member.user.username} 
                **> Tag**: ${member.user.tag} 
                **> Created at**: ${created}`, true)
            .setTimestamp();

        if (member.user.presence.game)
            embed.addField('Currently playing', stripIndents`**> Name:** ${member.user.presence.game.name}`);
            
        message.channel.send('this part works');
        message.channel.send(embed);
    }
}