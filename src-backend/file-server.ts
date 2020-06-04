import http from "http"
import url from "url"
import fs from "fs"
import path from "path"

let baseDirectory = path.join(__dirname, "frontend")

let contentTypesByExtension: any = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
}

const fileServer = {
    
    request: (req: http.IncomingMessage, res: http.ServerResponse) => {
        try {
            let requestUrl = url.parse(<string>req.url)
            let fsPath = baseDirectory + path.normalize(<string>requestUrl.pathname)

            fs.exists(fsPath, function (exists) {
                if (!exists) {
                    res.writeHead(404, { "Content-Type": "text/plain" })
                    res.write("404 Not Found\n")
                    res.end()
                    return
                }

                if (fs.statSync(fsPath).isDirectory()) fsPath += '/index.html'

                fs.readFile(fsPath, "binary", function (err, file) {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" })
                        res.write(err + "\n")
                        res.end()
                        return
                    }

                    let headers: any = {}
                    let contentType = contentTypesByExtension[path.extname(fsPath)]
                    if (contentType)
                        headers["Content-Type"] = contentType
                    res.writeHead(200, headers)
                    res.write(file, "binary")
                    res.end()
                })
            })
        }
        catch (e) {
            res.writeHead(500)
            res.end()
            console.log(e)
        }
    }
    
}

export default fileServer