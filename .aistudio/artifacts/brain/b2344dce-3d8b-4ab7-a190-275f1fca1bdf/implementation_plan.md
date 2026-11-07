# Kế hoạch phát triển: POWER TREE Smart Dashboard (Cây Năng Lượng Thông Minh)

Bảng điều khiển thông minh tương tác cao, thiết kế sư phạm trực quan dành cho học sinh lớp 3 và giáo viên STEM để theo dõi, học tập và điều khiển mô hình Cây Năng Lượng (Pin mặt trời, Áp điện Piezo, Pin lưu trữ chung, Hệ thống quản lý nước 3 phao cảm biến và Máy bơm mini an toàn).

---

> [!IMPORTANT] 
> **Cam kết tuân thủ các nguyên tắc giới hạn cốt lõi:**
> 1. **Tính trung thực dữ liệu**: Giao diện luôn gắn nhãn rõ ràng `[DỮ LIỆU MÔ PHỎNG - DEMO MODE]` khi chưa có phần cứng; tuyệt đối không ngụy tạo là dữ liệu thực tế.
> 2. **Trạng thái kết nối Arduino minh bạch**: Hiển thị rõ ràng `"Chưa kết nối Arduino (Đang ở chế độ mô phỏng)"` và chỉ chuyển sang `"Đã kết nối qua cổng USB"` khi người dùng chủ động bấm chọn cổng COM qua Web Serial API.
> 3. **Khóa an toàn phần cứng (Dry-run Interlock)**: Logic điều khiển máy bơm tích hợp cơ chế bảo vệ phần cứng: nếu phao Mức Thấp báo cạn nước, hệ thống khóa cứng máy bơm (cả ở chế độ Thủ công lẫn Tự động) để chống cháy bơm mini, kèm theo thông báo hướng dẫn dễ hiểu cho học sinh.
> 4. **Thông số linh kiện thực tế theo chuẩn giáo dục STEM**: Sử dụng đúng dải điện áp và dòng điện của bộ kit STEM học đường (Solar 5V/200mA, Piezo cảm ứng lực 0-5V qua mạch nắn diode, Pin sạc Lithium 3.7V-4.2V / 2500mAh, Bơm mini DC 5V / 200mA).

---

## 1. Tổng quan & Mục tiêu Sư phạm

- **Đối tượng sử dụng**: Học sinh Tiểu học (đặc biệt là lớp 3 - lứa tuổi 8-9 tuổi), giáo viên STEM / Khoa học & Tự nhiên.
- **Ý tưởng cốt lõi**: Mô hình **"Cây Năng Lượng Thông Minh" (POWER TREE)**:
  - Lá cây hứng ánh sáng mặt trời biến thành điện năng (**Solar Zone**).
  - Rễ cây / Bậc thềm hứng bước chân và hạt mưa rơi tạo ra điện (**Piezo Zone**).
  - Thân cây chứa "Bình ắc quy năng lượng chung" tích trữ nguồn điện sạch (**Battery Hub**).
  - Gốc cây có bồn thu nước mưa với 3 chú phao thông minh và chiếc máy bơm mini tưới tiêu hoa màu tự động (**Water Management Zone**).
- **Giá trị học tập**: Giúp học sinh hiểu trực quan quy luật bảo toàn năng lượng, vòng tuần hoàn của nước, nguyên lý cảm biến phao nước và tư duy lập trình an toàn phần cứng.

---

## 2. Trải nghiệm người dùng (UX) & Thiết kế giao diện (UI)

