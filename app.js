const $ = id => document.getElementById(id);
const STORAGE_KEY = "orenzo_inventory_pro_v1";
let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let movementType = "in";

const today = () => new Date(new Date().toDateString());
const dateDiff = date => Math.ceil((new Date(date + "T00:00:00") - today()) / 86400000);
const save = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); render(); };
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function statusOf(p) {
  if (p.expiry && dateDiff(p.expiry) < 0) return ["Expired", "expired"];
  if (p.expiry && dateDiff(p.expiry) <= 30) return ["Expiring soon", "soon"];
  if (Number(p.quantity) <= Number(p.reorder)) return ["Low stock", "low"];
  return ["In stock", "good"];
}
function render() {
  $("totalProducts").textContent = products.length;
  $("totalUnits").textContent = products.reduce((n,p)=>n+Number(p.quantity||0),0).toLocaleString();
  const low = products.filter(p => Number(p.quantity) <= Number(p.reorder)).length;
  const expired = products.filter(p => p.expiry && dateDiff(p.expiry) < 0).length;
  $("lowCount").textContent = low;
  $("expiredCount").textContent = expired;
  $("alertStrip").hidden = low + expired === 0;
  $("alertText").textContent = `${low} product(s) at or below reorder level · ${expired} expired product(s).`;
  const categories = [...new Set(products.map(p=>p.category).filter(Boolean))].sort();
  const current = $("categoryFilter").value;
  $("categoryFilter").innerHTML = '<option value="">All categories</option>' + categories.map(c=>`<option>${escapeHtml(c)}</option>`).join("");
  $("categoryFilter").value = categories.includes(current) ? current : "";
  const q = $("searchInput").value.trim().toLowerCase(), category = $("categoryFilter").value, filter = $("statusFilter").value;
  const filtered = products.filter(p => {
    const status = statusOf(p)[1];
    return (!q || `${p.name} ${p.barcode||""} ${p.category}`.toLowerCase().includes(q)) &&
      (!category || p.category === category) &&
      (filter === "all" || (filter === "low" && Number(p.quantity)<=Number(p.reorder)) ||
       (filter === "expired" && status==="expired") || (filter==="expiring" && status==="soon"));
  });
  $("productRows").innerHTML = filtered.map(p => {
    const [status, cls] = statusOf(p);
    return `<tr>
      <td><div class="product-name">${escapeHtml(p.name)}</div><div class="subline">${escapeHtml(p.barcode || "No barcode")}</div></td>
      <td>${escapeHtml(p.category)}</td><td class="qty">${Number(p.quantity).toLocaleString()} ${escapeHtml(p.unit)}</td>
      <td>${Number(p.reorder).toLocaleString()} ${escapeHtml(p.unit)}</td>
      <td>${p.expiry ? new Date(p.expiry+"T00:00:00").toLocaleDateString() : "—"}</td>
      <td><span class="pill ${cls}">${status}</span></td>
      <td><div class="actions"><button class="mini-btn" data-move="in" data-id="${p.id}">＋ In</button><button class="mini-btn" data-move="out" data-id="${p.id}">− Out</button><button class="mini-btn" data-edit="${p.id}">Edit</button><button class="mini-btn" data-delete="${p.id}">Delete</button></div></td>
    </tr>`;
  }).join("");
  $("emptyState").hidden = filtered.length > 0;
  $("productRows").parentElement.style.display = filtered.length ? "" : "none";
}
function openProduct(p=null) {
  $("productForm").reset();
  $("productId").value = p?.id || "";
  $("dialogTitle").textContent = p ? "Edit Product" : "Add Product";
  $("name").value = p?.name || "";
  $("category").value = p?.category || "Cheese";
  $("barcode").value = p?.barcode || "";
  $("quantity").value = p?.quantity ?? 0;
  $("reorder").value = p?.reorder ?? 5;
  $("unit").value = p?.unit || "pcs";
  $("expiry").value = p?.expiry || "";
  $("notes").value = p?.notes || "";
  $("productDialog").showModal();
}
function openMovement(id,type) {
  const p = products.find(x=>x.id===id); if(!p) return;
  movementType=type; $("movementTitle").textContent=type==="in"?"Stock In":"Stock Out";
  $("movementProductId").value=id; $("movementProductName").textContent=`${p.name} · Current stock: ${p.quantity} ${p.unit}`;
  $("movementQty").value=1; $("movementNote").value=""; $("movementDialog").showModal();
}
$("addProductBtn").onclick=()=>openProduct();
$("emptyAddBtn").onclick=()=>openProduct();
$("closeDialog").onclick=$("cancelDialog").onclick=()=>$("productDialog").close();
$("closeMovement").onclick=$("cancelMovement").onclick=()=>$("movementDialog").close();
$("productForm").onsubmit=e=>{
  e.preventDefault();
  const id=$("productId").value || crypto.randomUUID();
  const p={id,name:$("name").value.trim(),category:$("category").value,barcode:$("barcode").value.trim(),quantity:Number($("quantity").value),reorder:Number($("reorder").value),unit:$("unit").value,expiry:$("expiry").value,notes:$("notes").value.trim()};
  const index=products.findIndex(x=>x.id===id);
  if(index>=0) products[index]=p; else products.push(p);
  $("productDialog").close(); save();
};
$("movementForm").onsubmit=e=>{
  e.preventDefault(); const p=products.find(x=>x.id===$("movementProductId").value); if(!p)return;
  const qty=Number($("movementQty").value);
  if(movementType==="out" && qty>Number(p.quantity)){alert("Insufficient stock. Available: "+p.quantity);return;}
  p.quantity += movementType==="in" ? qty : -qty;
  $("movementDialog").close(); save();
};
$("productRows").addEventListener("click",e=>{
  const b=e.target.closest("button"); if(!b)return;
  if(b.dataset.move)openMovement(b.dataset.id,b.dataset.move);
  if(b.dataset.edit)openProduct(products.find(p=>p.id===b.dataset.edit));
  if(b.dataset.delete && confirm("Delete this product record?")){products=products.filter(p=>p.id!==b.dataset.delete);save();}
});
["searchInput","categoryFilter","statusFilter"].forEach(id=>$(id).addEventListener(id==="searchInput"?"input":"change",render));
$("showLowBtn").onclick=()=>{$("statusFilter").value="low";render();$("productRows").scrollIntoView({behavior:"smooth",block:"center"});};

