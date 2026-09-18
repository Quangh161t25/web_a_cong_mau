const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-CgGRalH7.js","assets/index-DibejzpH.js","assets/index-Dj-O0o3j.css"])))=>i.map(i=>d[i]);
import{eM as u,eN as $,eO as T,d1 as t,aV as _,aW as z,b3 as C,bO as X,i as f}from"./index-DibejzpH.js";function r(a){return a==null?"—":String(a)}function L(){const a=X.getState().companyInfo,o=a.appLogo?`<img src="${a.appLogo}" alt="Logo" style="width:64px;height:64px;object-fit:contain;flex-shrink:0" />`:"",i=a.address?`${f.t("company.address")}: ${a.address}`:"",d=[];a.email&&d.push(`${f.t("company.email")}: ${a.email}`),a.phone&&d.push(`${f.t("company.phone")}: ${a.phone}`);const n=d.join(" · ");return`
<div style="display:flex;align-items:flex-start;gap:16px;padding-bottom:16px;margin-bottom:16px;border-bottom:2px solid #333;font-family:${t()}">
  ${o}
  <div style="flex:1;min-width:0">
    <div style="font-size:14pt;font-weight:bold;color:#111;text-transform:uppercase;letter-spacing:0.02em">${a.companyName}</div>
    ${i?`<p style="font-size:9pt;color:#444;margin:2px 0 0 0">${i}</p>`:""}
    ${n?`<p style="font-size:9pt;color:#444;margin:2px 0 0 0">${n}</p>`:""}
  </div>
</div>`}function P(a,o){const i=o("baoCaonhapXuatTon.reportTitle"),d=`${o("baoCaonhapXuatTon.period")}: ${a.dateFrom} – ${a.dateTo}`,n=C(new Date);return`
<div style="font-family:${t()};font-size:10pt;color:#222;padding:20px;min-width:600px" id="nxt-report-content">
${L()}
<h1 style="font-size:16pt;text-align:center;margin:0 0 8px;font-family:${t()}">${i}</h1>
<p style="font-size:10pt;color:#555;text-align:center;margin-bottom:12px;font-family:${t()}">${d}</p>
<p style="font-size:9pt;color:#888;margin-bottom:16px;font-family:${t()}">${n}</p>
<hr style="border:0;border-top:1px solid #ccc;margin:12px 0" />
{{BY_WAREHOUSE_TABLE}}
{{BY_PRODUCT_TABLE}}
{{PHIEU_TABLE}}
{{TON_TABLE}}
</div>`}function k(a,o){if(a.length===0)return"";const i=[o("baoCaonhapXuatTon.byWarehouse.maKho"),o("baoCaonhapXuatTon.byWarehouse.tenKho"),o("baoCaonhapXuatTon.byWarehouse.tonDauKy"),o("baoCaonhapXuatTon.byWarehouse.tongNhap"),o("baoCaonhapXuatTon.byWarehouse.tongXuat"),o("baoCaonhapXuatTon.byWarehouse.tonCuoiKy")].map(n=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${t()};background:#6366f1;color:#fff">${n}</th>`).join(""),d=a.map(n=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${r(n.ma_kho)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${r(n.ten_kho)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.ton_dau_ky.toLocaleString()}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.tong_nhap.toLocaleString()}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.tong_xuat.toLocaleString()}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.ton_cuoi_ky.toLocaleString()}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${t()}">${o("baoCaonhapXuatTon.byWarehouse.tenKho")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${t()};font-size:9pt"><thead><tr>${i}</tr></thead><tbody>${d}</tbody></table>`}function E(a,o){if(a.length===0)return"";const i=[o("baoCaonhapXuatTon.byProduct.maHang"),o("baoCaonhapXuatTon.byProduct.tenHang"),o("baoCaonhapXuatTon.byProduct.donViTinh"),o("baoCaonhapXuatTon.byProduct.tonDauKy"),o("baoCaonhapXuatTon.byProduct.tongNhap"),o("baoCaonhapXuatTon.byProduct.tongXuat"),o("baoCaonhapXuatTon.byProduct.tonCuoiKy")].map(n=>`<th style="padding:6px 8px;border:1px solid #ddd;text-align:left;font-size:9pt;font-family:${t()};background:#6366f1;color:#fff">${n}</th>`).join(""),d=a.slice(0,50).map(n=>`
    <tr>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${r(n.ma_hang)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${r(n.ten_hang)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${r(n.don_vi_tinh)}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.ton_dau_ky.toLocaleString()}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.tong_nhap.toLocaleString()}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.tong_xuat.toLocaleString()}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${n.ton_cuoi_ky.toLocaleString()}</td>
    </tr>`).join("");return`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${t()}">${o("baoCaonhapXuatTon.byProduct.tenHang")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${t()};font-size:9pt"><thead><tr>${i}</tr></thead><tbody>${d}</tbody></table>`}async function w(a,o){const[i,d,n]=await Promise.all([a.dateFrom&&a.dateTo?u(a):Promise.resolve({byWarehouse:[],byProduct:[]}),a.dateFrom&&a.dateTo?$(a):Promise.resolve([]),T(a)]),x=k(i.byWarehouse,o),c=E(i.byProduct,o);let h="";if(d.length>0){const p=[o("baoCaonhapXuatTon.chiTiet.soPhieu"),o("baoCaonhapXuatTon.chiTiet.ngay"),o("baoCaonhapXuatTon.chiTiet.loai"),o("baoCaonhapXuatTon.chiTiet.kho"),o("baoCaonhapXuatTon.chiTiet.trangThai")].map(e=>`<th style="padding:6px 8px;border:1px solid #ddd;font-size:9pt;font-family:${t()};background:#6366f1;color:#fff">${e}</th>`).join(""),l=d.slice(0,30).map(e=>`
      <tr>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${e.so_phieu}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${e.ngay}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${e.loai}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${r(e.ten_kho)}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${e.trang_thai}</td>
      </tr>`).join("");h=`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${t()}">${o("baoCaonhapXuatTon.tabs.chiTietPhieu")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${t()};font-size:9pt"><thead><tr>${p}</tr></thead><tbody>${l}</tbody></table>`}let y="";if(n.length>0){const p=[o("baoCaonhapXuatTon.tonThoiDiem.maKho"),o("baoCaonhapXuatTon.tonThoiDiem.tenKho"),o("baoCaonhapXuatTon.tonThoiDiem.maHang"),o("baoCaonhapXuatTon.tonThoiDiem.soLuong")].map(e=>`<th style="padding:6px 8px;border:1px solid #ddd;font-size:9pt;font-family:${t()};background:#6366f1;color:#fff">${e}</th>`).join(""),l=n.slice(0,40).map(e=>`
      <tr>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${e.ma_kho}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${e.ten_kho}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt">${e.ma_hang}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;font-family:${t()};font-size:9pt;text-align:right">${e.so_luong.toLocaleString()}</td>
      </tr>`).join("");y=`<h2 style="font-size:11pt;margin:16px 0 8px;font-family:${t()}">${o("baoCaonhapXuatTon.tabs.tonTaiThoiDiem")}</h2>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:${t()};font-size:9pt"><thead><tr>${p}</tr></thead><tbody>${l}</tbody></table>`}const m=P(a,o).replace("{{BY_WAREHOUSE_TABLE}}",x).replace("{{BY_PRODUCT_TABLE}}",c).replace("{{PHIEU_TABLE}}",h).replace("{{TON_TABLE}}",y),[{default:g}]=await Promise.all([_(()=>import("./jspdf.es.min-CgGRalH7.js").then(p=>p.j),__vite__mapDeps([0,1,2]))]),b=new g({orientation:"p",unit:"mm",format:"a4"}),s=document.createElement("div");s.style.cssText=`position:fixed;left:-9999px;top:0;width:210mm;padding:20px;font-family:${t()};font-size:10pt;background:#fff`,s.innerHTML=m,document.body.appendChild(s);try{await b.html(s,{callback:()=>{},html2canvas:{scale:.5,useCORS:!0},x:10,y:10,width:190,windowWidth:794});const p=b.output("blob"),l=URL.createObjectURL(p),e=document.createElement("a");e.href=l,e.download=`bao_cao_nhap_xuat_ton_${a.dateFrom}_${a.dateTo}_${z()}.pdf`,e.click(),URL.revokeObjectURL(l)}finally{document.body.removeChild(s)}}export{w as exportBaoCaoNXTToPdf};
