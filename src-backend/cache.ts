import fs from "fs"
import path from "path"
import { IApplication } from 'model'

interface IConfig { ready:boolean, outputPath?:string, sharedPath?:string }

let dataDirectory = path.join(__dirname, 'data')
let appDirectory = path.join(dataDirectory, 'application')

let cacheApps: IApplication[]

function loadAppData(fileName:string): IApplication {
    let fname = path.join(fileName)
    let txt = fs.readFileSync(fname).toString()
    return JSON.parse(txt)
}

function dirScan(inputFolder:string): IApplication[] {
    let result: IApplication[] = []
    fs.readdirSync(inputFolder, { withFileTypes: true }).forEach(item => {
        if (item.isFile()) {
            let f = loadAppData(path.join(inputFolder,item.name))
            if (f) {
                result[f.name] = f
                console.log(`Add ${f.name}`)
            }
        }
    })
    return result
}

function refreshCacheApps() {
    console.log('Refresh cache applications')
    cacheApps = dirScan(appDirectory)
}

const cache = {
    applications: () => {
        if (!cacheApps)
            refreshCacheApps()
        return Object.values(cacheApps)
    },
    application: (name) => {
        if (!cacheApps)
            refreshCacheApps()
        return cacheApps[name]
    },
    reset: () => {
        console.log('Cache reset')
        cacheApps = null
    }
}

export default cache