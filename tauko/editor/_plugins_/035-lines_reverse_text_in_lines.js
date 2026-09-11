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
