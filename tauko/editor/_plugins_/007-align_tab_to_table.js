{
  id: 'align_tab_to_table',
  ime: 'Align - Tab delimited text to table',
  ikona: '📊',
  opis: 'Align tab delimited text to table (with header separator).',
  opisDolg: 'Aligns columns to max width. After first row adds a dash separator line. Asks for column separator (default " | ").',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var sep = await prompt('Enter cols separator:', ' | ');
    if (sep === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var cLen = [];
    v.forEach(function(vr) {
      vr.split('\t').forEach(function(col, i) {
        if (!cLen[i] || col.length > cLen[i]) cLen[i] = col.length;
      });
    });
    var dashSep = sep.split('').map(function(c) { return c === ' ' ? '-' : c; }).join('');
    var out = [];
    v.forEach(function(vr, idx) {
      var cols = vr.split('\t');
      var line = cols.map(function(col, i) {
        var s = col;
        while (s.length < (cLen[i] || 0)) s += ' ';
        return s;
      }).join(sep);
      out.push(line);
      if (idx === 0) {
        var dash = cLen.map(function(len) { return '-'.repeat(len || 0); }).join(dashSep);
        out.push(dash);
      }
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
