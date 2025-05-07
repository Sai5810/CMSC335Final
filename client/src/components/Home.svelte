<script>
    // You could add some state or logic here if needed
  </script>
  
  <div class="home">
    <h2>Welcome to Poker Tracker</h2>
    
    <div class="card">
      <h3>Track Your Poker Sessions</h3>
      <p>
        Keep detailed records of your poker games, analyze your results,
        and improve your strategy with data-driven insights.
      </p>
    </div>
    
    <div class="card">
      <h3>Poker Tip of the Day</h3>
      <blockquote>
        Position is power in poker. Late position gives you more information and control over the pot.
      </blockquote>
      <p class="tip-note">Check the Stats page for a new tip each time!</p>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <h4>Track Sessions</h4>
        <p>Record buy-ins, cash-outs, duration, and notes for every poker session.</p>
      </div>
      
      <div class="feature-card">
        <h4>View Statistics</h4>
        <p>See your win rate, hourly rate, and other key metrics about your poker play.</p>
      </div>
      
      <div class="feature-card">
        <h4>Analyze Results</h4>
        <p>Identify patterns in your play to improve your strategy and profitability.</p>
      </div>
    </div>
    
    <div class="get-started">
      <p>Get started by adding your first session or browsing your existing records!</p>
    </div>
  </div>
  
  <style>
    .tip-note {
      font-size: 0.9rem;
      color: var(--text-light);
      text-align: right;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .feature-card {
      background: white;
      padding: 15px;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
    }
    
    blockquote {
      font-style: italic;
      border-left: 3px solid var(--primary-color);
      padding-left: 15px;
      margin-left: 0;
      color: var(--text-light);
    }
    
    .get-started {
      text-align: center;
      margin: 30px 0;
      font-weight: bold;
    }
  </style>