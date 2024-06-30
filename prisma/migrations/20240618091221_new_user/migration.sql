-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employee" INTEGER NOT NULL,
    "video_src" TEXT,
    "posts" TEXT NOT NULL DEFAULT 'New post',
    "show_id" INTEGER,
    CONSTRAINT "Users_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Users" ("email", "employee", "id", "posts", "show_id", "username", "video_src") SELECT "email", "employee", "id", "posts", "show_id", "username", "video_src" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_video_src_key" ON "Users"("video_src");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
