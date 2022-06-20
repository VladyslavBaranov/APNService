
const express = require('express')
const apn = require('apn');
const req = require('express/lib/request');
const mysql = require('mysql')


const app = express();              
const port = 3001;                 

//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.send('Application')
});

app.get('/getusers', (req, res) => {
    var con = mysql.createConnection({
        host: "192.168.1.18",
        port: 3000,
        user: "core",
        password: "",
        database: "App"
    });
      
    con.connect(function(err) {
        if (err) {
            res.sendStatus(404)
        } else {
            con.query("SELECT * FROM User", function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
        }
    });
})

app.post('/usercreate', (req, res) => {
    let username = req.query.username
    let password = req.query.password
    res.send('OK')
})

app.get('/apn', (req, res) => {
    var options = {
        token: {
            key: __dirname + '/AuthKey_MAGRXS4XP8.p8',
            keyId: 'MAGRXS4XP8',
            teamId: '4D5NR7NN6K'
        },
        production: false
    }

    var apnProvider = new apn.Provider(options)

    let token = '5976e609028ed2fa4f844350ec2f35cc004b6f3d5f0e5c5be7ddbe0d23d47bfe'

    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600
    note.badge = 3
    note.sound = 'ping.aiff'
    note.alert = 'You have a new message'
    note.payload = {'messageFrom': 'John Appleseed'}
    note.topic = 'VladyslavB-UK.NotifyTest'

    apnProvider.send(note, token).then( result => {
        console.log(result);
    })

    res.send('OK')
})


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});