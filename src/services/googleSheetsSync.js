import fs from 'fs';
import https from 'https';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const CREDS_PATH = path.join(ROOT_DIR, 'google-credentials.json');
const SPREADSHEET_ID = '1D5_62bPEYPbHkmR6e8JQAfloPtfxxb9FLzKkII20-SU';

// Load credentials
let creds = null;
if (fs.existsSync(CREDS_PATH)) {
  try {
    creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  } catch (e) {
    console.error('Error reading google-credentials.json:', e);
  }
}

// Token cache
let cachedToken = null;
let tokenExpiresAt = 0;

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Get OAuth2 Access Token for Google Service Account
 */
export async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  if (!creds || !creds.client_email || !creds.private_key) {
    throw new Error('Google Credentials (google-credentials.json) chưa được thiết lập đúng!');
  }

  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claim = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: creds.token_uri || 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaim = base64UrlEncode(JSON.stringify(claim));
    const signInput = `${encodedHeader}.${encodedClaim}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signInput);
    sign.end();
    const signature = sign.sign(creds.private_key, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const jwt = `${signInput}.${signature}`;
    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    const parsedUrl = new URL(creds.token_uri || 'https://oauth2.googleapis.com/token');
    const req = https.request({
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            cachedToken = json.access_token;
            tokenExpiresAt = Date.now() + (json.expires_in || 3600) * 1000;
            resolve(cachedToken);
          } else {
            reject(new Error(json.error_description || 'Không lấy được access token'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Execute a Google Sheets REST API Request
 */
export async function callSheetsApi(endpoint, method = 'GET', body = null) {
  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${endpoint}`;
  const parsed = new URL(url);

  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    if (postData) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: method,
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data || '{}');
          if (res.statusCode >= 400) {
            return reject(new Error(json.error?.message || `API Error ${res.statusCode}: ${data}`));
          }
          resolve(json);
        } catch (e) {
          if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          else resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// Helper: Format Number with dots (1.250.000) for Google Sheets
export function formatVndNumber(v) {
  if (v === null || v === undefined || v === '') return '0';
  if (typeof v === 'number') return v.toLocaleString('vi-VN');
  const clean = String(v).replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.-]/g, '');
  const n = Number(clean);
  return isNaN(n) ? String(v) : n.toLocaleString('vi-VN');
}

// Helper: Parse Number from Google Sheets to JS Number
export function parseVndNumber(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return v;
  const clean = String(v).replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.-]/g, '');
  const n = Number(clean);
  return isNaN(n) ? 0 : n;
}

