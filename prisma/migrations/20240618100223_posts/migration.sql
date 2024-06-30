-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'New post',
    "content" TEXT NOT NULL DEFAULT 'New content',
    "comment_id" INTEGER,
    CONSTRAINT "Post_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "comment" TEXT NOT NULL DEFAULT 'New comment'
);
