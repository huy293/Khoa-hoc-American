# 🏛️ TÀI LIỆU CẤU HÌNH SMART CUSTOM FIELDS (SCF) — COUTURE BEAUTY ACADEMY

> **Dành cho Quản trị viên & Nhà phát triển:**  
> Tài liệu này chuẩn hóa toàn bộ các nhóm trường **Smart Custom Fields (SCF)** trên WordPress.  
> Được chia làm **2 Phần rõ ràng**:
> 1. **Phần A: Các Component Dùng Chung Đa Trang (Shared Components)** — Gắn Rule `(OR)` vào nhiều trang.
> 2. **Phần B: Các Section Độc Quyền Theo Từng Trang (Page-Specific)** — Chỉ xuất hiện riêng ở 1 trang.

---

## 📑 MỤC LỤC TỔNG QUAN:

### 🔄 PHẦN A: CÁC COMPONENT DÙNG CHUNG ĐA TRANG (SHARED COMPONENTS)
1. [📍 Component 1: Banner Tham Quan Trường (`Campus Visit`) — Toàn bộ 6 trang](#component-1-banner-tham-quan-trường-campus-visit)
2. [🌟 Component 2: Khung Vòm 4 Điểm (`Specialized / Why Choose Us`) — Home & About Us](#component-2-khung-vòm-4-điểm-specialized--why-choose-us)
3. [👥 Component 3: Giảng Viên 2 Card Trắng (`Meet Your Instructors`) — Courses & About Us](#component-3-giảng-viên-2-card-trắng-meet-your-instructors)
4. [💬 Component 4: Đánh Giá Học Viên (`Testimonials`) — Home & About Us](#component-4-đánh-giá-học-viên-testimonials)
5. [🤝 Component 5: Đối Tác & Thương Hiệu (`Partners`) — Home & Courses](#component-5-đối-tác--thương-hiệu-partners)
6. [📊 Component 6: Khối Số Liệu & Uy Tín (`Our Impact / Credibility Counters`) — Home & Courses](#component-6-khối-số-liệu--uy-tín-our-impact--credibility-counters)

---

### 🏠 PHẦN B: CÁC SECTION RIÊNG BIỆT THEO TỪNG TRANG (PAGE-SPECIFIC)
7. [🏠 Trang Chủ (`Page = Home`)](#7-trang-chủ-page--home)
8. [🎓 Trang Khóa Học (`Page = Courses`)](#8-trang-khóa-học-page--courses)
9. [🛍️ Trang Cửa Hàng (`Page = Shop`)](#9-trang-cửa-hàng-page--shop)
10. [🏢 Trang Giới Thiệu (`Page = About Us`)](#10-trang-giới-thiệu-page--about-us)
11. [📚 Trang Tài Nguyên (`Page = Resources`)](#11-trang-tài-nguyên-page--resources)
12. [📞 Trang Liên Hệ (`Page = Contact`)](#12-trang-liên-hệ-page--contact)
13. [🌐 Cấu Hình Chung Toàn Site (`Page = Site Settings`)](#13-cấu-hình-chung-toàn-site-page--site-settings)

---

# 🔄 PHẦN A: CÁC COMPONENT DÙNG CHUNG ĐA TRANG

---

### Component 1: Banner Tham Quan Trường (`Campus Visit`)
* **Chức năng:** Banner hẹn lịch tham quan nằm ở cuối tất cả các trang trước Footer.
* **Quy tắc hiển thị (Display Rules):** Gán cho **`Page` = `Site Settings`** *(hoặc gắn Rule `OR` cho cả 6 trang)*.

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu (Type) | Nội dung / Hướng dẫn mẫu |
|:---:|---|---|:---:|---|
| 1 | Banner Eyebrow | `visit_eyebrow` | **Text** | `EXPLORE COUTURE` |
| 2 | Banner Tiêu đề | `visit_title` | **Text** | `VISIT OUR CAMPUS & MEET THE TEAM` |
| 3 | Banner Mô tả | `visit_description` | **Textarea** | `Experience the academy in person. Walk our treatment rooms, see the equipment, and speak with instructors.` |
| 4 | Địa chỉ tham quan | `visit_address` | **Text** | `9889 Bellaire Blvd, Suite 218, Houston, TX 77036` |
| 5 | Nút Đặt lịch (Text) | `visit_btn_text` | **Text** | `SCHEDULE A VISIT` |
| 6 | Nút Đặt lịch (Link) | `visit_btn_link` | **Text** | `/contact` |
| 7 | Ảnh cơ sở trường học | `visit_image` | **Image** | Ảnh chụp phòng thực hành / campus |

---

### Component 2: Khung Vòm 4 Điểm (`Specialized / Why Choose Us`)
* **Chức năng:** Khối có ảnh khung vòm ở giữa, 2 mục bên trái (01, 03) và 2 mục bên phải (02, 04).
* **Quy tắc hiển thị (Display Rules):**
  * `Page` bằng **`Home`**
  * `(OR)` `Page` bằng **`About Us`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu (Type) | Giá trị trên Home | Giá trị trên About Us |
|:---:|---|---|:---:|---|---|
| 1 | Phụ đề (Eyebrow) | `spec_eyebrow` | **Text** | `Our Specialized Training Programs` | `WHY CHOOSE US` |
| 2 | Tiêu đề chính | `spec_title` | **Textarea** | `Build a career around <br/>the work you love.` | `More Than Training <br/>A Foundation for Your Career.` |
| 3 | Ảnh khung vòm giữa | `spec_image` | **Image** | Ảnh chứng chỉ / tay nghề | Ảnh lớp học thực hành vòm |
| 4 | 🔄 **4 Mục hiển thị** | `spec_items` | **Repeater** | *(Thêm 4 mục lặp)* | *(Thêm 4 mục lặp)* |
| └ | *Tiêu đề mục* | `title` | **Text** | `Facial & Skin Treatments` / `Laser Training`... | `Expert Instructors` / `Curriculum`... |
| └ | *Mô tả mục* | `description` | **Textarea** | `From classic facials to advanced chemical peels...` | `Learn directly from experienced beauty professionals.` |

---

### Component 3: Giảng Viên 2 Card Trắng (`Meet Your Instructors`)
* **Chức năng:** 2 Card màu trắng giới thiệu Master Trainer Thomas Nguyen & Kathleen có câu Quote và Thẻ kỹ năng.
* **Quy tắc hiển thị (Display Rules):**
  * `Page` bằng **`Courses`**
  * `(OR)` `Page` bằng **`About Us`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu (Type) | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Phụ đề (Eyebrow) | `instructor_eyebrow` | **Text** | `MEET YOUR INSTRUCTOR` |
| 2 | Tiêu đề chính | `instructor_title` | **Text** | `Learn From Experience. Master With Confidence.` |
| 3 | Chuyên ngành góc phải | `instructor_desc` | **Text** | `Advanced Skincare · Facial Techniques · Beauty Aesthetics · Professional Practice` |
| 4 | 🔄 **Danh sách Giảng viên** | `instructor_cards` | **Repeater** | *(Bấm Add Row thêm 2 Card)* |
| └ | *Câu Quote riêng của Card*| `quote_text` | **Textarea** | `Where experience becomes artistry, and artistry becomes a career.` |
| └ | *Tác giả câu Quote* | `quote_author` | **Text** | `KATHLEEN` |
| └ | *Tên giảng viên* | `name` | **Text** | `Thomas Nguyen` / `Kathleen` |
| └ | *Chức danh* | `role` | **Text** | `Master Trainer` |
| └ | *Tiểu sử đào tạo* | `bio` | **Textarea** | `Trained at PhiBrows, Extreme Lash and Will Anthony Permanent Makeup Academy` |
| └ | *Thẻ kỹ năng (Tags)* | `tags` | **Text** | `Artistry, Expertise, Mentorship` |
| └ | *Ảnh chân dung* | `image` | **Image** | Ảnh chân dung vest đen |

---

### Component 4: Đánh Giá Học Viên (`Testimonials`)
* **Chức năng:** Khối feedback lời nhận xét của học viên đã tốt nghiệp kèm avatar và niên khóa.
* **Quy tắc hiển thị (Display Rules):**
  * `Page` bằng **`Home`**
  * `(OR)` `Page` bằng **`About Us`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu (Type) | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Phụ đề Testimonial | `testi_eyebrow` | **Text** | `STUDENT STORIES` |
| 2 | Tiêu đề Testimonial | `testi_title` | **Textarea** | `Most of them started <br/>with no experience` |
| 3 | 🔄 **Danh sách Học viên** | `testi_list` | **Repeater** | *(Bấm Add Row thêm các học viên)* |
| └ | *Tên học viên* | `name` | **Text** | `Jasmine Lee` / `Sarah Jenkins` / `Kathleen Nguyen` |
| └ | *Khóa học & Niên khóa* | `role` | **Text** | `PERMANENT MAKEUP · CLASS OF 2024` |
| └ | *Lời nhận xét (Quote)* | `comment` | **Textarea** | `“My instructors stayed with me until my technique was consistent...”` |
| └ | *Ảnh đại diện* | `avatar` | **Image** | Ảnh chân dung học viên |

---

### Component 5: Đối Tác & Thương Hiệu (`Partners`)
* **Chức năng:** Dải logo chạy ngang (Marquee) các thương hiệu liên kết.
* **Quy tắc hiển thị (Display Rules):**
  * `Page` bằng **`Home`**
  * `(OR)` `Page` bằng **`Courses`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu (Type) | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | 🔄 **Danh sách Logo Đối tác** | `partner_logos` | **Repeater** | *(Thêm các logo thương hiệu)* |
| └ | *Tên đối tác* | `name` | **Text** | `Young Nails` / `Perma Blend` / `Mehron Makeup` / `AACS` |
| └ | *Ảnh Logo* | `logo` | **Image** | Upload file ảnh logo PNG trong suốt |

---

### Component 6: Khối Số Liệu & Uy Tín (`Our Impact / Credibility Counters`)
* **Chức năng:** Khối thống kê con số uy tín kèm chữ viết tay mềm và nhãn phụ (Hỗ trợ co giãn linh hoạt 3 thẻ trên Home hoặc 4 thẻ trên Courses / About Us).
* **Quy tắc hiển thị (Display Rules):**
  * `Page` bằng **`Home`** *(3 thẻ Impact)*
  * `(OR)` `Page` bằng **`Courses`** *(4 thẻ Credibility)*
  * `(OR)` `Page` bằng **`About Us`** *(4 thẻ Credibility)*

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu (Type) | Giá trị trên Home | Giá trị trên Courses / About Us |
|:---:|---|---|:---:|---|---|
| 1 | Phụ đề (Eyebrow) | `impact_eyebrow` | **Text** | `OUR IMPACT` | `CREDIBILITY` |
| 2 | Tiêu đề chính | `impact_title` | **Textarea** | `We train the people behind the <br/>treatment room` | `Years of professional experience, <br/>certified expertise.` |
| 3 | Mô tả góc phải | `impact_desc` | **Textarea** | `One campus in Houston. Every lesson begins on this floor.` | `One campus in Houston. Every lesson begins on this floor.` |
| 4 | Nút xem thêm (Text) | `impact_link_text` | **Text** | `ACADEMY CATALOG` | `ABOUT MENTORS` |
| 5 | Nút xem thêm (Link) | `impact_link_url` | **Text** | `/courses` | `/about-us` |
| 6 | 🔄 **Danh sách thẻ số liệu** | `impact_counters` | **Repeater** | *(Thêm 3 thẻ)* | *(Thêm 4 thẻ)* |
| └ | *Con số lớn* | `number` | **Text** | `27` / `2,400+` / `10+` | `10+` / `1.500+` / `20+` / `95%` |
| └ | *Chữ viết tay mềm (Script)* | `script_text` | **Text** | `Programs` / `Graduates` / `Years` | `Experience` / `Students` / `Certifications` / `Satisfaction` |
| └ | *Nhãn phụ in hoa* | `label` | **Text** | `ACROSS FOUR DISCIPLINES` / `NOW WORKING IN THE FIELD` / `TRAINING PROFESSIONALS` | `YEARS IN THE BEAUTY INDUSTRY` / `TRAINED IN MASTERED WORKSHOPS` / `PROFESSIONAL & INDUSTRY` / `POSITIVE STUDENT FEEDBACK` |

---

# 🏠 PHẦN B: CÁC SECTION RIÊNG BIỆT THEO TỪNG TRANG

---

## 7. 🏠 TRANG CHỦ (`PAGE = HOME`)
> **Quy tắc hiển thị (Display Rules):** `Page` bằng **`Home`**

### Các trường riêng của Trang Chủ:
| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| **I** | **HERO BANNER** | | | |
| 1 | Hero Eyebrow | `hero_eyebrow` | **Text** | `HOUSTON, TEXAS · EST. 2015` |
| 2 | Hero Mô tả ngắn | `hero_description` | **Textarea** | `Couture Beauty Academy is a professional beauty & aesthetic training institution in Houston...` |
| 3 | Hero Nút 1 (Text / Link) | `hero_btn_1_text` / `hero_btn_1_link` | **Text** | `CONTACT ADMISSIONS` / `#contact` |
| 4 | Hero Nút 2 (Text / Link) | `hero_btn_2_text` / `hero_btn_2_link` | **Text** | `DISCOVER THE ACADEMY` / `#discover` |
| 5 | Hero Ảnh Model góc phải | `hero_member_image` | **Image** | Ảnh chân dung học viên / model |
| 6 | Hero Ảnh nền mờ | `hero_bg_image` | **Image** | Ảnh nền mờ |
| **II**| **WHO WE TEACH** | | | |
| 7 | Who We Teach Eyebrow | `who_eyebrow` | **Text** | `WHO WE TEACH` |
| 8 | Who We Teach Tiêu đề | `who_title` | **Textarea** | `Beauty is a craft, <br/>taught by hand` |
| 9 | Who We Teach Mô tả | `who_description` | **Textarea** | `Most arrive with no experience at all. They leave as ESTHETICIANS, LASER SPECIALISTS...` |
| 10 | Ảnh thực hành 1 (Chính) | `who_image_1` | **Image** | Ảnh thực hành lớn |
| 11 | Ảnh thực hành 2 (Phụ) | `who_image_2` | **Image** | Ảnh thực hành nhỏ |
| 12 | Huy hiệu tích 1 (Badge 1)| `who_badge_1` | **Text** | `Hands-on, in-room instruction` |
| 13 | Huy hiệu tích 2 (Badge 2)| `who_badge_2` | **Text** | `Assessment before certification` |
| 14 | Ảnh Avatar Giảng viên | `who_instructor_avatar` | **Image** | Ảnh đại diện Emily góc dưới |
| 15 | Tên Giảng viên | `who_instructor_name` | **Text** | `Emily` |
| 16 | Chức danh Giảng viên | `who_instructor_role` | **Text** | `Master trainer` |
| 17 | Nút Khám phá (Text / Link)| `who_btn_text` / `who_btn_link` | **Text** | `EXPLORE MORE` / `#explore` |
| **III**| **OUR PEOPLES (VẦNG SÁNG 2 GIẢNG VIÊN)** | | | |
| 17 | Peoples Eyebrow | `home_people_eyebrow` | **Text** | `OUR PEOPLES` |
| 18 | Peoples Tiêu đề | `home_people_title` | **Text** | `Learn from the Experts` |
| 19 | Peoples Mô tả | `home_people_desc` | **Textarea** | `Focused training paths for skin, laser, permanent makeup...` |
| 20 | Câu Quote lớn bên trái | `home_people_quote` | **Textarea** | `Every student leaves with work I would sign my name to.` |
| 21 | Tác giả câu Quote | `home_people_author` | **Text** | `EMILY` |
| 22 | 🔄 **2 Giảng viên vầng sáng**| `home_people_list` | **Repeater** | *(Thêm Kathleen & Emily)* |
| └ | *Tên giảng viên* | `name` | **Text** | `Kathleen` / `Emily` |
| └ | *Chức danh* | `role` | **Text** | `Master Trainer` |
| └ | *Tiểu sử ngắn* | `bio` | **Textarea** | `Trained at PhiBrows, Extreme Lash and Will Anthony Permanent Makeup Academy` |
| └ | *Ảnh chân dung* | `image` | **Image** | Ảnh giảng viên |
| **IV** | **THE COUTURE METHOD (4 BƯỚC)** | | | |
| 23 | Method Tiêu đề | `method_title` | **Text** | `THE COUTURE METHOD` |
| 24 | Method Video animation | `method_video` | **File / Text (URL)**| `/videos/Gold_line_drawing_animation.mp4` |
| 25 | 🔄 **4 Bước đào tạo** | `method_steps` | **Repeater** | *(Thêm 4 bước)* |
| └ | *Tiêu đề bước* | `title` | **Text** | `1. We teach in the room` / `2. We teach on live models`... |
| └ | *Mô tả bước* | `desc` | **Textarea** | `Every course is taught in person, in our Houston classrooms.` |
| **V**| **READY TO START LEARNING** | | | |
| 26 | Ready Eyebrow | `ready_eyebrow` | **Text** | `READY TO START LEARNING?` |
| 27 | Ready Tiêu đề | `ready_title` | **Textarea** | `Find the Beauty Course <br/>That Fits Your Craft.` |
| 28 | 🔄 **2 Card Kêu gọi** | `ready_cards` | **Repeater** | *(Thêm 2 thẻ Shop & Salons)* |
| └ | *Tiêu đề thẻ* | `title` | **Text** | `Shop professional supplies` / `For salons & professionals` |
| └ | *Mô tả thẻ* | `description` | **Textarea** | `Professional skincare, PMU and lash supplies...` |
| └ | *Nút bấm (Text / Link)* | `link_text` / `link_url` | **Text** | `VISIT THE SHOP` (`/shop`) / `TALK TO Admissions` (`/contact`) |
| └ | *Ảnh thẻ* | `image` | **Image** | Ảnh minh họa |

---

## 8. 🎓 TRANG KHÓA HỌC (`PAGE = COURSES`)
> **Quy tắc hiển thị (Display Rules):** `Page` bằng **`Courses`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Phụ đề Course Hero | `course_hero_eyebrow` | **Text** | `Build Your Career with Confidence` |
| 2 | Tiêu đề khóa học | `course_hero_title` | **Textarea** | `Professional Facial <br/>And Skincare Course` |
| 3 | Huy hiệu 1 (Badge 1) | `course_hero_badge_1` | **Text** | `Learn From Experts` |
| 4 | Huy hiệu 2 (Badge 2) | `course_hero_badge_2` | **Text** | `Master the Art of Beauty.` |
| 5 | Mô tả chi tiết | `course_hero_description`| **Textarea** | `Train hands-on with certified beauty professionals who bring years of real-world experience...` |
| 6 | Nút 1 (Text / Link) | `course_hero_btn_1_text` / `course_hero_btn_1_link` | **Text** | `ABOUT THE COURSE` (`#about-course`) |
| 7 | Nút 2 (Text / Link) | `course_hero_btn_2_text` / `course_hero_btn_2_link` | **Text** | `REGISTER FOR THE COURSE` (`#register`) |
| 8 | Ảnh nền lớp học | `course_hero_bg` | **Image** | `/images/courses/course-hero-bg.jpg` |

---

## 9. 🛍️ TRANG CỬA HÀNG (`PAGE = SHOP`)
> **Quy tắc hiển thị (Display Rules):** `Page` bằng **`Shop`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Tiêu đề Banner Shop | `shop_banner_title` | **Text** | `Premium Skincare Professional Results` |
| 2 | Mô tả Banner Shop | `shop_banner_description`| **Textarea** | `Discover carefully selected professional skincare and beauty products designed to support effective treatments...` |
| 3 | Ảnh Banner sản phẩm | `shop_banner_image` | **Image** | `/images/banner_product.jpg` |

---

## 10. 🏢 TRANG GIỚI THIỆU (`PAGE = ABOUT US`)
> **Quy tắc hiển thị (Display Rules):** `Page` bằng **`About Us`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Phụ đề About Hero | `about_hero_eyebrow` | **Text** | `Our Specialized Training Programs` |
| 2 | Tiêu đề chính | `about_hero_title` | **Text** | `ABOUT COUTURE BEAUTY ACADEMY` |
| 3 | Mô tả chi tiết | `about_hero_description` | **Textarea** | `Couture Beauty Academy is a professional training environment where aspiring beauty artists learn, practice...` |
| 4 | Nút 1 (Text / Link) | `about_hero_btn_1_text` / `about_hero_btn_1_link` | **Text** | `CONTACT ADMISSIONS` (`#contact`) |
| 5 | Nút 2 (Text / Link) | `about_hero_btn_2_text` / `about_hero_btn_2_link` | **Text** | `Explore Our Courses` (`/courses`) |
| 6 | Ảnh thực hành 1 & 2 | `about_hero_image_1` / `about_hero_image_2` | **Image** | 2 Ảnh học viên thực hành |

---

## 10. 📚 TRANG TÀI NGUYÊN (`PAGE = RESOURCES`)
> **Quy tắc hiển thị (Display Rules):** `Page` bằng **`Resources`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Phụ đề Hero | `resources_hero_subtitle`| **Text** | `Explore. Learn. Be Inspired` |
| 2 | Tiêu đề chính | `resources_hero_title` | **Text** | `Resources for Your Beauty Journey` |
| 3 | Mô tả chi tiết | `resources_hero_desc` | **Textarea** | `Explore expert articles, training videos, and inspiring moments from our academy...` |
| 4 | Nút 1 (Text / Link) | `resources_hero_btn_1_text` / `resources_hero_btn_1_link` | **Text** | `about us` (`/about-us`) |
| 5 | Nút 2 (Text / Link) | `resources_hero_btn_2_text` / `resources_hero_btn_2_link` | **Text** | `Explore Our Courses` (`/courses`) |
| 6 | Ảnh nền Hero | `resources_hero_bg` | **Image** | `/images/background-resources.jpg` |
| 7 | Tiêu đề Gallery | `resources_gallery_title`| **Text** | `Inside Couture Beauty Academy` |
| 8 | 🔄 **Danh sách Ảnh Gallery**| `resources_gallery_images`| **Repeater** | *(Thêm các ảnh vào thư viện trượt)* |
| └ | *File ảnh* | `image` | **Image** | Upload ảnh phòng học, học viên thực hành |

---

## 11. 📞 TRANG LIÊN HỆ (`PAGE = CONTACT`)
> **Quy tắc hiển thị (Display Rules):** `Page` bằng **`Contact`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Phụ đề Liên hệ | `contact_eyebrow` | **Text** | `CONTACT` |
| 2 | Tiêu đề chính | `contact_title` | **Text** | `HOW WE CAN HELP?` |
| 3 | Mô tả ngắn | `contact_description` | **Textarea** | `Visit our Houston campus and experience the training environment firsthand.` |
| 4 | Tiêu đề khối Giờ mở cửa | `contact_schedule_title`| **Text** | `OPENING HOURS & LOCATION` |
| 5 | Thời gian mở cửa | `contact_schedule_hours`| **Text** | `MONDAY – SATURDAY: 10:00 AM – 7:00 PM` |
| 6 | Địa chỉ Campus | `contact_campus_address`| **Text** | `6441 Westheimer Rd, Houston, TX 77057` |
| 7 | Ảnh nền trang Liên hệ | `contact_bg_image` | **Image** | `/images/background-contact-page.jpg` |

---

## 12. 🌐 CẤU HÌNH CHUNG TOÀN SITE (`PAGE = SITE SETTINGS`)
> **Quy tắc hiển thị (Display Rules):** `Page` bằng **`Site Settings`**

| STT | Nhãn trường (Label) | Tên trường (Name) | Kiểu dữ liệu | Hướng dẫn / Nội dung mẫu |
|:---:|---|---|:---:|---|
| 1 | Logo chính | `site_logo` | **Image** | Logo Couture Beauty Academy |
| 2 | Hotline tư vấn | `site_hotline` | **Text** | `+1 (713) 555-0199` |
| 3 | Email tiếp nhận | `site_email` | **Text** | `admissions@couturebeauty.edu` |
| 4 | Địa chỉ cơ sở chính | `site_address` | **Text** | `9889 Bellaire Blvd, Suite 218, Houston, TX 77036` |
| 5 | Giờ làm việc | `site_hours` | **Text** | `Mon - Sat: 9:00 AM - 6:00 PM` |
| 6 | Link Facebook | `site_facebook` | **Text** | `https://facebook.com/...` |
| 7 | Link Instagram | `site_instagram` | **Text** | `https://instagram.com/...` |
| 8 | Link TikTok | `site_tiktok` | **Text** | `https://tiktok.com/...` |
