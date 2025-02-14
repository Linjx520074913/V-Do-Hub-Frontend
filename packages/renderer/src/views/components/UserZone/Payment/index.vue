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
import { onMounted, ref, toRefs, SetupContext, watch } from "vue"
import QRCode from 'qrcode'
import { Account, PaymentMethod } from '@/store/index'
import { ElMessage } from 'element-plus';

export default {
    name: "Payment",
    props: {
        planId:{
            type: String
        },
        payMethod: {
            type: String
        }
    },

    emits: [ 'success' ],
    components: {},

    setup(props: any, context: SetupContext) {
        const { planId, payMethod } = toRefs(props)

        const paylink = ref('')

        function test(){
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
                // setTimeout(checkPaymentStatus, 1000); 
            }
        }

        async function generateQrCodeForPay(id: string, methods: PaymentMethod){
            const data = await Account.methods.createPaymentOrder(id, methods)
            // 使用 planId 生成支付订单
            QRCode.toDataURL(data.paymentLink, { margin: 2 }, (err: any, url: string) => {
                paylink.value = url
            })
            // 检查支付状态
            checkPaymentStatus()
        }

        watch( payMethod, async (newValue, oldValue) => {
            if(planId.value){
                generateQrCodeForPay(planId.value, payMethod.value)
            }
        }, { immediate: true, deep: true })

        watch( planId, async (newValue, oldValue) => {
            if(planId.value){
                generateQrCodeForPay(planId.value, payMethod.value)
            }
        }, { immediate: true, deep: true })

        onMounted(async () => {
            
            
        })
        
        return { paylink, checkPaymentStatus, test, generateQrCodeForPay }
    },
};
</script>
<style lang="scss" scoped>
    @import "./local.scss";
</style>
