<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import { storeToRefs } from 'pinia'
import UserNav from '@/components/navigation/UserNav.vue'
import MainNav from '@/components/navigation/MainNav.vue'
import { Button } from '@/lib/registry/new-york/ui/button'

const accountsStore = useAccountsStore()
const { isAuthenticated } = storeToRefs(accountsStore)

const loginPopup = () => accountsStore.login()
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <MainNav v-if="isAuthenticated" class="mx-6" />
      <div class="ml-auto flex items-center space-x-4">
        <Button
          v-if="!isAuthenticated"
          @click="loginPopup"
          variant="ghost"
          class="relative h-8 w-8 rounded-full"
        >
          Log In
        </Button>
        <UserNav v-else />
      </div>
    </div>
  </div>
</template>
