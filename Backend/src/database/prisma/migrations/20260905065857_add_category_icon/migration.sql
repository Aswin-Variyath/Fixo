-- Add the icon column as nullable first
ALTER TABLE "Category"
ADD COLUMN "icon" TEXT;

-- Set icons for existing categories
UPDATE "Category"
SET "icon" = 'electrical_services'
WHERE "slug" = 'electrical';

UPDATE "Category"
SET "icon" = 'plumbing'
WHERE "slug" = 'plumbing';

UPDATE "Category"
SET "icon" = 'cleaning_services'
WHERE "slug" = 'cleaning';

UPDATE "Category"
SET "icon" = 'format_paint'
WHERE "slug" = 'painting';

UPDATE "Category"
SET "icon" = 'carpenter'
WHERE "slug" = 'carpentry';

UPDATE "Category"
SET "icon" = 'ac_unit'
WHERE "slug" = 'ac-appliance';

-- Make icon required after all existing rows have a value
ALTER TABLE "Category"
ALTER COLUMN "icon" SET NOT NULL;