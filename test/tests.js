var marked = require('../lib/marked.js');
module.exports = { 
  test_add_rule_to_lexer: function (test) {
    var renderer = new marked.Renderer();
    renderer.newblock = function (token) {
      return 'dollardollar';
    }
    var options = {
      'renderer': renderer,
      'extra_block_rules': {
        newblock: /aa/
      },
      'extra_block_lexers': {
        newblock: function (cap) {
          return {
            type: 'newblock',
            text: cap
          };
        }
      }
    };
    var lexer = new marked.Lexer(options);
    test.equals(lexer.rules.newblock.toString(), '/aa/');

    marked.setOptions(options);
    var tokens = lexer.lex('aa');
    test.equals(tokens[0]['type'], 'newblock');
    test.equals(tokens[0]['text'], 'aa');
    var text = marked.parser(tokens);
    
    test.equals(text, 'dollardollar');
    test.done();
  }
};
