// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB-nxvyQIV6TRs60cmFjB7hplCwgY8SwEI",
    authDomain: "e-data-6ca63.firebaseapp.com",
    projectId: "e-data-6ca63",
    storageBucket: "e-data-6ca63.firebasestorage.app",
    messagingSenderId: "76571848548",
    appId: "1:76571848548:web:fa52ee1a390e7d49031471"
  };
  
  // Init Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Add Member
  document.getElementById("memberForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const member = {
      name: document.getElementById("name").value,
      joiningDate: document.getElementById("joiningDate").value,
      phone: document.getElementById("phone").value,
      bloodGroup: document.getElementById("bloodGroup").value,
      memberId: document.getElementById("memberId").value
    };
    await db.collection("members").add(member);
    e.target.reset();
    loadMembers();
  });
  
  // Load Members
  async function loadMembers() {
    const snapshot = await db.collection("members").get();
    const container = document.getElementById("memberCards");
    container.innerHTML = "";
  
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card">
          <div class="card-body">
            <input class="form-control mb-2" value="${data.name}" data-id="${doc.id}" data-field="name">
            <input class="form-control mb-2" value="${data.joiningDate}" data-id="${doc.id}" data-field="joiningDate" type="date">
            <input class="form-control mb-2" value="${data.phone}" data-id="${doc.id}" data-field="phone">
            <input class="form-control mb-2" value="${data.bloodGroup}" data-id="${doc.id}" data-field="bloodGroup">
            <input class="form-control mb-2" value="${data.memberId}" data-id="${doc.id}" data-field="memberId">
            <button class="btn btn-success w-100" onclick="updateMember('${doc.id}')">Save</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  async function updateMember(id) {
    const inputs = document.querySelectorAll(`[data-id="${id}"]`);
    const updatedData = {};
    inputs.forEach(input => {
      updatedData[input.dataset.field] = input.value;
    });
    await db.collection("members").doc(id).update(updatedData);
    alert("Member updated!");
  }
  
  window.onload = loadMembers;

  async function searchMember() {
    const name = document.getElementById("searchName").value.trim();
    if (!name) return;
  
    const snapshot = await db.collection("members").where("name", "==", name).limit(9).get();
    const container = document.getElementById("memberCards");
    container.innerHTML = "";
  
    if (snapshot.empty) {
      container.innerHTML = `<p>No member found with name: ${name}</p>`;
      return;
    }
  
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card">
          <div class="card-body">
            <input class="form-control mb-2" value="${data.name}" data-id="${doc.id}" data-field="name">
            <input class="form-control mb-2" value="${data.joiningDate}" data-id="${doc.id}" data-field="joiningDate" type="date">
            <input class="form-control mb-2" value="${data.phone}" data-id="${doc.id}" data-field="phone">
            <input class="form-control mb-2" value="${data.bloodGroup}" data-id="${doc.id}" data-field="bloodGroup">
            <input class="form-control mb-2" value="${data.memberId}" data-id="${doc.id}" data-field="memberId">
            <button class="btn btn-success w-100" onclick="updateMember('${doc.id}')">Save</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  let lastVisible = null;
let firstVisible = null;
let pageStack = []; // for tracking previous pages

async function loadMembers(direction = "initial") {
  const container = document.getElementById("memberCards");
  container.innerHTML = "";

  let query = db.collection("members").orderBy("name").limit(9);

  if (direction === "next" && lastVisible) {
    query = query.startAfter(lastVisible);
  } else if (direction === "prev" && pageStack.length > 1) {
    pageStack.pop(); // remove current page
    const prevDoc = pageStack[pageStack.length - 1];
    query = query.startAt(prevDoc);
  }

  const snapshot = await query.get();

  if (snapshot.empty) {
    container.innerHTML = "<p>No more members found.</p>";
    document.getElementById("nextBtn").disabled = true;
    return;
  }

  firstVisible = snapshot.docs[0];
  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  snapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <input class="form-control mb-2" value="${data.name}" data-id="${doc.id}" data-field="name">
          <input class="form-control mb-2" value="${data.joiningDate}" data-id="${doc.id}" data-field="joiningDate" type="date">
          <input class="form-control mb-2" value="${data.phone}" data-id="${doc.id}" data-field="phone">
          <input class="form-control mb-2" value="${data.bloodGroup}" data-id="${doc.id}" data-field="bloodGroup">
          <input class="form-control mb-2" value="${data.memberId}" data-id="${doc.id}" data-field="memberId">
          <button class="btn btn-success w-100" onclick="updateMember('${doc.id}')">Save</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Update page stack
  if (direction === "next") {
    pageStack.push(firstVisible);
  } else if (direction === "initial") {
    pageStack = [firstVisible];
  }

  // Enable/disable buttons
  document.getElementById("prevBtn").disabled = pageStack.length <= 1;
  document.getElementById("nextBtn").disabled = snapshot.size < 9;
}

// Handle next page
function nextPage() {
  loadMembers("next");
}

// Handle previous page
function prevPage() {
  loadMembers("prev");
}

window.onload = () => {
  loadMembers();
};

  
  


  