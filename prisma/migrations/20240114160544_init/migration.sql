-- CreateTable
CREATE TABLE "pets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "pets_id_key" ON "pets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pets_username_key" ON "pets"("username");
