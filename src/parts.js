import Vue from "vue";
import * as PartsType from "./partsType";

export default Vue.component('parts', {
    props: ['number', 'partsType', 'partsNumber'],
    template: `
    <section>
        <h3>
            <span v-if="partsNumber !== null">{{ this.getPartsTypeName(partsType) }}{{ partsNumber }}番 (メッセージ番号 {{ number }}番)</span>
            <span v-else>{{ number }}番</else>
        </h3>
        <div><slot></slot></div>
    </section>
    `,
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
