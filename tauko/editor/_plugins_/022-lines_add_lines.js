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
