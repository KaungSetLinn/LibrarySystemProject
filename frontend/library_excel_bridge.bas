Attribute VB_Name = "LibraryExcelBridge"
Option Explicit

' -----------------------------------------------------------------------------
' Module Name : LibraryExcelBridge
' Summary     : Exports Excel sheet data to a JSON bridge text file and imports
'               a JSON bridge text file back into Excel sheets.
' Author      : Y.Toyoda
' Created     : 2026-04-17
' Notes       : Import this module into the workbook and save the workbook as
'               .xlsm if macro execution is required.
' -----------------------------------------------------------------------------

Public Sub ExportLibraryBridgeText()
    ' ブリッジ JSON 文字列を生成する。
    Dim jsonText As String
    jsonText = BuildBridgeJson()

    ' 保存先ファイルを選択する。
    Dim filePath As Variant
    filePath = Application.GetSaveAsFilename( _
        InitialFileName:="library_bridge_" & Format(Now, "yyyymmdd_hhnnss") & ".txt", _
        FileFilter:="Text Files (*.txt),*.txt")

    ' キャンセル時は終了する。
    If VarType(filePath) = vbBoolean Then Exit Sub

    ' UTF-8 でファイルへ保存する。
    WriteUtf8Text CStr(filePath), jsonText

    ' 完了メッセージを表示する。
    MsgBox "ブリッジファイルを出力しました。" & vbCrLf & filePath, vbInformation
End Sub

Public Sub ImportLibraryBridgeText()
    ' 取込元ファイルを選択する。
    Dim filePath As Variant
    filePath = Application.GetOpenFilename("Text Files (*.txt),*.txt")

    ' キャンセル時は終了する。
    If VarType(filePath) = vbBoolean Then Exit Sub

    ' UTF-8 テキストを読み込む。
    Dim jsonText As String
    jsonText = ReadUtf8Text(CStr(filePath))

    ' JSON を解析して各シートへ反映する。
    ApplyBridgeJson jsonText

    ' 完了メッセージを表示する。
    MsgBox "ブリッジファイルを取り込みました。", vbInformation
End Sub

Public Function BuildBridgeJson() As String
    ' Dictionary を使って JSON 構造を組み立てる。
    Dim root As Object
    Set root = CreateObject("Scripting.Dictionary")

    root("dbType") = "Excel"
    root("exportedAt") = Format$(Now, "yyyy-mm-dd\Thh:nn:ss")
    root("users") = SheetRowsToCollection("users")
    root("books") = SheetRowsToCollection("books")
    root("reservations") = SheetRowsToCollection("reservations")
    root("history") = SheetRowsToCollection("reservation_history")
    root("loans") = SheetRowsToCollection("loans")
    root("notifications") = SheetRowsToCollection("notifications")
    root("favorites") = SheetRowsToCollection("favorites")
    root("auditLog") = SheetRowsToCollection("audit_log")

    BuildBridgeJson = JsonStringify(root)
End Function

Public Sub ApplyBridgeJson(ByVal jsonText As String)
    ' JSON パーサが必要なため、VBA-JSON(JsonConverter.bas) が存在する場合は利用する。
    ' 存在しない場合は、bridge_example シートへ貼り付けて手動反映できるようにする。
    On Error GoTo Fallback

    Dim parsed As Object
    Set parsed = JsonConverter.ParseJson(jsonText)

    WriteCollectionToSheet "users", parsed("users")
    WriteCollectionToSheet "books", parsed("books")
    WriteCollectionToSheet "reservations", parsed("reservations")
    WriteCollectionToSheet "reservation_history", parsed("history")
    WriteCollectionToSheet "loans", parsed("loans")
    WriteCollectionToSheet "notifications", parsed("notifications")
    WriteCollectionToSheet "favorites", parsed("favorites")
    WriteCollectionToSheet "audit_log", parsed("auditLog")
    Exit Sub

Fallback:
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Worksheets("bridge_example")
    ws.Range("A2").Value = jsonText
    MsgBox "JsonConverter が見つからないため、bridge_example シート A2 に JSON を配置しました。" & vbCrLf & _
           "VBA-JSON (JsonConverter.bas) を追加後に ApplyBridgeJson を再実行してください。", vbExclamation
