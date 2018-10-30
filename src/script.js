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
  methods: {

    get: function (event) {
      getData(this.fileName, (wwaData) => {
        this.message = this.fileName + ' から読み込んだメッセージの一覧です。';

        this.partsMessages = wwaData['message'];
        this.objectAttributes = wwaData['objectAttributes'];
        this.mapAttributes = wwaData['mapAttributes'];
      }, (error) => {
        try {
          this.message = error.message;
        } catch {
          this.message = '不明なエラーが発生しました。';
        }
      });
    },

    getPartsNumber: function(messageID) {
      const ATR_MESSAGE = 5;

      console.log(this);
      // FIXME: HTMLファイル側から呼び出すと objectAttributes が見つからないと怒られる
      // TODO: 下記処理をコンポーネントに移行したいものの、WWAのパーツ属性のデータをコンポネントに置きたくないので、どうするか考える
      const objectPartsIndex = this.objectAttributes.findIndex((attributes) => {
        return attributes[ATR_MESSAGE] === messageID;
      });
      if (objectPartsIndex !== -1) {
        return {
          partsType: PartsType.PARTSTYPE_OBJECT,
          number: objectPartsIndex
        }
      }

      const mapPartsIndex = this.mapAttributes.findIndex((attributes) => {
        return attributes[ATR_MESSAGE] === messageID;
      });
      if (mapPartsIndex !== -1) {
        return {
          partsType: PartsType.PARTSTYPE_MAP,
          number: mapPartsIndex
        }
      }

      return {
        partsType: null,
        number: null
      };
    }
  },
  components: Parts
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
