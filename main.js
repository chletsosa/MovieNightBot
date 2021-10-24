const Discord = require('discord.js');
const fs = require('fs');
const {connectDB, getDateOfMovieNight, insertAttendance, checkMovieNightID, removeAttendance} = require('./functions/sqlCommands');
const {PREFIX, DISCORD_TOKEN} = process.env;

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

client.on('message', async message =>{

   if(!message.content.startsWith(PREFIX) || message.author.bot) {
        return;
    }
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

client.on("messageReactionAdd", async (messageReaction,user) => {
    console.log("We found a reaction!");

    let reactUser = user.username + "#" + user.discriminator;
    if(user.bot === false && messageReaction.emoji.name === '🍿'){
        console.log("Found 🍿 reaction!");
        let values = [reactUser, messageReaction.message.id];
        return insertAttendance([values]);
    } else {
        return console.log("Reaction ignored.");
    }
});

client.on("messageReactionRemove", async (messageReaction,user) => {
    console.log("A reaction was removed!");

    let reactUser = user.username + "#" + user.discriminator;
    if(user.bot === false && messageReaction.emoji.name === '🍿'){
        console.log("Found 🍿 reaction!");
        return removeAttendance(reactUser, messageReaction.message.id);
    } else {
        return console.log("Reaction removal ignored.");
    }
});


client.login(DISCORD_TOKEN);
