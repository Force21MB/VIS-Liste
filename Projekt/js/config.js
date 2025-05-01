/**
 * Konfigurationsdatei für das VIS-System
 */

// Konfiguration für die Verbindung zur API
const CONFIG = {
    // URL zum Apps Script Web App
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzLc5i7z9NPwA_EUIsqBdIKneE6qL7th9O0XIXVei6mVTHg6syk0oJCXqxIy4WyuDw53w/exec',
    
    // Kölner Bezirke für die Dropdown-Felder
    COLOGNE_DISTRICTS: [
        'Innenstadt',
        'Rodenkirchen',
        'Lindenthal',
        'Ehrenfeld',
        'Nippes',
        'Chorweiler',
        'Porz',
        'Kalk',
        'Mülheim'
    ],
    
    // Tabellenspalten-Mapping
    COLUMN_MAPPING: {
        SMNr: 'SMNr',
        Aufgrabungsort: 'Aufgrabungsort',
        Bezirk: 'Bezirk',
        AufgrabungEingereicht: 'AufgrabungEingereicht',
        ZeitraumVon: 'ZeitraumVon',
        ZeitraumBis: 'ZeitraumBis',
        VISNr: 'VISNr',
        TKNr: 'TKNr',
        DatumTiefbauErledigt: 'DatumTiefbauErledigt',
        TiefbauFirma: 'TiefbauFirma',
        Mitarbeiter: 'Mitarbeiter',
        Bemerkung: 'Bemerkung'
    }
};
