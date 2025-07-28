This is the Prisma Schema for the Database Design
```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

// Konfigurasi koneksi database Anda.
// Anda bisa mengubah "postgresql" menjadi "mysql", "sqlite", "sqlserver", "cockroachdb"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

/// Enum untuk peran pengguna.
/// Ini mendefinisikan peran yang bisa dimiliki oleh setiap User dalam sistem.
enum UserRole {
  ADMIN   // Pengguna dengan hak akses tertinggi.
  EDITOR  // Pengguna yang bisa mengelola konten (misal: mengedit post orang lain).
  AUTHOR  // Pengguna yang bisa menulis dan mengelola post mereka sendiri.
  READER  // Pengguna terdaftar yang hanya bisa membaca dan memberi komentar.
}

---

/// Model untuk User (Pengguna)
/// Ini adalah tabel utama yang menyimpan informasi semua individu di sistem.
model User {
  id               Int       @id @default(autoincrement()) // ID unik untuk setiap pengguna.
  firstName        String    @map("first_name")            // Nama depan pengguna.
  lastName         String    @map("last_name")             // Nama belakang pengguna.
  email            String    @unique                       // Alamat email unik, sering jadi username.
  password     String    @map("password_hash")         // Hash dari password, untuk keamanan.
  bio              String?   @db.Text                      // Biografi singkat (opsional), tipe teks panjang.
  registrationDate DateTime  @default(now()) @map("registration_date") // Tanggal pendaftaran, otomatis terisi.
  role             UserRole  @default(UserRole.READER)     // Peran pengguna, defaultnya READER.

  posts    Post[]    // Relasi: Seorang User bisa menulis banyak Post.
  comments Comment[] // Relasi: Seorang User bisa membuat banyak Comment.

  @@map("users") // Nama tabel di database adalah 'users'.
}

---

/// Model untuk Post (Postingan Blog)
/// Ini adalah tabel yang menyimpan detail setiap artikel atau postingan blog.
model Post {
  id           Int       @id @default(autoincrement()) // ID unik untuk setiap postingan.
  authorId     Int       @map("author_id")             // Kunci asing ke User yang menulis postingan ini.
  title        String                                   // Judul postingan.
  content      String    @db.Text                       // Isi lengkap postingan, tipe teks panjang.
  excerpt      String?   @db.Text                       // Ringkasan singkat postingan (opsional), tipe teks panjang.
  publishDate  DateTime  @default(now()) @map("publish_date") // Tanggal dan waktu publikasi, otomatis terisi.
  lastUpdated  DateTime  @updatedAt @map("last_updated")      // Tanggal terakhir diperbarui, otomatis update.
  status       String    @default("Draft")                     // Status postingan (misal: "Draft", "Published", "Archived").
  slug         String    @unique                               // Bagian URL yang unik dan mudah dibaca (misal: "judul-postingan-saya").

  author       User          @relation(fields: [authorId], references: [id]) // Relasi: Post ini ditulis oleh satu User.
  comments     Comment[]     // Relasi: Post ini bisa memiliki banyak Comment.
  categories   PostCategory[] // Relasi: Post ini bisa memiliki banyak Category, melalui tabel penghubung.
  tags         PostTag[]     // Relasi: Post ini bisa memiliki banyak Tag, melalui tabel penghubung.

  @@map("posts") // Nama tabel di database adalah 'posts'.
}

---

/// Model untuk Category (Kategori)
/// Ini adalah tabel untuk mengelompokkan postingan ke dalam topik-topik tertentu.
model Category {
  id           Int       @id @default(autoincrement()) // ID unik untuk setiap kategori.
  categoryName String    @unique @map("category_name")   // Nama kategori yang unik.
  description  String?   @db.Text                      // Deskripsi kategori (opsional), tipe teks panjang.

  posts PostCategory[] // Relasi: Kategori ini bisa dimiliki oleh banyak Post, melalui tabel penghubung.

  @@map("categories") // Nama tabel di database adalah 'categories'.
}

---

/// Model untuk PostCategory (Tabel Penghubung Post-Category)
/// Tabel ini diperlukan untuk relasi Many-to-Many antara Post dan Category.
/// Satu Post bisa punya banyak Category, satu Category bisa punya banyak Post.
model PostCategory {
  id          Int      @id @default(autoincrement()) // ID unik untuk setiap entri hubungan.
  postId      Int      @map("post_id")             // Kunci asing ke Post.
  categoryId  Int      @map("category_id")         // Kunci asing ke Category.

  post        Post     @relation(fields: [postId], references: [id])       // Relasi: Ke Post yang terhubung.
  category    Category @relation(fields: [categoryId], references: [id])   // Relasi: Ke Category yang terhubung.

  @@unique([postId, categoryId]) // Kendala unik: Memastikan satu pasangan Post-Category hanya ada satu kali.
  @@map("post_categories") // Nama tabel di database adalah 'post_categories'.
}

---

/// Model untuk Tag (Tag)
/// Ini adalah tabel untuk kata kunci atau label tambahan untuk postingan.
model Tag {
  id      Int      @id @default(autoincrement()) // ID unik untuk setiap tag.
  tagName String   @unique @map("tag_name")       // Nama tag yang unik.

  posts PostTag[] // Relasi: Tag ini bisa dimiliki oleh banyak Post, melalui tabel penghubung.

  @@map("tags") // Nama tabel di database adalah 'tags'.
}

---

/// Model untuk PostTag (Tabel Penghubung Post-Tag)
/// Tabel ini diperlukan untuk relasi Many-to-Many antara Post dan Tag.
/// Satu Post bisa punya banyak Tag, satu Tag bisa punya banyak Post.
model PostTag {
  id     Int   @id @default(autoincrement()) // ID unik untuk setiap entri hubungan.
  postId Int   @map("post_id")             // Kunci asing ke Post.
  tagId  Int   @map("tag_id")               // Kunci asing ke Tag.

  post   Post  @relation(fields: [postId], references: [id]) // Relasi: Ke Post yang terhubung.
  tag    Tag   @relation(fields: [tagId], references: [id])   // Relasi: Ke Tag yang terhubung.

  @@unique([postId, tagId]) // Kendala unik: Memastikan satu pasangan Post-Tag hanya ada satu kali.
  @@map("post_tags") // Nama tabel di database adalah 'post_tags'.
}

---

/// Model untuk Comment (Komentar)
/// Ini adalah tabel yang menyimpan komentar dari pembaca pada postingan.
model Comment {
  id              Int       @id @default(autoincrement()) // ID unik untuk setiap komentar.
  postId          Int       @map("post_id")             // Kunci asing ke Post tempat komentar ini berada.
  userId          Int?      @map("user_id")               // Kunci asing opsional ke User yang membuat komentar (jika terdaftar).
  authorName      String?   @map("author_name")          // Nama penulis komentar (jika userId null atau guest).
  authorEmail     String?   @map("author_email")         // Email penulis komentar (opsional).
  commentText     String    @db.Text @map("comment_text") // Isi komentar, tipe teks panjang.
  commentDate     DateTime  @default(now()) @map("comment_date") // Tanggal dan waktu komentar dibuat.
  parentCommentId Int?      @map("parent_comment_id")    // Kunci asing opsional untuk komentar balasan (self-referencing).

  post            Post      @relation(fields: [postId], references: [id]) // Relasi: Komentar ini milik satu Post.
  user            User?     @relation(fields: [userId], references: [id]) // Relasi: Komentar ini bisa dibuat oleh satu User (opsional).
  parentComment   Comment?  @relation("ReplyTo", fields: [parentCommentId], references: [id], onDelete: NoAction, onUpdate: NoAction) // Relasi ke komentar induk (jika ini balasan).
  replies         Comment[] @relation("ReplyTo") // Relasi: Komentar ini bisa memiliki banyak balasan.

  @@map("comments") // Nama tabel di database adalah 'comments'.
}
```
