'use strict';

import Vue from "vue";
import WWAData from "./WWAData";
import Parts from "./parts";
import WWALoader from "./wwaload.worker.js";

let app = new Vue({
  el: "#app",
  data: {
    fileName: '',
    message: 'URLに ?(マップデータ名) を添えてアクセスしてください。',
    partsMessages: {}
  },
  methods: {
    get: function (event) {
      getData(this.fileName, (wwaData) => {
        this.message = this.fileName + ' から読み込んだメッセージの一覧です。';
        this.partsMessages = wwaData['message'];
      }, (error) => {
        try {
          this.message = error.message;
        } catch {
          this.message = '不明なエラーが発生しました。';
        }
      });
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

/**
 * 持ってきたデータを利用してページに表示します
 * @param {array} wwaDataArray 
 */
function setData(wwaDataArray) {
  let wwaData = new WWAData(wwaDataArray);
  let element = document.getElementById('data_list');

  wwaData.wwaData['message'].forEach((text, number) => {
    if (text === '') {
      return;
    }
    let item = document.createElement('section');

    let itemNumber = document.createElement('h3');
    let partsInfo = wwaData.getPartsNumberByMessageId(number);
    if (partsInfo !== false) {
      if (partsInfo.isObject) {
        itemNumber.textContent = number + '(物体パーツ ' + partsInfo.number + ' 番)';
      } else {
        itemNumber.textContent = number + '(背景パーツ ' + partsInfo.number + ' 番)';
      }
    } else {
      itemNumber.textContent = number;
    }

    let itemText = document.createElement('p');
    let textLines = text.split('\n');
    textLines.forEach((textLine) => {
      let itemTextLine = document.createElement('div');
      itemTextLine.textContent = textLine;
      itemText.appendChild(itemTextLine);
    });

    item.appendChild(itemNumber);
    item.appendChild(itemText);
    element.appendChild(item);
  });
}
