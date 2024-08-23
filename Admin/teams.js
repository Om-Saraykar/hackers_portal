
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {ID} from './Admin.js';

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

document.addEventListener('DOMContentLoaded', () => {
      const submit = document.getElementById("Submit");
      const textbox = document.getElementById('name');
      const datetime = document.getElementById("date");
      const duration = document.getElementById("duration");
      const decs = document.getElementById("decs");
      const price = document.getElementById("price");
      const min = document.getElementById("min");
      const max = document.getElementById("max");
      const tableBody = document.getElementById('tableBody');

      // Fetch hackathon ID from Admin.js
      let hackathonId = ID();
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

      async function fetchData() {
            tableBody.innerHTML = ""; // Clear existing table rows
            try {
                  const querySnapshot = await getDocs(collection(db, "hackathons"));
                  querySnapshot.forEach((doc) => {
                        appendElement([doc.id, doc.data()]);
                  });
                  i = 0;
            } catch (e) {
                  console.error("Error getting documents: ", e);
            }
      }

      let i = 0;

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

            tableBody.appendChild(tr);

            viewButton.addEventListener('click', async function () {
                  id = viewButton.getAttribute('data-id');
                  await displayTeamNames(id); // Fetch and display team names
            });
      }

      async function displayTeamNames(hackathonId) {
            const teamsTableBody = document.querySelector('table tbody');
            teamsTableBody.innerHTML = ""; // Clear existing team rows

            try {
                  const teamsCollectionRef = collection(db, "hackathons", hackathonId, "teams");
                  const querySnapshot = await getDocs(teamsCollectionRef);

                  let index = 1;
                  querySnapshot.forEach((doc) => {
                        let tr = document.createElement('tr');

                        let srtd = document.createElement('td');
                        srtd.textContent = index++;
                        tr.appendChild(srtd);

                        let nameTd = document.createElement('td');
                        nameTd.textContent = doc.data().name;
                        tr.appendChild(nameTd);

                        let participantIdTd = document.createElement('td');
                        participantIdTd.textContent = doc.data().participantId; // Assuming you have participantId field
                        tr.appendChild(participantIdTd);

                        let githubTd = document.createElement('td');
                        githubTd.textContent = doc.data().githubLink; // Assuming you have githubLink field
                        tr.appendChild(githubTd);

                        let winnersTd = document.createElement('td');
                        let checkbox = document.createElement('input');
                        checkbox.type = "checkbox";
                        checkbox.id = `checkbox${index}`;
                        winnersTd.appendChild(checkbox);
                        tr.appendChild(winnersTd);

                        teamsTableBody.appendChild(tr);
                  });
            } catch (e) {
                  console.error("Error getting documents: ", e);
            }
      }

      // Initial fetch of hackathons
      fetchData();
});


let serachTab = document.getElementById('search');
addEventListener('input', search());

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