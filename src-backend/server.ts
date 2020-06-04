import http from "http"
import url from "url"
import fileServer from "./file-server"
import apiServer from "./api-server"

let apiPath = '/api/'

const codegenServer = http.createServer((req, res) => {
    let requestUrl = url.parse(<string>req.url)
    let data = ''

    // build body data
    req.on('data', (chunk) => {
        data += chunk
    })

    // end request
    req.on('end', () => {
        if (requestUrl.path?.startsWith(apiPath)) {
            apiServer.request(req,res,data)
        }
        else {
            fileServer.request(req,res)
        }
    })
    
})

export default codegenServer
