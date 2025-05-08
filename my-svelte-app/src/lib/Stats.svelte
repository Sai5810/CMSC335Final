<script>
  import { onMount } from 'svelte';

  let stats = null;
  let chartUrl = '';
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('http://localhost:3000/stats');
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      stats = await statsResponse.json();

      // Fetch chart URL
      const chartResponse = await fetch('http://localhost:3000/stats/chart');
      if (!chartResponse.ok) throw new Error('Failed to fetch chart');
      const chartData = await chartResponse.json();
      chartUrl = chartData.chartUrl;
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
  {:else if stats === null}
    <p>Add sessions to see statistics.</p>
  {:else}
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

    {#if chartUrl}
      <div class="chart-container">
        <h3>Profit/Loss Graph</h3>
        <img src={chartUrl} alt="Poker Stats Chart" />
      </div>
    {/if}
  {/if}
</div>

<style>
  .stats-page {
    padding: 20px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    border-radius: var(--border-radius, 8px);
    padding: 20px;
    box-shadow: var(--box-shadow, 0 2px 4px rgba(0,0,0,0.1));
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
  }

  .profit {
    color: green;
  }

  .loss {
    color: red;
  }
  .tip-card {
    background-color: var(--secondary-color, #f0f0f0);
    padding: 20px;
    border-radius: var(--border-radius, 8px);
    margin-top: 20px;
  }
 .tip-card p {
    font-style: italic;
  }
  .chart-container {
    margin-top: 30px;
    text-align: center;
  }
  .chart-container img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  .loading,
  .error {
    margin-top: 10px;
    font-weight: bold;
  }
</style>
