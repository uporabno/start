{
  id: 'parse_mpzt',
  ime: 'Parse - Parameter parser MPZT',
  ikona: '🔧',
  opis: 'Parse MPZT parameters from URL query string.',
  opisDolg: 'Extracts p7, p9, p10, p17 parameters from & separated query string.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    v.forEach(function(vr) {
      var cols = vr.split('&');
      var newLine = '';
      for (var c = cols.length - 1; c >= 0; c--) {
        if (cols[c].substr(0,3) === 'p7=')  newLine = newLine + ' - ' + cols[c];
        if (cols[c].substr(0,3) === 'p9=')  newLine = newLine + ' - ' + cols[c];
        if (cols[c].substr(0,4) === 'p10=') newLine = newLine + ' - ' + cols[c];
        if (cols[c].substr(0,4) === 'p17=') newLine = newLine + ' - ' + cols[c];
      }
      out.push(newLine);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
