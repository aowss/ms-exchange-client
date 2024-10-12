<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

<template>
  <nav :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
    <router-link to="/mail" class="text-sm font-medium transition-colors hover:text-primary"
      >Mail</router-link
    >
  </nav>
</template>
