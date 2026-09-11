{
  id: 'duplicates_remove',
  ime: 'Duplicates - Remove',
  ikona: '🗑️',
  opis: 'Remove duplicate lines.',
  opisDolg: 'Keeps only the first occurrence of each line. Order preserved.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var seen = {};
    var out = v.filter(function(vr) {
      if (seen.hasOwnProperty(vr)) return false;
      seen[vr] = true;
      return true;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
