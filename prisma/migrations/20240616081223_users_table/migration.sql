-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employee" INTEGER NOT NULL,
    "video_src" TEXT,
    "show_id" INTEGER,
    CONSTRAINT "Users_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Show" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_video_src_key" ON "Users"("video_src");
