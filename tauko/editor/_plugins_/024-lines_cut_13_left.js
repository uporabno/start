{
  id: 'lines_cut_13_left',
  ime: 'Lines - Cut - 13 left',
  ikona: '✂️',
  opis: 'Remove first 13 characters from each line.',
  opisDolg: 'Cuts exactly 13 characters from the left of each line.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.substring(13); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
