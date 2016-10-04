var Asm = require("asm");


describe('Module `asm`', function() {
    function check(code, result) {
        return function() {
            var asm = new Asm(null, code);
            asm.next();
            expect( asm.runtime.stack ).toEqual( result );
        };
    }

    describe('Infinit loop', function() {
        it('should exit of an infinite loop after a predefined cost',
           check([0, 1, Asm.ADD, -4, Asm.JMP], [2500, -4]));
    });
    
    describe('GET / SET', function() {
        it('should compute triangular numbers', check(
            [
                "idx", 10, Asm.SET,
                0,
                "idx", Asm.GET,
                Asm.ADD,
                "idx",
                "idx", Asm.GET, 1, Asm.SUB,
                Asm.SET,
                "idx", Asm.GET,
                0 -13, Asm.JNZ
            ],
            [55]
        ));
    });

    describe('DEC', function() {
        it('should decrement 7 to 6', check(
            ["x", 7, Asm.SET, "x", Asm.DEC], [6]));
    });

    describe('JMP', function() {
        it('should jump forward',
           check([27, 2, Asm.JMP, 1, Asm.ADD, 1, Asm.ADD],
                 [28]));
        it('should jump backward',
           check([27,
                  4,  Asm.JMP,
                  1,  Asm.ADD,
                  2,  Asm.JMP,
                  -6, Asm.JMP,
                  1,  Asm.ADD],
                 [29]));
    });
    
    describe('JZE', function() {
        it('should jump if zero',
           check([27, 0, 2, Asm.JZE, 1, Asm.ADD, 1, Asm.ADD], [28]));
        it('should not jump if not zero',
           check([27, 1, 2, Asm.JZE, 1, Asm.ADD, 1, Asm.ADD], [29]));
    });
    
    describe('JNZ', function() {
        it('should jump if zero',
           check([27, 0, 2, Asm.JNZ, 1, Asm.ADD, 1, Asm.ADD], [29]));
        it('should not jump if not zero',
           check([27, 1, 2, Asm.JNZ, 1, Asm.ADD, 1, Asm.ADD], [28]));
    });
    
    describe('JGT', function() {
        it('should not jump because -1 is NOT > zero',
           check([27, -1, 2, Asm.JGT, 1, Asm.ADD, 1, Asm.ADD], [29]));
        it('should not jump because 0 is NOT > zero',
           check([27, 0, 2, Asm.JGT, 1, Asm.ADD, 1, Asm.ADD], [29]));
        it('should jump because 1 is > zero',
           check([27, 1, 2, Asm.JGT, 1, Asm.ADD, 1, Asm.ADD], [28]));
    });
    
    describe('JGE', function() {
        it('should not jump because -1 is NOT >= zero',
           check([27, -1, 2, Asm.JGE, 1, Asm.ADD, 1, Asm.ADD], [29]));
        it('should jump because 0 is >= zero',
           check([27, 0, 2, Asm.JGE, 1, Asm.ADD, 1, Asm.ADD], [28]));
        it('should jump because 1 is >= zero',
           check([27, 1, 2, Asm.JGE, 1, Asm.ADD, 1, Asm.ADD], [28]));
    });
    
    describe('JLT', function() {
        it('should not jump because 1 is NOT < zero',
           check([27, 1, 2, Asm.JLT, 1, Asm.ADD, 1, Asm.ADD], [29]));
        it('should not jump because 0 is NOT < zero',
           check([27, 0, 2, Asm.JLT, 1, Asm.ADD, 1, Asm.ADD], [29]));
        it('should jump because -1 is < zero',
           check([27, -1, 2, Asm.JLT, 1, Asm.ADD, 1, Asm.ADD], [28]));
    });
    
    describe('JLE', function() {
        it('should not jump because 1 is NOT <= zero',
           check([27, 1, 2, Asm.JLE, 1, Asm.ADD, 1, Asm.ADD], [29]));
        it('should jump because 0 is <= zero',
           check([27, 0, 2, Asm.JLE, 1, Asm.ADD, 1, Asm.ADD], [28]));
        it('should jump because -1 is <= zero',
           check([27, -1, 2, Asm.JLE, 1, Asm.ADD, 1, Asm.ADD], [28]));
    });
    
    describe('ADD', function() {
        it('should add 3 and 7', check([3, 7, Asm.ADD], [10]));
        it('should add -3.14 and +3.14', check([-3.14, 3.14, Asm.ADD], [0]));
        it('should not remove more than two elements from the stack',
           check( [666, 3.14, -3.14, Asm.ADD], [666, 0] ));
        it('should work with nothing in the stack', check( [Asm.ADD], [0] ));
        it('should work if the stack has a length of 1', check( [27, Asm.ADD], [27] ));
        it('should concat strings', check( ["fab", "ien", Asm.ADD], ["fabien"] ));
        it('should concat string with number', check( ["fab", 74, Asm.ADD], ["fab" + 74] ));
        it('should concat number with string', check( [74, "fab", Asm.ADD], [74] ));
        it('should concat number with string (representing a number)',
           check( [74, "27", Asm.ADD], [101] ));
        it('should concat array with string', check( [[1, 2], "fab", Asm.ADD], [[1, 2, 'fab']] ));
        it('should concat array with array', check( [[1, 2], [3, 4], Asm.ADD], [[1, 2, 3, 4]] ));
    });

    describe('SUB', function() {
        it('should add 3 and 7', check( [3, 7, Asm.SUB], [-4] ));
        it('should add -3.14 and +3.14', check( [3.14, -3.14, Asm.SUB], [6.28] ));
        it('should not remove more than two elements from the stack',
           check( [666, 3.14, -3.14, Asm.SUB], [666, 6.28] ));
        it('should work with nothing in the stack', check( [Asm.SUB], [0] ));
        it('should work if the stack has a length of 1', check( [27, Asm.SUB], [-27] ));
    });

    describe('MUL', function() {
        it('should add 3 and 7', check( [3, 7, Asm.MUL], [21] ));
        it('should add -3.14 and +3.14', check( [3.14, -3.14, Asm.MUL], [-9.8596] ));
        it('should not remove more than two elements from the stack',
           check( [666, 3.14, -3.14, Asm.MUL], [666, -9.8596] ));
        it('should work with nothing in the stack', check( [Asm.MUL], [0] ));
        it('should work if the stack has a length of 1', check( [27, Asm.MUL], [0] ));
    });

    describe('DIV', function() {
        it('should divide 14.6 by 2.0', check( [14.6, 2.0, Asm.DIV], [7.3] ));
        it('should divide -14.6 by 2.0', check( [-14.6, 2.0, Asm.DIV], [-7.3] ));
        it('should divide -14.6 by -2.0', check( [-14.6, -2.0, Asm.DIV], [7.3] ));
        it('should be optimized when a=0', check( [0, -2.0, Asm.DIV], [0] ));
        it('should return 0/0=0', check( [0, 0, Asm.DIV], [0] ));
        it('should not complain for positive division by zero',
           check( [3.5, 0, Asm.DIV], [Number.MAX_VALUE] ));
        it('should not complain for negative division by zero',
           check( [-3.5, 0, Asm.DIV], [-Number.MAX_VALUE] ));
    });

    describe('ABS', function() {
        it('should work with "-7.44"', check( ["-7.44", Asm.ABS], [7.44] ));
        it('should return 0 with "-Bob"', check( ["-Bob", Asm.ABS], [0] ));
        it('should return the absolute value of -7.55', check( [-7.55, Asm.ABS], [7.55] ));
        it('should return the absolute value of +7.55', check( [7.55, Asm.ABS], [7.55] ));
    });

    describe('NEG', function() {
        it('should work with "-7.44"', check( ["-7.44", Asm.NEG], [7.44] ));
        it('should return 0 with "-Bob"', check( ["-Bob", Asm.NEG], [-0] ));
        it('should return 0 for NaN', check( [-7.55, Asm.NEG], [7.55] ));
        it('should negate -7.55', check( [-7.55, Asm.NEG], [7.55] ));
        it('should negate +7.55', check( [7.55, Asm.NEG], [-7.55] ));
        it('should be idempotent', check( [7, Asm.NEG, Asm.NEG], [7] ));
        it('should be idempotent', check( [Math.PI, Asm.NEG, Asm.NEG], [Math.PI] ));
        it('should be idempotent', check( [-7, Asm.NEG, Asm.NEG], [-7] ));
        it('should be idempotent', check( [-Math.PI, Asm.NEG, Asm.NEG], [-Math.PI] ));
    });
});
