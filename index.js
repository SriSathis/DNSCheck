const express = require('express')
const cors = require('cors')
const os = require('os')
const nocache = require('nocache')
const roundTo = require('round-to');

require('dotenv').config()

let app = express()
app.use(cors())
app.use(nocache())

const Client = require('node-rest-client').Client;

let client = new Client();


app.set('port', (process.env.PORT || 5000))

app.get('/', (request, response) => {
    response.send('Hello World!')
})

app.get('/podinfo', (request, response) => {
    let data = {
        'Pod Host': os.hostname(),
        'Pod uptime': os.uptime() + ' secs',
        'Pod CPU load': os.loadavg(),
        'Pod Total Memory': roundTo(os.totalmem() / (1024 * 1024 * 1024), 2) + ' GB',
        'Pod Free Memory': roundTo(os.freemem() / (1024 * 1024 * 1024), 2) + ' GB',
        'Pod CPU Count': os.cpus().length
    }
    response.send(data)
})

app.get('/route1', (request, response) => {
    let data = {
        'Hit route': 'route1',
        'Pod Host': os.hostname(),
        'Pod uptime': os.uptime() + ' secs',
        'Pod CPU load': os.loadavg(),
        'Pod Total Memory': roundTo(os.totalmem() / (1024 * 1024 * 1024), 2) + ' GB',
        'Pod Free Memory': roundTo(os.freemem() / (1024 * 1024 * 1024), 2) + ' GB',
        'Pod CPU Count': os.cpus().length
    }
    response.send(data)
})

app.get('/crossapi', (request, response) => {
    if (process.env.CROSS_API_URL) {
        client.get(process.env.CROSS_API_URL, (data, res) => {
            response.send(data)
        });
    }
    else {
        response.send("Cross API URL Not Defined")
    }
})

app.get('/route2', (request, response) => {
    let data = {
        'Hit route': 'route2',
        'Pod Host': os.hostname(),
        'Pod Uptime': os.uptime() + ' secs',
        'Pod CPU load': os.loadavg(),
        'Pod Total Memory': roundTo(os.totalmem() / (1024 * 1024 * 1024), 2) + ' GB',
        'Pod Free Memory': roundTo(os.freemem() / (1024 * 1024 * 1024), 2) + ' GB',
        'Pod CPU Count': os.cpus().length
    }
    response.send(data)
})

app.get('/crasher', (request, response) => {
    process.nextTick(()=> {
        throw new Error;
    });
})

app.listen(app.get('port'), '0.0.0.0', () =>{
    console.log("Node app is running at 0.0.0.0:" + app.get('port'))
})