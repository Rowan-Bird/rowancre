/**
 *  I'm guessing Win Cal is doing a queue that stores each numbers group and operator as single entity.
 *  Here, it's char-by-char string manipulation + eval().
 */
$(function () {
    var numKeyReset = false;
    var lgQueue = "0";
    var smQueue = "";
    var query = "";
    var memory = "";

    var numRegEx = /^[0-9|.]$/;
    var operRegEx = /[+|\-|*|/|%]/;

    $('button').on('click', function () {
        var key = $(this).attr("value");

        /**
         *  Numbers
         */
        if (numRegEx.test(key)) {
            if (numKeyReset) {  // so previous result won't stack with new num
                clear();
                numKeyReset = false;
            }
            // TODO: zero handling at first digit is still different than win cal
            if (lgQueue[0] === "0" && lgQueue.length == 1) {
                if (query.length != 0) {
                    lgQueue = key;
                    query += key;
                } else {
                    lgQueue = key;
                    query = key;
                }
                sync();
            } else {
                lgQueue += key;
                query += key;
                sync();
            }
        }
        numKeyReset = false;

        /**
         *  Usual Operators
         */
        if (operRegEx.test(key)) {
            // for repeated operator keys
            if (operRegEx.test(query[query.length - 1])) {
                smQueue = smQueue.slice(0, -1) + key;
                query = query.slice(0, -1) + key;
                lgQueue = $('.lg-text').html();   // get gone value(lgQueue = "" below) from DOM
            } else {
                smQueue += lgQueue;
                // eager calulation to avoid operator precedence intentionally.
                if (operRegEx.test(query)) { 
                    query = lgQueue = evalStr(smQueue);
                }
                smQueue += key;
                query += key;
            }
            sync();
            lgQueue = "";   // so previous result won't stack with new num
        }
        if (key === '=') {
            smQueue = ""; 
            lgQueue = evalStr(query);
            query = lgQueue;
            sync();
            numKeyReset = true;
        }

        /**
         *  Speical keys
         */
        if (key === 'backspace') {
            if (lgQueue.length > 1) {
                lgQueue = lgQueue.slice(0, -1);
                
            } else if (lgQueue.length == 1) {
                lgQueue = "0";
            }
            query = query.slice(0, -1);
            sync();
        }
        if (key === 'sign') {
            if (lgQueue.length != 0) {
                if (lgQueue[0] != '-') {
                    var temp = query.slice(0, -lgQueue.length);
                    lgQueue = '-' + lgQueue;
                    query = temp + lgQueue;
                } else {
                    var temp = query.slice(0, -lgQueue.length);
                    lgQueue = lgQueue.substring(1, lgQueue.length);
                    query = temp + lgQueue;
                }
                sync();
            }
        }
        if (key === 'reciprocal') {
            var temp = query.slice(0, -lgQueue.length);
            lgQueue = evalStr("1/" + lgQueue);
            query = temp + lgQueue;
            sync();
        }
        if (key === 'sqrt') {
            var temp = query.slice(0, -lgQueue.length);
            lgQueue = evalStr(Math.sqrt(lgQueue));
            query = temp + lgQueue;
            sync();
        }

        /**
         *  Memory keys
         */
        if (key === 'ms') {
            memory = lgQueue;
            numKeyReset = true;
            $('.m-icon').show();
        }
        if (key === 'mc') {
            memory = "";
            $('.m-icon').hide();
        }
        if (key === 'mr') {
            var temp = query.slice(0, -lgQueue.length);
            lgQueue = memory;
            query = temp + memory;
            sync();
            numKeyReset = true;
        }
        if (key === 'mPlus') {
            if (memory.length == 0) {
                memory = lgQueue;
                $('.m-icon').show();
            } else {
                memory = evalStr(memory + "+" + lgQueue);
            }
            numKeyReset = true;
        }
        if (key === 'mMinus') {
            if (memory.length == 0) {
                memory = "-" + lgQueue;
                $('.m-icon').show();
            } else {
                memory = evalStr(memory + "-" + lgQueue);
            }
            numKeyReset = true;
        }
        if (memory == '0') {
            memory = "";
            $('.m-icon').hide();
        }

        /**
         *  Clears
         */
        if (key === 'c') {
            clear();
            sync();
        }
        if (key === 'ce') {
            query = query.slice(0, -lgQueue.length);
            lgQueue = "0";
            sync();
        }

        console.log(query);
    });

    function evalStr(str) {
        str = str + "";
        // fix parser errors
        str = str.replace(/^\-/,'0-');
        str = str.replace(/\-\-/,'+');

        var result = eval(str) + "";

        // error handlings
        if (result.indexOf('Infinity') != -1) {
            $('.error').html('Cannot divide by zero');
            return "0";
        }
        if (result.indexOf('NaN') != -1) {
            $('.error').html('Invalid input');
            return "0";
        }

        if (result.length > 12) {   // limited 12 digits output
            result = Number(result).toFixed(12);
        }
        return result;
    }

    function clear() {
        lgQueue = "0";
        smQueue = "";
        query = "";
        $('.error').html("");
    }
    function sync() {
        $('.lg-text').html(lgQueue);
        $('.sm-text').html(smQueue);
    }
});