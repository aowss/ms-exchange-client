<script setup lang="ts">
import WelcomeName from '@/components/WelcomeName.vue'
import { useAccountsStore } from '@/stores/accounts'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
const { isAuthenticated } = storeToRefs(accountsStore)

const loginPopup = () => accountsStore.login()
const logoutPopup = () => accountsStore.logout()
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff">
    <el-menu-item v-if="isAuthenticated">
      <WelcomeName />
    </el-menu-item>
    <el-menu-item v-if="isAuthenticated">
      <router-link to="/mail">Mail</router-link>
    </el-menu-item>
    <el-menu-item v-if="isAuthenticated">
      <el-button type="default" @click="logoutPopup">Sign Out</el-button>
    </el-menu-item>
    <el-menu-item v-if="!isAuthenticated">
      <el-button type="default" @click="loginPopup">Sign In</el-button>
    </el-menu-item>
  </el-menu>
</template>

<style>
a {
  text-decoration: none;
  color: #fff;
}
</style>
