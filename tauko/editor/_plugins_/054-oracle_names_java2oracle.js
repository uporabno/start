{
  id: 'oracle_names_java2oracle',
  ime: 'Oracle - Names - Java 2 Oracle',
  ikona: '🍵',
  opis: 'Convert Java names to Oracle names.',
  opisDolg: 'camelCase → snake_case. Example: customerNameFirst → customer_name_first',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var result = '';
      for (var i = 0; i < vr.length; i++) {
        var c = vr[i];
        var cu = c.toUpperCase();
        var cl = c.toLowerCase();
        if (cu === c && cu !== cl) {
          result += '_' + cl;
        } else {
          result += cl;
        }
      }
      return result;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
