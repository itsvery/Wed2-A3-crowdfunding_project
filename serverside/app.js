document.addEventListener('DOMContentLoaded', function () {
    const fundraiserTable = document.getElementById('fundraisers-list');

    // Load all fundraisers
    function loadFundraisers() {
        fetch('http://localhost:3000/fundraisers')
            .then(response => response.json())
            .then(data => {
                fundraiserTable.innerHTML = '';
                data.forEach(fundraiser => {
                    const div = document.createElement('div');
                    div.classList.add('fundraiser');
                    div.innerHTML = `
                        <h3>${fundraiser.CAPTION}</h3>
                        <p>Organizer: ${fundraiser.ORGANIZER}</p>
                        <p>City: ${fundraiser.CITY}</p>
                        <p>Category: ${fundraiser.CATEGORY_NAME}</p>
                        <p>Target: ${fundraiser.TARGET_FUNDING} AUD</p>
                        <p>Raised: ${fundraiser.CURRENT_FUNDING} AUD</p>
                        <button onclick="editFundraiser(${fundraiser.FUNDRAISER_ID})">Edit</button>
                        <button onclick="deleteFundraiser(${fundraiser.FUNDRAISER_ID})">Delete</button>
                    `;
                    fundraiserTable.appendChild(div);
                });
            })
            .catch(error => console.error('Error fetching fundraisers:', error));
    }

    // Add a new fundraiser
    window.validateForm1 = function () {
        const ORGANIZER = document.getElementById('organizer').value.trim();
        const CAPTION = document.getElementById('caption').value.trim();
        const TARGET = document.getElementById('target').value;
        const CURRENT = document.getElementById('current').value;
        const CITY = document.getElementById('city').value.trim();
        const ACTIVE = document.getElementById('active').value;
        const CATEGORY_ID = document.getElementById('category').value;

        if (!ORGANIZER || !CAPTION || !TARGET || !CURRENT || !CITY || !ACTIVE || !CATEGORY_ID) {
            alert("All fields are required!");
            return;
        }

        const postData = {
            'ORGANIZER': ORGANIZER,
            'CAPTION': CAPTION,
            'TARGET_FUNDING': TARGET,
            'CURRENT_FUNDING': CURRENT,
            'CITY': CITY,
            'ACTIVE': ACTIVE,
            'CATEGORY_ID': CATEGORY_ID
        };

        fetch('http://localhost:3000/fundraisers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.insert === 'success') {
                    alert("Fundraiser added successfully!");
                    document.getElementById('form1').reset();
                    loadFundraisers();
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    }

    // Edit a fundraiser
    window.editFundraiser = function (id) {
        const fundraiser = data.find(f => f.FUNDRAISER_ID === id);
        document.getElementById('fundraiser-id').value = fundraiser.FUNDRAISER_ID;
        document.getElementById('organizer-update').value = fundraiser.ORGANIZER;
        document.getElementById('caption-update').value = fundraiser.CAPTION;
        document.getElementById('target-update').value = fundraiser.TARGET_FUNDING;
        document.getElementById('current-update').value = fundraiser.CURRENT_FUNDING;
        document.getElementById('city-update').value = fundraiser.CITY;
        document.getElementById('active-update').value = fundraiser.ACTIVE;
        document.getElementById('category-update').value = fundraiser.CATEGORY_ID;
        document.getElementById('editFormContainer').style.display = 'block';
    }

    // Update a fundraiser
    window.validateForm2 = function () {
        const FUNDRAISER_ID = document.getElementById('fundraiser-id').value.trim();
        const ORGANIZER = document.getElementById('organizer-update').value.trim();
        const CAPTION = document.getElementById('caption-update').value.trim();
        const TARGET = document.getElementById('target-update').value.trim();
        const CURRENT = document.getElementById('current-update').value.trim();
        const CITY = document.getElementById('city-update').value.trim();
        const ACTIVE = document.getElementById('active-update').value;
        const CATEGORY_ID = document.getElementById('category-update').value;

        if (!FUNDRAISER_ID || !ORGANIZER || !CAPTION || !TARGET || !CURRENT || !CITY || !ACTIVE || !CATEGORY_ID) {
            alert("All fields are required!");
            return;
        }

        const postData = {
            'ORGANIZER': ORGANIZER,
            'CAPTION': CAPTION,
            'TARGET_FUNDING': TARGET,
            'CURRENT_FUNDING': CURRENT,
            'CITY': CITY,
            'ACTIVE': ACTIVE,
            'CATEGORY_ID': CATEGORY_ID
        };

        fetch(`http://localhost:3000/fundraisers/${FUNDRAISER_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.update === 'success') {
                    alert("Fundraiser updated successfully!");
                    document.getElementById('editFormContainer').style.display = 'none';
                    loadFundraisers();
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    }

    // Delete a fundraiser
    window.deleteFundraiser = function (id) {
        fetch(`http://localhost:3000/fundraisers/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.delete === 'success') {
                    alert("Fundraiser deleted successfully!");
                    loadFundraisers();
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    }

    // Initialize by loading fundraisers
    loadFundraisers();
});
