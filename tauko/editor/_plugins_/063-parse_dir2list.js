{
  id: 'parse_dir2list',
  ime: 'Parse - Dir 2 List',
  ikona: '📁',
  opis: 'Convert "dir" command output to list.',
  opisDolg: 'Paste output of "dir /b" or similar. Extracts only filenames (removes paths and size lines).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = [];
    v.forEach(function(vr) {
      if (vr.indexOf('\\') >= 0) {
        out.push('');
        out.push('>>' + vr);
      } else if (vr.length > 36) {
        var name = vr.substring(36);
        if (name === '.' || name === '..') return;
        if (vr.substring(21,26) === '<DIR>') out.push('<DIR>  ' + name);
        else if (vr.substring(17,23) === ' bytes') return;
        else out.push('<FILE> ' + name);
      }
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