function csvCell(v){return '"'+String(v??"").replace(/"/g,'""')+'"';}
$("exportBtn").onclick=()=>{
  const headers=["name","category","barcode","quantity","reorder","unit","expiry","notes"];
  const csv=[headers.join(","),...products.map(p=>headers.map(k=>csvCell(p[k])).join(","))].join("\r\n");
  download(csv,"orenzo-inventory-stock.csv","text/csv;charset=utf-8;");
};
function download(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
$("importBtn").onclick=()=>$("csvFile").click();
$("csvFile").onchange=async e=>{
  const file=e.target.files[0];if(!file)return;
  const text=await file.text();const rows=parseCSV(text);
  if(rows.length<2){alert("CSV file has no product rows.");return;}
  const headers=rows[0].map(x=>x.trim().toLowerCase());
  const required=["name","category","quantity"];
  if(!required.every(k=>headers.includes(k))){alert("CSV must include these columns: name, category, quantity. Export a sample CSV first if needed.");e.target.value="";return;}
  let added=0;
  rows.slice(1).filter(r=>r.some(Boolean)).forEach(row=>{
    const obj={};headers.forEach((h,i)=>obj[h]=row[i]??"");
    products.push({id:crypto.randomUUID(),name:obj.name,category:obj.category||"Others",barcode:obj.barcode||"",quantity:Number(obj.quantity)||0,reorder:Number(obj.reorder)||0,unit:obj.unit||"pcs",expiry:obj.expiry||"",notes:obj.notes||""});added++;
  });
  save();alert(`${added} product(s) imported.`);e.target.value="";
};
function parseCSV(s){
  const rows=[];let row=[],field="",quoted=false;
  for(let i=0;i<s.length;i++){const c=s[i],n=s[i+1];if(c==='"'&&quoted&&n==='"'){field+='"';i++;}else if(c==='"'){quoted=!quoted;}else if(c===","&&!quoted){row.push(field);field="";}else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&n==="\n")i++;row.push(field);rows.push(row);row=[];field="";}else field+=c;}
  if(field.length||row.length){row.push(field);rows.push(row);}return rows;
}
render();