<script>
  import SessionList from './lib/SessionList.svelte';
  import SessionForm from './lib/SessionForm.svelte';
  import Stats from './lib/Stats.svelte';
  import Home from './lib/Home.svelte';

  let activeTab = $state('home');
</script>

<main class="container">
  <header>
    <h1>Poker Tracker</h1>
    <nav>
      <button 
        class:active={activeTab === 'home'} 
        onclick={() => activeTab = 'home'}>
        Home
      </button>
      <button 
        class:active={activeTab === 'sessions'} 
        onclick={() => activeTab = 'sessions'}>
        Sessions
      </button>
      <button 
        class:active={activeTab === 'new'} 
        onclick={() => activeTab = 'new'}>
        New Session
      </button>
      <button 
        class:active={activeTab === 'stats'} 
        onclick={() => activeTab = 'stats'}>
        Statistics
      </button>
    </nav>
  </header>

  <div class="content">
    {#if activeTab === 'home'}
      <Home />
    {:else if activeTab === 'sessions'}
      <SessionList />
    {:else if activeTab === 'new'}
      <SessionForm />
    {:else if activeTab === 'stats'}
      <Stats />
    {/if}
  </div>
</main>

<style>
  /* App-specific styles only */
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }
  
  nav {
    display: flex;
    gap: 10px;
  }
</style>