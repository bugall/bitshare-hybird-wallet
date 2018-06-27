<template>
    <canvas v-if="!imgShow" ref="canvas" :style="{width:size,height:size}" :width="size * 2" :height="size * 2" :data-jdenticon-hash="hash"></canvas>
    <img class="icon-idac" src="data:image/png;base64,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" v-else/>
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
        background-image: url('/static/logo.png');
        background-repeat:no-repeat;
        background-size:100% 100%;
        -moz-background-size:100% 100%;
        height: 27px;
        width: 27px;
    }
</style>
