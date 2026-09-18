const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-CgGRalH7.js","assets/index-DibejzpH.js","assets/index-Dj-O0o3j.css"])))=>i.map(i=>d[i]);
import{eP as $,eQ as T,b3 as C,d1 as a,aV as _,aW as z,bO as X,i as f}from"./index-DibejzpH.js";function m(t,o){return o(t==="Chờ duyệt"?"baoCaodeXuatVatTu.trangThaiChoDuyet":t==="Đã duyệt"?"baoCaodeXuatVatTu.trangThaiDaDuyet":"baoCaodeXuatVatTu.trangThaiKhongDuyet")}function V(){const t=X.getState().companyInfo,o=t.appLogo?`<img src="${t.appLogo}" alt="Logo" style="width:64px;height:64px;object-fit:contain;flex-shrink:0" />`:"",d=t.address?`${f.t("company.address")}: ${t.address}`:"",n=[];t.email&&n.push(`${f.t("company.email")}: ${t.email}`),t.phone&&n.push(`${f.t("company.phone")}: ${t.phone}`);const e=n.join(" · ");return`
<div style="display:flex;align-items:flex-start;gap:16px;padding-bottom:16px;margin-bottom:16px;border-bottom:2px solid #333;font-family:${a()}">
  ${o}
  <div style="flex:1;min-width:0">
    <div style="font-size:14pt;font-weight:bold;color:#111;text-transform:uppercase;letter-spacing:0.02em">${t.companyName}</div>
    ${d?`<p style="font-size:9pt;color:#444;margin:2px 0 0 0">${d}</p>`:""}
    ${e?`<p style="font-size:9pt;color:#444;margin:2px 0 0 0">${e}</p>`:""}
  </div>
</div>`}function v(t,o){if(t.length===0)return"";const d=[o("baoCaodeXuatVatTu.tongHop.statusCol"),o("baoCaodeXuatVatTu.tongHop.countCol")].map(e=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${a()};background:#6366f1;color:#fff">${e}</th>`).join(""),n=t.map(e=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt">${m(e.trang_thai,o)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt;text-align:right">${e.count}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${a()}">${o("baoCaodeXuatVatTu.tongHop.byStatus")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${a()};font-size:9pt"><thead><tr>${d}</tr></thead><tbody>${n}</tbody></table>`}function D(t,o){if(t.length===0)return"";const d=o("baoCaodeXuatVatTu.chiTiet.noiDeXuat"),n=o("baoCaodeXuatVatTu.tongHop.countCol"),e=[`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${a()};background:#6366f1;color:#fff">${d}</th>`,`<th style="padding:6px 8px;border:1px solid #ddd;text-align:right;font-size:9pt;font-family:${a()};background:#6366f1;color:#fff">${n}</th>`].join(""),l=t.slice(0,25).map(i=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt">${i.ten_noi_de_xuat??i.id_noi_de_xuat}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt;text-align:right">${i.count}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${a()}">${o("baoCaodeXuatVatTu.tongHop.byNoiDeXuat")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${a()};font-size:9pt"><thead><tr>${e}</tr></thead><tbody>${l}</tbody></table>`}function w(t,o){if(t.length===0)return"";const d=[o("baoCaodeXuatVatTu.chiTiet.soPhieu"),o("baoCaodeXuatVatTu.chiTiet.ngay"),o("baoCaodeXuatVatTu.chiTiet.noiDeXuat"),o("baoCaodeXuatVatTu.chiTiet.nguoiDeXuat"),o("baoCaodeXuatVatTu.chiTiet.trangThai")].map(e=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${a()};background:#6366f1;color:#fff">${e}</th>`).join(""),n=t.slice(0,20).map(e=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt">${e.so_phieu}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt">${e.ngay}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt">${e.ten_noi_de_xuat??"—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt">${e.ten_nguoi_de_xuat??"—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${a()};font-size:9pt">${m(e.trang_thai,o)}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${a()}">${o("baoCaodeXuatVatTu.tabs.chiTietPhieu")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${a()};font-size:9pt"><thead><tr>${d}</tr></thead><tbody>${n}</tbody></table>`}async function P(t,o){const[d,n]=await Promise.all([t.dateFrom&&t.dateTo?$(t):Promise.resolve(null),t.dateFrom&&t.dateTo?T(t):Promise.resolve([])]),e=o("baoCaodeXuatVatTu.reportTitle"),l=`${o("baoCaodeXuatVatTu.period")}: ${t.dateFrom} – ${t.dateTo}`,i=C(new Date),b=d?v(d.byTrangThai,o):"",y=d?D(d.byNoiDeXuat,o):"",x=w(n,o),g=`
<div style="font-family:${a()};font-size:10pt;color:#222;padding:20px;min-width:600px" id="bao-cao-de-xuat-vat-tu-pdf">
${V()}
<h1 style="font-size:16pt;text-align:center;margin:0 0 8px;font-family:${a()}">${e}</h1>
<p style="font-size:10pt;color:#555;text-align:center;margin-bottom:12px;font-family:${a()}">${l}</p>
<p style="font-size:9pt;color:#888;margin-bottom:16px;font-family:${a()}">${i}</p>
<hr style="border:0;border-top:1px solid #ccc;margin:12px 0" />
${b}
${y}
${x}
</div>`,[{default:h}]=await Promise.all([_(()=>import("./jspdf.es.min-CgGRalH7.js").then(r=>r.j),__vite__mapDeps([0,1,2]))]),c=new h({orientation:"p",unit:"mm",format:"a4"}),p=document.createElement("div");p.style.cssText=`position:fixed;left:-9999px;top:0;width:210mm;padding:20px;font-family:${a()};font-size:10pt;background:#fff`,p.innerHTML=g,document.body.appendChild(p);try{await c.html(p,{callback:()=>{},html2canvas:{scale:.5,useCORS:!0},x:10,y:10,width:190,windowWidth:794});const r=c.output("blob"),u=URL.createObjectURL(r),s=document.createElement("a");s.href=u,s.download=`bao_cao_de_xuat_vat_tu_${t.dateFrom}_${t.dateTo}_${z()}.pdf`,s.click(),URL.revokeObjectURL(u)}finally{document.body.removeChild(p)}}export{P as exportBaoCaoDeXuatVatTuToPdf};