// Helper: Normalize Phone Number (Ensures leading 0 is preserved)
export function normalizePhone(v) {
  if (!v) return '';
  let str = String(v).trim().replace(/^'/, '').replace(/\s+/g, '');
  if (/^\d{8,11}$/.test(str) && !str.startsWith('0') && !str.startsWith('+')) {
    str = '0' + str;
  }
  return str;
}

// Helper: Clean String
export function cleanStr(v, fallback = '') {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim().replace(/^'/, '');
  return s === '---' || s === '-' ? fallback : s || fallback;
}

// ==========================================
// SCHEMAS & 2-WAY TYPE MAPPINGS FOR ALL 13 ERP MODULES
// ==========================================
export const ENTITY_SCHEMAS = {
  // ------------------------------------------
  // 1. TÀI CHÍNH: TÀI KHOẢN & QUỸ
  // ------------------------------------------
  'TC_TaiKhoan': {
    title: '🏦 TC - Tài Khoản & Quỹ',
    isFinance: true,
    headers: ['Mã / STK', 'Tên Tài Khoản', 'Loại Tài Khoản', 'Ngân Hàng', 'Số Tài Khoản', 'Chủ Tài Khoản', 'Tồn Đầu (VNĐ)', 'Tổng Thu (VNĐ)', 'Tổng Chi (VNĐ)', 'Dư Cuối / Hiện Tại (VNĐ)', 'Trạng Thái'],
    fields: ['so_tai_khoan', 'ten_tai_khoan', 'loai_tai_khoan', 'ngan_hang', 'so_tai_khoan', 'chu_tai_khoan', 'so_du_dau', 'tong_thu', 'tong_chi', 'so_du_cuoi', 'trang_thai'],
    mockFile: 'TC_TaiKhoan.json',
    formatter: (item) => {
      const loai = (item.loai_tai_khoan === 'ngan_hang' || item.loai_tai_khoan === 'Ngân hàng') ? 'Ngân hàng' : 'Tiền mặt';
      const stk = item.so_tai_khoan || item.id || '';
      return [
        String(stk),
        cleanStr(item.ten_tai_khoan),
        loai,
        cleanStr(item.ngan_hang, '---'),
        String(item.so_tai_khoan || stk),
        cleanStr(item.chu_tai_khoan, '---'),
        formatVndNumber(item.so_du_dau ?? 0),
        formatVndNumber(item.tong_thu ?? 0),
        formatVndNumber(item.tong_chi ?? 0),
        formatVndNumber(item.so_du_cuoi ?? item.so_du_hien_tai ?? 0),
        cleanStr(item.trang_thai, 'Đang hoạt động')
      ];
    },
    parser: (row, existingItem = {}) => {
      const loaiStr = String(row[2] || '').toLowerCase();
      const loai = (loaiStr.includes('ngân hàng') || loaiStr.includes('ngan_hang')) ? 'ngan_hang' : 'tien_mat';
      const soDuDau = parseVndNumber(row[6]);
      const tongThu = parseVndNumber(row[7]);
      const tongChi = parseVndNumber(row[8]);
      const soDuCuoi = parseVndNumber(row[9]);
      const nganHang = cleanStr(row[3]);
      const chuTk = cleanStr(row[5]);
      const stk = cleanStr(row[4] || row[0]);
      
      const bankCodes = { 'vietcombank': '970436', 'techcombank': '970407', 'bidv': '970418', 'mb': '970422', 'mb bank': '970422', 'acb': '970416', 'vpbank': '970432', 'vietinbank': '970415' };
      const maNganHang = bankCodes[nganHang.toLowerCase()] || existingItem.ma_ngan_hang || (loai === 'ngan_hang' ? '970436' : '');

      return {
        id: existingItem.id || `tk-${stk.toLowerCase()}`,
        ten_tai_khoan: cleanStr(row[1]),
        so_tai_khoan: stk,
        ngan_hang: nganHang,
        ma_ngan_hang: maNganHang,
        chu_tai_khoan: chuTk,
        loai_tai_khoan: loai,
        so_du_dau: soDuDau,
        tong_thu: tongThu,
        tong_chi: tongChi,
        so_du_cuoi: soDuCuoi,
        so_du_hien_tai: soDuCuoi,
        trang_thai: cleanStr(row[10], 'Đang hoạt động'),
        tg_tao: existingItem.tg_tao || new Date().toISOString(),
        tg_cap_nhat: new Date().toISOString()
      };
    },
    defaultData: [
      { id: 'tk-1', ten_tai_khoan: 'Quỹ tiền mặt', so_tai_khoan: 'CASH-001', ngan_hang: '', chu_tai_khoan: '', loai_tai_khoan: 'tien_mat', so_du_dau: 50000000, tong_thu: 125000000, tong_chi: 98000000, so_du_cuoi: 77000000, so_du_hien_tai: 77000000, trang_thai: 'Đang hoạt động' },
      { id: 'tk-2', ten_tai_khoan: 'Vietcombank - Công ty', so_tai_khoan: '0071001234567', ngan_hang: 'Vietcombank', ma_ngan_hang: '970436', chu_tai_khoan: 'CONG TY TNHH 5F', loai_tai_khoan: 'ngan_hang', so_du_dau: 500000000, tong_thu: 2850000000, tong_chi: 2100000000, so_du_cuoi: 1250000000, so_du_hien_tai: 1250000000, trang_thai: 'Đang hoạt động' },
      { id: 'tk-3', ten_tai_khoan: 'Techcombank - Công ty', so_tai_khoan: '19039876543210', ngan_hang: 'Techcombank', ma_ngan_hang: '970407', chu_tai_khoan: 'CONG TY TNHH 5F', loai_tai_khoan: 'ngan_hang', so_du_dau: 200000000, tong_thu: 980000000, tong_chi: 750000000, so_du_cuoi: 430000000, so_du_hien_tai: 430000000, trang_thai: 'Đang hoạt động' },
      { id: 'tk-4', ten_tai_khoan: 'Tài khoản tiết kiệm VCB', so_tai_khoan: '0071009999888', ngan_hang: 'Vietcombank', ma_ngan_hang: '970436', chu_tai_khoan: 'CONG TY TNHH 5F', loai_tai_khoan: 'ngan_hang', so_du_dau: 1000000000, tong_thu: 50000000, tong_chi: 0, so_du_cuoi: 1050000000, so_du_hien_tai: 1050000000, trang_thai: 'Đang hoạt động' },
      { id: 'tk-5', ten_tai_khoan: 'Tài khoản cũ (Đã đóng)', so_tai_khoan: '123456789', ngan_hang: 'BIDV', ma_ngan_hang: '970418', chu_tai_khoan: 'CONG TY TNHH 5F', loai_tai_khoan: 'ngan_hang', so_du_dau: 0, tong_thu: 0, tong_chi: 0, so_du_cuoi: 0, so_du_hien_tai: 0, trang_thai: 'Ngừng hoạt động' }
    ]
  },

  // ------------------------------------------
  // 2. TÀI CHÍNH: SỔ QUỸ & THU CHI
  // ------------------------------------------
  'TC_ThuChi': {
    title: '💰 TC - Sổ Quỹ & Thu Chi',
    isFinance: true,
    headers: ['Mã Giao Dịch', 'Ngày Giao Dịch', 'Loại Giao Dịch', 'Tài Khoản', 'Số Tiền (VNĐ)', 'Danh Mục Thu Chi', 'Người Thực Hiện', 'Nội Dung / Diễn Giải', 'Trạng Thái'],
    fields: ['ma_giao_dich', 'ngay_giao_dich', 'loai', 'ten_tai_khoan', 'so_tien', 'ten_danh_muc', 'ten_nhan_vien', 'noi_dung', 'trang_thai'],
    mockFile: 'TC_ThuChi.json',
    formatter: (item) => {
      const loai = item.loai === 'thu' ? 'Phiếu Thu' : (item.loai === 'chi' ? 'Phiếu Chi' : (item.loai === 'chuyen_quy' ? 'Chuyển Quỹ' : item.loai || 'Phiếu Thu'));
      const ngay = item.ngay_giao_dich ? String(item.ngay_giao_dich).slice(0, 10) : '';
      const trangThai = item.trang_thai === 'cho_duyet' ? 'Chờ duyệt' : 'Hoàn thành';
      return [
        cleanStr(item.ma_giao_dich || item.id),
        ngay,
        loai,
        cleanStr(item.ten_tai_khoan || item.id_tai_khoan),
        formatVndNumber(item.so_tien ?? 0),
        cleanStr(item.ten_danh_muc || item.id_danh_muc),
        cleanStr(item.ten_nhan_vien || item.id_nhan_vien_thuc_hien),
        cleanStr(item.noi_dung),
        trangThai
      ];
    },
    parser: (row, existingItem = {}) => {
      const loaiStr = String(row[2] || '').toLowerCase();
      let loai = 'thu';
      if (loaiStr.includes('chi')) loai = 'chi';
      else if (loaiStr.includes('quy') || loaiStr.includes('chuyển') || loaiStr.includes('chuyen')) loai = 'chuyen_quy';

      const trangThaiStr = String(row[8] || '').toLowerCase();
      const trangThai = trangThaiStr.includes('chờ') || trangThaiStr.includes('cho') ? 'cho_duyet' : 'hoan_thanh';

      return {
        id: existingItem.id || `gd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ma_giao_dich: cleanStr(row[0]),
        ngay_giao_dich: cleanStr(row[1]) || new Date().toISOString(),
        loai: loai,
        ten_tai_khoan: cleanStr(row[3]),
        id_tai_khoan: existingItem.id_tai_khoan || '',
        so_tien: parseVndNumber(row[4]),
        ten_danh_muc: cleanStr(row[5]),
        id_danh_muc: existingItem.id_danh_muc || '',
        ten_nhan_vien: cleanStr(row[6]),
        id_nhan_vien_thuc_hien: existingItem.id_nhan_vien_thuc_hien || '',
        noi_dung: cleanStr(row[7]),
        trang_thai: trangThai,
        tg_tao: existingItem.tg_tao || new Date().toISOString(),
        tg_cap_nhat: new Date().toISOString()
      };
    },
    defaultData: [
      { ma_giao_dich: 'TC-2026-001', ngay_giao_dich: '2026-09-15', loai: 'thu', ten_tai_khoan: 'Vietcombank - Công ty', so_tien: 150000000, ten_danh_muc: 'Doanh thu bán hàng & dịch vụ', ten_nhan_vien: 'Lê Minh Công', noi_dung: 'Khách hàng Tập đoàn ABC thanh toán hợp đồng', trang_thai: 'hoan_thanh' },
      { ma_giao_dich: 'TC-2026-002', ngay_giao_dich: '2026-09-14', loai: 'chi', ten_tai_khoan: 'Vietcombank - Công ty', so_tien: 45000000, ten_danh_muc: 'Chi phí thuê văn phòng', ten_nhan_vien: 'Trần Thị Mai', noi_dung: 'Thanh toán tiền văn phòng định kỳ', trang_thai: 'hoan_thanh' },
      { ma_giao_dich: 'TC-2026-003', ngay_giao_dich: '2026-09-12', loai: 'chi', ten_tai_khoan: 'Quỹ tiền mặt', so_tien: 12800000, ten_danh_muc: 'Chi phí văn phòng phẩm', ten_nhan_vien: 'Nguyễn Văn Thành', noi_dung: 'Mua thiết bị và văn phòng phẩm', trang_thai: 'hoan_thanh' },
      { ma_giao_dich: 'TC-2026-004', ngay_giao_dich: '2026-09-10', loai: 'chuyen_quy', ten_tai_khoan: 'Techcombank - Công ty', so_tien: 50000000, ten_danh_muc: 'Rút tiền nhập quỹ tiền mặt', ten_nhan_vien: 'Trần Thị Mai', noi_dung: 'Rút tiền gửi nhập quỹ chi tiêu thường xuyên', trang_thai: 'hoan_thanh' }
    ]
  },

  // ------------------------------------------
  // 3. TÀI CHÍNH: ĐỀ XUẤT CHI PHÍ
  // ------------------------------------------
  'TC_DeXuatChiPhi': {
    title: '📝 TC - Đề Xuất Chi Phí',
    isFinance: true,
    headers: ['Số Phiếu', 'Ngày Đề Xuất', 'Loại Đề Xuất', 'Người Đề Xuất', 'Tài Khoản Chi', 'Tổng Tiền (VNĐ)', 'Người Phê Duyệt', 'Trạng Thái Duyệt', 'Ghi Chú Duyệt'],
    fields: ['so_phieu', 'ngay', 'loai', 'ten_nguoi_de_xuat', 'ten_tai_khoan', 'tong_tien', 'ten_nguoi_duyet', 'trang_thai', 'ghi_chu_duyet'],
    mockFile: 'TC_DeXuatChiPhi.json',
    formatter: (item) => {
      const loai = item.loai === 'thu' ? 'Khoản Thu' : 'Khoản Chi';
      const ngay = item.ngay ? String(item.ngay).slice(0, 10) : '';
      return [
        cleanStr(item.so_phieu || item.id),
        ngay,
        loai,
        cleanStr(item.ten_nguoi_de_xuat || item.id_nguoi_de_xuat),
        cleanStr(item.ten_tai_khoan),
        formatVndNumber(item.tong_tien ?? item.so_tien ?? 0),
        cleanStr(item.ten_nguoi_duyet, '---'),
        cleanStr(item.trang_thai, 'Chờ duyệt'),
        cleanStr(item.ghi_chu_duyet || item.ghi_chu)
      ];
    },
    parser: (row, existingItem = {}) => {
      const loaiStr = String(row[2] || '').toLowerCase();
      const loai = loaiStr.includes('thu') ? 'thu' : 'chi';
      return {
        id: existingItem.id || `dxcp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        so_phieu: cleanStr(row[0]),
        ngay: cleanStr(row[1]) || new Date().toISOString().slice(0, 10),
        loai: loai,
        ten_nguoi_de_xuat: cleanStr(row[3]),
        id_nguoi_de_xuat: existingItem.id_nguoi_de_xuat || '',
        ten_tai_khoan: cleanStr(row[4]),
        tong_tien: parseVndNumber(row[5]),
        so_tien: parseVndNumber(row[5]),
        ten_nguoi_duyet: cleanStr(row[6]),
        id_nguoi_duyet: existingItem.id_nguoi_duyet || '',
        trang_thai: cleanStr(row[7], 'Chờ duyệt'),
        ghi_chu_duyet: cleanStr(row[8]),
        ghi_chu: cleanStr(row[8])
      };
    },
    defaultData: [
      { id: 'dxcp-1', so_phieu: 'DXCP-2026-001', ngay: '2026-09-10', loai: 'chi', ten_nguoi_de_xuat: 'Nguyễn Văn Thành', ten_tai_khoan: 'Vietcombank - Công ty', tong_tien: 85000000, so_tien: 85000000, ten_nguoi_duyet: 'Lê Minh Công', trang_thai: 'Đã phê duyệt', ghi_chu_duyet: 'Duyệt mua sắm hạ tầng thiết bị' },
      { id: 'dxcp-2', so_phieu: 'DXCP-2026-002', ngay: '2026-09-12', loai: 'chi', ten_nguoi_de_xuat: 'Trần Thị Mai', ten_tai_khoan: 'Techcombank - Công ty', tong_tien: 60000000, so_tien: 60000000, ten_nguoi_duyet: 'Lê Minh Công', trang_thai: 'Chờ duyệt', ghi_chu_duyet: 'Tổ chức sự kiện nội bộ' },
      { id: 'dxcp-3', so_phieu: 'DXCP-2026-003', ngay: '2026-09-14', loai: 'chi', ten_nguoi_de_xuat: 'Lê Hoàng Nam', ten_tai_khoan: 'Vietcombank - Công ty', tong_tien: 35000000, so_tien: 35000000, ten_nguoi_duyet: 'Lê Minh Công', trang_thai: 'Đã phê duyệt', ghi_chu_duyet: 'Chiến dịch quảng cáo số quý 3' }
    ]
  },

  // ------------------------------------------
  // 4. TÀI CHÍNH: KẾ HOẠCH & DỰ TOÁN
  // ------------------------------------------
  'TC_KeHoachChiPhi': {
    title: '📊 TC - Kế Hoạch & Dự Toán',
    isFinance: true,
    headers: ['Mã Kế Hoạch', 'Năm', 'Phòng Ban Áp Dụng', 'Khoản Mục Chi', 'Dự Toán Kế Hoạch (VNĐ)', 'Thực Chi (VNĐ)', 'Chênh Lệch Còn Lại (VNĐ)', 'Trạng Thái'],
    fields: ['ma_ke_hoach', 'nam', 'ten_phong_ban', 'khoan_muc', 'du_toan', 'thuc_chi', 'chenh_lech', 'trang_thai'],
    mockFile: 'TC_KeHoachChiPhi.json',
    formatter: (item) => {
      const dt = parseVndNumber(item.du_toan);
      const tc = parseVndNumber(item.thuc_chi);
      const cl = dt - tc;
      return [
        cleanStr(item.ma_ke_hoach || item.id),
        String(item.nam || 2026),
        cleanStr(item.ten_phong_ban || item.phong_ban),
        cleanStr(item.khoan_muc || item.ten_danh_muc),
        formatVndNumber(item.du_toan ?? 0),
        formatVndNumber(item.thuc_chi ?? 0),
        formatVndNumber(item.con_lai ?? cl),
        cleanStr(item.trang_thai, 'Đúng tiến độ')
      ];
    },
    parser: (row, existingItem = {}) => {
      const dt = parseVndNumber(row[4]);
      const tc = parseVndNumber(row[5]);
      const cl = parseVndNumber(row[6]) || (dt - tc);
      return {
        id: existingItem.id || `khcp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ma_ke_hoach: cleanStr(row[0]),
        nam: parseInt(row[1], 10) || 2026,
        ten_phong_ban: cleanStr(row[2]),
        khoan_muc: cleanStr(row[3]),
        du_toan: dt,
        thuc_chi: tc,
        con_lai: cl,
        trang_thai: cleanStr(row[7], 'Đúng tiến độ')
      };
    },
    defaultData: [
      { ma_ke_hoach: 'DT-2026-TECH', nam: 2026, ten_phong_ban: 'Phòng Kỹ thuật', khoan_muc: 'Hạ tầng Cloud & Thiết bị CNTT', du_toan: 500000000, thuc_chi: 320000000, con_lai: 180000000, trang_thai: 'Đúng tiến độ' },
      { ma_ke_hoach: 'DT-2026-MKT', nam: 2026, ten_phong_ban: 'Phòng Marketing', khoan_muc: 'Chi phí truyền thông & Ads', du_toan: 600000000, thuc_chi: 410000000, con_lai: 190000000, trang_thai: 'Đúng tiến độ' },
      { ma_ke_hoach: 'DT-2026-HR', nam: 2026, ten_phong_ban: 'Phòng Hành chính - Nhân sự', khoan_muc: 'Tuyển dụng, Đào tạo & Phúc lợi', du_toan: 400000000, thuc_chi: 215000000, con_lai: 185000000, trang_thai: 'Đúng tiến độ' },
      { ma_ke_hoach: 'DT-2026-OPS', nam: 2026, ten_phong_ban: 'Phòng Vận hành', khoan_muc: 'Chi phí thuê văn phòng & Tiện ích', du_toan: 800000000, thuc_chi: 540000000, con_lai: 260000000, trang_thai: 'Đúng tiến độ' }
    ]
  },

  // ------------------------------------------
  // 5. TÀI CHÍNH: DANH MỤC THU CHI
  // ------------------------------------------
  'TC_DanhMucTaiChinh': {
    title: '📑 TC - Danh Mục Thu Chi',
    isFinance: true,
    headers: ['Mã Danh Mục', 'Tên Danh Mục', 'Phân Loại', 'Thứ Tự', 'Trạng Thái', 'Mô Tả'],
    fields: ['ma_danh_muc', 'ten_danh_muc', 'loai', 'thu_tu', 'trang_thai', 'mo_ta'],
    mockFile: 'TC_DanhMucTaiChinh.json',
    formatter: (item) => {
      const loai = item.loai === 'thu' ? 'Khoản Thu' : (item.loai === 'chi' ? 'Khoản Chi' : item.loai || item.phan_loai || 'Khoản Thu');
      return [
        cleanStr(item.ma_danh_muc || item.id),
        cleanStr(item.ten_danh_muc),
        loai,
        String(item.thu_tu ?? 1),
        cleanStr(item.trang_thai, 'Đang hoạt động'),
        cleanStr(item.mo_ta)
      ];
    },
    parser: (row, existingItem = {}) => {
      const loaiStr = String(row[2] || '').toLowerCase();
      const loai = loaiStr.includes('thu') ? 'thu' : 'chi';
      return {
        id: existingItem.id || `dm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ma_danh_muc: cleanStr(row[0]),
        ten_danh_muc: cleanStr(row[1]),
        loai: loai,
        thu_tu: parseInt(row[3], 10) || 1,
        trang_thai: cleanStr(row[4], 'Đang hoạt động'),
        mo_ta: cleanStr(row[5])
      };
    },
    defaultData: [
      { ma_danh_muc: 'DT', ten_danh_muc: 'Doanh thu bán hàng & dịch vụ', loai: 'thu', thu_tu: 1, trang_thai: 'Đang hoạt động', mo_ta: 'Doanh thu kinh doanh cốt lõi' },
      { ma_danh_muc: 'DT-TC', ten_danh_muc: 'Thu lãi tiền gửi ngân hàng & Đầu tư', loai: 'thu', thu_tu: 2, trang_thai: 'Đang hoạt động', mo_ta: 'Doanh thu hoạt động tài chính' },
      { ma_danh_muc: 'CP-LUONG', ten_danh_muc: 'Chi lương & Phụ cấp nhân sự', loai: 'chi', thu_tu: 1, trang_thai: 'Đang hoạt động', mo_ta: 'Chi phí quỹ lương định kỳ' },
      { ma_danh_muc: 'CP-VP', ten_danh_muc: 'Chi phí thuê văn phòng', loai: 'chi', thu_tu: 2, trang_thai: 'Đang hoạt động', mo_ta: 'Chi phí cơ sở vật chất' },
      { ma_danh_muc: 'CP-MKT', ten_danh_muc: 'Chi phí Marketing & Quảng cáo', loai: 'chi', thu_tu: 3, trang_thai: 'Đang hoạt động', mo_ta: 'Chi phí truyền thông, tiếp thị' },
      { ma_danh_muc: 'CP-CCDC', ten_danh_muc: 'Chi mua sắm công cụ dụng cụ & máy móc', loai: 'chi', thu_tu: 4, trang_thai: 'Đang hoạt động', mo_ta: 'Chi phí trang thiết bị' }
    ]
  },

  // ------------------------------------------
  // 6. TÀI CHÍNH: BÁO CÁO P&L TỔNG HỢP
  // ------------------------------------------
  'TC_BaoCaoTongQuan': {
    title: '📈 TC - Báo Cáo P&L Tổng Hợp',
    isFinance: true,
    headers: ['Chỉ Tiêu Tài Chính', 'Kỳ Báo Cáo', 'Năm', 'Giá Trị Thực Hiện (VNĐ)', 'Kế Hoạch Dự Kiến (VNĐ)', 'Tỷ Lệ Hoàn Thành (%)', 'Nhận Xét & Đánh Giá'],
    fields: ['chi_tieu', 'ky', 'nam', 'thuc_hien', 'ke_hoach', 'ty_le', 'nhan_xet'],
    mockFile: 'TC_BaoCaoTongQuan.json',
    formatter: (item) => [
      cleanStr(item.chi_tieu),
      cleanStr(item.ky, 'Quý 3'),
      String(item.nam || 2026),
      formatVndNumber(item.thuc_hien ?? 0),
      formatVndNumber(item.ke_hoach ?? 0),
      cleanStr(item.ty_le),
      cleanStr(item.nhan_xet)
    ],
    parser: (row) => ({
      chi_tieu: cleanStr(row[0]),
      ky: cleanStr(row[1], 'Quý 3'),
      nam: parseInt(row[2], 10) || 2026,
      thuc_hien: parseVndNumber(row[3]),
      ke_hoach: parseVndNumber(row[4]),
      ty_le: cleanStr(row[5]),
      nhan_xet: cleanStr(row[6])
    }),
    defaultData: [
      { chi_tieu: '1. Tổng doanh thu bán hàng & Dịch vụ', ky: 'Quý 3', nam: 2026, thuc_hien: 4850000000, ke_hoach: 4500000000, ty_le: '107.8%', nhan_xet: 'Vượt chỉ tiêu kế hoạch quý 3' },
      { chi_tieu: '2. Các khoản giảm trừ doanh thu', ky: 'Quý 3', nam: 2026, thuc_hien: 50000000, ke_hoach: 80000000, ty_le: '62.5%', nhan_xet: 'Kiểm soát chiết khấu tốt' },
      { chi_tieu: '3. Doanh thu thuần', ky: 'Quý 3', nam: 2026, thuc_hien: 4800000000, ke_hoach: 4420000000, ty_le: '108.6%', nhan_xet: 'Tăng trưởng tốt' },
      { chi_tieu: '4. Giá vốn hàng bán & Dịch vụ', ky: 'Quý 3', nam: 2026, thuc_hien: 2150000000, ke_hoach: 2000000000, ty_le: '107.5%', nhan_xet: 'Định mức trong tầm kiểm soát' },
      { chi_tieu: '5. Lợi nhuận gộp', ky: 'Quý 3', nam: 2026, thuc_hien: 2650000000, ke_hoach: 2420000000, ty_le: '109.5%', nhan_xet: 'Biên lợi nhuận gộp đạt 55.2%' },
      { chi_tieu: '6. Chi phí bán hàng & Marketing', ky: 'Quý 3', nam: 2026, thuc_hien: 450000000, ke_hoach: 480000000, ty_le: '93.8%', nhan_xet: 'Tiết kiệm chi phí Marketing' },
      { chi_tieu: '7. Chi phí quản lý doanh nghiệp', ky: 'Quý 3', nam: 2026, thuc_hien: 680000000, ke_hoach: 700000000, ty_le: '97.1%', nhan_xet: 'Đạt định biên quản trị' },
      { chi_tieu: '8. Lợi nhuận thuần trước thuế', ky: 'Quý 3', nam: 2026, thuc_hien: 1520000000, ke_hoach: 1240000000, ty_le: '122.6%', nhan_xet: 'Lợi nhuận vượt mức kỳ vọng 22.6%' }
    ]
  },

  // ------------------------------------------
  // 7. NHÂN SỰ
  // ------------------------------------------
  'NhanSu': {
    title: '👥 Nhân sự',
    headers: ['ID / Mã', 'Mã Nhân Viên', 'Họ Và Tên', 'Email', 'Số Điện Thoại', 'Phòng Ban', 'Chức Vụ', 'Chi Nhánh', 'Giới Tính', 'Trạng Thái', 'Ngày Vào Làm'],
    fields: ['id', 'ma_nhan_vien', 'ho_ten', 'email', 'so_dien_thoai', 'ten_phong_ban', 'ten_chuc_vu', 'ten_chi_nhanh', 'gioi_tinh', 'trang_thai', 'ngay_vao_lam'],
    mockFile: 'employees.json',
    formatter: (item) => {
      const gt = item.gioi_tinh === 'nu' || item.gioi_tinh === 'Nữ' ? 'Nữ' : 'Nam';
      const phone = normalizePhone(item.so_dien_thoai);
      return [
        cleanStr(item.id || item.ma_nhan_vien),
        cleanStr(item.ma_nhan_vien || item.id),
        cleanStr(item.ho_ten || item.name),
        cleanStr(item.email),
        phone,
        cleanStr(item.ten_phong_ban || item.phong_ban),
        cleanStr(item.ten_chuc_vu || item.chuc_vu),
        cleanStr(item.ten_chi_nhanh || item.chi_nhanh),
        gt,
        cleanStr(item.trang_thai, 'Đang hoạt động'),
        item.ngay_vao_lam ? String(item.ngay_vao_lam).slice(0, 10) : ''
      ];
    },
    parser: (row, existingItem = {}) => {
      const gtStr = String(row[8] || '').toLowerCase();
      const gt = gtStr.includes('nữ') || gtStr.includes('nu') ? 'nu' : 'nam';
      const phone = normalizePhone(row[4]);
      return {
        id: existingItem.id || cleanStr(row[0]),
        ma_nhan_vien: cleanStr(row[1] || row[0]),
        ho_ten: cleanStr(row[2]),
        name: cleanStr(row[2]),
        email: cleanStr(row[3]),
        so_dien_thoai: phone,
        ten_phong_ban: cleanStr(row[5]),
        ten_chuc_vu: cleanStr(row[6]),
        ten_chi_nhanh: cleanStr(row[7]),
        gioi_tinh: gt,
        trang_thai: cleanStr(row[9], 'Đang hoạt động'),
        ngay_vao_lam: cleanStr(row[10])
      };
    },
    defaultData: [
      { id: 'emp-001', ma_nhan_vien: 'NV-001', ho_ten: 'Nguyễn Văn A', email: 'nguyenvana@thanhcong-group.vn', so_dien_thoai: '0903123456', ten_phong_ban: 'Phòng Kỹ thuật', ten_chuc_vu: 'Trưởng phòng', ten_chi_nhanh: 'Chi nhánh TP. Hồ Chí Minh', gioi_tinh: 'nam', trang_thai: 'Đang hoạt động', ngay_vao_lam: '2023-01-15' },
      { id: 'emp-002', ma_nhan_vien: 'NV-002', ho_ten: 'Trần Thị B', email: 'tranthib@thanhcong-group.vn', so_dien_thoai: '0918765432', ten_phong_ban: 'Phòng Tài chính - Kế toán', ten_chuc_vu: 'Kế toán trưởng', ten_chi_nhanh: 'Chi nhánh TP. Hồ Chí Minh', gioi_tinh: 'nu', trang_thai: 'Đang hoạt động', ngay_vao_lam: '2023-03-01' },
      { id: 'emp-003', ma_nhan_vien: 'NV-003', ho_ten: 'Lê Văn C', email: 'levanc@thanhcong-group.vn', so_dien_thoai: '0987654321', ten_phong_ban: 'Phòng Marketing', ten_chuc_vu: 'Chuyên viên Marketing', ten_chi_nhanh: 'Chi nhánh Hà Nội', gioi_tinh: 'nam', trang_thai: 'Đang hoạt động', ngay_vao_lam: '2023-06-10' }
    ]
  },

  // ------------------------------------------
  // 8. PHÒNG BAN
  // ------------------------------------------
  'PhongBan': {
    title: '🏛️ Phòng ban',
    headers: ['ID', 'Mã Phòng Ban', 'Tên Phòng Ban', 'Cấp Độ', 'Trạng Thái', 'Đường Dẫn'],
    fields: ['id', 'ma_phong_ban', 'ten_phong_ban', 'cap_do', 'trang_thai', 'duong_dan'],
    mockFile: 'departments.json',
    formatter: (item) => [
      cleanStr(item.id || item.ma_phong_ban),
      cleanStr(item.ma_phong_ban),
      cleanStr(item.ten_phong_ban),
      String(item.cap_do ?? 1),
      cleanStr(item.trang_thai, 'Đang hoạt động'),
      cleanStr(item.duong_dan)
    ],
    parser: (row, existingItem = {}) => ({
      id: existingItem.id || cleanStr(row[0]),
      ma_phong_ban: cleanStr(row[1] || row[0]),
      ten_phong_ban: cleanStr(row[2]),
      cap_do: parseInt(row[3], 10) || 1,
      trang_thai: cleanStr(row[4], 'Đang hoạt động'),
      duong_dan: cleanStr(row[5])
    }),
    defaultData: [
      { id: 'dep-0', ma_phong_ban: 'PB-GD', ten_phong_ban: 'Phòng Ban Giám đốc', cap_do: 1, trang_thai: 'Đang hoạt động', duong_dan: '/dep-0' },
      { id: 'dep-1', ma_phong_ban: 'PB-TECH', ten_phong_ban: 'Phòng Kỹ thuật', cap_do: 1, trang_thai: 'Đang hoạt động', duong_dan: '/dep-1' },
      { id: 'dep-2', ma_phong_ban: 'PB-HR', ten_phong_ban: 'Phòng Nhân sự', cap_do: 1, trang_thai: 'Đang hoạt động', duong_dan: '/dep-2' },
      { id: 'dep-3', ma_phong_ban: 'PB-FIN', ten_phong_ban: 'Phòng Tài chính - Kế toán', cap_do: 1, trang_thai: 'Đang hoạt động', duong_dan: '/dep-3' },
      { id: 'dep-4', ma_phong_ban: 'PB-SALE', ten_phong_ban: 'Phòng Kinh doanh', cap_do: 1, trang_thai: 'Đang hoạt động', duong_dan: '/dep-4' }
    ]
  },

  // ------------------------------------------
  // 9. CHI NHÁNH
  // ------------------------------------------
  'ChiNhanh': {
    title: '🏢 Chi nhánh',
    headers: ['ID', 'Mã Chi Nhánh', 'Tên Chi Nhánh', 'Mã Vùng', 'Địa Chỉ', 'Số Điện Thoại', 'Trạng Thái'],
    fields: ['id', 'ma_chi_nhanh', 'ten_chi_nhanh', 'ma_vung', 'dia_chi', 'so_dien_thoai', 'trang_thai'],
    mockFile: 'branches.json',
    formatter: (item) => [
      cleanStr(item.id || item.ma_chi_nhanh),
      cleanStr(item.ma_chi_nhanh),
      cleanStr(item.ten_chi_nhanh),
      cleanStr(item.ma_vung),
      cleanStr(item.dia_chi),
      normalizePhone(item.so_dien_thoai),
      cleanStr(item.trang_thai, 'Đang hoạt động')
    ],
    parser: (row, existingItem = {}) => ({
      id: existingItem.id || cleanStr(row[0]),
      ma_chi_nhanh: cleanStr(row[1] || row[0]),
      ten_chi_nhanh: cleanStr(row[2]),
      ma_vung: cleanStr(row[3]),
      dia_chi: cleanStr(row[4]),
      so_dien_thoai: normalizePhone(row[5]),
      trang_thai: cleanStr(row[6], 'Đang hoạt động')
    }),
    defaultData: [
      { id: 'branch-1', ma_chi_nhanh: 'CN-HCM', ten_chi_nhanh: 'Chi nhánh TP. Hồ Chí Minh', ma_vung: 'MN', dia_chi: 'Quận 1, TP. HCM', so_dien_thoai: '02838221122', trang_thai: 'Đang hoạt động' },
      { id: 'branch-2', ma_chi_nhanh: 'CN-HN', ten_chi_nhanh: 'Chi nhánh Hà Nội', ma_vung: 'MB', dia_chi: 'Cầu Giấy, Hà Nội', so_dien_thoai: '02437882233', trang_thai: 'Đang hoạt động' },
      { id: 'branch-3', ma_chi_nhanh: 'CN-DN', ten_chi_nhanh: 'Chi nhánh Đà Nẵng', ma_vung: 'MT', dia_chi: 'Hải Châu, Đà Nẵng', so_dien_thoai: '02363554455', trang_thai: 'Đang hoạt động' }
    ]
  },

  // ------------------------------------------
  // 10. KHÁCH HÀNG (CRM)
  // ------------------------------------------
  'KhachHang': {
    title: '💼 Khách hàng (CRM)',
    headers: ['ID', 'Mã Khách Hàng', 'Tên Khách Hàng', 'Số Điện Thoại', 'Email', 'Địa Chỉ', 'Phân Loại', 'Doanh Số (VNĐ)', 'Trạng Thái'],
    fields: ['id', 'ma_khach_hang', 'ten_khach_hang', 'so_dien_thoai', 'email', 'dia_chi', 'loai_khach_hang', 'doanh_so', 'trang_thai'],
    mockFile: 'KhachHang.json',
    formatter: (item) => [
      cleanStr(item.id || item.ma_khach_hang),
      cleanStr(item.ma_khach_hang),
      cleanStr(item.ten_khach_hang),
      normalizePhone(item.so_dien_thoai),
      cleanStr(item.email),
      cleanStr(item.dia_chi),
      cleanStr(item.loai_khach_hang, 'Doanh nghiệp'),
      formatVndNumber(item.doanh_so ?? 0),
      cleanStr(item.trang_thai, 'Đang hợp tác')
    ],
    parser: (row, existingItem = {}) => ({
      id: existingItem.id || cleanStr(row[0]),
      ma_khach_hang: cleanStr(row[1] || row[0]),
      ten_khach_hang: cleanStr(row[2]),
      so_dien_thoai: normalizePhone(row[3]),
      email: cleanStr(row[4]),
      dia_chi: cleanStr(row[5]),
      loai_khach_hang: cleanStr(row[6], 'Doanh nghiệp'),
      doanh_so: parseVndNumber(row[7]),
      trang_thai: cleanStr(row[8], 'Đang hợp tác')
    }),
    defaultData: [
      { id: 'kh-001', ma_khach_hang: 'KH-001', ten_khach_hang: 'Tập đoàn ABC', so_dien_thoai: '0289999888', email: 'contact@abc-group.vn', dia_chi: 'Quận 1, TP. HCM', loai_khach_hang: 'Doanh nghiệp VIP', doanh_so: 1250000000, trang_thai: 'Đang hợp tác' },
      { id: 'kh-002', ma_khach_hang: 'KH-002', ten_khach_hang: 'Công ty TNHH Minh Phát', so_dien_thoai: '0243333222', email: 'info@minhphat.com', dia_chi: 'Cầu Giấy, Hà Nội', loai_khach_hang: 'Khách hàng thân thiết', doanh_so: 450000000, trang_thai: 'Đang hợp tác' },
      { id: 'kh-003', ma_khach_hang: 'KH-003', ten_khach_hang: 'Nguyễn Hoàng Long', so_dien_thoai: '0912345678', email: 'long.nh@gmail.com', dia_chi: 'Hải Châu, Đà Nẵng', loai_khach_hang: 'Cá nhân', doanh_so: 65000000, trang_thai: 'Tiềm năng' }
    ]
  },

  // ------------------------------------------
  // 11. TÀI SẢN & THIẾT BỊ
  // ------------------------------------------
  'TaiSan': {
    title: '📦 Tài sản & Thiết bị',
    headers: ['ID', 'Mã Thiết Bị', 'Tên Thiết Bị', 'Loại Tài Sản', 'Người Sử Dụng', 'Phòng Ban', 'Nguyên Giá (VNĐ)', 'Trạng Thái'],
    fields: ['id', 'ma_tai_san', 'ten_tai_san', 'loai_tai_san', 'nguoi_giu', 'phong_ban', 'nguyen_gia', 'trang_thai'],
    mockFile: 'TaiSan.json',
    formatter: (item) => [
      cleanStr(item.id || item.ma_tai_san),
      cleanStr(item.ma_tai_san),
      cleanStr(item.ten_tai_san),
      cleanStr(item.loai_tai_san, 'Thiết bị văn phòng'),
      cleanStr(item.nguoi_giu || item.ten_nguoi_su_dung, '---'),
      cleanStr(item.phong_ban || item.ten_phong_ban, '---'),
      formatVndNumber(item.nguyen_gia ?? 0),
      cleanStr(item.trang_thai, 'Đang sử dụng')
    ],
    parser: (row, existingItem = {}) => ({
      id: existingItem.id || cleanStr(row[0]),
      ma_tai_san: cleanStr(row[1] || row[0]),
      ten_tai_san: cleanStr(row[2]),
      loai_tai_san: cleanStr(row[3], 'Thiết bị văn phòng'),
      nguoi_giu: cleanStr(row[4]),
      ten_nguoi_su_dung: cleanStr(row[4]),
      phong_ban: cleanStr(row[5]),
      ten_phong_ban: cleanStr(row[5]),
      nguyen_gia: parseVndNumber(row[6]),
      trang_thai: cleanStr(row[7], 'Đang sử dụng')
    }),
    defaultData: [
      { id: 'ts-001', ma_tai_san: 'MBP-2023-01', ten_tai_san: 'MacBook Pro 16 inch M2 Max', loai_tai_san: 'Máy tính xách tay', nguoi_giu: 'Nguyễn Văn Thành', phong_ban: 'Phòng Kỹ thuật', nguyen_gia: 75000000, trang_thai: 'Đang sử dụng' },
      { id: 'ts-002', ma_tai_san: 'SRV-DELL-02', ten_tai_san: 'Máy chủ Dell PowerEdge R750', loai_tai_san: 'Thiết bị mạng & Server', nguoi_giu: 'Trần Thị Mai', phong_ban: 'Phòng Kỹ thuật', nguyen_gia: 180000000, trang_thai: 'Đang hoạt động' },
      { id: 'ts-003', ma_tai_san: 'PRN-CANON-01', ten_tai_san: 'Máy in Canon Laser đa chức năng', loai_tai_san: 'Thiết bị văn phòng', nguoi_giu: 'Lê Minh Công', phong_ban: 'Phòng Hành chính', nguyen_gia: 18500000, trang_thai: 'Đang sử dụng' }
    ]
  },

  // ------------------------------------------
  // 12. ĐỘI XE & PHƯƠNG TIỆN
  // ------------------------------------------
  'QuanLyXe': {
    title: '🚗 Đội xe & Phương tiện',
    headers: ['ID', 'Biển Số', 'Tên Xe / Dòng Xe', 'Loại Xe', 'Số KM Hiện Tại', 'Lái Xe Phụ Trách', 'Hạn Đăng Kiểm', 'Trạng Thái'],
    fields: ['id', 'bien_so', 'ten_xe', 'loai_xe', 'so_km', 'lai_xe', 'ngay_het_han_dang_kiem', 'trang_thai'],
    mockFile: 'QuanLyXe.json',
    formatter: (item) => [
      cleanStr(item.id || item.bien_so),
      cleanStr(item.bien_so),
      cleanStr(item.ten_xe),
      cleanStr(item.loai_xe, 'Xe 4 chỗ VIP'),
      formatVndNumber(item.so_km ?? 0),
      cleanStr(item.lai_xe || item.ten_lai_xe, '---'),
      item.ngay_het_han_dang_kiem ? String(item.ngay_het_han_dang_kiem).slice(0, 10) : '',
      cleanStr(item.trang_thai, 'Sẵn sàng')
    ],
    parser: (row, existingItem = {}) => ({
      id: existingItem.id || cleanStr(row[0]),
      bien_so: cleanStr(row[1] || row[0]),
      ten_xe: cleanStr(row[2]),
      loai_xe: cleanStr(row[3], 'Xe 4 chỗ VIP'),
      so_km: parseVndNumber(row[4]),
      lai_xe: cleanStr(row[5]),
      ten_lai_xe: cleanStr(row[5]),
      ngay_het_han_dang_kiem: cleanStr(row[6]),
      trang_thai: cleanStr(row[7], 'Sẵn sàng')
    }),
    defaultData: [
      { id: 'xe-01', bien_so: '51H-888.99', ten_xe: 'Toyota Camry 2.5Q', loai_xe: 'Xe 4 chỗ VIP', so_km: 35400, lai_xe: 'Nguyễn Văn Thành', ngay_het_han_dang_kiem: '2026-12-31', trang_thai: 'Sẵn sàng' },
      { id: 'xe-02', bien_so: '51F-678.90', ten_xe: 'Ford Transit 16 chỗ', loai_xe: 'Xe đưa đón', so_km: 82150, lai_xe: 'Lê Hoàng Nam', ngay_het_han_dang_kiem: '2026-10-15', trang_thai: 'Đang công tác' },
      { id: 'xe-03', bien_so: '50A-123.45', ten_xe: 'Isuzu Forward 5 Tấn', loai_xe: 'Xe tải vận chuyển', so_km: 110200, lai_xe: 'Phạm Minh Tuấn', ngay_het_han_dang_kiem: '2026-08-20', trang_thai: 'Bảo dưỡng' }
    ]
  },

  // ------------------------------------------
  // 13. KHO VẬN & TỒN KHO
  // ------------------------------------------
  'KhoHang': {
    title: '🏬 Kho vận & Tồn kho',
    headers: ['ID', 'Mã Vật Tư', 'Tên Hàng Hóa / Vật Tư', 'Đơn Vị Tính', 'Số Lượng Tồn', 'Vị Trí Kho', 'Đơn Giá (VNĐ)', 'Trạng Thái Tồn'],
    fields: ['id', 'ma_vat_tu', 'ten_vat_tu', 'dvt', 'so_luong_ton', 'kho', 'don_gia', 'trang_thai'],
    mockFile: 'KhoHang.json',
    formatter: (item) => [
      cleanStr(item.id || item.ma_vat_tu || item.ma_hang_hoa),
      cleanStr(item.ma_vat_tu || item.ma_hang_hoa),
      cleanStr(item.ten_vat_tu || item.ten_hang_hoa),
      cleanStr(item.dvt || item.don_vi_tinh, 'Cái'),
      formatVndNumber(item.so_luong_ton ?? 0),
      cleanStr(item.kho || item.ten_kho, 'Kho Tổng TP.HCM'),
      formatVndNumber(item.don_gia ?? 0),
      cleanStr(item.trang_thai, 'Đủ tồn kho')
    ],
    parser: (row, existingItem = {}) => ({
      id: existingItem.id || cleanStr(row[0]),
      ma_vat_tu: cleanStr(row[1] || row[0]),
      ten_vat_tu: cleanStr(row[2]),
      dvt: cleanStr(row[3], 'Cái'),
      so_luong_ton: parseVndNumber(row[4]),
      kho: cleanStr(row[5], 'Kho Tổng TP.HCM'),
      don_gia: parseVndNumber(row[6]),
      trang_thai: cleanStr(row[7], 'Đủ tồn kho')
    }),
    defaultData: [
      { id: 'kho-001', ma_vat_tu: 'VT-001', ten_vat_tu: 'Màn hình Dell UltraSharp 27 inch 4K', dvt: 'Cái', so_luong_ton: 45, kho: 'Kho Tổng TP.HCM', don_gia: 12500000, trang_thai: 'Đủ tồn kho' },
      { id: 'kho-002', ma_vat_tu: 'VT-002', ten_vat_tu: 'Bàn phím cơ không dây công thái học', dvt: 'Chiếc', so_luong_ton: 120, kho: 'Kho Tổng TP.HCM', don_gia: 2850000, trang_thai: 'Đủ tồn kho' },
      { id: 'kho-003', ma_vat_tu: 'VT-003', ten_vat_tu: 'Giấy in Double A A4 80gsm (Thùng 5 Ram)', dvt: 'Thùng', so_luong_ton: 18, kho: 'Kho Văn Phòng', don_gia: 340000, trang_thai: 'Sắp hết hàng' }
    ]
  }
};

/**
 * Get current ERP entity data from local mock json or defaults
 */
export function getLocalEntityData(entityKey) {
  const schema = ENTITY_SCHEMAS[entityKey];
  if (!schema) return [];

  const fileName = schema.mockFile || `${entityKey}.json`;
  const filePath = path.join(ROOT_DIR, 'src', 'mock', fileName);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.error(`Error loading mock file ${fileName}:`, e);
    }
  }
  return schema.defaultData || [];
}

