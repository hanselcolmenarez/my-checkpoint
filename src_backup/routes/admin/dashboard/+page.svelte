<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import { user, isLoading as authLoading } from '$lib/services/auth.service';
  import { 
    getDashboardStats,
    loadAllAttendance,
    allAttendance,
    isLoading,
    error 
  } from '$lib/services/admin.service';
  
  let stats = $state({
    totalEmployees: 0,
    activeToday: 0,
    lateToday: 0,
    absentToday: 0
  });
  
  let recentActivity = $derived(
    $allAttendance.slice(0, 5).map(record => ({
      employee: 'Cargando...',
      action: record.checkOutTime ? 'Salida' : 'Entrada',
      time: record.checkInTime 
        ? new Date(record.checkInTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : '--:--',
      status: record.status
    }))
  );
  
  onMount(async () => {
    if ($user?.companyId) {
      await loadDashboardData();
    }
  });
  
  async function loadDashboardData() {
    if (!$user?.companyId) return;
    
    try {
      // Cargar estadísticas
      const dashboardStats = await getDashboardStats($user.companyId);
      stats = dashboardStats;
      
      // Cargar actividad reciente
      await loadAllAttendance($user.companyId);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  }
</script>

<div class="flex min-h-screen">
  <AdminSidebar active="dashboard" />
  
  <!-- Main Content -->
  <div class="flex-1 lg:ml-64">
    <AdminHeader title="Dashboard" />
    
    {#if $authLoading}
      <!-- Loading State -->
      <div class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando...</p>
        </div>
      </div>
    {:else if !$user || $user.role !== 'admin'}
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
        <!-- Error Message -->
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
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500">Total Empleados</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500">Activos Hoy</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">{stats.activeToday}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-yellow-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500">Tarde Hoy</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">{stats.lateToday}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-red-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500">Ausentes Hoy</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">{stats.absentToday}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">Actividad Reciente</h2>
            <button
              onclick={() => goto('/admin/reports')}
              class="text-sm text-purple-700 font-medium hover:text-purple-800 self-end sm:self-auto">
              Ver todos →
            </button>
          </div>
          
          {#if $isLoading}
            <div class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto mb-3"></div>
                <p class="text-gray-500">Cargando actividad...</p>
              </div>
            </div>
          {:else if recentActivity.length === 0}
            <div class="text-center py-12">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p class="text-gray-500">No hay actividad reciente</p>
              <p class="text-sm text-gray-400 mt-1">Los registros aparecerán aquí</p>
            </div>
          {:else}
            <div class="overflow-x-auto -mx-4 sm:mx-0">
              <div class="min-w-full">
                <table class="w-full">
                  <thead>
                    <tr class="text-left text-xs sm:text-sm text-gray-500 border-b">
                      <th class="pb-3 px-4 sm:px-0">Empleado</th>
                      <th class="pb-3 px-4 sm:px-0 hidden sm:table-cell">Acción</th>
                      <th class="pb-3 px-4 sm:px-0">Hora</th>
                      <th class="pb-3 px-4 sm:px-0">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each recentActivity as activity}
                      <tr class="border-b last:border-0">
                        <td class="py-4 px-4 sm:px-0">
                          <div class="flex items-center">
                            <div class="w-8 h-8 bg-gray-200 rounded-full mr-3 hidden sm:block"></div>
                            <div>
                              <span class="font-medium text-sm sm:text-base">{activity.employee}</span>
                              <span class="block sm:hidden text-xs text-gray-500 mt-1">{activity.action}</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 px-4 sm:px-0 hidden sm:table-cell">
                          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {activity.action}
                          </span>
                        </td>
                        <td class="py-4 px-4 sm:px-0 font-medium text-sm sm:text-base">{activity.time}</td>
                        <td class="py-4 px-4 sm:px-0">
                          <span class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm {activity.status === 'on-time' ? 'bg-green-100 text-green-800' : activity.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">
                            {activity.status === 'on-time' ? 'A tiempo' : activity.status === 'late' ? 'Tarde' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Quick Actions -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onclick={() => goto('/admin/employees/new')}
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:border-purple-300 transition text-left group">
            <div class="flex items-center mb-3 sm:mb-4">
              <div class="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:bg-purple-200 transition">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
            </div>
            <h3 class="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Nuevo Empleado</h3>
            <p class="text-xs sm:text-sm text-gray-600">Agregar nuevo empleado al sistema</p>
          </button>
          
          <button
            onclick={() => goto('/admin/schedules')}
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:border-purple-300 transition text-left group">
            <div class="flex items-center mb-3 sm:mb-4">
              <div class="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:bg-blue-200 transition">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <h3 class="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Horarios</h3>
            <p class="text-xs sm:text-sm text-gray-600">Gestionar horarios de trabajo</p>
          </button>
          
          <button
            onclick={() => goto('/admin/reports')}
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:border-purple-300 transition text-left group">
            <div class="flex items-center mb-3 sm:mb-4">
              <div class="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:bg-green-200 transition">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <h3 class="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Reportes</h3>
            <p class="text-xs sm:text-sm text-gray-600">Ver reportes de asistencia</p>
          </button>
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
</style>
