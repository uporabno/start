{
  id: 'duplicates_list_count_all',
  ime: 'Duplicates - List - Count - All',
  ikona: '🧮',
  opis: 'List all values with count.',
  opisDolg: 'Shows every value with its count, including values appearing only once.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    v.sort();
    var out = [];
    var i = 0;
    while (i < v.length) {
      var cnt = 1;
      while (i + cnt < v.length && v[i + cnt] === v[i]) cnt++;
      out.push(v[i] + ' (' + cnt + ')');
      i += cnt;
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
