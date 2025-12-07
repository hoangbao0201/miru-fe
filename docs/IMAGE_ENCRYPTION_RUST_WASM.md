# 4.3. Xử lí bảo mật hiển thị mã hóa ảnh

## 4.3.1. Vấn đề

Trong hệ thống Miru, việc bảo vệ nội dung ảnh truyện tranh khỏi việc sao chép và phân phối trái phép là một yêu cầu quan trọng. Tuy nhiên, việc triển khai giải pháp mã hóa ảnh gặp phải những thách thức sau:

### 4.3.1.1. Yêu cầu giải mã phía client

- **Vấn đề**: Ảnh cần được giải mã trực tiếp trên trình duyệt của người dùng để hiển thị, không thể giải mã hoàn toàn trên server vì sẽ tạo ra gánh nặng băng thông và độ trễ lớn khi phải stream toàn bộ ảnh đã giải mã.
- **Hệ quả**: Logic giải mã phải được thực thi trên môi trường client-side, khiến code dễ bị reverse engineering và bị bẻ khóa.

### 4.3.1.2. Hiệu năng xử lý ảnh lớn

- **Vấn đề**: Ảnh truyện tranh thường có độ phân giải cao (có thể lên đến hàng nghìn pixel), việc xử lý pixel-level operations (như xáo trộn các phần của ảnh, giải mã DRM) yêu cầu xử lý hàng triệu pixel một cách nhanh chóng.
- **Hệ quả**: JavaScript thuần không đủ hiệu năng để xử lý các thao tác này một cách mượt mà, đặc biệt trên các thiết bị di động có tài nguyên hạn chế.

### 4.3.1.3. Bảo mật và obfuscation

- **Vấn đề**: Code JavaScript có thể dễ dàng bị đọc, phân tích và reverse engineering thông qua DevTools của trình duyệt. Bất kỳ thuật toán mã hóa nào được viết bằng JavaScript đều có thể bị người dùng xem và hiểu được logic.
- **Hệ quả**: Nguy cơ cao bị bẻ khóa thuật toán mã hóa, dẫn đến việc người dùng có thể tự giải mã và lưu trữ ảnh gốc mà không cần quyền truy cập hợp pháp.

### 4.3.1.4. Tương thích đa nền tảng

- **Vấn đề**: Cần một giải pháp có thể chạy trên mọi trình duyệt hiện đại (Chrome, Firefox, Safari, Edge) và các thiết bị khác nhau (desktop, mobile, tablet).
- **Hệ quả**: Không thể sử dụng các giải pháp native như C++ compiled code hoặc các extension trình duyệt vì không đảm bảo tính tương thích.

## 4.3.2. Cách giải quyết

Để giải quyết các vấn đề trên, hệ thống đã lựa chọn sử dụng **Rust compiled to WebAssembly (WASM)** cho việc mã hóa và giải mã ảnh. Đây là giải pháp tối ưu với các lợi ích sau:

### 4.3.2.1. Hiệu năng vượt trội

- **Rust là ngôn ngữ hệ thống**: Rust được thiết kế để đạt hiệu năng gần như C/C++ nhưng an toàn hơn về memory. Khi compile sang WASM, code Rust có thể đạt được hiệu năng gần như native code.
- **Xử lý song song**: Rust hỗ trợ tốt các thao tác xử lý song song, cho phép xử lý các pixel operations trên ảnh lớn một cách hiệu quả.
- **Zero-cost abstractions**: Rust cho phép viết code ở mức abstraction cao nhưng vẫn đạt hiệu năng tối ưu khi compile.
- **Kết quả**: Việc giải mã ảnh DRM có thể được thực hiện trong vài trăm milliseconds thay vì vài giây như JavaScript thuần, đảm bảo trải nghiệm người dùng mượt mà.

### 4.3.2.2. Bảo mật và khó reverse engineering

- **Binary format**: WASM được compile thành binary format, khó đọc và phân tích hơn nhiều so với JavaScript source code. Mặc dù vẫn có thể reverse engineer, nhưng độ khó tăng đáng kể.
- **Obfuscation tự nhiên**: Quá trình compile từ Rust sang WASM tự động tạo ra code đã được obfuscate một phần, làm cho việc hiểu logic thuật toán trở nên khó khăn hơn.
- **Memory safety**: Rust đảm bảo memory safety tại compile-time, giảm thiểu lỗ hổng bảo mật so với C/C++.
- **Kết quả**: Thuật toán mã hóa được bảo vệ tốt hơn, giảm nguy cơ bị bẻ khóa và sao chép trái phép.

