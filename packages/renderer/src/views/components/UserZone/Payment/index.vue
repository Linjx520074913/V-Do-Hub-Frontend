<template>
  <div>
    Payment
    planId: {{ value }}
    <div class="flex flex-row">
        <img v-if="paylink != ''" :src="paylink" alt=""/>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, toRefs, SetupContext } from "vue"
import QRCode from 'qrcode'
import { Account, PaymentMethod } from '@/store/index'
import { ElMessage } from 'element-plus';

export default {
    name: "Payment",
    props: {
        value:{
            type: Object,
            required: true
        }
    },

    emits: [],
    components: {},

    setup(props: any, context: SetupContext) {
        const { value } = toRefs(props)
        const paylink = ref('')

        async function checkPaymentStatus() {
            const user_profile = await Account.methods.getUserProfileByToken()
            if(user_profile && user_profile.isMember){
                // 支付成功
                ElMessage({
                    message: '支付成功!',
                    type: 'success'
                });
            }else{
                // 轮询支付状态
                setTimeout(checkPaymentStatus, 1000); 
            }
        }

        onMounted(async () => {
            const data = await Account.methods.createPaymentOrder((value.value as any).planId, PaymentMethod.WECHAT)
            // 使用 planId 生成支付订单
            QRCode.toDataURL(data.paymentLink, { margin: 2 }, (err: any, url: string) => {
                paylink.value = url
            })
            // 检查支付状态
            checkPaymentStatus()
        })
        
        return { paylink, checkPaymentStatus }
    },
};
</script>
<style lang="scss" scoped>
    @import "./local.scss";
</style>
