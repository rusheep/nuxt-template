<template>
  <div class="auth-layout min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
    <div class="auth-container w-full max-w-md">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  background-image: 
    radial-gradient(at 40% 20%, rgb(120, 119, 198) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgb(120, 119, 198) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgb(120, 119, 198) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgb(120, 119, 198) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgb(120, 119, 198) 0px, transparent 50%),
    radial-gradient(at 80% 100%, rgb(120, 119, 198) 0px, transparent 50%),
    radial-gradient(at 0% 0%, rgb(120, 119, 198) 0px, transparent 50%);
}
</style>