<template>
    <div class="number-resize" @mousedown="start" @dblclick="showInput">
        <input
            type="number"
            ref="number-resize-input"
            class="property-input"
            v-if="inputShow"
            :value="value"
            @input="input"
            :max="max"
            :min="min"
            :step="stepScale"
            @blur="inputShow=false"
            @change="change"
            @focus="focus"
        >
        <slot v-else></slot>
    </div>
</template>

<script>

export default {
    name: 'number-resize',
    props: {
        // 移动的缩放比，通常1px 对应 1
        stepScale: {
            type: Number,
            default: 1
        },
        value: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 1000000000000000000
        },
        min: {
            type:Number,
            default: -100000000000000000
        },
        toFixed: {
            type: Number,
            default: 2
        }
    },
    data () {
        return {
            resizing: false,
            initValue: 0,
            x: 0,
            distance: 0,
            startTimeStamp: 0,
            inputShow: false
        };
    }, // end data
    computed: {

    }, // end computed
    methods: {
        focus() {
            // console.log('dd');
            this.$emit('start');
        },
        start(e) {
            if(this.inputShow) {
                return;
            }
            this.startTimeStamp = Date.now();
            this.resizing = true;
            this.initValue = this.value;
            this.x = e.pageX;
            this.$emit('start');
        },
        onresize(e) {
             if(this.inputShow) {
                return;
            }
            if(!this.resizing){
                return;
            }
            this.distance = e.pageX - this.x;
            let totalValue = this.distance * this.stepScale + this.initValue;
            if(totalValue <= this.min) {
                this.$emit('input', this.min);
            } else if(totalValue >= this.max) {
                this.$emit('input', this.max);
            } else {
                this.$emit('input', totalValue);
            }
            // console.log(this.distance);
        },
        end(e) {
            
            if(this.inputShow) {
                return;
            }
            if(!this.resizing){
                return;
            }
            // console.log('end');
            this.distance = e.pageX - this.x;
            let totalValue = this.distance * this.stepScale + this.initValue;
            if(totalValue <= this.min) {
                this.$emit('change', this.min)
            } else if(totalValue >= this.max){
                this.$emit('change', this.max);
            } else {
                this.$emit('change', totalValue)
            }
            this.resizing = false;
        },
        // 显示输入框
        showInput() {
            this.inputShow = true;
            this.$nextTick(()=>{
                this.$refs['number-resize-input'].focus();
            })
            /*if(Date.now() - this.startTimeStamp < 200) {
                console.log('showInput');
                this.inputShow = true;
            }*/
        },
        input(e) {
            let value = parseFloat(e.target.value || 0);
            this.$emit('input', value);
            // console.log(e.target.value);
        },
        change(e) {
            let value = parseFloat(e.target.value || 0);
            this.$emit('change', value);
            console.log(['change', e.target.value]);
        },
    }, // end methods
    created() {

    },
    mounted() {
        document.body.addEventListener('mousemove', this.onresize, false);
        document.body.addEventListener('mouseup', this.end, false);
    },
    destroyed() {
        document.body.removeEventListener('mousemove', this.onresize, false);
        document.body.removeEventListener('mouseup', this.end, false);
    }

};
</script>

<style>
    .number-resize{
        cursor: col-resize;
    }
    .property-input{
        background: #57595a;
        border: 1px solid #2f3132;
        color: #fff;
        padding: 2px 5px;
    }
    .property-input:focus{
        outline: none;
    }
</style>