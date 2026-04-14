
/* ================= INIT ================= */

function init(){

document.getElementById("title").innerText =
localStorage.getItem("mall")+" - "+localStorage.getItem("system");

render();
applyMode();
}

/* ================= KEY ================= */

function key(){
return localStorage.getItem("mall")+"_"+localStorage.getItem("system");
}

/* ================= MODE ================= */

function getMode(){
return localStorage.getItem("mode") || "daily";
}

function setMode(m){
localStorage.setItem("mode",m);
render();
applyMode();
}

/* ================= DATA ================= */

function getData(){
return JSON.parse(localStorage.getItem(key()) || "[]");
}

function saveData(d){
localStorage.setItem(key(),JSON.stringify(d));
}

/* ================= RENDER ================= */

function render(){

let mode=getMode();
let data=getData();
let t=document.getElementById("table");

t.innerHTML="";

/* DAILY */
if(mode==="daily"){

t.innerHTML=`
<tr>
<th>Sl</th><th>Date</th><th>Tag</th>
<th>Location</th><th>Status</th>
<th>Remarks</th><th>Shift</th><th>Action</th>
</tr>`;

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
}

/* MONTHLY */
if(mode==="monthly"){

t.innerHTML=`
<tr><th>Sl</th><th>Month</th><th>Total</th></tr>`;

let map={};

data.forEach(d=>{
let dt=new Date(d.date);
if(isNaN(dt)) return;

let k = dt.toLocaleString('en-US',{month:'short',year:'numeric'});
map[k]=(map[k]||0)+1;
});

let i=1;
for(let k in map){
t.insertRow().innerHTML=
`<td>${i++}</td><td>${k}</td><td>${map[k]}</td>`;
}
}

/* YEARLY */
if(mode==="yearly"){

t.innerHTML=`
<tr><th>Sl</th><th>Year</th><th>Total</th></tr>`;

let map={};

data.forEach(d=>{
let dt=new Date(d.date);
if(isNaN(dt)) return;

let y=dt.getFullYear();
map[y]=(map[y]||0)+1;
});

let i=1;
for(let y in map){
t.insertRow().innerHTML=
`<td>${i++}</td><td>${y}</td><td>${map[y]}</td>`;
}
}
}

/* ================= ADD ROW ================= */

function addRow(){

let data=getData();

data.push({
date:new Date().toLocaleDateString(),
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

let i=btn.parentElement.parentElement.rowIndex-1;
let data=getData();
data.splice(i,1);

saveData(data);
render();
}

/* ================= MODE UI ================= */

function applyMode(){

let btn=document.getElementById("addBtn");
if(!btn) return;

btn.style.display = (getMode()==="daily") ? "inline-block" : "none";
}

/* ================= EXPORT ================= */

function exportCSV(){

let data=getData();
let csv="Tamdeen Group\n";

data.forEach(d=>{
csv+=Object.values(d).join(",")+"\n";
});

let a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([csv]));
a.download="report.csv";
a.click();
}
