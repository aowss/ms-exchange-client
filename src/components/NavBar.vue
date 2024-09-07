<script setup lang="ts">
import { useMsal } from '../composition-api/useMsal'
import { appConfig } from '@/config'
import { useIsAuthenticated } from '../composition-api/useIsAuthenticated'
import WelcomeName from '@/components/WelcomeName.vue'

const isAuthenticated = useIsAuthenticated()

const { instance } = useMsal()

const loginPopup = () => instance.loginPopup(appConfig.loginScopes)
// const loginRedirect = () => instance.loginRedirect(loginRequest);
const logoutPopup = () => instance.logoutPopup({ mainWindowRedirectUri: '/' })
// const logoutRedirect = () => instance.logoutRedirect();
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
      <el-button type="contrast" @click="logoutPopup">Sign Out</el-button>
    </el-menu-item>
    <el-menu-item v-if="!isAuthenticated">
      <el-button type="contrast" @click="loginPopup">Sign In</el-button>
    </el-menu-item>
  </el-menu>
</template>

<style>
a {
  text-decoration: none;
  color: #fff;
}
</style>
