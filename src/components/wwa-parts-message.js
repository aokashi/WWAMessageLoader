import Vue from "vue";

export default Vue.component('wwa-parts-message', {
  props: {
    partsMessage: {
      type: String,
      required: true
    }
  },
  template: `
    <div class="parts-message">
      <div class="parts-message__line" v-for="(messageLine, messageIndex) in partsMessageEachLine">
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
