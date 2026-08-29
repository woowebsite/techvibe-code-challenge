# Problem 3: Phân tích & Tối ưu hóa mã nguồn

## 1. Các vấn đề phát hiện được & Giải pháp

| # | Vấn đề / Anti-pattern | Nguyên nhân & Tác động | Giải pháp khắc phục |
|---|---|---|---|
| **1** | **Biến chưa khai báo (`lhsPriority`)** | Dòng 39 gọi `lhsPriority` thay vì `balancePriority`, gây crash runtime / lỗi TypeScript. | Đổi thành `balancePriority > -99`. |
| **2** | **Logic lọc bị ngược** | `balance.amount <= 0` chỉ giữ lại số dư $\le 0$ và loại bỏ số dư hợp lệ. | Đổi thành `balancePriority > -99 && balance.amount > 0`. |
| **3** | **Sort comparator thiếu case bằng nhau** | Không trả về `0` khi `leftPriority === rightPriority` dẫn đến sắp xếp không ổn định. | Dùng `return rightPriority - leftPriority;`. |
| **4** | **Thừa dependency trong `useMemo`** | `prices` nằm trong dependency `[balances, prices]` dù không được dùng, gây re-compute lãng phí khi giá biến động. | Đổi thành `[balances]`. |
| **5** | **Khởi tạo lại hàm `getPriority`** | Khai báo trong body component khiến hàm bị tạo lại ở mỗi render. | Chuyển ra ngoài component, dùng object map tra cứu $O(1)$. |
| **6** | **Dead code & Lặp mảng dư thừa** | `formattedBalances` được tạo ra nhưng không dùng; `rows` lặp trên `sortedBalances` khiến `balance.formatted` bị `undefined`. | Gộp filter, sort và format vào 1 luồng `useMemo` duy nhất. |
| **7** | **Dùng `key={index}`** | Phá vỡ React reconciliation khi danh sách thay đổi thứ tự/số lượng. | Dùng stable key: `${balance.blockchain}-${balance.currency}`. |
| **8** | **Lỗi Type & Thiếu an toàn** | Thiếu trường `blockchain`, lạm dụng `any`, tính USD dễ bị `NaN` nếu giá `undefined`. | Bổ sung type, union `Blockchain`, fallback `(prices[balance.currency] ?? 0)`. |

---

## 2. Kiến trúc & Tổ chức mã nguồn (Clean Code)

* **Tách biệt Business Logic (Custom Hook):** Đóng gói toàn bộ xử lý (filter, sort, format, tính USD) vào `useFormattedBalances` $\rightarrow$ `WalletPage` trở thành *Pure Presentational Component*, dễ dàng viết Unit Test độc lập.
* **Single Source of Truth cho View Model:** `FormattedWalletBalance` tích hợp sẵn `usdValue` và `formatted` $\rightarrow$ Render JSX chỉ binding dữ liệu, không tính toán inline trong map.
* **Hằng số & Hàm thuần túy (Constants & Pure Helpers):** Chuyển `BLOCKCHAIN_PRIORITY`, `getPriority`, `formatAmount` ra ngoài component $\rightarrow$ Tra cứu $O(1)$, không tạo lại hàm theo lifecycle của React.
* **Strict Type-Safety:** Loại bỏ hoàn toàn `any`, định nghĩa rõ ràng `Blockchain`, `WalletBalance`, `WalletPageProps`.

---

## 3. Mã nguồn hoàn chỉnh sau khi tối ưu

Toàn bộ mã nguồn đã được refactor tại **[index.tsx](./index.tsx)**.
