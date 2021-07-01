console.log("env", process.env.DISCORD_TOKEN);
const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');
const { PREFIX, DISCORD_TOKEN, HOST, PORT, USER, PASSWORD, DATABASE} = process.env;

const client = new Discord.Client();
const collection = new Discord.Collection();
const connection = mysql.createConnection({
    host : HOST,
    port : PORT,
    user : USER,
    password : PASSWORD,
    database : DATABASE
})

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name.toLowerCase(), command);
}

client.once('ready', () =>{
    console.log('MovieNightBot is now on!');
});

connection.connect(err => {
    if (err) console.log(err);
    console.log('Logged into database!');
});

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

