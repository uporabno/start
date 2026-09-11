{
  id: 'lines_where_sub_keep',
  ime: 'Lines - Where substring - Keep',
  ikona: '🔦',
  opis: 'Keep only lines containing substring.',
  opisDolg: 'Case-insensitive. Removes all lines that do NOT contain the entered substring.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var niz = await prompt('Enter substring:', '');
    if (niz === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) {
      return vr.toLocaleUpperCase().indexOf(niz.toLocaleUpperCase()) >= 0;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
