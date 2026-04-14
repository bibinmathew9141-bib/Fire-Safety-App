
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

/* RESET TABLE */
document.getElementById("dataTable").innerHTML=`
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

load();
applyMode();
buildColumnFilters();

}

/* ================= DATA KEY ================= */

function getBaseKey(){
return localStorage.getItem("mall") + "_data";
}

/* ================= MODE ================= */

function getMode(){
return localStorage.getItem("sheet") || "daily";
}

/* ================= APPLY MODE ================= */

function applyMode(){

let mode=getMode();
let btn=document.getElementById("addBtn");

if(btn){
btn.style.display = (mode==="daily") ? "inline-block" : "none";
}

}

/* ================= ADD ROW ================= */

function addRow(){

if(getMode()!=="daily") return;

let t=document.getElementById("dataTable");

let r=t.insertRow();

r.innerHTML=`
<td>${t.rows.length-1}</td>
<td contenteditable>${formatDate(new Date())}</td>
<td contenteditable></td>
<td contenteditable></td>
<td contenteditable></td>
<td contenteditable></td>
<td contenteditable></td>
<td><button onclick="del(this)">X</button></td>
`;

save();

}

/* ================= DELETE ================= */

function del(btn){
btn.parentElement.parentElement.remove();
save();
}

/* ================= SAVE ================= */

function save(){

let t=document.getElementById("dataTable");
let data=[];

for(let i=1;i<t.rows.length;i++){

let c=t.rows[i].cells;

data.push({
date:c[1].innerText,
tag:c[2].innerText,
location:c[3].innerText,
status:c[4].innerText,
remarks:c[5].innerText,
shift:c[6].innerText
});

}

localStorage.setItem(getBaseKey(),JSON.stringify(data));

}

/* ================= LOAD ================= */

function load(){

let t=document.getElementById("dataTable");
let data=JSON.parse(localStorage.getItem(getBaseKey())||"[]");

let mode=getMode();

/* DAILY VIEW */
if(mode==="daily"){

data.forEach((d,i)=>{

let r=t.insertRow();

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

return;
}

/* MONTHLY + YEARLY VIEW */
buildGrouped(data,mode);

}

/* ================= GROUP VIEW ================= */

function buildGrouped(data,mode){

let t=document.getElementById("dataTable");

let title = (mode==="monthly") ? "Month" : "Year";

t.innerHTML=`
<tr>
<th>Sl</th>
<th>${title}</th>
<th>Total Records</th>
</tr>
`;

let map={};

data.forEach(d=>{

let dt=new Date(d.date);
if(isNaN(dt)) return;

let key =
mode==="monthly"
? dt.toLocaleString('en-US',{month:'short',year:'numeric'})
: dt.getFullYear();

map[key]=(map[key]||0)+1;

});

let i=1;

for(let k in map){

let r=t.insertRow();

r.innerHTML=`
<td>${i++}</td>
<td>${k}</td>
<td>${map[k]}</td>
`;

}

}

/* ================= DATE FORMAT ================= */

function formatDate(d){
let dt=new Date(d);
let day=String(dt.getDate()).padStart(2,'0');
let mon=dt.toLocaleString('en-US',{month:'short'});
let yr=String(dt.getFullYear()).slice(-2);
return `${day}-${mon}-${yr}`;
}

/* ================= COLUMN FILTERS (EXCEL STYLE) ================= */

let filters={};

function buildColumnFilters(){

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

/* ================= EXPORT ================= */

function exportExcel(){

let t=document.getElementById("dataTable");
let csv="Tamdeen Group\n\n";

for(let i=0;i<t.rows.length;i++){

let row=[];

for(let j=0;j<t.rows[i].cells.length-1;j++){
row.push(t.rows[i].cells[j].innerText);
}

csv+=row.join(",")+"\n";

}

let a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([csv]));
a.download="report.csv";
a.click();

}

/* ================= PRINT ================= */

function printPDF(){
window.print();
}
