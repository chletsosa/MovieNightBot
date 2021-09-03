const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'help',
    description: "Sends a list of all commands, or information about a specific command.",
    aliases: ['commands'],
    usage: '-mn-help, -mn-help [command name]',
    execute(message, args){
        const data = [];
        const { commands } = message.client;
        
        const name = args[0];
        const command = commands.get(name);


        if (!args.length) {
            const embed = new MessageEmbed()
                .setTitle("Movie Night Command List:")
                .setDescription(commands.map(command => command.name).join("\n"))
                .setFooter(`For descriptions on specific commands type \`-mn-help [command name]\`.`);    

                message.channel.send(embed);
        } else if (!command) {
            const embed = new MessageEmbed()
                .setTitle("Woops!")
                .setDescription('Looks like you tried to look up a command and either misspelled it, or the command doesn\'t exist. Type in \`-mn-help\` for a list of valid commands.')
                .setFooter("Keep trying buddy!");

            message.channel.send(embed);
        } else {
            const embed = new MessageEmbed()
                .setTitle(command.name)
                .setDescription(`**> Description: **${command.description}
                    **> Usage: **${command.usage}`)
                .setFooter("Hope this helps! :)");

            message.channel.send(embed);
        }
        
        
    }
}