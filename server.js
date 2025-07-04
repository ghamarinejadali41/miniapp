const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // نصب نیاز دارد: npm install node-fetch
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

// ارسال اطلاعات به بات Bale
app.post("/submit", async (req, res) => {
  const { name, phone } = req.body;
  const token = "129502936:SyFzkkYph1sV62lPeTpFmUJ2l2yy9rzZGo7JVbXq";
  const chatId = "1705369276"; // این باید عدد باشه، اسم بات نیست (پایین توضیح می‌دم)

  const message = `👤 نام: ${name}\n📱 شماره موبایل: ${phone}`;

  try {
    const response = await fetch(`https://tapi.bale.ai/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId, // باید عددی باشه
        text: message,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.ok) {
      res.send("✅ اطلاعات با موفقیت ارسال شد.");
    } else {
      res.send("❌ خطا در ارسال پیام به بات.");
    }
  } catch (error) {
    console.error(error);
    res.send("❌ خطای اتصال به سرور.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
