import Vue from "vue";
import wwaParts from "./wwa-parts";
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
      mapAttributes: {}
    };
  },
  created: function() {
    this.partsMessages = this.wwaData['message'];
    this.objectAttributes = this.wwaData['objectAttribute'];
    this.mapAttributes = this.wwaData['mapAttribute'];
  },
  computed: {
    /**
     * @returns {array}
     */
    partsObjects: function() {
      let result = {};
    
      for (let key in this.partsMessages) {
        if (this.partsMessages[key] === '') {
          continue;
        }
    
        let partsInfo = this.makePartsNumber(parseInt(key));
          result[key] = {
          number: key,
          message: this.partsMessages[key],
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
    }
  },
  components: {
    'wwa-parts': wwaParts
  }
});
