document.addEventListener('DOMContentLoaded', function () {
  const fundraiserTable = document.getElementById('fundraiserTable').getElementsByTagName('tbody')[0];
  const addForm = document.getElementById('addFundraiserForm');
  const editFormContainer = document.getElementById('editFormContainer');
  const editForm = document.getElementById('editFundraiserForm');

  let currentEditId = null;

  // Load all fundraisers
  function loadFundraisers() {
    fetch('http://localhost:3000/fundraisers')
      .then(response => response.json())
      .then(data => {
        fundraiserTable.innerHTML = '';
        data.forEach(fundraiser => {
          const row = fundraiserTable.insertRow();
          row.insertCell(0).textContent = fundraiser.FUNDRAISER_ID;
          row.insertCell(1).textContent = fundraiser.CAPTION;
          row.insertCell(2).textContent = fundraiser.ORGANIZER;
          const actionsCell = row.insertCell(3);
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.onclick = () => editFundraiser(fundraiser);
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.onclick = () => deleteFundraiser(fundraiser.FUNDRAISER_ID);
          actionsCell.appendChild(editButton);
          actionsCell.appendChild(deleteButton);
        });
      })
      .catch(error => console.error('Error fetching fundraisers:', error));
  }

  // Add a new fundraiser
  addForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newFundraiser = {
      caption: document.getElementById('caption').value,
      organizer: document.getElementById('organizer').value
    };

    fetch('http://localhost:3000/fundraisers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newFundraiser)
    })
    .then(response => {
      if (response.ok) {
        loadFundraisers();
        addForm.reset();
      } else {
        console.error('Error adding fundraiser');
      }
    });
  });

  // function validateForm1() {
  //   // Get values from the form using DOM
  //   const ORGANIZER = document.getElementById('organizer').value.trim();
  //   const CAPTION = document.getElementById('caption').value.trim();
  //   const TARGET = document.getElementById('target').value;
  //   const CURRENT = document.getElementById('curent').value;
  //   const CITY = document.getElementById('city').value.trim();
  //   const ACTIVE = document.getElementById('active').value;
  //   const CATEGORY_ID = document.getElementById('category').value;

  //   // Validate the form. Assume, all fields are required
  //   if (!ORGANIZER || !CAPTION || !TARGET || !CURRENT || !CITY || !ACTIVE || !CATEGORY_ID) {
  //     alert("All fields are required!");
  //     return;
  //   }

  //   // Create a data (JSON) to send in the POST request
  //   const postData = {
  //     'ORGANIZER': ORGANIZER,
  //     'CAPTION': CAPTION,
  //     'TARGET_FUNDING': TARGET,
  //     'CURRENT_FUNDING': CURRENT,
  //     'CITY': CITY,
  //     'ACTIVE': ACTIVE,
  //     'CATEGORY_ID': CATEGORY_ID
  //   };

  //   // Send the POST request to NodeJS API server
  //   fetch('http://localhost:3000/fundraisers', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(postData)
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.insert === 'success') {
  //         alert("Fundraiser added successfully!");
  //         document.getElementById('form1').reset(); // to clear the form                    
  //       } else if (data.insert === 'error') {
  //         alert("Error: " + data.message);
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error:", error);
  //     });
  // }

  // Edit a fundraiser
  function editFundraiser(fundraiser) {
    currentEditId = fundraiser.FUNDRAISER_ID;
    document.getElementById('editCaption').value = fundraiser.CAPTION;
    document.getElementById('editOrganizer').value = fundraiser.ORGANIZER;
    editFormContainer.style.display = 'block';
  }

  // Update a fundraiser
  editForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const updatedFundraiser = {
      caption: document.getElementById('editCaption').value,
      organizer: document.getElementById('editOrganizer').value
    };

    fetch(`http://localhost:3000/fundraisers/${currentEditId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFundraiser)
    })
      .then(response => {
        if (response.ok) {
          loadFundraisers();
          editFormContainer.style.display = 'none';
        } else {
          console.error('Error updating fundraiser');
        }
      });
  });

  // Delete a fundraiser
  function deleteFundraiser(id) {
    fetch(`http://localhost:3000/fundraisers/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          loadFundraisers();
        } else {
          console.error('Error deleting fundraiser');
        }
      });
  }

  // Initialize by loading fundraisers
  loadFundraisers();
});

