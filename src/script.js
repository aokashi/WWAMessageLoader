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

    /**
     * WWA マップデータを取得します。
     *     暗証番号が含まれている場合はデータに含めず、暗証番号の入力を求めます。
     */
    get: function () {
      this.closeMapdata();
      this.message = '読み込み中です・・・。';
      getData(this.fileName, wwaData => {
        if (wwaData.worldPassword !== "") {
          this.waitingPassword = true;
          return;
        }
        this.setupData(wwaData);
      }, this.showError.bind(this));
    },

    /**
     * 入力した暗証番号を判定します。
     * @param {object} input wwa-world-number-input.js を参照
     */
    receiveWorldNumber: function(input) {
      getData(this.fileName, wwaData => {
        const answerWorldPassNumber = Math.floor(wwaData.worldPassNumber).toString();
        if (input.worldNumber !== answerWorldPassNumber) {
          this.message = '暗証番号が異なります';
          this.closeMapdata();
          return;
        }
        this.setupData(wwaData);
      }, this.showError.bind(this));
    },

    /**
     * WWA のデータが見れる状態に整えます。
     * @param {object} wwaData WWAデータ
     */
    setupData: function(wwaData) {
      this.wwaData = wwaData;
      this.waitingPassword = false;
      this.message = this.fileName + ' から読み込んだメッセージの一覧です。';
      this.viewType = "MESSAGE";
    },

    /**
     * 表示種類を切り替えます。
     * @param {string} type 切り替える表示種類
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
      this.viewType = "";
    },

    /**
     * エラーを発生させます。主に後述の getData メソッドでのエラー発生時に使用します。
     * @param {object} error
     */
    showError: function(error) {
      try {
        this.message = error.message;
      } catch {
        this.message = '不明なエラーが発生しました。';
      }
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
