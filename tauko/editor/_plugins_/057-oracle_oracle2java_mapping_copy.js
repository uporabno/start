{
  id: 'oracle_oracle2java_mapping_copy',
  ime: 'Oracle - Oracle 2 Java mapping - Copy',
  ikona: '🗂',
  opis: 'Generate Java bean setter calls from Oracle field names.',
  opisDolg: 'Input: Oracle field names (one per line). Asks for bean name. Output: bean.setFieldName(rs.getString/getDate(columnIndex++));',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var bean = await prompt('Enter bean name:', 'rtxxBean');
    if (bean === null) return false;
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      // convert set_ + oracle_name → java setter name
      var parts = ('set_' + vr).split('_');
      var javaName = '';
      parts.forEach(function(part, i) {
        javaName += part.charAt(0).toUpperCase() + part.substring(1).toLowerCase();
      });
      javaName = javaName.charAt(0).toLowerCase() + javaName.substring(1);
      // determine type
      var isDate = javaName.indexOf('Dtm') >= 0 || vr.indexOf('_Dat_') >= 0 || javaName.indexOf('Sdate') >= 0;
      var getter = isDate ? 'rs.getDate(columnIndex++)' : 'rs.getString(columnIndex++)';
      return bean + '.' + javaName + '(' + getter + ');';
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
