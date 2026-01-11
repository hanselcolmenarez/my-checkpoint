<script lang="ts">
  import { goto } from '$app/navigation';
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  
  let form = {
    name: '',
    email: '',
    rut: '',
    position: '',
    schedule: 'default',
    sendInvitation: true
  };
  
  let isLoading = false;
  let error = '';
  let success = false;
  
  const schedules = [
    { id: 'default', name: 'Horario Estándar (8:30 - 17:45)' },
    { id: 'flexible', name: 'Horario Flexible' },
    { id: 'part-time', name: 'Medio Tiempo' },
    { id: 'night', name: 'Turno Nocturno' }
  ];
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    error = '';
    success = false;
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!form.name || !form.email) {
        throw new Error('Nombre y correo son requeridos');
      }
      
      // Aquí iría la lógica real con Firebase
      console.log('Creando empleado:', form);
      
      // Mostrar éxito
      success = true;
      
      // Si se enviará invitación, mostrar mensaje especial
      if (form.sendInvitation) {
        setTimeout(() => {
          alert(`✅ Empleado creado exitosamente!\n\n📧 Se ha enviado un correo a ${form.email} con el enlace para crear su contraseña.\n\nEl enlace es válido por 48 horas.`);
          goto('/admin/employees');
        }, 500);
      } else {
        setTimeout(() => goto('/admin/employees'), 1500);
      }
      
    } catch (err: any) {
      error = err.message || 'Error al crear empleado';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex min-h-screen">
  <AdminSidebar active="employees" />
  
  <div class="flex-1">
    <AdminHeader title="Nuevo Empleado" />
    
    <div class="p-6">
      <div class="max-w-2xl">
        <!-- Success Message -->
        {#if success}
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="font-medium">Empleado creado exitosamente</span>
            </div>
          </div>
        {/if}
        
        <!-- Error Message -->
        {#if error}
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center text-red-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium">{error}</span>
            </div>
          </div>
        {/if}
        
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onsubmit={handleSubmit} class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    bind:value={form.name}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Ej: Juan Pérez"
                    required>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    RUT
                  </label>
                  <input
                    type="text"
                    bind:value={form.rut}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Ej: 12.345.678-9">
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  bind:value={form.email}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="ejemplo@empresa.com"
                  required>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo *
                </label>
                <input
                  type="text"
                  bind:value={form.position}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Ej: Desarrollador Frontend"
                  required>
              </div>
            </div>
            
            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Configuración Laboral</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Horario de Trabajo
                </label>
                <select
                  bind:value={form.schedule}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition">
                  {#each schedules as schedule}
                    <option value={schedule.id}>{schedule.name}</option>
                  {/each}
                </select>
              </div>
              
              <div class="mt-6">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    bind:checked={form.sendInvitation}
                    class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                  <span class="ml-2 text-sm text-gray-700">
                    Enviar invitación por correo para crear contraseña
                  </span>
                </label>
                <p class="mt-2 text-sm text-gray-500">
                  El empleado recibirá un enlace único para establecer su contraseña
                </p>
              </div>
            </div>
            
            <div class="pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onclick={() => goto('/admin/employees')}
                class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                class="px-6 py-3 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center">
                {#if !isLoading}
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Crear Empleado
                {:else}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
