import { TemplateFileData, TextLineBreaker } from 'model';

function _pascalCase(txt:string) {
    let words = txt.split('-')
    return words.map(w => { return w.substring(0,1).toUpperCase() + w.substring(1).toLowerCase() }).join('')
}

function _camelCase(txt:string) {
    let r = _pascalCase(txt)
    return r.substring(0,1).toLowerCase() + r.substring(1)
}

function _plural(txt:string) {
    if (txt.endsWith('y'))
        return txt.substring(0,txt.length-1) + 'ies'
    if (txt.match(/[0-9s]$/gi))
        return txt
    return txt + 's'
}

const convertFunctions:any = {
    pascalcase: _pascalCase.bind(this),
    camelcase: _camelCase.bind(this),
    plural: _plural.bind(this)
}

const specialChars = {
    ATTRIBUTE_SPLIT: '.',
    PARAMETER_SPLIT: ',',
    CONDITION_SPLIT: '&',
    CONDITION_VALUE: '=',
    NOT: '!'
}

export class TemplateParser {

    private readonly regexAttribute = /#\[([\w\d.,;!\=\:]+)\]#/gi
    private readonly regexLoopStart = /@\[([\w\d.,;!\=\:]+)\]@/gi
    private readonly regexLoopEnd = /@\[end\]@/gi
    private readonly regexCondStart = /\?\[([\w\d.,;!\=\:]+)\]\?/gi
    private readonly regexCondEnd = /\?\[end\]\?/gi

    parseStr(txt:string,data:TemplateFileData): string {
        //#region loops
        let reLoopStart = new RegExp(this.regexLoopStart)
        let reLoopEnd = new RegExp(this.regexLoopEnd)
        let loopStart = reLoopStart.exec(txt)
        let loopEnd = null
        while(loopStart) {
            reLoopEnd.lastIndex = reLoopStart.lastIndex
            loopEnd = reLoopEnd.exec(txt)
            if (loopEnd) {
                let innerText = txt.substring(reLoopStart.lastIndex, loopEnd.index)
                let replaceText = ''

                let lineBreakers = this.removeLineBreakers(innerText)

                let paramAttr = loopStart[1]
                let paramAttrSplit = paramAttr.split(specialChars.PARAMETER_SPLIT)

                let attr = paramAttrSplit[0]
                let cond = []
                if (paramAttrSplit.length>1)
                    cond = paramAttrSplit[1].split(specialChars.CONDITION_SPLIT)
                let value = this.applyAttributeValue(attr,data)

                if (Array.isArray(value)) {
                    let filtered = value.filter(v => this.validateAttributes(cond, Object.assign({},data,{item:v})))
                    filtered.forEach((v,i,a) => {
                        let loopItem = Object.assign({},v)
                        loopItem.isFirst = (i == 0)
                        loopItem.isLast = (i == a.length-1)
                        loopItem.isOdd = (i % 2 == 1)
                        loopItem.isEven = (i % 2 == 1)

                        let text = this.insertLineBreakers(lineBreakers, loopItem.isFirst, loopItem.isLast)
                        replaceText += this.parseStr(text,Object.assign({},data,{item:loopItem}))
                    })
                }
                
                txt = txt.substring(0,loopStart.index) + replaceText + txt.substring(reLoopEnd.lastIndex)
                reLoopStart.lastIndex = loopStart.index-1
                loopStart = reLoopStart.exec(txt)
            }
            else
                break
        }
        //#endregion

        //#region texto condicional
        let reCondStart = new RegExp(this.regexCondStart)
        let reCondEnd = new RegExp(this.regexCondEnd)
        let condStart = reCondStart.exec(txt)
        let condEnd = null
        while(condStart) {
            reCondEnd.lastIndex = reCondStart.lastIndex
            condEnd = reCondEnd.exec(txt)
            if (condEnd) {
                let innerText = txt.substring(reCondStart.lastIndex, condEnd.index)
                let replaceText = ''
                let valid = this.validateAttributes(condStart[1].split(specialChars.CONDITION_SPLIT),Object.assign({},data))
                if (valid)
                    replaceText = innerText
                txt = txt.substring(0,condStart.index) + replaceText + txt.substring(reCondEnd.lastIndex)
                reCondStart.lastIndex = condStart.index-1
                condStart = reCondStart.exec(txt)
            }
            else
                break
        }
        //#endregion

        //#region atributos
        txt = txt.replace(this.regexAttribute,(subs:string,attr:string) => {
            try {
                return this.applyAttribute(attr,data)
            } 
            catch {
                return subs
            }
        })
        //#endregion

        return txt
    }

