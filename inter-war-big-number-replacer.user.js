// ==UserScript==
// @name         InterWar: Big numbers replacer
// @namespace    http://inter-war.com.pl/
// @version      0.2
// @description  Replaces all big numbers in format of 123.123.123 to 123.k2
// @author       tomekbielaszewski
// @match        http://inter-war.com.pl/game.php*
// @grant        none
// @updateURL    https://github.com/tomekbielaszewski/inter-war-big-number-replacer/raw/master/inter-war-big-number-replacer.user.js
// @installURL   https://github.com/tomekbielaszewski/inter-war-big-number-replacer/raw/master/inter-war-big-number-replacer.user.js
// @downloadURL  https://github.com/tomekbielaszewski/inter-war-big-number-replacer/raw/master/inter-war-big-number-replacer.user.js
// ==/UserScript==

(function () {
  const TEXT_NODE_TYPE = 3;
  const BIG_NUMBER_REGEXP = /(\d{1,3}\.){2,}\d{1,3}/g; //number in format 123.123.123

  function replaceLongNumbers() {
    $('body :not(script) :not(style)')
      .contents()
      .filter(textNodesOnly)
      .filter(notFleetPage0_3)
      .replaceWith(function () {
        return [this.nodeValue]
          .map(t => t.split('\n'))
          .flat()
          .map(substituteMatching)
          .join('\n');
      });
  }

  function textNodesOnly() {
    return this.nodeType === TEXT_NODE_TYPE;
  }

  function notFleetPage0_3() {
    return !this.baseURI.includes("page=fleet");
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
    let num = text.substring(0, 5);
    text = num + " k" + kilos;
    return text;
  }

  function count(s1, letter) {
    return (s1.match(RegExp(letter, 'g')) || []).length;
  }

  replaceLongNumbers();

  let oldResourceTicker = resourceTicker;

  resourceTicker = function (config) {
    oldResourceTicker(config);
    replaceLongNumbers();
  };
})();