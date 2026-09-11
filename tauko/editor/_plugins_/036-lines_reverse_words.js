{
  id: 'lines_reverse_words',
  ime: 'Lines - Reverse - Words in lines',
  ikona: '🔀',
  opis: 'Reverse words in each line.',
  opisDolg: 'Splits by separators ( . , : ; = ! < > -), reverses word order keeping separators.',
  separator: false,
  zazeni: async function(ta, undoTA) {
    var SEPS = ' .,;:=!<>-';
    var v = ta.value.replace(/\r/g,'').split('\n');
    var out = v.map(function(vr) {
      // parse into tokens: [word, sep, word, sep, ...]
      var tokens = [];
      var cur = '';
      for (var i = 0; i < vr.length; i++) {
        var c = vr[i];
        if (SEPS.indexOf(c) >= 0) {
          tokens.push({word: cur, sep: c});
          cur = '';
        } else {
          cur += c;
        }
      }
      // last word (no trailing sep)
      var lastWord = cur;
      if (tokens.length === 0) return vr;
      // rebuild reversed: last word first, then tokens in reverse with sep before word
      var result = lastWord;
      for (var j = tokens.length - 1; j >= 0; j--) {
        result = result + tokens[j].sep + tokens[j].word;
      }
      return result;
    });
    undoTA.value = ta.value;
    ta.value = out.join('\n');
  }
}
