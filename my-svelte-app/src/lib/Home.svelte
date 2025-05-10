<script>
  const features = [
    { icon: '📋', title: 'Track Sessions', desc: 'Record buy-ins, cash-outs, durations and session notes.' },
    { icon: '📈', title: 'View Statistics', desc: 'Check win rates, hourly earnings and performance trends.' }
  ];
</script>

<div class="home">
  <header>
    <h2>Welcome to <span>Poker Tracker</span></h2>
    <p>Your data-driven poker companion</p>
  </header>

  <div class="tip-card">
    <h3>🧠 Poker Tip</h3>
    <blockquote>
      "Position is power in poker. Late position gives you more information and control over the pot."
    </blockquote>
  </div>

  <div class="features">
    {#each features as feature}
      <div class="card">
        <h3>{feature.icon} {feature.title}</h3>
        <p>{feature.desc}</p>
      </div>
    {/each}
  </div>

  <footer>
    <p>Created by Sai Vaka, Divjot Muchhal, and Anthony Van Rheenen</p>
  </footer>
</div>

<style>
  .home {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  header span { color: var(--primary-color); }
  header p { color: var(--text-light); }

  .tip-card, .card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: black;
  }

  .tip-card {
    margin-bottom: 2rem;
  }

  blockquote {
    border-left: 4px solid var(--primary-color);
    padding-left: 1rem;
    margin: 0.5rem 0;
    font-style: italic;
    color: var(--text-light);
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .card {
    text-align: center;
  }

  footer {
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-light);
    margin-top: 2rem;
  }
</style>