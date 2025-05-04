"use strict";

/** @module speak */require('speak', function (require, module, exports) {
  var _ = function () {
    var D = {
        "en": {},
        "fr": {}
      },
      X = require("$").intl;
    function _() {
      return X(D, arguments);
    }
    _.all = D;
    return _;
  }();
  /**
  * @module tp4.speak
  *
  * @description
  * If speech synthesis is available, this module make the computer speak.
  *
  * @example
  * var mod = require('tp4.speak');
  */

  var synth = window.speechSynthesis;
  var voices = synth ? synth.getVoices() : [];
  var currentVoice;
  console.info("[speak] voices=...", voices);
  exports.isAvailable = function () {
    if (synth) return true;
    return false;
  };
  exports.getVoices = function () {
    return voices;
  };
  exports.setVoice = function (voice) {
    if (!synth) return false;
    currentVoice = voice;
    return true;
  };
  exports.speak = function (txt) {
    if (!synth) return false;
    var utter = new SpeechSynthesisUtterance(txt);
    if (currentVoice) {
      utter.voice = currentVoice;
    }
    synth.speak(utter);
    return true;
  };
  module.exports._ = _;
});