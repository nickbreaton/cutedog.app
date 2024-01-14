ALTER TABLE "pets" RENAME TO "Pet";

-- CreateIndex
CREATE UNIQUE INDEX "Pet_id_key" ON "Pet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_username_key" ON "Pet"("username");
