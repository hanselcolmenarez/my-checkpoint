<script lang="ts">
  // Usar $props() en lugar de export let
  const { title = '' } = $props<{ title?: string }>();
  
  function formatDate() {
    const now = new Date();
    return now.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
</script>

<header class="bg-white border-b border-gray-200">
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-4">
    <div class="mb-4 sm:mb-0">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-800">{title}</h1>
      <p class="text-sm text-gray-500">{formatDate()}</p>
    </div>
    
    <div class="flex items-center justify-between sm:justify-end space-x-4">
      <button class="p-2 text-gray-400 hover:text-gray-600" aria-label="Notificaciones">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </button>
      
      <div class="flex items-center">
        <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
        <span class="ml-2 text-sm text-gray-700 hidden sm:inline">Admin</span>
      </div>
    </div>
  </div>
</header>
