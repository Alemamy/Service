const $=s=>document.querySelector(s);
const authView=$("#authView"),homeView=$("#homeView"),loginForm=$("#loginForm"),registerForm=$("#registerForm"),authMsg=$("#authMsg");
let currentService="";
function getUsers(){return JSON.parse(localStorage.getItem("service_users")||"[]")}
function saveUsers(u){localStorage.setItem("service_users",JSON.stringify(u))}
function showHome(user){authView.classList.add("hidden");homeView.classList.remove("hidden");$("#welcome").textContent=" • "+user.name;$("#balance").textContent=Number(user.balance||0).toFixed(2);renderOrders(user)}
function renderOrders(user){const orders=$("#orders");if(!user.orders?.length){orders.className="empty";orders.textContent="لا توجد طلبات حتى الآن";return}orders.className="";orders.innerHTML=user.orders.slice().reverse().map(o=>`<div class="order"><b>${o.service}</b><div>${o.amount} د.ل • ${o.status}</div><small>${o.date}</small></div>`).join("")}
function currentUser(){const email=localStorage.getItem("service_session");return getUsers().find(u=>u.email===email)}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");const reg=t.dataset.tab==="register";loginForm.classList.toggle("hidden",reg);registerForm.classList.toggle("hidden",!reg);authMsg.textContent=""});
registerForm.onsubmit=e=>{e.preventDefault();const users=getUsers(),email=$("#regEmail").value.trim().toLowerCase();if(users.some(u=>u.email===email)){authMsg.textContent="البريد مستخدم بالفعل";return}users.push({name:$("#regName").value.trim(),email,password:$("#regPassword").value,balance:0,orders:[]});saveUsers(users);localStorage.setItem("service_session",email);showHome(users.at(-1))};
loginForm.onsubmit=e=>{e.preventDefault();const email=$("#loginEmail").value.trim().toLowerCase(),u=getUsers().find(x=>x.email===email&&x.password===$("#loginPassword").value);if(!u){authMsg.textContent="بيانات الدخول غير صحيحة";return}localStorage.setItem("service_session",email);showHome(u)};
$("#logoutBtn").onclick=()=>{localStorage.removeItem("service_session");location.reload()};
document.querySelectorAll(".service").forEach(b=>b.onclick=()=>{$("#modalTitle").textContent=b.dataset.service;currentService=b.dataset.service;$("#modal").classList.remove("hidden");$("#orderMsg").textContent=""});
$("#closeModal").onclick=()=>$("#modal").classList.add("hidden");
$("#orderForm").onsubmit=e=>{e.preventDefault();const u=currentUser();if(!u)return;u.orders=u.orders||[];u.orders.push({service:currentService,amount:Number($("#orderAmount").value).toFixed(2),data:$("#orderData").value,status:"قيد المراجعة",date:new Date().toLocaleString("ar-LY")});saveUsers(getUsers().map(x=>x.email===u.email?u:x));$("#orderMsg").textContent="تم إنشاء الطلب محليًا. ربطه بالسيرفر الحقيقي يحتاج API.";renderOrders(u);setTimeout(()=>$("#modal").classList.add("hidden"),1200)};
const u=currentUser();if(u)showHome(u);