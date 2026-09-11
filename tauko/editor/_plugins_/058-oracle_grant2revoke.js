{
  id: 'oracle_grant2revoke',
  ime: 'Oracle - Script - Grant 2 Revoke',
  ikona: '🔐',
  opis: 'Create REVOKE script from GRANT script.',
  opisDolg: 'Replaces "GRANT " with "REVOKE " and " TO " with " FROM " (case-insensitive).',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      return vr.replace(/GRANT /gi, 'REVOKE ').replace(/ TO /gi, ' FROM ');
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
