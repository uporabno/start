{
  id: 'lines_where_sub_delete',
  ime: 'Lines - Where substring - Delete',
  ikona: '❌',
  opis: 'Delete lines containing substring.',
  opisDolg: 'Case-insensitive. Removes all lines that contain the entered substring.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var niz = await prompt('Enter substring:', '');
    if (niz === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) {
      return vr.toLocaleUpperCase().indexOf(niz.toLocaleUpperCase()) < 0;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
