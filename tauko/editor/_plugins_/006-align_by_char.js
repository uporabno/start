{
  id: 'align_by_char',
  ime: 'Align - Align by char',
  ikona: '🎯',
  opis: 'Align lines by character.',
  opisDolg: 'Finds max position of the align char, pads all lines to that position. Fill char default is space.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var charBreak = await prompt('Align by char:', '=>');
    if (charBreak === null || charBreak === '') return false;
    var charFillRaw = await prompt('Fill by char (space):', ' ');
    if (charFillRaw === null) return false;
    var charFill = charFillRaw.length > 0 ? charFillRaw[0] : ' ';
    var v = ta.value.replace(/\r/g,'').split('\n');
    var charU = charBreak.toUpperCase();
    var maxPos = 0;
    v.forEach(function(vr) {
      var pos = vr.toUpperCase().indexOf(charU);
      if (pos > maxPos) maxPos = pos;
    });
    var out = v.map(function(vr) {
      var pos = vr.toUpperCase().indexOf(charU);
      if (pos < 0) return vr;
      var pad = charFill.repeat(maxPos - pos);
      return vr.substring(0, pos) + pad + vr.substring(pos);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
