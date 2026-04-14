
/* ================= NAVIGATION ================= */

function openMall(m){
localStorage.setItem("mall",m);
window.location="mall.html";
}

function openSystem(s){
localStorage.setItem("system",s);
window.location="table.html";
}

function openSheet(t){
localStorage.setItem("sheet",t);
window.location="table.html";
}

/* ================= GLOBAL FILTER STORE ================= */

let activeFilters = {};

/* ================= INIT ================= */

function initPage(){

document.getElementById("mallHeader").innerText =
localStorage.getItem("mall") || "";

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
generateFilters();

/* ⭐ MUST BE LAST (IMPORTANT FIX) */
setTimeout(()=>{
addColumnFilters();
},100);

}

/* ================= MODE CONTROL ================= */

function applyMode(){

let type=localStorage.getItem("sheet");

let addBtn=document.getElementById("addBtn");
let actionHead=document.getElementById("actionHead");

if(type==="daily"){
if(addBtn) addBtn.style.display="inline-block";
if(actionHead) actionHead.style.display="table-cell";
}else{
if(addBtn) addBtn.style.display="none";
if(actionHead) actionHead.style.display="none";
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

/* ================= ADD ROW (ONLY DAILY) ================= */

function addRow(){

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

data.push([
c[1].innerText,
c[2].innerText,
c[3].innerText,
c[4].innerText,
c[5].innerText,
c[6].innerText
]);

}

localStorage.setItem(getKey(),JSON.stringify(data));

}

/* ================= LOAD ================= */

function load(){

let t=document.getElementById("dataTable");
let data=JSON.parse(localStorage.getItem(getKey())||"[]");

data.forEach((d,i)=>{

let r=t.insertRow();

r.innerHTML=`
<td>${i+1}</td>
<td contenteditable>${d[0]}</td>
<td contenteditable>${d[1]}</td>
<td contenteditable>${d[2]}</td>
<td contenteditable>${d[3]}</td>
<td contenteditable>${d[4]}</td>
<td contenteditable>${d[5]}</td>
<td><button onclick="del(this)">X</button></td>
`;

});

}

/* ================= KEY ================= */

function getKey(){
return (
localStorage.getItem("mall") + "_" +
localStorage.getItem("system") + "_" +
localStorage.getItem("sheet")
);
}

/* ================= MONTH + YEAR FILTER ================= */

function generateFilters(){

let box=document.getElementById("monthYearBox");
if(!box) return;

let t=document.getElementById("dataTable");

let months=new Set();
let years=new Set();

for(let i=1;i<t.rows.length;i++){

let d=parseDate(t.rows[i].cells[1].innerText);
if(!d) continue;

months.add(d.toLocaleString('en-US',{month:'short',year:'numeric'}));
years.add(d.getFullYear());

}

box.innerHTML="";

months.forEach(m=>{
let b=document.createElement("button");
b.innerText=m;
b.onclick=()=>filterMonth(m);
box.appendChild(b);
});

years.forEach(y=>{
let b=document.createElement("button");
b.innerText=y;
b.onclick=()=>filterYear(y);
box.appendChild(b);
});

}

/* ================= SAFE DATE PARSE ================= */

function parseDate(str){

let parts=str.split("-");
if(parts.length<3) return null;

let day=parts[0];
let mon=parts[1];
let yr="20"+parts[2];

let date=new Date(`${mon} ${day}, ${yr}`);

return isNaN(date)?null:date;

}

/* ================= FILTER MONTH ================= */

function filterMonth(m){

let t=document.getElementById("dataTable");

for(let i=1;i<t.rows.length;i++){

let d=parseDate(t.rows[i].cells[1].innerText);
if(!d) continue;

let label=d.toLocaleString('en-US',{month:'short',year:'numeric'});

t.rows[i].style.display=(label===m)?"":"none";

}

}

/* ================= FILTER YEAR ================= */

function filterYear(y){

let t=document.getElementById("dataTable");

for(let i=1;i<t.rows.length;i++){

let d=parseDate(t.rows[i].cells[1].innerText);
if(!d) continue;

t.rows[i].style.display=(d.getFullYear()==y)?"":"none";

}

}

/* ================= ⭐ EXCEL STYLE COLUMN FILTER SYSTEM ================= */

function addColumnFilters(){

let table=document.getElementById("dataTable");

/* remove old filter row */
let old=document.getElementById("filterRow");
if(old) old.remove();

/* create filter row */
let filterRow=table.insertRow(1);
filterRow.id="filterRow";

let cols=table.rows[0].cells.length;

for(let i=0;i<cols;i++){

let cell=filterRow.insertCell(i);

/* skip SL and ACTION */
if(i===0 || i===cols-1){
cell.innerHTML="";
continue;
}

let input=document.createElement("input");
input.type="text";
input.placeholder="Filter";

input.style.width="90%";
input.style.padding="3px";
input.style.fontSize="12px";

input.addEventListener("input",function(){

activeFilters[i]=this.value.toLowerCase();
applyExcelFilters();

});

cell.appendChild(input);

}

}

/* ================= APPLY ALL FILTERS TOGETHER ================= */

function applyExcelFilters(){

let table=document.getElementById("dataTable");

for(let i=2;i<table.rows.length;i++){

let row=table.rows[i];
let show=true;

for(let col in activeFilters){

let value=activeFilters[col];
if(!value) continue;

let cell=row.cells[col];
if(!cell) continue;

let text=cell.innerText.toLowerCase();

if(!text.includes(value)){
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
let csv="";

csv+="Tamdeen Group\n";
csv+=localStorage.getItem("mall")+"\n\n";

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
