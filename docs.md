Dưới đây là bản **Tài liệu Yêu cầu Sản phẩm (Product Requirements Document - PRD)** chi tiết, được tối ưu riêng cho định hướng: **Tận dụng tối đa sức mạnh thông minh của AI và Free Tier của Cloud (Firebase), sẵn sàng nâng cấp (Scale-up) khi có lượng người dùng lớn.**

Tài liệu này đóng vai trò như bản thiết kế "Blueprint" để Developer có thể code Base System (Hệ thống lõi) ngay lập tức.

---

# TÀI LIỆU YÊU CẦU DỰ ÁN (PRD): NỀN TẢNG AI MINI-APP VIRAL

## 1. Tổng quan dự án (Project Overview)

* **Tên dự án:** AI Hub / Trend-Catching Portal
* **Mục tiêu:** Xây dựng nền tảng web chứa các mini-app ứng dụng AI (bói vui, chấm điểm, châm biếm). Bắt trend nhanh chóng, mang tính giải trí cao nhờ sự thông minh của AI.
* **Định hướng người dùng:** Giới trẻ (Gen Z, Gen Alpha). Mobile-first 100%. Hành vi: Thiếu kiên nhẫn, thích trải nghiệm cá nhân hoá và có nhu cầu chia sẻ kết quả lên mạng xã hội.
* **Mục tiêu kỹ thuật & Chi phí:** 
  * Chi phí ban đầu **0 VNĐ** (Sử dụng Free Tier của Firebase & Google Gemini).
  * Kiến trúc chuẩn mực, dùng Database để quản lý kết quả. Khi dự án lớn mạnh, chỉ cần trả tiền nâng cấp gói (Pay-as-you-go) mà không phải đập đi xây lại.
  * Tích hợp cơ chế phòng vệ (Cache, Fallback) để ứng phó khi chạm giới hạn Free Tier.

---

## 2. Yêu cầu chức năng (Functional Requirements)

Hệ thống được chia làm 4 Module cốt lõi:

### Module 1: The Hub (Trang chủ & Portal)
* **F1.1 - Lưới Mini-app:** Hiển thị danh sách các app (Grid). Mỗi Card có Icon, Tiêu đề giật gân, Mô tả và Badge (Hot/New).
* **F1.2 - Điều hướng (Routing):** Khi click vào app, chuyển cảnh mượt mà sang giao diện chơi. App được thiết kế dưới dạng dynamic route (VD: `/app/roast-my-face`).

### Module 2: The Core Flow (Luồng chơi & Cơ chế Viral)
Trái tim của hệ thống, áp dụng chung cho mọi mini-app.

* **F2.1 - Form Nhập liệu (Input):** Form động (Text, Date, Image Upload). Tối ưu UX cho màn hình điện thoại (bàn phím số cho ngày tháng, auto-focus).
* **F2.2 - Fake Loading (Hiệu ứng Tâm lý):** Trong lúc đợi AI xử lý dữ liệu, màn hình KHÔNG dùng spinner quay tròn nhàm chán. Phải hiển thị các câu thông báo nhấp nháy, thay đổi ngẫu nhiên để tăng sự tò mò (Ví dụ: *"Đang phân tích dữ liệu...", "Đang kết nối tín hiệu vũ trụ..."*). Thời gian fake loading tối thiểu 3 giây.
* **F2.3 - Công cụ Chia sẻ (Vũ khí Viral):**
  * **Cơ chế 1: Tải ảnh về máy (Lưu file):** Dùng `html2canvas` chụp màn hình UI kết quả (được thiết kế cực đẹp, có sẵn Watermark + QR Code của web) để người chơi đăng Tiktok/Story.
  * **Cơ chế 2: Copy Link URL:** Link có dạng định danh duy nhất (VD: `aihub.com/share/abc123xyz`). Khi dán link lên Zalo/Facebook, Server sẽ sinh ra ảnh Thumbnail (OpenGraph) bằng thư viện `nuxt-og-image` dựa trên dữ liệu của người chơi để thu hút bạn bè click vào.

### Module 3: AI Gateway & Quản trị Quota (Cực kỳ quan trọng)
* **F3.1 - Endpoint API trung gian:** Mọi request AI phải đi qua server nội bộ (Vercel Edge/Nitro). TUYỆT ĐỐI không lộ API Key ở Frontend.
* **F3.2 - Tận dụng sự thông minh của AI:** Sử dụng Google Gemini API làm lõi xử lý chính (sinh text, đánh giá). Nội suy Prompt linh hoạt dựa trên input của User.
* **F3.3 - Hash Caching (Tiết kiệm Quota API):** 
  * Lưu trữ kết quả (Cache): Nếu User B nhập y hệt User A, hệ thống lấy kết quả đã lưu trong Database trả về, **KHÔNG GỌI LẠI AI API**. Tính năng này giúp tiết kiệm 50-70% request thừa khi có Trend.
