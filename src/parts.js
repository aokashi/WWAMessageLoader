import Vue from "vue";
import * as PartsType from "./partsType";

export default Vue.component('parts', {
    props: {
        number: Number
    },
    data: function() {
        return {
            partsType: 0,
            partsNumber: 0
        }
    },
    template: `
    <section>
        <h3>
            <span v-if="partsNumber !== 0">{{ this.getPartsTypeName(partsType) }}{{ partsNumber }}番 (メッセージ番号 {{ number }}番)</span>
            <span v-else>{{ number }}番</span>
        </h3>
        <div><slot></slot></div>
    </section>
    `,
    created: function() {
        let partsNumber = this.$emit('get-parts-number', this.number);

        this.partsType = partsNumber.partsType;
        this.partsNumber = partsNumber.number;
    },
    methods: {
        getPartsTypeName: function(partsType) {
            switch (partsType) {
                case PartsType.PARTSTYPE_OBJECT:
                    return '物体パーツ'
                case PartsType.PARTSTYPE_MAP:
                    return '背景パーツ'
            }
            return null;
        }
    }
});
