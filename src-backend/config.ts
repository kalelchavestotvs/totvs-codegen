import fs from "fs"
import path from "path"

interface IConfig { ready:boolean, outputPath?:string, sharedPath?:string }

let dataDirectory = path.join(__dirname, 'data')
let configFile = path.join(dataDirectory, 'config.json')

let configData:IConfig = { ready: false }

function loadConfigFile() {
    if (!configData.ready) {
        let bfData = fs.readFileSync(configFile).toString()
        configData = JSON.parse(bfData)
        configData.ready = true
    }
}

var config = {
    outputPath: () => {
        loadConfigFile()
        return configData.outputPath || ''
    },
    sharedPath: () => {
        loadConfigFile()
        return configData.sharedPath || configData.outputPath || ''
    }
}

export default config