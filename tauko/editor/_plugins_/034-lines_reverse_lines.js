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