### 2.1. Phong cách hình ảnh phù hợp học sinh lớp 3
- **Chủ đề thị giác**: "Khu Vườn Khoa Học Tương Lai" sinh động, trong sáng, các thẻ hiển thị to rõ, biểu tượng trực quan, hạn chế tối đa các thuật ngữ kỹ thuật khô khan (kèm giải thích ví dụ: *"Công suất (Watt) = Độ khỏe của dòng điện"*).
- **Mã màu học tập (Semantic Color Scheme)**:
  - ☀️ **Vàng - Cam ấm**: Khu vực Điện Mặt Trời (Solar) & Ánh nắng.
  - ⚡ **Tím Neon - Xanh Cyan**: Khu vực Năng lượng Bước chân Piezo.
  - 💧 **Xanh dương - Nước biển**: Khu vực Quản lý nước & Máy bơm.
  - 🔋 **Xanh lá cây**: Trạng thái Pin lưu trữ chung (đầy, nạp, xả).
  - ⚠️ **Đỏ san hô**: Cảnh báo an toàn (cạn nước, ngắt bơm khẩn cấp).
- **Typography & Accessibility**: Font chữ lớn, nét tròn thân thiện (`Plus Jakarta Sans` / `Outfit`), số liệu to rõ có kèm đơn vị đo chuẩn (`V`, `mA`, `W`, `%`). Đạt chuẩn tương phản cao WCAG AA.

### 2.2. Bố cục 3 Phân khu chính & Màn hình Dashboard
Giao diện được tổ chức theo bố cục 2 cột cân đối (Two-Zone Layout theo chuẩn EdTech Simulation):

1. **Thanh điều hướng đỉnh (Top Bar)**:
   - Logo thương hiệu: `POWER TREE STEM`
   - Chỉ báo trạng thái kết nối: Huy hiệu trạng thái mô phỏng vàng/xanh kèm nút `"Kết nối Arduino (USB)"`.
   - Nút chuyển nhanh: `"Góc Học Tập / Hướng Dẫn"`, `"Mô phỏng Demo"`, `"Mã nguồn Arduino (.ino)"`.

2. **Cột Trái (Interactive Stage - Mô hình Cây Năng Lượng Động)**:
   - Sơ đồ tương tác SVG hoạt hình trực quan mô phỏng dòng chảy năng lượng từ Mặt Trời & Bước chân dồn vào Pin, và từ Pin cấp cho Máy bơm.
   - Hình ảnh mặt cắt bồn nước với 3 chiếc phao nổi (Thấp - Vừa - Đầy) và tia nước khi bơm hoạt động.

3. **Cột Phải (Telemetry Deck & 3 Phân khu đo đạc)**:
   - **Khu vực 1: Solar (Pin Mặt Trời)**:
     - Đo điện áp ($V$), dòng nạp ($mA$), công suất tức thời ($W$).
     - Đánh giá thời tiết: Trời râm / Nắng nhẹ / Nắng chói chang.
   - **Khu vực 2: Piezo (Áp Điện Bước Chân & Nước Mưa)**:
     - Đếm số lần dẫm chân / hạt mưa rơi (`hits`).
     - Xung điện áp sinh ra tức thời ($V$).
     - Năng lượng tích lũy được tích lũy vào pin.
   - **Khu vực 3: Water Management (Quản lý Bồn Nước & Bơm Mini)**:
     - 3 đèn cảm biến tương ứng 3 phao cơ học:
       - 🔴 Phao 1 (Đáy - Mức Thấp): Báo động cạn nước!
       - 🟡 Phao 2 (Giữa - Mức Trung bình): Nước vừa đủ dùng.
       - 🟢 Phao 3 (Miệng bồn - Mức Đầy): Bồn đã đầy nước mưa.
     - Trạng thái máy bơm: `Đang tắt` hoặc `Đang bơm nước tưới cây`.
     - Chế độ bơm: `Thủ công (Manual)` hoặc `Tự động (Auto)` (tự động bật khi nước đầy phao 2 và pin còn trên 30%).
     - **Đèn khóa an toàn (Safety Lockout Alert)**: Đỏ rực rỡ khi nước ở dưới phao 1, ngăn tuyệt đối không cho bơm bật.
   - **Khu vực Trung tâm: Battery Hub (Pin Lưu Trữ Chung)**:
     - Mức pin hiện tại (`SOC %`), điện áp pin ($3.7V - 4.2V$).
     - Dòng nạp vào ($Solar + Piezo$) vs Dòng tiêu thụ ($Bơm + Arduino$).

