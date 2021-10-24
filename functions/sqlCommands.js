const {HOST, PORT, USER, PASSWORD, DATABASE} = process.env;
const mysql = require('mysql');
const connection = mysql.createConnection({
    host : HOST,
    port : PORT,
    user : USER,
    password : PASSWORD,
    database : DATABASE
})
module.exports = {
    connectDB: function() {
        connection.connect(err => {
            if (err) console.log(err);
            console.log('Logged into database!');
        });
    },
    insertMN: function([values]) {
        connection.query("INSERT INTO movie_night (movie_id, host_user, movie_title, movie_date, movie_time, timezone) VALUES (?)", [values], err => {
            if(err) console.log(err);
            console.log("Movie Night has been scheduled!");
        });
    },
    checkMovieNightID: function(value) {
        connection.query("SELECT * FROM movie_night WHERE movie_id=?", value, err => {
            if(err) console.log(err);
            console.log("Found Movie Night ID!");
        });
    },
    getDateOfMovieNight: function(value) {
        connection.query("SELECT movie_date FROM movie_night WHERE movie_id=?", value, err => {
            if(err) console.log(err);
            console.log("Found date of given movie night!");
        });
    },
    insertAttendance: function([values]) {
        connection.query("INSERT INTO attendence (username, movie_id) VALUES (?)", [values], err => {
            if(err) console.log(err);
            console.log("Added user to Attendee list!");
        });
    },
    removeAttendance: function(username, movie_id) {
        connection.query("DELETE FROM attendence WHERE username = '" + username + "' AND movie_id = " + movie_id +";", err => {
            if(err) console.log(err);
            console.log("Removed user from Attendee list!");
        });
    }
}