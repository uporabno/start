{
  id: 'duplicates_list',
  ime: 'Duplicates - List',
  ikona: '🪞',
  opis: 'List all duplicate values.',
  opisDolg: 'Returns only values that appear more than once (sorted, no duplicates in output).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    v.sort();
    var out = [], last = '';
    for (var i = 0; i < v.length - 1; i++) {
      if (v[i] === v[i+1] && last !== v[i]) {
        last = v[i];
        out.push(v[i]);
      }
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
