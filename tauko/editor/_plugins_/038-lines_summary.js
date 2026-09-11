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
