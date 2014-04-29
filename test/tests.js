var marked = require('../lib/marked.js');
module.exports = { 
   test_add_rule_to_block_lexer: function (test) {
    var renderer = new marked.Renderer();
    renderer.newblock = function (that) {
      return that.token.text;
    }
    //Looks for !!(slug)
    var pound_pound = /^!!\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]/;
    var options = {
      'renderer': renderer,
      'extra_block_rules': {
        newblock: pound_pound
      },
      'extra_block_lexers': {
        newblock: function (cap) {
          return {
            type: 'newblock',
            text: cap[1]
          };
        }
      }
    };
    var lexer = new marked.Lexer(options);
    test.equals(lexer.rules.newblock.toString(), pound_pound.toString());

    marked.setOptions(options);
    var tokens = lexer.lex('!![foobar]');
    test.equals(tokens[0]['type'], 'newblock');
    test.equals(tokens[0]['text'], 'foobar');
    var text = marked.parser(tokens);
    
    test.equals(text, 'foobar');
    test.done();
  },
  test_add_rule_to_inline_lexer: function (test) {
    var renderer = new marked.Renderer();
    renderer.newblock = function (token) {
      return 'dollardollar';
    }
    var options = {
      'renderer': renderer,
      'extra_block_rules': null,
      'extra_block_lexers': null,
      'extra_inline_rules': {
        newblock: /!!/
      },
    };
    marked.setOptions(options);

    var lexer = new marked.Lexer(options);
    var tokens = lexer.lex('!!');
    var text = marked.parser(tokens);
    test.equals(text, '<p>dollardollar</p>\n');
    test.done();
  }
};
