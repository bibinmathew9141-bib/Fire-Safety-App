
/* ================= NAVIGATION ================= */

function openMall(m){
localStorage.setItem("mall",m);
window.location="mall.html";
}

function openSystem(s){
localStorage.setItem("system",s);
window.location="sheet.html";
}

function openSheet(type){
localStorage.setItem("sheet",type);
location.reload();
}

/* ================= INIT ================= */

function initPage(){

document.getElementById("mallHeader").innerText =
localStorage.getItem("mall") || "Tamdeen Group";

render();
applyMode();
buildFilters();

}

/* ================= STORAGE KEY ================= */

function getKey(){
return localStorage.getItem("mall") + "_data";
}

/* ================= MODE ================= */

function getMode(){
return localStorage.getItem("sheet") || "daily";
}

/* ================= GET DATA ================= */

function getData(){
return JSON.parse(localStorage.getItem(getKey()) || "[]");
}

/* ================= SAVE DATA ================= */

function saveData(data){
localStorage.setItem(getKey(),JSON.stringify(data));
}

/* ================= RENDER ENGINE ================= */

function render(){

let mode=getMode();
let data=getData();

let table=document.getElementById("dataTable");

/* RESET */
table.innerHTML="";

/* ================= DAILY ================= */

if(mode==="daily"){

table.innerHTML=`
<tr>
<th>Sl</th>
<th>Date</th>
<th>Tag</th>
<th>Location</th>
<th>Status</th>
<th>Remarks</th>
<th>Shift</th>
<th>Action</th>
</tr>
`;

data.forEach((d,i)=>{

let r=table.insertRow();

r.innerHTML=`
<td>${i+1}</td>
<td contenteditable>${d.date}</td>
<td contenteditable>${d.tag}</td>
<td contenteditable>${d.location}</td>
<td contenteditable>${d.status}</td>
<td contenteditable>${d.remarks}</td>
<td contenteditable>${d.shift}</td>
<td><button onclick="del(this)">X</button></td>
`;

});

}

/* ================= MONTHLY ================= */

if(mode==="monthly"){

table.innerHTML=`
<tr>
<th>Sl</th>
<th>Month</th>
<th>Total Records</th>
</tr>
`;

let map={};

data.forEach(d=>{

if(!d.date) return;

let parts=d.date.split("-");
if(parts.length<2) return;

/* SAFE MONTH KEY */
let key = parts[1] + "-" + parts[2];

map[key]=(map[key]||0)+1;

});

let i=1;

for(let k in map){

let r=table.insertRow();

r.innerHTML=`
<td>${i++}</td>
<td>${k}</td>
<td>${map[k]}</td>
`;

}

}

/* ================= YEARLY ================= */

if(mode==="yearly"){

table.innerHTML=`
<tr>
<th>Sl</th>
<th>Year</th>
<th>Total Records</th>
</tr>
`;

let map={};

data.forEach(d=>{

if(!d.date) return;

let parts=d.date.split("-");
if(parts.length<3) return;

let year = parts[2];

map[year]=(map[year]||0)+1;

});

let i=1;

for(let k in map){

let r=table.insertRow();

r.innerHTML=`
<td>${i++}</td>
<td>${k}</td>
<td>${map[k]}</td>
`;

}

}

}

/* ================= MODE APPLY ================= */

function applyMode(){

let btn=document.getElementById("addBtn");

if(btn){
btn.style.display = (getMode()==="daily") ? "inline-block" : "none";
}

}

/* ================= ADD ROW ================= */

function addRow(){

if(getMode()!=="daily") return;

let data=getData();

data.push({
date:formatDate(new Date()),
tag:"",
location:"",
status:"",
remarks:"",
shift:""
});

saveData(data);
render();

}

/* ================= DELETE ================= */

function del(btn){

let row=btn.parentElement.parentElement;
let index=row.rowIndex-1;

let data=getData();
data.splice(index,1);

saveData(data);
render();

}

/* ================= FORMAT DATE ================= */

function formatDate(d){

let dt=new Date(d);

let day=String(dt.getDate()).padStart(2,'0');
let mon=dt.toLocaleString('en-US',{month:'short'});
let yr=String(dt.getFullYear()).slice(-2);

return `${day}-${mon}-${yr}`;
}

/* ================= COLUMN FILTER (SIMPLE + SAFE) ================= */

let filters={};

function buildFilters(){

if(getMode()!=="daily") return;

let table=document.getElementById("dataTable");

let old=document.getElementById("filterRow");
if(old) old.remove();

let row=table.insertRow(1);
row.id="filterRow";

let cols=table.rows[0].cells.length;

for(let i=0;i<cols;i++){

let cell=row.insertCell(i);

if(i===0 || i===cols-1){
cell.innerHTML="";
continue;
}

let input=document.createElement("input");
input.placeholder="Filter";
input.style.width="90%";
input.style.fontSize="12px";

input.oninput=function(){
filters[i]=this.value.toLowerCase();
applyFilters();
};

cell.appendChild(input);

}

}

function applyFilters(){

let table=document.getElementById("dataTable");

for(let i=2;i<table.rows.length;i++){

let row=table.rows[i];
let show=true;

for(let col in filters){

let val=filters[col];
if(!val) continue;

let cell=row.cells[col];
if(!cell) continue;

if(!cell.innerText.toLowerCase().includes(val)){
show=false;
break;
}

}

row.style.display=show?"":"none";

}

}
