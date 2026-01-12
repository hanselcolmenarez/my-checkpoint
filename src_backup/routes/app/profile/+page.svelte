<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  
  let user = {
    name: 'Juan Pérez',
    position: 'Desarrollador Frontend',
    email: 'juan.perez@empresa.com',
    rut: '12.345.678-9',
    group: 'Desarrollo',
    schedule: 'L-V 8:30 - 17:45',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };
</script>

<div class="min-h-screen bg-gray-50 pb-16">
  <div class="p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
      <p class="text-gray-600">Información personal y laboral</p>
    </div>
    
    <div class="stat-card">
      <div class="flex flex-col items-center mb-6">
        <img
          src={user.photoURL}
          alt={user.name}
          class="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4" />
        <h2 class="text-xl font-bold text-gray-800">{user.name}</h2>
        <p class="text-purple-700 font-medium">{user.position}</p>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
            </svg>
            <span class="text-gray-600">RUT</span>
          </div>
          <span class="font-medium">{user.rut}</span>
        </div>
        
        <div class="flex items-center justify-between py-3 border-b">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="text-gray-600">Correo</span>
          </div>
          <span class="font-medium">{user.email}</span>
        </div>
        
        <div class="flex items-center justify-between py-3 border-b">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="text-gray-600">Grupo</span>
          </div>
          <span class="font-medium">{user.group}</span>
        </div>
        
        <div class="flex items-center justify-between py-3">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-gray-600">Horario</span>
          </div>
          <span class="font-medium">{user.schedule}</span>
        </div>
      </div>
    </div>
    
    <!-- Logout Button -->
    <div class="mt-8">
      <LogoutButton />
    </div>
  </div>
  
  <BottomNav activeTab="profile" />
</div>
