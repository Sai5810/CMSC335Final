<script>
  import { preventDefault } from 'svelte/legacy';

  let date = new Date().toISOString().split('T')[0];
  let location = '';
  let gameType = "No Limit Hold'em";
  let buyIn = '';
  let cashOut = '';
  let duration = '';
  let notes = '';

  let loading = false;
  let error = null;
  let success = false;

  const gameTypes = [
    "No Limit Hold'em",
    "Limit Hold'em",
    "Pot Limit Omaha",
    "Stud",
    "Mixed Games",
    "Other"
  ];

  async function handleSubmit() {
    error = null;
    success = false;
    if (
      !location ||
      buyIn === '' ||
      cashOut === '' ||
      duration === ''
    ) {
      error = 'Please fill in all required fields';
      return;
    }
    loading = true;
    try {
      const response = await fetch('http://localhost:3000/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          location,
          gameType,
          buyIn: Number(buyIn),
          cashOut: Number(cashOut),
          duration: Number(duration),
          notes
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      location = '';
      buyIn = '';
      cashOut = '';
      duration = '';
      notes = '';
      success = true;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>
<div class="session-form">
  <h2>Add New Poker Session</h2>
  {#if success}
    <div class="success-message">
      Session added successfully!
    </div>
  {/if}
  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="date">Date:</label>
      <input type="date" id="date" bind:value={date} required />
    </div>
    <div class="form-group">
      <label for="location">Location:</label>
      <input
        type="text"
        id="location"
        bind:value={location}
        placeholder="Casino or home game"
        required
      />
    </div>
    <div class="form-group">
      <label for="gameType">Game Type:</label>
      <select id="gameType" bind:value={gameType}>
        {#each gameTypes as game}
          <option value={game}>{game}</option>
        {/each}
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="buyIn">Buy-In ($):</label>
        <input
          type="number"
          id="buyIn"
          bind:value={buyIn}
          min="0"
          step="0.01"
          required
        />
      </div>
      <div class="form-group">
        <label for="cashOut">Cash-Out ($):</label>
        <input
          type="number"
          id="cashOut"
          bind:value={cashOut}
          min="0"
          step="0.01"
          required
        />
      </div>

      <div class="form-group">
        <label for="duration">Duration (hours):</label>
        <input
          type="number"
          id="duration"
          bind:value={duration}
          min="0"
          step="0.5"
          required
        />
      </div>
    </div>

    <div class="form-group">
      <label for="notes">Notes:</label>
      <textarea
        id="notes"
        bind:value={notes}
        rows="3"
        placeholder="Any notes about the session"
      ></textarea>
    </div>

    <button type="submit" class="submit-btn" disabled={loading}>
      {loading ? 'Saving...' : 'Save Session'}
    </button>
  </form>
</div>

<style>
  .form-row {
    display: flex;
    gap: 15px;
  }

  .form-row .form-group {
    flex: 1;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .submit-btn {
    background-color: var(--primary-color, #007bff);
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-btn:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }

  .success-message {
    padding: 10px;
    background-color: #d4edda;
    color: #155724;
    border-radius: 5px;
    margin-bottom: 15px;
  }

  .error {
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 5px;
    margin-bottom: 15px;
  }
</style>
