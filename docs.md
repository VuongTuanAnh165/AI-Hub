Dưới đây là bản **Tài liệu Yêu cầu Sản phẩm (Product Requirements Document - PRD)** được thiết kế chuẩn mực, rành mạch để bạn có thể sử dụng làm kim chỉ nam và bắt tay vào code ngay lập tức.

Tài liệu này tập trung vào việc xây dựng "Base System" (Hệ thống lõi) trước, làm nền tảng để scale các mini-app sau này.

---

# TÀI LIỆU YÊU CẦU DỰ ÁN (PRD): NỀN TẢNG AI MINI-APP VIRAL

## 1. Tổng quan dự án (Project Overview)

* **Tên dự án (Dự kiến):** AI Hub / Trend-Catching Portal
* **Mục tiêu:** Xây dựng một nền tảng web giải trí tổng hợp chứa các mini-app ứng dụng AI (như bói vui, châm biếm, đo lường tính cách). Hệ thống được thiết kế để bắt các trend TikTok một cách nhanh chóng.
* **Định hướng người dùng:** Giới trẻ (Gen Z, Gen Alpha), sử dụng thiết bị di động là chủ yếu (Mobile-first 99%), thiếu kiên nhẫn, thích trải nghiệm tương tác nhanh và có nhu cầu chia sẻ kết quả lên mạng xã hội để thể hiện bản thân.
* **Mục tiêu kỹ thuật:** Chi phí vận hành tiệm cận 0 VNĐ, cấu trúc linh hoạt để ra mắt một mini-app mới trong vòng 1-2 giờ.

---

## 2. Yêu cầu chức năng (Functional Requirements)

Hệ thống được chia làm 4 module chính:

### Module 1: Trang chủ (The Hub / Portal)

* **F1.1 - Danh sách Mini-app:** Hiển thị các mini-app dưới dạng Grid Cards. Mỗi Card bao gồm: Icon, Tiêu đề, Mô tả ngắn, và Badge (ví dụ: "Hot", "New", "Trending").
* **F1.2 - Điều hướng:** Khi người dùng click vào một Card, hệ thống điều hướng mượt mà sang giao diện của mini-app tương ứng thông qua dynamic routing.

### Module 2: Base Mini-App (Core Flow cho mọi trò chơi)

* **F2.1 - Form nhập liệu động:** Giao diện cho phép người dùng nhập thông tin (ví dụ: Input Text cho tên, Date Picker cho ngày sinh, hoặc Upload Ảnh).
* **F2.2 - Xử lý trạng thái (State Management):** Hiển thị màn hình chờ (Loading) với các thông báo hài hước được thay đổi liên tục trong lúc chờ API trả kết quả để tránh nhàm chán.
* **F2.3 - Màn hình Kết quả (Result Page):** Hiển thị kết quả text/image từ AI.
* **F2.4 - Công cụ Viral (Sharing):**
* Chức năng tạo ảnh chụp màn hình (Screenshot) phần kết quả để lưu về máy.
* Chức năng "Copy Link" để tạo ra một đường dẫn định danh duy nhất (Unique URL) dẫn trực tiếp đến kết quả của người chơi đó.



### Module 3: Tích hợp AI (AI Gateway)

* **F3.1 - End-point API nội bộ:** Một Server API duy nhất làm nhiệm vụ trung gian, nhận yêu cầu từ Front-end kèm theo `app_id`.
* **F3.2 - Quản lý Prompt:** Hệ thống tự động map `app_id` với các Prompt Template tương ứng, tiến hành nội suy dữ liệu người dùng vào Prompt trước khi gửi.
* **F3.3 - Gọi AI Model:** Kết nối với Google Gemini API, bắt buộc định dạng dữ liệu trả về là chuẩn JSON (JSON Schema) để Front-end dễ dàng bóc tách và hiển thị.
* **F3.4 - Xử lý lỗi (Error Handling):** Xử lý các lỗi khi AI từ chối trả lời (do vi phạm chính sách) hoặc lỗi Rate Limit (quá tải), trả về thông báo thân thiện cho Front-end.

### Module 4: Cơ sở dữ liệu (Database & Storage)

* **F4.1 - Lưu trữ kết quả sinh:** Lưu trữ JSON kết quả trả về từ AI vào Database kèm theo một ID duy nhất (`doc_id`).
* **F4.2 - Truy xuất kết quả (Read):** Hỗ trợ truy xuất lại dữ liệu dựa trên `doc_id` khi người dùng khác truy cập vào link chia sẻ.

---

## 3. Yêu cầu phi chức năng (Non-Functional Requirements)

* **Hiệu năng (Performance):** Thời gian tải trang ban đầu (First Contentful Paint) dưới 1.5 giây. Tối ưu bundle size.
* **Giao diện (UI/UX):** Bắt buộc theo hướng Mobile-first. Thiết kế giới hạn khung hình hiển thị tốt trên cả màn hình nhỏ nhắn như iPhone SE đến màn hình lớn như iPhone Pro Max. Các thao tác vuốt, chạm phải mượt mà.
* **Bảo mật (Security):** API Key của AI tuyệt đối không được lộ ở client-side. Mọi giao tiếp với AI phải thông qua Server API nội bộ.
* **Khả năng mở rộng (Scalability):** Tách bạch rõ ràng giữa Core Component và Mini-app Logic để việc thêm mới tính năng không làm phình to mã nguồn cốt lõi.

---

## 4. Stack Công nghệ (Technology Stack)

Để đáp ứng được tính linh hoạt, tốc độ phát triển và tối ưu chi phí, hệ thống sử dụng các công nghệ sau:

* **Framework chính:** Nuxt (phiên bản mới nhất). Xử lý cả SSR, CSR và hệ thống routing.
* **Backend & Serverless:** Sử dụng Node.js (thông qua Nitro engine của Nuxt) để viết các end-point API trung gian nằm trong thư mục `server/api`.
* **UI Framework & Styling:** Sử dụng Ant Design cho các component nhập liệu (Input, Button, Spin) để phát triển nhanh. Kết hợp với Sass (SCSS) để custom toàn diện style gốc của Ant Design, tạo ra các giao diện trẻ trung, không bị cứng nhắc kiểu dashboard.
* **Cơ sở dữ liệu:** Firebase Firestore để lưu trữ kết quả JSON và cấp phát Link chia sẻ nhanh chóng.
* **AI Engine:** Google Gemini Flash API.
* **Triển khai (Deployment):** Vercel (Hỗ trợ native cho Nuxt và Serverless functions).

---

## 5. Kế hoạch triển khai (Milestones)

* **Giai đoạn 1 (Setup Base - Dự kiến 2-3 ngày):**
* Khởi tạo dự án Nuxt.
* Xây dựng hệ thống thư mục (`pages`, `components`, `server/api`).
* Cấu hình Sass, custom Ant Design.
* Kết nối Firebase và thử nghiệm gọi Gemini API thành công trên Postman/Insomnia.


* **Giai đoạn 2 (Xây dựng UI/UX lõi - Dự kiến 2 ngày):**
* Code trang chủ (Hub) và các component dùng chung (BaseCard, BaseButton, ShareResult).


* **Giai đoạn 3 (Tạo Mini-app đầu tiên & Viral Loop - Dự kiến 2 ngày):**
* Hoàn thiện luồng của một app ví dụ (VD: Roast AI).
* Tích hợp tính năng lưu DB và sinh link chia sẻ.


* **Giai đoạn 4 (Deploy & Test - Dự kiến 1 ngày):**
* Deploy lên Vercel.
* Kiểm tra Rate limit và responsive trên điện thoại thật.



---