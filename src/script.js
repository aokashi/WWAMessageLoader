'use strict';

import Vue from "vue";
import Parts from "./parts";
import * as PartsType from "./partsType";
import WWALoader from "./wwaload.worker.js";

const ATTR_MESSAGE = 5;

let app = new Vue({
  el: "#app",
  data: {
    fileName: '',
    message: 'テキストフォームにマップデータファイル名を入力し、「送信」ボタンを押してください。',
    partsMessages: {},
    objectAttributes: {},
    mapAttributes: {}
  },
  computed: {
    partsObjects: function() {
      let result = {};

      for (let key in this.partsMessages) {
        if (this.partsMessages[key] === '') {
          continue;
        }

        let partsInfo = this.makePartsNumber(parseInt(key));
        result[key] = {
          number: key,
          message: this.partsMessages[key],
          partsType: partsInfo.partsType,
          partsNumber: partsInfo.number
        };
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
        self.objectAttributes = wwaData['objectAttribute'];
        self.mapAttributes = wwaData['mapAttribute'];
      }, function (error) {
        try {
          self.message = error.message;
        } catch {
          self.message = '不明なエラーが発生しました。';
        }
      });
    },

    /**
     * @param {number} messageID 
     */
    makePartsNumber: function(messageID) {
      const objectPartsIndex = this.objectAttributes.findIndex(function (attributes) {
        return attributes[ATTR_MESSAGE] === messageID;
      });
      if (objectPartsIndex !== -1) {
        return {
          partsType: PartsType.PARTSTYPE_OBJECT,
          number: objectPartsIndex
        }
      }
  
      const mapPartsIndex = this.mapAttributes.findIndex(function (attributes) {
        return attributes[ATTR_MESSAGE] === messageID;
      });
      if (mapPartsIndex !== -1) {
        return {
          partsType: PartsType.PARTSTYPE_MAP,
          number: mapPartsIndex
        }
      }
  
      return {
        partsType: PartsType.PARTSTYPE_UNDEFINED,
        number: 0
      };
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