/**
 * Save updated entity data to local mock file (Safely written in UTF-8)
 */
export function saveLocalEntityData(entityKey, data) {
  const schema = ENTITY_SCHEMAS[entityKey];
  if (!schema) return false;

  const mockDir = path.join(ROOT_DIR, 'src', 'mock');
  if (!fs.existsSync(mockDir)) fs.mkdirSync(mockDir, { recursive: true });

  const fileName = schema.mockFile || `${entityKey}.json`;
  const filePath = path.join(mockDir, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch(e) {
    return false;
  }
}

/**
 * Initialize Google Sheets Structure (Create Tabs, Set Text Column Formats & Header Colors)
 */
export async function initializeSheetStructure() {
  console.log('🔄 Đang kiểm tra cấu trúc bảng tính Google Sheet...');
  const meta = await callSheetsApi('');
  const existingSheets = (meta.sheets || []).map(s => ({
    id: s.properties.sheetId,
    title: s.properties.title
  }));
  const existingTitles = new Set(existingSheets.map(s => s.title));

  const addSheetRequests = [];
  const formatRequests = [];

  for (const [key, schema] of Object.entries(ENTITY_SCHEMAS)) {
    let sheetId = null;
    if (!existingTitles.has(schema.title)) {
      sheetId = Math.floor(100000000 + Math.random() * 900000000);
      addSheetRequests.push({
        addSheet: {
          properties: {
            sheetId: sheetId,
            title: schema.title,
            gridProperties: {
              rowCount: 500,
              columnCount: schema.headers.length + 2,
              frozenRowCount: 1
            }
          }
        }
      });
    } else {
      const found = existingSheets.find(s => s.title === schema.title);
      if (found) sheetId = found.id;
    }

    // Header & Column formatting
    if (sheetId !== null) {
      const isFinance = schema.isFinance || key.startsWith('TC_');
      
      // Header row styling
      formatRequests.push({
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: schema.headers.length
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: isFinance 
                ? { red: 0.05, green: 0.45, blue: 0.35 } // Emerald theme for Finance
                : { red: 0.1, green: 0.35, blue: 0.75 }, // Blue theme for Other ERP
              textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
              horizontalAlignment: 'CENTER',
              verticalAlignment: 'MIDDLE'
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
        }
      });

      // Format all data cells (rows 1-500) as TEXT so leading zeros are NEVER stripped
      formatRequests.push({
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 1,
            endRowIndex: 500,
            startColumnIndex: 0,
            endColumnIndex: schema.headers.length
          },
          cell: {
            userEnteredFormat: {
              numberFormat: {
                type: 'TEXT'
              }
            }
          },
          fields: 'userEnteredFormat.numberFormat'
        }
      });

      // Auto resize columns
      formatRequests.push({
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 0,
            endIndex: schema.headers.length
          }
        }
      });
    }
  }

  // Execute sheet creation
  if (addSheetRequests.length > 0) {
    await callSheetsApi(':batchUpdate', 'POST', { requests: addSheetRequests });
    console.log(`✨ Đã tạo thêm ${addSheetRequests.length} sheet mới!`);
  }

  // Execute formatting
  if (formatRequests.length > 0) {
    await callSheetsApi(':batchUpdate', 'POST', { requests: formatRequests });
    console.log('🎨 Đã định dạng màu sắc & căn chỉnh Header các sheet!');
  }

  return { success: true, message: 'Khởi tạo cấu trúc bảng tính thành công' };
}

