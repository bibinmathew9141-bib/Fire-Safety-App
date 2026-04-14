/* LOGIN */
function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === "Tamdeen" && p === "T@mdeen123") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "home.html";
    } else {
        document.getElementById("error").innerText = "Invalid Login!";
    }
}

/* NAVIGATION */
function openMall(mall) {
    localStorage.setItem("mall", mall);
    window.location.href = "mall.html";
}

function openSystem(system) {
    localStorage.setItem("system", system);
    window.location.href = "sheet.html";
}

function openSheet(type) {
    localStorage.setItem("sheetType", type);
    window.location.href = "table.html";
}

/* STORAGE KEY */
function getKey() {
    return localStorage.getItem("mall") + "_" + localStorage.getItem("system");
}

/* INIT */
function initPage() {
    let mall = localStorage.getItem("mall");
    let system = localStorage.getItem("system");
    let sheet = localStorage.getItem("sheetType");

    document.getElementById("mallTitle").innerText =
        mall + " - " + system + " (" + sheet.toUpperCase() + ")";

    loadData();
    generateDateFilters(sheet);
}

/* ADD ROW */
function addRow() {
    let table = document.getElementById("dataTable");
    let row = table.insertRow();

    let index = table.rows.length - 1;

    row.innerHTML = `
    <td>${index}</td>
    <td contenteditable="true">${new Date().toISOString().split('T')[0]}</td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td><button onclick="deleteRow(this)">Delete</button></td>
    `;

    saveData();
}

/* DELETE ROW */
function deleteRow(btn) {
    let row = btn.parentElement.parentElement;
    row.remove();
    saveData();
}

/* SAVE */
function saveData() {
    let table = document.getElementById("dataTable");
    let data = [];

    for (let i = 1; i < table.rows.length; i++) {
        let c = table.rows[i].cells;

        data.push({
            date: c[1].innerText,
            tag: c[2].innerText,
            location: c[3].innerText,
            status: c[4].innerText,
            remarks: c[5].innerText,
            shift: c[6].innerText
        });
    }

    localStorage.setItem(getKey(), JSON.stringify(data));
}

/* LOAD */
function loadData() {
    let table = document.getElementById("dataTable");
    let data = JSON.parse(localStorage.getItem(getKey())) || [];

    data.forEach((d, i) => {
        let row = table.insertRow();

        row.innerHTML = `
        <td>${i + 1}</td>
        <td contenteditable="true">${d.date}</td>
        <td contenteditable="true">${d.tag}</td>
        <td contenteditable="true">${d.location}</td>
        <td contenteditable="true">${d.status}</td>
        <td contenteditable="true">${d.remarks}</td>
        <td contenteditable="true">${d.shift}</td>
        <td><button onclick="deleteRow(this)">Delete</button></td>
        `;
    });
}

/* AUTO SAVE */
document.addEventListener("input", e => {
    if (e.target.closest("table")) saveData();
});

/* COLUMN FILTER */
function columnFilter(col, val) {
    let table = document.getElementById("dataTable");

    for (let i = 1; i < table.rows.length; i++) {
        let text = table.rows[i].cells[col].innerText.toLowerCase();

        table.rows[i].style.display =
            text.includes(val.toLowerCase()) ? "" : "none";
    }
}

/* MONTH/YEAR BUTTONS */
function generateDateFilters(type) {
    let data = JSON.parse(localStorage.getItem(getKey())) || [];
    let container = document.getElementById("dynamicFilters");

    let set = new Set();

    data.forEach(d => {
        let dt = new Date(d.date);

        if (type === "monthly") {
            set.add(dt.toLocaleString('default', { month: 'short', year: 'numeric' }));
        }

        if (type === "yearly") {
            set.add(dt.getFullYear());
        }
    });

    set.forEach(v => {
        let b = document.createElement("button");
        b.innerText = v;
        b.onclick = () => applyDateFilter(v, type);
        container.appendChild(b);
    });
}

/* APPLY FILTER */
function applyDateFilter(val, type) {
    let table = document.getElementById("dataTable");

    for (let i = 1; i < table.rows.length; i++) {
        let dt = new Date(table.rows[i].cells[1].innerText);
        let show = false;

        if (type === "monthly") {
            let label = dt.toLocaleString('default', { month: 'short', year: 'numeric' });
            show = (label === val);
        }

        if (type === "yearly") {
            show = (dt.getFullYear().toString() === val.toString());
        }

        table.rows[i].style.display = show ? "" : "none";
    }
}

/* PRINT */
function printPDF() {
    window.print();
}

/* HELP */
function openHelp() {
    window.location.href = "help.html";
}
