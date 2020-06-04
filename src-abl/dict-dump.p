// utiliza parametros da linha de comando
// -param DiretorioSaida,Banco1,Banco2,...BancoN
using Progress.Json.ObjectModel.*.

if num-entries(session:parameter) < 2
then return.

// funcoes de apoio
function hasDB returns log (input nmDb as char):
    def var ix as int no-undo.
    do ix = 1 to num-dbs:
        if ldbname(ix) = nmDb
        then return true.
    end.
    return false.
end function.


// bloco principal
{./dict-dump.i}
def var nm-dir-aux as char no-undo.
def var nm-dir-table-aux as char no-undo.
def var nm-exec-aux as char no-undo.
def var ix-entry-aux as int no-undo.

// diretorio de saida
assign nm-dir-aux = replace(entry(1,session:parameter), "~\", "/").
if r-index(nm-dir-aux, "/") < length(nm-dir-aux)
then assign nm-dir-aux = nm-dir-aux + "/".

assign nm-dir-table-aux = nm-dir-aux + "table/".

// executa programa de saida de um banco
assign nm-exec-aux = replace(program-name(1), "dict-dump.p", "dict-dump-exec.p").

do ix-entry-aux = 2 to num-entries(session:parameter):
    if hasDB(entry(ix-entry-aux,session:parameter))
    then do:
        create alias "DICTDB" for database value(entry(ix-entry-aux,session:parameter)).
        run value(nm-exec-aux) (nm-dir-table-aux, input-output table ttTables).
        delete alias "DICTDB".
    end.
end.

run writeIndex.

// escreve index
procedure writeIndex:
    
    def var aJsonTable as JsonArray no-undo.
    def var oJsonIndex as JsonObject no-undo.
    def var oTable as JsonObject no-undo.

    oJsonIndex = new JsonObject().
    oJsonIndex:add("type", "table.index").

    aJsonTable = new JsonArray().
    for each ttTables:
        oTable = new JsonObject().
        oTable:add("name", ttTables.tableName).
        oTable:add("description", ttTables.description).
        aJsonTable:add(oTable).
    end.
    oJsonIndex:add("tables", aJsonTable).

    oJsonIndex:writefile(nm-dir-aux + "table.index.json").

    finally:
        if valid-object(oJsonIndex)
        then delete object oJsonIndex.
    end finally.
    
end procedure.