* **F3.4 - Cơ chế Fallback (Phòng ngự Rate Limit):** 
  * Nếu đạt giới hạn Free Tier (ví dụ quá 15 request/phút), API sẽ vấp lỗi 429. Lúc này, API phải tự động "Bẻ lái" (Fallback) sang bốc ngẫu nhiên kết quả từ file `mock_data.json` chuẩn bị sẵn để app không bị báo lỗi.

### Module 4: Database & Storage (Firebase)
* **F4.1 - Lưu trữ kết quả sinh:** Mỗi lần AI sinh xong kết quả, lưu cục JSON đó vào Firebase Firestore với ID duy nhất (`doc_id`).
* **F4.2 - Đọc dữ liệu (Read-only):** Cung cấp API để Frontend truy xuất kết quả thông qua `doc_id` (Phục vụ cho luồng truy cập từ Link chia sẻ của người khác).
* **F4.3 - Firebase Security Rules:** Khóa chặt quyền ghi trực tiếp từ Client. Chỉ cho phép Server (Admin SDK) được ghi, hoặc Client chỉ được đọc doc.

---

## 3. Yêu cầu Giao diện & Trải nghiệm (UI/UX)

* **Thiết kế (Vibe Gen Z):** Định hướng **Dark Mode** mặc định. Sử dụng các gam màu Gradient Neon (Tím, Xanh neon, Cam) để tạo sự bí ẩn, công nghệ. Form input dùng bo góc lớn (Rounded-2xl/full), kết hợp Glassmorphism.
* **Animation & Micro-interactions:** 
  * Nút CTA (Ví dụ: "Xem Kết Quả") phải có hiệu ứng nhún (scale) khi chạm.
  * Nút "Chia sẻ (Share)" có hiệu ứng rung lắc (pulse) nhẹ nhàng để kích thích người dùng bấm vào.
  * Sử dụng thư viện motion (`@vueuse/motion` hoặc css animation) cho các màn chuyển cảnh.

---

## 4. Ngăn xếp Công nghệ (Tech Stack V2)

* **Framework cốt lõi:** Nuxt 3 (Cấu hình Server-Side Rendering - SSR cho các trang chia sẻ để bot Facebook đọc được OG meta, và CSR cho các form nhập liệu).
* **UI Framework:** **Tailwind CSS** + **Nuxt UI** (Tối ưu cho Nuxt, siêu nhẹ, custom Dark Mode dễ hơn Ant Design, giao diện cực kỳ hiện đại phù hợp Gen Z).
* **Cơ sở dữ liệu:** Firebase Firestore (Free Tier cho phép 50k reads, 20k writes/ngày. Dư sức dùng ở giai đoạn đầu, dễ scale sau này).
* **AI Engine:** Google Gemini Flash API (Phản hồi nhanh, free tier tốt).
* **Công cụ bổ trợ:** 
  * `html2canvas`: Xử lý chụp ảnh client.
  * `nuxt-og-image`: Sinh ảnh OG động cho social sharing.
* **Triển khai (Deployment):** Vercel (Hobby Plan).

---

## 5. Kế hoạch Triển khai (Milestones)

* **Giai đoạn 1: Foundation (1 ngày)**
  * Khởi tạo dự án Nuxt 3.
  * Cài đặt và cấu hình Tailwind CSS, Nuxt UI, tích hợp Firebase SDK.
  * Xây dựng cấu trúc thư mục chuẩn.
* **Giai đoạn 2: UI/UX Core & Loading (1.5 ngày)**
  * Dựng layout trang chủ (Hub).
  * Viết các component dùng chung: BaseInput, BaseButton, đặc biệt là `FakeLoading` (nhấp nháy chữ).
* **Giai đoạn 3: AI Gateway & Firebase DB (2 ngày)**
  * Viết API endpoint `/api/generate` kết nối Gemini API.
  * Cài đặt luồng: Gọi AI -> Lưu Firebase lấy ID -> Caching & Fallback.
  * Xây dựng trang `/share/[id]` đọc dữ liệu từ DB.
* **Giai đoạn 4: Tích hợp Viral Share & Test (1 ngày)**
  * Cài đặt `html2canvas` để tải ảnh kết quả có watermark.
  * Cấu hình `nuxt-og-image` cho Zalo/Facebook.
  * Deploy Vercel và test thực tế.

---
*(Với bản PRD này, hệ thống sẽ vừa tận dụng tối đa trí tuệ của AI, vừa sử dụng Cloud Database chuẩn mực để dễ dàng mở rộng dung lượng khi dự án hái ra tiền, trong khi vẫn có lớp bảo vệ (Cache & Fallback) an toàn khi dùng Free Tier).*