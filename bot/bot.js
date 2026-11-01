require("dotenv").config();

const TelegramBot = require(
  "node-telegram-bot-api"
);

const bot = new TelegramBot(
  process.env.BOT_TOKEN,
  {
    polling: true
  }
);

const sessions = new Map();

bot.onText(/^\/start$/, async (msg) => {
  sessions.set(msg.chat.id, {
    step: "websiteUrl"
  });

  await bot.sendMessage(
    msg.chat.id,
    "🛠 FloX Web2APK\n\n" +
    "Kirim URL website yang ingin dijadikan APK."
  );
});

bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) {
    return;
  }

  const chatId = msg.chat.id;
  const session = sessions.get(chatId);

  if (!session) {
    return;
  }

  if (session.step === "websiteUrl") {
    session.websiteUrl = msg.text.trim();
    session.step = "photo";

    return bot.sendMessage(
      chatId,
      "Sekarang kirim FOTO asli sebagai foto/file.\n\n" +
      "URL gambar tidak diterima."
    );
  }

  if (session.step === "filename") {
    session.filename = msg.text.trim();
    session.step = "appName";

    return bot.sendMessage(
      chatId,
      "Kirim nama aplikasi/cangkang."
    );
  }

  if (session.step === "appName") {
    session.appName = msg.text.trim();

    return bot.sendMessage(
      chatId,
      "Data diterima.\n" +
      "Tahap builder APK akan diproses."
    );
  }
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions.get(chatId);

  if (!session || session.step !== "photo") {
    return;
  }

  const photo = msg.photo[msg.photo.length - 1];

  session.photoFileId = photo.file_id;
  session.step = "filename";

  await bot.sendMessage(
    chatId,
    "Foto diterima.\n\n" +
    "Sekarang kirim nama file APK.\n" +
    "Contoh: FloXID"
  );
});

bot.on("document", async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions.get(chatId);

  if (!session || session.step !== "photo") {
    return;
  }

  const mime = msg.document.mime_type || "";

  if (!mime.startsWith("image/")) {
    return bot.sendMessage(
      chatId,
      "Foto Hanya Di Terima Jika Itu Bukan URL"
    );
  }

  session.photoFileId =
    msg.document.file_id;

  session.step = "filename";

  await bot.sendMessage(
    chatId,
    "Foto diterima.\n\n" +
    "Sekarang kirim nama file APK.\n" +
    "Contoh: FloXID"
  );
});

console.log("FloX Web2APK Bot Online");
