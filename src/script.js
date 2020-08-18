'use strict';

import Vue from "vue";
import wwaPartsList from "./components/wwa-parts-list";
import wwaAudioList from "./components/wwa-audio-list";
import wwaWorldNumberInput from "./components/wwa-world-number-input";

import { BrowserEventEmitter } from "@wwawing/event-emitter";
import { WWALoader } from "@wwawing/loader";

import "./style.scss";

const FIRST_MESSAGE = 'テキストフォームにマップデータファイル名を入力し、「送信」ボタンを押してください。';

let app = new Vue({
  el: "#app",
  data: {
    fileName: '',
    message: FIRST_MESSAGE,
    waitingPassword: false, // 暗証番号入力待ちか？
    viewType: '', // 表示種類
    wwaData: {}
  },
  computed: {
    /**
     * @returns {boolean}
     */
    hasMessage: function() {
      return Object.entries(this.wwaData).length > 0 && !this.waitingPassword;
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
      this.closeMapdata();
      this.message = '読み込み中です・・・。';

      getData(this.fileName, wwaData => {
        this.wwaData = wwaData;
        if (wwaData.worldPassword !== "") {
          this.waitingPassword = true;
          return;
        }
        this.setupData();
      }, error => {
        try {
          this.message = error.message;
        } catch {
          this.message = '不明なエラーが発生しました。';
        }
      });
    },

    /**
     * 入力した暗証番号を判定します。
     * @param {object} input wwa-world-number-input.js を参照
     */
    receiveWorldNumber: function(input) {
      const answerWorldPassNumber = Math.floor(this.wwaData.worldPassNumber).toString();
      if (input.worldNumber !== answerWorldPassNumber) {
        this.message = "暗証番号が異なります。";
        this.closeMapdata();
        return;
      }
      this.waitingPassword = false;
      this.setupData();
    },

    /**
     * WWA のデータが見れる状態に整えます。
     */
    setupData: function() {
      this.message = this.fileName + ' から読み込んだメッセージの一覧です。';
      this.viewType = "MESSAGE";
    },

    /**
     * @param {string} type 
     */
    selectType: function(type) {
      this.viewType = type;
    },

    /**
     * マップデータを閉じます。
     */
    closeMapdata: function() {
      this.wwaData = {};
      this.waitingPassword = false;
    }

  },
  components: {
    'wwa-parts-list': wwaPartsList,
    'wwa-audio-list': wwaAudioList,
    'wwa-world-number-input': wwaWorldNumberInput
  }
});

/**
 * データを取得します。
 * @param {string} fileName 
 * @param {function} callbackFunction マップデータの読み込みに成功した場面に実行される関数
 * @param {function} errorFunction エラー発生時に実行される関数
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
