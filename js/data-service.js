/**
 * Datendienste für das VIS-System
 * Enthält alle Funktionen für die Kommunikation mit der API
 */

// Globale Variablen für den Datendienst
let visItems = []; // Speichert alle Elemente aus der Tabelle

/**
 * Lädt Daten von Apps Script
 * @returns {Promise<Array>} Die geladenen Daten
 */
async function loadDataFromSheet() {
    try {
        console.log('Daten werden von Apps Script geladen');
        uiController.updateStatusLoading('Daten werden geladen...');
        uiController.updateStatusIcon('connecting');
        
        // Daten von Apps Script abrufen
        const response = await fetch(CONFIG.SCRIPT_URL + '?action=readAll');
        
        if (!response.ok) {
            throw new Error('Netzwerkfehler: ' + response.status);
        }
        
        const data = await response.json();
        console.log('Daten empfangen:', data);
        
        if (data.success) {
            // Daten in das interne Format konvertieren
            visItems = data.data.map((item, index) => ({
                id: item.id || (index + 1).toString(),
                fields: item
            }));
            
            // Bezirke extrahieren
            uiController.extractBezirke(visItems);
            
            // Tabelle mit Daten füllen
            uiController.populateTable(visItems);
            
            uiController.updateStatusSuccess(`${visItems.length} Einträge geladen.`);
            uiController.updateStatusIcon('online');
            
            return visItems;
        } else {
            throw new Error(data.message || 'Fehler beim Laden der Daten');
        }
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        uiController.updateStatusError('Fehler beim Laden der Daten: ' + error.message);
        uiController.updateStatusIcon('offline');
        uiController.showDialog('Fehler', 'Fehler beim Laden der Daten: ' + error.message);
        throw error;
    }
}

/**
 * Speichert Formulardaten in der Datenbank
 * @param {Object} formData - Die zu speichernden Formulardaten
 * @param {string|null} itemId - ID des zu bearbeitenden Elements (null für neues Element)
 * @returns {Promise<Object>} Das Ergebnis der Speicheroperation
 */
async function saveFormData(formData, itemId) {
    try {
        uiController.updateStatusLoading('Daten werden gespeichert...');
        
        // Daten für Apps Script vorbereiten
        const apiData = {
            action: itemId ? 'update' : 'create',
            data: formData
        };
        
        if (itemId) {
            apiData.id = itemId;
        }
        
        // Daten an Apps Script senden
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiData)
        });
        
        if (!response.ok) {
            throw new Error('Netzwerkfehler: ' + response.status);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Fehler beim Speichern der Daten');
        }
        
        return result;
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
        throw error;
    }
}

/**
 * Sucht nach Elementen basierend auf Suchbegriff und Bezirk
 * @param {string} searchTerm - Suchbegriff
 * @param {string} district - Bezirk
 * @returns {Array} Gefilterte Elemente
 */
function searchItems(searchTerm, district) {
    if (!visItems || visItems.length === 0) return [];
    
    const filteredItems = visItems.filter(item => {
        // Textsuche in mehreren Feldern
        const matchesSearch = !searchTerm || 
            (item.fields.SMNr && item.fields.SMNr.toLowerCase().includes(searchTerm)) ||
            (item.fields.Aufgrabungsort && item.fields.Aufgrabungsort.toLowerCase().includes(searchTerm)) ||
            (item.fields.VISNr && item.fields.VISNr.toLowerCase().includes(searchTerm));
        
        // Bezirksfilter
        const matchesBezirk = !district || item.fields.Bezirk === district;
        
        return matchesSearch && matchesBezirk;
    });
    
    return filteredItems;
}

/**
 * Gibt alle geladenen Daten zurück
 * @returns {Array} Alle Daten
 */
function getAllItems() {
    return visItems;
}

/**
 * Sucht ein Element anhand seiner ID
 * @param {string} id - Die ID des Elements
 * @returns {Object|null} Das gefundene Element oder null
 */
function getItemById(id) {
    return visItems.find(item => item.id === id) || null;
}

// Formatierungshilfsfunktionen für Datumswerte
const dateUtils = {
    /**
     * Formatiert ein Datum für die Anzeige
     * @param {string} dateString - Das zu formatierende Datum
     * @returns {string} Das formatierte Datum
     */
    formatDate: function(dateString) {
        if (!dateString) return '';
        
        try {
            // Prüfen, ob das Datum bereits formatiert ist (z.B. DD.MM.YYYY)
            if (dateString.includes('.')) return dateString;
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('de-DE');
        } catch (e) {
            return dateString;
        }
    },
    
    /**
     * Formatiert ein Datum für das Input-Element
     * @param {string} dateString - Das zu formatierende Datum
     * @returns {string} Das formatierte Datum im YYYY-MM-DD Format
     */
    formatDateForInput: function(dateString) {
        if (!dateString) return '';
        
        try {
            // Konvertieren vom deutschen Format (DD.MM.YYYY) zu ISO
            if (dateString.includes('.')) {
                const parts = dateString.split('.');
                if (parts.length === 3) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            
            return date.toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    }
};

// Öffentliche API des Datendienstes
const dataService = {
    loadDataFromSheet,
    saveFormData,
    searchItems,
    getAllItems,
    getItemById,
    dateUtils
};
