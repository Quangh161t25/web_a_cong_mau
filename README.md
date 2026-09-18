# 🏢 5F Template - Ứng Dụng Mẫu Quản Lý ERP

> Bản sao đầy đủ toàn bộ mã nguồn, dữ liệu mẫu, giao diện và chức năng của hệ thống ERP **5F Template**.

---

## 🔑 Thông Tin Đăng Nhập Mặc Định

| Mục | Thông tin |
| :--- | :--- |
| **Đường dẫn** | `http://localhost:3000/dang-nhap` hoặc `http://localhost:3344/dang-nhap` |
| **Tài khoản (Email)** | `admin@5fedu.com` |
| **Mật khẩu (Password)** | `123456` |
| **Tên người dùng** | Lê Minh Công |
| **Vai trò (Role)** | Quản trị viên tối cao (Admin) |

---

## 🚀 Hướng Dẫn Khởi Chạy

### Cách 1: Chạy máy chủ tức thì (Không cần cài thêm gói npm)
```bash
node serve.js
```
Truy cập trình duyệt tại: **`http://localhost:3000`** hoặc **`http://localhost:3000/dang-nhap`**

### Cách 2: Chạy với Vite Dev Server
```bash
npm install
npm run dev
```

---

## 📦 Danh Sách Các Phân Hệ & Chức Năng Đã Sao Chép Đầy Đủ

### 1. 🏛️ Phân Hệ Hành Chính (`/hanh-chinh`)
- **Quản lý Thiết bị & Tài sản**:
  - Danh mục thiết bị, nhóm tài sản, mã định danh thiết bị.
  - Nghiệp vụ cấp phát / thu hồi tài sản theo nhân viên/phòng ban.
  - Quản lý bảo trì, sửa chữa, thay thế linh kiện, phụ tùng.
  - Khấu hao tài sản theo kỳ (tháng/năm), tính giá trị còn lại.
  - Đợt kiểm kê tài sản thực tế, xử lý chênh lệch kiểm kê.
  - In tem mã vạch (Barcode / QR Code) cho từng thiết bị.
  - Tra cứu nhanh thông tin thiết bị qua mã QR.
- **Quản lý Xe & Đội xe**:
  - Danh sách phương tiện (xe ô tô, xe tải, xe máy công tác).
  - Lịch trình sử dụng xe, điều phối lộ trình di chuyển.
  - Quản lý hồ sơ lái xe, hạn bằng lái, thông tin bằng cấp.
  - Nhật ký bảo dưỡng, sửa chữa định kỳ, thay thế phụ tùng.
  - Quản lý chi phí xăng dầu, định mức tiêu hao nhiên liệu (L/100km).
  - Báo cáo thống kê chi phí xe & tần suất hoạt động.
- **Quản lý Phòng họp & Văn phòng phẩm**:
  - Đặt lịch phòng họp, kiểm tra trạng thái phòng trống.
  - Danh mục VPP, đề xuất cấp phát, theo dõi tồn kho văn phòng phẩm.

---

### 2. 👥 Phân Hệ Nhân Sự (`/nhan-su`)
- **Sơ đồ tổ chức & Cơ cấu**:
  - Cây cơ cấu tổ chức trực quan (Organization Chart).
  - Quản lý danh mục phòng ban, đơn vị trực thuộc, chi nhánh.
  - Quản lý danh mục chức vụ, định biên nhân sự.
- **Hồ sơ nhân sự**:
  - Quản lý hồ sơ nhân viên đầy đủ (thông tin cá nhân, liên hệ, CCCD, MST, tài khoản ngân hàng).
  - Quá trình công tác, hợp đồng lao động (thử việc, chính thức, thời hạn).
  - Khen thưởng, kỷ luật, đánh giá định kỳ.
- **Tuyển dụng & Đào tạo**:
  - Kế hoạch tuyển dụng, tin tuyển dụng, kênh ứng tuyển.
  - Quản lý ứng viên qua từng vòng phỏng vấn, mẫu email phản hồi tự động.
  - Kế hoạch và lịch đào tạo nội bộ / chuyên môn.
