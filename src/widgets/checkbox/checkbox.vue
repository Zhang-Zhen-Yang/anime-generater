/*
 * @Author: zhangzhenyang 
 * @Date: 2017-08-09 08:45:00 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-05-03 14:32:55
 */
/*checkbox*/
<template>
    <label class="checkbox-wrap pointer">
        <input type="checkbox" :checked="localValue" @change="toggleCheck">
        <div class="checkbox-rect"><span>&nbsp;</span></div>
        <slot name="default"></slot>                             
    </label>
</template>

<script>
export default {
    name: 'checkbox',
    props: {
        value: [Boolean, Array],
        disabled: Boolean
    },
    data () {
        return {
            msg: 'checkbox',
            checked: this.value || false
        };
    }, // end data
    computed: {
        localValue () {
            return this.value;
        }
    }, // end computed
    methods: {
        toggleCheck ($event) {
            if (!this.disabled) {
                this.checked = !this.checked;
                this.$emit('change', this.checked, $event);
                this.$emit('input', this.checked, $event);
            }
        }
    }, // end methods
    watch: {
        value () {
            this.checked = !!this.value;
        }
    }
};
</script>

<style>
    .checkbox-wrap{
        display: inline-block
    }
    .checkbox-wrap .checkbox-rect{
        position:relative;
        display: inline-block;
        /* background-color:#ffffff;*/
        border:1px solid #181818;
        text-align:center;
        color:#ffffff;
        font-size:14px;
        line-height:16px;
        border-radius:2px;
        width:16px;
        height:16px;
        line-height:12px;
        -webkit-user-select: none;
        user-select: none;
    }
    .checkbox-wrap>input{
        display:none;
    }
    .checkbox-rect:after{
        width: 4px;
        height: 8px;
        position: absolute;
        top: 1px;
        left: 4px;
        border: 2px solid #ffffff;
        border-top: 0;
        border-left: 0;
        opacity: 0;
        transform: rotate(45deg) scale3D(.15,.15,1);
        transition: all .3s cubic-bezier(.55,0,.55,.2);
        content: " ";
    }
    .checkbox-wrap>input:checked+.checkbox-rect{
        /*background-color:#f0ad4e;
        border-color:#f0ad4e;*/
    }
    .checkbox-wrap>input:checked+.checkbox-rect:after{
        opacity: 1;
        transform: rotate(45deg) scale3D(1,1,1);
        transition: all .4s cubic-bezier(.25,.8,.25,1);
    }

    .checkbox-wrap.inverse>input:checked+.checkbox-rect{
        background-color:#ffffff;
        border:1px solid #181818;
        color:orange;    
    }
</style>