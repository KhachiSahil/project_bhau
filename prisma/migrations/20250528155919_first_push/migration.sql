-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "PassWord" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebSite" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "WebSite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Name_key" ON "Admin"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_Name_key" ON "Customer"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "WebSite_Name_key" ON "WebSite"("Name");
