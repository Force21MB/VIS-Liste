/**
 * Konfigurationsdatei für das VIS-System
 */

const CONFIG = {
    SUPABASE_URL: 'https://hqgmepblrpjvqctegfbj.supabase.co',
    SUPABASE_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZ21lcGJscnBqdnFjdGVnZmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTY2ODYsImV4cCI6MjA2MTY3MjY4Nn0.qY2-fJHgAl_xtDvTdaODrwT74lkW8cRybEwQIi6nLEM',
    TABLE_NAME: 'vis_liste',
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
    COLUMN_MAPPING: {
        smnr: 'smnr',
        aufgrabungsort: 'aufgrabungsort',
        bezirk: 'bezirk',
        aufgrabungeingereicht: 'aufgrabungeingereicht',
        zeitraumvon: 'zeitraumvon',
        zeitraumbis: 'zeitraumbis',
        visNr: 'visNr',
        tkNr: 'tkNr',
        datumtiefbauerledigt: 'datumtiefbauerledigt',
        tiefbaufirma: 'tiefbaufirma',
        mitarbeiter: 'mitarbeiter',
        bemerkung: 'bemerkung',
        gewerk: 'gewerk'
    }
GEWERK_OPTIONS: [
        'Breitband',
        'Ü-Wege',
        'Störung',
        'Betrieb',
        'APL',
        'ZFSKKA',
        'ÖTel'
    ]
};
