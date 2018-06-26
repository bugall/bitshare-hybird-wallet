<template>
    <div class="page-group">
        <div class="page" id="page-wallet-create-step-1">
            <header class="bar bar-nav">
                <h3 class="title">{{$t('wallet_create.step1.title')}}</h3>
                <router-link :to="$route.query.from||link('/')" replace class="icon icon-left"></router-link>
            </header>
            <div class="content">
                <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">{{$t('wallet_create.step1.label.account')}}</div>
                                    <div class="item-input">
                                        <input class="input-account" @change="validate_username" v-model="account" type="text" maxlength="30" :placeholder="$t('wallet_create.step1.placeholder.account')">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">{{$t('wallet_create.step2.label.password')}}</div>
                                    <div class="item-input">
                                        <input v-model="pwd1" type="password" maxlength="30" :placeholder="$t('wallet_create.step2.placeholder.password')">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">{{$t('wallet_create.step2.label.confirm')}}</div>
                                    <div class="item-input">
                                        <input v-model="pwd2" type="password" maxlength="30">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="row-tip">
                        <p class="tip-error text-center" v-if="error">
                            {{error}}
                        </p>
                    </div>
                </div>
                
                <div class="content-block button-block">
                    <p>
                        <a href="javascript:;" @click="onSubmit" class="button button-idac" :class="{disabled:!submitEnable}">{{$t('wallet_create.step1.next')}}</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        fetch_account,
        create_account
    } from '@/services/WalletService';
    import errorHandler from '@/common/errorHandler';

    export default {
        data () {
            return {
                account: '',
                error: '',
                pwd1: '',
                pwd2: '',
                submitting: false
            };
        },
        watch: {
            account () {
                this.error = '';
            }
        },
        methods: {
            is_account_name_error () {
                let account = this.account;
                var i, label, len, length;

                if (!account) {
                    return 'empty_account';
                }
                length = account.length;
                if (length < 3) {
                    return 'account_should_be_longer';
                }
                if (length > 63) {
                    return 'account_should_be_shorter';
                }

                let ref = account.split('.');
                for (i = 0, len = ref.length; i < len; i++) {
                    label = ref[i];
                    if (!/^[~a-z]/.test(label)) {
                        return 'account_should_start_with_a_letter';
                    }
                    if (!/^[~a-z0-9-]*$/.test(label)) {
                        return 'account_format_error';
                    }
                    if (/--/.test(label)) {
                        return 'account_one_dash_error';
                    }
                    if (!/[a-z0-9]$/.test(label)) {
                        return 'account_end_error';
                    }
                    if (!(label.length >= 3)) {
                        return 'account_segment_should_be_longer';
                    }
                }
                return null;
            },
            is_cheap_name: function is_cheap_name () {
                return (/[0-9-]/.test(this.account) || !/[aeiouy]/.test(this.account));
            },
            validate_username () {
                this.account = this.account.toLowerCase();
                if (!this.is_cheap_name()) {
                    this.error = this.$t('wallet_create.step1.error.premium_name');
                    return false;
                }
                let account_name_error = this.is_account_name_error();
                if (account_name_error) {
                    this.error = this.$t(`wallet_create.step1.error.${account_name_error}`);
                    return false;
                }
                return true;
            },
            validate_password () {
                if (this.pwd1 != this.pwd2) {
                    this.error = this.$t('wallet_create.step2.error.password_not_equal');
                    return false;
                }
                return true;
            },
            onSubmit () {
                this.account = this.account.toLowerCase();
                if (!this.submitEnable) {
                    return;
                }
                if (!this.validate_username()) {
                    return;
                }
                if (!this.validate_password()) {
                    return;
                }
                if (this.submitting) {
                    return;
                }
                this.submitting = true;
                // this.checkAccountName();
                this.register();
            },
            register () {
                if (!this.validate_password()) {
                    return;
                }

                $.showPreloader(this.$t('wallet_create.step2.creating'));
                create_account(this.account, this.pwd1).then((wallet) => {
                    $.hidePreloader();
                    if (wallet.account) {
                        this.$router.replace({
                            path: this.link('/wallet-create-success', {
                                account: wallet.account
                            })
                        });
                    } else {
                        $.toast(this.$t('wallet_create.step2.error.account_create_failed'));
                    }
                }).catch(ex => {
                    $.hidePreloader();
                    if (ex.data && ex.data.error && ex.data.error.base && ex.data.error.base[0].indexOf(
                            'current_account_itr') > -1) {
                        $.alert(this.$t('wallet_create.step2.error.account_has_been_registered'), this.$t(
                            'wallet_create.step2.notice'), () => {
                                this.$router.replace({
                                    path: this.$route.query.from || this.link(
                                        '/wallet-create-step-1')
                                });
                            });
                    } else {
                        console.error(ex);
                        errorHandler(ex, this.$t('wallet_create.step2.error.account_create_failed'));
                    }
                });
            },
            checkAccountName () {
                $.showPreloader(this.$t('wallet_create.step1.query_account_name'));
                fetch_account(this.account).then((account) => {
                    setTimeout(() => {
                        this.submitting = false;
                        $.hidePreloader();
                        if (account) {
                            this.error = this.$t('wallet_create.step1.error.account_already_exist');
                        } else {
                            this.register();
                        }
                    }, 500);
                }).catch(() => {
                    this.submitting = false;
                    $.toast(this.$t('wallet_create.step1.error.query_account_failed.'));
                    setTimeout(() => {
                        $.hidePreloader();
                    }, 500);
                });
            }
        },
        computed: {
            submitEnable: function () {
                return this.account.length > 2 && !this.submitting && this.pwd1 == this.pwd2 && this.pwd1.length >= 6 && this.pwd2.length > 0;
            }
        },
        mounted () {
            $.init();
        }
    };
</script>
<style scoped lang="scss">
    .input-account {
        text-transform: lowercase
    }

    .row-tip {
        padding: 0 15px;
    }

    .list-block .item-title.label {
        width: 4rem;
    }
</style>
