<template>
  <div>
    <base-select
      class="col-xs-6 mb10"
      name="iDealIssuer"
      :options="idealIssuers"
      :selected="iDealIssuer"
      :placeholder="$t('Choose your bank')"
      v-model="iDealIssuer"
      autocomplete="ideal-issuer"
      @change="setIdealIssuer"
    />
  </div>
</template>

<script>
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import { mapGetters } from 'vuex'
import * as types from '../store/mutation-types';

export default {
  components: {
    BaseSelect
  },
  data () {
    return {
      iDealIssuer: ''
    }
  },
  watch: {
    'iDealIssuer': function () {
      this.setIdealIssuer()
    }
  },
  computed: {
    ...mapGetters('payment-service', ['getIssuers']),
    idealIssuers () {
      return this.getIssuers.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
  },
  methods: {
    setIdealIssuer () {
      this.$store.commit(`payment-service/${types.SET_ISSUER}`,  this.iDealIssuer )
    }
  }
}
</script>
