{
  id: 'lines_first_upper',
  ime: 'Lines - First letter in line to upper',
  ikona: '🔠',
  opis: 'Convert first letter to upper, rest to lower.',
  opisDolg: 'First character uppercase, remaining characters lowercase.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.substring(0, 1).toLocaleUpperCase() + vr.substring(1).toLocaleLowerCase();
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
