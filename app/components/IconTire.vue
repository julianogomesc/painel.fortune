<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '#000'
  },
  size: {
    type: String,
    default: '30px'
  }
})
</script>

<template>
<svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" :stroke="color" stroke-width="1.5"></circle> <circle cx="12" cy="12" r="6" :stroke="color" stroke-width="1.5"></circle> <circle cx="12" cy="12" r="2" :stroke="color" stroke-width="1.5"></circle> <path d="M6 12L10 12" :stroke="color" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14 12L18 12" :stroke="color" stroke-width="1.5" stroke-linecap="round"></path> <path d="M9 17.1963L11 13.7322" :stroke="color" stroke-width="1.5" stroke-linecap="round"></path> <path d="M13 10.2681L15 6.80396" :stroke="color" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 17.1963L13 13.7322" :stroke="color" stroke-width="1.5" stroke-linecap="round"></path> <path d="M11 10.2681L9 6.80396" :stroke="color" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
</template>