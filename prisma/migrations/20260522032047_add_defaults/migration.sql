-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameBangla" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "class" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "monthlyFee" INTEGER NOT NULL,
    "enrollDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Student" ("address", "class", "createdAt", "enrollDate", "guardianName", "guardianPhone", "id", "monthlyFee", "name", "nameBangla", "notes", "phone", "status", "subjects", "updatedAt") SELECT "address", "class", "createdAt", "enrollDate", "guardianName", "guardianPhone", "id", "monthlyFee", "name", "nameBangla", "notes", "phone", "status", "subjects", "updatedAt" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
