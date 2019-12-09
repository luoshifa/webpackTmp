<template>
    <div>
        <button @click="show_dialog">test</button>
        <button @click="show_dialog2">test2</button>
        <el-dialog :visible.sync="dialog_two" :append-to-body="true">
            <div>12333444</div>
        </el-dialog>
        <hm-dialog :visible.sync="dialog_one" width="500px" :append-to-body="true" :before-close="before_close">
            <div>asfsaf</div>
        </hm-dialog>
    </div>
</template>
<script>
    import {Dialog} from 'element-ui'
    import HmDialog from '../component/Dialog'
    export default{
        mixins: [],
        components: {
            'el-dialog':Dialog,
            'hm-dialog':HmDialog,
        },
        data(){
            return {
                dialog_one:false,
                dialog_two:false,
            }
        },
        created(){
        },
        methods: {
            show_dialog(){
                this.dialog_one = true;
            },
            show_dialog2(){
                this.dialog_two = true;
            },
            before_close(done){
                done();
            }
        },
    }
</script>
<style lang="scss" scoped>
</style>