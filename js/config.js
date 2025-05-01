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
        sm_nr: 'smnr',
        aufgrabungsort: 'aufgrabungsort',
        bezirk: 'bezirk',
        aufgrabung_eingereicht: 'aufgrabungeingereicht',
        zeitraum_von: 'zeitraumvon',
        zeitraum_bis: 'zeitraumbis',
        vis_Nr: 'visNr',
        tk_Nr: 'tkNr',
        datum_tiefbau_erledigt: 'datumtiefbauerledigt',
        tiefbau_firma: 'tiefbaufirma',
        mitarbeiter: 'mitarbeiter',
        bemerkung: 'bemerkung'
    }
};
