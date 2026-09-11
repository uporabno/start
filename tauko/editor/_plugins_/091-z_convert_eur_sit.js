{
  id: 'z_convert_eur_sit',
  ime: 'Z - Convert - € - EUR-SIT',
  ikona: '💶',
  opis: 'Convert EUR to SIT (×239.64).',
  opisDolg: 'Each line treated as a number. Multiplies by 239.64. Commas treated as decimal point.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var num = parseFloat(vr.replace(',','.'));
      if (isNaN(num)) return vr;
      return String(num * 239.64).replace(',','.');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
