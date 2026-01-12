<script lang="ts">
  import { goto } from '$app/navigation';
  import { login, error, isLoading } from '$lib/services/auth.service';
  
  let email = $state('');
  let password = $state('');
  let loginError = $derived(error);
  let isSubmitting = $derived(isLoading);
  
  // Credenciales demo pre-cargadas (del seed)
  const demoCredentials = {
    admin: { email: 'admin@techcorp.cl', password: 'admin123' },
    employee: { email: 'empleado1@techcorp.cl', password: 'empleado123' }
  };
  
  async function handleLogin(e: Event) {
    e.preventDefault();
    
    if (!email || !password) {
      error.set('Email y contraseña son requeridos');
      return;
    }
    
    try {
      await login(email, password);
      // La redirección se maneja en auth.service basado en el rol
    } catch (err: any) {
      // El error ya está manejado en auth.service
      console.error('Login error:', err);
    }
  }
  
  function fillDemoCredentials(role: 'admin' | 'employee') {
    email = demoCredentials[role].email;
    password = demoCredentials[role].password;
  }
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">MyCheckPoint</h1>
      <p class="text-gray-600">Sistema de Control de Asistencia</p>
    </div>
    
    {#if $loginError}
      <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
        <div class="flex items-center text-red-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium">{$loginError}</span>
        </div>
      </div>
    {/if}
    
    <form onsubmit={handleLogin} class="space-y-4">
      <div>
        <label for="email-input" class="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <input
          id="email-input"
          type="email"
          bind:value={email}
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:opacity-50"
          placeholder="tu@empresa.com"
          required
          disabled={$isSubmitting}>
      </div>
      
      <div>
        <label for="password-input" class="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          id="password-input"
          type="password"
          bind:value={password}
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:opacity-50"
          placeholder="••••••••"
          required
          disabled={$isSubmitting}>
      </div>
      
      <button
        type="submit"
        disabled={$isSubmitting}
        class="w-full py-3 bg-purple-700 text-white font-semibold rounded-xl hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
        {#if !$isSubmitting}
          Iniciar Sesión
        {:else}
          <span class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Iniciando...
          </span>
        {/if}
      </button>
    </form>
    
    <div class="mt-6 space-y-3">
      <div class="text-center">
        <p class="text-sm text-gray-500 mb-3">
          Credenciales de demostración:
        </p>
        <div class="flex gap-2">
          <button
            type="button"
            onclick={() => fillDemoCredentials('admin')}
            class="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            disabled={$isSubmitting}>
            Admin
          </button>
          <button
            type="button"
            onclick={() => fillDemoCredentials('employee')}
            class="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            disabled={$isSubmitting}>
            Empleado
          </button>
        </div>
      </div>
      
      <div class="text-center">
        <p class="text-sm text-gray-500">
          ¿Problemas para iniciar sesión? Contacta a tu administrador
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
