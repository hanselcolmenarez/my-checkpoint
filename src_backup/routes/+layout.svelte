<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import '../app.css';
  
  onMount(() => {
    // Verificar si estamos en la página de login
    const isLoginPage = window.location.pathname === '/login';
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    // Si no está autenticado y no está en login, redirigir
    if (!isAuthenticated && !isLoginPage) {
      goto('/login');
    }
    
    // Si está autenticado y es empleado, verificar que no esté intentando ir a admin
    if (isAuthenticated && userRole === 'employee' && window.location.pathname.startsWith('/admin')) {
      goto('/');
    }
    
    // Si está autenticado y es admin, verificar que no esté intentando ir a app/empleado
    if (isAuthenticated && userRole === 'admin' && window.location.pathname.startsWith('/app')) {
      goto('/admin/dashboard');
    }
  });
</script>

<slot />