- **Chấm công & Nghỉ phép**:
  - Bảng chấm công theo ngày/tháng, phân ca làm việc.
  - Quản lý đơn xin nghỉ phép, đơn làm thêm giờ (OT), duyệt phép trực tuyến.
- **Bảng lương & Bảo hiểm**:
  - Công thức tính lương tự động, phụ cấp, thưởng, giảm trừ gia cảnh.
  - Phiếu lương điện tử (Payslip) chi tiết từng nhân viên.
  - Quản lý trích đóng BHXH, BHYT, BHTN và Thuế TNCN.
- **Đánh giá KPI & Hiệu suất**:
  - Thiết lập bộ tiêu chí KPI theo phòng ban và vị trí.
  - Chu kỳ đánh giá tháng/quý/năm, tính điểm và xếp loại nhân viên.

---

### 3. ⚙️ Phân Hệ Vận Hành & Dự Án (`/van-hanh`)
- **Quản lý Dự án & Tiến độ**:
  - Danh sách dự án, phân loại trạng thái (Lập kế hoạch, Đang thực hiện, Tạm dừng, Hoàn thành).
  - Xem tiến độ qua Kanban Board, Gantt Chart, Task List.
- **Quản lý Công việc & Nhiệm vụ**:
  - Giao việc cho từng thành viên, đặt deadline, độ ưu tiên (Gấp, Cao, Trung bình, Thấp).
  - Đính kèm file tài liệu, bình luận và cập nhật % hoàn thành.
- **Quy trình Phê duyệt (BPMN Workflow)**:
  - Thiết lập luồng duyệt đa cấp (Trưởng phòng ➔ Kế toán ➔ Ban giám đốc).
  - Quản lý kho tài liệu số, biểu mẫu nội bộ.

---

### 4. 💼 Phân Hệ Kinh Doanh (CRM & Sales) (`/kinh-doanh`)
- **Quản lý Khách hàng (CRM)**:
  - Khách hàng doanh nghiệp (B2B) và khách hàng cá nhân (B2C).
  - Lịch sử tương tác, chăm sóc khách hàng, ghi chú cuộc gọi/gặp mặt.
- **Cơ hội bán hàng (Sales Pipeline)**:
  - Phễu bán hàng qua từng giai đoạn (Tiếp cận ➔ Đề xuất ➔ Đàm phán ➔ Chốt deal).
- **Báo giá & Đơn đặt hàng (Sales Orders)**:
  - Tạo báo giá chuyên nghiệp, tính chiết khấu, thuế VAT, in xuất PDF.
  - Quản lý đơn hàng bán lẻ / hợp đồng thương mại.
- **Doanh số & Hoa hồng**:
  - Chỉ tiêu doanh số (KPI Sales) cho từng nhân viên kinh doanh.
  - Bảng tính hoa hồng bán hàng tự động theo tỷ lệ doanh số.

---

### 5. 📢 Phân Hệ Marketing (`/marketing`)
- **Chiến dịch Marketing (Campaigns)**:
  - Lập kế hoạch chiến dịch theo kênh (Facebook, Google Ads, TikTok, Email, Sự kiện).
  - Quản lý ngân sách marketing dự kiến vs thực tế.
- **Quản lý Leads**:
  - Thu thập danh sách khách hàng tiềm năng.
  - Phân bổ lead tự động cho nhân viên tư vấn.
- **Báo cáo & Phân tích ROI**:
  - Đo lường chi phí trên mỗi lead (CPL), chi phí mỗi chuyển đổi (CPA) và chỉ số hoàn vốn đầu tư (ROI).

---

### 6. 💰 Phân Hệ Tài Chính - Kế Toán (`/tai-chinh`)
- **Quản lý Quỹ & Tài khoản ngân hàng**:
  - Sổ quỹ tiền mặt, danh sách tài khoản ngân hàng doanh nghiệp.
  - Đối soát số dư tức thời.
