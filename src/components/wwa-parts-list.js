import Vue from "vue";
import wwaParts from "./wwa-parts";
import searchBox from "./search-box";
import * as PartsType from "../partsType";

const ATTR_MESSAGE = 5;

export default Vue.component('wwa-parts-list', {
  props: {
    wwaData: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="parts-list">
      <search-box v-on:search="setSearch"></search-box>
      <div class="parts-list__list">
        <wwa-parts
          v-for="(partsObject, messageID) in partsObjects"
          :key="messageID"
          :parts="partsObject">
          {{ partsObject.message }}
        </wwa-parts>
        <div class="parts-list__message" v-if="!hasEntries(partsObjects)">
          該当するメッセージは見つかりませんでした。
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      search: {
        query: '',
        type: PartsType.PARTSTYPE_UNDEFINED,
        onlyPartsMessage: false
      }
    };
  },
  computed: {
    /**
     * @returns {array} 以下の情報を格納する配列
     *   number: パーツ番号(message配列内のインデックス),
     *   message: メッセージの文字列,
     *   partsType: パーツの種類,
     *   partsNumber: パーツ番号
     */
    partsObjects: function() {
      let result = {};
    
      for (let key in this.wwaData['message']) {
        if (this.wwaData['message'][key] === '') {
          continue;
        }
        
        let partsMessage = this.wwaData['message'][key];
        if (this.search.query !== '' && partsMessage.indexOf(this.search.query) === -1) {
          continue;
        }
        
        let partsInfo = this.makePartsNumber(parseInt(key));
        if (this.search.type !== PartsType.PARTSTYPE_UNDEFINED && partsInfo.partsType !== this.search.type) {
          continue;
        }
        if (this.search.onlyPartsMessage && partsInfo.number === 0) {
          continue;
        }

        let hasPartsInMap = false;
        if (partsInfo.number !== 0) {
          let currentMap =
            PartsType.PARTSTYPE_OBJECT ? this.wwaData['mapObject'] :
            PartsType.PARTSTYPE_MAP ? this.wwaData['map'] : [];

          hasPartsInMap = currentMap.find(function (mapLine) {
            return mapLine.indexOf(partsInfo.number) !== -1;
          }) !== undefined;
        }

        result[key] = {
          number: key,
          message: partsMessage,
          partsType: partsInfo.partsType,
          partsNumber: partsInfo.number,
          hasPartsInMap: hasPartsInMap
        };
      }
      return result;
    }
  },
  methods: {

    /**
     * @param {number} messageID 
     * @return {array} 以下の情報を返す連想配列
     *   partsType: パーツ種類
     *   number: パーツ番号
     */
    makePartsNumber: function(messageID) {
      const objectPartsIndex = this.wwaData['objectAttribute'].findIndex(function (attributes) {
        return attributes[ATTR_MESSAGE] === messageID;
      });
      if (objectPartsIndex !== -1) {
        return {
          partsType: PartsType.PARTSTYPE_OBJECT,
          number: objectPartsIndex
        }
      }
      
      const mapPartsIndex = this.wwaData['mapAttribute'].findIndex(function (attributes) {
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
    },

    /**
     * 検索を行います。
     * @param {Object} search 
     */
    setSearch: function(search) {
      this.search = search;
    },

    /**
     * 指定したオブジェクトの件数を調べます。
     * @param {Object} object 
     */
    hasEntries: function(object) {
      return Object.entries(object).length > 0;
    }
  },
  components: {
    'wwa-parts': wwaParts,
    'search-box': searchBox
  }
});
