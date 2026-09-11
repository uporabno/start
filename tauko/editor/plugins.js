// AUTO-GENERIRANO - ne urejati rocno^!
// Pozeni _plugins_\_build.cmd za obnovo

var pluginList = [
{
  id: 'separator---convert',
  ime: '── Convert ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'calculate',
  ime: 'Calculate',
  ikona: '🧮',
  opis: 'Evaluates or executes an argument.',
  opisDolg: 'Example: Math.cos(3.14/3)',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    for (var i = 0; i < v.length; i++) {
      try { out.push(eval(v[i])); }
      catch(e) { await alert('Napaka: ' + e.message); return false; }
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---align',
  ime: '── Align ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'align_by_char',
  ime: 'Align - Align by char',
  ikona: '🎯',
  opis: 'Align lines by character.',
  opisDolg: 'Finds max position of the align char, pads all lines to that position. Fill char default is space.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var charBreak = await prompt('Align by char:', '=>');
    if (charBreak === null || charBreak === '') return false;
    var charFillRaw = await prompt('Fill by char (space):', ' ');
    if (charFillRaw === null) return false;
    var charFill = charFillRaw.length > 0 ? charFillRaw[0] : ' ';
    var v = ta.value.replace(/\r/g,'').split('\n');
    var charU = charBreak.toUpperCase();
    var maxPos = 0;
    v.forEach(function(vr) {
      var pos = vr.toUpperCase().indexOf(charU);
      if (pos > maxPos) maxPos = pos;
    });
    var out = v.map(function(vr) {
      var pos = vr.toUpperCase().indexOf(charU);
      if (pos < 0) return vr;
      var pad = charFill.repeat(maxPos - pos);
      return vr.substring(0, pos) + pad + vr.substring(pos);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'align_tab_to_table',
  ime: 'Align - Tab delimited text to table',
  ikona: '📊',
  opis: 'Align tab delimited text to table (with header separator).',
  opisDolg: 'Aligns columns to max width. After first row adds a dash separator line. Asks for column separator (default " | ").',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var sep = await prompt('Enter cols separator:', ' | ');
    if (sep === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var cLen = [];
    v.forEach(function(vr) {
      vr.split('\t').forEach(function(col, i) {
        if (!cLen[i] || col.length > cLen[i]) cLen[i] = col.length;
      });
    });
    var dashSep = sep.split('').map(function(c) { return c === ' ' ? '-' : c; }).join('');
    var out = [];
    v.forEach(function(vr, idx) {
      var cols = vr.split('\t');
      var line = cols.map(function(col, i) {
        var s = col;
        while (s.length < (cLen[i] || 0)) s += ' ';
        return s;
      }).join(sep);
      out.push(line);
      if (idx === 0) {
        var dash = cLen.map(function(len) { return '-'.repeat(len || 0); }).join(dashSep);
        out.push(dash);
      }
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'align_tab_to_text',
  ime: 'Align - Tab delimited text to text',
  ikona: '📄',
  opis: 'Align tab delimited text to text (no header separator).',
  opisDolg: 'Aligns columns to max width. No dash line after header. Asks for column separator (default " | ").',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var sep = await prompt('Enter cols separator:', ' | ');
    if (sep === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var cLen = [];
    v.forEach(function(vr) {
      vr.split('\t').forEach(function(col, i) {
        if (!cLen[i] || col.length > cLen[i]) cLen[i] = col.length;
      });
    });
    var out = v.map(function(vr) {
      var cols = vr.split('\t');
      return cols.map(function(col, i) {
        var s = col;
        while (s.length < (cLen[i] || 0)) s += ' ';
        return s;
      }).join(sep);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---duplicates',
  ime: '── Duplicates ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'duplicates_list',
  ime: 'Duplicates - List',
  ikona: '🪞',
  opis: 'List all duplicate values.',
  opisDolg: 'Returns only values that appear more than once (sorted, no duplicates in output).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    v.sort();
    var out = [], last = '';
    for (var i = 0; i < v.length - 1; i++) {
      if (v[i] === v[i+1] && last !== v[i]) {
        last = v[i];
        out.push(v[i]);
      }
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'duplicates_list_count',
  ime: 'Duplicates - List - Count',
  ikona: '🔢',
  opis: 'List duplicate values with count.',
  opisDolg: 'Shows each value that appears more than once with its total count.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    v.sort();
    var out = [];
    var i = 0;
    while (i < v.length) {
      var cnt = 1;
      while (i + cnt < v.length && v[i + cnt] === v[i]) cnt++;
      if (cnt > 1) out.push(v[i] + ' (' + cnt + ')');
      i += cnt;
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'duplicates_list_count_all',
  ime: 'Duplicates - List - Count - All',
  ikona: '🧮',
  opis: 'List all values with count.',
  opisDolg: 'Shows every value with its count, including values appearing only once.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    v.sort();
    var out = [];
    var i = 0;
    while (i < v.length) {
      var cnt = 1;
      while (i + cnt < v.length && v[i + cnt] === v[i]) cnt++;
      out.push(v[i] + ' (' + cnt + ')');
      i += cnt;
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'duplicates_remove',
  ime: 'Duplicates - Remove',
  ikona: '🗑️',
  opis: 'Remove duplicate lines.',
  opisDolg: 'Keeps only the first occurrence of each line. Order preserved.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var seen = {};
    var out = v.filter(function(vr) {
      if (seen.hasOwnProperty(vr)) return false;
      seen[vr] = true;
      return true;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---lines',
  ime: '── Lines ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'lines_add_line_numbers',
  ime: 'Lines - Add line numbers',
  ikona: '1️⃣',
  opis: 'Add line numbers to all lines.',
  opisDolg: 'Numbers are auto-width padded with zeros to fit total line count. Format: "NN. text".',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var m = String(v.length).length;
    var out = v.map(function(vr, i) {
      var s = String(i + 1);
      while (s.length < m) s = '0' + s;
      return s + '. ' + vr;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_add_lines',
  ime: 'Lines - Add lines',
  ikona: '📝',
  opis: 'Append constant text lines at end.',
  opisDolg: 'Asks for text and number of repeats. Appends N copies of the text at the end.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var text = await prompt('Add text:', '');
    if (text === null) return false;
    var nStr = await prompt('Number of repeats:', '1');
    if (nStr === null) return false;
    var n = parseInt(nStr);
    if (isNaN(n) || n < 0) { await alert('Not a valid number.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    for (var i = 0; i < n; i++) v.push(text);
    undoTA.value = ta.value;
    ta.value = v.join('\n');
  }
}
, 
{
  id: 'lines_add_text_at_pos',
  ime: 'Lines - Add text at position',
  ikona: '📌',
  opis: 'Insert text at position in each line.',
  opisDolg: 'Inserts text before given 1-based position. Lines shorter than position are left unchanged.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var text = await prompt('Text for insert:', '\t');
    if (text === null) return false;
    var posStr = await prompt('Text insert at position (1-based):', '');
    if (posStr === null) return false;
    var pos = parseInt(posStr);
    if (isNaN(pos) || pos < 1) { await alert('Not a valid parameter.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      if (vr.length > pos - 1)
        return vr.substring(0, pos - 1) + text + vr.substring(pos - 1);
      return vr;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_cut_13_left',
  ime: 'Lines - Cut - 13 left',
  ikona: '✂️',
  opis: 'Remove first 13 characters from each line.',
  opisDolg: 'Cuts exactly 13 characters from the left of each line.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.substring(13); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_cut_xx_left',
  ime: 'Lines - Cut - XX left',
  ikona: '✂️',
  opis: 'Remove N characters from left of each line.',
  opisDolg: 'Asks how many characters to remove from the left of each line.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var xxStr = await prompt('Enter how many chars to remove on left:', '');
    if (xxStr === null) return false;
    var xx = parseInt(xxStr);
    if (isNaN(xx) || xx < 0) { await alert('Not a valid parameter.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.substring(xx); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_first_upper_only',
  ime: 'Lines - First letter in line to upper only',
  ikona: '🅰️',
  opis: 'Convert first letter in line to upper (rest unchanged).',
  opisDolg: 'Only the first character of each line is made uppercase. Other characters are not changed.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.substring(0, 1).toLocaleUpperCase() + vr.substring(1);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_first_upper',
  ime: 'Lines - First letter in line to upper',
  ikona: '🔠',
  opis: 'Convert first letter to upper, rest to lower.',
  opisDolg: 'First character uppercase, remaining characters lowercase.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.substring(0, 1).toLocaleUpperCase() + vr.substring(1).toLocaleLowerCase();
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_replace',
  ime: 'Lines - Replace',
  ikona: '🔄',
  opis: 'Replace substring in all lines.',
  opisDolg: 'Case-insensitive replace. Asks for search and replace strings.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var kaj = await prompt('Replace (What):', '');
    if (kaj === null) return false;
    var z = await prompt('With:', '');
    if (z === null) return false;
    var re = new RegExp(kaj.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.replace(re, z); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_replace_multi',
  ime: 'Lines - Replace - Multi',
  ikona: '🔁',
  opis: 'Replace multiple pairs of strings (tab-separated pairs).',
  opisDolg: 'Parameter: Old1<tab>New1<tab>Old2<tab>New2<tab>... Use "Lines - Replace - Multi - Prepare parameter" to build the parameter from a list.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var params = await prompt('Strings to replace separated by <tab> (Old1\tNew1\tOld2\tNew2...):', 'A\tAnew\tB\tBnew');
    if (params === null) return false;
    var parts = params.split('\t');
    if (parts.length % 2 !== 0) {
      alert('Not an even number of values separated by <tab>. Count: ' + parts.length + '.');
      return false;
    }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.slice();
    for (var p = 0; p < parts.length; p += 2) {
      var oldStr = parts[p];
      var newStr = parts[p + 1];
      var re = new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
      out = out.map(function(vr) { return vr.replace(re, newStr); });
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_replace_multi_from_one',
  ime: 'Lines - Replace - Multi from one',
  ikona: '🔂',
  opis: 'Multiply text with multiple replacements.',
  opisDolg: 'Replaces a placeholder with each value from a comma-separated list. Creates one output block per replacement value, separated by a block separator.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var oldStr = await prompt('String to replace:', 'XXX');
    if (oldStr === null) return false;
    var sepChar = await prompt('Strings to replace separated by:', ',');
    if (sepChar === null || sepChar.length !== 1) { await alert('Separator must be exactly 1 character.'); return false; }
    var newVals = await prompt('Strings to replace separated by "' + sepChar + '":', '00,01,02,03,04');
    if (newVals === null) return false;
    var blockSep = await prompt('Block separator:', '');
    if (blockSep === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var parts = newVals.split(sepChar);
    var re = new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
    var out = [];
    parts.forEach(function(newStr, idx) {
      v.forEach(function(vr) { out.push(vr.replace(re, newStr)); });
      if (blockSep !== '' && idx < parts.length - 1) out.push(blockSep);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_replace_multi_prep',
  ime: 'Lines - Replace - Multi - Prepare parameter',
  ikona: '🛠️',
  opis: 'Prepare parameter for Multi Replace.',
  opisDolg: 'Input: lines of "Old<tab>New". Output: single line "Old1<tab>New1<tab>Old2<tab>New2<tab>..." for use with "Lines - Replace - Multi".',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    var err = '';
    v.forEach(function(vr, i) {
      var tabs = (vr.match(/\t/g) || []).length;
      if (tabs === 0) err = 'Line ' + (i+1) + ' has no <tab> character.';
      else if (tabs > 1) err = 'Line ' + (i+1) + ' has more than one <tab> character.';
      else out.push(vr);
    });
    if (err) { await alert(err); return false; }
    undoTA.value = ta.value;
    ta.value = out.join('\t');
  }
}
, 
{
  id: 'lines_replace_odstrani_sumnike',
  ime: 'Lines - Replace - Odstrani šumnike',
  ikona: '🇸🇮',
  opis: 'Remove Slovenian special characters (šumniki).',
  opisDolg: 'Replaces Š→S, š→s, Č→C, č→c, Ž→Z, ž→z.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr
        .replace(/Š/g,'S').replace(/š/g,'s')
        .replace(/Č/g,'C').replace(/č/g,'c')
        .replace(/Ž/g,'Z').replace(/ž/g,'z');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_reverse_all',
  ime: 'Lines - Reverse - All',
  ikona: '🔃',
  opis: 'Reverse characters in each line.',
  opisDolg: 'Each line is reversed character by character.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.split('').reverse().join(''); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_reverse_lines',
  ime: 'Lines - Reverse - Lines',
  ikona: '↕️',
  opis: 'Reverse order of all lines.',
  opisDolg: 'Last line becomes first, first becomes last.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    v.reverse();
    undoTA.value = ta.value;
    ta.value = v.join('\n');
  }
}
, 
{
  id: 'lines_reverse_text_in_lines',
  ime: 'Lines - Reverse - Text in lines',
  ikona: '↩️',
  opis: 'Reverse text in each line (same as Reverse - All).',
  opisDolg: 'Each line is reversed character by character.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.split('').reverse().join(''); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_reverse_words',
  ime: 'Lines - Reverse - Words in lines',
  ikona: '🔀',
  opis: 'Reverse words in each line.',
  opisDolg: 'Splits by separators ( . , : ; = ! < > -), reverses word order keeping separators.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var SEPS = ' .,;:=!<>-';
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      // parse into tokens: [word, sep, word, sep, ...]
      var tokens = [];
      var cur = '';
      for (var i = 0; i < vr.length; i++) {
        var c = vr[i];
        if (SEPS.indexOf(c) >= 0) {
          tokens.push({word: cur, sep: c});
          cur = '';
        } else {
          cur += c;
        }
      }
      // last word (no trailing sep)
      var lastWord = cur;
      if (tokens.length === 0) return vr;
      // rebuild reversed: last word first, then tokens in reverse with sep before word
      var result = lastWord;
      for (var j = tokens.length - 1; j >= 0; j--) {
        result = result + tokens[j].sep + tokens[j].word;
      }
      return result;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_sum',
  ime: 'Lines - Sum',
  ikona: '➕',
  opis: 'Sum numbers in all lines.',
  opisDolg: 'Treats each line as a number (commas as decimal point, spaces/tabs ignored). Appends separator and sum.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var sum = 0;
    v.forEach(function(vr) {
      var s = vr.replace(/,/g,'.').replace(/[ \t]/g,'');
      if (s !== '') {
        var n = parseFloat(s);
        if (!isNaN(n)) sum += n;
      }
    });
    var out = v.slice();
    out.push('---------------');
    out.push('Sum = ' + sum);
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_summary',
  ime: 'Lines - Summary',
  ikona: '📈',
  opis: 'Summary of lines (sorted count per value).',
  opisDolg: 'Appends a sorted summary block showing each unique value with its count.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var sorted = v.slice().sort();
    var out = v.slice();
    out.push('---------------');
    out.push('--  Summary  --');
    out.push('---------------');
    var i = 0;
    while (i < sorted.length) {
      var cnt = 1;
      while (i + cnt < sorted.length && sorted[i + cnt] === sorted[i]) cnt++;
      out.push(sorted[i] + ' ==> ' + cnt);
      i += cnt;
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_where_len_delete',
  ime: 'Lines - Where line length - Delete',
  ikona: '🗑',
  opis: 'Delete lines with given length.',
  opisDolg: 'Removes all lines whose length equals the entered value.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var lenStr = await prompt('Length:', '4');
    if (lenStr === null) return false;
    var len = parseInt(lenStr);
    if (isNaN(len) || len < 0) { await alert('Not a valid number.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) { return vr.length !== len; });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_where_len_keep',
  ime: 'Lines - Where line length - Keep',
  ikona: '📏',
  opis: 'Keep only lines with given length.',
  opisDolg: 'Removes all lines whose length does not equal the entered value.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var lenStr = await prompt('Length:', '4');
    if (lenStr === null) return false;
    var len = parseInt(lenStr);
    if (isNaN(len) || len < 0) { await alert('Not a valid number.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) { return vr.length === len; });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_where_sub_delete',
  ime: 'Lines - Where substring - Delete',
  ikona: '❌',
  opis: 'Delete lines containing substring.',
  opisDolg: 'Case-insensitive. Removes all lines that contain the entered substring.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var niz = await prompt('Enter substring:', '');
    if (niz === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) {
      return vr.toLocaleUpperCase().indexOf(niz.toLocaleUpperCase()) < 0;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_where_sub_keep',
  ime: 'Lines - Where substring - Keep',
  ikona: '🔦',
  opis: 'Keep only lines containing substring.',
  opisDolg: 'Case-insensitive. Removes all lines that do NOT contain the entered substring.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var niz = await prompt('Enter substring:', '');
    if (niz === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) {
      return vr.toLocaleUpperCase().indexOf(niz.toLocaleUpperCase()) >= 0;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'lines_where_sub_or_len_keep',
  ime: 'Lines - Where substring or line length - Keep',
  ikona: '🔬',
  opis: 'Keep lines matching substring OR having given length.',
  opisDolg: 'Case-insensitive. Keeps lines that contain the substring OR whose length equals the given value.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var niz = await prompt('Enter substring:', '');
    if (niz === null) return false;
    var lenStr = await prompt('Length:', '4');
    if (lenStr === null) return false;
    var len = parseInt(lenStr);
    if (isNaN(len) || len < 0) { await alert('Not a valid length.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) {
      var matchSub = niz !== '' && vr.toLocaleUpperCase().indexOf(niz.toLocaleUpperCase()) >= 0;
      var matchLen = vr.length === len;
      return matchSub || matchLen;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---oracle',
  ime: '── Oracle ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'oracle_add_tablespace',
  ime: 'Oracle - Add tablespace',
  ikona: '🗄',
  opis: 'Add tablespace line before each "/" in Oracle script.',
  opisDolg: 'Inserts "tablespace <name>" before every "/" line. Asks for tablespace name.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var ts = await prompt('Enter tablespacename:', 'xxcgrow');
    if (ts === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    v.forEach(function(vr) {
      if (vr === '/') out.push('tablespace ' + ts);
      out.push(vr);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_make_constants',
  ime: 'Oracle - Make constants',
  ikona: '🔑',
  opis: 'Generate Oracle constant definitions.',
  opisDolg: 'Input: value<tab>description per line. Asks for short tablename and PK field type. Output: C_TNAME_DESCRIPTION field_type := \'value\';',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var shortName = await prompt('Short tablename:', '');
    if (shortName === null) return false;
    var fieldType = await prompt('PK field type:', '');
    if (fieldType === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var tabPos = vr.indexOf('\t');
      if (tabPos < 0) return vr;
      var val = vr.substring(0, tabPos);
      var desc = vr.substring(tabPos + 1);
      // clean desc: space→_, remove .,: šČč→C, šŠ→S, žŽ→Z
      var name = '';
      for (var i = 0; i < desc.length; i++) {
        var c = desc[i];
        if (c === ' ') name += '_';
        else if (c === '.' || c === ',' || c === ':') {}
        else if (c === 'č' || c === 'Č') name += 'C';
        else if (c === 'š' || c === 'Š') name += 'S';
        else if (c === 'ž' || c === 'Ž') name += 'Z';
        else name += c;
      }
      var line = 'C_' + shortName.toUpperCase() + '_' + name.toUpperCase();
      while (line.length < 33) line += ' ';
      line += ' ' + fieldType + " := '" + val + "';";
      return line;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_make_zurnal_old',
  ime: 'Oracle - Make zurnal - old',
  ikona: '📜',
  opis: 'Generate Oracle zurnal (journal) helpers.',
  opisDolg: 'Input: FieldName<tab>FieldType<tab>Nullable<tab>Default<tab>Comments per line. Asks for tablename. Generates ALTER TABLE, comments, ZUR_TYP, LOG_ZR and trigger code.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var tbl = await prompt('Tablename:', 'TABLE');
    if (tbl === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n').filter(function(vr){ return vr !== ''; });
    function parseTab(line) {
      var pos = line.indexOf('\t');
      if (pos < 0) return [line, ''];
      return [line.substring(0, pos), line.substring(pos + 1)];
    }
    var fields = v.map(function(vr) {
      var p = parseTab(vr); var name = p[0]; var rest = p[1];
      var p2 = parseTab(rest); var type = p2[0]; var rest2 = p2[1];
      var p3 = parseTab(rest2); var rest3 = p3[1];
      var p4 = parseTab(rest3); var rest4 = p4[1];
      var p5 = parseTab(rest4); var comment = p5[0];
      return {name: name, type: type, comment: comment};
    });
    var out = [];
    // ALTER TABLE
    out.push('alter table ' + tbl + ' add (');
    fields.forEach(function(f, i) {
      var suf = i === 0 ? '  ' : ' ,';
      out.push(suf + 'OLD' + f.name.substring(3) + ' ' + f.type);
      out.push(' ,NEW' + f.name.substring(3) + ' ' + f.type);
    });
    out.push(');');
    // COMMENTs
    fields.forEach(function(f) {
      var base = f.name.substring(3);
      out.push("comment on column " + tbl + ".OLD" + base + " is '" + f.comment + "';");
      out.push("comment on column " + tbl + ".NEW" + base + " is '" + f.comment + "';");
    });
    // ZUR_TYP spec
    out.push(''); out.push('ZUR_TYP.TPS:');
    fields.forEach(function(f) {
      var line = '  ' + f.name;
      while (line.length < 32) line += ' ';
      out.push(line + ' ' + f.type + ',');
    });
    // ZUR_TYP body
    out.push(''); out.push('ZUR_TYP.TPB:');
    fields.forEach(function(f) { out.push('    self.' + f.name + ' := null;'); });
    // LOG_ZR
    out.push(''); out.push('LOG_ZR...:'); out.push('    --');
    fields.forEach(function(f) {
      var base = f.name.substring(3).toLowerCase();
      out.push('    old' + base + ',');
      out.push('    new' + base + ',');
    });
    out.push('    --');
    fields.forEach(function(f) {
      out.push('    p_old.' + f.name.toLowerCase() + ',');
      out.push('    p_new.' + f.name.toLowerCase() + ',');
    });
    // TRIGGER
    out.push(''); out.push('T_TAB_AUI...:'); out.push('    --');
    fields.forEach(function(f) {
      out.push('  l_new.' + f.name.toLowerCase() + ' := :new.' + f.name.toLowerCase() + ';');
    });
    out.push('    --');
    fields.forEach(function(f) {
      out.push('    l_old.' + f.name.toLowerCase() + ' := :old.' + f.name.toLowerCase() + ';');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_names_java2oracle',
  ime: 'Oracle - Names - Java 2 Oracle',
  ikona: '🍵',
  opis: 'Convert Java names to Oracle names.',
  opisDolg: 'camelCase → snake_case. Example: customerNameFirst → customer_name_first',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var result = '';
      for (var i = 0; i < vr.length; i++) {
        var c = vr[i];
        var cu = c.toUpperCase();
        var cl = c.toLowerCase();
        if (cu === c && cu !== cl) {
          result += '_' + cl;
        } else {
          result += cl;
        }
      }
      return result;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_names_oracle2java',
  ime: 'Oracle - Names - Oracle 2 Java',
  ikona: '☕',
  opis: 'Convert Oracle names to Java names.',
  opisDolg: 'snake_case → camelCase. Example: customer_name_first → customerNameFirst. Handles L_ prefix exception.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var parts = vr.split('_');
      var result = '';
      var prevL = false;
      parts.forEach(function(part, i) {
        if (i === 0) {
          var p = part.charAt(0).toUpperCase() + part.substring(1).toLowerCase();
          if (prevL) p = p.toLowerCase();
          if (p === 'L') prevL = true; else prevL = false;
          result += p;
        } else {
          var p = part.charAt(0).toUpperCase() + part.substring(1).toLowerCase();
          if (prevL) p = p.toLowerCase();
          if (p.toUpperCase() === 'L') prevL = true; else prevL = false;
          result += p;
        }
      });
      // first char lowercase
      return result.charAt(0).toLowerCase() + result.substring(1);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_oracle2java_mapping',
  ime: 'Oracle - Oracle 2 Java mapping',
  ikona: '🗂',
  opis: 'Generate Java bean setter calls from Oracle field names.',
  opisDolg: 'Input: Oracle field names (one per line). Asks for bean name. Output: bean.setFieldName(rs.getString/getDate(columnIndex++));',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var bean = await prompt('Enter bean name:', 'rtxxBean');
    if (bean === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      // convert set_ + oracle_name → java setter name
      var parts = ('set_' + vr).split('_');
      var javaName = '';
      parts.forEach(function(part, i) {
        javaName += part.charAt(0).toUpperCase() + part.substring(1).toLowerCase();
      });
      javaName = javaName.charAt(0).toLowerCase() + javaName.substring(1);
      // determine type
      var isDate = javaName.indexOf('Dtm') >= 0 || vr.indexOf('_Dat_') >= 0 || javaName.indexOf('Sdate') >= 0;
      var getter = isDate ? 'rs.getDate(columnIndex++)' : 'rs.getString(columnIndex++)';
      return bean + '.' + javaName + '(' + getter + ');';
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_oracle2java_mapping_copy',
  ime: 'Oracle - Oracle 2 Java mapping - Copy',
  ikona: '🗂',
  opis: 'Generate Java bean setter calls from Oracle field names.',
  opisDolg: 'Input: Oracle field names (one per line). Asks for bean name. Output: bean.setFieldName(rs.getString/getDate(columnIndex++));',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var bean = await prompt('Enter bean name:', 'rtxxBean');
    if (bean === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      // convert set_ + oracle_name → java setter name
      var parts = ('set_' + vr).split('_');
      var javaName = '';
      parts.forEach(function(part, i) {
        javaName += part.charAt(0).toUpperCase() + part.substring(1).toLowerCase();
      });
      javaName = javaName.charAt(0).toLowerCase() + javaName.substring(1);
      // determine type
      var isDate = javaName.indexOf('Dtm') >= 0 || vr.indexOf('_Dat_') >= 0 || javaName.indexOf('Sdate') >= 0;
      var getter = isDate ? 'rs.getDate(columnIndex++)' : 'rs.getString(columnIndex++)';
      return bean + '.' + javaName + '(' + getter + ');';
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_grant2revoke',
  ime: 'Oracle - Script - Grant 2 Revoke',
  ikona: '🔐',
  opis: 'Create REVOKE script from GRANT script.',
  opisDolg: 'Replaces "GRANT " with "REVOKE " and " TO " with " FROM " (case-insensitive).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.replace(/GRANT /gi, 'REVOKE ').replace(/ TO /gi, ' FROM ');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'oracle_trace_fields',
  ime: 'Oracle - Trace fields',
  ikona: '🔎',
  opis: 'Generate Oracle trace.assert() call for field values.',
  opisDolg: 'Input: list of field names. Asks for prefix (e.g. "table."). Generates a trace.assert(true, ...) with all fields.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var prefix = await prompt("Vnesi prefix polj (npr: 'ime_tabele.'):", '');
    if (prefix === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n').filter(function(vr){ return vr !== ''; });
    var out = ["trace.assert(true, 'Izpis vrednosti polj: ' ||"];
    v.forEach(function(f, i) {
      var sep = i === 0 ? '' : ', ';
      var cont = i < v.length - 1 ? " ||" : ");";
      out.push("                   '" + sep + prefix + f + "='' || " + prefix + f + cont);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---parse',
  ime: '── Parse ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'parse_csv',
  ime: 'Parse - Comma separated values',
  ikona: '📑',
  opis: 'Convert comma separated values to list.',
  opisDolg: 'Splits each line by comma. Each value becomes a separate line (trimmed).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    v.forEach(function(vr) {
      vr.split(',').forEach(function(part) {
        var t = part.trim();
        if (t !== '') out.push(t);
      });
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'parse_csv_reverse',
  ime: 'Parse - Comma separated values - Reverse',
  ikona: '📑',
  opis: 'Convert comma separated values to list in reverse order.',
  opisDolg: 'Splits each line by comma, collects all values, reverses, outputs one per line.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var all = [];
    v.forEach(function(vr) {
      vr.split(',').forEach(function(part) {
        var t = part.trim();
        if (t !== '') all.push(t);
      });
    });
    all.reverse();
    undoTA.value = ta.value;
    ta.value = all.join('\n');
  }
}
, 
{
  id: 'parse_dir2list',
  ime: 'Parse - Dir 2 List',
  ikona: '📁',
  opis: 'Convert "dir" command output to list.',
  opisDolg: 'Paste output of "dir /b" or similar. Extracts only filenames (removes paths and size lines).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    v.forEach(function(vr) {
      if (vr.indexOf('\\') >= 0) {
        out.push('');
        out.push('>>' + vr);
      } else if (vr.length > 36) {
        var name = vr.substring(36);
        if (name === '.' || name === '..') return;
        if (vr.substring(21,26) === '<DIR>') out.push('<DIR>  ' + name);
        else if (vr.substring(17,23) === ' bytes') return;
        else out.push('<FILE> ' + name);
      }
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'parse_mpzt',
  ime: 'Parse - Parameter parser MPZT',
  ikona: '🔧',
  opis: 'Parse MPZT parameters from URL query string.',
  opisDolg: 'Extracts p7, p9, p10, p17 parameters from & separated query string.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    v.forEach(function(vr) {
      var cols = vr.split('&');
      var newLine = '';
      for (var c = cols.length - 1; c >= 0; c--) {
        if (cols[c].substr(0,3) === 'p7=')  newLine = newLine + ' - ' + cols[c];
        if (cols[c].substr(0,3) === 'p9=')  newLine = newLine + ' - ' + cols[c];
        if (cols[c].substr(0,4) === 'p10=') newLine = newLine + ' - ' + cols[c];
        if (cols[c].substr(0,4) === 'p17=') newLine = newLine + ' - ' + cols[c];
      }
      out.push(newLine);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---table',
  ime: '── Table ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'table_pivot',
  ime: 'Table - Pivot',
  ikona: '🔄',
  opis: 'Pivot tab-delimited table (rows ↔ columns).',
  opisDolg: 'Transposes tab-delimited data: rows become columns and vice versa.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var maxCols = 0;
    v.forEach(function(vr) {
      var c = vr.split('\t').length;
      if (c > maxCols) maxCols = c;
    });
    var out = [];
    for (var c = 0; c < maxCols; c++) {
      var row = [];
      v.forEach(function(vr) {
        var cols = vr.split('\t');
        row.push(cols[c] || '');
      });
      out.push(row.join('\t'));
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'table_pivot_number',
  ime: 'Table - Pivot - number',
  ikona: '#️⃣',
  opis: 'Pivot 3-column tab-delimited table, summing numeric values.',
  opisDolg: 'Input: col1<tab>col2<tab>value (first row = header). Output: col1 as rows, distinct col2 as columns, sums values for duplicate (col1,col2) pairs.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (v.length < 2) return false;
    var headerLine = v[0];
    var headCol1 = headerLine.split('\t')[0] || '';
    var rows = v.slice(1).filter(function(vr) { return vr.trim() !== ''; });
    // parse rows
    var data = rows.map(function(vr) {
      var p = vr.split('\t');
      var c1 = p[0] || '', c2 = p[1] || '', c3 = p[2] || '';
      // date conversion dd.mm.yyyy → yyyy-mm-dd
      if (c1.length >= 10 && c1[2] === '.' && c1[5] === '.')
        c1 = c1.substring(6,10) + '-' + c1.substring(3,5) + '-' + c1.substring(0,2);
      return {c1:c1, c2:c2, c3:parseFloat(c3.replace(',','.')) || 0};
    });
    // distinct col1 (sorted), distinct col2 (sorted)
    var col1s = [], col2s = [];
    data.forEach(function(d) {
      if (col1s.indexOf(d.c1) < 0) col1s.push(d.c1);
      if (col2s.indexOf(d.c2) < 0) col2s.push(d.c2);
    });
    col1s.sort(); col2s.sort();
    // build output
    var out = [headCol1 + '\t' + col2s.join('\t')];
    col1s.forEach(function(c1) {
      var row = c1;
      col2s.forEach(function(c2) {
        var sum = 0;
        data.forEach(function(d) { if (d.c1 === c1 && d.c2 === c2) sum += d.c3; });
        var s = sum === Math.round(sum) ? String(Math.round(sum)) : String(sum);
        row += '\t' + s;
      });
      out.push(row);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'table_pivot_string',
  ime: 'Table - Pivot - string',
  ikona: '💬',
  opis: 'Pivot 3-column tab-delimited table, concatenating string values.',
  opisDolg: 'Input: col1<tab>col2<tab>value (first row = header). Output: col1 as rows, distinct col2 as columns, concatenates values with ", " for duplicates.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (v.length < 2) return false;
    var headerLine = v[0];
    var headCol1 = headerLine.split('\t')[0] || '';
    var rows = v.slice(1).filter(function(vr) { return vr.trim() !== ''; });
    var data = rows.map(function(vr) {
      var p = vr.split('\t');
      var c1 = p[0] || '', c2 = p[1] || '', c3 = p[2] || '';
      if (c1.length >= 10 && c1[2] === '.' && c1[5] === '.')
        c1 = c1.substring(6,10) + '-' + c1.substring(3,5) + '-' + c1.substring(0,2);
      return {c1:c1, c2:c2, c3:c3};
    });
    var col1s = [], col2s = [];
    data.forEach(function(d) {
      if (col1s.indexOf(d.c1) < 0) col1s.push(d.c1);
      if (col2s.indexOf(d.c2) < 0) col2s.push(d.c2);
    });
    col1s.sort(); col2s.sort();
    var out = [headCol1 + '\t' + col2s.join('\t')];
    col1s.forEach(function(c1) {
      var row = c1;
      col2s.forEach(function(c2) {
        var vals = [];
        data.forEach(function(d) { if (d.c1 === c1 && d.c2 === c2) vals.push(d.c3); });
        row += '\t' + vals.join(', ');
      });
      out.push(row);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'table_pivot_with_sum',
  ime: 'Table - Pivot with sum',
  ikona: '💹',
  opis: 'Pivot 3-column table with sum row at bottom.',
  opisDolg: 'Same as Pivot - number but adds a "Skupaj" (total) row at the end.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (v.length < 2) return false;
    var headerLine = v[0];
    var headCol1 = headerLine.split('\t')[0] || '';
    var rows = v.slice(1).filter(function(vr) { return vr.trim() !== ''; });
    var data = rows.map(function(vr) {
      var p = vr.split('\t');
      var c1 = p[0] || '', c2 = p[1] || '', c3 = p[2] || '';
      if (c1.length >= 10 && c1[2] === '.' && c1[5] === '.')
        c1 = c1.substring(6,10) + '-' + c1.substring(3,5) + '-' + c1.substring(0,2);
      return {c1:c1, c2:c2, c3:parseInt(c3) || 0};
    });
    var col1s = [], col2s = [];
    data.forEach(function(d) {
      if (col1s.indexOf(d.c1) < 0) col1s.push(d.c1);
      if (col2s.indexOf(d.c2) < 0) col2s.push(d.c2);
    });
    col1s.sort(); col2s.sort();
    var colSums = {};
    col2s.forEach(function(c2) { colSums[c2] = 0; });
    var out = [headCol1 + '\t' + col2s.join('\t')];
    col1s.forEach(function(c1) {
      var row = c1;
      col2s.forEach(function(c2) {
        var sum = 0;
        data.forEach(function(d) { if (d.c1 === c1 && d.c2 === c2) { sum += d.c3; colSums[c2] += d.c3; } });
        row += '\t' + (sum !== 0 ? sum : '');
      });
      out.push(row);
    });
    var sumRow = 'Skupaj';
    col2s.forEach(function(c2) { sumRow += '\t' + colSums[c2]; });
    out.push(sumRow);
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'table_transpose_rotate',
  ime: 'Table - Transpose-rotate data',
  ikona: '🔁',
  opis: 'Transpose (rotate) tab-delimited data (rows ↔ columns).',
  opisDolg: 'Same as Pivot: rows become columns and vice versa. Transposes tab-delimited data.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var maxCols = 0;
    v.forEach(function(vr) {
      var c = vr.split('\t').length;
      if (c > maxCols) maxCols = c;
    });
    var out = [];
    for (var c = 0; c < maxCols; c++) {
      var row = [];
      v.forEach(function(vr) {
        var cols = vr.split('\t');
        row.push(cols[c] || '');
      });
      out.push(row.join('\t'));
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'table_tab_to_html',
  ime: 'Table - Tab delimited text to HTML table',
  ikona: '🌐',
  opis: 'Convert tab delimited text to HTML table.',
  opisDolg: 'First row is treated as header (<th>). Remaining rows are data (<td>).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (!v.length) return;
    var out = ['<table border="1" cellpadding="3" cellspacing="0">'];
    v.forEach(function(vr, idx) {
      var tag = idx === 0 ? 'th' : 'td';
      var cols = vr.split('\t');
      var row = '  <tr>' + cols.map(function(c){ return '<'+tag+'>'+c+'</'+tag+'>'; }).join('') + '</tr>';
      out.push(row);
    });
    out.push('</table>');
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---util',
  ime: '── Util ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'util_ascii_code',
  ime: 'Util - Ascii code',
  ikona: '🔣',
  opis: 'Show ASCII code for each character.',
  opisDolg: 'For each character in each line outputs char{ascii_code}. Example: "A{65}".',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.split('').map(function(c) {
        return c + '{' + c.charCodeAt(0) + '}';
      }).join('');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'util_time',
  ime: 'Util - Time',
  ikona: '🕐',
  opis: 'Calculate time intervals from start time.',
  opisDolg: 'Input: first line is start time HH:MM. Calculates end times from 15-min intervals, starting at 2-hour offset, with results formatted as HH:MM-HH:MM ==> HH,MM.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (!v.length) return false;
    var C_START = 8;
    var out = [];
    v.forEach(function(vr) {
      var loc = vr.indexOf(':');
      if (loc < 0) { out.push(vr); return; }
      try {
        var h1 = parseInt(vr.substring(0, loc));
        var m1 = parseInt(vr.substring(loc + 1));
        for (var j = C_START; j <= 43; j++) {
          var h2 = h1, m2 = m1 + 15 * j;
          h2 += Math.floor(m2 / 60); m2 = m2 % 60;
          var hd = h2 - h1 - 1, md = m2 - m1 + 60;
          hd += Math.floor(md / 60); md = md % 60;
          md = Math.round(100 * md / 60);
          function p2(n) { return n < 10 ? '0'+n : ''+n; }
          if (j % 4 === 0 && j !== C_START) out.push('');
          out.push(p2(h1)+':'+p2(m1)+'-'+p2(h2)+':'+p2(m2)+' ==> '+p2(hd)+','+p2(md));
        }
      } catch(e) { out.push(vr); }
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'separator---z',
  ime: '── Z ──',
  ikona: '', opis: '', opisDolg: '',
  separator: true, zazeni: null
}
, 
{
  id: 'z_convert_eur_sit',
  ime: 'Z - Convert - € - EUR-SIT',
  ikona: '💶',
  opis: 'Convert EUR to SIT (×239.64).',
  opisDolg: 'Each line treated as a number. Multiplies by 239.64. Commas treated as decimal point.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var num = parseFloat(vr.replace(',','.'));
      if (isNaN(num)) return vr;
      return String(num * 239.64).replace(',','.');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
{
  id: 'z_convert_sit_eur',
  ime: 'Z - Convert - € - SIT-EUR',
  ikona: '🪙',
  opis: 'Convert SIT to EUR (÷239.64).',
  opisDolg: 'Each line treated as a number. Divides by 239.64. Commas treated as decimal point.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var num = parseFloat(vr.replace(',','.'));
      if (isNaN(num)) return vr;
      return String(num / 239.64).replace(',','.');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
, 
]; 
