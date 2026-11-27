# Orenzo Inventory Pro

A responsive, browser-based inventory stock manager starter project.

## Features
- Add, edit, search, and delete product records
- Product categories and barcode/SKU field
- Stock In and Stock Out with quantity validation
- Reorder-level / low-stock status
- Expiry date monitoring (expired and expiring within 30 days)
- CSV import and export
- Responsive layout for desktop, tablet, and mobile
- Browser localStorage persistence

## Run locally
Open `index.html` in a modern browser. No build step is required.

## Publish with GitHub Pages
1. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the root of your GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then Save.
5. Wait for GitHub Pages to publish the site.

## CSV format
Required columns: `name`, `category`, `quantity`

Optional columns: `barcode`, `reorder`, `unit`, `expiry`, `notes`

Example header:
```csv
name,category,barcode,quantity,reorder,unit,expiry,notes
Dairy Essence Cheese 2kg,Cheese,DE-2KG,104,10,box,2027-07-06,Good stock
```

## Important data note
This starter version saves records in the browser's localStorage. Data is not automatically shared between devices or users and can be lost if browser site data is cleared. For a multi-user production inventory system, connect a backend database and authentication (for example, Supabase or Firebase) before using it for live business records.


## Preloaded Orenzo records
On the first launch in a browser with no saved inventory, the app preloads 19 stock rows based on previously supplied Good Stock records. Existing browser data is not overwritten. The available source records do not contain reorder levels, so these are set to 0 rather than guessed. Two mixed-unit records (Conaprole Full Cream Milk and Corn Oil) are split into separate box and pcs rows to preserve their quantities.
