<script lang="ts" setup>
import { useAccountsStore } from '@/stores/accounts'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
accountsStore.getUserProfile()

const { profile } = storeToRefs(accountsStore)
</script>

<template v-if="profile">
  <h1>Profile</h1>
  <h2>Address(es)</h2>
  <template v-for="address of profile.addresses">
    <h2>country: {{ address.countryOrRegion }}</h2>
  </template>
  <h2>Phones</h2>
  <template v-for="phone of profile.phones">
    <h2>Label: {{ phone.label }}</h2>
  </template>
</template>
f
