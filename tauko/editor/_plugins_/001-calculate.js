{
  id: 'calculate',
  ime: 'Calculate',
  ikona: '🧮',
  opis: 'Evaluates or executes an argument.',
  opisDolg: 'Example: Math.cos(3.14/3)',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    for (var i = 0; i < v.length; i++) {
      try { out.push(eval(v[i])); }
      catch(e) { await alert('Napaka: ' + e.message); return false; }
    }
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
