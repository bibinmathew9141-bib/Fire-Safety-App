/* ================= NAVIGATION ================= */

function openMall(m){
localStorage.setItem("mall",m);
window.location="mall.html";
}

function openSystem(s){
localStorage.setItem("system",s);
window.location="sheet.html";
}

/* ================= OPEN SHEET TYPE ================= */

function openSheet(type){

localStorage.setItem("sheet",type);
window.location="table.html";

}

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
addColumnFilters();

}

/* ================= MODE CONTROL (FIXED) ================= */

function applyMode(){

let type=localStorage.getItem("sheet");

let addBtn=document.getElementById("addBtn");

if(type==="daily"){
if(addBtn) addBtn.style.display="inline-block";
}else{
if(addBtn) addBtn.style.display="none";
}

}

/* ================= ADD ROW (ONLY DAILY) ================= */

function addRow(){

let type=localStorage.getItem("sheet");
if(type!=="daily") return;

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
return localStorage.getItem("mall")+"_"+localStorage.getItem("system")+"_"+localStorage.getItem("sheet");
}

/* ================= DATE FORMAT ================= */

function formatDate(d){

let dt=new Date(d);

let day=String(dt.getDate()).padStart(2,'0');
let mon=dt.toLocaleString('en-US',{month:'short'});
let yr=String(dt.getFullYear()).slice(-2);

return `${day}-${mon}-${yr}`;

}

/* ================= COLUMN FILTER ================= */

let activeFilters={};

function addColumnFilters(){

let table=document.getElementById("dataTable");

let old=document.getElementById("filterRow");
if(old) old.remove();

let filterRow=table.insertRow(1);
filterRow.id="filterRow";

let cols=table.rows[0].cells.length;

for(let i=0;i<cols;i++){

let cell=filterRow.insertCell(i);

if(i===0 || i===cols-1){
cell.innerHTML="";
continue;
}

let input=document.createElement("input");
input.placeholder="Filter";
input.style.width="90%";

input.oninput=function(){
activeFilters[i]=this.value.toLowerCase();
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

for(let col in activeFilters){

let val=activeFilters[col];
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

/* ================= EXCEL EXPORT ================= */

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
