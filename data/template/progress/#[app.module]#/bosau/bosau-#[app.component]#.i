define temp-table tmp#[app.component,PascalCase]#Filter no-undo
    field ds-query as char serialize-name "q"
@[app.fields,isFilter&!isRangeFilter]@
    field #[field]# as #[ablType]# serialize-name "#[name]#"
@[end]@
@[app.fields,isFilter&isRangeFilter]@
    field #[field]#-ini as #[ablType]# serialize-name "#[name]#Initial"
    field #[field]#-fim as #[ablType]# serialize-name "#[name]#Final"
@[end]@.
    
define temp-table tmp#[app.component,PascalCase]# no-undo
@[app.fields]@
    field #[field]# as #[ablType]# serialize-name "#[name]#"
@[end]@.
