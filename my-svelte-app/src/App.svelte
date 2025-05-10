<script>
  import SessionList from './lib/SessionList.svelte';
  import SessionForm from './lib/SessionForm.svelte';
  import Stats from './lib/Stats.svelte';
  import Home from './lib/Home.svelte';
  import './app.css';

  let activeTab = $state('home');
  const tabs = [
    { id: 'home', label: 'Home', component: Home },
    { id: 'sessions', label: 'Sessions', component: SessionList },
    { id: 'new', label: 'New Session', component: SessionForm },
    { id: 'stats', label: 'Statistics', component: Stats }
  ];
</script>

<main class="container">
  <header>
    <h1>Poker Tracker</h1>
    <nav>
      {#each tabs as tab}
        <button 
          class:active={activeTab === tab.id} 
          onclick={() => activeTab = tab.id}>
          {tab.label}
        </button>
      {/each}
    </nav>
  </header>

  <div class="content">
    {#each tabs as tab}
      {#if activeTab === tab.id}
        {#if tab.component}
          <tab.component />
        {/if}
      {/if}
    {/each}
  </div>
</main>

<style>
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  nav {
    display: flex;
    gap: 10px;
  }
</style>