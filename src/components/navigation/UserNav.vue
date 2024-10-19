<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/registry/new-york/ui/avatar'
import { Button } from '@/lib/registry/new-york/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/lib/registry/new-york/ui/dropdown-menu'
import { useAccountsStore } from '@/stores/accounts'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { User, LogOut } from 'lucide-vue-next'

const accountsStore = useAccountsStore()
accountsStore.getPicture()

const name = accountsStore.accountDetails?.label || ''
const initials = computed(() =>
  name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
)
const email = accountsStore.accountDetails?.email || ''
const { picture } = storeToRefs(accountsStore)

const logoutPopup = () => accountsStore.logout()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-8 w-8">
          <AvatarImage :src="picture || ''" :alt="initials" />
          <AvatarFallback>{{ initials }}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ name }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <User class="mr-2 h-4 w-4" />
          <span><router-link to="/profile">Profile</router-link></span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logoutPopup">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
