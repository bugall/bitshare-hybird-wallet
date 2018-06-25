<template>
    <nav class="bar bar-tab">
        <router-link replace :to="link('/transfer', {animate: false})"
                     :class="isActive(['WalletIndex']) ? 'tab-item external router-link-exact-active' : 'tab-item external'">
            <span class="gxicon x1 gxicon-transfer"></span>
            <span class="tab-label">{{$t('index.transfer')}}</span>
        </router-link>
        <a @click="openQRCodeModal" href="javascript:;"
                     :class="isActive(['Market']) ? 'tab-item external router-link-exact-active' : 'tab-item external'">
             <span class="gxicon x1 gxicon-collect"></span>
            <span class="tab-label">{{$t('index.receive')}}</span>
        </a>
        <account-q-r-code ref="qrcode" :account="this.currentWallet.account"></account-q-r-code>
    </nav>
</template>
<script>
    import AccountQRCode from './AccountQRCode.vue';
    export default {
        computed: {
            qrcode () {
                return `qr://transfer?account=${this.currentWallet.account}`;
            },
            currentWallet () {
                if (this.wallets.length > 0) {
                    return this.wallets[this.currentWalletIndex];
                }
                return {};
            }
        },
        methods: {
            isActive (name) {
                const names = name instanceof Array ? name : [name];
                return names.some(name => {
                    return this.$route.name == name; // current path starts with this path string
                });
            },
            openQRCodeModal () {
                this.$refs.qrcode.show();
            }
        },
        components: {
            AccountQRCode
        }
    };
</script>
<style scoped="">
    .router-link-exact-active {
        color: #6699ff;
    }
</style>
