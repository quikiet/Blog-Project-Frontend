/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      // === GIỮ LẠI MÀU SẮC TÙY CHỈNH ===
      colors: {
        "newsletter-white": "#FFFFFF",
        "newsletter-bg-light": "#F3F2EA",
        "newsletter-bg-dark": "#020809", // Màu nền tối chính (Header/Footer)
        "newsletter-bg-dark-alt": "#1A1A1A", // Màu nền tối phụ (Sub-header/Card)
        "newsletter-green": "#04594D", // Màu xanh lá cây nhấn
        "newsletter-red": "#8E4042", // Màu đỏ nhấn (nút Search?)
        "newsletter-offwhite": "#F7F7F4", // Màu trắng ngà (chữ trên nền tối)
        "newsletter-card-bg": "#FDFDFD", // Màu nền card/phần trắng (gần giống #FFFFFF)
        "newsletter-gray-light": "#D5D5D5", // Màu xám nhạt (chữ phụ trên nền tối?)
        "newsletter-gray-text": "#676767", // Màu xám cho text phụ (byline, date)
        "newsletter-border": "#F1F0F0", // Màu border
        "newsletter-black": "#000000", // Màu đen (chữ trên nền sáng)
        "newsletter-placeholder": "rgba(247, 247, 244, 0.35)", // Màu chữ placeholder search
      },

      // === CHỈ GIỮ LẠI FONT AN TOÀN/CHUẨN ===
      fontFamily: {
        // Đã loại bỏ 'display', 'display-regular', 'display-light' (dùng MaryToddW00-*)
        body: ["Georgia", "serif"], // Font chính cho nội dung, tiêu đề bài viết
        meta: ["Helvetica", "Arial", "sans-serif"], // Font cho thông tin phụ (ngày tháng, tác giả)
        // Giữ lại các font mặc định của Tailwind (sans, serif, mono) để dùng làm fallback
        // 'sans': ['ui-sans-serif', 'system-ui', ...], // (Mặc định đã có)
        // 'serif': ['ui-serif', 'Georgia', ...], // (Mặc định đã có)
        // 'mono': ['ui-monospace', 'SFMono-Regular', ...], // (Mặc định đã có)
      },

      // === GIỮ LẠI KÍCH THƯỚC CHỮ TÙY CHỈNH ===
      fontSize: {
        "display-52": ["52px", "64px"],
        "display-33": ["33.2102px", "100%"],
        "display-24": ["24px", "27px"],
        "display-22": ["22px", "25px"],
        "display-20": ["20px", "23px"],
        "display-19": ["19.3726px", "24px"],
        "display-17": ["17px", "100%"],
        "display-16-decimal": ["16.6051px", "20px"],
        "body-16": ["16px", "18px"],
        "body-15": ["15px", "100%"],
        "meta-11": ["11px", "100%"],
        "meta-10": ["10px", "100%"],
        "meta-9": ["9px", "100%"],
      },

      // === GIỮ LẠI SPACING TÙY CHỈNH (NẾU CẦN) ===
      spacing: {
        "15px": "15px",
        "25px": "25px",
        "40px": "40px",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#04594D",
          secondary: "#804544",
          third: "#E1DBFF",
          white: "#FDFDFD",
          black: "#030809",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
