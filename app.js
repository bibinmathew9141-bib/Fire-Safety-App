// LOGIN
function login() {
  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if (u === "Tamdeen" && p === "T@mdeen123") {
    localStorage.setItem("login", "1");
    location.href = "home.html";
  } else {
    document.getElementById("err").innerText = "Wrong Login";
  }
}

// CHECK LOGIN
if (location.pathname.includes("home") || location.pathname.includes("systems") || location.pathname.includes("module")) {
  if (localStorage.getItem("login") !== "1") {
    location.href = "index.html";
  }
}

// LOGOUT
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

// MALL CLICK
function goMall(mall) {
  localStorage.setItem("mall", mall);
  location.href = "systems.html";
}

// SYSTEM LIST
const systems = [
  "Fire Alarm Panels",
  "Fire Pumps",
  "Fire Water Tank",
  "FM200 Data Room",
  "Foam System / Generator",
  "Substation LT/HT",
  "Gas Chamber/Tank",
  "Deluge System",
  "Fit-outs",
  "Inspection",
  "Daily Visit",
  "Additional Jobs"
];

if (location.pathname.includes("systems")) {
  let div = document.getElementById("systems");
  let mall = localStorage.getItem("mall");

  systems.forEach(s => {
    let d = document.createElement("div");
    d.className = "card";
    d.innerText = s;
    d.onclick = () => {
      localStorage.setItem("system", s);
      location.href = "module.html";
    };
    div.appendChild(d);
  });
}

// MODULE PAGE
let tab = "daily";

function showTab(t) {
  tab = t;
  loadTable();
}

if (location.pathname.includes("module")) {
  document.getElementById("title").innerText =
    localStorage.getItem("mall") + " - " + localStorage.getItem("system");

  loadTable();
}

// STORAGE KEY
function key() {
  return localStorage.getItem("mall") + "_" + localStorage.getItem("system");
}

// LOAD TABLE
function loadTable() {
  let data = JSON.parse(localStorage.getItem(key()) || "[]");

  let html = `
  <input id="date" value="${new Date().toISOString().split('T')[0]}">
  <input id="tag" placeholder="Tag No">
  <input id="loc" placeholder="Location">
  <input id="status" placeholder="Status">
  <input id="remarks" placeholder="Remarks">
  <input id="shift" placeholder="Shift">
  <button onclick="addData()">Add</button>

  <table>
    <tr>
      <th>Sl</th><th>Date</th><th>Tag</th><th>Location</th><th>Status</th><th>Remarks</th><th>Shift</th>
    </tr>
  `;

  let filtered = data;

  if (tab === "monthly") {
    let month = new Date().getMonth();
    filtered = data.filter(d => new Date(d.date).getMonth() === month);
  }

  if (tab === "yearly") {
    let year = new Date().getFullYear();
    filtered = data.filter(d => new Date(d.date).getFullYear() === year);
  }

  filtered.forEach((d, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${d.date}</td>
      <td>${d.tag}</td>
      <td>${d.loc}</td>
      <td>${d.status}</td>
      <td>${d.remarks}</td>
      <td>${d.shift}</td>
    </tr>`;
  });

  html += "</table>";

  document.getElementById("content").innerHTML = html;
}

// ADD DATA
function addData() {
  let data = JSON.parse(localStorage.getItem(key()) || "[]");

  data.push({
    date: document.getElementById("date").value,
    tag: document.getElementById("tag").value,
    loc: document.getElementById("loc").value,
    status: document.getElementById("status").value,
    remarks: document.getElementById("remarks").value,
    shift: document.getElementById("shift").value
  });

  localStorage.setItem(key(), JSON.stringify(data));
  loadTable();
}
