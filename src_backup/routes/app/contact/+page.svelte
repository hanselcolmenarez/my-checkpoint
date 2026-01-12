<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  
  let company = {
    name: 'TechCorp Solutions',
    address: 'Av. Principal 1234, Santiago',
    phone: '+56 2 2345 6789',
    email: 'contacto@techcorp.cl',
    website: 'www.techcorp.cl'
  };
  
  function shareContact() {
    if (navigator.share) {
      navigator.share({
        title: 'Contacto TechCorp',
        text: `Contacta a ${company.name}: ${company.phone}`,
        url: window.location.href
      });
    }
  }
</script>

<div class="min-h-screen bg-gray-50 pb-16">
  <div class="p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Contacto</h1>
      <p class="text-gray-600">Información de la empresa</p>
    </div>
    
    <div class="stat-card mb-6">
      <div class="flex items-center mb-6">
        <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
          <svg class="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">{company.name}</h2>
          <p class="text-gray-600">Tu lugar de trabajo</p>
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <div>
            <p class="text-sm text-gray-500">Dirección</p>
            <p class="font-medium">{company.address}</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <svg class="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <div>
            <p class="text-sm text-gray-500">Teléfono</p>
            <p class="font-medium">{company.phone}</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <svg class="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <div>
            <p class="text-sm text-gray-500">Correo</p>
            <p class="font-medium">{company.email}</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <svg class="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
          <div>
            <p class="text-sm text-gray-500">Sitio Web</p>
            <p class="font-medium">{company.website}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="space-y-3">
      <button
        onclick={shareContact}
        class="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Compartir Contacto
      </button>
      
      <a
        href={`tel:${company.phone}`}
        class="w-full py-3 bg-purple-700 text-white font-medium rounded-xl hover:bg-purple-800 transition flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
        Llamar Ahora
      </a>
    </div>
  </div>
  
  <BottomNav activeTab="contact" />
</div>
