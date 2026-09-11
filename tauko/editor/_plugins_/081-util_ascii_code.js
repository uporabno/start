{
  id: 'util_ascii_code',
  ime: 'Util - Ascii code',
  ikona: '🔣',
  opis: 'Show ASCII code for each character.',
  opisDolg: 'For each character in each line outputs char{ascii_code}. Example: "A{65}".',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.split('').map(function(c) {
        return c + '{' + c.charCodeAt(0) + '}';
      }).join('');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
