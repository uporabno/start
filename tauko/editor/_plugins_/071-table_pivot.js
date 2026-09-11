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
