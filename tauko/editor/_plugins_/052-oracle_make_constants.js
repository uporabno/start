{
  id: 'oracle_make_constants',
  ime: 'Oracle - Make constants',
  ikona: '🔑',
  opis: 'Generate Oracle constant definitions.',
  opisDolg: 'Input: value<tab>description per line. Asks for short tablename and PK field type. Output: C_TNAME_DESCRIPTION field_type := \'value\';',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var shortName = await prompt('Short tablename:', '');
    if (shortName === null) return false;
    var fieldType = await prompt('PK field type:', '');
    if (fieldType === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var tabPos = vr.indexOf('\t');
      if (tabPos < 0) return vr;
      var val = vr.substring(0, tabPos);
      var desc = vr.substring(tabPos + 1);
      // clean desc: space→_, remove .,: šČč→C, šŠ→S, žŽ→Z
      var name = '';
      for (var i = 0; i < desc.length; i++) {
        var c = desc[i];
        if (c === ' ') name += '_';
        else if (c === '.' || c === ',' || c === ':') {}
        else if (c === 'č' || c === 'Č') name += 'C';
        else if (c === 'š' || c === 'Š') name += 'S';
        else if (c === 'ž' || c === 'Ž') name += 'Z';
        else name += c;
      }
      var line = 'C_' + shortName.toUpperCase() + '_' + name.toUpperCase();
      while (line.length < 33) line += ' ';
      line += ' ' + fieldType + " := '" + val + "';";
      return line;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