- **Thu & Chi**:
  - Lập phiếu thu, phiếu chi, phân loại danh mục thu chi.
  - Quy trình duyệt chi và chứng từ đính kèm.
- **Quản lý Công nợ**:
  - Công nợ phải thu khách hàng (Accounts Receivable).
  - Công nợ phải trả nhà cung cấp (Accounts Payable).
  - Báo cáo tuổi nợ (Aging Debt Report), cảnh báo nợ quá hạn.
- **Báo cáo Tài chính & Ngân sách**:
  - Báo cáo kết quả hoạt động kinh doanh (P&L).
  - Báo cáo lưu chuyển tiền tệ (Cash Flow).
  - Quản lý hạn mức ngân sách phòng ban.

---

### 7. 🛒 Phân Hệ Mua Hàng (`/mua-hang`)
- **Hồ sơ Nhà cung cấp**:
  - Danh bạ NCC, ngành hàng cung cấp, đánh giá chất lượng và mức độ uy tín.
- **Yêu cầu & Đơn mua hàng (PR / PO)**:
  - Tạo đề xuất mua hàng (Purchase Requisition).
  - Tạo đơn đặt hàng mua (Purchase Order) gửi NCC.
  - Theo dõi tiến độ giao hàng và nghiệm thu nhập kho.

---

### 8. 🏭 Phân Hệ Sản Xuất (`/san-xuat`)
- **Định mức nguyên vật liệu (BOM - Bill of Materials)**:
  - Thiết lập công thức cấu thành sản phẩm, định mức hao hụt.
- **Kế hoạch & Lệnh sản xuất (Work Orders)**:
  - Lập lịch sản xuất theo từng đơn hàng/lô hàng.
  - Phân công tổ/xưởng sản xuất, theo dõi sản lượng thực tế theo ca.
- **Quản lý Chất lượng (QC)**:
  - Kiểm tra chất lượng nguyên vật liệu đầu vào (IQC), công đoạn (IPQC), xuất xưởng (OQC).

---

### 9. 🏬 Phân Hệ Kho Vận & Logistics (`/kho-van`)
- **Quản lý Kho bãi**:
  - Danh mục nhiều kho (Kho tổng, Kho nguyên liệu, Kho thành phẩm, Kho chi nhánh).
- **Tồn kho thực tế & Cảnh báo**:
  - Số lượng tồn tức thời, thẻ kho chi tiết theo từng sản phẩm.
  - Cảnh báo tồn kho dưới mức tối thiểu hoặc vượt mức tối đa.
- **Nghiệp vụ Kho**:
  - Lập phiếu nhập kho (từ mua hàng, từ sản xuất, hàng trả về).
  - Lập phiếu xuất kho (bán hàng, xuất sản xuất, thanh lý).
  - Điều chuyển kho nội bộ giữa các chi nhánh.
  - Kiểm kê kho định kỳ, cân đối số liệu kho.

---

### 10. 📊 Phân Hệ Điều Hành (Executive Dashboard) (`/dieu-hanh`)
- **Bảng điều khiển Giám đốc**:
  - Tổng hợp chỉ số kinh doanh toàn công ty (Doanh thu, Lợi nhuận gộp, Dòng tiền thuần, Tỷ lệ hoàn thành KPI).
  - Biểu đồ phân tích doanh thu theo ngành hàng, chi nhánh, thời gian thực.
  - Cảnh báo rủi ro hoạt động doanh nghiệp (nợ khó đòi, hợp đồng sắp hết hạn, thiếu hàng tồn kho).

---

### 11. 🛡️ Phân Hệ Hệ Thống & Quản Trị (`/he-thong`)
- **Quản lý Người dùng & Phân quyền (RBAC)**:
  - Danh sách tài khoản người dùng trong hệ thống.
  - Phân quyền chi tiết theo vai trò (Admin, Trưởng phòng, Kế toán, Nhân viên, Thủ kho, Kinh doanh...).
  - Giới hạn quyền xem, tạo mới, chỉnh sửa, xóa trên từng phân hệ.
