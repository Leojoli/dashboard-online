const fs = require('fs')
var con = require('./db.js')

const servicos = () => {
    con.query(
        'SELECT * FROM services',
        function(err, results, fields) {
            console.log(results);
            fs.writeFileSync("C:/Users/war_l/Documents/Goon/ONLINETELECOM/ChartOlineTelecom/servicos.json", JSON.stringify(results), function(err) {
                if (err) throw err;
                console.log("Saved!");
                con.end(); // close connection outside the callbacks
            });
        }
    );
}

function services() {
    setInterval(() => {
        console.log("timer");
        servicos()
    }, 100000);
}

services()