const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-CgGRalH7.js","assets/index-DibejzpH.js","assets/index-Dj-O0o3j.css"])))=>i.map(i=>d[i]);
import{b3 as y,d1 as o,aV as m,aW as c,bO as $}from"./index-DibejzpH.js";function p(a){return a==null?"—":String(a)}function e(a){return new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(a)}function u(){const a=$.getState().companyInfo,t=a.appLogo?`<img src="${a.appLogo}" alt="Logo" style="width:64px;height:64px;object-fit:contain;flex-shrink:0" />`:"",d=a.address?`Địa chỉ: ${a.address}`:"",i=[];a.email&&i.push(`Email: ${a.email}`),a.phone&&i.push(`Điện thoại: ${a.phone}`);const n=i.join(" · ");return`
<div style="display:flex;align-items:flex-start;gap:16px;padding-bottom:16px;margin-bottom:16px;border-bottom:2px solid #333;font-family:${o()}">
  ${t}
  <div style="flex:1;min-width:0">
    <div style="font-size:14pt;font-weight:bold;color:#111;text-transform:uppercase;letter-spacing:0.02em">${a.companyName}</div>
    ${d?`<p style="font-size:9pt;color:#444;margin:2px 0 0 0">${d}</p>`:""}
    ${n?`<p style="font-size:9pt;color:#444;margin:2px 0 0 0">${n}</p>`:""}
  </div>
</div>`}function S(a,t){if(a.length===0)return"";const d=[t("baoCaoDoanhSo.byThang.thang"),t("baoCaoDoanhSo.kpi.soDon"),t("baoCaoDoanhSo.kpi.tongDoanhSo"),t("baoCaoDoanhSo.kpi.donTrungBinh")].map(n=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${o()};background:#2563eb;color:#fff">${n}</th>`).join(""),i=a.map(n=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.label)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${n.soDon}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${e(n.tongDoanhSo)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${e(n.donTrungBinh)}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${o()}">${t("baoCaoDoanhSo.byThang.title")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${o()};font-size:9pt"><thead><tr>${d}</tr></thead><tbody>${i}</tbody></table>`}function D(a,t){if(a.length===0)return"";const d=[t("baoCaoDoanhSo.byNhanVien.maNhanVien"),t("baoCaoDoanhSo.byNhanVien.tenNhanVien"),t("baoCaoDoanhSo.kpi.soDon"),t("baoCaoDoanhSo.kpi.tongDoanhSo"),t("baoCaoDoanhSo.kpi.donTrungBinh")].map(n=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${o()};background:#2563eb;color:#fff">${n}</th>`).join(""),i=a.slice(0,30).map(n=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.ma_nguoi_tao)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.ten_nguoi_tao)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${n.soDon}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${e(n.tongDoanhSo)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${e(n.donTrungBinh)}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${o()}">${t("baoCaoDoanhSo.byNhanVien.title")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${o()};font-size:9pt"><thead><tr>${d}</tr></thead><tbody>${i}</tbody></table>`}function z(a,t){if(a.length===0)return"";const d=[t("baoCaoDoanhSo.byKhachHang.maKhachHang"),t("baoCaoDoanhSo.byKhachHang.tenKhachHang"),t("baoCaoDoanhSo.kpi.soDon"),t("baoCaoDoanhSo.kpi.tongDoanhSo"),t("baoCaoDoanhSo.kpi.donTrungBinh")].map(n=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${o()};background:#2563eb;color:#fff">${n}</th>`).join(""),i=a.slice(0,30).map(n=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.ma_kh)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.ten_khach_hang)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${n.soDon}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${e(n.tongDoanhSo)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${e(n.donTrungBinh)}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${o()}">${t("baoCaoDoanhSo.byKhachHang.title")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${o()};font-size:9pt"><thead><tr>${d}</tr></thead><tbody>${i}</tbody></table>`}function v(a,t){if(a.length===0)return"";const d=[t("baoCaoDoanhSo.bySanPham.maHang"),t("baoCaoDoanhSo.bySanPham.tenHang"),t("baoCaoDoanhSo.bySanPham.donViTinh"),t("baoCaoDoanhSo.bySanPham.tongSoLuong"),t("baoCaoDoanhSo.bySanPham.tongThanhTien")].map(n=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${o()};background:#2563eb;color:#fff">${n}</th>`).join(""),i=a.slice(0,40).map(n=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.ma_hang)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.ten_hang)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt">${p(n.don_vi_tinh)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${n.tongSoLuong.toLocaleString()}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${o()};font-size:9pt;text-align:right">${e(n.tongThanhTien)}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${o()}">${t("baoCaoDoanhSo.bySanPham.title")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${o()};font-size:9pt"><thead><tr>${d}</tr></thead><tbody>${i}</tbody></table>`}async function T(a,t,d){const i=`${a.dateFrom} – ${a.dateTo}`,n=y(new Date),b=`
<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px;font-family:${o()}">
  <div style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;min-width:140px">
    <div style="font-size:9pt;color:#666">${d("baoCaoDoanhSo.kpi.tongDoanhSo")}</div>
    <div style="font-size:14pt;font-weight:bold">${e(t.kpi.tongDoanhSo)}</div>
  </div>
  <div style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;min-width:100px">
    <div style="font-size:9pt;color:#666">${d("baoCaoDoanhSo.kpi.soDon")}</div>
    <div style="font-size:14pt;font-weight:bold">${t.kpi.soDon}</div>
  </div>
  <div style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;min-width:140px">
    <div style="font-size:9pt;color:#666">${d("baoCaoDoanhSo.kpi.donTrungBinh")}</div>
    <div style="font-size:14pt;font-weight:bold">${e(t.kpi.donTrungBinh)}</div>
  </div>
</div>`,x=`
<div style="font-family:${o()};font-size:10pt;color:#222;padding:20px;min-width:600px" id="bao-cao-doanh-so-content">
${u()}
<h1 style="font-size:16pt;text-align:center;margin:0 0 8px;font-family:${o()}">${d("baoCaoDoanhSo.reportTitle")}</h1>
<p style="font-size:10pt;color:#555;text-align:center;margin-bottom:8px;font-family:${o()}">${i}</p>
<p style="font-size:9pt;color:#888;margin-bottom:16px;font-family:${o()}">${n}</p>
<hr style="border:0;border-top:1px solid #ccc;margin:12px 0" />
${b}
${S(t.byThang,d)}
${D(t.byNhanVien,d)}
${z(t.byKhachHang,d)}
${v(t.bySanPham,d)}
</div>`,[{default:g}]=await Promise.all([m(()=>import("./jspdf.es.min-CgGRalH7.js").then(r=>r.j),__vite__mapDeps([0,1,2]))]),f=new g({orientation:"p",unit:"mm",format:"a4"}),l=document.createElement("div");l.style.cssText=`position:fixed;left:-9999px;top:0;width:210mm;padding:20px;font-family:${o()};font-size:10pt;background:#fff`,l.innerHTML=x,document.body.appendChild(l);try{await f.html(l,{callback:()=>{},html2canvas:{scale:.5,useCORS:!0},x:10,y:10,width:190,windowWidth:794});const r=f.output("blob"),h=URL.createObjectURL(r),s=document.createElement("a");s.href=h,s.download=`bao_cao_doanh_so_${a.dateFrom}_${a.dateTo}_${c()}.pdf`,s.click(),URL.revokeObjectURL(h)}finally{document.body.removeChild(l)}}export{T as exportBaoCaoDoanhSoToPdf};
