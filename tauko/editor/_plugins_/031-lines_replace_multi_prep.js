{
  id: 'lines_replace_multi_prep',
  ime: 'Lines - Replace - Multi - Prepare parameter',
  ikona: '🛠️',
  opis: 'Prepare parameter for Multi Replace.',
  opisDolg: 'Input: lines of "Old<tab>New". Output: single line "Old1<tab>New1<tab>Old2<tab>New2<tab>..." for use with "Lines - Replace - Multi".',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    var err = '';
    v.forEach(function(vr, i) {
      var tabs = (vr.match(/\t/g) || []).length;
      if (tabs === 0) err = 'Line ' + (i+1) + ' has no <tab> character.';
      else if (tabs > 1) err = 'Line ' + (i+1) + ' has more than one <tab> character.';
      else out.push(vr);
    });
    if (err) { await alert(err); return false; }
    undoTA.value = ta.value;
    ta.value = out.join('\t');
  }
}
