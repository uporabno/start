{
  id: 'align_tab_to_text',
  ime: 'Align - Tab delimited text to text',
  ikona: '📄',
  opis: 'Align tab delimited text to text (no header separator).',
  opisDolg: 'Aligns columns to max width. No dash line after header. Asks for column separator (default " | ").',
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
    var out = v.map(function(vr) {
      var cols = vr.split('\t');
      return cols.map(function(col, i) {
        var s = col;
        while (s.length < (cLen[i] || 0)) s += ' ';
        return s;
      }).join(sep);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
