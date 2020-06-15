import http from "http"
import url from "url"
import fs from "fs"
import path from "path"
import codeGen from "./codegen"
import cache from "./cache"
import * as dataUtil from "./data-util"
import { IApplication } from 'model'

interface IResponse { status?:number, data?:Buffer|string }

let dataDirectory = path.join(__dirname, 'data')
let tableDirectory = path.join(dataDirectory, 'table')
let appDirectory = path.join(dataDirectory, 'application')

let getTemplateIndex = ():Promise<IResponse> => {
    return new Promise(resolve => {
        let fname = path.join(dataDirectory, 'template.index.json')
        fs.readFile(fname, (err,data) => {
            if (data)
                resolve({status:200, data:data})
            else
                resolve({status:500, data:'Template index not found'})
        })
    })
}

let getTableIndex = ():Promise<IResponse> => {
    return new Promise(resolve => {
        let fname = path.join(dataDirectory, 'table.index.json')
        fs.readFile(fname, (err,data) => {
            if (data)
                resolve({status:200, data:data})
            else
                resolve({status:500, data:'Table index not found'})
        })
    })
}

let getTable = (table:string):Promise<IResponse> => {
    return new Promise(resolve => {
        let fname = path.join(tableDirectory, `${table}.json`)
        fs.readFile(fname, (err,data) => {
            if (data)
                resolve({status:200, data:data})
            else
                resolve({status:500, data:'Table definition not found'})
        })
    })
}

let getApplication = (name:string):Promise<IResponse> => {
    let app = cache.application(name)
    return new Promise(resolve => {
        if (app)
            resolve({status:200, data:JSON.stringify(app)})
        else
            resolve({status:500, data:'Application not found'})
    })
}

let searchApplication = (filter:string):Promise<IResponse> => {
    let apps = cache.applications()
    let result = []
    let filterData: {table?,name?,component?,q?} = {}
    let filters = (filter?.split('&') || [])
    filters.forEach(f => {
        let v = f.split('=')
        if (v.length == 2)
            filterData[v[0]] = v[1].toLowerCase()        
    })
    return new Promise(resolve => {
        apps.forEach(app => {
            if (filterData.name) {
                if (!app.name.toLowerCase().includes(filterData.name))
                    return
            }
            if (filterData.table) {
                if (app.table.toLowerCase() != filterData.table)
                    return
            }
            if (filterData.component) {
                if (app.component != filterData.table)
                    return
            }
            if (filterData.q) {
                let ok = false
                if (app.name.toLowerCase().includes(filterData.q))
                    ok = true
                if (app.table.toLowerCase() == filterData.q)
                    ok = true
                if (app.component.toLowerCase() == filterData.q)
                    ok = true
                if (!ok)
                    return
            }
            result.push(app)
        })
        resolve({status:200, data: JSON.stringify(result)})
    })
}

let searchRelation = (filter:string):Promise<IResponse> => {
    let apps = cache.applications()
    let result = []
    let filterData: {field?} = {}
    let filters = (filter?.split('&') || [])
    filters.forEach(f => {
        let v = f.split('=')
        if (v.length == 2)
            filterData[v[0]] = v[1]        
    })
    if (filterData.field)
        filterData.field = dataUtil.summaryName(filterData.field)
    return new Promise(resolve => {
        apps?.forEach(app => {
            let ok = false
            if (filterData.field) {
                let pk = app.fields.filter(f => f.isPrimary)
                if (pk.length == 1) {
                    let fname = dataUtil.summaryName(pk[0].field)
                    if (dataUtil.compareNames(fname,filterData.field))
                        ok = true
                }
            }
            if (ok)
                result.push(app)
        })
        resolve({status:200, data: JSON.stringify(result)})
    })
}

let createApplication = (data?:string):Promise<IResponse> => {
    cache.reset()
    return new Promise(resolve => {
        try {
            let appData: IApplication = {}
            if (data)
                appData = JSON.parse(data)
            else
                throw 'Application data error';
            //
            if (validateApplication(appData)) {
                let applicationName = appData.name
                let fname = path.join(appDirectory,`${applicationName}.json`)
                fs.exists(fname, (exist) => {
                    if (exist)
                        throw 'Application already exists'
                    fs.writeFile(fname,data,(err) => {
                        if (err)
                            throw 'Write error'
                        resolve({status:200, data:JSON.stringify(appData)})
                    })
                })
            }
            else {
                throw 'Invalid application data'
            }
        } 
        catch(e) {
            resolve({status:500, data:e})
        }
    })
}

let updateApplication = (name:string,data?:string):Promise<IResponse> => {
    cache.reset()
    return new Promise(resolve => {
        try {
            let appData: IApplication = {}
            if (data)
                appData = JSON.parse(data)
            else
                throw 'Application data error';
            //
            appData.name = name
            if (validateApplication(appData)) {
                let applicationName = appData.name
                let fname = path.join(appDirectory,`${applicationName}.json`)
                fs.writeFile(fname,data,(err) => {
                    if (err)
                        throw 'Write error'
                    resolve({status:200, data:JSON.stringify(appData)})
                })
            }
            else {
                throw 'Invalid application data'
            }
        } 
        catch(e) {
            resolve({status:500, data:e})
        }
    })
}

