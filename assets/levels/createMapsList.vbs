Set oFS = CreateObject("Scripting.FileSystemObject")
 Const strXmlFile = "List.json"
 Set objXMLFile = oFS.OpenTextFile(strXmlFile, 2, True, 0)
  objXMLFile.WriteLine "{"  & Chr(34) & "levels" & Chr(34) & ":["
  Set myFolder = oFS.GetFolder(".")
  numberOfFiles = myFolder.Files.Count
  currentFileNumber = 0
  For Each File In myFolder.Files
  FileLast = File.DateLastModified
  
   Block = File.Name
   
   if Block <> "List.json" Then
		Call CreateXML(Block)
   end if

  Next
 'This next call will run once the "CreateXML" has finished.
 Call CloseXML()

 Function CreateXML(Block)
  
  if right(Block,5) = ".json" Then
	 objXMLFile.WriteLine vbTab & "{" & Chr(34) & "block" & Chr(34) & ":" & Chr(34) & Block & Chr(34)& "}"
    currentFileNumber= currentFileNumber + 1
  
    if currentFileNumber < numberOfFiles-2 then
      objXMLFile.WriteLine ","
    end if
  end if
  
 End Function

 Function CloseXML()
  objXMLFile.WriteLine "]}" 
  wscript.echo "Completed XML Creation"
 End Function