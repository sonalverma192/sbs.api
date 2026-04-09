const http = require('http')
const app = require('./app')

const server = http.createServer(app)

server.listen(4100,()=>{
    console.log("server is runnnningggg.....")
})