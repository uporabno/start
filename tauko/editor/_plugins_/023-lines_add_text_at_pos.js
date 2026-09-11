{
  id: 'lines_add_text_at_pos',
  ime: 'Lines - Add text at position',
  ikona: '📌',
  opis: 'Insert text at position in each line.',
  opisDolg: 'Inserts text before given 1-based position. Lines shorter than position are left unchanged.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var text = await prompt('Text for insert:', '\t');
    if (text === null) return false;
    var posStr = await prompt('Text insert at position (1-based):', '');
    if (posStr === null) return false;
    var pos = parseInt(posStr);
    if (isNaN(pos) || pos < 1) { await alert('Not a valid parameter.'); return false; }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      if (vr.length > pos - 1)
        return vr.substring(0, pos - 1) + text + vr.substring(pos - 1);
      return vr;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
