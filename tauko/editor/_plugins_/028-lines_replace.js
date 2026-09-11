{
  id: 'lines_replace',
  ime: 'Lines - Replace',
  ikona: '🔄',
  opis: 'Replace substring in all lines.',
  opisDolg: 'Case-insensitive replace. Asks for search and replace strings.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var kaj = await prompt('Replace (What):', '');
    if (kaj === null) return false;
    var z = await prompt('With:', '');
    if (z === null) return false;
    var re = new RegExp(kaj.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) { return vr.replace(re, z); });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
