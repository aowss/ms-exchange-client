<script lang="ts" setup>
import { useAccountsStore } from '@/stores/accounts'
import { storeToRefs } from 'pinia'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/registry/new-york/ui/card'
import { Label } from '@/lib/registry/new-york/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/registry/new-york/ui/avatar'
import { computed } from 'vue'
import { Phone, Mail, MapPin, Building, Building2, UserCheck, BookUser } from 'lucide-vue-next'

const accountsStore = useAccountsStore()
accountsStore.getUserProfile()
accountsStore.getPicture()

const { profile, picture } = storeToRefs(accountsStore)

const name = accountsStore.accountDetails?.name || ''
const initials = computed(() =>
  name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
)
const email = accountsStore.accountDetails?.email || ''
</script>

<template>
  <Card>
    <CardHeader>
      <!-- User Picture and Details -->
      <div class="flex items-center">
        <Avatar>
          <AvatarImage :src="picture || ''" :alt="initials" />
          <AvatarFallback>{{ initials }}</AvatarFallback>
        </Avatar>
        <div class="ml-4">
          <CardTitle>{{ name }}</CardTitle>
          <Mail class="mr-2 h-4 w-4" />
          <span>{{ email }}</span>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Phone Numbers -->
      <div v-if="profile?.phones && profile.phones.length">
        <Label class="mb-2">Phone Numbers:</Label>
        <ul>
          <li v-for="(phone, index) in profile.phones" :key="index" class="flex items-center mb-1">
            <Phone name="phone" class="w-4 h-4 mr-2" /> {{ phone.number }}
          </li>
        </ul>
      </div>

      <!-- Addresses -->
      <div v-if="profile?.addresses && profile.addresses.length" class="mt-4">
        <Label class="mb-2">Addresses:</Label>
        <ul>
          <li
            v-for="(address, index) in profile.addresses"
            :key="index"
            class="flex items-center mb-1"
          >
            <MapPin name="home" class="w-4 h-4 mr-2" /> {{ address }}
          </li>
        </ul>
      </div>

      <!-- Job Details -->
      <div v-if="profile?.position" class="mt-4">
        <Label class="mb-2">Job Details:</Label>
        <p class="flex items-center mb-1">
          <BookUser name="briefcase" class="w-4 h-4 mr-2" /> {{ profile.position.jobTitle }}
        </p>
        <p class="flex items-center mb-1">
          <Building2 name="building" class="w-4 h-4 mr-2" /> {{ profile.position.department }}
        </p>
        <p class="flex items-center mb-1">
          <Building name="map-pin" class="w-4 h-4 mr-2" /> {{ profile.position.company.name }}
        </p>
        <p class="flex items-center mb-1">
          <MapPin name="map-pin" class="w-4 h-4 mr-2" /> {{ profile.position.company.address.city }}
        </p>

        <!-- Manager Details -->
        <Label class="mt-2">Manager:</Label>
        <p class="flex items-center mb-1">
          <UserCheck name="user" class="w-4 h-4 mr-2" /> {{ profile.position.manager.name }}
        </p>
        <p class="flex items-center mb-1">
          <Mail name="mail" class="w-4 h-4 mr-2" /> {{ profile.position.manager.email }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
