var Asm = require("asm");
var Basic = require("basic");


describe('Module `Basic`', function() {
    describe('expression', function() {
        function check(code, expectedResult) {
            it('should parse "' + code + '"', function() {
                var basic = new Basic();
                var result;
                try {
                    basic.add( "$result=" + code + "\n");
                    var asm = new Asm( basic.asm() );
                    while (asm.next());
                    result = asm.runtime.vars['$result'];
                }
                catch (ex) {
                    result = JSON.stringify(ex, null, '  ');
                }
                if (result != expectedResult) {
                    console.log("Expression: " + code);
                    console.log("Expected:   " + expectedResult);
                    console.log("But got:    " + result);
                }
                expect(result).toEqual(expectedResult);
            });
        }

        check("2*3+1", 8);
        check(" 2 *3+ 1  ", 8);
        check(" 2 *3+  ...\n 1  ", 8);

        check("(2*3)+1", 111);
    });
});
