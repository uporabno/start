{
  id: 'lines_where_sub_or_len_keep',
  ime: 'Lines - Where substring or line length - Keep',
  ikona: '🔬',
  opis: 'Keep lines matching substring OR having given length.',
  opisDolg: 'Case-insensitive. Keeps lines that contain the substring OR whose length equals the given value.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var niz = await prompt('Enter substring:', '');
    if (niz === null) return false;
    var lenStr = await prompt('Length:', '4');
    if (lenStr === null) return false;
    var len = parseInt(lenStr);
    if (isNaN(len) || len < 0) { await alert('Not a valid length.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.filter(function(vr) {
      var matchSub = niz !== '' && vr.toLocaleUpperCase().indexOf(niz.toLocaleUpperCase()) >= 0;
      var matchLen = vr.length === len;
      return matchSub || matchLen;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