End Sub

Private Function SheetRowsToCollection(ByVal sheetName As String) As Collection
    ' シート内容を 1 行ずつ Collection に変換する。
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Worksheets(sheetName)

    Dim lastRow As Long
    Dim lastCol As Long
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    lastCol = ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column

    Dim rows As New Collection
    Dim r As Long
    For r = 2 To lastRow
        If Application.WorksheetFunction.CountA(ws.Rows(r)) > 0 Then
            Dim item As Object
            Set item = CreateObject("Scripting.Dictionary")

            Dim c As Long
            For c = 1 To lastCol
                item(CStr(ws.Cells(1, c).Value)) = ws.Cells(r, c).Value
            Next c
            rows.Add item
        End If
    Next r

    Set SheetRowsToCollection = rows
End Function

Private Sub WriteCollectionToSheet(ByVal sheetName As String, ByVal items As Object)
    ' Collection/Array の内容を指定シートへ上書きする。
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Worksheets(sheetName)

    Dim lastRow As Long
    Dim lastCol As Long
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    lastCol = ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column

    If lastRow >= 2 Then
        ws.Range(ws.Cells(2, 1), ws.Cells(lastRow, lastCol)).ClearContents
    End If

    Dim r As Long
    r = 2

    Dim item As Variant
    For Each item In items
        Dim c As Long
        For c = 1 To lastCol
            Dim key As String
            key = CStr(ws.Cells(1, c).Value)
            If item.Exists(key) Then
                ws.Cells(r, c).Value = item(key)
            Else
                ws.Cells(r, c).Value = ""
            End If
        Next c
        r = r + 1
    Next item
End Sub

Private Function JsonStringify(ByVal value As Variant) As String
    ' Dictionary / Collection / scalar を JSON 文字列に変換する簡易実装。
    If IsObject(value) Then
        If TypeName(value) = "Dictionary" Then
            Dim parts() As String
            ReDim parts(0 To value.Count - 1)
            Dim i As Long
            Dim key As Variant
            i = 0
            For Each key In value.Keys
                parts(i) = QuoteJson(CStr(key)) & ":" & JsonStringify(value(key))
                i = i + 1
            Next key
            JsonStringify = "{" & Join(parts, ",") & "}"
        ElseIf TypeName(value) = "Collection" Then
            Dim arr() As String
            ReDim arr(1 To value.Count)
            Dim j As Long
            For j = 1 To value.Count
                arr(j) = JsonStringify(value(j))
            Next j
            JsonStringify = "[" & Join(arr, ",") & "]"
        Else
            JsonStringify = QuoteJson(CStr(value))
        End If
    ElseIf VarType(value) = vbBoolean Then
        JsonStringify = LCase$(CStr(value))
    ElseIf IsNumeric(value) And value <> "" Then
        JsonStringify = CStr(value)
    ElseIf IsNull(value) Or value = "" Then
        JsonStringify = "\"\""
    Else
        JsonStringify = QuoteJson(CStr(value))
    End If
End Function

Private Function QuoteJson(ByVal text As String) As String
    ' JSON 用に最低限のエスケープを実施する。
    text = Replace(text, "\\", "\\\\")
    text = Replace(text, "\"", "\\\"")
    text = Replace(text, vbCrLf, "\n")
    text = Replace(text, vbCr, "\n")
    text = Replace(text, vbLf, "\n")
    QuoteJson = "\"" & text & "\""
End Function

Private Sub WriteUtf8Text(ByVal filePath As String, ByVal text As String)
    ' ADODB.Stream を使って UTF-8 保存する。
    Dim stm As Object
    Set stm = CreateObject("ADODB.Stream")
    stm.Type = 2
    stm.Charset = "utf-8"
    stm.Open
    stm.WriteText text
    stm.SaveToFile filePath, 2
    stm.Close
End Sub

Private Function ReadUtf8Text(ByVal filePath As String) As String
    ' ADODB.Stream を使って UTF-8 読み込みする。
    Dim stm As Object
    Set stm = CreateObject("ADODB.Stream")
    stm.Type = 2
    stm.Charset = "utf-8"
    stm.Open
    stm.LoadFromFile filePath
    ReadUtf8Text = stm.ReadText
    stm.Close
End Function
