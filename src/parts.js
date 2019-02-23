import Vue from "vue";
import * as PartsType from "./partsType";

export default Vue.component('parts', {
    props: {
        parts: Object
    },
    template: `
    <section>
        <h3>
            <span v-if="parts.partsNumber !== 0">{{ this.getPartsTypeName(parts.partsType) }}{{ parts.partsNumber }}番 (メッセージ番号 {{ parts.number }}番)</span>
            <span v-else>{{ parts.number }}番</span>
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
