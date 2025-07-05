const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // نصب: npm install node-fetch
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیمات
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // برای دریافت JSON از فرانت
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

// صفحه اصلی
app.get("/", (req, res) => {
  res.render("index");
});

// ارسال اطلاعات به ربات بله
app.post("/submit", async (req, res) => {
  const { name, phone, user_id } = req.body;

  // بررسی مقدار user_id
  if (!user_id) {
    return res.status(400).send("❌ شناسه کاربر (user_id) یافت نشد. لطفاً از داخل اپ بله وارد شوید.");
  }

  const token = "129502936:SyFzkkYph1sV62lPeTpFmUJ2l2yy9rzZGo7JVbXq";
  const message = `👤 نام: ${name}\n📱 شماره موبایل: ${phone}\n🆔 ID کاربر: ${user_id}`;

  try {
    const response = await fetch(`https://tapi.bale.ai/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: user_id,
        text: message,
      }),
    });

    const data = await response.json();
    console.log("Bale response:", data);

    if (data.ok) {
      res.send("✅ اطلاعات با موفقیت ارسال شد.");
    } else {
      res.status(500).send("❌ خطا در ارسال پیام به بات بله.");
    }
  } catch (error) {
    console.error("Error sending message to Bale:", error.message);
    res.status(500).send("❌ خطای اتصال به سرور بله.");
  }
});

// اجرا
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
