import path from "path"
import fs from "fs"
import config from "./config"
import cache from "./cache"
import { TemplateFile, IApplication } from './model'
import { TemplateParser } from "./parser"

let dataDirectory = path.join(__dirname, 'data')
let templateDirectory = path.join(dataDirectory, 'template')

const fileReplicators = {
    enum: '+[enum]+',
    zoom: '+[zoom]+'
}

function prepareFolder(appName:string,sessionId:string): string {
    let result = path.join(config.outputPath(),sessionId,appName)
    fs.mkdirSync(result, { recursive: true })
    return result
}

function resultFolder(appName:string,sessionId:string): string {
    return path.join(config.sharedPath(),sessionId,appName)
}

function loadAppData(name:string): IApplication {
    return cache.application(name)
}

function buildTemplate(appData:any,outputPath:string,template:string): Promise<boolean> {
    let files = readTemplateDirectory(template,outputPath)
    files = parseFiles(files, appData)

    let fControl: Promise<boolean>[] = []
    files.forEach(f => {
        fControl.push(buildFile(f))
    })
    return Promise.all(fControl).then(res => { return !res.includes(false) })
}

function buildFile(data:TemplateFile): Promise<boolean> {
    let templateParser = new TemplateParser()
    let dirname = path.dirname(data.outputFile)
    
    return new Promise(resolve => {
        try {
            fs.readFile(data.inputFile, (err,bf) => {
                let content:string = bf?.toString()
                content = templateParser.parseStr(content,data?.data)

                if (!fs.existsSync(dirname))
                    fs.mkdirSync(dirname, {recursive:true})
                
                fs.writeFile(data.outputFile, content, (err) => {
                    if (err) {
                        console.log(err)
                        resolve(false)
                    }
                    else
                        resolve(true)
                })
            })    
        } 
        catch (err) {
            console.log(err)
            resolve(false)
        }
    })
}

function readTemplateDirectory(template:string,outputPath:string): TemplateFile[] {
    let folder = path.join(templateDirectory, template)
    let result: TemplateFile[] = []
    dirScan(result,folder,outputPath,[])
    return result
}

function dirScan(list:TemplateFile[],inputFolder:string,outputFolder:string,subdirs:string[]) {
    let inp = path.join(inputFolder,...subdirs)
    let out = path.join(outputFolder,...subdirs)
    fs.readdirSync(inp, { withFileTypes: true }).forEach(item => {
        if (item.isFile())
            list.push({ inputFile: path.join(inp,item.name), outputFile: path.join(out,item.name) })
        else if (item.isDirectory())
            dirScan(list,inputFolder,outputFolder,[...subdirs,item.name])
    })
}

function parseFiles(list:TemplateFile[],appData:IApplication) {
    let templateParser = new TemplateParser()
    let result:TemplateFile[] = []

    list.forEach(item => {
        item.data = { app: appData }

        // replica enumeradores
        if (item.inputFile.includes(fileReplicators.enum)) {
            appData.enums?.forEach(e => {
                let newItem = Object.assign({},item)
                newItem.outputFile = newItem.outputFile.replace(fileReplicators.enum,'')
                newItem.data = Object.assign(newItem.data,{enum:e})
                newItem.outputFile = templateParser.parseStr(newItem.outputFile,newItem.data)
                result.push(newItem)
            })
        }
        // replica zooms
        else if (item.inputFile.includes(fileReplicators.zoom)) {
            appData.zooms?.forEach(z => {
                let zoomApp = Object.assign(loadAppData(z.application),z)
                let newItem = Object.assign({},item)
                newItem.outputFile = newItem.outputFile.replace(fileReplicators.zoom,'')
                newItem.data = Object.assign(newItem.data,{zoom:zoomApp})
                newItem.outputFile = templateParser.parseStr(newItem.outputFile,newItem.data)
                result.push(newItem)
            })
        }
        // trata arquivo simples
        else {
            item.outputFile = templateParser.parseStr(item.outputFile,item.data)
            result.push(item)
        }
    })
    return result
}


const codeGen = {
    
    generate: (appName:string,sessionId:string,templates:string[]): Promise<string> => {
        let _results: Promise<boolean>[] = []
        let _appData = loadAppData(appName)
        let _folder = prepareFolder(appName,sessionId)
        templates.forEach(template => _results.push(buildTemplate(_appData,_folder,template)))
        return Promise.all(_results).then(() => resultFolder(appName,sessionId))
    }
    
}

export default codeGen
