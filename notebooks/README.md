# Instructions
- Run the Jupyter Notebook (`jupyter execute generate_sql.ipynb`). This will generate `geography.db` and the GeoJSON file for every Statistics Canada geography (`geography` folder).
- Export the geographies table using sqlite3
 ```
sqlite3 notebooks/geography.db
.output geographies.sql
.exit
 ```
- Edit the `geographies.sql` file
  - Remove PRAGMA foreign_keys=OFF; that is at the beginning of the file
  - Remove TRANSACTION; that is at the beginning of the file
  - Remove COMMIT; at the end of the file
  - Remove the CREATE TABLE geographies statement
  - Add the following to the top of the file:
  ```
    DROP TABLE IF EXISTS geographies;
    CREATE TABLE IF NOT EXISTS geographies (
    id INTEGER PRIMARY KEY,
    dguid TEXT,
    search_name TEXT,
    geographic_level INTEGER
    );

    DROP TABLE IF EXISTS geographies_fts;
    CREATE VIRTUAL TABLE IF NOT EXISTS geographies_fts USING fts5(
    id UNINDEXED,
    search_name,
    content='geographies',
    content_rowid='id',
    tokenize = "unicode61 tokenchars '-/.,''&():+'"
    );
  ```
  - Add the following to the bottom of the file:
  ```
  INSERT INTO geographies_fts(geographies_fts) VALUES ('rebuild');
  PRAGMA optimize;
  ```
- Upload the GeoJSON files to your R2 bucket
  
```
cd geojson
rclone copy . --transfers 50 --progress cloudflare:/geographies-search
```
- Insert the SQL into the D1 database
```
npx wrangler d1 execute geographies_search --remote --file=geographies.sql
```