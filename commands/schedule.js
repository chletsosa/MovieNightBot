const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { insertDB } = require('../functions/sqlCommands.js');

module.exports = {
    name: 'schedule',
    description: "Directly messages a user to collect relevant data for a Movie Night",
    usage: "-mn-schedule",
    async execute(message, args){
        await message.author.createDM();
        const hostDM = message.author.dmChannel;
        const filter = m => m.author.id === message.author.id;
        var movie;
        var date;
        var day;
        var month;
        var monthN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var year;
        var time;
        var timeArray;
        var timeZone;
        var sql = "INSERT INTO movie_night (host_user, movie_title, movie_date, movie_time, timezone) VALUES (?)";
        let collected;

        await hostDM.send('Hello! Thank you for hosting a movie night for your friends to enjoy! Before we do this though Im going to need to ask you a few questions.\n' + 
                          'If at any point you decide that you no longer want to host a movie night, just type "CANCEL".\n' + 
                          'First things first! What movie would you like to watch?');


        try {

            collected = await hostDM.awaitMessages(filter, {max: 1, time: 300000, errors: ["time"]})
        
            if (collected.first().content == 'CANCEL') {
                return hostDM.send('Okay, maybe some other time. I hope you have a nice day!');
            } else {
                movie = collected.first().content;  
            }

            hostDM.send('Good pick! Now, on what day would you like to host this movie? Please enter it in a \'mm/dd/yyyy\' format. (I dont care if you dont like it, we are doing it this way.:slight_smile:)');
            collected = await hostDM.awaitMessages(filter, {max: 1, time: 300000, errors: ["time"]})
    
            if (collected.first().content == 'CANCEL') {
                return hostDM.send('Okay, maybe some other time. I hope you have a nice day!');
            } else if (collected.first().content.toLowerCase() == 'today') {
                date = new Date();
                day = String(date.getDate());
                month = String(date.getMonth());
                year = date.getFullYear();
            } else if (collected.first().content.toLowerCase() == 'tomorrow') {
                date = new Date();
                day = String(date.getDate() + 1);
                month = String(date.getMonth());
                year = date.getFullYear();
            } else {
                date = collected.first().content.split('/');
                day = date[1];
                month = date[0];
                year = date[2];
            }        
            date = month + '-' + day + '-' + year;

            hostDM.send('Sounds good! Now what time would you like to watch it? Please specify AM or PM if you are not on a 24 hour time scale. (Example: 8:00PM)');
            collected = await hostDM.awaitMessages(filter, {max:1, time:300000, errors: ["time"]})

            if (collected.first().content == 'CANCEL') {
                return hostDM.send('Okay, maybe some other time. I hope you have a nice day!');
            } else {
                time = collected.first().content;
            }

            hostDM.send('Awesome! Now just one more question. What time zone are you in? (EST, PST, AEST, GMT etc.)');
            collected = await hostDM.awaitMessages(filter, {max:1, time:300000, errors: ["time"]})

            if (collected.first().content == 'CANCEL') {
                return hostDM.send('Okay, maybe some other time. I hope you have a nice day!');
            } else {
                timeZone = collected.first().content;
            }

            hostDM.send('Alright, your all set! I\'ll put an announcement in the server letting everyone know that you\'ll be watching ' + movie + ' on ' + monthN[Number(month) - 1] + ' ' + day + ', ' + year + ' at ' + time + ' ' + timeZone + '! See you then!');

        }catch (err) {
            console.error(err);
            return hostDM.send('You have run out of time. Please use the schedule command again to try again!');
        }

        let announcement = new MessageEmbed()
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle(message.author.username + ' is hosting a movie night!')
                .setColor(message.author.displayHexColor === '#000000' ? '#ffffff' : message.author.displayHexColor)
                .addField('Movie Night Information:', stripIndents`**> Movie:** ${movie}
                **> Date:** ${monthN[Number(month) - 1] + ' ' + day + ', ' + year}
                **> Time:** ${time + ' ' + timeZone}`, true)

        message.channel.send(announcement);
       
        date = year + '-' + month + '-' + day;
        if(time.endsWith("AM")){
            time = time.slice(0, -2);
        } else if (time.endsWith("PM")) {
            time = time.slice(0, -2);
            timeArray = time.split(":");
            timeArray[0] = parseInt(timeArray[0]) + 12;
            time = timeArray[0] + ":" + timeArray[1];
        }

        var values = [message.author.username, movie, date, time, timeZone];
        return insertDB(sql, [values]);
    

    }
}
//Todo: Implement imdb API to search for and gather information on specific movie.
//Todo: Add comments to explain what each segment of code does (cause Lord knows I wont remember what it does in a week.).