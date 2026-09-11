{
  id: 'duplicates_list_count',
  ime: 'Duplicates - List - Count',
  ikona: '🔢',
  opis: 'List duplicate values with count.',
  opisDolg: 'Shows each value that appears more than once with its total count.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    v.sort();
    var out = [];
    var i = 0;
    while (i < v.length) {
      var cnt = 1;
      while (i + cnt < v.length && v[i + cnt] === v[i]) cnt++;
      if (cnt > 1) out.push(v[i] + ' (' + cnt + ')');
      i += cnt;
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
