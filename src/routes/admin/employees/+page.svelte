<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import { user } from '$lib/services/auth.service';
  import { 
    employees, 
    loadEmployees, 
    isLoading, 
    error 
  } from '$lib/services/admin.service';
  import { register } from '$lib/services/auth.service';
  
  let searchTerm = $state('');
  let isCreatingUser = $state(false);
  let createError = $state('');
  let createSuccess = $state(false);
  
  const filteredEmployees = $derived(
    $employees.filter(emp => 
      emp.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  onMount(async () => {
    if ($user?.companyId) {
      await loadEmployees($user.companyId);
    }
  });
  
  async function sendInvitation(email: string, name: string) {
    try {
      // En un entorno real, aquí llamarías a una función de Firebase para enviar email
      // Por ahora, simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`📧 Invitación enviada a: ${email}\n\n${name} recibirá un correo con el enlace para crear su contraseña.\n\nEl enlace es válido por 48 horas.`);
    } catch (err) {
      console.error('Error sending invitation:', err);
      alert('Error al enviar la invitación');
    }
  }
  
  async function createDemoEmployee() {
    if (!$user?.companyId) return;
    
    isCreatingUser = true;
    createError = '';
    createSuccess = false;
    
    try {
      const demoNumber = $employees.length + 1;
      const employeeData = {
        email: `empleado${demoNumber}@techcorp.cl`,
        displayName: `Empleado Demo ${demoNumber}`,
        position: 'Empleado',
        rut: `${demoNumber}${demoNumber}.${demoNumber}${demoNumber}${demoNumber}.${demoNumber}${demoNumber}-${demoNumber}`,
        department: 'Desarrollo',
        scheduleRef: 'schedule_001',
        role: 'employee' as const,
        companyId: $user.companyId
      };
      
      await register(employeeData, 'demo123');
      
      createSuccess = true;
      
      // Recargar lista de empleados
      await loadEmployees($user.companyId);
      
      setTimeout(() => {
        createSuccess = false;
      }, 3000);
      
    } catch (err: any) {
      createError = err.message || 'Error al crear empleado';
    } finally {
      isCreatingUser = false;
    }
  }
</script>

<div class="flex min-h-screen">
  <AdminSidebar active="employees" />
  
  <div class="flex-1 lg:ml-64">
    <AdminHeader title="Gestión de Empleados" />
    
    {#if !$user || $user.role !== 'admin'}
      <!-- Not Authorized -->
      <div class="flex items-center justify-center min-h-[60vh] p-6">
        <div class="text-center max-w-md">
          <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Acceso restringido</h2>
          <p class="text-gray-600 mb-6">Esta sección es solo para administradores</p>
          <a href="/" class="btn-primary inline-block">Volver al Dashboard</a>
        </div>
      </div>
    {:else}
      <div class="p-4 sm:p-6">
        <!-- Success Message -->
        {#if createSuccess}
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
            <div class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="font-medium">¡Empleado creado exitosamente!</span>
            </div>
          </div>
        {/if}
        
        <!-- Error Messages -->
        {#if $error}
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center text-red-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium">{$error}</span>
            </div>
          </div>
        {/if}
        
        {#if createError}
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center text-red-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium">{createError}</span>
            </div>
          </div>
        {/if}
        
        <!-- Header with Actions -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Lista de Empleados</h2>
            <p class="text-gray-600">Gestiona los empleados de tu empresa</p>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4 md:mt-0">
            <div class="relative flex-1 sm:flex-none">
              <input
                type="text"
                bind:value={searchTerm}
                placeholder="Buscar empleado..."
                class="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-50"
                disabled={$isLoading} />
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <div class="flex space-x-2">
              <button
                onclick={createDemoEmployee}
                disabled={$isLoading || isCreatingUser}
                class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center">
                {#if isCreatingUser}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                {:else}
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Demo
                {/if}
              </button>
              
              <button
                onclick={() => goto('/admin/employees/new')}
                class="px-4 py-2 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Nuevo
              </button>
            </div>
          </div>
        </div>
        
        <!-- Employees Table -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {#if $isLoading}
            <div class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto mb-3"></div>
                <p class="text-gray-500">Cargando empleados...</p>
              </div>
            </div>
          {:else if filteredEmployees.length === 0}
            <div class="text-center py-12">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <p class="text-gray-500">No se encontraron empleados</p>
              <p class="text-sm text-gray-400 mt-1">Agrega tu primer empleado</p>
            </div>
          {:else}
            <div class="overflow-x-auto -mx-4 sm:mx-0">
              <div class="min-w-full inline-block align-middle">
                <div class="overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr class="text-left text-xs sm:text-sm text-gray-500">
                        <th class="px-4 sm:px-6 py-3 sm:py-4 font-medium">Empleado</th>
                        <th class="px-4 sm:px-6 py-3 sm:py-4 font-medium hidden sm:table-cell">Cargo</th>
                        <th class="px-4 sm:px-6 py-3 sm:py-4 font-medium">Estado</th>
                        <th class="px-4 sm:px-6 py-3 sm:py-4 font-medium hidden md:table-cell">Último Acceso</th>
                        <th class="px-4 sm:px-6 py-3 sm:py-4 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      {#each filteredEmployees as employee}
                        <tr class="hover:bg-gray-50">
                          <td class="px-4 sm:px-6 py-4">
                            <div class="flex items-center">
                              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full mr-2 sm:mr-3 hidden sm:block"></div>
                              <div>
                                <p class="font-medium text-gray-800 text-sm sm:text-base">{employee.displayName}</p>
                                <p class="text-xs text-gray-500 sm:hidden">{employee.position}</p>
                                <p class="text-xs text-gray-500">{employee.email}</p>
                              </div>
                            </div>
                          </td>
                          <td class="px-4 sm:px-6 py-4 hidden sm:table-cell">
                            <span class="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                              {employee.position || 'Sin cargo'}
                            </span>
                          </td>
                          <td class="px-4 sm:px-6 py-4">
                            <span class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm {employee.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                              {employee.isActive !== false ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td class="px-4 sm:px-6 py-4 font-medium hidden md:table-cell text-sm sm:text-base">
                            {employee.lastLogin 
                              ? new Date(employee.lastLogin).toLocaleDateString('es-ES') 
                              : 'Nunca'}
                          </td>
                          <td class="px-4 sm:px-6 py-4">
                            <div class="flex flex-wrap gap-1 sm:gap-2">
                              <button
                                onclick={() => sendInvitation(employee.email, employee.displayName || 'Usuario')}
                                class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition whitespace-nowrap">
                                Invitar
                              </button>
                              <button
                                onclick={() => goto(`/admin/employees/edit/${employee.uid}`)}
                                class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .btn-primary {
    background-color: #6d28d9;
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 12px;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #5b21b6;
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
