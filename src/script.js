'use strict';

import Vue from "vue";
import wwaPartsList from "./components/wwa-parts-list";

import { BrowserEventEmitter } from "@wwawing/event-emitter";
import { WWALoader } from "@wwawing/loader";

let app = new Vue({
  el: "#app",
  data: {
    fileName: '',
    message: 'テキストフォームにマップデータファイル名を入力し、「送信」ボタンを押してください。',
    wwaData: {}
  },
  computed: {
    /**
     * @returns {boolean}
     */
    hasMessage: function() {
      return Object.entries(this.wwaData).length > 0;
    }
  },
  methods: {

    get: function (event) {
      const self = this;

      getData(this.fileName, function (wwaData) {
        self.message = self.fileName + ' から読み込んだメッセージの一覧です。';
        self.wwaData = wwaData;
      }, function (error) {
        try {
          self.message = error.message;
        } catch {
          self.message = '不明なエラーが発生しました。';
        }
      });
    },

  },
  components: {
    'wwa-parts-list': wwaPartsList,
  }
});

/**
 * データを取得します。
 * @param {string} fileName 
 * @param {function} callbackFunction
 * @param {function} console.error
 */
function getData(fileName, callbackFunction, errorFunction) {
  const eventEmitter = new BrowserEventEmitter();
  const loader = new WWALoader(fileName, eventEmitter);

  const mapdataListener = eventEmitter.addListener("mapData", wwaMap => {
    eventEmitter.removeListener("mapData", mapdataListener);
    eventEmitter.removeListener("error", errorListener);
    callbackFunction(wwaMap);
  });

  const errorListener = eventEmitter.addListener("error", error => {
    errorFunction(error);
  });

  loader.requestAndLoadMapData();
}
