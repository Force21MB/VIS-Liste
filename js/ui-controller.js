/**
 * UI-Controller für das VIS-System
 * Enthält alle Funktionen für die Benutzerschnittstelle
 */

// DOM-Elemente
let navHome, navCologne, btnGoToCologne, homeContent, cologneContent;
let btnAddNew, dataForm, btnCancel, visForm, searchInput, filterBezirk;
let visTable, bezirkSelect, statusContainer, statusMessage, statusIcon, gewerkSelect;
let dialogOverlay, dialogTitle, dialogBody, dialogClose, dialogOk;

/**
 * Initialisiert alle DOM-Elemente
 */
function initDOMElements() {
    // Navigation und Container
    navHome = document.getElementById('nav-home');
    navCologne = document.getElementById('nav-cologne');
    btnGoToCologne = document.getElementById('btn-go-to-cologne');
    homeContent = document.getElementById('home-content');
    cologneContent = document.getElementById('cologne-content');
    
    // Formular-Elemente
    btnAddNew = document.getElementById('btn-add-new');
    dataForm = document.getElementById('data-form');
    btnCancel = document.getElementById('btn-cancel');
    visForm = document.getElementById('vis-form');
    
    // Filter und Tabelle
    searchInput = document.getElementById('search-input');
    filterBezirk = document.getElementById('filter-bezirk');
    visTable = document.getElementById('vis-table');
    bezirkSelect = document.getElementById('bezirk');
    gewerkSelect = document.getElementById('gewerk');
    
    // Status-Elemente
    statusContainer = document.getElementById('status-container');
    statusMessage = document.getElementById('status-message');
    statusIcon = document.querySelector('.status-icon');
    
    // Dialog-Elemente
    dialogOverlay = document.getElementById('dialog-overlay');
    dialogTitle = document.getElementById('dialog-title');
    dialogBody = document.getElementById('dialog-body');
    dialogClose = document.getElementById('dialog-close');
    dialogOk = document.getElementById('dialog-ok');
}
function populateTable(items) {
    const tableBody = visTable.querySelector('tbody');
   tableBody.innerHTML = '';

   if (items.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" style="text-align: center;">Keine Daten gefunden</td>';
       tableBody.appendChild(row);
        return;
    }

 items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.fields.smnr || ''}</td>
           <td>${item.fields.aufgrabungsort || ''}</td>
           <td>${item.fields.bezirk || ''}</td>
           <td>${dataService.dateUtils.formatDate(item.fields.aufgrabungeingereicht)}</td>
            <td>${dataService.dateUtils.formatDate(item.fields.zeitraumvon)}</td>
           <td>${dataService.dateUtils.formatDate(item.fields.zeitraumbis)}</td>
            <td>${item.fields.visnr || ''}</td>
            <td>${item.fields.gewerk || ''}</td>
            <td>
              <button class="btn btn-edit" style="padding: 6px 12px;" data-id="${item.id}">Bearbeiten</button>
           </td>
        `;
        tableBody.appendChild(row);
    });
}
/**
 * Extrahiert einzigartige Bezirke aus den Daten und füllt die Dropdowns
 * @param {Array} items - Die Datenelemente
 */
function extractBezirke(items) {
    const uniqueBezirke = [...new Set(items
        .map(item => item.fields.bezirk)
        .filter(bezirk => bezirk)
    )];
    
    populateBezirke(uniqueBezirke.length > 0 ? uniqueBezirke : CONFIG.COLOGNE_DISTRICTS);
}

/**
 * Füllt die Bezirke-Dropdowns
 * @param {Array} bezirke - Liste der Bezirke
 */
function populateBezirke(bezirke) {
    // Filter-Dropdown leeren und "Alle Bezirke" hinzufügen
    filterBezirk.innerHTML = '<option value="">Alle Bezirke</option>';
    
    // Formular-Dropdown leeren und leere Option hinzufügen
    bezirkSelect.innerHTML = '<option value="">Bitte wählen</option>';
    
    // Bezirke zu beiden Dropdowns hinzufügen
    bezirke.forEach(bezirk => {
        if (bezirk) {
            // Zum Filter-Dropdown hinzufügen
            const optionFilter = document.createElement('option');
            optionFilter.value = bezirk;
            optionFilter.textContent = bezirk;
            filterBezirk.appendChild(optionFilter);
            
            // Zum Formular-Dropdown hinzufügen
            const optionForm = document.createElement('option');
            optionForm.value = bezirk;
            optionForm.textContent = bezirk;
            bezirkSelect.appendChild(optionForm);
        }
    });
}
function populateGewerk() {
    const gewerkSelect = document.getElementById('gewerk');
    gewerkSelect.innerHTML = '<option value="">Bitte wählen</option>';
    
    CONFIG.GEWERK_OPTIONS.forEach(gewerk => {
        const option = document.createElement('option');
        option.value = gewerk;
        option.textContent = gewerk;
        gewerkSelect.appendChild(option);
    });
}
/**
 * Füllt die Tabelle mit Daten
 * @param {Array} items - Die anzuzeigenden Datenelemente
 */

function showForm(item) {
    showFormInPopup(item);
}
/**
 * Zeigt das Formular in einem Popup-Dialog an
 * @param {Object|null} item - Zu bearbeitendes Element (null für neues Element)
 */
function showFormInPopup(item) {
    // Formular zurücksetzen und vorbereiten - gleiche Logik wie in showForm()
    visForm.reset();
    
    // Alle Date-Checkboxen deaktivieren
    document.querySelectorAll('.date-control input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Dialog-Titel setzen basierend auf Bearbeitungs- oder Erstellungsmodus
    if (item) {
        // Bearbeitungsmodus
        dialogTitle.textContent = `Maßnahme bearbeiten: ${item.fields.smnr}`;
        visForm.dataset.editId = item.id;
        
        // Formulardaten füllen
        document.getElementById('sm-nr').value = item.fields.smnr || '';
        document.getElementById('sm-nr').readOnly = true; // Im Bearbeitungsmodus nicht änderbar
        document.getElementById('aufgrabungsort').value = item.fields.aufgrabungsort || '';
        document.getElementById('bezirk').value = item.fields.bezirk || '';
        
        // Datumsfelder füllen
        setDateField('aufgrabung-eingereicht', item.fields.aufgrabungeingereicht);
        setDateField('zeitraum-von', item.fields.zeitraumvon);
        setDateField('zeitraum-bis', item.fields.zeitraumbis);
        setDateField('datum-tiefbau-erledigt', item.fields.datumtiefbauerledigt);
        
        // Weitere Felder
        document.getElementById('vis-nr').value = item.fields.visnr || '';
        document.getElementById('tk-nr').value = item.fields.tknr || '';
        document.getElementById('tiefbau-firma').value = item.fields.tiefbaufirma || '';
        document.getElementById('bemerkung').value = item.fields.bemerkung || '';
        document.getElementById('mitarbeiter').value = item.fields.mitarbeiter || '';
        document.getElementById('gewerk').value = item.fields.gewerk || '';
    } else {
        // Hinzufügemodus
        dialogTitle.textContent = 'Neue Maßnahme hinzufügen';
        visForm.dataset.editId = '';
        document.getElementById('sm-nr').readOnly = false;
    }
    
    // Dialog-Körper ausblenden, Formular-Container einblenden
    document.getElementById('dialog-body').style.display = 'none';
    document.getElementById('dialog-form-container').style.display = 'block';
    document.getElementById('dialog-buttons').style.display = 'none';
    
    // Formular in den Dialog verschieben
    const formContainer = document.getElementById('dialog-form-container');
    formContainer.appendChild(dataForm);
    
    // Formular anzeigen und Dialog öffnen
    dataForm.style.display = 'block';
    dialogOverlay.classList.add('active');
    dialogOverlay.classList.add('form-mode');
}

/**
 * Schließt das Formular-Popup und setzt den Dialog zurück
 */
function closeFormPopup() {
    // Dialog schließen
    dialogOverlay.classList.remove('active');
    dialogOverlay.classList.remove('form-mode');
    
    // Warten bis Animation abgeschlossen ist
    setTimeout(() => {
        // Dialog zurücksetzen
        document.getElementById('dialog-body').style.display = 'block';
        document.getElementById('dialog-form-container').style.display = 'none';
        document.getElementById('dialog-buttons').style.display = 'flex';
        
        // Formular zurück in den ursprünglichen Container verschieben
        document.querySelector('.cologne-container').appendChild(dataForm);
        dataForm.style.display = 'none';
    }, 300);
}
/**
 * Datumsfeld mit Wert befüllen und Checkbox aktivieren
 * @param {string} dateFieldId - ID des Datumsfeldes
 * @param {string} checkboxId - ID der Checkbox
 * @param {string} dateValue - Datumswert
 */
function setDateField(dateFieldId, dateValue) {
    if (dateValue) {
        document.getElementById(dateFieldId).value = dataService.dateUtils.formatDateForInput(dateValue);
    } else {

        document.getElementById(dateFieldId).value = '';
    }
}

/**
 * Formulardaten sammeln
 * @returns {Object} Gesammelte Formulardaten
 */
function collectFormData() {
    // Formulardaten sammeln
    const formData = {
    smnr: document.getElementById('sm-nr').value,
    aufgrabungsort: document.getElementById('aufgrabungsort').value,
    bezirk: document.getElementById('bezirk').value,
aufgrabungeingereicht: getDateFieldValue('aufgrabung-eingereicht'),
        zeitraumvon: getDateFieldValue('zeitraum-von'),
        zeitraumbis: getDateFieldValue('zeitraum-bis'),
    visnr: document.getElementById('vis-nr').value,
    tknr: document.getElementById('tk-nr').value,
datumtiefbauerledigt: getDateFieldValue('datum-tiefbau-erledigt'),
    tiefbaufirma: document.getElementById('tiefbau-firma').value,
    bemerkung: document.getElementById('bemerkung').value,
    mitarbeiter: document.getElementById('mitarbeiter').value
    };
    
    // Datumsfelder sammeln
    formData.aufgrabungeingereicht = getDateFieldValue('aufgrabung-eingereicht', 'chk-aufgrabung-eingereicht');
    formData.zeitraumvon = getDateFieldValue('zeitraum-von', 'chk-zeitraum-von');
    formData.zeitraumbis = getDateFieldValue('zeitraum-bis', 'chk-zeitraum-bis');
    formData.datumtiefbauerledigt = getDateFieldValue('datum-tiefbau-erledigt', 'chk-datum-tiefbau-erledigt');
    
    // Weitere Felder sammeln
    formData.visnr = document.getElementById('vis-nr').value;
    formData.tknr = document.getElementById('tk-nr').value;
    formData.tiefbaufirma = document.getElementById('tiefbau-firma').value;
    formData.bemerkung = document.getElementById('bemerkung').value;
    formData.mitarbeiter = document.getElementById('mitarbeiter').value;
    formData.gewerk = document.getElementById('gewerk').value;
    return formData;
}

/**
 * Wert aus einem Datumsfeld mit Checkbox extrahieren
 * @param {string} dateFieldId - ID des Datumsfeldes
 * @param {string} checkboxId - ID der Checkbox
 * @returns {string|null} Datumswert oder null
 */
function getDateFieldValue(dateFieldId) {
    const value = document.getElementById(dateFieldId).value;
    return value || null; // Leere Strings als null zurückgeben
}

/**
 * Formular ausblenden
 */
function hideForm() {
    closeFormPopup();
}

/**
 * Initialisiert die DatePicker-Funktionalität
 */
function setupDateControls() {

}

/**
 * Filtert die Daten basierend auf Suchbegriff und Bezirk
 */
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedBezirk = filterBezirk.value;
    
    const filteredItems = dataService.searchItems(searchTerm, selectedBezirk);
    
    populateTable(filteredItems);
    
    // Status-Update
    if (filteredItems.length === 0 && (searchTerm || selectedBezirk)) {
        updateStatusInfo(`Keine Ergebnisse für die aktuelle Filterung.`);
    } else if (filteredItems.length < dataService.getAllItems().length) {
        updateStatusInfo(`${filteredItems.length} von ${dataService.getAllItems().length} Einträgen angezeigt.`);
    } else {
        updateStatusSuccess(`${dataService.getAllItems().length} Einträge geladen.`);
    }
}

/**
 * Zeigt die Startseite an
 */
function showHomePage() {
    homeContent.style.display = 'block';
    cologneContent.style.display = 'none';
    
    navHome.classList.add('active');
    navCologne.classList.remove('active');
}

/**
 * Zeigt die Köln-Seite an und lädt die Daten
 */
function showColognePage() {
    homeContent.style.display = 'none';
    cologneContent.style.display = 'block';
    navHome.classList.remove('active');
    navCologne.classList.add('active');

    if (dataService.getAllItems().length === 0) {
        dataService.loadDataFromSheet().catch(error => {
            console.error('Fehler beim Laden der Daten:', error);
        });
    }
}

/**
 * Verschiedene Status-Anzeige-Funktionen
 */
function updateStatusIcon(status) {
    statusIcon.className = 'status-icon ' + status;
}

function updateStatusSuccess(message) {
    statusContainer.className = 'status success';
    statusMessage.textContent = message;
}

function updateStatusError(message) {
    statusContainer.className = 'status error';
    statusMessage.textContent = message;
}

function updateStatusLoading(message) {
    statusContainer.className = 'status loading';
    statusMessage.textContent = message;
}

function updateStatusInfo(message) {
    statusContainer.className = 'status';
    statusContainer.style.backgroundColor = '#e2e3e5';
    statusContainer.style.color = '#383d41';
    statusMessage.textContent = message;
}

/**
 * Dialog-Funktionen
 */
function showDialog(title, message) {
    dialogTitle.textContent = title;
    dialogBody.textContent = message;
    dialogOverlay.classList.add('active');
}

function closeDialog() {
    // Wenn wir uns im Formular-Modus befinden, Formular korrekt schließen
    if (dialogOverlay.classList.contains('form-mode')) {
        closeFormPopup();
    } else {
        // Normaler Dialog-Schließ-Vorgang
        dialogOverlay.classList.remove('active');
    }
}

// Öffentliche API des UI-Controllers
const uiController = {
    // Bestehende Funktionen...
    initDOMElements,
    extractBezirke,
    populateBezirke,
    populateTable,
    showForm,
    hideForm,
    showFormInPopup,  // Neue Funktion
    closeFormPopup,   // Neue Funktion
    collectFormData,
    filterData,
    showHomePage,
    showColognePage,
    setupDateControls,
    updateStatusIcon,
    updateStatusSuccess,
    updateStatusError,
    updateStatusLoading,
    updateStatusInfo,
    showDialog,
    populateGewerk,
    closeDialog
};
