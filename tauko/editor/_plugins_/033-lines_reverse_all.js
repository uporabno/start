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
