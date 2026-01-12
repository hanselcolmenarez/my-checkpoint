<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  // Verificar autenticación (simulado por ahora)
  onMount(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      goto('/login');
    }
  });
</script>

<slot />
