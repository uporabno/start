{
  id: 'table_pivot_number',
  ime: 'Table - Pivot - number',
  ikona: '#️⃣',
  opis: 'Pivot 3-column tab-delimited table, summing numeric values.',
  opisDolg: 'Input: col1<tab>col2<tab>value (first row = header). Output: col1 as rows, distinct col2 as columns, sums values for duplicate (col1,col2) pairs.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (v.length < 2) return false;
    var headerLine = v[0];
    var headCol1 = headerLine.split('\t')[0] || '';
    var rows = v.slice(1).filter(function(vr) { return vr.trim() !== ''; });
    // parse rows
    var data = rows.map(function(vr) {
      var p = vr.split('\t');
      var c1 = p[0] || '', c2 = p[1] || '', c3 = p[2] || '';
      // date conversion dd.mm.yyyy → yyyy-mm-dd
      if (c1.length >= 10 && c1[2] === '.' && c1[5] === '.')
        c1 = c1.substring(6,10) + '-' + c1.substring(3,5) + '-' + c1.substring(0,2);
      return {c1:c1, c2:c2, c3:parseFloat(c3.replace(',','.')) || 0};
    });
    // distinct col1 (sorted), distinct col2 (sorted)
    var col1s = [], col2s = [];
    data.forEach(function(d) {
      if (col1s.indexOf(d.c1) < 0) col1s.push(d.c1);
      if (col2s.indexOf(d.c2) < 0) col2s.push(d.c2);
    });
    col1s.sort(); col2s.sort();
    // build output
    var out = [headCol1 + '\t' + col2s.join('\t')];
    col1s.forEach(function(c1) {
      var row = c1;
      col2s.forEach(function(c2) {
        var sum = 0;
        data.forEach(function(d) { if (d.c1 === c1 && d.c2 === c2) sum += d.c3; });
        var s = sum === Math.round(sum) ? String(Math.round(sum)) : String(sum);
        row += '\t' + s;
      });
      out.push(row);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
