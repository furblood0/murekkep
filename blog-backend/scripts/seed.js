const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USER = process.env.DB_USER || 'mybloguser';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'supersecret';
process.env.DB_DATABASE = process.env.DB_DATABASE || 'blogdb';

const bcrypt = require('bcryptjs');
const { connectDB, query } = require('../config/db');

const DEMO_PASSWORD = 'murekkep';

const retiredEmails = [
  'demo@myblog.local',
  'elif@myblog.local',
  'selin.acar@example.com',
  'emre.kaya@example.com',
];

const users = [
  {
    username: 'selinacar',
    email: 'selin.acar@example.com',
    displayName: 'Selin Acar',
    bio: 'İstanbul’da yaşıyor. Sabah, şehir ve masa başı üzerine kısa yazılar bırakıyor.',
  },
  {
    username: 'emrekaya',
    email: 'emre.kaya@example.com',
    displayName: 'Emre Kaya',
    bio: 'Editör. Dikkat, not ve çalışma ritmi üzerine yazıyor.',
  },
];

const posts = [
  {
    author: 'selinacar',
    title: 'Sabahın ilk saati',
    slug: 'sabahin-ilk-saati',
    excerpt: 'Gün, haberlerden önce bir sessizlik bırakır. O sessizliği kaçırmamak yeter.',
    imageUrl:
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    publishedAt: '2026-09-18T08:10:00+03',
    content: `Perdeler henüz aralıkken oda daha büyük görünür. Işık masanın kenarına düşer, fincan soğuktur, dışarıdaki sesler tam olarak başlamamıştır.

Bu saat bir program istemez. Açılacak ilk şey bir ekran değil, bir pencere olsun yeter. Sokak henüz acele etmiyordur. Karşı apartmanın bir camı yanar, bir başkası kararır. Şehir uyanırken kendi sırasını bozmaz.

Yazmak da bu sıraya uyar. İlk cümle parlak olmak zorunda değildir. Günün geri kalanı onu düzeltecek zamanı zaten verir. Sabahın işi, cümleyi bitirmek değil, masada kalmaktır.

Kahve biter, ışık yer değiştirir, dışarıdaki tempo içeri sızar. O zaman kalkılır. Erken saatin kıymeti, uzun sürmesinde değil, henüz kimseye ait olmamasındadır.`,
  },
  {
    author: 'emrekaya',
    title: 'Dikkat dağılınca',
    slug: 'dikkat-dagilinca',
    excerpt: 'Dağılmak bir arıza değil. Nereye gittiğini fark etmek, işin yarısı.',
    imageUrl:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    publishedAt: '2026-08-02T11:30:00+03',
    content: `Bir paragrafın ortasında zihin başka bir odaya geçer. Bunu fark etmek genellikle birkaç dakika sürer. Ekranda imleç duruyordur, düşünce ise çoktan market listesine ya da cevaplanmamış bir cümleye gitmiştir.

Dikkat, kapatılıp açılan bir düğme değildir. İnce bir iptir ve kopunca azarlamak işe yaramaz. Kalemin durduğu yeri işaretlemek, ipi yeniden tutmaktan daha dürüsttür.

Kısa bir ara, uzun bir suçluluk duygusundan iyidir. Pencereye bakmak, su içmek, cümlenin nerede koptuğunu tek satırla not etmek yeter. Geri dönüldüğünde metin kaldığı yerden devam eder; çünkü bırakıldığı yer bellidir.

Dağılmayan bir zihin hedef değildir. Dağıldığını görüp masaya geri oturan bir zihin, çalışmanın ta kendisidir.`,
  },
  {
    author: 'selinacar',
    title: 'Bir şehri yürüyerek tanımak',
    slug: 'bir-sehri-yuruyerek-tanimak',
    excerpt: 'Harita mesafeyi gösterir. Kaldırım, şehrin nasıl nefes aldığını.',
    imageUrl:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    publishedAt: '2026-06-14T16:00:00+03',
    content: `Bir şehri tanıdığımızı sandığımız an, genellikle bir hatta sıkıştığımız andır. Aynı durak, aynı yokuş, aynı fırın. Rota kısalır, şehir de onunla birlikte küçülür.

Yürümek bu hattı bozar. Amaçsız bir sapak, haritada görünmeyen bir avlu, öğleden sonra kapanan bir dükkân. Şehir bu ayrıntılarda toplanır. Uzaklık metreyle değil, bir yokuşun nefes kesmesiyle ölçülür.

İstanbul’da bunu özellikle hissedersiniz. İki sokak arasında ışık değişir, bir mahalle başka bir dile geçer. Yürüyüş bittiğinde not alınan şey manzara değildir; bir kapının rengi, bir radyonun sesi, taşın ayağınızın altında değişmesidir.

Şehri sevmek, onu ezberlemek değildir. Ara sıra kaybolmaya razı olmaktır.`,
  },
  {
    author: 'emrekaya',
    title: 'Not almanın yavaş hali',
    slug: 'not-almanin-yavas-hali',
    excerpt: 'Hızlı not unutulur. Yavaş not, cümlenin neden kurulduğunu hatırlar.',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    publishedAt: '2026-03-27T19:20:00+03',
    content: `Hızlı bir not, sonradan bakınca yabancı gelir. Üç kelime, bir ok, yanında hiçbir bağlam yok. O anki heyecan defterde durmaz.

Yavaş not daha az şey yazar ve daha çok şey tutar. Cümlenin tamamını kurmak şart değildir; ama kelimenin neden seçildiği bir yana iliştirilir. “Akşam ışığı” yetmez. “Mutfak penceresi, saat altı, çay henüz demlenmeden” yeter.

Bunu bir yöntem diye satmaya gerek yok. Defterin kenarında tarih olsun, cümle kendi sesiyle yazılsın, ertesi gün aynı sayfa açılsın. Anlaşılan satır kalır, anlaşılmayan çizilir.

Yazının ham maddesi bu çiziklerdir. Parlak bir fikir değil, hatırlanan bir ayrıntı.`,
  },
  {
    author: 'selinacar',
    title: 'Masanın üstü',
    slug: 'masanin-ustu',
    excerpt: 'Dağınık bir masa tembellik değildir. Üzerinde duran şey, o günün konusu olur.',
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    publishedAt: '2026-01-09T13:05:00+03',
    content: `Masanın üstünü her akşam silmek bir erdem sayılır. Ben bundan pek emin değilim. Sabah karşıma çıkan fincan, açık kalan kitap ve kenara itilmiş bir zarf, dünün nerede bittiğini gösterir.

Tabii ki bir sınır vardır. Kâğıt yığını kapıyı kapatıyorsa bu artık bir iz değil, bir engeldir. Ama boşaltılmış, parlatılmış, hiçbir şeye benzemeyen bir yüzey de yazmaya davet etmez. Üzerinde duran bir nesne, ele alınacak bir konu bırakır.

Bugün masada bir bilet ve bir kalem duruyor. Bilet dünkü yürüyüşten, kalem bitmemiş bir cümleden. İkisi yan yana kalınca yazının nereden başlayacağı belli oluyor.

Düzen, her şeyi yok etmek değildir. Neyin kalacağına karar vermektir.`,
  },
  {
    author: 'emrekaya',
    title: 'Bitmeyen paragraf',
    slug: 'bitmeyen-paragraf',
    excerpt: 'Son cümle henüz oturmadı. Bir gece daha dursun.',
    imageUrl: null,
    status: 'draft',
    publishedAt: null,
    createdAt: '2026-10-05T21:40:00+03',
    content: `Paragraf neredeyse bitti. Son cümle bir kapı gibi duruyor ama menteşesi gevşek. Zorlasam kapanır, sonra da okur o aralıktan rüzgârı hisseder.

Bu yüzden bugün bırakıyorum. Yarın aynı satırı yüksek sesle okuyacağım. Takılırsam cümle yanlış yerde duruyordur. Takılmazsam yayınlanır.

Şimdilik taslak olarak kalsın.`,
  },
];

function readingTime(content) {
  const words = String(content).trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function main() {
  await connectDB();

  await query('DELETE FROM users WHERE email = ANY($1::text[])', [retiredEmails]);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const ids = {};

  for (const user of users) {
    const inserted = await query(
      `INSERT INTO users (username, email, password_hash, display_name, bio)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [user.username, user.email, passwordHash, user.displayName, user.bio]
    );
    ids[user.username] = inserted.rows[0].id;
  }

  for (const post of posts) {
    const createdAt = post.createdAt || post.publishedAt;
    await query(
      `INSERT INTO posts (
         user_id, title, slug, content, excerpt, image_url, status, published_at, reading_time, created_at, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)`,
      [
        ids[post.author],
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.imageUrl,
        post.status,
        post.publishedAt,
        readingTime(post.content),
        createdAt,
      ]
    );
  }

  console.log('Örnek veriler hazır.');
  console.log('Selin Acar — selin.acar@example.com');
  console.log('Emre Kaya — emre.kaya@example.com');
  console.log(`Şifre: ${DEMO_PASSWORD}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed başarısız:', err);
  process.exit(1);
});
