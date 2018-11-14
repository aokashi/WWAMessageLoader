const ATTR_MESSAGE = 5;

export default class WWAData {
  /**
   * @param {array} data 
   * @todo コレを使う代わりにWWAのLoaderのWWADataを使う
   */
  constructor(data) {
    this.data = data;
  }
  /**
   * メッセージのIDからパーツの番号を取得
   * @param {number} messageID 
   * @returns {array|null}
   */
  getPartsNumber(messageID) {
    const objectPartsIndex = this.data['objectAttributes'].findIndex(function (attributes) {
      return attributes[ATTR_MESSAGE] === messageID;
    });
    if (objectPartsIndex !== -1) {
      return {
        partsType: PartsType.PARTSTYPE_OBJECT,
        number: objectPartsIndex
      }
    }

    const mapPartsIndex = this.data['mapAttributes'].findIndex(function (attributes) {
      return attributes[ATTR_MESSAGE] === messageID;
    });
    if (mapPartsIndex !== -1) {
      return {
        partsType: PartsType.PARTSTYPE_MAP,
        number: mapPartsIndex
      }
    }

    return false;
  }
}
