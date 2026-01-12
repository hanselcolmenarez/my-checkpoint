<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Usar $props() en lugar de export let
  const { hasCheckedInToday = false } = $props<{ hasCheckedInToday?: boolean }>();
  
  let password = $state('');
  let isLoading = $state(false);
  let error = $state('');
  
  async function markAttendance() {
    if (!password.trim()) {
      error = 'Por favor ingresa la clave';
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      // Emitir evento para que el componente padre maneje la marcación
      dispatch('marked', { password });
    } catch (err: any) {
      error = err.message || 'Error al marcar asistencia';
      console.error('Modal error:', err);
    } finally {
      isLoading = false;
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      markAttendance();
    }
    if (e.key === 'Escape') {
      dispatch('close');
    }
  }
  
  function handleBackdropKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      dispatch('close');
    }
  }
  
  function handleBackdropClick() {
    dispatch('close');
  }
</script>

<div
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  onkeydown={handleBackdropKeydown}
>
  <!-- Backdrop invisible que captura clics -->
  <div
    class="absolute inset-0"
    onclick={handleBackdropClick}
    role="button"
    tabindex="0"
    aria-label="Cerrar modal"
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dispatch('close');
      }
    }}
  ></div>
  
  <!-- Contenido del modal -->
  <div
    class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10"
    role="document"
    onclick={(e) => e.stopPropagation()}
  >
    <div class="flex justify-between items-center mb-6">
      <h2 id="modal-title" class="text-xl font-bold text-gray-800">Marcar Asistencia</h2>
      <button
        onclick={() => dispatch('close')}
        class="text-gray-400 hover:text-gray-600 p-1"
        aria-label="Cerrar modal">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <div class="mb-6">
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center" role="img" aria-label="Icono de llave">
          <svg class="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
        </div>
      </div>
      
      <p class="text-center text-gray-600 mb-6">
        {hasCheckedInToday 
          ? 'Ingresa la clave para marcar tu salida' 
          : 'Ingresa la clave para marcar tu entrada'}
      </p>
      
      <div class="space-y-4">
        {#if error}
          <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center text-red-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-medium">{error}</span>
            </div>
          </div>
        {/if}
        
        <div>
          <label for="password-input" class="block text-sm font-medium text-gray-700 mb-2">
            Clave de Acceso
          </label>
          <input
            id="password-input"
            type="password"
            bind:value={password}
            onkeydown={handleKeydown}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:opacity-50"
            placeholder="Ingresa la clave"
            aria-required="true"
            disabled={isLoading}>
        </div>
        
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          La clave la proporciona tu administrador
        </div>
      </div>
    </div>
    
    <div class="flex space-x-3">
      <button
        onclick={() => dispatch('close')}
        onkeydown={(e) => e.key === 'Enter' && dispatch('close')}
        class="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
        type="button"
        disabled={isLoading}>
        Cancelar
      </button>
      <button
        onclick={markAttendance}
        disabled={!password.trim() || isLoading}
        class="flex-1 py-3 px-4 bg-purple-700 text-white font-medium rounded-xl hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
        type="button">
        {#if !isLoading}
          {hasCheckedInToday ? 'Marcar Salida' : 'Marcar Entrada'}
        {:else}
          <span class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        {/if}
      </button>
    </div>
  </div>
</div>
