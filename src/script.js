'use strict';

import Vue from "vue";
import wwaPartsList from "./components/wwa-parts-list";
import wwaAudioList from "./components/wwa-audio-list";

import { BrowserEventEmitter } from "@wwawing/event-emitter";
import { WWALoader } from "@wwawing/loader";

import "./style.scss";

let app = new Vue({
  el: "#app",
  data: {
    fileName: '',
    message: 'テキストフォームにマップデータファイル名を入力し、「送信」ボタンを押してください。',
    viewType: '',
    wwaData: {}
  },
  computed: {
    /**
     * @returns {boolean}
     */
    hasMessage: function() {
      return Object.entries(this.wwaData).length > 0;
    },
    directoryPath: function() {
      const directoryPath = this.fileName.split("/").slice(0, -1).join("/");
      if (directoryPath === "") {
        return ".";
      }
      return directoryPath;
    }
  },
  methods: {

    get: function () {
      this.wwaData = {};
      this.message = '読み込み中です・・・。';

      getData(this.fileName, wwaData => {
        this.message = this.fileName + ' から読み込んだメッセージの一覧です。';
        this.viewType = "MESSAGE";
        this.wwaData = wwaData;
      }, error => {
        try {
          this.message = error.message;
        } catch {
          this.message = '不明なエラーが発生しました。';
        }
      });
    },

    /**
     * @param {string} type 
     */
    selectType: function(type) {
      this.viewType = type;
    }

  },
  components: {
    'wwa-parts-list': wwaPartsList,
    'wwa-audio-list': wwaAudioList,
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
