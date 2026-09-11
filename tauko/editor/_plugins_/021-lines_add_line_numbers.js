{
  id: 'lines_add_line_numbers',
  ime: 'Lines - Add line numbers',
  ikona: '1️⃣',
  opis: 'Add line numbers to all lines.',
  opisDolg: 'Numbers are auto-width padded with zeros to fit total line count. Format: "NN. text".',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var m = String(v.length).length;
    var out = v.map(function(vr, i) {
      var s = String(i + 1);
      while (s.length < m) s = '0' + s;
      return s + '. ' + vr;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
