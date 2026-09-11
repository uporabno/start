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
