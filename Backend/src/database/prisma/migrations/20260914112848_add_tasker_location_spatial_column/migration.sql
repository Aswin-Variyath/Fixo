-- Enable PostGIS for spatial data types and functions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add the spatial location column
ALTER TABLE "TaskerLocation"
ADD COLUMN "location" geography(Point,4326);

-- Populate the spatial location from the existing coordinates
UPDATE "TaskerLocation"
SET "location" = ST_SetSRID(
    ST_MakePoint(
        "longitude"::double precision,
        "latitude"::double precision
    ),
    4326
)::geography;

-- Make the spatial location required
ALTER TABLE "TaskerLocation"
ALTER COLUMN "location" SET NOT NULL;

-- Create a spatial index for nearby-location queries
CREATE INDEX "TaskerLocation_location_gist_idx"
ON "TaskerLocation"
USING GIST ("location");