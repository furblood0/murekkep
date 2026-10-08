const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USER = process.env.DB_USER || 'mybloguser';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'supersecret';
process.env.DB_DATABASE = process.env.DB_DATABASE || 'blogdb';

const bcrypt = require('bcryptjs');
const { connectDB, query } = require('../config/db');

const DEMO_PASSWORD = 'demo1234';

const users = [
  {
    username: 'demo',
    email: 'demo@myblog.local',
    displayName: 'Demo Yazar',
    bio: 'MyBlog üzerindeki örnek hesap. Yerel deneme için kullanılır.',
  },
  {
    username: 'elif',
    email: 'elif@myblog.local',
    displayName: 'Elif Yılmaz',
    bio: 'Kısa notlar ve okuma üzerine yazıyor.',
  },
];

const posts = [
  {
    author: 'demo',
    title: 'Yazmaya nasıl başlanır',
    slug: 'yazmaya-nasil-baslanir',
    excerpt: 'Boş sayfa korkutucu görünür. İlk paragrafı bitirmek, geri kalanın yolunu açar.',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    content: `Boş bir editör, yapılacak işten çok daha büyük görünür. Başlık koyup ilk cümleyi yazmak, çoğu zaman günün en zor adımıdır.

Bunu aşmanın pratik bir yolu var: ilk taslağı kimseye göstermeyeceğinizi kabul etmek. Cümlelerin düzgün olması gerekmez. Amaç, aklınızdaki fikri ekrana taşımaktır. MyBlog'da bir yazıyı taslak olarak kaydedip sonra yayınlayabilirsiniz; bitirmeden paylaşmak zorunda değilsiniz.

Kısa tutun. Tek bir fikir, üç dört paragraf ve net bir kapanış, dağınık uzun bir metinden daha okunur. Kapak görseli eklemek isteğe bağlıdır; yazının kendisi yeterince netse kart zaten anlaşılır durur.

Yayınlamadan önce bir kez sesli okuyun. Takıldığınız yer, okurun da takılacağı yerdir. Sonra durumu yayına alın. Gerisi, bir sonraki yazının konusudur.`,
  },
  {
    author: 'demo',
    title: 'Karanlık temada uzun okuma',
    slug: 'karanlik-temada-uzun-okuma',
    excerpt: 'Düşük kontrast yorar, aşırı parlak beyaz da öyle. Okuma yüzeyi sakin kalmalı.',
    imageUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    content: `Uzun bir yazıyı karanlık bir arayüzde okumak, parlak bir sayfadan daha rahat hissettirebilir. Bu, her koyu rengin iyi olduğu anlamına gelmez. Metin ile zemin birbirine çok yakınsa göz satırı takip edemez.

İyi bir okuma yüzeyi sakin kalır. Başlık belirgin olur, gövde metni nefes alır, kenarlarda gereksiz çerçeve olmaz. Kapak görseli yazının konusunu destekler; sayfanın yarısını kaplayan bir süs olmaz.

MyBlog'un detay sayfası satır sonlarını korur. Editörde bıraktığınız boşluklar, yayında da durur. Bu yüzden paragrafları editörde ayırmak, sonradan biçim vermekten daha doğru sonuç verir.

Kısa oturumlarda denemek yeterli. Bir yazıyı baştan sona okuyun. Gözünüz başlığa mı kayıyor, yoksa gövdeyi mi bırakıyor? Cevap, bir sonraki düzenlemede neyi sadeleştireceğinizi söyler.`,
  },
  {
    author: 'elif',
    title: 'İlk PostgreSQL şeması',
    slug: 'ilk-postgresql-semasi',
    excerpt: 'Kullanıcı ve yazı tablosu, bir blogun omurgasını kurar. Geri kalanı sonra eklenir.',
    imageUrl:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    content: `Bir blog veritabanı iki tabloda ayağa kalkar: kullanıcılar ve yazılar. Kullanıcının adı, e-postası ve parola özeti vardır. Yazının başlığı, içeriği, durumu ve sahibi vardır. Sahip, kullanıcıya yabancı anahtarla bağlanır.

Durum alanı taslak ile yayını ayırır. Yayın tarihi, yazının akışta hangi sırada duracağını belirler. Slug, başlıktan üretilen kısa adrestir; aynı slug iki kez kullanılamaz.

İndeksler baştan abartılmaz. Yazıları kullanıcıya ve yayın durumuna göre süzmek en sık yapılan iştir, o yüzden bu kolonlar indekslenir. Yorum gibi henüz kullanılmayan tablolar şemada durabilir, fakat arayüz onları vaat etmez.

Şemayı Docker ile ilk açılışta kurmak, herkesin aynı tablolarla başlamasını sağlar. Örnek veriyi ise ayrıca basmak daha doğru: şema bir kez oluşur, örnek yazılar istediğiniz zaman yenilenebilir.`,
  },
  {
    author: 'elif',
    title: 'Taslağı neden bekletmeli',
    slug: 'taslagi-neden-bekletmeli',
    excerpt: 'Yayın düğmesi aceleye gelmez. Bir gece bekleyen metin, sabah daha dürüst görünür.',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    content: `Taslak, bitmemiş işin utancı değildir. Okurun görmemesi gereken ara haldir. Başlık hâlâ zayıfsa, örnek eksikse veya son paragraf konuyu kapatmıyorsa yayınlamak acele olur.

Bekletmenin pratik hali basittir. Yazıyı taslak kaydedin, profilde yalnızca taslakları süzün ve ertesi gün başlığı yeniden okuyun. Hâlâ aynı cümleyi kuruyorsanız metin hazırdır. Kuramıyorsanız bir paragraf daha ister.

Profildeki sayılar bu ayrımı görünür kılar: toplam, yayında olan ve taslak. Hepsi yayındaysa ya çok üretiyorsunuzdur ya da hiç elemeden basıyorsunuzdur. İkisi de mümkün; ikincisi daha sık görülür.

Yayınladığınızda yazı ana akışa düşer ve giriş yapmayan biri de okuyabilir. Taslak ise yalnızca size açıktır. Bu sınır, bekletmeyi güvenli hale getirir.`,
  },
];

function readingTime(content) {
  const words = String(content).trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function ensureUser(user, passwordHash) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [user.email]);
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const inserted = await query(
    `INSERT INTO users (username, email, password_hash, display_name, bio)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [user.username, user.email, passwordHash, user.displayName, user.bio]
  );
  return inserted.rows[0].id;
}

async function main() {
  await connectDB();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const ids = {};

  for (const user of users) {
    ids[user.username] = await ensureUser(user, passwordHash);
  }

  for (const post of posts) {
    const userId = ids[post.author];
    await query(
      `INSERT INTO posts (user_id, title, slug, content, excerpt, image_url, status, published_at, reading_time)
       VALUES ($1, $2, $3, $4, $5, $6, 'published', NOW(), $7)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         content = EXCLUDED.content,
         excerpt = EXCLUDED.excerpt,
         image_url = EXCLUDED.image_url,
         status = 'published',
         reading_time = EXCLUDED.reading_time,
         updated_at = NOW()
       WHERE posts.user_id = EXCLUDED.user_id`,
      [userId, post.title, post.slug, post.content, post.excerpt, post.imageUrl, readingTime(post.content)]
    );
  }

  console.log('Örnek veriler hazır.');
  console.log('Hesaplar: demo@myblog.local ve elif@myblog.local');
  console.log(`Şifre: ${DEMO_PASSWORD}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed başarısız:', err);
  process.exit(1);
});
