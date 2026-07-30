-- CreateTable
CREATE TABLE "_EmployeeWebsites" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_EmployeeWebsites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EmployeeWebsites_B_index" ON "_EmployeeWebsites"("B");

-- AddForeignKey
ALTER TABLE "_EmployeeWebsites" ADD CONSTRAINT "_EmployeeWebsites_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeWebsites" ADD CONSTRAINT "_EmployeeWebsites_B_fkey" FOREIGN KEY ("B") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
