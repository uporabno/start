{
  id: 'lines_cut_xx_left',
  ime: 'Lines - Cut - XX left',
  ikona: '✂️',
  opis: 'Remove N characters from left of each line.',
  opisDolg: 'Asks how many characters to remove from the left of each line.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var xxStr = await prompt('Enter how many chars to remove on left:', '');
    if (xxStr === null) return false;
    var xx = parseInt(xxStr);
    if (isNaN(xx) || xx < 0) { await alert('Not a valid parameter.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.substring(xx); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
