import codegenServer from "./server"

let serverPort = process.env.PORT || 9301

codegenServer.listen(serverPort, () => {
    console.log(`CodeGen  server is running on ${serverPort}`)
})
