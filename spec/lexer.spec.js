var Lexer = require("lexer");

describe('Lexer', function() {
    function shouldParse(id, codes) {
        if (!Array.isArray( codes )) codes = [codes];
        it('should match single tokens ' + id, function() {
            codes.forEach(function (code) {
                var lexer = new Lexer( code );
                var tkn = lexer.next( id );
                var tknId = tkn ? tkn.id : 'null';
                if (!tkn || tkn.id != id) {
                    console.error(lexer);
                    console.error("\n"
                                  + "Code:     " + code + "\n"
                                  + "Expected: " + id + "\n"
                                  + "But got:  " + tknId);
                }
                expect(tknId).toEqual( id );
            });
        });
    };

    var id, codes;
    var shouldData = {
        EOL: ["\n"],
        VAR: ["$hsfhfb", "  $toto"],
        NUM: ["3.27", "1.4", "-48.888", "33"],
        STR: ['"I\'m a string!"', '"Inner\"string"'],
        COLON: [":"],
        BINOP: [">="],
        PAR_OPEN: ["("],
        PAR_CLOSE: [")"],
        COMMA: [","],
        FUNC: ["cos(", "sin(", "rnd(", "max("],
        INST: ["disk", "Disk", "DISK", "dISk"]
    };
    for( id in shouldData ) {
        codes = shouldData[id];
        shouldParse( id, codes );
    }
});
