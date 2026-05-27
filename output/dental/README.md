# 璞白牙醫美學診所 Landing Page

一頁式高端牙醫診所行銷網頁，採用現代簡約科技感設計，搭配莫蘭迪綠 × 科技藍色系，
為患者創造放鬆、不害怕看牙的品牌印象。

---

## 🦷 專案概述

| 項目 | 說明 |
|------|------|
| **專案類型** | 靜態一頁式 Landing Page |
| **語言** | HTML5 / CSS3 / Vanilla JavaScript |
| **字型** | Google Fonts（Noto Serif TC、Noto Sans TC、Playfair Display） |
| **圖示** | Font Awesome 6 |
| **主色調** | 科技藍 `#4A9FC4`、莫蘭迪綠 `#5BAD8A`、青藍 `#3DA8A8` |

---

## ✅ 已完成功能

### 頁面區塊
- **Hero Section**：全螢幕主視覺，含標語、雙按鈕 CTA、統計數字動態計數器
- **Services（三大核心服務）**：卡片式設計，展示「隱形矯正」、「一日美齒貼片」、「舒眠無痛植牙」
- **Why Us（為何選擇我們）**：深色沉浸背景，4 大特色說明（微創、數位科技、隱私診間、溫暖關係）
- **Doctors（醫師團隊）**：3 位醫師卡片，含照片、資歷、專屬引言
- **Before/After + Testimonials**：自動輪播前後對比案例 + 3 則患者評價
- **CTA Banner**：免費諮詢呼籲行動橫幅
- **Footer / Contact**：聯絡資訊、營業時間、Google 地圖嵌入、預約表單

### 互動功能
- 固定導覽列（捲動後背景變化 + 毛玻璃效果）
- 手機版漢堡選單（展開／收合動畫）
- Scroll Reveal 進場動畫（Intersection Observer）
- Before/After 自動輪播（含手動切換、暫停懸停）
- 預約表單驗證 + 模擬送出成功回饋
- 返回頂端按鈕（捲動 400px 後顯示）
- Hero 統計數字計數器動畫
- 服務卡片 stagger 進場效果

---

## 📁 檔案結構

```
/
├── index.html          ← 主頁面（所有區塊）
├── css/
│   └── style.css       ← 完整樣式（含 RWD）
├── js/
│   └── main.js         ← 互動邏輯
└── README.md
```

---

## 🔗 功能入口 URI

| 路徑 | 說明 |
|------|------|
| `/` 或 `index.html` | 主要 Landing Page |
| `#hero` | 首頁大圖區 |
| `#services` | 三大服務 |
| `#whyus` | 為何選擇我們 |
| `#doctors` | 醫師團隊 |
| `#testimonials` | 成功案例與患者評價 |
| `#contact` | 聯絡預約（Footer） |

---

## ❌ 尚未實作功能

- 真實後端預約系統（目前為模擬送出）
- 線上即時客服聊天功能
- 多語言版本（英文 / 日文）
- 部落格 / 健康衛教文章頁面
- 患者登入系統與看診記錄查詢
- SEO meta tags 優化（OG tags、結構化資料）

---

## 🚀 建議下一步

1. **串接預約 API**：將表單串接後端服務（如 Google Forms / Calendly）
2. **加入 SEO**：補充 `<meta>` description、Open Graph、Schema.org 結構化資料
3. **效能優化**：使用 WebP 圖片格式、Lazy Loading
4. **追蹤代碼**：加入 Google Analytics 4 / Facebook Pixel
5. **A/B 測試**：對 CTA 按鈕文案、英雄圖做分流測試

---

## 🎨 設計規範

| 項目 | 值 |
|------|----|
| 主藍色  | `#4A9FC4` |
| 深藍色  | `#2E7FA4` |
| 莫蘭迪綠 | `#5BAD8A` |
| 青藍色  | `#3DA8A8` |
| 暗背景  | `#0D2137` |
| 字型（標題） | Noto Serif TC / Playfair Display |
| 字型（內文） | Noto Sans TC |
| 圓角   | 8px / 16px / 28px |
| 陰影   | `0 20px 60px rgba(26,42,58,.12)` |

---

*© 2025 璞白牙醫美學診所 · 本網頁為展示用途*
