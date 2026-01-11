<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    // Verificar que sea admin
    const userRole = localStorage.getItem('userRole');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || userRole !== 'admin') {
      goto('/login');
    }
  });
</script>

<div class="min-h-screen bg-gray-50">
  <slot />
</div>
