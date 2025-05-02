
/**
 * Datendienste für das VIS-System über Supabase
 */

let visItems = [];

// Hilfsfunktion: Header für Supabase-API
function getSupabaseHeaders() {
    return {
        'apikey': CONFIG.SUPABASE_API_KEY,
        'Authorization': 'Bearer ' + CONFIG.SUPABASE_API_KEY,
        'Content-Type': 'application/json'
    };
}

/**
 * Lädt alle Einträge aus Supabase
 */
async function loadDataFromSheet() {
    try {
        console.log('Daten werden von Supabase geladen');
        uiController.updateStatusLoading('Daten werden geladen...');
        uiController.updateStatusIcon('connecting');

        const response = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${CONFIG.TABLE_NAME}?select=*`, {
            method: 'GET',
            headers: getSupabaseHeaders()
        });

        if (!response.ok) {
            throw new Error('Netzwerkfehler: ' + response.status);
        }

        const data = await response.json();
        console.log('Daten empfangen:', data);

        visItems = data.map(item => ({
            id: item.id,
            fields: item
        }));

        uiController.extractBezirke(visItems);
        uiController.populateTable(visItems);
        uiController.updateStatusSuccess(`${visItems.length} Einträge geladen.`);
        uiController.updateStatusIcon('online');

        return visItems;
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        uiController.updateStatusError('Fehler beim Laden der Daten: ' + error.message);
        uiController.updateStatusIcon('offline');
        uiController.showDialog('Fehler', 'Fehler beim Laden der Daten: ' + error.message);
        throw error;
    }
}

/**
 * Speichert ein neues oder aktualisiertes Formular in Supabase
 */
async function saveFormData(formData, itemId) {
    try {
        uiController.updateStatusLoading('Daten werden gespeichert...');

        let method = itemId ? 'PATCH' : 'POST';
        let url = `${CONFIG.SUPABASE_URL}/rest/v1/${CONFIG.TABLE_NAME}`;
        
        if (itemId) {
            url += `?id=eq.${itemId}`;
        }

        const headers = {
            ...getSupabaseHeaders(),
            'Prefer': 'return=representation'
        };

        Object.keys(formData).forEach(key => {
            if (formData[key] === '') {
                formData[key] = null;
            }
        });

        const payload = JSON.stringify(formData);

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: payload
        });

        if (!response.ok) {
            throw new Error('Fehler beim Speichern: ' + response.statusText);
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return {};
        }
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
        throw error;
    }
}

function searchItems(searchTerm, district) {
    if (!visItems || visItems.length === 0) return [];

    const filteredItems = visItems.filter(item => {
        const matchesSearch = !searchTerm ||
            (item.fields.smnr && item.fields.smnr.toLowerCase().includes(searchTerm)) ||
            (item.fields.aufgrabungsort && item.fields.aufgrabungsort.toLowerCase().includes(searchTerm)) ||
            (item.fields.visnr && item.fields.visnr.toLowerCase().includes(searchTerm));

        const matchesBezirk = !district || item.fields.bezirk === district;
        return matchesSearch && matchesBezirk;
    });

    return filteredItems;
}

function getAllItems() {
    return visItems;
}

function getItemById(id) {
    return visItems.find(item => item.id === id) || null;
}

const dateUtils = {
    formatDate: function(dateString) {
        if (!dateString) return '';
        try {
            if (dateString.includes('.')) return dateString;
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString('de-DE');
        } catch (e) {
            return dateString;
        }
    },

    formatDateForInput: function(dateString) {
        if (!dateString) return '';
        try {
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

const dataService = {
    loadDataFromSheet,
    saveFormData,
    searchItems,
    getAllItems,
    getItemById,
    dateUtils
};