    private removeLineBreakers(txt:string): TextLineBreaker {
        let result: TextLineBreaker = {
            text: '',
            startsWithCR: false,
            startsWithLF: false,
            startsWithCRLF: false,
            endsWithCR: false,
            endsWithLF: false,
            endsWithCRLF: false
        }

        if (txt.startsWith('\r\n')) {
            result.startsWithCRLF = true
            txt = txt.substring(2)
        }
        else if (txt.startsWith('\r')) {
            result.startsWithCR = true
            txt = txt.substring(1)
        }
        else if (txt.startsWith('\n')) {
            result.startsWithLF = true
            txt = txt.substring(1)
        }

        if (txt.endsWith('\r\n')) {
            result.endsWithCRLF = true
            txt = txt.substring(0,txt.length-2)
        }
        else if (txt.endsWith('\r')) {
            result.endsWithCR = true
            txt = txt.substring(0,txt.length-1)
        }
        else if (txt.endsWith('\n')) {
            result.endsWithLF = true
            txt = txt.substring(0,txt.length-1)
        }

        result.text = txt
        return result
    }

    private insertLineBreakers(lb:TextLineBreaker,isFirst:boolean,isLast:boolean): string {
        let result = lb.text

        if ((!isLast)&&(lb.endsWithCRLF))
            result = result + '\r\n'
        else if ((!isLast)&&(lb.endsWithCR))
            result = result + '\r'
        else if ((!isLast)&&(lb.endsWithLF))
            result = result + '\n'

        return result
    }

    private validateAttributes(args:string[],data:TemplateFileData): boolean {
        let result = true
        args.forEach(arg => {
            if (!result) return
            let negated = false
            let params = arg.split(specialChars.CONDITION_VALUE)
            if (params[0].startsWith(specialChars.NOT)) {
                params[0] = params[0].substring(1)
                negated = true
            }
            let attrValue = this.applyAttributeValue(params[0].trim(),data)
            if (params.length==1) {
                let v1 = !!attrValue
                result = (negated ? !v1 : v1)
            }
            else if (params.length==2) {
                let v1 = String(attrValue).toString().toLowerCase()
                let v2 = String(params[1]).toString().trim().toLowerCase()
                result = (negated ? (v1!=v2) : (v1==v2))
            }
            else {
                result = false
            }
        })
        
        return result
    }

    private applyAttribute(attr:string,data:TemplateFileData): string {
        let args = attr.split(specialChars.PARAMETER_SPLIT)
        if (args.length==0)
            return attr

        let result = (this.applyAttributeValue(args.shift(),data) || '')
        args.forEach(arg => { result = this.applyFunction(result,arg) })

        return result
    }

    private applyAttributeValue(attr:string,data:TemplateFileData) {
        let args = attr.trim().split(specialChars.ATTRIBUTE_SPLIT)
        if (args.length==2) {
            let attrParent: string = args[0]
            let attrName: string = args[1]
            switch (attrParent) {
                case 'app':
                    return data.app[attrName]
                case 'enum':
                    return data.enum[attrName]
                case 'zoom':
                    return data.zoom[attrName]
                default:
                    break;
            }
        }
        else if((args.length==1)&&(data.item)) {
            return data.item[args[0]]
        }

        return null
    }

    private applyFunction(txt:string,fnc:string): string {
        let _f = convertFunctions[fnc.toLowerCase()]
        if (_f instanceof Function)
            return _f(txt)
        return txt
    }

}
