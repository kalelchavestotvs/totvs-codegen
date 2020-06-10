using classes.query.*.
using classes.utils.*.

{include/i-prgvrs.i BOSAU-#[app.component,Upper]# 2.00.02.001 } /*** 010201 ***/

&IF "{&EMSFND_VERSION}" >= "1.00" &THEN
    {include/i-license-manager.i bosau-#[app.component]# MUT}
&ENDIF

this-procedure:private-data = "bosau-#[app.component]#".

{hdp/hdrunpersis.iv}
{rtp/rtrowerror.i}
{#[app.module]#/bosau/bosau-#[app.component]#.i}

@[app.fields,isAuto]@
?[isFirst]?
function nextSequence returns #[ablType]#:
    def buffer b-#[app.table]# for #[app.table]#.
    for first b-#[app.table]# no-lock break by b-#[app.table]#.#[field]# desc:
        return b-#[app.table]#.#[field]# + 1.
    end.
    return 1.
end function.
?[end]?
@[end]@
function validateSearchFilter returns log (buffer bf#[app.component,PascalCase]#Filter for tmp#[app.component,PascalCase]#Filter):
    // valida o minimo de informacoes no filtro
    return true.
end function.

procedure getById:

@[app.fields,isPrimary]@
    define input        parameter #[field]#-par like #[app.table]#.#[field]# no-undo.
@[end]@
    define output       parameter table for tmp#[app.component,PascalCase]#.
    define input-output parameter table for rowErrors.         

    empty temp-table tmp#[app.component,PascalCase]#.
    for first #[app.table]#
@[app.fields,isPrimary]@
       ?[isFirst]?where?[end]??[!isFirst]?  and?[end]? #[app.table]#.#[field]# = #[field]#-par
@[end]@
             no-lock:
        run createTemp#[app.component,PascalCase]#.
        return "OK".
    end.

    return "NOK".

end procedure.

procedure getByFilter:

    define input        parameter startRow     as integer                 no-undo.
    define input        parameter pageSize     as integer                 no-undo.
    define input        parameter table       for tmp#[app.component,PascalCase]#Filter.    
    define output       parameter hasNext      as logical                 no-undo.
    define output       parameter table       for tmp#[app.component,PascalCase]#.
    define input-output parameter table       for rowErrors.         

    def var oQuery    as GpsQuery       no-undo.
    def var oWhere    as QueryCondition no-undo.
    def var in-search-value-aux  as int no-undo.
    def var lg-value-integer-aux as log no-undo.

    empty temp-table tmp#[app.component,PascalCase]#.

    run adjustSearchFields(input-output table tmp#[app.component,PascalCase]#Filter).

    find first tmp#[app.component,PascalCase]#Filter no-lock no-error.
    if (not avail tmp#[app.component,PascalCase]#Filter)
    or (not validateSearchFilter(buffer tmp#[app.component,PascalCase]#Filter))
    then do:
        run insertErrorGP(input 2653, input "", input "", input-output table rowErrors).
        return "NOK".
    end.

    oQuery = new GpsQuery().
    oQuery:addBuffer(buffer #[app.table]#:handle).
    oQuery:setStartRow(startRow):setPageSize(pageSize).
    oQuery:setMethod("createTemp#[app.component,PascalCase]#", this-procedure).

    for first tmp#[app.component,PascalCase]#Filter:
        oWhere = oQuery:and().

@[app.fields,isFilter&!isRangeFilter]@
        if  (tmp#[app.component,PascalCase]#Filter.#[field]# <> ?)
        and (tmp#[app.component,PascalCase]#Filter.#[field]# ?[ablType=character]?<> ""?[end]??[ablType=integer]?> 0?[end]??[!ablType=character&!ablType=integer]?<> ??[end]?)
        then oWhere:and("#[app.table]#.#[field]#", tmp#[app.component,PascalCase]#Filter.#[field]#?[ablType=character]?, oWhere:OPERATOR_BG?[end]?).

@[end]@
@[app.fields,isFilter&isRangeFilter]@
        if  (tmp#[app.component,PascalCase]#Filter.#[field]#-ini <> ?)
        and (tmp#[app.component,PascalCase]#Filter.#[field]#-ini ?[ablType=character]?<> ""?[end]??[ablType=integer]?> 0?[end]??[!ablType=character&!ablType=integer]?<> ??[end]?)
        then oWhere:and("#[app.table]#.#[field]#", tmp#[app.component,PascalCase]#Filter.#[field]#-ini, oWhere:OPERATOR_GE).
        if  (tmp#[app.component,PascalCase]#Filter.#[field]#-fim <> ?)
        and (tmp#[app.component,PascalCase]#Filter.#[field]#-fim ?[ablType=character]?<> ""?[end]??[ablType=integer]?> 0?[end]??[!ablType=character&!ablType=integer]?<> ??[end]?)
        then oWhere:and("#[app.table]#.#[field]#", tmp#[app.component,PascalCase]#Filter.#[field]#-fim, oWhere:OPERATOR_LE).

@[end]@
        if  tmp#[app.component,PascalCase]#Filter.ds-query <> ?
        and tmp#[app.component,PascalCase]#Filter.ds-query <> ""
        then do:
            assign in-search-value-aux = integer(tmp#[app.component,PascalCase]#Filter.ds-query) no-error.
            assign lg-value-integer-aux = not error-status:error.

            oWhere = oQuery:and().
@[app.fields,isFilter&!isRangeFilter&ablType=character]@
            oWhere:or("#[app.table]#.#[field]#", tmp#[app.component,PascalCase]#Filter.ds-query, oWhere:OPERATOR_BG).
@[end]@
            if lg-value-integer-aux
            then do:
@[app.fields,isFilter&!isRangeFilter&ablType=integer]@
                oWhere:or("#[app.table]#.#[field]#", in-search-value-aux).
@[end]@
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
    
    define input-output param table for tmp#[app.component,PascalCase]#.
    define input-output param table for rowErrors.   

    find first tmp#[app.component,PascalCase]# no-error.

    if not avail tmp#[app.component,PascalCase]#
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
@[app.fields,isAuto]@
?[isFirst]?
    assign tmp#[app.component,PascalCase]#.#[field]# = nextSequence().
?[end]?
@[end]@
    if can-find(first #[app.table]#
@[app.fields,isPrimary]@
                ?[isFirst]?where ?[end]??[!isFirst]?  and ?[end]?#[app.table]#.#[field]# = tmp#[app.component,PascalCase]#.#[field]#
@[end]@)
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
        input table tmp#[app.component,PascalCase]#,
        input-output table rowErrors).                
    
    if return-value = "OK"
    then do:
        create #[app.table]#.    
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
            find current #[app.table]# no-lock no-error.
            buffer-copy #[app.table]# to tmp#[app.component,PascalCase]#.
        end.
    end.        

end procedure.

procedure updateRecord:

    define input-output param table for tmp#[app.component,PascalCase]#.
    define input-output param table for rowErrors.   

    find first tmp#[app.component,PascalCase]# no-error.        

    if not available tmp#[app.component,PascalCase]#
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
         
    if not can-find(first #[app.table]#
@[app.fields,isPrimary]@
                    ?[isFirst]?where ?[end]??[!isFirst]?  and ?[end]?#[app.table]#.#[field]# = tmp#[app.component,PascalCase]#.#[field]#
@[end]@)
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
        input table tmp#[app.component,PascalCase]#,
        input-output table rowErrors).

    if return-value = "OK"
    then do:
        find first #[app.table]# 
@[app.fields,isPrimary]@
            ?[isFirst]?where?[end]??[!isFirst]?  and?[end]? #[app.table]#.#[field]# = tmp#[app.component,PascalCase]#.#[field]#
@[end]@
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
            find current #[app.table]# no-lock no-error.
            buffer-copy #[app.table]# to tmp#[app.component,PascalCase]#.
        end.
    end.
end.

procedure validateRecord private:
    define input        parameter table for tmp#[app.component,PascalCase]#.
    define input-output parameter table for rowErrors.   
    
    for first tmp#[app.component,PascalCase]# no-lock:
@[app.fields,isMandatory&ablFixedValue=&!isAuto]@
        ?[isFirst]?if?[end]??[!isFirst]?or?[end]? tmp#[app.component,PascalCase]#.#[field]# = ?
        or tmp#[app.component,PascalCase]#.#[field]# = ?[ablType=character]?""?[end]??[ablType=logical]???[end]??[!ablType=character&!ablType=logical]?0?[end]?
@[end]@
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
    
    buffer-copy tmp#[app.component,PascalCase]#
          using @[app.fields,ablFixedValue=]@#[field]# @[end]@
             to #[app.table]#.
@[app.fields,!ablFixedValue=]@
    ?[isFirst]?assign?[end]??[!isFirst]?      ?[end]? #[app.table]#.#[field]# = #[ablFixedValue]#
@[end]@.

    validate #[app.table]# no-error.
    if error-status:error
    then return error.

end procedure.

procedure removeRecord:
    
@[app.fields,isPrimary]@
    def input        param #[field]#-par like #[app.table]#.#[field]#  no-undo.
@[end]@
    def input-output param table for rowErrors.  
    
    if not can-find(first #[app.table]#
@[app.fields,isPrimary]@
                    ?[isFirst]?where ?[end]??[!isFirst]?  and ?[end]?#[app.table]#.#[field]# = #[field]#-par 
@[end]@)
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
         
    for first #[app.table]# 
@[app.fields,isPrimary]@
        ?[isFirst]?where?[end]??[!isFirst]?  and ?[end]? #[app.table]#.#[field]# = #[field]#-par
@[end]@
              exclusive-lock:
        delete #[app.table]#.
    end.
    
end.

procedure createTemp#[app.component,PascalCase]#:

    create tmp#[app.component,PascalCase]#.
    buffer-copy #[app.table]# to tmp#[app.component,PascalCase]#.

end.

procedure adjustSearchFields private:
    def input-output param table for tmp#[app.component,PascalCase]#Filter.

    // realiza tratamentos nos campos de pesquisa
    // exemplo: remover pontuacao do campo de CPF

end procedure.
