const { formatDate } = require("../functions/dateFormatter.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "userInfo",
    description: "Finds and prints user information (defaults to the user writing the command if no user is given).",
    usage: "-mn-userInfo [user mention]",
    execute(message, args){

        const dude = message.mentions.members.last() || message.member;

        //Member variables
        const joined = formatDate(dude.joinedAt);
        const roles = dude.roles.cache
            .filter(r => r.id !== dude.guild.id)
            .map(r => r)
            .join(", ") || 'none';

        //User variables
        const created = formatDate(dude.user.createdAt);
        console.log(dude.user.avatarURL);
        const embed = new MessageEmbed()
            .setFooter(dude.displayName, dude.user.displayAvatarURL)
            .setThumbnail(dude.user.displayAvatarURL({dynamic: true}))
            .setColor(dude.displayHexColor === '#000000' ? '#ffffff' : dude.displayHexColor)
            .addField('Member information:', stripIndents`**> Display Name:** ${dude.displayName}
                **> Joined server at:** ${joined}
                **> Roles:** ${roles}`, true)
            .addField('User information:', stripIndents`
                **> ID:** ${dude.user.id} 
                **> Username**: ${dude.user.username} 
                **> Tag**: ${dude.user.tag} 
                **> Created at**: ${created}`, true)
            .setTimestamp();

        if (dude.user.presence.game)
            embed.addField('Currently playing', stripIndents`**> Name:** ${dude.user.presence.game.name}`);
            
        message.channel.send(embed);
    }
}