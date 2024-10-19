<script lang="ts" setup>
import { useAccountsStore } from '@/stores/accounts'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
accountsStore.getUserProfile()

const { profile } = storeToRefs(accountsStore)
</script>

<template v-if="profile">
  <template v-for="address of profile.addresses">
    <h2>country: {{ address.countryOrRegion }}</h2>
  </template>
</template>
