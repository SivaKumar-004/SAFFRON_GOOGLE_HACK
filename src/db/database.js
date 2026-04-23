import Database from "better-sqlite3";

// Create or open the database in the data directory
const db = new Database("clear3core.db", { verbose: console.log });

// Enable Write-Ahead Logging for high concurrency
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize Database Schemas
export const initializeDB = () => {
    // Facilities Schema
    db.exec(`
        CREATE TABLE IF NOT EXISTS Facilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location_x REAL NOT NULL,
            location_y REAL NOT NULL
        );
    `);

    // Assets Schema
    db.exec(`
        CREATE TABLE IF NOT EXISTS Assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            facility_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            usage_pattern_factor REAL NOT NULL,
            FOREIGN KEY(facility_id) REFERENCES Facilities(id)
        );
    `);

    // Vendors Schema
    db.exec(`
        CREATE TABLE IF NOT EXISTS Vendors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            capability TEXT NOT NULL,
            reliability_score REAL NOT NULL,
            location_x REAL NOT NULL,
            location_y REAL NOT NULL
        );
    `);

    // Seed Data
    const facilityCount = db.prepare("SELECT count(*) as count FROM Facilities").get().count;
    if (facilityCount === 0) {
        console.log("Seeding core database schemas...");

        const insertFacility = db.prepare("INSERT INTO Facilities (name, location_x, location_y) VALUES (?, ?, ?)");
        const fac1Info = insertFacility.run("Alpha Hub", 10.5, 20.0);
        const fac2Info = insertFacility.run("Beta Plant", 50.0, 75.5);

        const insertAsset = db.prepare("INSERT INTO Assets (facility_id, type, status, usage_pattern_factor) VALUES (?, ?, ?, ?)");
        // Facility 1 assets
        insertAsset.run(fac1Info.lastInsertRowid, "HVAC", "ACTIVE", 0.85);
        const brokenAsset1 = insertAsset.run(fac1Info.lastInsertRowid, "PUMP", "FAILED", 0.95);
        
        // Facility 2 assets
        insertAsset.run(fac2Info.lastInsertRowid, "GENERATOR", "MAINTENANCE", 0.40);
        const brokenAsset2 = insertAsset.run(fac2Info.lastInsertRowid, "HVAC", "WARNING", 0.75);

        const insertVendor = db.prepare("INSERT INTO Vendors (name, capability, reliability_score, location_x, location_y) VALUES (?, ?, ?, ?, ?)");
        insertVendor.run("FixIt Corp", "HVAC", 0.88, 12.0, 18.0); // Close to Alpha
        insertVendor.run("ProFix HVAC", "HVAC", 0.96, 45.0, 80.0); // Close to Beta
        insertVendor.run("PumpMasters", "PUMP", 0.99, 15.0, 25.0); // Close to Alpha
        insertVendor.run("GenRepair LLC", "GENERATOR", 0.85, 30.0, 40.0); // Middle
        
        console.log(`Seeded mock data. Notable valid failed/warning assets: ${brokenAsset1.lastInsertRowid} (PUMP), ${brokenAsset2.lastInsertRowid} (HVAC)`);
    } else {
        console.log("Core DB schemas already seeded.");
    }
};

export const getAssetDetails = (assetId) => {
    return db.prepare(`
        SELECT a.id, a.type, a.status, a.usage_pattern_factor, a.facility_id, 
               f.location_x as facility_x, f.location_y as facility_y
        FROM Assets a
        JOIN Facilities f ON a.facility_id = f.id
        WHERE a.id = ?
    `).get(assetId);
};

export const getVendorsByCapability = (capability) => {
    return db.prepare("SELECT * FROM Vendors WHERE capability = ?").all(capability);
};

export default db;
