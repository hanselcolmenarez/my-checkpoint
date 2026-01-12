<script lang="ts">
  // Usar $props() en lugar de export let
  const { activeTab = 'dashboard' } = $props<{ activeTab?: 'dashboard' | 'profile' | 'contact' }>();
  
  const navItems = [
    { id: 'dashboard', label: 'Marcar', icon: 'clock', href: '/' },
    { id: 'profile', label: 'Perfil', icon: 'user', href: '/app/profile' },
    { id: 'contact', label: 'Contacto', icon: 'mail', href: '/app/contact' }
  ];
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'user':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      case 'mail':
        return 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
      default:
        return '';
    }
  };
  
  function handleNavClick(e: Event, itemId: string, href: string) {
    e.preventDefault();
    if (itemId !== activeTab) {
      window.location.href = href;
    }
  }
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
  <div class="flex justify-around items-center h-16">
    {#each navItems as item}
      <a
        href={item.href}
        class="bottom-nav-item {activeTab === item.id ? 'active' : 'text-gray-500'}"
        onclick={(e) => handleNavClick(e, item.id, item.href)}>
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(item.icon)} />
        </svg>
        {item.label}
      </a>
    {/each}
  </div>
</nav>

<style>
  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .bottom-nav-item.active {
    color: #6d28d9;
    font-weight: 600;
  }
</style>
