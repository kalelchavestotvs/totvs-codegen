using classes.query.*.
using classes.utils.*.

{include/i-prgvrs.i BOSAU-#[Table.component,Upper]# 2.00.02.001 } /*** 010201 ***/

&IF "{&EMSFND_VERSION}" >= "1.00" &THEN
    {include/i-license-manager.i bosau-#[Table.component]# MUT}
&ENDIF

this-procedure:private-data = "bosau-#[Table.component]#".

{hdp/hdrunpersis.iv}
{rtp/rtrowerror.i}
{#[Table.appModule]#/bosau/bosau-#[Table.component]#.i}

function validateSearchFilter returns log (buffer bf#[Table.module]#Filter for tmp#[Table.module]#Filter):
    // valida o minimo de informacoes no filtro
    return true.
end function.

procedure getById:

    #[whileFields,isKey=true]#
    define input        parameter #[Field.fieldName]#-par like #[Table.name]#.#[Field.fieldName]# no-undo.
    #[endWhileFields]#
    define output       parameter table for tmp#[Table.module]#.
    define input-output parameter table for rowErrors.         

    empty temp-table tmp#[Table.module]#.
    for first #[Table.name]#
       #[whileFields,isKey=true]#
       #[IF,isFirst]#where#[endIF]##[IF,!isFirst]#  and#[endIF]# #[Table.name]#.#[Field.fieldName]# = #[Field.fieldName]#-par
       #[endWhileFields]#
             no-lock:
        run createTemp#[Table.module]#.
        return "OK".
    end.

    return "NOK".

end procedure.

procedure getByFilter:

    define input        parameter startRow     as integer                 no-undo.
    define input        parameter pageSize     as integer                 no-undo.
    define input        parameter table       for tmp#[Table.module]#Filter.    
    define output       parameter hasNext      as logical                 no-undo.
    define output       parameter table       for tmp#[Table.module]#.
    define input-output parameter table       for rowErrors.         

    def var oQuery    as GpsQuery       no-undo.
    def var oWhere    as QueryCondition no-undo.
    def var in-search-value-aux  as int no-undo.
    def var lg-value-integer-aux as log no-undo.

    empty temp-table tmp#[Table.module]#.

    run adjustSearchFields(input-output table tmp#[Table.module]#Filter).

    find first tmp#[Table.module]#Filter no-lock no-error.
    if (not avail tmp#[Table.module]#Filter)
    or (not validateSearchFilter(buffer tmp#[Table.module]#Filter))
    then do:
        run insertErrorGP(input 2653, input "", input "", input-output table rowErrors).
        return "NOK".
    end.

    oQuery = new GpsQuery().
    oQuery:addBuffer(buffer #[Table.name]#:handle).
    oQuery:setStartRow(startRow):setPageSize(pageSize).
    oQuery:setMethod("createTemp#[Table.module]#", this-procedure).

    for first tmp#[Table.module]#Filter:
        oWhere = oQuery:and().

        #[whileFields,isFilter=true]#
        *[progress/bo/assignRangeFilter.txt,isRangeFilter=true]**[progress/bo/assignFilter.txt,isRangeFilter=false]*
        #[endWhileFields]#

        if  tmp#[Table.module]#Filter.ds-query <> ?
        and tmp#[Table.module]#Filter.ds-query <> ""
        then do:
            assign in-search-value-aux = integer(tmp#[Table.module]#Filter.ds-query) no-error.
            assign lg-value-integer-aux = not error-status:error.

            oWhere = oQuery:and().
            #[whileFields,isFilter=true|isRangeFilter=false|databaseType=character]#
            oWhere:or("#[Table.name]#.#[Field.fieldName]#", tmp#[Table.module]#Filter.ds-query, oWhere:OPERATOR_BG#[endIF]#).
            #[endWhileFields]#
            if lg-value-integer-aux
            then do:
                #[whileFields,isFilter=true|isRangeFilter=false|databaseType=integer]#
                oWhere:or("#[Table.name]#.#[Field.fieldName]#", in-search-value-aux).
                #[endWhileFields]#
            end.
        end.  
    end.

    oQuery:execute().
    assign hasNext = oQuery:hasNext.

    if containsAnyError(input table rowErrors)
    then return "NOK". 
    
    return "OK".

    finally:
        if valid-object(oQuery)
        then delete object oQuery.
    end finally.
    
end procedure.

procedure createRecord:
    
    define input-output param table for tmp#[Table.module]#.
    define input-output param table for rowErrors.   

    find first tmp#[Table.module]# no-error.

    if not avail tmp#[Table.module]#
    then do:
        run insertOtherError(
            input 0,
            input "Nao foram encontrados dados para a insercao/atualizacao do registro",
            input "",
            input "GP",
            input "ERROR",
            input "",
            input-output table rowErrors).
        return "NOK".
    end.
    
    if can-find(first #[Table.name]#
                #[whileFields,isKey=true]#   
                #[IF,isFirst]#where #[endIF]##[IF,!isFirst]#  and #[endIF]##[Table.name]#.#[Field.fieldName]# = tmp#[Table.module]#.#[Field.fieldName]#
                #[endWhileFields]#
                      no-lock)
    then do:
        run insertOtherError(input 0,
                             input "Registro com codigo informado ja existe",
                             input "",
                             input "GP",
                             input "ERROR",
                             input "",
                             input-output table rowErrors).
        return "NOK".
    end.
           
    run validateRecord (
        input table tmp#[Table.module]#,
        input-output table rowErrors).                
    
    if return-value = "OK"
    then do:
        create #[Table.name]#.    
        run assignRecord no-error.

        if error-status:error
        then do:
            run insertOtherError(
                input 0,
                input "Dados invalidos para salvar o registro",
                input "",
                input "GP",
                input "ERROR",
                input "",
                input-output table rowErrors).
            undo,return "NOK".
        end.
        else do:
            find current #[Table.name]# no-lock no-error.
            buffer-copy #[Table.name]# to tmp#[Table.module]#.
        end.
    end.        

end procedure.

procedure updateRecord:

    define input-output param table for tmp#[Table.module]#.
    define input-output param table for rowErrors.   

    find first tmp#[Table.module]# no-error.        

    if not available tmp#[Table.module]#
    then do:
        run insertOtherError(
            input 0,
            input "Nao foram encontrados dados para a insercao/atualizacao do registro",
            input "",
            input "GP",
            input "ERROR",
            input "",
            input-output table rowErrors).
        return "NOK".
    end.
         
    if not can-find(first #[Table.name]#
                    #[whileFields,isKey=true]#   
                    #[IF,isFirst]#where #[endIF]##[IF,!isFirst]#  and #[endIF]##[Table.name]#.#[Field.fieldName]# = tmp#[Table.module]#.#[Field.fieldName]#
                    #[endWhileFields]#
                    no-lock)
    then do:
        run insertOtherError(
            input 0,
            input "Registro com codigo informado nao existe",
            input "",
            input "GP",
            input "ERROR",
            input "",
            input-output table rowErrors).
        return "NOK".
    end.
    
    run validateRecord (
        input table tmp#[Table.module]#,
        input-output table rowErrors).

    if return-value = "OK"
    then do:
        find first #[Table.name]# 
            #[whileFields,isKey=true]#
            #[IF,isFirst]#where#[endIF]##[IF,!isFirst]#  and #[endIF]# #[Table.name]#.#[Field.fieldName]# = tmp#[Table.module]#.#[Field.fieldName]# 
            #[endWhileFields]#
                  exclusive-lock no-error.
        run assignRecord no-error.

        if error-status:error
        then do:
            run insertOtherError(
                input 0,
                input "Dados invalidos para salvar o registro",
                input "",
                input "GP",
                input "ERROR",
                input "",
                input-output table rowErrors).
            undo,return "NOK".
        end.
        else do:
            find current #[Table.name]# no-lock no-error.
            buffer-copy #[Table.name]# to tmp#[Table.module]#.
        end.
    end.
end.

procedure validateRecord private:
    define input        parameter table for tmp#[Table.module]#.
    define input-output parameter table for rowErrors.   
    
    for first tmp#[Table.module]# no-lock:
        #[whileFields,isRequired=true]#
        #[IF,isFirst]#if#[endIF]##[IF,!isFirst]#or#[endIF]# tmp#[Table.module]#.#[Field.fieldName]# = ?
        or tmp#[Table.module]#.#[Field.fieldName]# = #[IF,databaseType=character]#""#[endIF]##[IF,databaseType=logical]#?#[endIF]##[IF,!databaseType=character|!databaseType=logical]#0#[endIF]#
        #[endWhileFields]#
        then do:
            run insertOtherError(
                input 0,
                input "Preencha os campos obrigatorios",
                input "",
                input "GP",
                input "ERROR",
                input "",
                input-output table rowErrors).
            return "NOK".
        end.
    end.

    return "OK".
end procedure.

procedure assignRecord private:   
    
    buffer-copy tmp#[Table.module]#
          using #[inlineFields,fixedValue=]##[Field.fieldName]# #[endInlineFields]#
             to #[Table.name]#.
    #[whileFields,!fixedValue=]#
    #[IF,isFirst]#assign#[endIF]##[IF,!isFirst]#      #[endIF]# #[Table.name]#.#[Field.fieldName,MaxAttributeSize]# = #[Field.fixedValue]##[IF,isLast]#.#[endIF]#
    #[endWhileFields]#

    validate #[Table.name]# no-error.
    if error-status:error
    then return error.

end procedure.

procedure removeRecord:
    
    #[whileFields,isKey=true]#
    def input        param #[Field.fieldName]#-par like #[Table.name]#.#[Field.fieldName]#  no-undo.
    #[endWhileFields]#
    def input-output param table for rowErrors.  
    
    if not can-find(first #[Table.name]#
                    #[whileFields,isKey=true]#   
                    #[IF,isFirst]#where #[endIF]##[IF,!isFirst]#  and #[endIF]##[Table.name]#.#[Field.fieldName]# = #[Field.fieldName]#-par 
                    #[endWhileFields]#
                          no-lock)
                    
    then do:
        run insertOtherError(
            input 0,
            input "Registro nao encontrado",
            input "",
            input "GP",
            input "ERROR",
            input "",
            input-output table rowErrors).
        return "NOK".
    end.
         
    for first #[Table.name]# 
        #[whileFields,isKey=true]#   
        #[IF,isFirst]#where#[endIF]##[IF,!isFirst]#  and #[endIF]# #[Table.name]#.#[Field.fieldName]# = #[Field.fieldName]#-par
        #[endWhileFields]#        
              exclusive-lock:
        delete #[Table.name]#.
    end.
    
end.

procedure createTemp#[Table.module]#:

    create tmp#[Table.module]#.
    buffer-copy #[Table.name]# to tmp#[Table.module]#.

end.

procedure adjustSearchFields private:
    def input-output param table for tmp#[Table.module]#Filter.

    // realiza tratamentos nos campos de pesquisa
    // exemplo: remover pontuacao do campo de CPF

end procedure.
