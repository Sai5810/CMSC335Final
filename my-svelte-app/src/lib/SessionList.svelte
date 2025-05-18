<script>
  import { onMount } from 'svelte';

  let sessions = [];
  let loading = true;
  let error = null;
  let sortField = 'date';
  let sortDirection = 'desc';
  let deletingId = null;

  onMount(async () => {
    try {
      const response = await fetch('/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      sessions = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  async function deleteSession(id) {
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        deletingId = id;
        // relative URL here as well
        const response = await fetch(`/sessions/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete session');
        sessions = sessions.filter(session => session._id !== id);
      } catch (err) {
        alert(`Error: ${err.message}`);
      } finally {
        deletingId = null;
      }
    }
  }

  function handleSort(field) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = field === 'date' ? 'desc' : 'asc';
    }
    
    sessions = [...sessions].sort((a, b) => {
      let valA, valB;
      
      if (field === 'profit') {
        valA = a.cashOut - a.buyIn;
        valB = b.cashOut - b.buyIn;
      } else if (field === 'hourlyRate') {
        valA = (a.cashOut - a.buyIn) / a.duration;
        valB = (b.cashOut - b.buyIn) / b.duration;
      } else {
        valA = a[field];
        valB = b[field];
      }
      
      if (field === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return valA > valB ? multiplier : valA < valB ? -multiplier : 0;
    });
  }

  const formatDate = dateString => new Date(dateString).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formatCurrency = amount => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(amount);

  $: totalProfit = sessions.reduce((sum, s) => sum + (s.cashOut - s.buyIn), 0);
  $: totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
  $: winningGames = sessions.filter(s => s.cashOut > s.buyIn).length;
</script>

<div class="session-list">
  <h2>Your Poker Sessions</h2>

  {#if loading}
    <div class="loading">Loading sessions...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else if sessions.length === 0}
    <p>No poker sessions found. Add your first session to start tracking!</p>
  {:else}
    <table>
      <thead>
        <tr>
            {#each [
              { field: 'date', label: 'Date' },
              { field: 'location', label: 'Location' },
              { field: 'gameType', label: 'Game' },
              { field: 'buyIn', label: 'Buy-In' },
              { field: 'cashOut', label: 'Cash-Out' },
              { field: 'profit', label: 'Profit/Loss' },
              { field: 'duration', label: 'Hours' }
            ] as column}
              <th 
                on:click={() => handleSort(column.field)} 
                class:sorted={sortField === column.field}>
                {column.label} {sortField === column.field ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
            {/each}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each sessions as session}
          <tr>
            <td>{formatDate(session.date)}</td>
            <td>{session.location}</td>
            <td>{session.gameType || 'N/A'}</td>
            <td>{formatCurrency(session.buyIn)}</td>
            <td>{formatCurrency(session.cashOut)}</td>
            <td class={session.cashOut - session.buyIn >= 0 ? 'profit' : 'loss'}>
              {formatCurrency(session.cashOut - session.buyIn)}
            </td>
            <td>{session.duration}</td>
            <td>
              <button 
                class="delete-btn" 
                on:click={() => deleteSession(session._id)}
                disabled={deletingId === session._id}>
                {deletingId === session._id ? 'Deleting...' : 'Delete'}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Total: {sessions.length} sessions</td>
          <td>Win rate: {(winningGames / sessions.length * 100).toFixed(1)}%</td> 
          <td>Hours: {totalHours}</td>
          <td class={totalProfit >= 0 ? 'profit' : 'loss'} colspan="3">
            Total profit: {formatCurrency(totalProfit)}
          </td>
        </tr>
      </tfoot>
    </table>
  {/if}
</div>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    cursor: pointer;
    position: relative;
    background-color: transparent; 
    font-weight: bold;
  }

  th:hover { 
    background-color: rgba(0, 0, 0, 0.05); 
  }
  
  .sorted { 
    background-color: rgba(0, 0, 0, 0.08); 
  }

  .profit { color: green; }
  .loss { color: red; }
  
  tfoot {
    font-weight: bold;
    background-color: transparent; 
    border-top: 2px solid #ddd; 
  }

  .loading, .error {
    margin-top: 10px;
    font-weight: bold;
  }

  .delete-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .delete-btn:hover:not(:disabled) {
    background-color: darkred;
  }

  .delete-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
