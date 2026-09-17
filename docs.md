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

Hệ thống được chia làm 5 Module cốt lõi (Bao gồm Tracking):

### Module 1: The Hub (Trang chủ & Portal)
* **F1.1 - Lưới Mini-app:** Hiển thị danh sách các app (Grid). Mỗi Card có Icon, Tiêu đề giật gân, Mô tả và Badge (Hot/New).
* **F1.2 - Điều hướng (Routing):** Khi click vào app, chuyển cảnh mượt mà sang giao diện chơi. App được thiết kế dưới dạng dynamic route (VD: `/app/roast-my-face`).

### Module 2: The Core Flow (Luồng chơi & Khép kín vòng lặp Viral)
Trái tim của hệ thống, áp dụng chung cho mọi mini-app.

* **F2.1 - Form Nhập liệu (Input & Image):** Form động (Text, Date, Image Upload).
  * **Chống Spam:** Tích hợp **Cloudflare Turnstile (Captcha ẩn)** để chặn tool spam ghi rác vào Database.
  * **Xử lý Ảnh (Cực kỳ quan trọng):** Mọi ảnh upload phải được nén (compress) trực tiếp ở Client-side xuống dưới 1MB và chuyển thành Base64 trước khi gửi đi. TUYỆT ĐỐI không lưu file ảnh gốc lên Server/Firebase Storage để tránh nguy cơ vi phạm bản quyền và rác dữ liệu.
* **F2.2 - Fake Loading (Hiệu ứng Tâm lý):** Trong lúc đợi AI xử lý dữ liệu, màn hình KHÔNG dùng spinner quay tròn nhàm chán. Phải hiển thị các câu thông báo nhấp nháy, thay đổi ngẫu nhiên để tăng sự tò mò (Ví dụ: *"Đang phân tích dữ liệu...", "Đang kết nối tín hiệu vũ trụ..."*). Thời gian fake loading tối thiểu 3 giây.
* **F2.3 - Công cụ Chia sẻ (Vũ khí Viral 1):**
  * **Cơ chế 1: Tải ảnh về máy (Lưu file):** Dùng `html2canvas` chụp màn hình UI kết quả (được thiết kế cực đẹp, có sẵn Watermark + QR Code của web) để người chơi đăng Tiktok/Story.
  * **Cơ chế 2: Copy Link URL:** Link có dạng định danh duy nhất (VD: `aihub.com/share/abc123xyz`). Khi dán link lên Zalo/Facebook, Server sẽ sinh ra ảnh Thumbnail (OpenGraph) bằng thư viện `nuxt-og-image` dựa trên dữ liệu của người chơi để thu hút bạn bè click vào.
* **F2.4 - Trang Kết Quả Chia Sẻ (Khép kín vòng lặp Viral 2):** Khi một người (User B) click vào link của User A và xem kết quả, bắt buộc phải có một nút Call-To-Action to, rung lắc liên tục: **"👉 Chơi thử ngay / Tạo kết quả của riêng bạn"** dẫn ngược về Form nhập liệu để biến User B thành người chơi mới.

### Module 3: AI Gateway & Quản trị Quota (Cực kỳ quan trọng)
* **F3.1 - Endpoint API trung gian:** Mọi request AI phải đi qua server nội bộ (Vercel Edge/Nitro). TUYỆT ĐỐI không lộ API Key ở Frontend.
* **F3.2 - Tận dụng sự thông minh của AI:** Sử dụng Google Gemini API làm lõi xử lý. Cấu hình **Gemini Safety Settings ở mức cao nhất (Block_All)**. Lý do: Nếu người dùng cố tình upload ảnh nhạy cảm hoặc prompt bậy bạ, API của bạn sẽ bị Google khoá vĩnh viễn nếu không có lớp an toàn này.
* **F3.3 - Hash Caching (Tiết kiệm Quota API):** Lưu trữ kết quả (Cache): Nếu User B nhập y hệt User A, hệ thống lấy kết quả đã lưu trong Database trả về, **KHÔNG GỌI LẠI AI API**.
* **F3.4 - Cơ chế Fallback (Phòng ngự Rate Limit):** Nếu đạt giới hạn Free Tier (ví dụ quá 15 request/phút), API sẽ vấp lỗi 429. Lúc này, API tự động "Bẻ lái" (Fallback) sang bốc ngẫu nhiên kết quả từ file `mock_data.json`.

### Module 4: Database & Storage (Firebase)
* **F4.1 - Lưu trữ kết quả sinh:** Mỗi lần AI sinh xong kết quả, lưu cục JSON đó vào Firebase Firestore với ID duy nhất (`doc_id`).
* **F4.2 - Tự hủy dữ liệu (Auto-delete TTL):** Cấu hình tính năng **TTL (Time-To-Live)** của Firestore để các `doc_id` tự động xoá sau 7 ngày. Tránh việc DB phình to ngoài tầm kiểm soát và đảm bảo quyền riêng tư dữ liệu (Privacy).
* **F4.3 - Firebase Edge Caching (Bảo vệ Quota Đọc):** Khi link chia sẻ bị crawl bởi Facebook/Zalo, bot sẽ đọc db liên tục. Bắt buộc cấu hình Nuxt Route Rules (SWR/ISR) để cache trang chia sẻ trên CDN của Vercel, giúp giảm thiểu số lượt "Read" chọc thẳng vào Firebase.

