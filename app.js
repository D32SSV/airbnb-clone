let userLocation;

window.onload = async () => {
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            userLat = userLocation.lat;
            userLon = userLocation.lng;

        } catch (error) {
            console.error('Error getting user location:', error);
        }
    }
}

// Function to calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI * lat1) / 180;
    const radLon1 = (Math.PI * lon1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const radLon2 = (Math.PI * lon2) / 180;

    // Calculate the differences between the latitudes and longitudes
    const latDiff = radLat2 - radLat1;
    const lonDiff = radLon2 - radLon1;

    // Calculate the distance using the Haversine formula
    const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    // Return the distance in kilometers
    return distance;
}


window.addEventListener("DOMContentLoaded", (event) => {
    const searchButton = document.getElementById("search-button");

    searchButton.addEventListener("click", async () => { // Add async keyword here
        const searchInput = document.getElementById("search-input").value;
        const url = `https://airbnb13.p.rapidapi.com/search-location?location=${searchInput}&checkin=2023-10-10&checkout=2023-10-17&adults=1&children=0&infants=0&pets=0&page=1&currency=USD`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b11cbe8e1amsh3a24518f021d9cdp1e05b9jsnd0b1d1716925',
                'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);

            const listingsContainer = document.getElementById("listings-container");

            // Clear previous listings
            listingsContainer.innerHTML = "";

            // Append new listings
            data.results.forEach(listing => {
                const listingCard = createListingCard(listing);
                listingsContainer.appendChild(listingCard);
            });
        } catch (error) {
            console.error(error);
        }

    });
});

function createListingCard(listing) {

    document.getElementById('hero').style.display = "none";
    let listingLat = listing.lat;
    let listingLon = listing.lng;

    let distance = calculateDistance(userLat, userLon, listingLat, listingLon);
    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card");

    listingCard.innerHTML = `
        <img src="${listing.images[0]}" alt="${listing.name}">
        <div class="listing-info">
            <h2>${listing.name}</h2>
            <p>${listing.type} · ${listing.beds} beds · ${listing.bathrooms} bathrooms</p>
            <p>${listing.price.total} per night</p>
            <p>${listing.city}</p>
            <p>Amenities: ${listing.previewAmenities.join(", ")}</p>
            <p>Distance from you: ${distance.toFixed(2)}km</p>
        </div>
        <div class="map-container">
            <iframe
                width="100%"
                height="300"
                frameborder="0"
                style="border:0"
                src="https://maps.google.com/maps?q=${listing.lat},${listing.lng}&z=15&output=embed"
                allowfullscreen
            ></iframe>
        </div>
    `;

    const listingInfoDiv = listingCard.querySelector(".listing-info");

    const costButton = document.createElement("button");
    costButton.innerText = "Show Booking Cost Breakdown";
    costButton.addEventListener("click", () => showBookingCostBreakdown(listing));
    listingInfoDiv.appendChild(costButton);

    // Add a paragraph for the reviews count and average rating
    const reviewsP = document.createElement("p");
    reviewsP.innerHTML = `Reviews: ${listing.reviewsCount} | Average Rating: ${listing.rating}`;
    listingInfoDiv.appendChild(reviewsP);

    if (listing.isSuperhost) {
        const superhostIndicator = document.createElement("p");
        superhostIndicator.innerText = "Superhost";
        superhostIndicator.style.color = "red";
        listingInfoDiv.appendChild(superhostIndicator);
    }

    if (listing.rareFind) {
        const rareFindIndicator = document.createElement("p");
        rareFindIndicator.innerText = "Rare Find";
        rareFindIndicator.style.color = "green";
        listingInfoDiv.appendChild(rareFindIndicator);
    }

    const directionsButton = document.createElement("button");
    directionsButton.innerText = "Get Directions";
    directionsButton.addEventListener("click", function () {
        openDirections(listing.lat, listing.lng);
    });
    listingInfoDiv.appendChild(directionsButton);

    const moreInfo = document.createElement("button");
    moreInfo.innerText = "More Info";
    moreInfo.addEventListener("click", function () {
        showListing(listing);
    });
    listingInfoDiv.appendChild(moreInfo);

    return listingCard;
}

