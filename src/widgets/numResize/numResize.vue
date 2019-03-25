<template>
    <div class="number-resize" @mousedown="start">
        number-resize
        <slot></slot>
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
        }
    },
    data () {
        return {
            resizing: false,
            initValue: 0,
            x: 0,
            distance: 0,
        };
    }, // end data
    computed: {

    }, // end computed
    methods: {
        start(e) {
            this.resizing = true;
            this.initValue = this.value;
            this.x = e.pageX;
            this.$emit('start');
        },
        onresize(e) {
            if(!this.resizing){
                return;
            }
            this.distance = e.pageX - this.x;
            let totalValue = this.distance * this.stepScale + this.initValue;
            this.$emit('input', totalValue)
            // console.log(this.distance);
        },
        end(e) {
            if(!this.resizing){
                return;
            }
            this.distance = e.pageX - this.x;
            let totalValue = this.distance * this.stepScale + this.initValue;
            this.$emit('change', totalValue)
            this.resizing = false;

        }
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
</style>