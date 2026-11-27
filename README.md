# Orenzo Inventory Pro — Original Stock Records

This version is preloaded from the user's uploaded workbook `orenzo-inventory-stock (4).xlsx`.

## Imported data
- 380 product/unit records
- 28,319 total stock units (sum of the Stock column)
- Original product names, categories, units, and quantities preserved
- Duplicate product names with different units are retained as separate records
- Expiry dates, reorder levels, barcodes, costs, and prices were not present in the uploaded workbook and are therefore left blank / not set

## Run
Open `index.html` in a modern browser.

## GitHub Pages
Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root. Then go to Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

## Data storage
The app stores changes in browser localStorage. This is not cloud sync. This release uses a new storage key (`orenzo_inventory_true_records_v2`) so the old sample/incorrect records do not overwrite the workbook import.
