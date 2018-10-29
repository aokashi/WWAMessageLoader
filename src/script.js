'use strict';

import Vue from "vue";
import WWAData from "./WWAData";
import Parts from "./parts";

let app = new Vue({
  el: "#app",
  data: {
    fileName: document.location.search.substr(1),
    message: 'URLに ?(マップデータ名) を添えてアクセスしてください。',
    partsMessages: {}
  },
  comments: Parts
});

if (app.$fileName !== '') {
  getData(app.$fileName, function(wwaData) {
    app.$partsMessages = wwaData['message'];
  });
}

/**
 * データを取得します。
 * @param {string} fileName 
 * @param {function} callbackFunction
 */
function getData(fileName, callbackFunction) {
  let worker = new Worker('wwaload.js');

  // FIXME: Vue.js 上でWeb Workerが利用できない
  worker.postMessage({
    fileName: './' + fileName
  });
  worker.addEventListener('message', (e) => {
    if (e.data.error !== null) {
      try {
        document.getElementById('message').textContent = e.data.error.message;
      } catch {
        document.getElementById('message').textContent = '原因不明のエラーが発生しました。';
      }
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
