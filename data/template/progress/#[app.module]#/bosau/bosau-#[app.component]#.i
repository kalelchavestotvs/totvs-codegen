define temp-table tmp#[app.component,PascalCase]#Filter no-undo
    field ds-query as char serialize-name "q"
    #[whileFields,isFilter=true]#
    *[progress/bo/defineTempTableRangeField.txt,isRangeFilter=true]**[progress/bo/defineTempTableField.txt,isRangeFilter=false]*
    #[endWhileFields]#  
    
define temp-table tmp#[app.component,PascalCase]# no-undo
    #[whileFields]#
    field #[Field.fieldName,MaxAttributeSize]# as #[Field.databaseType,MaxAttributeSize]# serialize-name "#[Field.name]#"#[IF,isLast]#.#[endIF]#
    #[endWhileFields]#