4. **Khu vực Bảng điều khiển Demo (Interactive Simulator Drawer)**:
   - Thanh trượt điều chỉnh cường độ ánh nắng ($0\% \to 100\%$).
   - Nút bấm `"Dẫm chân lên thảm!"` (mỗi lần bấm kích hoạt xung dao động piezo sinh động).
   - Thanh trượt mực nước mô phỏng bồn chứa ($0\% \to 100\%$) tự động đẩy 3 phao đóng/ngắt.
   - Nút bơm thử nghiệm kiểm tra tính năng khóa an toàn khi cạn nước.

---

## 3. Kiến trúc kỹ thuật & Dữ liệu

### 3.1. Sơ đồ khối hệ thống (ASCII Architecture Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       POWER TREE SMART DASHBOARD                            │
│                  (Giao diện Web React 19 + Tailwind CSS)                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
      [CHẾ ĐỘ MÔ PHỎNG DEMO]                       [KẾT NỐI ARDUINO THẬT]
   (Bộ sinh dữ liệu STEM tương tác)            (Web Serial API qua cổng USB)
   - Thanh trượt nắng (0-100%)                 - Baudrate: 9600 / 115200
   - Nút dẫm bước chân Piezo                   - Nhận chuỗi JSON qua Serial
   - Mực nước & 3 phao nước                    - Gửi lệnh điều khiển bơm (PUMP_ON/OFF)
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       │
                                       ▼
                   ┌──────────────────────────────────────┐
                   │    STATE ENGINE & SAFETY INTERLOCK   │
                   │  - Khóa cạn nước: low_float == 0     │
                   │  - Tính toán dòng nạp/xả Pin chung   │
                   │  - Logic tưới tự động an toàn        │
                   └───────────────────┬──────────────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           ▼                           ▼                           ▼
    [PHÂN KHU SOLAR]           [PHÂN KHU PIEZO]           [PHÂN KHU NƯỚC & PIN]
   - Điện áp: 0.0 - 5.5V      - Xung áp: 0.0 - 4.8V       - Phao 1: Cạn (Safety Cut)
   - Dòng điện: 0 - 250mA     - Bộ đếm va chạm/bước chân  - Phao 2: Đủ dùng
   - Công suất: mW/W          - Tích tụ năng lượng        - Phao 3: Tràn / Đầy
                                                          - Bơm mini DC: BẬT / TẮT
                                                          - Pin sạc: 0 - 100%
