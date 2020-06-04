import * as path from "path"

let nodeService = require('node-windows').Service

let appService = new nodeService({
    name: 'TOTVS CodeGen',
    description: 'TOTVS Healthcare Code Generation',
    script: path.join(__dirname,'entry.js'),
    env: [
        { name: "PORT", value: 9301 }
    ]
})
appService.on('install', function () {
    console.log('Install complete.');
    appService.start()
})
appService.install();
