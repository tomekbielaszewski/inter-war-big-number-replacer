// ==UserScript==
// @name         InterWar: Big numbers replacer
// @namespace    http://inter-war.com.pl/
// @version      0.1
// @description  Replaces all big numbers in format of 123.123.123 to 123.k2
// @author       tomekbielaszewski
// @match        http://inter-war.com.pl/game.php*
// @grant        none
// ==/UserScript==

(function () {
  const TEXT_NODE_TYPE = 3;
  const BIG_NUMBER_REGEXP = /(\d{1,3}\.){2,}\d{1,3}/g; //number in format 123.123.123

  function replaceLongNumbers() {
    $('body :not(script) :not(style)')
      .contents()
      .filter(function () {
        return this.nodeType === TEXT_NODE_TYPE;
      })
      .replaceWith(function () {
        return [this.nodeValue]
          .map(t => t.split('\n'))
          .flat()
          .map(substituteMatching)
          .join('\n');
      });
  }

  function substituteMatching(text) {
    while (containsBigNumber(text)) {
      text = text.replace(BIG_NUMBER_REGEXP, substituteBigNumber);
    }
    return text;
  }

  function containsBigNumber(text) {
    return BIG_NUMBER_REGEXP.test(text);
  }

  function substituteBigNumber(text) {
    let kilos = count(text, /\./);
    let num = /(\d{1,3}\.)?/.exec(text);
    num = num && num.length > 0 ? num[0] : num;
    text = num + "k" + kilos;
    return text;
  }

  function count(s1, letter) {
    return (s1.match(RegExp(letter, 'g')) || []).length;
  }


  substituteMatching('123.123.123');

  replaceLongNumbers();

  let oldResourceTicker = resourceTicker;

  resourceTicker = function (config) {
    oldResourceTicker(config);
    replaceLongNumbers();
  };
})();