### 4.3.2.3. Tương thích đa nền tảng

- **WebAssembly standard**: WASM là một standard được hỗ trợ bởi tất cả các trình duyệt hiện đại (Chrome, Firefox, Safari, Edge) và các runtime JavaScript (Node.js, Deno).
- **Không phụ thuộc platform**: Code WASM có thể chạy trên bất kỳ platform nào có hỗ trợ WASM runtime, bao gồm desktop, mobile, và thậm chí là server-side.
- **Kết quả**: Một codebase duy nhất có thể chạy trên mọi môi trường mà không cần viết lại code cho từng platform.

### 4.3.2.4. Tích hợp dễ dàng với JavaScript

- **Interoperability**: WASM có thể giao tiếp trực tiếp với JavaScript thông qua các function exports và imports, cho phép tích hợp mượt mà với codebase frontend hiện tại.
- **Type safety**: Các tool như `wasm-bindgen` cho phép generate TypeScript definitions từ Rust code, đảm bảo type safety khi gọi WASM functions từ TypeScript.
- **Kết quả**: Việc tích hợp WASM module vào ứng dụng Next.js/React hiện tại trở nên đơn giản và an toàn về mặt type.

### 4.3.2.5. Kích thước file nhỏ gọn

- **Optimized binary**: WASM binary được optimize tốt, thường nhỏ hơn so với JavaScript bundle tương đương cho các thao tác xử lý phức tạp.
- **Lazy loading**: WASM module có thể được load một cách lazy, chỉ khi cần thiết (khi có ảnh DRM cần giải mã), giảm thiểu ảnh hưởng đến thời gian load trang ban đầu.
- **Kết quả**: Trải nghiệm người dùng tốt hơn với thời gian load nhanh và hiệu năng cao.

### 4.3.2.6. Khả năng mở rộng và bảo trì

- **Code reuse**: Logic mã hóa/giải mã có thể được viết một lần bằng Rust và sử dụng lại ở cả client-side (WASM) và server-side (native Rust hoặc qua FFI).
- **Testing**: Rust có hệ sinh thái testing mạnh mẽ, cho phép viết unit tests và integration tests một cách dễ dàng.
- **Kết quả**: Code dễ bảo trì, dễ test, và có thể tái sử dụng ở nhiều nơi trong hệ thống.

### 4.3.2.7. Triển khai thực tế trong hệ thống

Trong hệ thống Miru, WASM module được sử dụng như sau:

- **Module location**: `/public/wasm/drm_tool/pkg/drm_tool.js` và `drm_tool_bg.wasm`
- **Main function**: `unscramble_image_from_drm(data: Uint8Array, width: number, height: number, drm_data: string)`
- **Usage**: Component `PrivateImage.tsx` sử dụng `WasmManager` singleton để load và sử dụng WASM module khi cần giải mã ảnh DRM
- **Flow**: 
  1. Load ảnh đã mã hóa từ server
  2. Vẽ ảnh lên Canvas để lấy ImageData
  3. Gọi WASM function để giải mã
  4. Cập nhật Canvas với ảnh đã giải mã
  5. Hiển thị ảnh cho người dùng

### 4.3.2.8. Kết luận

Việc sử dụng Rust compiled to WASM cho mã hóa ảnh là một lựa chọn tối ưu, cân bằng giữa:
- **Hiệu năng**: Xử lý nhanh các thao tác pixel-level trên ảnh lớn
- **Bảo mật**: Khó reverse engineering hơn JavaScript thuần
- **Tương thích**: Chạy được trên mọi trình duyệt và thiết bị hiện đại
- **Khả năng bảo trì**: Code dễ test và mở rộng

Giải pháp này đảm bảo hệ thống có thể bảo vệ nội dung ảnh một cách hiệu quả trong khi vẫn cung cấp trải nghiệm người dùng mượt mà và nhanh chóng.





