'use strict';

import Vue from "vue";
import Parts from "./parts";
import * as PartsType from "./partsType";
import WWALoader from "./wwaload.worker.js";

let app = new Vue({
  el: "#app",
  data: {
    fileName: '',
    message: 'URLに ?(マップデータ名) を添えてアクセスしてください。',
    partsMessages: {},
    objectAttributes: {},
    mapAttributes: {}
  },
  computed: {
    partsMessagesWithoutEmptyMessage: function() {
      let result = {};
      for (let key in this.partsMessages) {
        if (this.partsMessages[key] !== '') {
          result[key] = this.partsMessages[key];
        }
      }
      return result;
    }
  },
  methods: {

    get: function (event) {
      const self = this;

      getData(this.fileName, function (wwaData) {
        self.message = self.fileName + ' から読み込んだメッセージの一覧です。';

        self.partsMessages = wwaData['message'];
        self.objectAttributes = wwaData['objectAttributes'];
        self.mapAttributes = wwaData['mapAttributes'];
      }, function (error) {
        try {
          self.message = error.message;
        } catch {
          self.message = '不明なエラーが発生しました。';
        }
      });
    }
  },
  components: {
    Parts
  }
});

/**
 * データを取得します。
 * @param {string} fileName 
 * @param {function} callbackFunction
 * @param {function} console.error
 */
function getData(fileName, callbackFunction, errorFunction) {
  const worker = new WWALoader(WWALoader);

  worker.postMessage({
    fileName: './' + fileName
  });
  worker.addEventListener('message', (e) => {
    if (e.data.error !== null) {
      errorFunction(e.data.error);
    }
    if (e.data.progress === null) {
      callbackFunction(e.data.wwaData);
    }
  });
}
