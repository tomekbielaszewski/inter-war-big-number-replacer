// ==UserScript==
// @name         InterWar: Big numbers replacer
// @namespace    http://inter-war.com.pl/
// @version      0.1
// @description  Replaces all big numbers in format of 123.123.123 to 123.k2
// @author       tomekbielaszewski
// @match        http://inter-war.com.pl/game.php*
// @grant        none
// ==/UserScript==

(function() {
    function replaceLongNumbers() {
        $('body :not(script) :not(style)').contents().filter(function() {
            return this.nodeType === 3;
        }).replaceWith(function() {
            let {reg, text} = detectAndReplace(this.nodeValue);
            return this.nodeValue.replace(reg, text)
        });
    }

    function detectAndReplace(text) {
        if(text.indexOf('/') > 0) {
            return {text, text}
        }
        let reg = /(\d{1,3}\.){2,}\d{1,3}/; //number in format 123.123.123
        if(reg.test(text)) {
            let kilos = count(text, /\./);
            let num = /(\d{1,3}\.)?/.exec(text);
            num = num && num.length > 0 ? num[0] : num;

            console.log("kilos: " + kilos);
            console.log(num);

            text = num + "k" + kilos
        }
        return {text, reg};
    }

    function count(s1, letter) {
        return ( s1.match( RegExp(letter,'g') ) || [] ).length;
    }

    replaceLongNumbers();

    let oldResourceTicker = resourceTicker;

    resourceTicker = function (config) {
        oldResourceTicker(config);
        replaceLongNumbers();
    }
})();