```

### 3.2. Cấu trúc dữ liệu chuẩn trao đổi với Arduino (JSON Protocol)

Gói tin Serial gửi từ Arduino lên Web mỗi 500ms:
```json
{
  "source": "arduino_hardware",
  "solar": {
    "voltage_v": 5.12,
    "current_ma": 185.0,
    "power_mw": 947.2
  },
  "piezo": {
    "voltage_peak_v": 3.4,
    "step_count": 42,
    "energy_accum_joules": 1.25
  },
  "water": {
    "float_low": true,
    "float_mid": true,
    "float_high": false,
    "pump_active": false,
    "safety_locked": false
  },
  "battery": {
    "percentage": 78,
    "voltage_v": 3.95,
    "is_charging": true
  }
}
```

Lệnh Web gửi xuống Arduino:
```json
{
  "command": "SET_PUMP",
  "state": true,
  "mode": "MANUAL"
}
```
*(Nếu `float_low == false`, Arduino và Web đều độc lập từ chối bật lệnh này để đảm bảo an toàn tuyệt đối 2 lớp).*

---

## 4. Kế hoạch triển khai từng giai đoạn (Phased Implementation Roadmap)

### Giai đoạn 1: Khởi tạo nền tảng & Hệ thống Design System (Turn sau khi duyệt)
- Khởi tạo `metadata.json` chuẩn tên ứng dụng: `POWER TREE Smart Dashboard`.
- Cập nhật `index.html` với tiêu đề, biểu tượng và font chữ thân thiện với học sinh tiểu học.
- Xây dựng Theme màu sắc, các icon trực quan của Lucide và hiệu ứng chuyển động Motion mượt mà.

### Giai đoạn 2: Phát triển State Engine & Demo Simulator với Khóa an toàn
- Viết module State Engine quản lý toàn bộ dữ liệu cảm biến: Solar, Piezo, 3 Phao nước, Bơm, Pin lưu trữ.
- Xây dựng logic **Khóa an toàn chống chạy khô (Dry-Run Protection Interlock)** đảm bảo máy bơm không thể hoạt động khi nước cạn.
- Thiết kế ngăn điều khiển Demo Simulator với thanh trượt thời tiết, nút dẫm chân Piezo, bơm và mực nước bồn.

### Giai đoạn 3: Xây dựng 3 Phân khu giao diện & Mô hình Cây Năng Lượng Động
- **Mô hình Trực quan Cây Năng Lượng (Interactive Tree Visualizer)**: Hiển thị dòng chảy năng lượng từ lá (nắng) và rễ (bước chân) vào thân cây (pin) và tưới ra bồn nước.
- **Card Chi Tiết 3 Phân Khu**: Thẻ Solar đo điện áp/dòng, Thẻ Piezo đếm bước dẫm, Thẻ Nước hiển thị trạng thái 3 phao nước dạng đèn tín hiệu trực quan.
- **Card Pin Lưu Trữ Chung**: Đo % sạc, thời gian sử dụng ước tính.

### Giai đoạn 4: Tích hợp Web Serial API cho Arduino & Cung cấp Code Arduino mẫu (.ino)
- Tích hợp Web Serial API native của trình duyệt Google Chrome/Edge, cho phép kết nối trực tiếp Arduino qua cáp USB chỉ với 1 click.
- Thiết kế Tab `"Phần Cứng & Mã Nguồn Arduino"`:
  - Cung cấp sơ đồ nối dây cực kỳ dễ hiểu (Sơ đồ chân Pinout Arduino Uno cho học sinh).
  - Cung cấp toàn bộ mã nguồn Arduino C++ (`PowerTree.ino`) hoàn chỉnh, có chú thích tiếng Việt từng dòng giải thích cho học sinh lớp 3 hiểu logic phao nước và relay bơm.
  - Chức năng kiểm thử Terminal Serial ngay trên màn hình.

### Giai đoạn 5: Hướng dẫn học sinh & Hướng dẫn triển khai GitHub/Vercel
- Tab `"Góc Khoa Học Lớp 3"`: Các câu đố vui khoa học tương tác giải thích năng lượng mặt trời là gì, áp điện piezo là gì, tại sao bồn nước cần 3 phao.
- Tài liệu hướng dẫn chi tiết các bước tải code lên GitHub và bấm deploy tự động trên Vercel miễn phí.

---

## 5. Kế hoạch kiểm thử & Đảm bảo an toàn (Verification Plan)

| Kịch bản kiểm thử | Hành động kiểm thử | Kết quả kỳ vọng |
| :--- | :--- | :--- |
| **Kiểm tra an toàn cạn nước** | Kéo mực nước xuống dưới Phao 1 (Phao Thấp tắt) và bấm bật Bơm | Bơm bị khóa cứng, phát âm thanh cảnh báo/thông báo đỏ giải thích cho học sinh biết không được chạy khô |
| **Kiểm tra nạp năng lượng kép** | Kéo nắng lên 100% và bấm liên tục nút Dẫm chân Piezo | Tổng công suất nạp vào pin tăng, biểu tượng năng lượng chảy vào pin nhanh hơn |
| **Kiểm tra tính trung thực** | Chưa cắm dây USB Arduino | Hiển thị rõ ràng `"Chế độ mô phỏng Demo"`, không hiển thị thông số giả mạo là thật |
| **Kiểm tra kết nối Web Serial** | Bấm kết nối Serial | Mở hộp thoại chọn cổng USB COM chuẩn của trình duyệt |
| **Kiểm tra giao diện học sinh** | Học sinh bấm các nút dẫm chân và tưới cây | Hiệu ứng phản hồi tức thì dưới 100ms, chữ to, màu sắc kích thích tò mò khoa học |
