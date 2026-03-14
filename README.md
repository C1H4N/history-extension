# 🗑️ Site Geçmiş Temizleyici

<p align="center">
  <img src="icons/icon128.png" alt="Site Geçmiş Temizleyici" width="128" height="128">
</p>

<p align="center">
  <strong>Chrome ve Edge için belirli sitelerin geçmişini temizleyen modern bir eklenti</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Chrome-Uyumlu-green?style=flat-square&logo=googlechrome" alt="Chrome">
  <img src="https://img.shields.io/badge/Edge-Uyumlu-blue?style=flat-square&logo=microsoftedge" alt="Edge">
  <img src="https://img.shields.io/badge/Lisans-MIT-yellow?style=flat-square" alt="MIT License">
</p>

---

## ✨ Özellikler

- 🎯 **Site Bazlı Silme** — Sadece belirli bir domain ve alt alan adları için geçmişi sil (örn. `youtube.com` → `m.youtube.com` dahil)
- 📅 **Tarih Filtresi** — Belirli bir tarih aralığında ziyaret edilen sayfaları sil
- 👁️ **Önizleme** — Silmeden önce kaç kayıt bulunduğunu gör
- ⚡ **Hızlı Seçim** — YouTube, Instagram, TikTok gibi popüler sitelere tek tıkla erişim
- 🎨 **Modern Arayüz** — Koyu tema, minimal ve şık tasarım
- 💾 **Akıllı Hafıza** — Son kullandığın domain otomatik hatırlanır

## 🚀 Kurulum

### Chrome
1. `chrome://extensions` adresine git
2. Sağ üstten **Geliştirici modu**'nu aç
3. **Paketlenmemiş öğe yükle** butonuna tıkla
4. Bu klasörü seç

### Edge
1. `edge://extensions` adresine git
2. Sol alttan **Geliştirici modu**'nu aç
3. **Paketlenmemiş öğe yükle** butonuna tıkla
4. Bu klasörü seç

### Diğer Chromium Tarayıcılar
Brave, Opera, Vivaldi gibi Chromium tabanlı tarayıcılarda da benzer adımlarla kurulum yapabilirsin.

## 📖 Kullanım

1. Tarayıcı araç çubuğundaki eklenti ikonuna tıkla
2. Temizlemek istediğin siteyi yaz veya hızlı seçim butonlarından birini kullan
3. *Opsiyonel:* Tarih aralığı kullanmak istersen toggle'ı aç
4. **Önizle** butonuna tıkla
5. Bulunan kayıtları incele
6. **Geçmişi Sil** butonuna tıkla

> **Not:** Tarih aralığı kullanıldığında, bu aralıkta ziyaret edilen sayfalar geçmişten tamamen silinir; aynı sayfanın aralık dışındaki ziyaretleri de silinir. Tarayıcının geçmiş API'si tek tek ziyaret silmeye izin vermez.

## ⚡ Hızlı Seçim Siteleri

| Site | Domain |
|------|--------|
| YouTube | youtube.com |
| Facebook | facebook.com |
| Instagram | instagram.com |
| X | x.com |
| TikTok | tiktok.com |
| Reddit | reddit.com |
| LinkedIn | linkedin.com |
| Twitch | twitch.tv |

## 🔒 Gizlilik

Bu eklenti:
- ✅ Hiçbir veri toplamaz veya dışarı göndermez
- ✅ Sadece tarayıcı geçmişine erişir
- ✅ Tüm işlemler yerel olarak yapılır
- ✅ Açık kaynak kodludur

## 📋 Gerekli İzinler

| İzin | Açıklama |
|------|----------|
| `history` | Tarayıcı geçmişini okuma ve silme |
| `storage` | Son kullanılan domain'i hatırlama |

## 🛠️ Teknik Detaylar

- **Manifest Version:** 3
- **API:** Chrome History API
- **Tasarım:** Vanilla CSS (Dark Theme)
- **JavaScript:** ES6+

## 📁 Dosya Yapısı

```
history-extension/
├── manifest.json      # Eklenti yapılandırması
├── popup.html         # Popup arayüzü
├── popup.css          # Stiller
├── popup.js           # Uygulama mantığı
├── README.md          # Dokümantasyon
├── LICENSE            # MIT Lisansı
└── icons/
    ├── icon16.png
    ├── icon16.svg     # PNG ikonların kaynağı
    ├── icon48.png
    ├── icon48.svg
    ├── icon128.png
    └── icon128.svg
```

## 🤝 Katkıda Bulunma

1. Bu repoyu fork'la
2. Feature branch oluştur (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerini commit'le (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'i push'la (`git push origin feature/yeni-ozellik`)
5. Pull Request aç

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

<p align="center">
  ⭐ Bu projeyi beğendiysen yıldız vermeyi unutma!
</p>
