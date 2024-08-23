import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcwlOmF9HIk3_24aKNHkJjT6FPQiwy2Mo",
    authDomain: "hacker-s-portal.firebaseapp.com",
    projectId: "hacker-s-portal",
    storageBucket: "hacker-s-portal.appspot.com",
    messagingSenderId: "848457459024",
    appId: "1:848457459024:web:7ed2c2dcd7624d39a03855",
    measurementId: "G-3D11Q02VRT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var id = null;

// Elements from the HTML
let submit = document.getElementById("Submit");
let textbox = document.getElementById('name');
let datetime = document.getElementById("date");
let duration = document.getElementById("duration");
let decs = document.getElementById("decs");
let price = document.getElementById("price");
let min = document.getElementById("min");
let max = document.getElementById("max");
let tableBody = document.getElementById('tableBody');
let tableBody2 = document.getElementById('tableBody2');
let newEntry = document.getElementById('CreateNew');
let imfo = document.getElementById('hide');
let winnerNameInput = document.getElementById('first');
let runnerUpNameInput = document.getElementById('second');
let updateResultsButton = document.getElementById('updateResults');

// Event listener for the submit button
submit.addEventListener('click', async function (e) {
    e.preventDefault();
    try {
        await addDoc(collection(db, "hackathons"), {
            title: textbox.value,
            min: min.value,
            max: max.value,
            decs: decs.value,
            date: datetime.value,
            prize: price.value,
            duration: duration.value,
        });
        alert("Post successful");
        // Clear form fields after submission
        textbox.value = '';
        datetime.value = '';
        decs.value = '';
        max.value = '';
        min.value = '';
        price.value = '';
        duration.value = '';
        
        fetchData(); // Fetch data again after submitting a new entry
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

// Function to fetch data from Firestore
async function fetchData() {
    tableBody.innerHTML = ""; // Clear existing table rows
    try {
        const querySnapshot = await getDocs(collection(db, "hackathons"));
        querySnapshot.forEach((doc) => {
            appendElement([doc.id, doc.data()]);
        });
    } catch (e) {
        console.error("Error getting documents: ", e);
    }
}

let i = 0;

// Function to append a new row to the table
function appendElement(item) {
    let itemId = item[0];
    let itemValue = item[1];
    let tr = document.createElement('tr');

    let srtd = document.createElement('td');
    srtd.textContent = ++i;
    tr.appendChild(srtd);

    let nameTd = document.createElement('td');
    nameTd.textContent = itemValue.title;
    tr.appendChild(nameTd);

    let dateTd = document.createElement('td');
    dateTd.textContent = itemValue.date;
    tr.appendChild(dateTd);

    let priceTd = document.createElement('td');
    priceTd.textContent = itemValue.prize;
    tr.appendChild(priceTd);

    let view = document.createElement('td');
    let viewButton = document.createElement('button');
    viewButton.classList.add('view');
    viewButton.setAttribute('data-id', itemId); // Add document ID as data attribute
    viewButton.innerHTML = '<ion-icon name="eye-outline"></ion-icon>';
    view.appendChild(viewButton);
    tr.appendChild(view);

    // Event listener for view button click
    viewButton.addEventListener('click', async function () {
        let docId = viewButton.getAttribute('data-id');
        console.log("View details for document ID: ", docId);
        id = docId;
    
        // Fetch and display team names
        await displayTeamNames(docId);
    
        // Extra smooth scroll to the bottom
        extraSmoothScrollTo(document.body.scrollHeight, 1500); // 1500ms for duration, adjust as needed
    });
    
    function extraSmoothScrollTo(targetPosition, duration) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;
    
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, progress);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
    
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }
    
        requestAnimationFrame(animation);
    }
    

    // Double-click to delete the row and the document from Firestore
    tr.addEventListener("dblclick", async function () {
        try {
            await deleteDoc(doc(db, "hackathons", itemId));
            console.log("Document successfully deleted!");
            fetchData(); // Fetch data again after deleting an entry
        } catch (e) {
            console.error("Error removing document: ", e);
        }
    });

    tableBody.appendChild(tr);
}

