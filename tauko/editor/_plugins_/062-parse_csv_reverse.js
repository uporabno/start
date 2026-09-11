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
