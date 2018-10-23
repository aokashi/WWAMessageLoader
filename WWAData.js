class WWAData {
  /**
   * WWAのデータです。
   * @param {array} wwaData 
   */
  constructor(wwaData) {
    this.wwaData = wwaData;
  }
  
  /**
   * メッセージのIDからパーツの種類と番号を取得します。
   * @param {int} messageNum 
   * @returns {array}
   */
  getPartsNumberByMessageId(messageNum) {
    const ATR_MESSAGE = 5;
    let objectPartsIndex = this.wwaData['objectAttribute'].findIndex((attributes) => {
      return attributes[ATR_MESSAGE] === messageNum;
    });
    if (objectPartsIndex !== -1) {
      return {
        isObject: true,
        number: objectPartsIndex
      }
    }
    let mapPartsIndex = this.wwaData['mapAttribute'].findIndex((attributes) => {
      return attributes[ATR_MESSAGE] === messageNum;
    });
    if (mapPartsIndex !== -1) {
      return {
        isObject: false,
        number: mapPartsIndex
      }
    }
    return false;
  }
}
