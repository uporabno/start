{
  id: 'oracle_make_zurnal_old',
  ime: 'Oracle - Make zurnal - old',
  ikona: '📜',
  opis: 'Generate Oracle zurnal (journal) helpers.',
  opisDolg: 'Input: FieldName<tab>FieldType<tab>Nullable<tab>Default<tab>Comments per line. Asks for tablename. Generates ALTER TABLE, comments, ZUR_TYP, LOG_ZR and trigger code.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var tbl = await prompt('Tablename:', 'TABLE');
    if (tbl === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n').filter(function(vr){ return vr !== ''; });
    function parseTab(line) {
      var pos = line.indexOf('\t');
      if (pos < 0) return [line, ''];
      return [line.substring(0, pos), line.substring(pos + 1)];
    }
    var fields = v.map(function(vr) {
      var p = parseTab(vr); var name = p[0]; var rest = p[1];
      var p2 = parseTab(rest); var type = p2[0]; var rest2 = p2[1];
      var p3 = parseTab(rest2); var rest3 = p3[1];
      var p4 = parseTab(rest3); var rest4 = p4[1];
      var p5 = parseTab(rest4); var comment = p5[0];
      return {name: name, type: type, comment: comment};
    });
    var out = [];
    // ALTER TABLE
    out.push('alter table ' + tbl + ' add (');
    fields.forEach(function(f, i) {
      var suf = i === 0 ? '  ' : ' ,';
      out.push(suf + 'OLD' + f.name.substring(3) + ' ' + f.type);
      out.push(' ,NEW' + f.name.substring(3) + ' ' + f.type);
    });
    out.push(');');
    // COMMENTs
    fields.forEach(function(f) {
      var base = f.name.substring(3);
      out.push("comment on column " + tbl + ".OLD" + base + " is '" + f.comment + "';");
      out.push("comment on column " + tbl + ".NEW" + base + " is '" + f.comment + "';");
    });
    // ZUR_TYP spec
    out.push(''); out.push('ZUR_TYP.TPS:');
    fields.forEach(function(f) {
      var line = '  ' + f.name;
      while (line.length < 32) line += ' ';
      out.push(line + ' ' + f.type + ',');
    });
    // ZUR_TYP body
    out.push(''); out.push('ZUR_TYP.TPB:');
    fields.forEach(function(f) { out.push('    self.' + f.name + ' := null;'); });
    // LOG_ZR
    out.push(''); out.push('LOG_ZR...:'); out.push('    --');
    fields.forEach(function(f) {
      var base = f.name.substring(3).toLowerCase();
      out.push('    old' + base + ',');
      out.push('    new' + base + ',');
    });
    out.push('    --');
    fields.forEach(function(f) {
      out.push('    p_old.' + f.name.toLowerCase() + ',');
      out.push('    p_new.' + f.name.toLowerCase() + ',');
    });
    // TRIGGER
    out.push(''); out.push('T_TAB_AUI...:'); out.push('    --');
    fields.forEach(function(f) {
      out.push('  l_new.' + f.name.toLowerCase() + ' := :new.' + f.name.toLowerCase() + ';');
    });
    out.push('    --');
    fields.forEach(function(f) {
      out.push('    l_old.' + f.name.toLowerCase() + ' := :old.' + f.name.toLowerCase() + ';');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
