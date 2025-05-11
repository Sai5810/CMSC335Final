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
    gap: 15px;
    background-color: transparent;
    border-radius: 8px;
    padding: 5px;
  }

  button {
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  button:hover {
    background-color: rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }
  
  button.active {
    background-color: rgba(0, 0, 0, 0.5);
    border-color: white;
    font-weight: 600;
  }
</style>