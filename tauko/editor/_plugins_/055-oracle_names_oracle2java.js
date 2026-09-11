{
  id: 'oracle_names_oracle2java',
  ime: 'Oracle - Names - Oracle 2 Java',
  ikona: '☕',
  opis: 'Convert Oracle names to Java names.',
  opisDolg: 'snake_case → camelCase. Example: customer_name_first → customerNameFirst. Handles L_ prefix exception.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var parts = vr.split('_');
      var result = '';
      var prevL = false;
      parts.forEach(function(part, i) {
        if (i === 0) {
          var p = part.charAt(0).toUpperCase() + part.substring(1).toLowerCase();
          if (prevL) p = p.toLowerCase();
          if (p === 'L') prevL = true; else prevL = false;
          result += p;
        } else {
          var p = part.charAt(0).toUpperCase() + part.substring(1).toLowerCase();
          if (prevL) p = p.toLowerCase();
          if (p.toUpperCase() === 'L') prevL = true; else prevL = false;
          result += p;
        }
      });
      // first char lowercase
      return result.charAt(0).toLowerCase() + result.substring(1);
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
