<template>
  <div class="row">
    <div v-for="(method, index) in mspPaymentMethods" :key="index" class="col-md-6">
      <label class="radioStyled">
        <span class="payment-method-icon">
          <img :src="method.image" :alt="method.title ? method.title : method.name" width="30">
        </span>
        <span class="payment-method">{{ method.title ? method.title : method.name }}</span>
        <input
          type="radio"
          :value="method.code"
          name="payment-method"
          v-model="payment.paymentMethod"
          @change="validate.paymentMethod.$touch(); changePaymentMethod();"
        >
        <span class="checkmark" />
      </label>
    </div>
    <div class="col-xs-12">
      <i-deal-issuers v-if="isIdeal" />
    </div>
  </div>
</template>

<script>
import iDealIssuers from 'src/modules/vsf-payment-multisafepay/components/iDealIssuers';
import { IDEAL } from 'src/modules/vsf-payment-multisafepay/const';
import * as types from 'src/modules/vsf-payment-multisafepay/store/mutation-types';

export default {
  components: {
    iDealIssuers
  },
  props: ['paymentMethods', 'payment', 'validate', 'changePaymentMethod'],
  computed: {
    mspPaymentMethods () {
      return this.paymentMethods.filter(paymentMethod => paymentMethod.mspMethod);
    },
    isIdeal () {
      return this.payment.paymentMethod === IDEAL;
    }
  }
};
</script>

<style lang="scss" scoped>
.payment-method {
  position: relative;
  top: -6px;
  margin-left: 5px;
}
</style>
