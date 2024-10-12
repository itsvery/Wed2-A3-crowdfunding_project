document.addEventListener('DOMContentLoaded', function() {
  const contentDiv = document.getElementById('content');

  // Load home page content
  if (window.location.pathname.endsWith('home.html')) {
    loadHomePage();
  }

  // Load fundraiser page content
  if (window.location.pathname.endsWith('fundraiser.html')) {
    loadFundraiserPage();
  }

  // Load donation page content
  if (window.location.pathname.endsWith('donation.html')) {
    loadDonationPage();
  }

  // Load search page content
  if (window.location.pathname.endsWith('search.html')) {
    loadSearchPage();
  }

  function loadHomePage() {
    fetch('http://localhost:3000/fundraisers')
      .then(response => response.json())
      .then(data => {
        const fundraisersDiv = document.getElementById('fundraisers');
        data.forEach(fundraiser => {
          const fundraiserDiv = document.createElement('div');
          fundraiserDiv.innerHTML = `
            <h3>${fundraiser.CAPTION}</h3>
            <p>Organizer: ${fundraiser.ORGANIZER}</p>
            <p>City: ${fundraiser.CITY}</p>
            <p>Target Funding: ${fundraiser.TARGET_FUNDING}</p>
            <p>Current Funding: ${fundraiser.CURRENT_FUNDING}</p>
            <p>Category: ${fundraiser.CATEGORY_NAME}</p>
            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
          `;
          fundraisersDiv.appendChild(fundraiserDiv);
        });
      })
      .catch(error => console.error('Error fetching fundraisers:', error));
  }

  function loadFundraiserPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('id');

    fetch(`http://localhost:3000/fundraiser/${fundraiserId}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('caption').textContent = data.CAPTION;
        document.getElementById('organizer').textContent = data.ORGANIZER;
        document.getElementById('city').textContent = data.CITY;
        document.getElementById('target_funding').textContent = data.TARGET_FUNDING;
        document.getElementById('current_funding').textContent = data.CURRENT_FUNDING;

        const donationsUl = document.getElementById('donations');
        data.donations.forEach(donation => {
          const donationLi = document.createElement('li');
          donationLi.textContent = `${donation.GIVER} donated ${donation.AMOUNT} on ${donation.DATE}`;
          donationsUl.appendChild(donationLi);
        });

        document.getElementById('donate-link').href = `donation.html?fundraiser_id=${data.FUNDRAISER_ID}`;
      })
      .catch(error => console.error('Error fetching fundraiser details:', error));
  }

  function loadDonationPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('fundraiser_id');

    fetch(`http://localhost:3000/fundraiser/${fundraiserId}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('fundraiser-caption').textContent = data.CAPTION;
        document.getElementById('fundraiser_id').value = data.FUNDRAISER_ID;
      })
      .catch(error => console.error('Error fetching fundraiser details:', error));

    document.getElementById('donation-form').addEventListener('submit', function(event) {
      event.preventDefault();

      const giver = document.getElementById('giver').value;
      const amount = document.getElementById('amount').value;
      const fundraiser_id = document.getElementById('fundraiser_id').value;

      if (amount < 5) {
        alert('The minimum donation amount is 5 AUD.');
        return;
      }

      fetch('http://localhost:3000/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "DATE": new Date().toISOString(), "AMOUNT":amount, "GICER":giver, "FUNDRAISER_ID": fundraiser_id})
        
      })
        .then(response => response.json())
        .then(data => {
          alert(`Thank you for your donation to ${data.message}`);
          window.location.href = `fundraiser.html?id=${fundraiser_id}`;
        })
        .catch(error => console.error('Error submitting donation:', error));
        console.log({ "date": new Date().toISOString(), "amount":amount, "giver":giver, "fundraiser_id": fundraiser_id})

    });
  }

  function loadSearchPage() {
    document.getElementById('search-form').addEventListener('submit', function(event) {
      event.preventDefault();

      const organizer = document.getElementById('organizer').value;
      const city = document.getElementById('city').value;
      const category = document.getElementById('category').value;

      let query = '?';
      if (organizer) query += `organizer=${organizer}&`;
      if (city) query += `city=${city}&`;
      if (category) query += `category=${category}&`;

      fetch(`http://localhost:3000/search${query}`)
        .then(response => response.json())
        .then(data => {
          const searchResultsDiv = document.getElementById('search-results');
          searchResultsDiv.innerHTML = ''; // 清空之前的搜索结果

          if (data.length === 0) {
            searchResultsDiv.innerHTML = '<p style="color: red; font-weight: bold;">No fundraisers found.</p>';
          } else {
            data.forEach(fundraiser => {
              const fundraiserDiv = document.createElement('div');
              fundraiserDiv.innerHTML = `
                <h3>${fundraiser.CAPTION}</h3>
                <p>Organizer: ${fundraiser.ORGANIZER}</p>
                <p>City: ${fundraiser.CITY}</p>
                <p>Target Funding: ${fundraiser.TARGET_FUNDING}</p>
                <p>Current Funding: ${fundraiser.CURRENT_FUNDING}</p>
                <p>Category: ${fundraiser.CATEGORY_NAME}</p>
                <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
              `;
              searchResultsDiv.appendChild(fundraiserDiv);
            });
          }
        })
        .catch(error => console.error('Error searching fundraisers:', error));
    });

    document.getElementById('clear-button').addEventListener('click', function() {
      document.getElementById('organizer').value = '';
      document.getElementById('city').value = '';
      document.getElementById('category').value = '';
      document.getElementById('search-results').innerHTML = '';
    });
  }
});
