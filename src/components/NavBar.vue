<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff">
    <el-menu-item v-if="isAuthenticated"><router-link to="/mail">Mail</router-link></el-menu-item>
    <el-menu-item v-if="isAuthenticated"><SignOutButton/></el-menu-item>
    <el-menu-item v-if="!isAuthenticated"><SignInButton/></el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useIsAuthenticated } from '../composition-api/useIsAuthenticated';
import SignInButton from "./SignInButton.vue";
import SignOutButton from "./SignOutButton.vue";

const isAuthenticated = useIsAuthenticated();
</script>

<style>
a {
    text-decoration: none;
    color: #fff;
}
#authButton {
    margin-left: auto;
}
</style>
