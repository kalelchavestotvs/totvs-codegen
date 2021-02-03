/*******************************************************************************
 CT.............: CT_#[app.component,PascalCase]#_Alterar.p
 Objetivo ......: Caso de testes para alterar um registro
 ******************************************************************************/
using classes.test.*.

{hdp/hdrunpersis.iv "new"}
// includes com definicoes de temp-tables utilizadas no caso de teste
{#[app.module]#/bosau/bosau-#[app.component]#.i}
{rtp/rtrowerror.i}

// temp-tables utilizadas para comparacao de dados de saida
def temp-table GPS_#[app.component,PascalCase]# like tmp#[app.component,AblTempTable,PascalCase]#.
def temp-table GPS_RowErrors like RowErrors.

def var h-bosau-#[app.component]#-aux as handle no-undo.
def var oAssert as GpsAssert no-undo.
def var cFilePath as char no-undo.

procedure piBeforeExecute:
	file-info:file-name = "dados-entrada/#[app.team]#/#[app.component,PascalCase]#".
	assign cFilePath = replace(file-info:full-pathname, "~\", "/")
	       cFilePath = cFilePath + "/".
end procedure.

procedure piExecute:

    define output parameter lPassed as logical  no-undo.
    define output parameter cText   as longchar no-undo.

    oAssert = new GpsAssert().

    do transaction on error undo,leave:
        run executa-teste no-error.
        oAssert:checkError("Erro na execucao do teste").
        undo.
    end.

    assign lPassed = oAssert:passed
           cText   = oAssert:errorMessage.

    finally:
        delete object oAssert.
        {hdp/hddelpersis.i}
    end finally.

end procedure.

procedure executa-teste:

    // define variaveis de controle de entrada e saida
	def var oFd#[app.component,PascalCase]# as AssertFieldCollection no-undo.
	def var oFdRowErrors as AssertFieldCollection no-undo.

    // variaveis de controle
    def var lError as log no-undo.
    def var cReturn as char no-undo.
    def var h-bosau-#[app.component]#-aux as handle no-undo.

	// lista de campos a adicionar/ignorar para na comparacao do resultado
	run cria-configuracao-campos(
		input true,
		input "@[app.fields,!ablFixedValue=]@?[!isFirst]?,?[end]?#[field]#@[end]@",
		output oFd#[app.component,PascalCase]#).
	// lista de campos a adicionar/ignorar para na comparacao da rowErrors
	run cria-configuracao-campos(
		input true,
		input "",
		output oFdRowErrors).

    // atribui dados de entrada/saida
	for last #[app.table]#:
        create tmp#[app.component,AblTempTable,PascalCase]#.
        buffer-copy #[app.table]# to tmp#[app.component,AblTempTable,PascalCase]#.

        // altera campos
        assign
@[app.fields,!isPrimary&isEditable]@
            tmp#[app.component,AblTempTable,PascalCase]#.#[field]#  = ?[ablType=logical]?not ?[end]?tmp#[app.component,AblTempTable,PascalCase]#.#[field]#?[ablType=character]? + "Z"?[end]??[!ablType=character&!ablType=logical]? + 1?[end]?
@[end]@.

        create GPS_#[app.component,PascalCase]#.
        buffer-copy tmp#[app.component,AblTempTable,PascalCase]# to GPS_#[app.component,PascalCase]#.
    end.

    // executa teste
    {hdp/hdrunpersis.i "#[app.module]#/bosau/bosau-#[app.component]#.p" "h-bosau-#[app.component]#-aux"}
    run updateRecord in h-bosau-#[app.component]#-aux (
		input-output table tmp#[app.component,AblTempTable,PascalCase]#,
		input-output table rowErrors
    ) no-error.

    // processa saida
    assign cReturn = return-value
           lError  = error-status:error.

    // realiza comparacoes
	oAssert:false("error-status", lError).
	oAssert:matchTable(temp-table GPS_#[app.component,PascalCase]#:default-buffer-handle, temp-table tmp#[app.component,AblTempTable,PascalCase]#:default-buffer-handle, oFd#[app.component,PascalCase]#).
	oAssert:matchTable(temp-table GPS_RowErrors:default-buffer-handle, temp-table rowErrors:default-buffer-handle, oFdRowErrors).

    finally:
		delete object oFd#[app.component,PascalCase]#.
		delete object oFdRowErrors.
    end finally.
end.

procedure cria-configuracao-campos:
    def input param lIgnorar as log no-undo.
    def input param cListaCampos as char no-undo.
    def output param oFields as AssertFieldCollection no-undo.

    def var iItem as int no-undo.

    oFields = new AssertFieldCollection().

    if lIgnorar
    then do:
        oFields:returnSameFieldWhenNotFound = true.
        repeat iItem = 1 to num-entries(cListaCampos):
            oFields:ignore(entry(iItem, cListaCampos)).
        end.
    end.
    else do:
        oFields:returnSameFieldWhenNotFound = false.
        repeat iItem = 1 to num-entries(cListaCampos):
            oFields:add(entry(iItem, cListaCampos)).
        end.
    end.
end procedure.

procedure piAfterExecute:
end procedure.
