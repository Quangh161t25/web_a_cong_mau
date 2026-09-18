(function() {
  // Event-Driven & Pull-First Silent Background Sync for 5F ERP Template & Google Sheets
  
  const API_BASE = window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:3000';

  // Global Export Helper: Extract live repository state
  window.__EXPORT_LIVE_ERP_DATA__ = function() {
    const result = {};
    if (window.__ERP_REPOS__ && Array.isArray(window.__ERP_REPOS__)) {
      window.__ERP_REPOS__.forEach(repo => {
        if (repo.key && repo.data && Array.isArray(repo.data)) {
          result[repo.key] = repo.data;
        }
      });
    }
    const keys = [
      'TC_TaiKhoan', 'TC_ThuChi', 'TC_DeXuatChiPhi', 'TC_KeHoachChiPhi',
      'TC_DanhMucTaiChinh', 'TC_BaoCaoTongQuan', 'NhanSu', 'PhongBan',
      'ChiNhanh', 'KhachHang', 'TaiSan', 'QuanLyXe', 'KhoHang'
    ];
    keys.forEach(k => {
      if (!result[k]) {
        try {
          const s = localStorage.getItem('erp_repo_' + k);
          if (s) result[k] = JSON.parse(s);
        } catch(e) {}
      }
    });
    return result;
  };

  // Global Import Helper: Apply Google Sheets data into live repositories
  window.__IMPORT_LIVE_ERP_DATA__ = function(allData) {
    if (!allData) return;
    Object.entries(allData).forEach(([k, itemObj]) => {
      const items = Array.isArray(itemObj) ? itemObj : (itemObj.items && Array.isArray(itemObj.items) ? itemObj.items : null);
      if (items && items.length > 0) {
        try {
          localStorage.setItem('erp_repo_' + k, JSON.stringify(items));
        } catch(e) {}
        if (window.__ERP_REPOS__ && Array.isArray(window.__ERP_REPOS__)) {
          window.__ERP_REPOS__.forEach(repo => {
            if (repo.key === k) {
              repo.data = items;
            }
          });
        }
      }
    });
  };

  let pushDebounceTimer = null;
  let isPushing = false;

  // Real-time Push to Google Sheets (Only called when user modifies data)
  async function performPush() {
    if (isPushing) return;
    isPushing = true;
    try {
      const liveData = window.__EXPORT_LIVE_ERP_DATA__();
      const res = await fetch(`${API_BASE}/api/sheets/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liveData })
      });
      if (res.ok) {
        console.log('⚡ [Auto-Sync] Đã tự động cập nhật thay đổi lên Google Sheets!');
      }
    } catch(e) {
      // silent
    } finally {
      isPushing = false;
    }
  }

  function schedulePush() {
    if (pushDebounceTimer) clearTimeout(pushDebounceTimer);
    pushDebounceTimer = setTimeout(performPush, 1200);
  }

  // Real-time Pull from Google Sheets (Periodic check for changes made on Google Sheets)
  async function performPull() {
    try {
      const res = await fetch(`${API_BASE}/api/sheets/pull`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          window.__IMPORT_LIVE_ERP_DATA__(json.data);
          console.log('📥 [Auto-Sync] Đã đồng bộ dữ liệu mới nhất từ Google Sheets!');
        }
      }
    } catch(e) {}
  }

  // 1. Listen for user mutations in Web App UI
  window.addEventListener('erp-data-changed', schedulePush);

  // 2. Poll Google Sheets every 45s so edits made on Google Sheets flow into Web App
  setInterval(performPull, 45000);

  console.log('🟢 [5F ERP] Chế độ TỰ ĐỘNG ĐỒNG BỘ NGẦM (Always-On) đang hoạt động!');
})();
