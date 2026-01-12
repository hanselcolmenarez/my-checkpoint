<script lang="ts">
  import LogoutButton from '../LogoutButton.svelte';
  
  // Usar $props() en lugar de export let
  const { 
    active = 'dashboard',
    navigateTo = () => {} 
  } = $props<{ 
    active?: string; 
    navigateTo?: (href: string) => void 
  }>();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/admin/dashboard' },
    { id: 'employees', label: 'Empleados', icon: 'users', href: '/admin/employees' },
    { id: 'schedules', label: 'Horarios', icon: 'calendar', href: '/admin/schedules' },
    { id: 'reports', label: 'Reportes', icon: 'chart-bar', href: '/admin/reports' }
  ];
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6';
      case 'users':
        return 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z';
      case 'calendar':
        return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
      case 'chart-bar':
        return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
      default:
        return '';
    }
  };
</script>

<div class="p-4 lg:p-6">
  <div class="flex items-center mb-6 lg:mb-8">
    <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
      <svg class="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    </div>
    <div>
      <h1 class="text-xl font-bold text-gray-800">MyCheckPoint</h1>
      <p class="text-xs text-gray-500">Panel Admin</p>
    </div>
  </div>
  
  <nav class="space-y-1">
    {#each menuItems as item}
      <button
        onclick={() => navigateTo(item.href)}
        class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition {active === item.id ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}"
        type="button">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(item.icon)} />
        </svg>
        {item.label}
      </button>
    {/each}
  </nav>
  
  <div class="mt-8 pt-6 border-t border-gray-200">
    <div class="px-4 py-3">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-800">Administrador</p>
          <p class="text-xs text-gray-500">admin@techcorp.cl</p>
        </div>
      </div>
    </div>
    
    <div class="mt-4">
      <LogoutButton />
    </div>
  </div>
</div>
