import { TemplateFileData, TextLineBreaker, PropertyValue } from 'model';

function _pascalCase(attr:PropertyValue): PropertyValue {
    if (!attr) return null
    let words = attr.value.split('-')
    attr.value = words.map(w => { return w.substring(0,1).toUpperCase() + w.substring(1).toLowerCase() }).join('')
    return attr
}

function _camelCase(attr:PropertyValue): PropertyValue {
    if (!attr) return null
    let r = _pascalCase(attr)
    r.value = r.value.substring(0,1).toLowerCase() + r.value.substring(1)
    return r
}

function _plural(attr:PropertyValue): PropertyValue {
    if (!attr) return null
    if (attr.value.endsWith('y'))
        attr.value = attr.value.substring(0,attr.value.length-1) + 'ies'
    else if (attr.value.endsWith('ss'))
        attr.value += 'es'
    else if (!attr.value.match(/[0-9s]$/gi))
        attr.value += 's'
    return attr
}

function _upper(attr:PropertyValue): PropertyValue {
    if (!attr) return null
    attr.value = attr.value.toUpperCase()
    return attr
}

function _lower(attr:PropertyValue): PropertyValue {
    if (!attr) return null
    attr.value = attr.value.toUpperCase()
    return attr
}

function _ablCast(attr:PropertyValue): PropertyValue {
    if (!attr) return null
    let t = attr.value.toLowerCase()
    if (t.startsWith('int'))
        attr.value = 'integer'
    else if (t.startsWith('dec'))
        attr.value = 'decimal'
    else if (t.startsWith('log'))
        attr.value = 'logical'
    else
        attr.value = 'string'
    return attr
}

function _negate(attr:PropertyValue): PropertyValue {
    if (!attr) return null
    let v = !!attr.value
    if (v)
        attr.value = 'false'
    else
        attr.value = 'true'
    return attr
}

const convertFunctions = {
    pascalcase: _pascalCase.bind(this),
    camelcase: _camelCase.bind(this),
    plural: _plural.bind(this),
    upper: _upper.bind(this),
    lower: _lower.bind(this),
    ablcast: _ablCast.bind(this),
    negate: _negate.bind(this)
}

const specialChars = {
    ATTRIBUTE_SPLIT: '.',
    PARAMETER_SPLIT: ',',
    CONDITION_SPLIT: '&',
    CONDITION_VALUE: '=',
    NOT: '!'
}

export class TemplateParser {

    private readonly regexAttribute = /#\[([\w\d.,;!\=\:\&]+)\]#{1}/gi
    private readonly regexLoopStart = /@\[([\w\d.,;!\=\:\&]+)\]@{1}/gi
    private readonly regexLoopEnd = /@\[end\]@{1}/gi
    private readonly regexCondStart = /\?\[([\w\d.,;!\=\:\&]+)\]\?{1}/gi
    private readonly regexCondEnd = /\?\[end\]\?{1}/gi

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
                let loopValue = this.applyAttributeValue(attr,data)

                if ((loopValue) && Array.isArray(loopValue.value)) {
                    let filtered = loopValue.value.filter(v => this.validateAttributes(cond, Object.assign({},data,{item:v})))
                    filtered.forEach((v,i,a) => {
                        let loopItem = Object.assign({},v)
                        loopItem.isFirst = (i == 0)
                        loopItem.isLast = (i == a.length-1)
                        loopItem.isOdd = (i % 2 == 1)
                        loopItem.isEven = (i % 2 == 1)
                        let loopData = Object.assign({},data,{item:loopItem})
                        // inject enumComponent
                        if (loopItem.enumComponent)
                            loopData.enum = data.app.enums?.find(item => item.component == loopItem.enumComponent)
                        // inject zoomComponent
                        if (loopItem.zoomComponent)
                            loopData.zoom = data.app.zooms?.find(item => item.application == loopItem.zoomComponent)
                        let text = this.insertLineBreakers(lineBreakers, loopItem.isFirst, loopItem.isLast)
                        replaceText += this.parseStr(text,loopData)
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
        let result = args.map(arg => {
            let negated = false
            let params = arg.split(specialChars.CONDITION_VALUE)
            if (params[0].startsWith(specialChars.NOT)) {
                params[0] = params[0].substring(1)
                negated = true
            }
            let attrValue = this.applyAttributeValue(params[0].trim(),data)
            if (!attrValue)
                return false
            if (attrValue.value == null)
                attrValue.value = ''
            if (params.length==1) {
                let v1 = !!(attrValue?.value)
                return v1 != negated
            }
            else if (params.length==2) {
                let v1 = String(attrValue?.value || '').toString().toLowerCase()
                let v2 = String(params[1] || '').toString().trim().toLowerCase()
                return (negated ? (v1!=v2) : (v1==v2))
            }
            else {
                return false
            }
        })
        return !result.includes(false)
    }

    private applyAttribute(attr:string,data:TemplateFileData): string {
        let args = attr.split(specialChars.PARAMETER_SPLIT)
        if (args.length==0)
            return attr

        let result = (this.applyAttributeValue(args.shift(),data) || {value: ''})
        args.forEach(arg => { result = this.applyFunction(result,arg) })
        return result?.value
    }

    private applyAttributeValue(attr:string,data:TemplateFileData): PropertyValue {
        let args = attr.trim().split(specialChars.ATTRIBUTE_SPLIT)
        if (args.length==2) {
            let attrParent: string = args[0]
            let attrName: string = args[1]
            switch (attrParent) {
                case 'app':
                    return { value: data.app[attrName], data: data, attribute: 'app', property: attrName }
                case 'enum':
                    return { value: data.enum[attrName], data: data, attribute: 'enum', property: attrName }
                case 'zoom':
                    return { value: data.zoom[attrName], data: data, attribute: 'zoom', property: attrName }
                default:
                    return null
            }
        }
        else if((args.length==1)&&(data.item)) {
            return { value: data.item[args[0]], data: data, attribute: 'item', property: args[0] }
        }

        return null
    }

    private applyFunction(attr:PropertyValue,fnc:string): PropertyValue {
        let _f = convertFunctions[fnc.toLowerCase()]
        if ((attr) && (_f instanceof Function))
            return _f(attr)
        return attr
    }

}
