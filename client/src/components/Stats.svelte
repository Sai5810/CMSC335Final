<script>
  import { onMount } from 'svelte';
  
  let stats = $state(null);
  let loading = $state(true);
  let error = $state(null);
  
  onMount(async () => {
    try {
      const response = await fetch('/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      stats = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  }
</script>

<div class="stats-page">
  <h2>Your Poker Statistics</h2>
  
  {#if loading}
    <div class="loading">Loading statistics...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else if stats}
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Sessions</h3>
        <div class="stat-value">{stats.totalSessions}</div>
      </div>
      
      <div class="stat-card">
        <h3>Total Profit</h3>
        <div class="stat-value {stats.totalProfit >= 0 ? 'profit' : 'loss'}">
          {formatCurrency(stats.totalProfit)}
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Hourly Rate</h3>
        <div class="stat-value {stats.hourlyRate >= 0 ? 'profit' : 'loss'}">
          {formatCurrency(stats.hourlyRate)}/hr
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Win Rate</h3>
        <div class="stat-value">
          {stats.winRate.toFixed(1)}%
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Total Hours</h3>
        <div class="stat-value">{stats.totalHours}</div>
      </div>
      
      <div class="stat-card">
        <h3>Winning Sessions</h3>
        <div class="stat-value">{stats.winningGames} / {stats.totalSessions}</div>
      </div>
    </div>
    
    {#if stats.pokerTip}
      <div class="tip-card">
        <h3>Poker Tip</h3>
        <p>{stats.pokerTip}</p>
      </div>
    {/if}
  {/if}
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: white;
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: var(--box-shadow);
    text-align: center;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
  }
  
  .tip-card {
    background-color: var(--secondary-color);
    padding: 20px;
    border-radius: var(--border-radius);
    margin-top: 20px;
  }
  
  .tip-card p {
    font-style: italic;
  }
</style>