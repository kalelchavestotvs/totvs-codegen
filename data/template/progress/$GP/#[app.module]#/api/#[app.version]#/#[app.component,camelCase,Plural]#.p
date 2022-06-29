using classes.json.GpsJsonUtils.
using classes.utils.GpsUtils.

/****************************
    Programa .....: #[app.component,camelCase,Plural]#.p
    Data .........: #[app.appCreationDate]#
    Empresa ......: TOTVS SAUDE
    Equipe........: #[app.team]#
    Programador ..: xxxxx
    Objetivo .....: Programa responsavel por processar os dados da tela
                    #[app.description,pascalCase]#
***************************/

{utp/ut-api.i}
{utp/ut-api-utils.i}
{utp/ut-api-action.i getById        GET    /@[app.fields,isPrimary]@~*/@[end]@ }
{utp/ut-api-action.i getByFilter    GET    / }
{utp/ut-api-action.i createRecord   POST   / }
{utp/ut-api-action.i updateRecord   PUT    /@[app.fields,isPrimary]@~*/@[end]@ }
{utp/ut-api-action.i removeRecord   DELETE /@[app.fields,isPrimary]@~*/@[end]@ }
{utp/ut-api-notfound.i}

{#[app.module]#/bosau/bosau-#[app.component]#.i}
{hdp/hdrunpersis.iv "new"}
{dbo/utils/rowerror.i}

define variable expandables as character   no-undo.
define variable startRow    as integer     no-undo.
define variable pageSize    as integer     no-undo.
define variable queryParams as JsonObject  no-undo.
define variable fieldList   as character   no-undo.
define variable pathParams  as JsonArray   no-undo.
define variable hasNext     as logical     no-undo.
define variable payload     as longchar    no-undo.
define variable oHeaders    as JsonObject  no-undo.
define variable orderList   as character   no-undo.

define variable jsonArrayResult as JsonArray  no-undo.
define variable jsonResult      as JsonObject no-undo.

define variable h-bosau-#[app.component]#-aux as handle no-undo.

define variable oGpsJsonUtils as GpsJsonUtils no-undo.
define variable oGpsUtils     as GpsUtils     no-undo.

procedure setupInputParameters private:
    define input parameter pJsonInput as JsonObject no-undo.

    define variable oRequestParser as JsonAPIRequestParser no-undo.

    oRequestParser = new JsonAPIRequestParser(pJsonInput).
    assign oHeaders     = oRequestParser:getHeaders()
           pathParams   = oRequestParser:getPathParams()
           queryParams  = oRequestParser:getQueryParams()
           startRow     = oRequestParser:getStartRow()
           pageSize     = oRequestParser:getPageSize()
           fieldList    = oRequestParser:getFieldsChar()
           expandables  = oRequestParser:getExpandChar()
           payload      = oRequestParser:getPayloadLongChar().
    assign orderList = oRequestParser:getOrderChar().

    assign oGpsJsonUtils                   = new GpsJsonUtils()
           oGpsJsonUtils:jsonVersion       = GpsJsonUtils:JSON_V2
           oGpsJsonUtils:outputFields      = fieldList
           oGpsJsonUtils:outputExpandables = expandables.
    assign oGpsUtils = new GpsUtils().

end.

procedure getById:

    define input  parameter jsonInput  as JsonObject        no-undo.
    define output parameter jsonOutput as JsonObject        no-undo.

@[app.fields,isPrimary]@
    define variable #[field]#-aux as #[ablType]# no-undo.
@[end]@

    run setupInputParameters(input jsonInput).

@[app.fields,isPrimary]@
    ?[isFirst]?assign?[end]? ?[!isFirst]?      ?[end]?#[field]#-aux = ?[ablType=date]?oGpsUtils:changeIsoToDate?[end]??[!ablType=date]?#[ablType,ABLCast]#?[end]?(pathParams:getCharacter(#[sequence]#))            
@[end]@ no-error.

    {hdp/hdrunpersis.i "#[app.module]#/bosau/bosau-#[app.component]#.p" "h-bosau-#[app.component]#-aux"}
    run getById in h-bosau-#[app.component]#-aux (
@[app.fields,isPrimary]@
        input #[field]#-aux,
@[end]@
        output table tmp#[app.component,AblTempTable,PascalCase]#,
        input-output table rowErrors) no-error.
    if error-status:error
    then run insertErrorProgress(input "", input "", input-output table rowErrors).

    assign jsonResult = oGpsJsonUtils:getJsonObjectFromTable(temp-table tmp#[app.component,AblTempTable,PascalCase]#:default-buffer-handle)
           jsonOutput = oGpsJsonUtils:createJsonResponse(jsonResult, temp-table RowErrors:default-buffer-handle).

end procedure.

procedure getByFilter:

    define input  parameter jsonInput  as JsonObject no-undo.
    define output parameter jsonOutput as JsonObject no-undo.

    run setupInputParameters(input jsonInput).

    empty temp-table tmp#[app.component,AblTempFilter,PascalCase]#Filter.
    oGpsUtils:convertQueryParamToTable(queryParams, temp-table tmp#[app.component,AblTempFilter,PascalCase]#Filter:default-buffer-handle).

    {hdp/hdrunpersis.i "#[app.module]#/bosau/bosau-#[app.component]#.p" "h-bosau-#[app.component]#-aux"}
    run getByFilter in h-bosau-#[app.component]#-aux (
        input  startRow,
        input  pageSize,
        input  table tmp#[app.component,AblTempFilter,PascalCase]#Filter,
        output hasNext,
        output table tmp#[app.component,AblTempTable,PascalCase]#,
        input-output table rowErrors) no-error.
    if error-status:error
    then run insertErrorProgress(input "", input "", input-output table rowErrors).

    assign jsonArrayResult = oGpsJsonUtils:getJsonArrayFromTable(temp-table tmp#[app.component,AblTempTable,PascalCase]#:default-buffer-handle)
           jsonOutput      = oGpsJsonUtils:createJsonResponse(jsonArrayResult, temp-table RowErrors:default-buffer-handle, hasNext).

end procedure.

procedure createRecord:

    define input  parameter jsonInput  as JsonObject no-undo.
    define output parameter jsonOutput as JsonObject no-undo.

    define variable jsonPayload as JsonObject no-undo.

    run setupInputParameters(input jsonInput).

    assign jsonPayload = oGpsJsonUtils:longcharToJsonObject(payload).
    oGpsUtils:convertJsonObjectsToTable(jsonPayload, temp-table tmp#[app.component,AblTempTable,PascalCase]#:default-buffer-handle).

    {hdp/hdrunpersis.i "#[app.module]#/bosau/bosau-#[app.component]#.p" "h-bosau-#[app.component]#-aux"}
    run createRecord in h-bosau-#[app.component]#-aux (
        input-output table tmp#[app.component,AblTempTable,PascalCase]#,
        input-output table rowErrors) no-error.
    if error-status:error
    then run insertErrorProgress(input "", input "", input-output table rowErrors).

    assign jsonResult = oGpsJsonUtils:getJsonObjectFromTable(temp-table tmp#[app.component,AblTempTable,PascalCase]#:default-buffer-handle)
           jsonOutput = oGpsJsonUtils:createJsonResponse(jsonResult, temp-table RowErrors:default-buffer-handle).

end.

procedure updateRecord:

    define input  parameter jsonInput  as JsonObject no-undo.
    define output parameter jsonOutput as JsonObject no-undo.

    define variable jsonPayload as JsonObject no-undo.

    run setupInputParameters(input jsonInput).

    assign jsonPayload = oGpsJsonUtils:longcharToJsonObject(payload).
    oGpsUtils:convertJsonObjectsToTable(jsonPayload, temp-table tmp#[app.component,AblTempTable,PascalCase]#:default-buffer-handle).

    {hdp/hdrunpersis.i "#[app.module]#/bosau/bosau-#[app.component]#.p" "h-bosau-#[app.component]#-aux"}
    run updateRecord in h-bosau-#[app.component]#-aux (
        input-output table tmp#[app.component,AblTempTable,PascalCase]#,
        input-output table rowErrors) no-error.
    if error-status:error
    then run insertErrorProgress(input "", input "", input-output table rowErrors).

    assign jsonResult = oGpsJsonUtils:getJsonObjectFromTable(temp-table tmp#[app.component,AblTempTable,PascalCase]#:default-buffer-handle)
           jsonOutput = oGpsJsonUtils:createJsonResponse(jsonResult, temp-table RowErrors:default-buffer-handle).

end procedure.

procedure removeRecord:

    define input  parameter jsonInput  as JsonObject no-undo.
    define output parameter jsonOutput as JsonObject no-undo.

@[app.fields,isPrimary]@
    define variable #[field]#-aux as #[ablType]# no-undo.
@[end]@

    run setupInputParameters(input jsonInput).

@[app.fields,isPrimary]@
    ?[isFirst]?assign?[end]??[!isFirst]?      ?[end]? #[field]#-aux = ?[ablType=date]?oGpsUtils:changeIsoToDate?[end]??[!ablType=date]?#[ablType,ABLCast]#?[end]?(pathParams:getCharacter(#[sequence]#))
@[end]@ no-error.

    {hdp/hdrunpersis.i "#[app.module]#/bosau/bosau-#[app.component]#.p" "h-bosau-#[app.component]#-aux"}
    run removeRecord in h-bosau-#[app.component]#-aux (
@[app.fields,isPrimary]@
        input #[field]#-aux,
@[end]@
        input-output table rowErrors) no-error.
    if error-status:error
    then run insertErrorProgress(input "", input "", input-output table rowErrors).

    if containsAnyError(input table rowErrors)
    then assign jsonOutput = oGpsJsonUtils:createErrorResponse(500, temp-table RowErrors:default-buffer-handle).
    else assign jsonOutput = oGpsJsonUtils:createEmptyResponse().

end procedure.

finally:
    if valid-object(oGpsUtils)
    then delete object oGpsUtils.
    if valid-object(oGpsJsonUtils)
    then delete object oGpsJsonUtils.
    {hdp/hddelpersis.i}
end.
