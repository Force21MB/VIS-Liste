/**
 * Konfigurationsdatei für das VIS-System
 */

// Konfiguration für die Verbindung zur API
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

    
    // Tabellenspalten-Mapping
    COLUMN_MAPPING: {
        sm_nr: 'sm_nr',
        aufgrabungsort: 'aufgrabungsort',
        bezirk: 'bezirk',
        aufgrabung_eingereicht: 'aufgrabung_eingereicht',
        zeitraum_von: 'zeitraum_von',
        zeitraum_bis: 'zeitraum-bis',
        vis_Nr: 'vis_Nr',
        tk_Nr: 'tk_Nr',
        datum_tiefbau_erledigt: 'datum_tiefbau-erledigt',
        tiefbau_firma: 'tiefbau_firma',
        mitarbeiter: 'mitarbeiter',
        bemerkung: 'bemerkung'
    }
};
