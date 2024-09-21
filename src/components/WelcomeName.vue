<script setup lang="ts">
import { computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'

const accountsStore = useAccountsStore()
const name = computed(() => {
  if (accountsStore.selectedAccount) {
    const name = accountsStore.selectedAccount.name
    if (name) {
      return name
    }
  }
  return ''
})
</script>

<template>
  <div class="welcome-name">
    <span v-if="!!name">{{ name }}</span>
    <i class="el-icon-user"></i>
  </div>
</template>

<style>
.welcome-name {
  color: #fff;
}
</style>
