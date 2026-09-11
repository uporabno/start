{
  id: 'oracle_add_tablespace',
  ime: 'Oracle - Add tablespace',
  ikona: '🗄',
  opis: 'Add tablespace line before each "/" in Oracle script.',
  opisDolg: 'Inserts "tablespace <name>" before every "/" line. Asks for tablespace name.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var ts = await prompt('Enter tablespacename:', 'xxcgrow');
    if (ts === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    v.forEach(function(vr) {
      if (vr === '/') out.push('tablespace ' + ts);
      out.push(vr);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
