<template>
    <div class="h-full w-full bg-gray-50/80 absolute top-0 left-0 z-50">
        <div class="flex items-center justify-center py-10 h-full">
            <div class="spinner"></div>
        </div>
    </div>
</template>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>