### Module 5: Đo lường & Phân tích (Analytics)
* **F5.1 - Theo dõi hành vi (Tracking):** Tích hợp hệ thống Tracking để đo lường độ Viral. Cần track các event quan trọng: `app_opened`, `ai_generated`, `share_image_clicked`, `copy_link_clicked`.
* **F5.2 - SEO & Meta Tags:** Cấu hình đầy đủ thẻ Meta (Title, Description) mặc định cho hệ thống.

---

## 3. Yêu cầu Giao diện, Trải nghiệm & Pháp lý (UI/UX/Legal)

* **Thiết kế (Vibe Gen Z):** Định hướng **Dark Mode** mặc định. Sử dụng các gam màu Gradient Neon (Tím, Xanh neon, Cam). Form input dùng bo góc lớn (Rounded-2xl/full), kết hợp Glassmorphism.
* **Animation & Micro-interactions:** 
  * Nút CTA phải có hiệu ứng nhún (scale) khi chạm. Nút "Chia sẻ (Share)" có hiệu ứng rung lắc (pulse) nhẹ.
  * Sử dụng thư viện motion (`@vueuse/motion`) cho các màn chuyển cảnh.
* **Progressive Web App (PWA):** Giao diện mang lại cảm giác như Native App (chống zoom màn hình, "Add to Home Screen").
* **Chuẩn bị đa ngôn ngữ (i18n Placeholder):** Cấu trúc text trong file Vue phải sử dụng định dạng JSON/i18n ngay từ đầu. Viral không biên giới, nếu app bất ngờ nổi ở nước ngoài, ta chỉ việc dịch file JSON thay vì sửa lại code cứng.
* **Chừa không gian (Ad Placeholder):** Thiết kế chừa sẵn khoảng trống ở Footer hoặc giữa các Card trên trang chủ để sau này gắn banner Quảng cáo.
* **Cảnh báo Pháp lý (Disclaimer):** Luôn phải có dòng text mờ ở dưới màn hình kết quả: *"Kết quả chỉ mang tính chất giải trí"* để tránh rắc rối pháp lý hoặc bị Facebook chặn link nếu AI lỡ sinh ra nội dung nhạy cảm.

---

## 4. Ngăn xếp Công nghệ (Tech Stack V2)

* **Framework cốt lõi:** Nuxt 3 (Cấu hình SSR và CSR linh hoạt).
* **UI Framework:** **Tailwind CSS** + **Nuxt UI** (Giao diện hiện đại, dễ custom Dark Mode).
* **Cơ sở dữ liệu:** Firebase Firestore (Tích hợp tính năng TTL tự huỷ).
* **AI Engine:** Google Gemini Flash API (Cấu hình Safety Settings tối đa).
* **Bảo vệ Bot Spam:** Cloudflare Turnstile (Tương tự reCAPTCHA nhưng vô hình, miễn phí).
* **Công cụ bổ trợ:** 
  * `html2canvas` & `compressorjs` (Xử lý và nén ảnh client).
  * `nuxt-og-image`: Sinh ảnh OG động.
  * `@nuxtjs/i18n`: Cấu trúc đa ngôn ngữ.
* **Công cụ Đo lường (Analytics):** Google Analytics 4 (GA4).
* **Triển khai (Deployment):** Vercel (Hobby Plan).

---

## 5. Biến môi trường & Bảo mật

* Yêu cầu file `.env` chuẩn mực:
  * `GEMINI_API_KEY`: Key truy cập Google AI.
  * `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Dùng cho Firebase Admin SDK ở Server.
* **Quy tắc bảo mật Firebase (Rules):** Không mở Public Database. Chỉ Server (Nitro/Vercel) mới có quyền Read/Write trực tiếp qua Admin SDK.

---

## 6. Kế hoạch Triển khai (Milestones)

* **Giai đoạn 1: Foundation (1 ngày)**
  * Khởi tạo dự án Nuxt 3. Cài đặt Tailwind CSS, Nuxt UI, `@nuxtjs/i18n`. Tích hợp Firebase SDK, cài mã GA4.
* **Giai đoạn 2: UI/UX Core & Loading (1.5 ngày)**
  * Dựng layout trang chủ (Hub), setup khoảng trống dự phòng Ads. Viết component `FakeLoading`.
* **Giai đoạn 3: AI Gateway, Firebase DB & Security (2 ngày)**
  * Viết API endpoint `/api/generate` kết nối Gemini API (bật Safety Settings).
  * Cài đặt Cloudflare Turnstile. Setup Firebase TTL (tự xoá data sau 7 ngày).
  * Xây dựng trang `/share/[id]` đọc dữ liệu từ DB, gắn CTA khép kín vòng lặp viral.
* **Giai đoạn 4: Tích hợp Viral Share & Test (1 ngày)**
  * Cài đặt nén ảnh client-side, tải ảnh kết quả có watermark (kèm text Disclaimer).
  * Cấu hình `nuxt-og-image` cho Zalo/Facebook.
  * Deploy Vercel và test thực tế, kiểm tra sự kiện bắn về GA4.

---
*(Bản PRD này là sự đúc kết của các mô hình Web Viral thành công nhất. Hệ thống không chỉ miễn phí ban đầu, mà còn an toàn tuyệt đối trước các đòn đánh "chí mạng" như: Vi phạm bản quyền hình ảnh, Bị Google khoá API Key, Bị Bot phá sập Database, và Bị đứt gãy vòng lặp chia sẻ).*