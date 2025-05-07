<script>
  import { onMount } from 'svelte';
  
  let sessions = $state([]);
  let loading = $state(true);
  let error = $state(null);
  
  // Fetch all sessions when component mounts
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
  
  // Delete a session
  async function deleteSession(id) {
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        const response = await fetch(`/sessions/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete session');
        
        // Remove the session from the array
        sessions = sessions.filter(session => session._id !== id);
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  }
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
          <th>Date</th>
          <th>Location</th>
          <th>Game</th>
          <th>Buy-In</th>
          <th>Cash-Out</th>
          <th>Profit/Loss</th>
          <th>Hours</th>
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
              <button class="edit-btn">Edit</button>
              <button class="delete-btn" onclick={() => deleteSession(session._id)}>
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  /* Component-specific styles only */
  .session-list {
    width: 100%;
  }
</style>