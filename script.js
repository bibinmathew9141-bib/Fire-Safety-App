/* LOGIN */
function login(){
let u=document.getElementById("username").value;
let p=document.getElementById("password").value;

if(u==="Tamdeen" && p==="T@mdeen123"){
localStorage.setItem("login","yes");
window.location="home.html";
}else{
document.getElementById("error").innerText="Wrong Login";
}
}

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

function goBack(){
window.history.back();
}

function goHome(){
window.location="home.html";
}

/* KEY */
function key(){
return localStorage.getItem("mall")+"_"+localStorage.getItem("system");
}

/* INIT */
function initPage(){
document.getElementById("mallHeader").innerText =
localStorage.getItem("mall")+" - "+localStorage.getItem("system");

load();
generate();
}

/* DATE FORMAT */
function formatDate(d){
let dt=new Date(d);
let day=String(dt.getDate()).padStart(2,'0');
let mon=dt.toLocaleString('en-US',{month:'short'});
let yr=String(dt.getFullYear()).slice(-2);
return `${day}-${mon}-${yr}`;
}

/* ADD ROW */
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

/* FILTER */
function colFilter(c,val){
let t=document.getElementById("dataTable");
for(let i=1;i<t.rows.length;i++){
let v=t.rows[i].cells[c].innerText.toLowerCase();
t.rows[i].style.display=v.includes(val.toLowerCase())?"":"none";
}
}

/* EXCEL EXPORT */
function exportExcel(){
let t=document.getElementById("dataTable");
let csv="";

csv+="Tamdeen Group\n";
csv+=localStorage.getItem("mall")+" - "+localStorage.getItem("system")+"\n\n";

for(let i=0;i<t.rows.length;i++){
let row=[];
for(let j=0;j<t.rows[i].cells.length-1;j++){
row.push(t.rows[i].cells[j].innerText);
}
csv+=row.join(",")+"\n";
}

let a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([csv]));
a.download="Fire_Report.csv";
a.click();
}

/* PDF */
function printPDF(){
window.print();
}

/* HELP */
function openHelp(){
window.location="help.html";
}
