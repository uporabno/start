var pluginsNS= {

getAllFunctions: function getAllFunctions(){ 
    var myfunctions = [];
    for (var l in this){
        if (this.hasOwnProperty(l) && this[l] instanceof Function && !/myfunctions/i.test(l)) {
            myfunctions.push(this[l]);
        }
    }
    return myfunctions;
},

/* -------------------------------------------------------------------------- */

sample: function sample(textArea, textAreaUndo) {
// Sample
/*+
Description of sample functions between (star and plus) and (plus and star).
...
End of description.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        stringsOut.push("A-"+stringsIn[i]+"-E");
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
    
    // return false; // cancel
},

/* -------------------------------------------------------------------------- */

Calculate: function Calculate(textArea, textAreaUndo) {
//  Calculate
/*+
    Evaluates or executes an argument. 
    Example: Math.cos(3.14/3)
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];
    var error = false;

    for (var i=0; i < stringsIn.length; i++) {
        if (error == false) {
            try {
                stringsOut.push(eval(stringsIn[i]));
            }
            catch(err) {
                toastError("Data error: " + err.message, "Calculate plugin");
                error = true;
            }
        }
    }

    if (error == false) {
        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
        return true;
    }
    else
        return false;
},

/* -------------------------------------------------------------------------- */

separatorBeforeDuplicates: function separatorBeforeDuplicates(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Convert_TabDelimitedTextToTable: function Convert_TabDelimitedTextToTable(textArea, textAreaUndo) {
//  Convert - Tab delimited text to table
/*+
    Convert tab delimited text to table using separator.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    var separator = prompt("Enter cols separator:", " | ");
    if (separator != null) {
        // search for max length
        var columnLen = [];
        for (var i=0; i < stringsIn.length; i++) {
            var cols = stringsIn[i].split("\t");
            for (var c=0; c < cols.length; c++) {
                if (columnLen.length-1 < c) 
                    columnLen[c] = cols[c].length;
                else if (cols[c].length > columnLen[c])
                    columnLen[c] = cols[c].length;
            }
        }
        // do
        for (var i=0; i < stringsIn.length; i++) {
            var cols = stringsIn[i].split("\t");
            stringsOut[i] = "";
            for (var c=0; c < cols.length; c++) {
                if (stringsOut[i] != "") 
                    stringsOut[i] = stringsOut[i] + separator;
                stringsOut[i] = stringsOut[i] + rpad(cols[c], columnLen[c]);
            }
        }
        // header line
        var headerLine = "";
        for (var c=0; c < columnLen.length; c++) {
            // separator
            if (headerLine != "") {
                headerLine = headerLine + separator.replace(/ /g,"-");
            }
            // columns
            for (var d=0; d < columnLen[c]; d++) {
                headerLine = headerLine + "-";
            }
        }
        stringsOut.splice(1, 0, headerLine);
    
        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
    }
    else
        return false;
},

/* -------------------------------------------------------------------------- */

Convert_TabDelimitedTextToText: function Convert_TabDelimitedTextToText(textArea, textAreaUndo) {
//  Convert - Tab delimited text to text
/*+
    Convert tab delimited text to text using separator.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    var separator = prompt("Enter cols separator:", " | ");
    if (separator != null) {
        // search for max length
        var columnLen = [];
        for (var i=0; i < stringsIn.length; i++) {
            var cols = stringsIn[i].split("\t");
            for (var c=0; c < cols.length; c++) {
                if (columnLen.length-1 < c) 
                    columnLen[c] = cols[c].length;
                else if (cols[c].length > columnLen[c])
                    columnLen[c] = cols[c].length;
            }
        }
        // do
        for (var i=0; i < stringsIn.length; i++) {
            var cols = stringsIn[i].split("\t");
            stringsOut[i] = "";
            for (var c=0; c < cols.length; c++) {
                if (stringsOut[i] != "") 
                    stringsOut[i] = stringsOut[i] + separator;
                stringsOut[i] = stringsOut[i] + rpad(cols[c], columnLen[c]);
            }
        }

        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
    }
    else
        return false;
},

/* -------------------------------------------------------------------------- */

separatorBeforeDuplicates: function separatorBeforeDuplicates(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Duplicates_List_Count: function Duplicates_List_Count(textArea, textAreaUndo) {
//  Duplicates - List - Count
/*+
    List and count all duplicates.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    stringsIn.sort();    

    var lastDuplicate = '';
    for (var i=0; i < stringsIn.length - 1; i++) {
        if (stringsIn[i] == stringsIn[i+1]) {
            if (lastDuplicate != stringsIn[i]) {
                lastDuplicate = stringsIn[i];
                var c = 0;
                for (var j=0; j < stringsIn.length-1; j++) {
                    if (stringsIn[j] == lastDuplicate) c = c + 1;
                }
                stringsOut.push(lpad0(c,6) + ' ' + stringsIn[i]);
            }
        }
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Duplicates_List_Count_All: function Duplicates_List_Count_All(textArea, textAreaUndo) {
//  Duplicates - List - Count - All
/*+
    List and count all duplicates and singles.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    stringsIn.sort();    

    var lastDuplicate = '';
    for (var i=0; i < stringsIn.length - 1; i++) {
        if (stringsIn[i] == stringsIn[i+1]) {
            if (lastDuplicate != stringsIn[i]) {
                lastDuplicate = stringsIn[i];
                var c = 0;
                for (var j=0; j < stringsIn.length-1; j++) {
                    if (stringsIn[j] == lastDuplicate) c = c + 1;
                }
                stringsOut.push(lpad0(c,6) + ' ' + stringsIn[i]);
            }
        }
        else {
            if (i < stringsIn.length-1-1) {
                if (stringsIn[i+1] != stringsIn[i+2]) {
                    stringsOut.push(lpad0(1,6)+' '+ stringsIn[i+1]);  
                }
            }
        }
    }
    if (stringsIn[stringsIn.length-1-1] != stringsIn[stringsIn.length-1]) {
        stringsOut.push(lpad0(1,6) + ' ' + stringsIn[stringsIn.length-1]);  
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Duplicates_List: function Duplicates_List(textArea, textAreaUndo) {
//  Duplicates - List
/*+
    List all duplicates.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    stringsIn.sort();    

    var lastDuplicate = '';
    for (var i=0; i < stringsIn.length - 1; i++) {
        if (stringsIn[i] == stringsIn[i+1]) {
            if (lastDuplicate != stringsIn[i]) {
                lastDuplicate = stringsIn[i];
                stringsOut.push(stringsIn[i]);
            }
        }
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Duplicates_Remove: function Duplicates_Remove(textArea, textAreaUndo) {
//  Duplicates - Remove
/*+
    Remove duplicates.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    stringsIn.sort();    
    
    for (var i=0; i < stringsIn.length; i++) {
        if (i == 0)
          stringsOut.push(stringsIn[i]);
        else
            if (stringsIn[i] != stringsIn[i-1])
                stringsOut.push(stringsIn[i]);
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

separatorBeforeLines: function separatorBeforeLines(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Lines_AddLines: function Lines_AddLines(textArea, textAreaUndo) {
//  Lines - Add lines
/*+
    Add constant text lines at end of file.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    var inAddText = prompt("Add text::", "");    
    var inAddRepeat = prompt("Number of repeats:", "");    
    
    if (inAddRepeat != null && !isNaN(inAddRepeat) && inAddRepeat > 0) {    
        stringsOut = stringsIn;
        for (var i=0; i < inAddRepeat; i++) {
            stringsOut.push(inAddText);
        }

        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
    }
    else if (inAddRepeat == null)
       return false;
    else {
        toastError("Invalid value: " + inAddRepeat, "Plugin");
        return false;
    }
},

/* -------------------------------------------------------------------------- */

Lines_AddTextAtPosition: function Lines_AddTextAtPosition(textArea, textAreaUndo) {
// Lines - Add text at position
/*+
    Add text in all lines at position
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    var inAddText = prompt("Text for insert:", "	");
    var inAddPos = prompt("Text insert in position:", "");
    
    if (inAddPos != null && !isNaN(inAddPos) && inAddPos > 0) {    
        for (var i=0; i < stringsIn.length; i++) {
            if (stringsIn[i].length > inAddPos-1)
                stringsOut.push(stringsIn[i].substr(0,inAddPos-1) + inAddText + stringsIn[i].substr(inAddPos-1, stringsIn[i].length) );
            else
                stringsOut.push(stringsIn[i]);
        }

        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
    }
    else if (inAddPos == null)
       return false;
    else {
        toastError("Invalid value: " + inAddPos, "Plugin");
        return false;
    }
},

/* -------------------------------------------------------------------------- */

Lines_Cut_13Left: function Lines_Cut_13Left(textArea, textAreaUndo) {
//  Lines - Cut - 13 left
/*+
    Cat 13 chars on left.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        stringsOut.push(stringsIn[i].substr(13,stringsIn[i].length));
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Lines_Cut_XxLeft: function Lines_Cut_XxLeft(textArea, textAreaUndo) {
//  Lines - Cut - XX left
/*+
    Cat xx chars on left.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    var inLen = prompt("Enter how many chars to remove on left:", "");    
    if (inLen != null && !isNaN(inLen) && inLen > 0) {    
        for (var i=0; i < stringsIn.length; i++) {
            stringsOut.push(stringsIn[i].substr(inLen,stringsIn[i].length));
        }

        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
    }
    else if (inLen == null)
       return false;
    else {
        toastError("Invalid value: " + inLen, "Plugin");
        return false;
    }
},

/* -------------------------------------------------------------------------- */

Lines_FirstLetterInLineToUpperOnly: function Lines_FirstLetterInLineToUpperOnly(textArea, textAreaUndo) {
//  Lines - First letter in line to upper only
/*+
    Convert first letter in line to upper (other unchanged).
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++)
        stringsOut.push(stringsIn[i].substr(0,1).toLocaleUpperCase() + stringsIn[i].substr(1,stringsIn[i].length-1));

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Lines_FirstLetterInLineToUpper: function Lines_FirstLetterInLineToUpper(textArea, textAreaUndo) {
//  Lines - First letter in line to upper
/*+
    Convert first letter in line to upper (other to lower).
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++)
        stringsOut.push(stringsIn[i].substr(0,1).toLocaleUpperCase() + stringsIn[i].substr(1,stringsIn[i].length-1).toLocaleLowerCase());

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Lines_MoveLeft: function Lines_MoveLeft(textArea, textAreaUndo) {
//  Lines - Move - 2 left
/*+
    Move lines 2 spaces left.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        if (stringsIn[i].substr(0,2) == "  ")
            stringsOut.push(stringsIn[i].substr(2,stringsIn[i].length-2));
        else if (stringsIn[i].substr(0,1) == " ")
            stringsOut.push(stringsIn[i].substr(1,stringsIn[i].length-1));
        else
            stringsOut.push(stringsIn[i]);
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Lines_MoveRight: function Lines_MoveRight(textArea, textAreaUndo) {
//  Lines - Move - 2 right
/*+
    Move lines 2 spaces right.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        stringsOut.push("  "+stringsIn[i]);
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Lines_Replace_Multi_PrepareParameter: function Lines_Replace_Multi_PrepareParameter(textArea, textAreaUndo) {
// *Lines - Replace - Multi - Prepare parameter
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Replace_Multi: function Lines_Replace_Multi(textArea, textAreaUndo) {
// *Lines - Replace - Multi
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Replace_OdstraniSumnike: function Lines_Replace_OdstraniSumnike(textArea, textAreaUndo) {
// *Lines - Replace - Odstrani šumnike
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Replace: function Lines_Replace(textArea, textAreaUndo) {
// *Lines - Replace
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Reverse_Lines: function Lines_Reverse_Lines(textArea, textAreaUndo) {
// *Lines - Reverse - Lines
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Reverse_TextInLines: function Lines_Reverse_TextInLines(textArea, textAreaUndo) {
// *Lines - Reverse - Text in lines
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Reverse_WordsInLines: function Lines_Reverse_WordsInLines(textArea, textAreaUndo) {
// *Lines - Reverse - Words in lines
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Sum: function Lines_Sum(textArea, textAreaUndo) {
// *Lines - Sum
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_Summary: function Lines_Summary(textArea, textAreaUndo) {
// *Lines - Summary
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Lines_WhereSubstring_Delete: function Lines_WhereSubstring_Delete(textArea, textAreaUndo) {
//  Lines - Where substring - Delete
/*+
    Delete lines with substring.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    var sub = prompt("Enter substring:", "");
    if (sub != null) {
        for (var i=0; i < stringsIn.length; i++) {
            lineIn = stringsIn[i];
            loc = lineIn.toLocaleUpperCase().indexOf(sub.toLocaleUpperCase());
            if (loc == -1)
                stringsOut.push(lineIn);
        }

        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
    }
    else
        return false;
},

/* -------------------------------------------------------------------------- */

Lines_WhereSubstring_Keep: function Lines_WhereSubstring_Keep(textArea, textAreaUndo) {
//  Lines - Where substring - Keep
/*+
    Keep only lines with substring.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    var sub = prompt("Enter substring:", "");
    if (sub != null) {
        for (var i=0; i < stringsIn.length; i++) {
            lineIn = stringsIn[i];
            loc = lineIn.toLocaleUpperCase().indexOf(sub.toLocaleUpperCase());
            if (loc != -1)
                stringsOut.push(lineIn);
        }

        textAreaUndo.value = textArea.value;
        textArea.value = stringsOut.join("\n");
    }
    else
        return false;
},

/* -------------------------------------------------------------------------- */

separatorBeforeOracle: function separatorBeforeOracle(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Oracle_AddTablespace: function Oracle_AddTablespace(textArea, textAreaUndo) {
// *Oracle - Add tablespace
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Oracle_MakeConstants: function Oracle_MakeConstants(textArea, textAreaUndo) {
// *Oracle - Make constants
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Oracle_MakeZurnal_Old: function Oracle_MakeZurnal_Old(textArea, textAreaUndo) {
// *Oracle - Make zurnal - old
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Oracle_Names_Java2Oracle: function Oracle_Names_Java2Oracle(textArea, textAreaUndo) {
//  Oracle - Names - Java 2 Oracle
/*+
    Convert Java names to Oracle names.
    Sample: customerNameFirst -> customer_name_first
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        var lineIn = stringsIn[i];
        var newLine = '';
        for (var c=0; c < lineIn.length; c++) {
        if (lineIn.substr(c,1).toLocaleUpperCase() == lineIn.substr(c,1) //&&
               // lineIn.substr(c,1).toLocaleUpperCase() != lineIn.substr(c,1).toLocaleLowerCase()
                )
                newLine = newLine + '_' + lineIn.substr(c,1).toLocaleLowerCase();
            else
                newLine = newLine + lineIn.substr(c,1).toLocaleLowerCase();
        }
        if (lineIn.substr(0,1) == 'l')
          newLine = newLine[0] + '_' + newLine.substr(1,newLine.length);
        stringsOut.push(newLine);
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Oracle_Names_Oracle2Java: function Oracle_Names_Oracle2Java(textArea, textAreaUndo) {
//  Oracle - Names - Oracle 2 Java
/*+
    Convert Oracle names to Java names.
    Sample: customer_name_first -> customerNameFirst
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        var subNames = stringsIn[i].split("_");
        var newLine = '';
        for (var s=0; s < subNames.length; s++) {
            if (s==0) 
                newLine = subNames[s].toLocaleLowerCase();
            else if (s==1 && subNames[0].toLocaleUpperCase() == 'L') 
                newLine = newLine + subNames[s].toLocaleLowerCase();
            else {
                newLine = newLine + subNames[s].substr(0,1).toLocaleUpperCase() + subNames[s].substr(1,subNames[s].length).toLocaleLowerCase();
            }
        }
        stringsOut.push(newLine);
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Oracle_Oracle2JavaMapping: function Oracle_Oracle2JavaMapping(textArea, textAreaUndo) {
// *Oracle - Oracle 2 Java mapping
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Oracle_Script_Grant2Revoke: function Oracle_Script_Grant2Revoke(textArea, textAreaUndo) {
// *Oracle - Script - Grant 2 Revoke
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

Oracle_TraceFields: function Oracle_TraceFields(textArea, textAreaUndo) {
// *Oracle - Trace fields
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

separatorBeforeParse: function separatorBeforeParse(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Parse_CommaSeparatedValues_Reverse: function Parse_CommaSeparatedValues_Reverse(textArea, textAreaUndo) {
//  Parse - Comma separated values - Reverse
/*+
    Convert comma separated values to list (reverse order).
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        var cols = stringsIn[i].split(",");
        for (var c=cols.length-1; c>=0; c--)
            stringsOut.push(cols[c].trim());
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Parse_CommaSeparatedValues: function Parse_CommaSeparatedValues(textArea, textAreaUndo) {
//  Parse - Comma separated values
/*+
    Convert comma separated values to list.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        var cols = stringsIn[i].split(",");
        for (var c=0; c < cols.length; c++)
            stringsOut.push(cols[c].trim());
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Parse_Dir2List: function Parse_Dir2List(textArea, textAreaUndo) {
// *Parse - Dir 2 List
/*+
    ADD Description
+*/
  alert("UnderConstruction");
},

/* -------------------------------------------------------------------------- */

separatorBeforeTable: function separatorBeforeTable(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Table_Pivot: function Table_Pivot(textArea, textAreaUndo) {
//  Table - Pivot
/*+
    Pivot table.
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    // get max cols
    var maxCols = 0;
    for (var i=0; i < stringsIn.length; i++)
        if (maxCols < stringsIn[i].split("\t").length)
          maxCols = stringsIn[i].split("\t").length;
    // do
    for (var i=0; i < stringsIn.length; i++) {
        var cols = stringsIn[i].split("\t");
        for (var c=0; c < /*cols.length*/ maxCols; c++) {
            if (stringsOut[c] == null) 
                stringsOut[c] = "";
            else
                stringsOut[c] = stringsOut[c] + "\t*";
            if (cols[c] == null) cols[c] = "";
            stringsOut[c] = stringsOut[c] + cols[c];
        }
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

separatorBeforeRazno: function separatorBeforeRazno(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Parse_MPZT: function Parse_MPZT(textArea, textAreaUndo) {
//  Other - Parse - Parameter paser MPZT
/*+
    Other - Parse - Parameter paser MPZT
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        var cols = stringsIn[i].split("&");
        var newLine = "";
        for (var c=cols.length-1; c>=0; c--) {
            if (cols[c].substr(0,3) == 'p7=') newLine = newLine + " - " + cols[c];
            if (cols[c].substr(0,3) == 'p9=') newLine = newLine + " - " + cols[c];
            if (cols[c].substr(0,4) == 'p10=') newLine = newLine + " - " + cols[c];
            if (cols[c].substr(0,4) == 'p17=') newLine = newLine + " - " + cols[c];
        }
        stringsOut.push(newLine);
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

separatorBeforeUtil: function separatorBeforeUtil(textArea, textAreaUndo) {
// Separator
},

/* -------------------------------------------------------------------------- */

Util_AsciiCode: function Util_AsciiCode(textArea, textAreaUndo) {
//  Util - Ascii code
/*+
    For all characters return ASCII code
+*/
    var stringsIn = textArea.value.replace("\r","").split("\n");
    var stringsOut = [];

    for (var i=0; i < stringsIn.length; i++) {
        var oldLine = stringsIn[i];
        var newLine = '';
        for (var s=0; s < oldLine.length; s++) {
            newLine = newLine + oldLine[s] + '{' + oldLine[s].charCodeAt(0) + '}';
        }
        stringsOut.push(newLine);
    }

    textAreaUndo.value = textArea.value;
    textArea.value = stringsOut.join("\n");
},

/* -------------------------------------------------------------------------- */

Util_Time: function Util_Time(textArea, textAreaUndo) {
// *Util - Time
/*+
    ADD Description
+*/
  alert("UnderConstruction");
}

/* -------------------------------------------------------------------------- */
// zadnja ima };
};

//
// Internal
//
function rpad(str, len) {
    var s = str + "                                                                                                                                          ";
    s = s.substr(0, len);
    return s;
}

function lpad0(str, len) {
    var s = "0000000000000000000000000000000000000000000000000000000000" + str;
    s = s.slice(-len);
    return s;
}
