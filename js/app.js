/**
 * Hauptanwendungsdatei für das VIS-System
 * Verbindet UI-Controller und Datendienste
 */

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    console.log('Anwendung wird initialisiert');
    
    // DOM-Elemente initialisieren
    uiController.initDOMElements();
    
    // DatePicker-Funktionalität hinzufügen
    uiController.setupDateControls();
    
    // Event-Listener für die Navigation einrichten
    setupEventListeners();
    
    // Bezirke zu den Dropdown-Menüs hinzufügen
    uiController.populateBezirke(CONFIG.COLOGNE_DISTRICTS);
    await dataService.loadDataFromSheet();  // <--- DAS FEHLTE
    // Startseite anzeigen
    uiController.showHomePage();
    
    console.log('Anwendung erfolgreich initialisiert');
});

/**
 * Richtet alle Event-Listener ein
 */
function setupEventListeners() {
    console.log('Event-Listener werden eingerichtet');
    
    // Navigation
    document.getElementById('nav-home').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Startseite Navigation geklickt');
        uiController.showHomePage();
    });
    
    document.getElementById('nav-cologne').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Köln Navigation geklickt');
        uiController.showColognePage();
    });
    
    document.getElementById('btn-go-to-cologne').addEventListener('click', async function(e) {
    e.preventDefault();
    console.log('Zur Stadt Köln Button geklickt');

    // Lade Daten vor dem Anzeigen
    if (!dataService.getAllItems().length) {
        await dataService.loadDataFromSheet();
    }

    uiController.showColognePage();
});
    
    // Formular-Buttons
    document.getElementById('btn-add-new').addEventListener('click', function() {
        console.log('Neue Maßnahme Button geklickt');
        uiController.showForm(null);
    });
    
    document.getElementById('btn-cancel').addEventListener('click', function() {
        console.log('Abbrechen Button geklickt');
        uiController.hideForm();
    });
    
    // Formular absenden
    document.getElementById('vis-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Formular wird abgesendet');
        
        try {
            // Pflichtfelder prüfen
            const formData = uiController.collectFormData();
            if (!formData.smnr || !formData.aufgrabungsort) {
                uiController.showDialog('Fehler', 'Bitte füllen Sie alle Pflichtfelder aus (SM Nr und Aufgrabungsort).');
                return;
            }
            
            // ID aus dem Formular-Dataset holen
            const editId = this.dataset.editId || null;
            
            // Speichern
            const result = await dataService.saveFormData(formData, editId);
            
            // Erfolgsmeldung anzeigen
            uiController.showDialog('Erfolg', editId ? 
                'Die Maßnahme wurde erfolgreich aktualisiert.' : 
                'Die Maßnahme wurde erfolgreich hinzugefügt.');
            
            // Daten neu laden
            await dataService.loadDataFromSheet();
            
            // Formular ausblenden
            uiController.hideForm();
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            uiController.showDialog('Fehler', 'Fehler beim Speichern der Daten: ' + error.message);
        }
    });
    
    // Filter
    document.getElementById('search-input').addEventListener('input', uiController.filterData);
    document.getElementById('filter-bezirk').addEventListener('change', uiController.filterData);
    
    // Dialog
    document.getElementById('dialog-close').addEventListener('click', uiController.closeDialog);
    document.getElementById('dialog-ok').addEventListener('click', uiController.closeDialog);
    
   // Globale Event-Delegation für Bearbeiten-Buttons
    document.addEventListener('click', function (e) {
        if (e.target && e.target.matches('.btn-edit')) {
            const id = e.target.getAttribute('data-id');
            const item = dataService.getItemById(id);
            if (item) {
                uiController.showForm(item);
            } else {
                uiController.showDialog('Fehler', 'Eintrag nicht gefunden (ID).');
            }
        }
    }); 
    console.log('Alle Event-Listener wurden eingerichtet');
}
