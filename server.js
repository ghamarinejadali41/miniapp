const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیمات
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

// صفحه اصلی
app.get("/", (req, res) => {
  res.render("index");
});

// دریافت اطلاعات از فرم و ارسال به بات بله
app.post("/submit", async (req, res) => {
  const { name, phone, user_id, username, first_name } = req.body;

  const message = `
📩 اطلاعات جدید از مینی‌اپ بله:
👤 نام وارد شده: ${name}
📱 شماره موبایل: ${phone}
🆔 آیدی کاربر: ${user_id}
👨‍💻 نام کاربری: ${username}
📝 نام نمایشی: ${first_name}
⏱ زمان: ${new Date().toLocaleString("fa-IR")}
`;

  const token = "129502936:SyFzkkYph1sV62lPeTpFmUJ2l2yy9rzZGo7JVbXq";
  const chatId = "1705369276";

  try {
    const response = await fetch(`https://tapi.bale.ai/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      res.send("✅ اطلاعات با موفقیت به بات ارسال شد.");
    } else {
      res.send("❌ خطا در ارسال پیام به بات.");
    }
  } catch (err) {
    console.error(err);
    res.send("❌ خطای اتصال به سرور.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
