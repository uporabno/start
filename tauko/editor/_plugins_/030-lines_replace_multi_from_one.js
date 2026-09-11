{
  id: 'lines_replace_multi_from_one',
  ime: 'Lines - Replace - Multi from one',
  ikona: '🔂',
  opis: 'Multiply text with multiple replacements.',
  opisDolg: 'Replaces a placeholder with each value from a comma-separated list. Creates one output block per replacement value, separated by a block separator.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var oldStr = await prompt('String to replace:', 'XXX');
    if (oldStr === null) return false;
    var sepChar = await prompt('Strings to replace separated by:', ',');
    if (sepChar === null || sepChar.length !== 1) { await alert('Separator must be exactly 1 character.'); return false; }
    var newVals = await prompt('Strings to replace separated by "' + sepChar + '":', '00,01,02,03,04');
    if (newVals === null) return false;
    var blockSep = await prompt('Block separator:', '');
    if (blockSep === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var parts = newVals.split(sepChar);
    var re = new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
    var out = [];
    parts.forEach(function(newStr, idx) {
      v.forEach(function(vr) { out.push(vr.replace(re, newStr)); });
      if (blockSep !== '' && idx < parts.length - 1) out.push(blockSep);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
