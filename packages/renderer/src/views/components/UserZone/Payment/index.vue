<template>
  <div>
    <!-- Payment
    planId: {{ value }} -->
    <div class="flex flex-row" @click="test">
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

    emits: [ 'success' ],
    components: {},

    setup(props: any, context: SetupContext) {
        const paylink = ref('')

        // TODO: 这个地方的planId要从外部传入
        const planId = ref('670c2f21bfa34b09719a1af3')

        function test(){
            console.log('FFFFFFFFtest')
            context.emit('success')
        }

        async function checkPaymentStatus() {
            const user_profile = await Account.methods.getUserProfileByToken('')
            console.log('[ CheckPaymentStatus ]', user_profile?.membership.isMember)
            if(user_profile && user_profile?.membership.isMember){
                // console.log('')
                // 支付成功
                ElMessage({
                    message: '支付成功!',
                    type: 'success'
                });
                context.emit('success')
            }else{
                // 轮询支付状态
                setTimeout(checkPaymentStatus, 1000); 
            }
        }

        onMounted(async () => {
            const data = await Account.methods.createPaymentOrder(planId.value, PaymentMethod.WECHAT)
            // 使用 planId 生成支付订单
            QRCode.toDataURL(data.paymentLink, { margin: 2 }, (err: any, url: string) => {
                paylink.value = url
            })
            // 检查支付状态
            checkPaymentStatus()
        })
        
        return { paylink, checkPaymentStatus, test }
    },
};
</script>
<style lang="scss" scoped>
    @import "./local.scss";
</style>