// Event listener to toggle form visibility
newEntry.addEventListener("click", () => {
    // imfo.classList.toggle("hide");
    imfo.style.display = 'inline-block'
    console.log(imfo)
});

// Fetch data on page load
fetchData();

// Function to display team names in the second table
async function displayTeamNames(hackathonId) {
    tableBody2.innerHTML = ""; // Clear existing team rows

    try {
        const teamsCollectionRef = collection(db, "hackathons", hackathonId, "teams");
        const querySnapshot = await getDocs(teamsCollectionRef);

        let index = 1;
        querySnapshot.forEach((doc) => {
            let tr = document.createElement('tr');

            let indexTd = document.createElement('td');
            indexTd.textContent = index++;
            tr.appendChild(indexTd);

            let playerTd = document.createElement('td');
            playerTd.textContent = doc.data().teamname || ''; // Adjust according to your data structure
            tr.appendChild(playerTd);

            let githubLinkTd = document.createElement('td');
            let githubLink = doc.data().link || ''; // Adjust according to your data structure

            // Shorten the GitHub link to "username/repository"
            const urlParts = githubLink.split('/');
            const shortenedLink = urlParts.length > 3 ? `${urlParts[3]}/${urlParts[4]}` : githubLink;

            githubLinkTd.innerHTML = `<a href="${githubLink}" target="_blank">${shortenedLink}</a>`;
            tr.appendChild(githubLinkTd);

            let winnersTd = document.createElement('td');
            // Display winner and runner-up status
            winnersTd.textContent = doc.data().isWinner ? 'Winner' : doc.data().isRunnerUp ? 'Runner-Up' : 'Not a Winner';

            tr.appendChild(winnersTd);

            tableBody2.appendChild(tr);
        });
    } catch (e) {
        console.error("Error getting team documents: ", e);
    }
}

// Update Firestore with winner and runner-up information
async function updateWinnerAndRunnerUp(hackathonId, winnerName, runnerUpName) {
    try {
        const teamsCollectionRef = collection(db, "hackathons", hackathonId, "teams");
        const querySnapshot = await getDocs(teamsCollectionRef);
        
        let winnerId = '';
        let runnerUpId = '';

        // Find the team IDs for the winner and runner-up
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.teamname === winnerName) {
                winnerId = doc.id;
            } else if (data.teamname === runnerUpName) {
                runnerUpId = doc.id;
            }
        });

        // Update the hackathon document with winner and runner-up IDs
        await setDoc(doc(db, "hackathons", hackathonId), {
            winner: winnerId,
            runnerup: runnerUpId
        }, { merge: true });

        // Update the teams collection with winner and runner-up status
        await setDoc(doc(db, "hackathons", hackathonId, "teams", winnerId), {
            isWinner: true,
            position : 1
        }, { merge: true });

        await setDoc(doc(db, "hackathons", hackathonId, "teams", runnerUpId), {
            isRunnerUp: true,
            position : 2

        }, { merge: true });

        alert("Update successful");
        fetchData(); // Refresh the table after updating
        displayTeamNames(hackathonId); // Refresh the team names table
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}

// Event listener for update results button
updateResultsButton.addEventListener('click', async function () {
    const hackathonId = id; // Ensure `id` holds the current hackathon ID
    const winnerName = winnerNameInput.value;
    const runnerUpName = runnerUpNameInput.value;

    if (hackathonId && (winnerName || runnerUpName)) {
        await updateWinnerAndRunnerUp(hackathonId, winnerName, runnerUpName);
    } else {
        alert("Please select a hackathon and enter the team names.");
    }
});

let serachTab = document.getElementById('search');
serachTab.addEventListener('input', search());

function search() {
      var text = document.getElementById('search').value;
      const tr = document.getElementsByTagName('tr');
      for (let i = 1; i < tr.length; i++) {
            const playerName = tr[i].children[1].children[0].innerHTML.toLowerCase();
            const participantId = tr[i].children[2].children[0].innerHTML.toLowerCase();
            if (!playerName.includes(text.toLowerCase()) && !participantId.includes(text.toLowerCase())) {
                  tr[i].style.display = 'none';
            } else {
                  tr[i].style.display = '';
            }
      }
}
