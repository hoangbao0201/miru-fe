# 📚 Tài liệu Thiết kế Hệ thống

Tài liệu này mô tả các sơ đồ thiết kế và mô hình của hệ thống, bao gồm các use case, sequence diagram, class diagram, ERD và activity diagram.

---

## 📋 Mục lục

### Mô hình Tổng quan
- [Use Case Diagram - General Overview](#usecase-general)
- [Class Diagram](#class)
- [Entity-Relationship Diagram - Links](#erd-entity-relationship)
- [Entity-Relationship Modeling](#erd-entity-attribute)
- [Activity Diagram - General Overview](#erd-activity-general)

### Chức năng Người dùng
- [Xác thực (Authentication)](#ud-auth)
- [Chức năng Người dùng Cơ bản](#ud-user)
- [Chi tiết Chapter](#ud-chapter-read)
- [Quản lý Lịch sử Đọc](#ud-history)
- [Báo cáo Chapter](#ud-report-chapter)
- [Chức năng Bình luận](#ud-comment)
- [Theo dõi Sách](#ud-follow-book)
- [Tìm kiếm Sách](#ud-search-book)

### Chức năng Quản lý
- [Quản lý Shop Item](#ud-shop-item)
- [Chat Toàn cục](#ud-chat)
- [Quản lý Team](#ud-team)
- [Tạo Sách](#ud-create-book)
- [Quản lý Hình ảnh Sách](#ud-book-image)
- [Quản lý Người đóng góp Sách](#ud-book-contributor)
- [Tạo Chapter](#ud-create-chapter)
- [Dịch Chapter bằng AI](#ud-translate-ai)
- [Quản lý Hình ảnh](#ud-image)
- [Quản lý Admin](#ud-admin)

---

## 🎯 Mô hình Tổng quan

### Use Case Diagram - General Overview {#usecase-general}

Sơ đồ use case tổng quan của toàn bộ hệ thống, mô tả các actor và các use case chính.

<img width="1381" height="2361" alt="Use Case Diagram - Tổng quan hệ thống" src="https://github.com/user-attachments/assets/b64806d9-ca25-4fad-9223-2af43a533afc" />

---

### Class Diagram {#class}

Mô hình class diagram mô tả cấu trúc các class và mối quan hệ giữa chúng trong hệ thống.

<img width="2395" height="1127" alt="Class Diagram - Cấu trúc các class trong hệ thống" src="https://github.com/user-attachments/assets/c5f0a3e1-f2d2-4f39-a8a8-317e5178e593" />

---

### Entity-Relationship Diagram - Links {#erd-entity-relationship}

Sơ đồ ERD mô tả mối quan hệ giữa các entity trong cơ sở dữ liệu.

<img width="1842" height="1312" alt="Entity-Relationship Diagram - Mối quan hệ giữa các entity" src="https://github.com/user-attachments/assets/7672139e-3372-4252-a756-7c4466673af6" />

---

### Entity-Relationship Modeling {#erd-entity-attribute}

Mô hình ERD chi tiết mô tả các thuộc tính và mối quan hệ của các entity.

<img width="3687" height="1859" alt="Entity-Relationship Modeling - Thuộc tính và mối quan hệ entity" src="https://github.com/user-attachments/assets/a1df1bdd-545e-4295-8125-dcdfb0ef728b" />

---

### Activity Diagram - General Overview {#erd-activity-general}

Sơ đồ activity tổng quan mô tả luồng hoạt động chính của hệ thống.

<img width="3292" height="2447" alt="Activity Diagram - Tổng quan luồng hoạt động hệ thống" src="https://github.com/user-attachments/assets/96d196b0-714a-4fe8-9830-286b7227bab3" />

---

## 👤 Chức năng Người dùng

### Use Case Diagram - Authentication {#ud-auth}

Sơ đồ use case mô tả các chức năng xác thực người dùng như đăng nhập, đăng ký, làm mới token.

<img width="974" height="509" alt="Use Case Diagram - Xác thực người dùng" src="https://github.com/user-attachments/assets/9c6df106-d218-478b-9b02-ca350df2b7d8" />

### Sequence Diagram - Authentication {#sd-auth}

Sơ đồ sequence mô tả luồng tương tác giữa các thành phần trong quá trình xác thực người dùng.

<img width="825" height="1448" alt="Sequence Diagram - Xác thực người dùng" src="https://github.com/user-attachments/assets/386b8ed0-58c2-46cf-90bc-987e042c7b3f" />

---

### Use Case Diagram - Basic User Functions {#ud-user}

Sơ đồ use case mô tả các chức năng cơ bản của người dùng như xem thông tin, cập nhật profile.

<img width="974" height="773" alt="Use Case Diagram - Chức năng người dùng cơ bản" src="https://github.com/user-attachments/assets/1e1014ad-6095-46c1-86c5-0f18b86c8e66" />

### Sequence Diagram - Basic User Functions {#sd-user}

Sơ đồ sequence mô tả luồng thực hiện các chức năng cơ bản của người dùng.

<img width="798" height="1438" alt="Sequence Diagram - Chức năng người dùng cơ bản" src="https://github.com/user-attachments/assets/1d85f484-d031-43fa-a805-e73904836449" />

---

### Use Case Diagram - Chapter Details {#ud-chapter-read}

Sơ đồ use case mô tả các chức năng liên quan đến việc xem chi tiết chapter như đọc chapter, xem danh sách chapter.

<img width="974" height="273" alt="Use Case Diagram - Chi tiết Chapter" src="https://github.com/user-attachments/assets/fb7ba972-d3cb-440b-b2c9-e4abc5a7f39b" />

### Sequence Diagram - Chapter Details {#sd-chapter-read}

Sơ đồ sequence mô tả luồng tương tác khi người dùng xem chi tiết chapter.

<img width="974" height="1014" alt="Sequence Diagram - Chi tiết Chapter" src="https://github.com/user-attachments/assets/9f825f8b-0265-4e60-8e6b-4e6f94db8353" />

---

### Use Case Diagram - Reading History Management {#ud-history}

Sơ đồ use case mô tả các chức năng quản lý lịch sử đọc như xem lịch sử, xóa lịch sử.

<img width="974" height="254" alt="Use Case Diagram - Quản lý lịch sử đọc" src="https://github.com/user-attachments/assets/d6fdb39f-f464-470e-abb5-5ecd6db8a2e2" />

### Sequence Diagram - Reading History Management {#sd-history}

Sơ đồ sequence mô tả luồng quản lý lịch sử đọc của người dùng.

<img width="974" height="1010" alt="Sequence Diagram - Quản lý lịch sử đọc" src="https://github.com/user-attachments/assets/3c92fdd4-44b5-4939-a023-31fe2afe3f07" />

---

### Use Case Diagram - Report Chapter {#ud-report-chapter}

Sơ đồ use case mô tả các chức năng báo cáo chapter như tạo báo cáo, xem danh sách báo cáo.

<img width="974" height="383" alt="Use Case Diagram - Báo cáo Chapter" src="https://github.com/user-attachments/assets/4845df25-0940-4329-8b1c-a36cda5ff90d" />

### Sequence Diagram - Report Chapter {#sd-report-chapter}

Sơ đồ sequence mô tả luồng thực hiện báo cáo chapter.

<img width="974" height="853" alt="Sequence Diagram - Báo cáo Chapter" src="https://github.com/user-attachments/assets/b22fc39b-f414-4977-be57-c013deb30c1d" />

---

### Use Case Diagram - Comment Function {#ud-comment}

Sơ đồ use case mô tả các chức năng bình luận như thêm bình luận, sửa, xóa bình luận.

<img width="974" height="380" alt="Use Case Diagram - Chức năng bình luận" src="https://github.com/user-attachments/assets/0325dbad-65dc-44bb-aef7-24801e8c9418" />

### Sequence Diagram - Comment Function {#sd-comment}

Sơ đồ sequence mô tả luồng tương tác trong chức năng bình luận.

<img width="974" height="1175" alt="Sequence Diagram - Chức năng bình luận" src="https://github.com/user-attachments/assets/a5316242-fd6a-4406-b575-fa272dc92aa8" />

---

### Use Case Diagram - Follow Book {#ud-follow-book}

Sơ đồ use case mô tả các chức năng theo dõi sách như theo dõi, bỏ theo dõi, xem danh sách sách đã theo dõi.

<img width="974" height="341" alt="Use Case Diagram - Theo dõi Sách" src="https://github.com/user-attachments/assets/171c277b-6be7-4328-8938-1020de3dda41" />

### Sequence Diagram - Follow Book {#sd-follow-book}

Sơ đồ sequence mô tả luồng thực hiện chức năng theo dõi sách.

<img width="974" height="1221" alt="Sequence Diagram - Theo dõi Sách" src="https://github.com/user-attachments/assets/60d78a0d-e9de-4fca-b605-3f771cdeab0e" />

---

### Use Case Diagram - Search Book {#ud-search-book}

Sơ đồ use case mô tả các chức năng tìm kiếm sách như tìm kiếm theo tên, thể loại, tác giả.

<img width="974" height="485" alt="Use Case Diagram - Tìm kiếm Sách" src="https://github.com/user-attachments/assets/195c19df-247b-4883-af05-722d381f2a74" />

### Sequence Diagram - Search Book {#sd-search-book}

Sơ đồ sequence mô tả luồng thực hiện tìm kiếm sách.

<img width="974" height="789" alt="Sequence Diagram - Tìm kiếm Sách" src="https://github.com/user-attachments/assets/6b364a94-ef5e-49cd-b9dc-eb273e1de36d" />

---

## 🛠️ Chức năng Quản lý

### Use Case Diagram - Shop Item Management {#ud-shop-item}

Sơ đồ use case mô tả các chức năng quản lý shop item như thêm, sửa, xóa, xem danh sách item.

<img width="974" height="508" alt="Use Case Diagram - Quản lý Shop Item" src="https://github.com/user-attachments/assets/86b64969-52e8-486d-b179-ede25cf9fe9f" />

### Sequence Diagram - Shop Item Management {#sd-shop-item}

Sơ đồ sequence mô tả luồng quản lý shop item.

<img width="974" height="1234" alt="Sequence Diagram - Quản lý Shop Item" src="https://github.com/user-attachments/assets/ef5daa6d-3a6e-48ed-9d36-c64cc9be06d4" />

---

### Use Case Diagram - Global Chat {#ud-chat}

Sơ đồ use case mô tả các chức năng chat toàn cục như gửi tin nhắn, xem lịch sử chat, quản lý tin nhắn.

<img width="974" height="807" alt="Use Case Diagram - Chat Toàn cục" src="https://github.com/user-attachments/assets/588dfb62-d20a-405d-92b0-45bdee185cf2" />

### Sequence Diagram - Global Chat {#sd-chat}

Sơ đồ sequence mô tả luồng tương tác trong chức năng chat toàn cục.

<img width="974" height="859" alt="Sequence Diagram - Chat Toàn cục" src="https://github.com/user-attachments/assets/4f017e05-7a1b-453d-8144-0f66f56ec89b" />

---

### Use Case Diagram - Team Management {#ud-team}

Sơ đồ use case mô tả các chức năng quản lý team như tạo team, thêm thành viên, quản lý quyền.

<img width="974" height="945" alt="Use Case Diagram - Quản lý Team" src="https://github.com/user-attachments/assets/1557af5a-35f1-4716-869d-41b54ee39925" />

### Sequence Diagram - Team Management {#sd-team}

Sơ đồ sequence mô tả luồng quản lý team và các thành viên.

<img width="943" height="1439" alt="Sequence Diagram - Quản lý Team" src="https://github.com/user-attachments/assets/13f810c0-9182-4ad0-89dd-a120657d4c4f" />

---

### Use Case Diagram - Create Book {#ud-create-book}

Sơ đồ use case mô tả các chức năng tạo sách như tạo sách mới, cập nhật thông tin sách.

<img width="974" height="462" alt="Use Case Diagram - Tạo Sách" src="https://github.com/user-attachments/assets/be635925-8476-4aa3-bd32-b0e7823fd059" />

### Sequence Diagram - Create Book {#sd-create-book}

Sơ đồ sequence mô tả luồng thực hiện tạo sách mới.

<img width="974" height="654" alt="Sequence Diagram - Tạo Sách" src="https://github.com/user-attachments/assets/1f081e7a-444e-4899-bd52-9e5b8c37fe03" />

---

### Use Case Diagram - Book Image Management {#ud-book-image}

Sơ đồ use case mô tả các chức năng quản lý hình ảnh sách như upload, xóa, cập nhật hình ảnh.

<img width="974" height="486" alt="Use Case Diagram - Quản lý Hình ảnh Sách" src="https://github.com/user-attachments/assets/5ca3248f-07c9-4488-b67f-9171b2d4589a" />

### Sequence Diagram - Book Image Management {#sd-book-image}

Sơ đồ sequence mô tả luồng quản lý hình ảnh sách.

<img width="974" height="1053" alt="Sequence Diagram - Quản lý Hình ảnh Sách" src="https://github.com/user-attachments/assets/5f209c26-df2e-4bec-94ac-f6995b3ecd1a" />

---

### Use Case Diagram - Book Contributor Management {#ud-book-contributor}

Sơ đồ use case mô tả các chức năng quản lý người đóng góp sách như thêm, xóa, cập nhật contributor.

<img width="974" height="477" alt="Use Case Diagram - Quản lý Người đóng góp Sách" src="https://github.com/user-attachments/assets/be1b3c0c-0801-46ad-ab52-984fb9538ca4" />

### Sequence Diagram - Book Contributor Management {#sd-book-contributor}

Sơ đồ sequence mô tả luồng quản lý người đóng góp sách.

<img width="974" height="1115" alt="Sequence Diagram - Quản lý Người đóng góp Sách" src="https://github.com/user-attachments/assets/2f4ec2ce-fcb1-47d9-a801-dcedfe55136c" />

---

### Use Case Diagram - Create Chapter {#ud-create-chapter}

Sơ đồ use case mô tả các chức năng tạo chapter như tạo chapter mới, cập nhật nội dung chapter.

<img width="974" height="398" alt="Use Case Diagram - Tạo Chapter" src="https://github.com/user-attachments/assets/3c9a9876-0a9e-42c9-8822-b1c5c8a867b5" />

### Sequence Diagram - Create Chapter {#sd-create-chapter}

Sơ đồ sequence mô tả luồng thực hiện tạo chapter mới.

<img width="974" height="957" alt="Sequence Diagram - Tạo Chapter" src="https://github.com/user-attachments/assets/29c43a0e-b45f-449d-b5be-dfc5f115d758" />

---

### Use Case Diagram - AI Translate Chapter {#ud-translate-ai}

Sơ đồ use case mô tả chức năng dịch chapter tự động bằng AI.

<img width="974" height="248" alt="Use Case Diagram - Dịch Chapter bằng AI" src="https://github.com/user-attachments/assets/bb9a4e22-5d51-4bd2-8d43-58b0cdeceafd" />

### Sequence Diagram - AI Translate Chapter {#sd-translate-ai}

Sơ đồ sequence mô tả luồng thực hiện dịch chapter bằng AI.

<img width="974" height="1079" alt="Sequence Diagram - Dịch Chapter bằng AI" src="https://github.com/user-attachments/assets/b11bedb2-a04d-4dac-b839-f1290605745e" />

---

### Use Case Diagram - Image Management {#ud-image}

Sơ đồ use case mô tả các chức năng quản lý hình ảnh như upload, xóa, cập nhật hình ảnh.

<img width="974" height="318" alt="Use Case Diagram - Quản lý Hình ảnh" src="https://github.com/user-attachments/assets/e0b33331-1eb3-4cb1-a155-6754b9db5188" />

### Sequence Diagram - Image Management {#sd-image}

Sơ đồ sequence mô tả luồng quản lý hình ảnh trong hệ thống.

<img width="974" height="904" alt="Sequence Diagram - Quản lý Hình ảnh" src="https://github.com/user-attachments/assets/41f777e1-8e6c-4c19-8768-5efccd457b9a" />

---

### Use Case Diagram - Admin Management {#ud-admin}

Sơ đồ use case mô tả các chức năng quản lý admin như tạo admin, phân quyền, quản lý người dùng.

<img width="974" height="489" alt="Use Case Diagram - Quản lý Admin" src="https://github.com/user-attachments/assets/7de050ac-cb58-4b75-b4f9-c9d49a4db93d" />

### Sequence Diagram - Admin Management {#sd-admin}

Sơ đồ sequence mô tả luồng quản lý admin và phân quyền.

<img width="974" height="794" alt="Sequence Diagram - Quản lý Admin" src="https://github.com/user-attachments/assets/a70ae348-12ee-48ce-98be-ba1b26feb9c0" />

---
