/* 🔐 LOGIN */
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "Tamdeen" && pass === "T@mdeen123") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "home.html";
    } else {
        document.getElementById("error").innerText = "Invalid Login!";
    }
}

/* 🏢 SELECT MALL */
function openMall(mall) {
    localStorage.setItem("mall", mall);
    window.location.href = "mall.html";
}

/* ⚙️ SELECT SYSTEM */
function openSystem(system) {
    localStorage.setItem("system", system);
    window.location.href = "sheet.html";
}

/* 📊 SELECT SHEET */
function openSheet(type) {
    localStorage.setItem("sheetType", type);
    window.location.href = "table.html";
}

/* 🔑 GET STORAGE KEY */
function getKey() {
    let mall = localStorage.getItem("mall");
    let system = localStorage.getItem("system");
    return mall + "_" + system;
}

/* ➕ ADD ROW */
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
    `;

    saveData();
}

/* 💾 SAVE DATA */
function saveData() {
    let table = document.getElementById("dataTable");
    let data = [];

    for (let i = 1; i < table.rows.length; i++) {
        let cells = table.rows[i].cells;
        data.push({
            sl: cells[0].innerText,
            date: cells[1].innerText,
            tag: cells[2].innerText,
            location: cells[3].innerText,
            status: cells[4].innerText,
            remarks: cells[5].innerText,
            shift: cells[6].innerText
        });
    }

    localStorage.setItem(getKey(), JSON.stringify(data));
}

/* 📥 LOAD DATA */
function loadData() {
    let table = document.getElementById("dataTable");
    let data = JSON.parse(localStorage.getItem(getKey())) || [];

    data.forEach((item, index) => {
        let row = table.insertRow();

        row.innerHTML = `
            <td>${index + 1}</td>
            <td contenteditable="true">${item.date}</td>
            <td contenteditable="true">${item.tag}</td>
            <td contenteditable="true">${item.location}</td>
            <td contenteditable="true">${item.status}</td>
            <td contenteditable="true">${item.remarks}</td>
            <td contenteditable="true">${item.shift}</td>
        `;
    });
}

/* 🔄 AUTO SAVE ON EDIT */
document.addEventListener("input", function (e) {
    if (e.target.closest("table")) {
        saveData();
    }
});

/* 🔍 FILTER (MONTH/YEAR) */
function filterData() {
    let filter = document.getElementById("filter").value;
    let table = document.getElementById("dataTable");

    for (let i = 1; i < table.rows.length; i++) {
        let date = table.rows[i].cells[1].innerText;

        if (date.includes(filter) || filter === "") {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }
    }
}

/* 📄 PRINT PDF */
function printPDF() {
    window.print();
}
