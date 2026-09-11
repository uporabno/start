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
