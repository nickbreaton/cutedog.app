-- CreateTable
CREATE TABLE "Interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quote" TEXT NOT NULL,
    "lat" DECIMAL NOT NULL,
    "lng" DECIMAL NOT NULL,
    "description" TEXT,
    "photoID" TEXT,
    "datetime" DATETIME NOT NULL,
    "timezone" TEXT NOT NULL,
    "cachedState" TEXT,
    "cachedCity" TEXT,
    "cachedPhotoAspectRatio" DECIMAL
);
