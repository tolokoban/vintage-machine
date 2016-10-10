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

        check("(2*3)+1", 7);
        check("((2*3)+1)+3", 10);

        check("(((27)))", 27);

        check("55-33", 22);
        check("55+-33", 22);
        check("-33+55", 22);
        check("5.5-3.3", 2.2);
        check("5.5+-3.3", 2.2);
        check("-3.3+5.5", 2.2);

        check("3 ^  3", 27);
        check("16 ^ 0.5", 4);
        check("16 ^ .5", 4);
        check("16 ^ -.5", .25);
        check("27 ^ (1 / 3)", 3);

        check("7 = (3+4)", 1);
        check("7 <> (3+4)", 0);
        check("7 > (3+4)", 0);
        check("7 >= (3+4)", 1);
        check("7 < (3+4)", 0);
        check("7 <= (3+4)", 1);

        check('"3.14" = 3.14', 1);
        check('("3" + ".14") = 3.14', 1);
        check('"3.14" <> 3.124', 1);
        check('"banane" > "arc"', 1);
        check('"banane" >= "arc"', 1);
        check('"banane" < "arc"', 0);
        check('"banane" <= "arc"', 0);
        check('"banane" <> "arc"', 1);
        check('"banane" = "arc"', 0);
        check('"ardu" < "archers"', 0);
    });
});
