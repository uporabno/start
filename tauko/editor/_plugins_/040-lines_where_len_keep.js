{
  id: 'lines_where_len_keep',
  ime: 'Lines - Where line length - Keep',
  ikona: '📏',
  opis: 'Keep only lines with given length.',
  opisDolg: 'Removes all lines whose length does not equal the entered value.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var lenStr = await prompt('Length:', '4');
    if (lenStr === null) return false;
    var len = parseInt(lenStr);
    if (isNaN(len) || len < 0) { await alert('Not a valid number.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) { return vr.length === len; });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
