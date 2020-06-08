export interface IApplication {
    name?:string
    table?:string
    component?:string
    description?:string
    module?:string
    version?:string

    fields?:IField[]
    enums?:IEnum[]
    zooms?:IZoom[]
}

export interface IField {
    sequence?:number
    field?:string
    name?:string
    description?:string
    ablType?:string
    ablFixedValue?:string
    jsType?:string
    jsInitValue?:string
    isPrimary?:boolean
    isMandatory?:boolean
    isVisible?:boolean
    isEditable?:boolean
    isListed?:boolean
    isLink?:boolean
    isFilter?:boolean
    isRangeFilter?:boolean
}

export interface IEnum {
    component?:string
    description?:string
    values?:IEnumValue[]
    isNumeric?:boolean
}
  
export interface IEnumValue {
    value?:string
    label?:string
}

export interface IZoom {
    application?:string
    labelField?:string
    keyField?:string
    isNumeric?:boolean
}

export interface PropertyValue {
    value:string
    data?:any
    attribute?:string
    property?:string
}


export interface TemplateFile {
    inputFile:string
    outputFile:string
    data?:TemplateFileData
}

export interface TemplateFileData {
    app:IApplication
    enum?:any
    zoom?:any
    item?:any
}

export interface TextLineBreaker {
    text?:string
    startsWithCR?:boolean
    startsWithLF?:boolean
    startsWithCRLF?:boolean
    endsWithCR?:boolean
    endsWithLF?:boolean
    endsWithCRLF?:boolean
}