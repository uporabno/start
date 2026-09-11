{
  id: 'z_convert_sit_eur',
  ime: 'Z - Convert - € - SIT-EUR',
  ikona: '🪙',
  opis: 'Convert SIT to EUR (÷239.64).',
  opisDolg: 'Each line treated as a number. Divides by 239.64. Commas treated as decimal point.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      var num = parseFloat(vr.replace(',','.'));
      if (isNaN(num)) return vr;
      return String(num / 239.64).replace(',','.');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
