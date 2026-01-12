<script lang="ts">
  import { goto } from '$app/navigation';
  import LogoutButton from '../LogoutButton.svelte';
  import AdminSidebarContent from './AdminSidebarContent.svelte';
  
  // Usar $props() en lugar de export let
  const { active = 'dashboard' } = $props<{ active?: string }>();
  
  let isMobileMenuOpen = $state(false);
  
  // Cerrar menú móvil al cambiar de ruta
  function navigateTo(href: string) {
    if (active !== href.split('/').pop()) {
      goto(href);
      isMobileMenuOpen = false;
    }
  }
</script>

<div class="flex min-h-screen">
  <!-- Mobile Menu Button -->
  <button
    onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
    class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
    aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {#if isMobileMenuOpen}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      {:else}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      {/if}
    </svg>
  </button>
  
  <!-- Sidebar for Desktop and Mobile -->
  <aside class="hidden lg:flex w-64 bg-white border-r border-gray-200 min-h-screen flex-shrink-0">
    <div class="w-64">
      <AdminSidebarContent {active} {navigateTo} />
    </div>
  </aside>
  
  <!-- Mobile Sidebar Overlay -->
  {#if isMobileMenuOpen}
    <div
      class="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
      onclick={() => isMobileMenuOpen = false}>
    </div>
  {/if}
  
  <!-- Mobile Sidebar -->
  <aside
    class="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}">
    <div class="w-64">
      <AdminSidebarContent {active} {navigateTo} />
    </div>
  </aside>
</div>