function showListing(listing) {
    const listingCards = document.querySelectorAll(".listing-card");

    for (const card of listingCards) {
        card.style.display = "none";
    }
    document.getElementById('hero').style.display = "none";
    document.getElementById('listings-container').style.display = "none";
    document.getElementById('card-container').style.display = "none";
    document.getElementById('ins').style.display = "none";
    document.getElementById('dis').style.display = "none";
    document.getElementById('dae').style.display = "none";
    document.getElementById('gc').style.display = "none";
    document.getElementById('hic').style.display = "none";
    document.getElementById('dae').style.display = "none";


    const div = document.getElementById('result');
    div.id = 'h'
    div.innerHTML = `<h2>${listing.name}</h2>
                     <span><p>Average Rating: ${listing.rating} | Reviews: ${listing.reviewsCount}</p>
                     <p>${listing.address}</p></span>

                     `

    if (listing.isSuperhost) {
        const superhostIndicator = document.createElement("p");
        superhostIndicator.innerText = "Superhost";
        superhostIndicator.style.color = "red";
        div.appendChild(superhostIndicator);
    }

    const allImg = document.createElement('div');
    allImg.id = 'allimg';

    allImg.innerHTML = `<div id = "one"><img src="${listing.images[0]}" alt="${listing.name}"></div>
                        <div id="four">
                        <img src="${listing.images[1]}" alt="${listing.name}">
                        <img src="${listing.images[2]}" alt="${listing.name}">
                        <img src="${listing.images[3]}" alt="${listing.name}">
                        <img src="${listing.images[4]}" alt="${listing.name}">
                        <img src="${listing.images[5]}" alt="${listing.name}">
                        <img src="${listing.images[6]}" alt="${listing.name}">
                        </div>    
    `
    div.appendChild(allImg);

    const typeH = document.createElement('div');
    typeH.id = 'typeH'
    typeH.innerHTML = `<div><h2>${listing.type}</h2> 
                    <p>${listing.beds} beds · ${listing.bathrooms} bathrooms</p>
                    <h4>${listing.previewAmenities[0]}</h4>
                    <h4>${listing.previewAmenities[1]}</h4>
                    <h4>${listing.previewAmenities[2]}</h4>
                    <h4>${listing.cancelPolicy}</h4> 
                    <p>Rate: ${listing.price.rate}${listing.price.currency} per night</p>
                    </div>
                                     
                    `
    div.appendChild(typeH);

    const sleep = document.createElement('div');
    sleep.id = 'sleep'
    sleep.innerHTML = `<h2>Where you'll sleep</h2>
                        <img src="${listing.images[0]}" alt="${listing.name}">
        `
    typeH.appendChild(sleep);

    const mp = document.createElement('div');
    mp.id = 'mp'
    mp.innerHTML = `<h2>Where you'll be</h2>
                    <div class="map-container">
                    <iframe
                        width="100%"
                        height="500"
                        frameborder="0"
                        style="border:0"
                        src="https://maps.google.com/maps?q=${listing.lat},${listing.lng}&z=15&output=embed"
                        allowfullscreen
                    ></iframe>
                </div>
        `
    div.appendChild(mp);
}

function openDirections(propertyLat, propertyLon) {
    // Open Google Maps directions in a new tab
    const url = `https://www.google.com/maps/dir/${userLat},${userLon}/${propertyLat},${propertyLon}`;
    window.open(url, "_blank");
}

function createAmenitiesPreview(amenities) {
    // Show the first 3 amenities and the total count
    const previewAmenities = amenities.slice(0, 3);
    let previewText = previewAmenities.join(", ");

    if (amenities.length > 3) {
        const extraCount = amenities.length - 3;
        previewText += `, and ${extraCount} more`;
    }

    return previewText;
}


function showBookingCostBreakdown(listing) {
    // Calculate additional fees and total cost
    const additionalFees = listing.price.rate * 0.10; // Assuming additional fees are 10% of base price
    const totalCost = listing.price.rate + additionalFees;

    // Create a modal dialog box
    const modal = document.createElement("div");
    modal.style.display = "block";
    modal.style.width = "300px";
    modal.style.height = "200px";
    modal.style.backgroundColor = "#fff";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

    // Add booking cost breakdown to the modal
    modal.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Rate: $${listing.price.rate.toFixed(2)}</p>
        <p>Additional Fees: $${additionalFees.toFixed(2)}</p>
        <p>Total Cost: $${totalCost.toFixed(2)}</p>
    `;

    // Add a close button to the modal
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeButton);

    // Add the modal to the body
    document.body.appendChild(modal);
}





