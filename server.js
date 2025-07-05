const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیمات
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

// صفحه اصلی
app.get("/", (req, res) => {
  res.render("index");
});

// ارسال اطلاعات به بات بله
app.post("/submit", async (req, res) => {
  const { name, phone, userId, username, timestamp, userAgent } = req.body;
  const token = "129502936:SyFzkkYph1sV62lPeTpFmUJ2l2yy9rzZGo7JVbXq";
  const chatId = "1705369276"; // جایگزین با آی‌دی خودت

  const message = `
📥 اطلاعات دریافتی از مینی‌اپ بله:
👤 نام: ${name}
📱 موبایل: ${phone}
🆔 یوزر ID: ${userId}
💬 یوزرنیم: @${username}
🕓 زمان: ${timestamp}
🌐 مرورگر: ${userAgent}
  `;

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
    res.send("❌ خطای سرور.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
