using Progress.Json.ObjectModel.*.

{./dict-dump.i}

def input param nm-dir-par as char no-undo.
def input-output param table for ttTables.

def var aJsonField as JsonArray no-undo.
def var aJsonIndex as JsonArray no-undo.
def var oTable as JsonObject no-undo.
def var oField as JsonObject no-undo.
def var oIndex as JsonObject no-undo.

def var isPK as logical no-undo.

def buffer dbFile for dictdb._file.
def buffer dbField for dictdb._field.
def buffer dbIndex for dictdb._index.
def buffer dbIndexField for dictdb._index-field.

for each dbFile
    where not dbFile._hidden:

    create ttTables.
    assign ttTables.tableName = dbFile._file-name
           ttTables.description = dbFile._Desc.

    oTable = new JsonObject().
    oTable:add("type", "table").
    oTable:add("name", dbFile._file-name).
    

    aJsonField = new JsonArray().
    oTable:add("fields", aJsonField).

    for each dbField
       where dbField._file-recid = recid(dbFile):

        oField = new JsonObject().
        oField:add("name", dbField._field-name).
        oField:add("description", dbField._Desc).
        oField:add("type", dbField._data-type).
        oField:add("format", dbField._format).
        oField:add("mandatory", dbField._mandatory).

        aJsonField:add(oField).
    end.

    aJsonIndex = new JsonArray().
    oTable:add("indexes", aJsonIndex).

    for each dbIndex
        where dbIndex._file-recid = recid(dbFile):

            assign isPK = (recid(dbIndex) = dbFile._prime-index).

            oIndex = new JsonObject().
            oIndex:add("name", dbIndex._index-name).
            oIndex:add("primary", isPK).
            oIndex:add("unique", dbIndex._unique).

            aJsonField = new JsonArray().
            oIndex:add("fields", aJsonField).
            for each dbIndexField
                where dbIndexField._index-recid = recid(dbIndex),
                first dbField
                where recid(dbField) = dbIndexField._field-recid:
                    aJsonField:add(dbField._field-name).
            end.
            
            aJsonIndex:add(oIndex).
    end.

    oTable:writefile(nm-dir-par + dbFile._file-name + ".json").
end.
