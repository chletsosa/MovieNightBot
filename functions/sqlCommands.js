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
    insertDB: function(sql, [values]) {
        connection.query(sql, [values], err => {
            if(err) console.log(err);
            console.log("Movie Night has been scheduled!");
        });
    }
}