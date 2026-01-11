<script lang="ts">
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  
  let selectedMonth = new Date().getMonth();
  let selectedYear = new Date().getFullYear();
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const years = [2024, 2023, 2022];
  
  let attendanceData = [
    { employee: 'Juan Pérez', workedDays: 22, lateDays: 2, absentDays: 0, totalHours: 176 },
    { employee: 'María González', workedDays: 21, lateDays: 4, absentDays: 1, totalHours: 168 },
    { employee: 'Carlos López', workedDays: 20, lateDays: 1, absentDays: 2, totalHours: 160 },
    { employee: 'Ana Rodríguez', workedDays: 23, lateDays: 0, absentDays: 0, totalHours: 184 },
    { employee: 'Pedro Sánchez', workedDays: 21, lateDays: 3, absentDays: 1, totalHours: 168 }
  ];
</script>

<div class="flex min-h-screen">
  <AdminSidebar active="reports" />
  
  <div class="flex-1">
    <AdminHeader title="Reportes de Asistencia" />
    
    <div class="p-6">
      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Filtros del Reporte</h3>
          
          <div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
            <div class="flex items-center space-x-3">
              <select
                bind:value={selectedMonth}
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                {#each months as month, i}
                  <option value={i}>{month}</option>
                {/each}
              </select>
              
              <select
                bind:value={selectedYear}
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                {#each years as year}
                  <option value={year}>{year}</option>
                {/each}
              </select>
            </div>
            
            <button class="px-4 py-2 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Exportar Excel
            </button>
          </div>
        </div>
      </div>
      
      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p class="text-sm text-gray-500 mb-2">Días Laborales</p>
          <p class="text-2xl font-bold text-gray-800">22</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p class="text-sm text-gray-500 mb-2">Asistencia Promedio</p>
          <p class="text-2xl font-bold text-gray-800">94.5%</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p class="text-sm text-gray-500 mb-2">Horas Trabajadas</p>
          <p class="text-2xl font-bold text-gray-800">856h</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p class="text-sm text-gray-500 mb-2">Tardanzas Totales</p>
          <p class="text-2xl font-bold text-gray-800">10</p>
        </div>
      </div>
      
      <!-- Detailed Report -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800">Reporte Detallado por Empleado</h3>
          <p class="text-gray-600">Mes: {months[selectedMonth]} {selectedYear}</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr class="text-left text-sm text-gray-500">
                <th class="px-6 py-4 font-medium">Empleado</th>
                <th class="px-6 py-4 font-medium">Días Trabajados</th>
                <th class="px-6 py-4 font-medium">Días Tarde</th>
                <th class="px-6 py-4 font-medium">Días Ausente</th>
                <th class="px-6 py-4 font-medium">Horas Totales</th>
                <th class="px-6 py-4 font-medium">Asistencia</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {#each attendanceData as data}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                      <span class="font-medium">{data.employee}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-medium">{data.workedDays}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {data.lateDays} días
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {data.absentDays} días
                    </span>
                  </td>
                  <td class="px-6 py-4 font-medium">{data.totalHours}h</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div class="bg-green-600 h-2 rounded-full" style="width: {Math.round((data.workedDays / 22) * 100)}%"></div>
                      </div>
                      <span class="font-medium">{Math.round((data.workedDays / 22) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
