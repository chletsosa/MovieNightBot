const Discord = require('discord.js');
const fs = require('fs');
const {connectDB} = require('./functions/sqlCommands');
const { PREFIX, DISCORD_TOKEN} = process.env;

const client = new Discord.Client();
const collection = new Discord.Collection();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name.toLowerCase(), command);
}

client.once('ready', () =>{
    console.log('MovieNightBot is now on!');
});

connectDB();

client.on('message', message =>{

    if(!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).split(' ');
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Woops! An error occured while trying to execute this command!')
    }

});

client.login(DISCORD_TOKEN);

