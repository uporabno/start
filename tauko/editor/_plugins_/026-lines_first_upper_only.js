{
  id: 'lines_first_upper_only',
  ime: 'Lines - First letter in line to upper only',
  ikona: '🅰️',
  opis: 'Convert first letter in line to upper (rest unchanged).',
  opisDolg: 'Only the first character of each line is made uppercase. Other characters are not changed.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.substring(0, 1).toLocaleUpperCase() + vr.substring(1);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