let deleteApplication = (name:string,data?:string):Promise<IResponse> => {
    let apps = cache.applications().filter(item => item.name != name)
    cache.reset()
    return new Promise(resolve => {
        try {
            let zApp = apps.filter(a => { return !!a.zooms?.find(z => z.application == name)  })
            if (zApp?.length > 0) {
                let zName = zApp.slice(0,2).map(item => item.name).join(', ')
                if (zApp.length > 3)
                    zName += '...'
                throw `This application is referenced in another application(s): ${zName}`
            }
            //
            let fname = path.join(appDirectory,`${name}.json`)
            if (!fs.existsSync(fname))
                throw 'Application file no found'
            fs.unlink(fname, (err) => {
                if (err) {
                    console.log(err)
                    throw 'Error deleting the application file'
                }
                else {
                    resolve({status:204})
                    cache.reset()
                }
            })
        } 
        catch(e) {
            resolve({status:500, data:e})
        }
    })
}

let postGenerate = (data?:string):Promise<IResponse> => {
    return new Promise(resolve => {
        try {
            let appData: any = {}
            if (data)
                appData = JSON.parse(data)
            else
                throw 'Application data error';
            //
            let templates = appData.templates
            let applicationName = appData.application
            let session = appData.session
            // if ((!templates)||(!applicationName)||(!session))
            //     throw "500"
            //
            codeGen.generate(applicationName,session,templates)
                .then(folder => {
                    let result = {
                        application: applicationName,
                        outputPath: folder
                    }
                    resolve({status:200, data:JSON.stringify(result)})
                })
                .catch((e) => { throw e })
        } 
        catch(e) {
            resolve({status:500, data:e})
        }
    })
}

let validateApplication = (app:IApplication): boolean => {
    if (!app)
        return false
    if (!app.component)
        return false
    if (!app.description)
        return false
    if (!app.fields?.length)
        return false
    return true
}

var apiServer = {
    request: (req: http.IncomingMessage, res: http.ServerResponse, data?: string) => {
        try {
            let requestUrl = url.parse(<string>req.url)

            let stringPath = requestUrl.pathname
            let methodPath = stringPath.split('/').slice(2)

            let writeResponse = (response:IResponse) => {
                let rData = response.data
                res.writeHead(response.status || 204, { 'Content-Type': 'application/json' })
                if ((response.status > 299)&&(rData)) {
                    rData = JSON.stringify({
                        'code': 'CODEGEN',
                        'message': rData,
                        'detailedMessage': ''
                    })
                }
                res.write(rData)
                res.end()
            }

            if ((req.method == 'GET')&&(methodPath.length == 1)) {
                switch (methodPath[0]) {
                    case 'template':
                        getTemplateIndex().then(v => writeResponse(v))
                        break
                    case 'table':
                        getTableIndex().then(v => writeResponse(v))
                        break
                    case 'application':
                        searchApplication(requestUrl.query).then(v => writeResponse(v))
                        break
                    case 'relation':
                        searchRelation(requestUrl.query).then(v => writeResponse(v))
                        break
                    default:
                        throw 'Not found'
                }
            }
            else if ((req.method == 'POST')&&(methodPath.length == 1)) {
                switch (methodPath[0]) {
                    case 'application':
                        createApplication(data).then(v => writeResponse(v))
                        break
                    case 'generate':
                        postGenerate(data).then(v => writeResponse(v))
                        break
                    default:
                        throw 'Not found'
                }
            }
            else if ((req.method == 'GET')&&(methodPath.length == 2)) {
                switch (methodPath[0]) {
                    case 'table':
                        getTable(methodPath[1]).then(v => writeResponse(v))
                        break
                    case 'application':
                        getApplication(methodPath[1]).then(v => writeResponse(v))
                        break
                    default:
                        throw 'Not found'
                }
            }
            else if ((req.method == 'PUT')&&(methodPath.length == 2)) {
                switch (methodPath[0]) {
                    case 'application':
                        updateApplication(methodPath[1],data).then(v => writeResponse(v))
                        break
                    default:
                        throw 'Not found'
                }
            }
            else if ((req.method == 'DELETE')&&(methodPath.length == 2)) {
                switch (methodPath[0]) {
                    case 'application':
                        deleteApplication(methodPath[1]).then(v => writeResponse(v))
                        break
                    default:
                        throw 'Not found'
                }
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.write('404 Not Found\n')
                res.end()
                return
            }
        }
        catch (e) {
            res.writeHead(500)
            res.end()
            console.log(e)
        }
    }
}

export default apiServer