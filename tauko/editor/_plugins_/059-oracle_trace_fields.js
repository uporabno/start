{
  id: 'oracle_trace_fields',
  ime: 'Oracle - Trace fields',
  ikona: '🔎',
  opis: 'Generate Oracle trace.assert() call for field values.',
  opisDolg: 'Input: list of field names. Asks for prefix (e.g. "table."). Generates a trace.assert(true, ...) with all fields.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var prefix = await prompt("Vnesi prefix polj (npr: 'ime_tabele.'):", '');
    if (prefix === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n').filter(function(vr){ return vr !== ''; });
    var out = ["trace.assert(true, 'Izpis vrednosti polj: ' ||"];
    v.forEach(function(f, i) {
      var sep = i === 0 ? '' : ', ';
      var cont = i < v.length - 1 ? " ||" : ");";
      out.push("                   '" + sep + prefix + f + "='' || " + prefix + f + cont);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
