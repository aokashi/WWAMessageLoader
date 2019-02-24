import Vue from "vue";

export default Vue.component('wwa-parts-message', {
  props: {
    partsMessage: {
      type: String,
      required: true
    }
  },
  template: `
    <div>
      <div v-for="(messageLine, messageIndex) in partsMessageEachLine">
        {{ messageLine }}
      </div>
    </div>
  `,
  computed: {
    /**
     * @returns {array}
     */
    partsMessageEachLine: function() {
      return this.partsMessage.split("\n");
    }
  }
});
