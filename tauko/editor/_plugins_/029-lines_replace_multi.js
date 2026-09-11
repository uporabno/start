{
  id: 'lines_replace_multi',
  ime: 'Lines - Replace - Multi',
  ikona: '🔁',
  opis: 'Replace multiple pairs of strings (tab-separated pairs).',
  opisDolg: 'Parameter: Old1<tab>New1<tab>Old2<tab>New2<tab>... Use "Lines - Replace - Multi - Prepare parameter" to build the parameter from a list.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var params = await prompt('Strings to replace separated by <tab> (Old1\tNew1\tOld2\tNew2...):', 'A\tAnew\tB\tBnew');
    if (params === null) return false;
    var parts = params.split('\t');
    if (parts.length % 2 !== 0) {
      alert('Not an even number of values separated by <tab>. Count: ' + parts.length + '.');
      return false;
    }
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.slice();
    for (var p = 0; p < parts.length; p += 2) {
      var oldStr = parts[p];
      var newStr = parts[p + 1];
      var re = new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
      out = out.map(function(vr) { return vr.replace(re, newStr); });
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
