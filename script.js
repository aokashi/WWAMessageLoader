'use strict';

addEventListener('load', () => {
  main();
});

/**
 * メイン関数です。
 */
function main() {
  let fileName = document.location.search.substr(1);
  if (fileName === '') {
    document.getElementById('message').textContent = 'URLに ?(マップデータ名) を添えてアクセスしてください。';
  } else {
    getData(fileName, function(wwaData) {
      setData(wwaData);
    });
  }
}

/**
 * データを取得します。取得したデータは setData の実行に渡します。
 * @param {string} fileName 
 * @param {function} callbackFunction
 */
function getData(fileName, callbackFunction) {
  let worker = new Worker('wwaload.js');

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
