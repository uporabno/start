{
  id: 'util_time',
  ime: 'Util - Time',
  ikona: '🕐',
  opis: 'Calculate time intervals from start time.',
  opisDolg: 'Input: first line is start time HH:MM. Calculates end times from 15-min intervals, starting at 2-hour offset, with results formatted as HH:MM-HH:MM ==> HH,MM.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    if (!v.length) return false;
    var C_START = 8;
    var out = [];
    v.forEach(function(vr) {
      var loc = vr.indexOf(':');
      if (loc < 0) { out.push(vr); return; }
      try {
        var h1 = parseInt(vr.substring(0, loc));
        var m1 = parseInt(vr.substring(loc + 1));
        for (var j = C_START; j <= 43; j++) {
          var h2 = h1, m2 = m1 + 15 * j;
          h2 += Math.floor(m2 / 60); m2 = m2 % 60;
          var hd = h2 - h1 - 1, md = m2 - m1 + 60;
          hd += Math.floor(md / 60); md = md % 60;
          md = Math.round(100 * md / 60);
          function p2(n) { return n < 10 ? '0'+n : ''+n; }
          if (j % 4 === 0 && j !== C_START) out.push('');
          out.push(p2(h1)+':'+p2(m1)+'-'+p2(h2)+':'+p2(m2)+' ==> '+p2(hd)+','+p2(md));
        }
      } catch(e) { out.push(vr); }
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
