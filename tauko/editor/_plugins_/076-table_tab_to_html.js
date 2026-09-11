{
  id: 'table_tab_to_html',
  ime: 'Table - Tab delimited text to HTML table',
  ikona: '🌐',
  opis: 'Convert tab delimited text to HTML table.',
  opisDolg: 'First row is treated as header (<th>). Remaining rows are data (<td>).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (!v.length) return;
    var out = ['<table border="1" cellpadding="3" cellspacing="0">'];
    v.forEach(function(vr, idx) {
      var tag = idx === 0 ? 'th' : 'td';
      var cols = vr.split('\t');
      var row = '  <tr>' + cols.map(function(c){ return '<'+tag+'>'+c+'</'+tag+'>'; }).join('') + '</tr>';
      out.push(row);
    });
    out.push('</table>');
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
