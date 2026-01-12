<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { scheduleService } from '$lib/services/schedule';
  
  export let isOpen = false;
  
  const dispatch = createEventDispatcher();
  
  let formData = {
    name: '',
    startTime: '08:30',
    endTime: '17:00',
    tolerance: '15'
  };
  
  let isLoading = false;
  let error = '';
  
  function closeModal() {
    isOpen = false;
    dispatch('close');
  }
  
  async function handleSubmit() {
    if (!formData.name.trim()) {
      error = 'El nombre es requerido';
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      await scheduleService.createSchedule(formData);
      
      // Reset form
      formData = {
        name: '',
        startTime: '08:30',
        endTime: '17:00',
        tolerance: '15'
      };
      
      closeModal();
      dispatch('created'); // Notificar que se creó un horario
    } catch (err) {
      error = err.message || 'Error al crear el horario';
    } finally {
      isLoading = false;
    }
  }
</script>

{#if isOpen}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md" on:click|stopPropagation>
    <!-- Header -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">Crear Nuevo Horario</h3>
        <button on:click={closeModal} class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Form -->
    <div class="p-6">
      {#if error}
        <div class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Horario *
            </label>
            <input
              type="text"
              bind:value={formData.name}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Turno Mañana"
              required
            />
          </div>
          
          <!-- Horario -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Hora de Entrada
              </label>
              <input
                type="time"
                bind:value={formData.startTime}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Hora de Salida
              </label>
              <input
                type="time"
                bind:value={formData.endTime}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
          <!-- Tolerancia -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tolerancia (minutos)
            </label>
            <select
              bind:value={formData.tolerance}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="5">5 minutos</option>
              <option value="10">10 minutos</option>
              <option value="15" selected>15 minutos</option>
              <option value="20">20 minutos</option>
              <option value="30">30 minutos</option>
            </select>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            on:click={closeModal}
            class="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition flex items-center"
            disabled={isLoading}
          >
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            {/if}
            Crear Horario
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
{/if}