/**
 * Push All Local ERP Datasets to Google Sheets (Supports liveData from Frontend)
 */
export async function pushAllToSheets(liveData = null) {
  await initializeSheetStructure();
  console.log('🚀 Đang đẩy dữ liệu ERP lên Google Sheets...');

  // First clear old data ranges for safety
  const clearRanges = Object.values(ENTITY_SCHEMAS).map(s => `'${s.title}'!A1:Z500`);
  try {
    await callSheetsApi('/values:batchClear', 'POST', { ranges: clearRanges });
  } catch (e) {}

  const valueRanges = [];

  for (const [key, schema] of Object.entries(ENTITY_SCHEMAS)) {
    let dataList = [];
    if (liveData && Array.isArray(liveData[key]) && liveData[key].length > 0) {
      dataList = liveData[key];
      saveLocalEntityData(key, dataList);
    } else {
      dataList = getLocalEntityData(key);
    }

    const rows = [schema.headers];

    dataList.forEach(item => {
      let row;
      if (typeof schema.formatter === 'function') {
        row = schema.formatter(item);
      } else {
        row = schema.fields.map(field => {
          const val = item[field];
          return val === null || val === undefined ? '' : String(val);
        });
      }
      rows.push(row);
    });

    valueRanges.push({
      range: `'${schema.title}'!A1:${String.fromCharCode(65 + schema.headers.length - 1)}${rows.length}`,
      values: rows
    });
  }

  // Batch update values using RAW to preserve exact text format (leading zeros)
  await callSheetsApi('/values:batchUpdate', 'POST', {
    valueInputOption: 'RAW',
    data: valueRanges
  });

  console.log('✅ Đã đồng bộ đẩy toàn bộ 13 phân hệ dữ liệu lên Google Sheets thành công!');
  return {
    success: true,
    pushedAt: new Date().toISOString(),
    tablesCount: Object.keys(ENTITY_SCHEMAS).length,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`
  };
}

/**
 * Pull All Updated Data from Google Sheets to Local ERP (With Proper Type Conversions)
 */
export async function pullAllFromSheets() {
  console.log('📥 Đang kéo dữ liệu từ Google Sheets về Web App...');
  const ranges = Object.values(ENTITY_SCHEMAS).map(s => `'${s.title}'!A1:Z500`);
  const rangeQuery = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');

  const res = await callSheetsApi(`/values:batchGet?${rangeQuery}`);
  const results = {};

  (res.valueRanges || []).forEach(vr => {
    const sheetTitleMatch = vr.range.match(/^'?([^'!]+)'?!/);
    if (!sheetTitleMatch) return;
    const sheetTitle = sheetTitleMatch[1];

    // Find schema by title
    const entry = Object.entries(ENTITY_SCHEMAS).find(([k, s]) => s.title === sheetTitle);
    if (!entry) return;

    const [key, schema] = entry;
    const values = vr.values || [];
    if (values.length < 2) {
      results[key] = { count: 0, items: [] };
      return;
    }

    const currentData = getLocalEntityData(key);
    const rows = values.slice(1);
    const items = rows.map((r, idx) => {
      const existingItem = currentData[idx] || {};
      if (typeof schema.parser === 'function') {
        return schema.parser(r, existingItem);
      }
      const obj = { id: existingItem.id || `sheet-${idx + 1}` };
      schema.fields.forEach((f, cIdx) => {
        obj[f] = r[cIdx] !== undefined ? r[cIdx] : '';
      });
      return obj;
    });

    // Save locally
    saveLocalEntityData(key, items);
    results[key] = { count: items.length, items };
  });

  console.log('✅ Đã kéo dữ liệu từ Google Sheets về Web App thành công!');
  return {
    success: true,
    pulledAt: new Date().toISOString(),
    data: results
  };
}

/**
 * Get Google Sheets Sync Status Summary
 */
export async function getSyncStatus() {
  try {
    const meta = await callSheetsApi('');
    const sheets = (meta.sheets || []).map(s => ({
      title: s.properties.title,
      id: s.properties.sheetId,
      rows: s.properties.gridProperties?.rowCount,
      cols: s.properties.gridProperties?.columnCount
    }));

    return {
      connected: true,
      spreadsheetId: SPREADSHEET_ID,
      title: meta.properties?.title,
      url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
      serviceAccount: creds?.client_email,
      sheetsCount: sheets.length,
      sheets: sheets,
      lastChecked: new Date().toISOString()
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      spreadsheetId: SPREADSHEET_ID,
      serviceAccount: creds?.client_email
    };
  }
}
