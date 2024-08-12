<script setup lang="ts">
import { useRouter } from "vue-router";
import { useIsAuthenticated } from "../composition-api/useIsAuthenticated";

const isAuthenticated = useIsAuthenticated();

const router = useRouter();

function goToMail() {
  router.push("/mail");
}
</script>

<template>
  <div class="home">
    <span v-if="!isAuthenticated">Please sign-in to see your email.</span>
    <el-button v-else type="primary" v-on:click="goToMail">Request Mail</el-button>
  </div>
</template>
