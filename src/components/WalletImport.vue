<template>
    <div class="page-group">
        <div class="page" id="page-wallet-import">
            <header class="bar bar-nav">
                <h3 class="title">{{$t('wallet_import.title')}}</h3>
                <router-link :to="link('/')" replace class="icon icon-left"></router-link>
            </header>
            <div>
                <nav class="bar bar-tab bar-text-size">
                    <router-link replace :to="link('/wallet-import',{from:$route.fullPath, animate: false})" class="tab-item external router-link-exact-active">
                        <span class="tab-label x1">私钥导入</span>
                    </router-link>

                    <router-link replace :to="link('/wallet-import-account', {animate: false})" class="tab-item external">
                        <span class="tab-label x1">账号导入</span>
                    </router-link>
                </nav>
            </div>
            <div class="content">
                <div class="list-block block-pwd">
                    <ul>
                        <li class="align-top">
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-input item-required">
                                        <span>*</span>
                                        <textarea v-model="wifKey" :placeholder="$t('wallet_import.placeholder.key')" @change="wifKeyTextAreaChange"></textarea>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">{{$t('wallet_import.label.password')}}</div>
                                    <div class="item-input">
                                        <input v-model="pwd1" type="password" maxlength="30" :placeholder="$t('wallet_import.placeholder.password')">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">{{$t('wallet_import.label.confirm')}}</div>
                                    <div class="item-input">
                                        <input v-model="pwd2" type="password" maxlength="30">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block block-tip">
                    <div class="tip-error" v-if="error.common">
                        {{error.common}}
                    </div>
                </div>
                <div class="content-block block-button">
                    <p class="content-block">
                        <a @click="onSubmit" href="javascript:;" class="button button-idac" :class="{disabled:!isCommitEnable}">{{$t('wallet_import.confirm')}}</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        import_account
    } from '@/services/WalletService';
    import {
        PrivateKey
    } from 'idacjs';

    export default {
        data () {
            return {
                tabIndex: 1,
                submitting: false,
                wifKey: '',
                pwd1: '',
                pwd2: '',
                error: {
                    common: ''
                }
            };
        },
        watch: {
            tabIndex () {
                this.error = {
                    common: ''
                };
            },
            pwd1 () {
                this.error = {
                    common: ''
                };
            },
            pwd2 () {
                this.error = {
                    common: ''
                };
            },
            wifKey () {
                this.error.common = '';
            }
        },
        computed: {
            isEqual () {
                return this.pwd1 == this.pwd2;
            },
            isCommitEnable () {
                if (this.submitting) {
                    return false;
                }
                return this.wifKey.length > 0 && this.pwd1.length >= 6 && this.pwd2.length >= 6;
            }
        },
        mounted () {
            $.init();
        },
        methods: {
            isValidWifKey (wifKey) {
                let wif_regex = /^5[HJK][1-9A-Za-z]{49}$/;
                if (wif_regex.test(wifKey)) {
                    try {
                        let private_key = PrivateKey.fromWif(wifKey);   // could throw and error
                        let public_key = private_key.toPublicKey(); // S L O W
                        let public_key_string = public_key.toPublicKeyString();
                        if (public_key_string.indexOf('IDAC') > -1) {
                            return true;
                        } else {
                            return false;
                        }
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                } else {
                    return false;
                }
            },
            validate () {
                if (!this.isEqual) {
                    this.error.common = this.$t('wallet_import.error.password_not_equal');
                    return false;
                }
                if (!this.isValidWifKey(this.wifKey)) {
                    this.error.common = this.$t('wallet_import.error.invalid_key');
                    return false;
                }
                return true;
            },
            onSubmit () {
                if (!this.isCommitEnable) {
                    return;
                }
                this.wifKey = this.wifKey.trim();
                if (!this.validate()) {
                    return;
                }
                if (this.submitting) {
                    return;
                }
                this.submitting = true;
                this.createByWifKey();
            },
            createByWifKey () {
                $.showPreloader('正在导入中');
                setTimeout(() => {
                    import_account(this.wifKey, this.pwd1).then((info) => {
                        this.submitting = false;
                        $.hidePreloader();
                        if (info.imported.length > 0) {
                            this.$router.replace({
                                path: this.link('/wallet-import-success', {
                                    account: info.imported[0].account
                                })
                            });
                        } else {
                            if (info.exist.length > 0) {
                                this.error.common = this.$t('wallet_import.error.account_already_exist');
                            } else {
                                this.error.common = this.$t('wallet_import.error.no_reference_account');
                            }
                        }
                    }).catch((ex) => {
                        this.submitting = false;
                        $.hidePreloader();
                        this.error.common = this.$t('wallet_import.error.no_reference_account');
                    });
                }, 500);
            },
            wifKeyTextAreaChange () {
                if (this.wifKey.indexOf('(hide)') > -1) {
                    this.wifKey = this.wifKey.replace('(hide)', '').trim();
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .block-pwd {
        ul:before {
            height: 0;
        }
    }
    .router-link-exact-active {
        color: #6699ff;
    }

    .block-tab {
        margin: .2rem 0;
        ul {
            border-left: 0.05rem solid #e7e7e7;
            border-right: 0.05rem solid #e7e7e7;
        }
    }

    .block-button {
        margin-top: .6rem;
    }

    .block-tip {
        margin: .6rem 0 0 0;
        .tip-error {
            text-align: center;
        }
    }


    .item-required span {
        color: red;
        position: absolute;
        top: .5rem;
        font-weight: bold;
    }

    .item-required textarea {
        padding-left: 0.5rem;
    }

    .bar-text-size span {
        font-size: 0.7rem;
    }
</style>
