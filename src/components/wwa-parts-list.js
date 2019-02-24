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
    <div>
      <search-box v-on:search="setSearch"></search-box>
      <wwa-parts
        v-for="(partsObject, messageID) in partsObjects"
        :key="messageID"
        :parts="partsObject">
        {{ partsObject.message }}
      </wwa-parts>
    </div>
  `,
  data: function() {
    return {
      partsMessages: {},
      objectAttributes: {},
      mapAttributes: {},
      search: {
        query: '',
        type: PartsType.PARTSTYPE_UNDEFINED,
        onlyPartsMessage: false
      }
    };
  },
  created: function() {
    this.partsMessages = this.wwaData['message'];
    this.objectAttributes = this.wwaData['objectAttribute'];
    this.mapAttributes = this.wwaData['mapAttribute'];
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
    
      for (let key in this.partsMessages) {
        if (this.partsMessages[key] === '') {
          continue;
        }
        
        let partsInfo = this.makePartsNumber(parseInt(key));
        let partsMessage = this.partsMessages[key];
        if (this.search.query !== '' && partsMessage.indexOf(this.search.query) === -1) {
          continue;
        }
        if (this.search.type !== PartsType.PARTSTYPE_UNDEFINED && partsInfo.partsType !== this.search.type) {
          continue;
        }
        if (this.search.onlyPartsMessage && partsInfo.number === 0) {
          continue;
        }

        result[key] = {
          number: key,
          message: partsMessage,
          partsType: partsInfo.partsType,
          partsNumber: partsInfo.number
        };
      }
      return result;
    }
  },
  methods: {
    /**
     * @param {number} messageID 
     */
    makePartsNumber: function(messageID) {
      const objectPartsIndex = this.objectAttributes.findIndex(function (attributes) {
        return attributes[ATTR_MESSAGE] === messageID;
      });
      if (objectPartsIndex !== -1) {
        return {
          partsType: PartsType.PARTSTYPE_OBJECT,
          number: objectPartsIndex
        }
      }
      
      const mapPartsIndex = this.mapAttributes.findIndex(function (attributes) {
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
    }
  },
  components: {
    'wwa-parts': wwaParts,
    'search-box': searchBox
  }
});
