## Table of Contents
- [Table of Contents](#table-of-contents)
- [About](#about)
- [Steps to Deploy](#steps-to-deploy)
- [License](#license)

## About

**statcan-geographies-search** is a Cloudflare worker that allows searching of Statistics Canada's geographies and makes use of SQLite's full-text search [(FTS5)](https://www.sqlite.org/fts5.html) extension.

You can preview this Cloudflare worker by going to https://statcan-geography.dataforcanada.org/. After searching, you can click on the DGUID, and it will open up a map page, zooming to the geography.

Currently the search is just for the following geographic levels:

- **Country**: This includes the geographic boundary for Canada for the 2021 Census.
- **Geographical Regions of Canada (GRCs)**: This includes the [GRCs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo027a) for the 2021 Census.
- **Provinces or Territories (PRs)**: This includes the [PRs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo038) for the 2021 Census.
- **Economic Regions (ERs)**: This includes the [ERs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo022) for the 2021 Census.
- **Census Agricultural Regions (CARs)**: This includes the [CARs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo006) for the 2021 Census.
- **Census Divisions (CDs)**: This includes the [CDs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo008) for the 2021 Census.
- **Census Consolidated Subdivisions (CCSs)**: This includes the [CCSs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo007) for the 2021 Census.
- **Census Metropolitan Areas or Census Agglomerations (CMACAs)**: This includes the [CMACAs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo009) for the 2021 Census.
- **Census Subdivisions (CSDs)**: This includes the [CSDs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo012) for the 2021 Census.
- **Federal Electoral Districts (FEDs)**: This includes the [FEDs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo025) for the 2021 Census, which are based on the 2013 Repreesentation Order.
- **Designated Places (DPLs)**: This includes the [DPLs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo018) for the 2021 Census.
- **Population Centres (POPCTRs)**: This includes the [POPCTRs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo049a) for the 2021 Census.
- **Place Names (PNs)**: This includes the [PNs](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=geo033) for the 2021 Census.

## Steps to Deploy

```shell
# 1. Clone the repository
git clone https://github.com/dataforcanada/statcan-geography.git
# 2. Navigate to the project directory
cd statcan-geography
# 3. Install the JavaScript dependencies
npx npm install
# 3. Make sure you are logged in with wrangler
npx wrangler login
# 3. Create a Cloudflare D1 database, add the database_id to wrangler.toml
npx wrangler d1 create geographies_search
# 4. Create an R2 bucket, this will host the GeoJSON geometries for Statistics Canada's geographies. Change the bucket_name value in wrangler.tom if it's different than above
npx wrangler r2 bucket create geographies-search
# 6. Import the geographies SQL into D1. If you want to generate it yourself head into the notebooks folder for instructions. You will need to run the notebook to generate the GeoJSON files
npx wrangler d1 execute geographies_search --remote --file=db/geographies.sql
# 7. If you want to generate the dist/output.css
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --minify
# 8. Deploy the Cloudflare worker
npx wrangler deploy
```

## License

This repo is distributed under an MIT license.

[Back to top](#top)
