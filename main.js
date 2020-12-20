const Discord = require('discord.js');
const client = new Discord.Client();
const collection = new Discord.Collection();
const prefix = '-mn-';
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () =>{
    console.log('MovieNightBot is on!');
});

client.on('message',  async message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if(command === 'hello'){
        await client.commands.get('hello').execute(message, args);
    } else if (command === 'userinfo'){
        await client.commands.get('userInfo').execute(message, args);
    } else if (command === 'dm'){
        await client.commands.get('dm').execute(message, args);
    } else if (command === 'help'){
        await client.commands.get('help').execute(client, message, args);
    }
});

client.login('NzgyMjQ0MjA1OTc5NzYyNjk4.X8JXsA.jTz_NWJ_f327OiQAW4r2CSqIpPU');

