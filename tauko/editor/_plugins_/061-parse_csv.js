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
