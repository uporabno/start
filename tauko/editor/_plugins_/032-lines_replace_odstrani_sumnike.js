{
  id: 'lines_replace_odstrani_sumnike',
  ime: 'Lines - Replace - Odstrani šumnike',
  ikona: '🇸🇮',
  opis: 'Remove Slovenian special characters (šumniki).',
  opisDolg: 'Replaces Š→S, š→s, Č→C, č→c, Ž→Z, ž→z.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr
        .replace(/Š/g,'S').replace(/š/g,'s')
        .replace(/Č/g,'C').replace(/č/g,'c')
        .replace(/Ž/g,'Z').replace(/ž/g,'z');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
