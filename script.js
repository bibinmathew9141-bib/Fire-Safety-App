/* LOGIN FLOW DONE IN HTML */

/* NAVIGATION */
function openMall(m){
localStorage.setItem("mall",m);
window.location="mall.html";
}

function openSystem(s){
localStorage.setItem("system",s);
window.location="sheet.html";
}

function openSheet(t){
localStorage.setItem("sheet",t);
window.location="table.html";
}

/* INIT */
function initPage(){
document.getElementById("mallHeader").innerText =
localStorage.getItem("mall");

/* SHOW/HIDE BASED ON TYPE */
let type=localStorage.getItem("sheet");

if(type==="daily"){
document.getElementById("addBtn").style.display="inline-block";
}else{
document.getElementById("addBtn").style.display="none";
document.getElementById("actionHead").style.display="none";
}

load();
generateMonthYear();
}

/* DATE FORMAT */
function formatDate(d){
let dt=new Date(d);
let day=String(dt.getDate()).padStart(2,'0');
let mon=dt.toLocaleString('en-US',{month:'short'});
let yr=String(dt.getFullYear()).slice(-2);
return `${day}-${mon}-${yr}`;
}

/* ADD ROW (ONLY DAILY) */
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

/* DELETE */
function del(btn){
btn.parentElement.parentElement.remove();
save();
}

/* SAVE */
function save(){
let t=document.getElementById("dataTable");
let data=[];

for(let i=1;i<t.rows.length;i++){
let c=t.rows[i].cells;
data.push([c[1].innerText,c[2].innerText,c[3].innerText,c[4].innerText,c[5].innerText,c[6].innerText]);
}

localStorage.setItem(key(),JSON.stringify(data));
}

/* LOAD */
function load(){
let t=document.getElementById("dataTable");
let data=JSON.parse(localStorage.getItem(key())||"[]");

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

/* KEY */
function key(){
return localStorage.getItem("mall")+"_"+localStorage.getItem("system");
}

/* MONTH YEAR MODULE (READ ONLY) */
function generateMonthYear(){
let box=document.getElementById("monthYearBox");
if(!box) return;

let t=document.getElementById("dataTable");
let months=new Set();
let years=new Set();

for(let i=1;i<t.rows.length;i++){
let d=new Date(t.rows[i].cells[1].innerText);

if(!isNaN(d)){
months.add(d.toLocaleString('en-US',{month:'short',year:'numeric'}));
years.add(d.getFullYear());
}
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

function filterMonth(m){
let t=document.getElementById("dataTable");

for(let i=1;i<t.rows.length;i++){
let d=new Date(t.rows[i].cells[1].innerText);
let label=d.toLocaleString('en-US',{month:'short',year:'numeric'});

t.rows[i].style.display=(label===m)?"":"none";
}
}

function filterYear(y){
let t=document.getElementById("dataTable");

for(let i=1;i<t.rows.length;i++){
let d=new Date(t.rows[i].cells[1].innerText);

t.rows[i].style.display=(d.getFullYear()==y)?"":"none";
}
}

/* EXCEL EXPORT */
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

/* PRINT */
function printPDF(){
window.print();
}
