import * as path from "path"

let nodeService = require('node-windows').Service
let appService = new nodeService({
    name: 'TOTVS CodeGen',
    description: 'TOTVS Healthcare Code Generation',
    script: path.join(__dirname,'entry.js')
})
appService.on('uninstall', function () {
    console.log('Uninstall complete.')
})
appService.uninstall()