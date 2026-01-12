<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { format } from 'date-fns';
  import { es } from 'date-fns/locale';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import AttendanceModal from '$lib/components/AttendanceModal.svelte';
  import { 
    user, 
    isLoading as authLoading 
  } from '$lib/services/auth.service';
  import { 
    todayRecords, 
    historyRecords, 
    dailySummary,
    isLoading,
    error,
    markAttendance,
    formatAttendanceDate,
    formatAttendanceTime,
    getStatusClass,
    getStatusText
  } from '$lib/services/attendance.service';
  
  let currentTime = $state('');
  let currentDate = $state('');
  let showModal = $state(false);
  let markError = $derived(error);
  
  let timeInterval: NodeJS.Timeout;
  
  onMount(() => {
    updateDateTime();
    timeInterval = setInterval(updateDateTime, 1000);
  });
  
  onDestroy(() => {
    if (timeInterval) clearInterval(timeInterval);
  });
  
  function updateDateTime() {
    const now = new Date();
    currentTime = format(now, 'HH:mm');
    currentDate = format(now, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  }
  
  async function handleMarkAttendance(event: CustomEvent<{ password: string }>) {
    try {
      await markAttendance('password', event.detail.password);
      showModal = false;
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  }
  
  // Verificar si el usuario ya marcó entrada hoy
  const hasCheckedInToday = $derived(
    $todayRecords.length > 0 && $todayRecords[0].checkInTime !== null
  );
  
  const hasCheckedOutToday = $derived(
    $todayRecords.length > 0 && $todayRecords[0].checkOutTime !== null
  );
</script>

<div class="min-h-screen bg-gray-50 pb-16">
  {#if $authLoading}
    <!-- Loading State -->
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando...</p>
      </div>
    </div>
  {:else if !$user}
    <!-- Not Authenticated -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="text-center">
        <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Acceso no autorizado</h2>
        <p class="text-gray-600 mb-6">Por favor inicia sesión para acceder al sistema</p>
        <a href="/login" class="btn-primary inline-block">Ir al Login</a>
      </div>
    </div>
  {:else if $user.role !== 'employee'}
    <!-- Not an Employee -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="text-center">
        <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Acceso restringido</h2>
        <p class="text-gray-600 mb-6">Esta sección es solo para empleados</p>
        <a href="/admin/dashboard" class="btn-primary inline-block">Ir al Panel Admin</a>
      </div>
    </div>
  {:else}
    <!-- Employee Dashboard -->
    <div class="p-4">
      <!-- Header with Time -->
      <div class="mb-6">
        <div class="text-center mb-2">
          <div class="text-5xl font-bold text-gray-800 mb-1">
            {currentTime}
          </div>
          <div class="text-lg text-gray-600">
            {currentDate}
          </div>
          <div class="mt-2">
            <p class="text-sm text-gray-500">Bienvenido, {$user.displayName}</p>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      {#if $markError}
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <div class="flex items-center text-red-700">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">{$markError}</span>
          </div>
        </div>
      {/if}
      
      <!-- Action Card -->
      <div class="mb-6">
        <div class="stat-card mb-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Marcar Asistencia</h3>
          
          {#if $isLoading}
            <div class="flex items-center justify-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
              <span class="ml-3 text-gray-600">Cargando...</span>
            </div>
          {:else if hasCheckedOutToday}
            <div class="text-center py-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <p class="text-gray-700 font-medium">¡Asistencia completada hoy!</p>
              <p class="text-sm text-gray-500">Has marcado entrada y salida</p>
            </div>
          {:else}
            <button
              onclick={() => showModal = true}
              class="action-button bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={$isLoading}>
              <div class="flex items-center justify-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                {hasCheckedInToday ? 'Marcar Salida' : 'Marcar Entrada'}
              </div>
            </button>
          {/if}
        </div>
      </div>
      
      <!-- Daily Summary -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Resumen Diario</h3>
        <div class="grid grid-cols-3 gap-3">
          <div class="stat-card text-center">
            <div class="text-2xl font-bold text-purple-700 mb-1">
              {$dailySummary?.checkIn || '--:--'}
            </div>
            <div class="text-xs text-gray-500">Entrada</div>
          </div>
          
          <div class="stat-card text-center">
            <div class="text-2xl font-bold text-purple-700 mb-1">
              {$dailySummary?.checkOut || '--:--'}
            </div>
            <div class="text-xs text-gray-500">Salida</div>
          </div>
          
          <div class="stat-card text-center">
            <div class="text-2xl font-bold text-purple-700 mb-1">
              {$dailySummary?.hoursWorked || '0h'}
            </div>
            <div class="text-xs text-gray-500">Horas</div>
          </div>
        </div>
      </div>
      
      <!-- History -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-700">Historial Reciente</h3>
          {#if $isLoading}
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700"></div>
          {/if}
        </div>
        
        <div class="stat-card">
          {#if $historyRecords.length === 0}
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p class="text-gray-500">No hay registros históricos</p>
              <p class="text-sm text-gray-400 mt-1">Comienza marcando tu asistencia</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left text-xs text-gray-500 border-b">
                    <th class="pb-2">Fecha</th>
                    <th class="pb-2">Entrada</th>
                    <th class="pb-2">Salida</th>
                    <th class="pb-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {#each $historyRecords as record}
                    <tr class="border-b last:border-0">
                      <td class="py-3 text-sm">
                        {formatAttendanceDate(record.date)}
                      </td>
                      <td class="py-3 text-sm">
                        {formatAttendanceTime(record.checkInTime)}
                      </td>
                      <td class="py-3 text-sm">
                        {formatAttendanceTime(record.checkOutTime)}
                      </td>
                      <td class="py-3">
                        <span class="px-2 py-1 rounded-full text-xs {getStatusClass(record.status)}">
                          {getStatusText(record.status)}
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <BottomNav activeTab="dashboard" />
    
    {#if showModal}
      <AttendanceModal 
        {hasCheckedInToday}
        on:close={() => showModal = false}
        on:marked={handleMarkAttendance} />
    {/if}
  {/if}
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
  
  .stat-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 1rem;
    border: 1px solid #f3f4f6;
  }
  
  .action-button {
    width: 100%;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    font-weight: bold;
    color: white;
    transition: all 0.2s;
  }
  
  .action-button:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
