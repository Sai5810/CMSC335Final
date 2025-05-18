<script>
  import { onMount } from 'svelte';

  let stats = null;
  let cardImages = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const statsResponse = await fetch('/stats');
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      stats = await statsResponse.json();

      const cardsResponse = await fetch('/stats/chart');
      if (!cardsResponse.ok) throw new Error('Failed to fetch cards');
      const cardData = await cardsResponse.json();
      cardImages = cardData.cards.map(c => c.image);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  const formatCurrency = amount =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
      {#each [
        { title: 'Total Sessions', value: stats.totalSessions },
        { title: 'Total Profit', value: formatCurrency(stats.totalProfit), class: stats.totalProfit >= 0 ? 'profit' : 'loss' },
        { title: 'Hourly Rate', value: `${formatCurrency(stats.hourlyRate)}/hr`, class: stats.hourlyRate >= 0 ? 'profit' : 'loss' },
        { title: 'Win Rate', value: `${stats.winRate.toFixed(1)}%` },
        { title: 'Total Hours', value: stats.totalHours },
        { title: 'Winning Sessions', value: `${stats.winningGames} / ${stats.totalSessions}` }
      ] as stat}
        <div class="stat-card">
          <h3>{stat.title}</h3>
          <div
            class="stat-value"
            class:profit={stat.class === 'profit'}
            class:loss={stat.class === 'loss'}>
            {stat.value}
          </div>
        </div>
      {/each}
    </div>

    <div class="cards-container">
      <h3>Your Lucky Board</h3>
      <div class="hand">
        {#each cardImages as image}
          <img src={image} alt="Card" />
        {/each}
      </div>
    </div>
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
    border-radius: var(--border-radius, 8px);
    padding: 20px;
    box-shadow: var(--box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
    text-align: center;
    color: black;
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

  .cards-container {
    margin-top: 30px;
    text-align: center;
  }

  .hand {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .cards-container img {
    width: 100px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
  }

  .cards-container img:hover {
    transform: translateY(-10px);
  }

  .loading,
  .error {
    margin-top: 10px;
    font-weight: bold;
  }
</style>