- **Cấu hình Doanh nghiệp**:
  - Thông tin công ty, logo, mã số thuế, địa chỉ trụ sở, hệ thống chi nhánh.
- **Cài đặt Giao diện & Hiển thị**:
  - Chế độ sáng / tối (Dark mode / Light mode / System).
  - Chọn bảng màu thương hiệu (Xanh lam, Tím, Ngọc lục bảo, Hồng, Hổ phách, Cam, Lục lam, Xám đá).
  - Chọn font chữ hiển thị (Inter, Be Vietnam Pro, Lexend, Nunito, Source Sans 3).
  - Tùy chỉnh cỡ chữ (Small, Medium, Large).
  - Đa ngôn ngữ (Tiếng Việt 🇻🇳 / English 🇬🇧) với hơn 10.700 từ khóa dịch chuẩn.
- **Nhật ký Hệ thống (Audit Trail)**:
  - Ghi nhận lịch sử đăng nhập, thao tác thay đổi dữ liệu của từng tài khoản.

---

### 12. 🤖 Trợ Lý Trí Tuệ Nhân Tạo AI (`/tro-ly-ai`)
- Tích hợp mô hình AI thông minh (Google Gemini) để:
  - Tra cứu nhanh số liệu tồn kho, doanh thu, báo cáo tài chính.
  - Trợ giúp soạn thảo văn bản, email tuyển dụng, đề xuất mua hàng.
  - Phân tích và dự báo xu hướng kinh doanh.

---

### 13. ℹ️ Thông Tin Bản Quyền (`/thong-tin-ban-quyen`)
- Bản quyền thuộc về: **5F Education** / Tác giả **Lê Minh Công**.
- Phiên bản ứng dụng ERP Template v1.0.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
copy web a cong/
├── assets/                       # Thư mục chứa mã nguồn bundle và media
│   ├── index.js                  # Toàn bộ mã nguồn bundle JavaScript SPA
│   ├── index.css                 # File Stylesheet CSS & Tailwind styles
│   └── images/                   # Hình ảnh, logo, background tải về cục bộ
│       ├── logo.png
│       ├── login-bg.jpg
│       └── ...
├── src/                          # Cấu trúc mã nguồn module hóa
│   ├── locales/                  # Dữ liệu từ điển đa ngôn ngữ i18n
│   │   ├── vi.json               # 10.789 khóa dịch Tiếng Việt
│   │   └── en.json               # 10.789 khóa dịch Tiếng Anh
│   └── mock/                     # Dữ liệu mẫu (phòng ban, nhân viên, chi nhánh...)
│       ├── departments.json
│       ├── employees.json
│       ├── branches.json
│       └── ...
├── index.html                    # File HTML chính với importmap và SEO meta
├── index.formatted.js            # File JS đã format đẹp để dễ đọc và phân tích mã nguồn
├── manifest.json                 # PWA Web App Manifest
├── package.json                  # Cấu hình dependency npm
├── vite.config.ts                # Cấu hình Vite bundler
├── tailwind.config.js            # Cấu hình giao diện Tailwind CSS
├── tsconfig.json                 # Cấu hình TypeScript
├── serve.js                      # Máy chủ web SPA cục bộ (Node.js)
└── README.md                     # Tài liệu hướng dẫn sử dụng chi tiết
```

---

## 💡 Hỗ Trợ Kỹ Thuật

Mọi thắc mắc hoặc cần mở rộng thêm các tính năng backend (Node.js, Express, NestJS, Spring Boot, Supabase, PostgreSQL) hoặc kết nối cơ sở dữ liệu thật, vui lòng tham khảo cấu trúc các endpoint và state store đã được bóc tách trong thư mục `src/`.
