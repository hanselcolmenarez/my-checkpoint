<script lang="ts">
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import ScheduleModal from '$lib/components/admin/ScheduleModal.svelte';
  import { scheduleService } from '$lib/services/schedule';
  import { onMount } from 'svelte';
  
  let schedules = [];
  let isLoading = true;
  let showModal = false;
  
  // Cargar horarios al iniciar
  onMount(async () => {
    await loadSchedules();
  });
  
  async function loadSchedules() {
    isLoading = true;
    schedules = await scheduleService.loadSchedules();
    isLoading = false;
  }
  
  function handleScheduleCreated() {
    loadSchedules(); // Recargar la lista
  }
</script>

<div class="flex min-h-screen">
  <AdminSidebar active="schedules" />
  
  <div class="flex-1">
    <AdminHeader title="Gestión de Horarios" />
    
    <div class="p-6">
      <!-- Header with Actions -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">Horarios de Trabajo</h2>
          <p class="text-gray-600">Configura los horarios para tus empleados</p>
        </div>
        
        <button 
          on:click={() => showModal = true}
          class="mt-4 md:mt-0 px-4 py-2 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Horario
        </button>
      </div>
      
      <!-- Loading State -->
      {#if isLoading}
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <p class="mt-2 text-gray-600">Cargando horarios...</p>
        </div>
      
      <!-- Schedules Grid -->
      {:else if schedules.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each schedules as schedule}
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:border-purple-300 transition">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-bold text-gray-800 text-lg mb-1">{schedule.name}</h3>
                  <p class="text-sm text-gray-500">
                    {schedule.startTime} - {schedule.endTime}
                  </p>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                  </svg>
                </button>
              </div>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center py-3 border-b border-gray-100">
                  <span class="text-gray-600">Tolerancia:</span>
                  <span class="font-medium">{schedule.tolerance} minutos</span>
                </div>
                
                <div class="flex justify-between items-center py-3">
                  <span class="text-gray-600">Estado:</span>
                  <span class:px-3 py-1 rounded-full text-sm 
                    class={schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {schedule.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              <div class="mt-6 flex space-x-3">
                <button class="flex-1 py-2 text-sm bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition">
                  Asignar Empleados
                </button>
                <button class="flex-1 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
                  Editar
                </button>
              </div>
            </div>
          {/each}
        </div>
      
      <!-- Empty State -->
      {:else}
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay horarios configurados</h3>
          <p class="text-gray-600 mb-6">Comienza creando tu primer horario de trabajo</p>
          <button 
            on:click={() => showModal = true}
            class="px-4 py-2 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition flex items-center mx-auto"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Crear Primer Horario
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Modal para crear horarios -->
<ScheduleModal 
  bind:isOpen={showModal} 
  on:created={handleScheduleCreated}
  on:close={() => showModal = false}
/>