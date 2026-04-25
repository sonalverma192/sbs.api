const http = require('http')
const app = require('./app')

const server = http.createServer(app)

server.listen(3500,()=>{
    console.log("server is runnnningggg.....")
})