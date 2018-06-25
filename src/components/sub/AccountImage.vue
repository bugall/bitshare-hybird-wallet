<template>
    <canvas v-if="!imgShow" ref="canvas" :style="{width:size,height:size}" :width="size * 2" :height="size * 2" :data-jdenticon-hash="hash"></canvas>
    <div class="icon-idac" v-else/>
</template>
<script>
    import jdenticon from 'jdenticon';
    import sha256 from 'js-sha256';

    export default {
        props: {
            size: {
                type: Number,
                default: 30
            },
            account: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                imgShow: false,
                imgSrc: ''
            };
        },
        computed: {
            hash: function () {
                return this.account ? sha256(this.account) : '';
            }
        },
        watch: {
            account () {
                this.drawCanvas();
            },
            size () {
                this.drawCanvas();
            }
        },
        methods: {
            drawCanvas () {
                if (this.account === 'IDAC') {
                    this.imgShow = true;
                    if (this.account === 'IDAC') {
                        this.imgSrc = '';
                    }
                } else {
                    this.imgShow = false;
                    if (this.account) {
                        jdenticon.update(this.$refs.canvas, this.hash, 0);
                    } else {
                        let ctx = this.$refs.canvas.getContext('2d');
                        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
                        let size = ctx.canvas.width;
                        // ctx.clearRect(0, 0, size, size);
                        // ctx.fillRect(0, 0, size, size);
                        // ctx.clearRect(0, 0, size, size);
                        // ctx.font = `${size}px sans-serif`;
                        ctx.fillText('?', size / 1, size - size / 2);
                    }
                }
            }
        },
        mounted () {
            this.drawCanvas();
        }
    };
</script>

<style scoped="">
    .icon-idac {
        background-image: url('../../../static/logo.png');
        background-repeat:no-repeat;
        background-size:100% 100%;
        -moz-background-size:100% 100%;
        height: 27px;
        width: 27px;
    }
</style>
