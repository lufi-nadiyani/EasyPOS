import{createApp as ct,ref as a,reactive as dt,onMounted as pt,onBeforeUnmount as mt,computed as y}from"https://unpkg.com/vue@3/dist/vue.esm-browser.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))l(u);new MutationObserver(u=>{for(const d of u)if(d.type==="childList")for(const v of d.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&l(v)}).observe(document,{childList:!0,subtree:!0});function i(u){const d={};return u.integrity&&(d.integrity=u.integrity),u.referrerPolicy&&(d.referrerPolicy=u.referrerPolicy),u.crossOrigin==="use-credentials"?d.credentials="include":u.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function l(u){if(u.ep)return;u.ep=!0;const d=i(u);fetch(u.href,d)}})();const S=o=>new Promise(n=>setTimeout(n,o)),M=(o,n)=>{try{const i=localStorage.getItem(o);if(i&&i!=="undefined"&&i!=="null"){const l=JSON.parse(i);if(l!=null)if(Array.isArray(n)){if(Array.isArray(l))return l.length<n.length?(localStorage.setItem(o,JSON.stringify(n)),n):l}else return l}}catch(i){console.error("Error parsing mock data for key:",o,i)}return n},Y=(o,n)=>{localStorage.setItem(o,JSON.stringify(n))},le=[{id:1,name:"Teh",price:4e3,category:"Minuman",image:"https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60"},{id:2,name:"Lemon tea",price:2e4,category:"Minuman",image:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60"},{id:3,name:"Jus Mangga",price:22e3,category:"Minuman",image:"https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60"},{id:4,name:"Nasi Telur",price:2e4,category:"Makanan",image:"https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=500&auto=format&fit=crop&q=60"},{id:5,name:"Nasi Goreng",price:2e4,category:"Makanan",image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60"},{id:6,name:"Laksa",price:2e4,category:"Makanan",image:"https://images.unsplash.com/photo-1591814468924-cafb06223adc?w=500&auto=format&fit=crop&q=60"}],be=[{id:"P001",date:"04/07/2026 12:00",tableNo:"01",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P002",date:"04/07/2026 14:00",tableNo:"03",amount:8e3,paymentMethod:"QRIS",itemsSummary:"2x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:2}]},{id:"P003",date:"04/07/2026 14:55",tableNo:"05",amount:18e3,paymentMethod:"QRIS",itemsSummary:"1x Laksa",items:[{menuId:6,name:"Laksa",price:2e4,quantity:1}]},{id:"P004",date:"04/07/2026 14:55",tableNo:"02",amount:18e3,paymentMethod:"QRIS",itemsSummary:"1x Nasi Telur",items:[{menuId:4,name:"Nasi Telur",price:2e4,quantity:1}]},{id:"P005",date:"04/07/2026 14:55",tableNo:"07",amount:18e3,paymentMethod:"QRIS",itemsSummary:"1x Nasi Goreng",items:[{menuId:5,name:"Nasi Goreng",price:2e4,quantity:1}]},{id:"P006",date:"04/07/2026 12:00",tableNo:"09",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P007",date:"04/07/2026 12:00",tableNo:"10",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P008",date:"04/07/2026 12:00",tableNo:"11",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P009",date:"04/07/2026 12:00",tableNo:"12",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P010",date:"04/07/2026 12:00",tableNo:"01",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P011",date:"04/07/2026 12:00",tableNo:"02",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P012",date:"04/07/2026 12:00",tableNo:"03",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]},{id:"P013",date:"04/07/2026 12:00",tableNo:"04",amount:5e3,paymentMethod:"Tunai",itemsSummary:"1x Teh",items:[{menuId:1,name:"Teh",price:4e3,quantity:1}]}],ue={username:"admin",password:"admin123",name:"Admin EasyPOS"},f={async login(o,n){{await S(500);const i=M("easypos_user",ue);if(i.username===o&&i.password===n)return{success:!0,user:{username:i.username,name:i.name}};throw new Error("Username atau kata sandi salah")}},async getMenus(){return await S(300),M("easypos_menus",le)},async addMenu(o){{await S(400);const n=M("easypos_menus",le),l={id:n.length>0?Math.max(...n.map(u=>u.id))+1:1,...o};return n.push(l),Y("easypos_menus",n),l}},async deleteMenu(o){{await S(300);let n=M("easypos_menus",le);return n=n.filter(i=>i.id!==o),Y("easypos_menus",n),{success:!0}}},async getTransactions(){return await S(300),M("easypos_transactions",be)},async createTransaction(o){{await S(500);const n=M("easypos_transactions",be);return n.unshift(o),Y("easypos_transactions",n),o}},async getAccountInfo(){return await S(200),M("easypos_user",ue)},async updateAccount(o,n,i){{await S(400);const l=M("easypos_user",ue);return l.name=o,l.username=n,l.password=i,Y("easypos_user",l),{success:!0,user:l}}}},ft={setup(){const o=a(!1),n=a(""),i=a(""),l=a(""),u=a(!1),d=a("Beranda"),v=a(!0),K=a(!1),ce=a(!1),Q=a(!1),V=a(!1),$=a(!1),q=a("Keranjang"),L=a(!1),D=a(!1),xe=a(!1),O=a(""),E=a(""),P=a(""),J=a(""),j=a(""),k=a(""),B=a(""),_=a("P001"),we=a("Admin"),A=a(""),X=a(new Date),b=a("Tunai"),m=a(""),Z=a(!1),ee=a({id:"",date:"",tableNo:"",items:[],amount:0,paymentMethod:"",nominalPaid:0,change:0}),te=new Date,de=te.getFullYear(),pe=String(te.getMonth()+1).padStart(2,"0"),Te=String(te.getDate()).padStart(2,"0"),x=a("Tanggal"),C=a(`${de}-${pe}-${Te}`),R=a(`${de}-${pe}`),Se=a(!1),G=a(!1),I=a(null),Me=["Makanan","Minuman","Snack"],ae=a("Makanan"),ke=["01","02","03","04","05","06","07","08","09","10","11","12"],Ae=[{url:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60",label:"Nasi Goreng"},{url:"https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=500&auto=format&fit=crop&q=60",label:"Nasi Telur"},{url:"https://images.unsplash.com/photo-1591814468924-cafb06223adc?w=500&auto=format&fit=crop&q=60",label:"Laksa Noodles"},{url:"https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",label:"Teh Hangat"},{url:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",label:"Iced Lemon Tea"},{url:"https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60",label:"Jus Mangga"}],H=a([]),p=a([]),w=a([]),Ie=a("nadiyanilufi27@gmail.com"),g=dt({name:"",price:"",category:"Makanan",image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60"});pt(async()=>{localStorage.getItem("easypos_session")&&(o.value=!0),await me(),se(),ne(),window.addEventListener("resize",ne);const t=setInterval(()=>{X.value=new Date},1e3);window.addEventListener("click",fe),mt(()=>{clearInterval(t),window.removeEventListener("resize",ne),window.removeEventListener("click",fe)})});const me=async()=>{try{H.value=await f.getMenus()||[],w.value=await f.getTransactions()||[];const e=await f.getAccountInfo();e&&(O.value=e.name||"",E.value=e.username||"",P.value=e.password||"")}catch(e){console.error("Gagal mengambil data awal:",e)}},ne=()=>{K.value=window.innerWidth<1024,K.value?v.value=!1:v.value=!0},fe=e=>{const t=document.getElementById("table-selector-container");t&&!t.contains(e.target)&&($.value=!1)},se=()=>{const e=w.value||[];if(e.length>0){const t=e.length+1;_.value="P"+String(t).padStart(3,"0")}else _.value="P001"},Ne=async()=>{if(!n.value||!i.value){l.value="Nama dan kata sandi harus diisi.";return}u.value=!0,l.value="";try{const e=await f.login(n.value,i.value);e.success&&(localStorage.setItem("easypos_session",JSON.stringify(e.user)),o.value=!0,n.value="",i.value="",d.value="Beranda",await me(),se())}catch(e){l.value=e.message||"Login gagal, periksa kembali input Anda."}finally{u.value=!1}},Pe=()=>{v.value=!v.value},$e=e=>{if(e==="Akun"){oe();return}d.value=e,K.value&&(v.value=!1)},qe=()=>{confirm("Apakah Anda yakin ingin keluar dari sistem EasyPOS?")&&(localStorage.removeItem("easypos_session"),o.value=!1,v.value=!1,d.value="Beranda")},oe=async()=>{try{const e=await f.getAccountInfo();O.value=e.name,E.value=e.username,P.value=e.password,L.value=!0,D.value=!1,B.value="",k.value=""}catch{alert("Gagal memuat detail akun")}},Le=()=>{L.value=!1},De=async()=>{try{(await f.updateAccount(O.value,E.value,P.value)).success&&(B.value="Profil berhasil disimpan!",setTimeout(()=>{L.value=!1},1200))}catch{k.value="Gagal menyimpan profil"}},Oe=()=>{L.value=!1,D.value=!0,J.value="",j.value="",B.value="",k.value=""},Ee=()=>{D.value=!1},je=async()=>{if(!J.value||!j.value){k.value="Lengkapi semua kolom formulir.";return}if(J.value!==P.value){k.value="Kata sandi saat ini salah!";return}try{(await f.updateAccount(O.value,E.value,j.value)).success&&(P.value=j.value,B.value="Kata sandi berhasil diubah!",setTimeout(()=>{D.value=!1,oe()},1200))}catch{k.value="Gagal mengubah kata sandi"}},T=e=>e==null?"Rp 0":"Rp "+Number(e).toLocaleString("id-ID"),ge=y(()=>{const e=X.value,t=String(e.getDate()).padStart(2,"0")+"/"+String(e.getMonth()+1).padStart(2,"0")+"/"+e.getFullYear(),s=String(e.getHours()).padStart(2,"0")+":"+String(e.getMinutes()).padStart(2,"0");return`${t} ${s}`}),Be=y(()=>{const e=new Date;return String(e.getHours()).padStart(2,"0")+":"+String(e.getMinutes()).padStart(2,"0")+" WIB"});y(()=>(H.value||[]).filter(t=>t&&t.category===ae.value));const _e=()=>{Q.value=!Q.value},Ce=e=>{I.value=e,G.value=!0},Re=async()=>{if(I.value)try{await f.deleteMenu(I.value.id),H.value=await f.getMenus(),re(I.value.id),G.value=!1,I.value=null}catch{alert("Gagal menghapus menu")}},He=()=>{G.value=!1,I.value=null},Ue=()=>{V.value=!0,g.name="",g.price="",g.category=ae.value,g.image="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60"},ye=()=>{V.value=!1},Ke=async()=>{if(!g.name||!g.price){alert("Mohon isi nama dan harga menu dengan benar.");return}const e={name:g.name,price:Number(g.price),category:g.category,image:g.image||"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60"};try{await f.addMenu(e),H.value=await f.getMenus(),alert(`Menu "${g.name}" berhasil ditambahkan!`),ye()}catch{alert("Gagal menambahkan menu")}},Je=e=>{e.stopPropagation(),$.value=!$.value},Ge=e=>{A.value=e,$.value=!1},ze=e=>{if(q.value==="Pembayaran")return;const t=p.value.find(s=>s.menuId===e.id);t?t.quantity+=1:p.value.push({menuId:e.id,name:e.name,price:e.price,quantity:1})},Fe=e=>{const t=p.value.find(s=>s.menuId===e);t&&(t.quantity+=1)},We=e=>{const t=p.value.find(s=>s.menuId===e);t&&(t.quantity-=1,t.quantity<=0&&re(e))},re=e=>{p.value=p.value.filter(t=>t.menuId!==e)},Ye=y(()=>p.value.reduce((e,t)=>e+t.quantity,0)),N=y(()=>p.value.reduce((e,t)=>e+t.price*t.quantity,0)),Qe=()=>{if(p.value.length===0){alert("Keranjang Anda kosong.");return}if(!A.value){alert("Harap pilih nomor meja terlebih dahulu.");return}q.value="Pembayaran",m.value=""},Ve=()=>{q.value="Keranjang"},Xe=e=>{b.value=e,e!=="Tunai"?m.value=String(N.value):m.value=""},Ze=e=>{let t=e.target.value.replace(/[^0-9]/g,"");m.value=t},et=e=>{let t=Number(m.value)||0;m.value=String(t+e)},tt=()=>{m.value=String(N.value)},at=y(()=>{if(b.value!=="Tunai")return 0;const e=Number(m.value)||0,t=N.value,s=e-t;return s>0?s:0}),nt=y(()=>b.value!=="Tunai"?!0:(Number(m.value)||0)>=N.value),ve=y(()=>p.value.length===0||!A.value?!1:b.value==="Tunai"?(Number(m.value)||0)>=N.value:!0),st=async()=>{if(!ve.value)return;const e=N.value,t=b.value==="Tunai"&&Number(m.value)||e,s=t-e,h=p.value.map(W=>`${W.quantity}x ${W.name}`).join(", "),r=new Date,U=String(r.getDate()).padStart(2,"0")+"/"+String(r.getMonth()+1).padStart(2,"0")+"/"+r.getFullYear(),ie=String(r.getHours()).padStart(2,"0")+":"+String(r.getMinutes()).padStart(2,"0"),F=`${U} ${ie}`;ee.value={id:_.value,date:F,tableNo:A.value,items:[...p.value],amount:e,paymentMethod:b.value,nominalPaid:t,change:s};const ut={id:_.value,date:F,tableNo:A.value,amount:e,paymentMethod:b.value,itemsSummary:h,items:[...p.value]};try{await f.createTransaction(ut),w.value=await f.getTransactions(),Z.value=!0}catch(W){alert("Gagal memproses transaksi: "+W.message)}},ot=()=>{Z.value=!1,p.value=[],A.value="",m.value="",ce.value=!1,q.value="Keranjang",se()},he=y(()=>(w.value||[]).reduce((t,s)=>t+(s&&s.amount?s.amount:0),0)),rt=y(()=>(w.value||[]).length),it=y(()=>{const e=w.value||[];return e.length===0?0:Math.round(he.value/e.length)}),z=y(()=>{const e=w.value||[];if(x.value==="Semua")return e;if(x.value==="Hari"){const t=new Date,s=String(t.getDate()).padStart(2,"0")+"/"+String(t.getMonth()+1).padStart(2,"0")+"/"+t.getFullYear();return e.filter(c=>c&&c.date&&c.date.startsWith(s))}if(x.value==="Tanggal"){if(!C.value)return e;const t=C.value.split("-");if(t.length!==3)return e;const s=`${t[2]}/${t[1]}/${t[0]}`;return e.filter(c=>c&&c.date&&c.date.startsWith(s))}if(x.value==="Bulan"){if(!R.value)return e;const t=R.value.split("-");if(t.length!==2)return e;const s=`${t[1]}/${t[0]}`;return e.filter(c=>c&&c.date&&c.date.length>=10&&c.date.substring(3,10)===s)}return e}),lt=(e,t="Cetak")=>{const s=window.open("","_blank","width=850,height=700");s?(s.document.write(`
          <html>
            <head>
              <title>${t}</title>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap">
              <script src="https://cdn.tailwindcss.com"><\/script>
              <style>
                body { font-family: "Plus Jakarta Sans", sans-serif; }
                .font-mono { font-family: "JetBrains Mono", monospace; }
                @media print {
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body class="p-6 bg-white text-slate-800">
              <div class="max-w-2xl mx-auto border border-slate-200 rounded-3xl p-6 shadow-sm no-print mb-4 flex justify-between items-center bg-slate-50">
                <span class="text-xs text-slate-500 font-bold">Pratinjau Dokumen Cetak. Gunakan tombol browser untuk mencetak atau menutup pratinjau.</span>
                <button onclick="window.print()" class="px-4 py-2 bg-[#1452B9] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">Cetak Sekarang</button>
              </div>
              <div class="max-w-3xl mx-auto">
                ${e}
              </div>
              <script>
                window.onload = function() {
                  // Auto trigger print
                  window.print();
                };
              <\/script>
            </body>
          </html>
        `),s.document.close()):alert("Gagal membuka pratinjau cetak. Harap izinkan pop-up pada browser Anda.")};return{isLoggedIn:o,loginUsername:n,loginPassword:i,loginError:l,isLoggingIn:u,handleLogin:Ne,laporanFilterType:x,laporanSelectedDate:C,laporanSelectedMonth:R,isFilterModalOpen:Se,isDeleteConfirmModalOpen:G,menuToDelete:I,filteredTransactionsHistory:z,printLaporan:()=>{let e="Semua Transaksi";if(x.value==="Hari")e="Transaksi Hari Ini";else if(x.value==="Tanggal"){const r=C.value.split("-");e=r.length===3?`Transaksi Tanggal ${r[2]}/${r[1]}/${r[0]}`:`Transaksi Tanggal ${C.value}`}else if(x.value==="Bulan"){const r=R.value.split("-");e=r.length===2?`Transaksi Bulan ${r[1]}/${r[0]}`:`Transaksi Bulan ${R.value}`}const t=z.value.map(r=>{const U=r.items&&r.items.length>0?r.items.reduce((ie,F)=>ie+F.quantity,0):1;return`
          <tr class="border-b border-slate-200">
            <td class="py-3 px-4 font-bold text-slate-900">${r.id}</td>
            <td class="py-3 px-4 text-slate-600 font-mono text-[11px]">${r.date}</td>
            <td class="py-3 px-4 text-center text-slate-800 font-bold">${U}</td>
            <td class="py-3 px-4 text-right text-slate-900 font-bold">${T(r.amount)}</td>
            <td class="py-3 px-4 text-center font-bold text-slate-700">${r.paymentMethod}</td>
            <td class="py-3 px-4 text-center text-green-600 font-bold">Selesai</td>
          </tr>
        `}).join(""),s=z.value.reduce((r,U)=>r+U.amount,0),c=z.value.length,h=`
        <div class="p-4">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-extrabold text-slate-950 tracking-tight">LAPORAN TRANSAKSI PENJUALAN</h1>
            <h2 class="text-base font-extrabold text-[#1452B9] uppercase mt-1 tracking-wide">EASYPOS - RUMAH MAKAN IBU</h2>
            <p class="text-[10px] text-slate-400 font-medium mt-1">Sistem Laporan Kasir Profesional • Waktu Cetak: ${ge.value} WIB</p>
          </div>

          <div class="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex justify-between items-center text-xs">
            <div>
              <span class="text-slate-400 block uppercase font-bold tracking-wider text-[9px] mb-0.5">Filter Periode</span>
              <span class="font-extrabold text-slate-800 text-sm">${e}</span>
            </div>
            <div class="text-right">
              <span class="text-slate-400 block uppercase font-bold tracking-wider text-[9px] mb-0.5">Ringkasan Volume</span>
              <span class="font-extrabold text-[#1452B9] text-sm">${c} Transaksi Selesai</span>
            </div>
          </div>

          <table class="w-full text-left border-collapse text-xs mb-8">
            <thead>
              <tr class="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th class="py-3 px-4">No. Transaksi</th>
                <th class="py-3 px-4">Tanggal / Waktu</th>
                <th class="py-3 px-4 text-center">Total Item</th>
                <th class="py-3 px-4 text-right">Total Pembayaran</th>
                <th class="py-3 px-4 text-center">Metode Bayar</th>
                <th class="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${t||'<tr><td colspan="6" class="py-12 text-center text-slate-400 font-semibold">Tidak ada transaksi ditemukan untuk filter ini</td></tr>'}
            </tbody>
          </table>

          <div class="flex justify-end gap-6 border-t border-slate-200 pt-6">
            <div class="text-right">
              <span class="text-slate-400 block text-xs uppercase font-bold tracking-wider text-[9px] mb-1">TOTAL OMSET PENDAPATAN</span>
              <span class="text-2xl font-black text-[#1452B9]">${T(s)}</span>
            </div>
          </div>

          <div class="mt-16 flex justify-between text-center text-xs text-slate-600">
            <div>
              <p class="mb-14 font-medium text-slate-500">Mengetahui, Owner</p>
              <p class="font-bold border-t border-slate-300 pt-1 w-44 mx-auto text-slate-800">( Ibu Owner )</p>
            </div>
            <div>
              <p class="mb-14 font-medium text-slate-500">Petugas Kasir</p>
              <p class="font-bold border-t border-slate-300 pt-1 w-44 mx-auto text-slate-800">( Administrator )</p>
            </div>
          </div>
        </div>
      `;lt(h,"Laporan_Transaksi_EasyPOS")},printReceipt:()=>{const e=ee.value;if(!e||!e.id)return;const t=e.items.map(h=>`
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
          <span style="font-weight: bold; font-family: sans-serif; color: #111;">${h.name}</span>
          <span style="font-weight: bold; color: #000;">${T(h.price*h.quantity)}</span>
        </div>
        <div style="font-size: 10px; color: #666; margin-bottom: 6px; margin-top: -1px;">
          ${h.quantity} x ${T(h.price)}
        </div>
      `).join(""),s=`
        <div style="max-width: 290px; margin: 0 auto; padding: 15px; font-family: 'JetBrains Mono', Courier, monospace; font-size: 11px; line-height: 1.4; color: #000; border: 1px solid #eee; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 15px; font-weight: 800; letter-spacing: 0.5px;">RUMAH MAKAN IBU</h3>
            <p style="margin: 3px 0; font-size: 10px; color: #444; font-family: sans-serif;">Jl. Kavling 12, Jakarta Selatan</p>
            <p style="margin: 2px 0; font-size: 10px; color: #444; font-family: sans-serif;">Telp: 0812-8888-9999</p>
            <p style="margin: 8px 0 0 0; font-size: 9px; font-weight: bold; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 4px 0; letter-spacing: 0.5px;">STRUK PEMBAYARAN ASLI</p>
          </div>

          <div style="margin-bottom: 10px; font-size: 10px; color: #333;">
            <div style="display: flex; justify-content: space-between;">
              <span>No. Transaksi:</span>
              <span style="font-weight: bold;">${e.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Tanggal:</span>
              <span>${e.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Meja:</span>
              <span style="font-weight: bold;">Meja ${e.tableNo}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Kasir:</span>
              <span>Administrator</span>
            </div>
          </div>

          <div style="border-top: 1px dashed #000; margin-bottom: 8px;"></div>

          <div style="margin-bottom: 8px;">
            ${t}
          </div>

          <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-bottom: 4px;">
              <span>TOTAL</span>
              <span>${T(e.amount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #333;">
              <span>Metode Bayar:</span>
              <span style="text-transform: uppercase; font-weight: bold;">${e.paymentMethod}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #333;">
              <span>Nominal Bayar:</span>
              <span>${T(e.nominalPaid)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px dotted #000; padding-top: 4px; margin-top: 4px; color: #000;">
              <span>KEMBALIAN</span>
              <span>${T(e.change)}</span>
            </div>
          </div>

          <div style="border-top: 1px dashed #000; margin-top: 12px; padding-top: 8px; text-align: center; font-size: 10px; color: #444;">
            <p style="margin: 0; font-weight: bold;">TERIMA KASIH ATAS KUNJUNGANNYA</p>
            <p style="margin: 2px 0 0 0; font-family: sans-serif;">Selamat Menikmati Hidangan Kami!</p>
          </div>
        </div>
      `,c=window.open("","_blank","width=340,height=580");c?(c.document.write(`
          <html>
            <head>
              <title>Struk_${e.id}</title>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap">
              <style>
                body { 
                  margin: 0; 
                  padding: 15px; 
                  background: #fff; 
                  display: flex; 
                  justify-content: center; 
                  align-items: flex-start;
                }
              </style>
            </head>
            <body>
              ${s}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              <\/script>
            </body>
          </html>
        `),c.document.close()):alert("Gagal mencetak struk. Harap izinkan pop-up pada browser Anda.")},isAccountModalOpen:L,isChangePasswordModalOpen:D,isAccountPasswordVisible:xe,accountName:O,accountUsername:E,accountPassword:P,oldPasswordInput:J,newPasswordInput:j,accountErrorMsg:k,accountSuccessMsg:B,openAccountModal:oe,closeAccountModal:Le,handleSaveAccount:De,openChangePasswordModal:Oe,closeChangePasswordModal:Ee,handleUpdatePassword:je,activePage:d,isSidebarOpen:v,isMobile:K,isMobileCartOpen:ce,isDeleteMode:Q,isAddMenuModalOpen:V,isTableDropdownOpen:$,rightPanelState:q,transactionNo:_,kasirName:we,selectedTable:A,currentDateTime:X,paymentMethod:b,nominalInput:m,isReceiptModalOpen:Z,lastCompletedTransaction:ee,categories:Me,activeCategory:ae,tables:ke,imagePresets:Ae,userEmail:Ie,menus:H,cart:p,transactionHistory:w,newMenu:g,formatRupiah:T,currentFormattedDateTime:ge,formatLoginTime:Be,toggleSidebar:Pe,setActivePage:$e,logout:qe,toggleDeleteMode:_e,confirmDeleteMenu:Ce,executeDeleteMenu:Re,cancelDeleteMenu:He,openAddMenuModal:Ue,closeAddMenuModal:ye,submitAddMenu:Ke,toggleTableDropdown:Je,selectTable:Ge,addToCart:ze,incrementCartItem:Fe,decrementCartItem:We,removeCartItem:re,cartTotalItems:Ye,cartTotal:N,proceedToPayment:Qe,backToCart:Ve,selectPaymentMethod:Xe,handleNominalInput:Ze,addCash:et,setExactCash:tt,calculatedChange:at,isNominalValid:nt,isPaymentExecutable:ve,confirmPayment:st,closeReceiptModal:ot,totalIncomeToday:he,totalTransactionsToday:rt,averageTransactionValue:it}}};ct(ft).mount("#app");
