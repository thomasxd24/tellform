'use strict';

angular.module('forms').config(['$translateProvider', function ($translateProvider) {

  	$translateProvider.translations('it', {
		// Configura la visualizzazione scheda modulo
		ADVANCED_SETTINGS: 'Impostazioni avanzate',
		FORM_NAME: 'Nome modulo',
		FORM_STATUS: 'Stato modulo',
		PUBLIC: 'pubblico',
		PRIVATE: 'Privato',
		GA_TRACKING_CODE: 'Codice di monitoraggio di Google Analytics',
		DISPLAY_FOOTER: 'Visualizza piè di pagina?',
		SAVE_CHANGES: 'Salva modifiche',
		CANCEL: 'Annulla',
		DISPLAY_START_PAGE: 'Visualizza pagina iniziale?',
		DISPLAY_END_PAGE: 'Mostra pagina finale personalizzata?',

		// Visualizzazione dei moduli di elenco
		CREATE_A_NEW_FORM: 'Crea un nuovo modulo',
		CREATE_FORM: 'Crea modulo',
		CREATED_ON: 'Creato su',
		MY_FORMS: 'Le mie forme',
		NAME: 'Nome',
		LINGUA: 'Lingua',
		FORM_PAUSED: 'Forme in pausa',

		// Modifica campo modale
		EDIT_FIELD: 'Modifica questo campo',
		SAVE_FIELD: 'Salva',
		ON: 'ON',
		OFF: 'OFF',
		REQUIRED_FIELD: 'Obbligatorio',
		LOGIC_JUMP: 'Jump Logic',
		SHOW_BUTTONS: 'Pulsanti aggiuntivi',
		SAVE_START_PAGE: 'Salva',

		// Visualizzazione modulo di amministrazione
		ARE_YOU_SURE: 'Sei ASSOLUTAMENTE sicuro?',
		READ_WARNING: 'Le cose cattive impreviste avverranno se non lo leggi!',
		DELETE_WARNING1: 'Questa azione NON può essere annullata. Ciò eliminerà in modo permanente il "',
		DELETE_WARNING2: '" forma e rimuovi tutti i moduli di modulo associati. ',
		DELETE_CONFIRM: 'Inserisci il nome del modulo per confermare',
		I_UNDERSTAND: "Capisco le conseguenze, elimina questa forma",
		DELETE_FORM_SM: 'Elimina',
		DELETE_FORM_MD: 'Elimina modulo',
		DELETE: 'Elimina',
		FORM: 'Forma',
		VIEW: 'Visualizza',
		LIVE: 'Live',
		PREVIEW: 'Anteprima',
		COPY: 'Copia',
		COPY_AND_PASTE: 'Copia e incolla questo per aggiungere il tuo TellForm al tuo sito web',
		CHANGE_WIDTH_AND_HEIGHT: 'Modifica i valori di larghezza e di altezza per adattarti al meglio',
		POWERED_BY: 'Offerto da',
		TELLFORM_URL: 'Il tuo TellForm è permanente in questo URL',

		// Modifica vista modulo
		DISABLED: 'disabilitato',
		YES: 'SI',
		NO: 'NO',
		ADD_LOGIC_JUMP: 'Aggiungi logico salto',
		ADD_FIELD_LG: 'Clicca per aggiungere nuovo campo',
		ADD_FIELD_MD: 'Aggiungi nuovo campo',
		ADD_FIELD_SM: 'Aggiungi campo',
		EDIT_START_PAGE: 'Modifica pagina iniziale',
		EDIT_END_PAGE: 'Modifica pagina finale',
		WELCOME_SCREEN: 'Pagina iniziale',
		END_SCREEN: 'Fine pagina',
		INTRO_TITLE: 'Titolo',
		INTRO_PARAGRAPH: 'Paragrafo',
		INTRO_BTN: 'Pulsante Start',
		TITLE: 'Titolo',
		PARAGRAFO: 'Paragrafo',
		BTN_TEXT: 'Tornare indietro',
		TASTI: 'Pulsanti',
		BUTTON_TEXT: 'Testo',
		BUTTON_LINK: 'Link',
		ADD_BUTTON: 'Aggiungi pulsante',
		PREVIEW_FIELD: 'Anteprima domanda',
		QUESTION_TITLE: 'Titolo',
		QUESTION_DESCRIPTION: 'Descrizione',
		OPTIONS: 'Opzioni',
		ADD_OPTION: 'Aggiungi opzione',
		NUM_OF_STEPS: 'Numero di passi',
		CLICK_FIELDS_FOOTER: 'Clicca sui campi per aggiungerli qui',
		FORMA: 'Forma',
		IF_THIS_FIELD: 'Se questo campo',
		IS_EQUAL_TO: 'è uguale a',
		IS_NOT_EQUAL_TO: 'non è uguale a',
		IS_GREATER_THAN: 'è maggiore di',
		IS_GREATER_OR_EQUAL_THAN: 'è maggiore o uguale a',
		IS_SMALLER_THAN: 'è inferiore a',
		IS_SMALLER_OR_EQUAL_THAN: 'è più piccolo o uguale a quello',
		CONTAINS: 'contiene',
		DOES_NOT_CONTAINS: 'non contiene',
		ENDS_WITH: 'finisce con',
		DOES_NOT_END_WITH: 'non finisce con',
		STARTS_WITH: 'inizia con',
		DOES_NOT_START_WITH: 'non inizia con',
		THEN_JUMP_TO: 'poi salta a',

		// Modifica visualizzazione presentazioni
		TOTAL_VIEWS: 'visite totali totali',
		RESPONSES: 'risposte',
		COMPLETION_RATE: 'tasso di completamento',
		AVERAGE_TIME_TO_COMPLETE: 'avg. tempo di completamento',

		DESKTOP_AND_LAPTOP: 'Desktop',
		TABLETS: 'compresse',
		PHONES: 'Telefoni',
		OTHER: 'Altro',
		UNIQUE_VISITS: 'Visite Uniche',

		FIELD_TITLE: 'Titolo del campo',
		FIELD_VIEWS: 'Viste sul campo',
		FIELD_DROPOFF: 'Completamento del campo',
		FIELD_RESPONSES: 'Risposte sul campo',
		DELETE_SELECTED: 'Elimina selezionata',
		EXPORT_TO_EXCEL: 'Esporta in Excel',
		EXPORT_TO_CSV: 'Esporta in CSV',
		EXPORT_TO_JSON: 'Esporta in JSON',
		PERCENTAGE_COMPLETE: 'Percentuale completa',
		TIME_ELAPSED: 'Tempo trascorso',
		DEVICE: 'Dispositivo',
		LOCATION: 'Posizione',
		IP_ADDRESS: 'Indirizzo IP',
		DATE_SUBMITTED: 'Data trasmessa',

		// Vista di progettazione
		BACKGROUND_COLOR: 'Colore di sfondo',
		DESIGN_HEADER: 'Modifica il tuo aspetto forma',
		QUESTION_TEXT_COLOR: 'Colore del testo di domanda',
		ANSWER_TEXT_COLOR: 'Rispondere al colore del testo',
		BTN_BACKGROUND_COLOR: 'Colore di sfondo del pulsante',
		BTN_TEXT_COLOR: 'Colore del testo pulsante',

		// Vista condivisione
		EMBED_YOUR_FORM: 'Inserisci il tuo modulo',
		SHARE_YOUR_FORM: 'Condividi il tuo modulo',

		// Schede amministratore
		CREATE_TAB: 'Crea',
		DESIGN_TAB: 'Design',
		CONFIGURE_TAB: 'Configura',
		ANALYZE_TAB: 'Analizza',
		SHARE_TAB: 'Condividi',

		// Tipi di campo
		SHORT_TEXT: 'Testo corto',
		EMAIL: 'E-mail',
		MULTIPLE_CHOICE: 'Scelta multipla',
		DROPDOWN: 'Dropdown',
		DATE: 'Data',
		PARAGRAPH_T: 'Paragrafo',
		YES_NO: 'Sì / no',
		LEGAL: 'Legale',
		RATING: 'Valutazione',
		NUMBERS: 'Numeri',
		SIGNATURE: 'Firma',
		FILE_UPLOAD: 'Caricamento file',
		OPTION_SCALE: 'Scala opzione',
		PAGAMENTO: 'Pagamento',
		STATEMENT: 'Dichiarazione',
		LINK: 'Link',

		// Anteprima del modulo
		FORM_SUCCESS: 'Inserimento modulo con successo presentato!',
		REVIEW: 'Recensione',
		BACK_TO_FORM: 'Torna alla scheda',
		EDIT_FORM: 'Modifica questo TellForm',
		ADVANCEMENT: '{{done}} su {{total}} ha risposto',
		CONTINUE_FORM: "Continua a formare",
		REQUIRED: 'richiesta',
		COMPLETING_NEEDED: '{{answers_not_completed}} answer (s) need completing',
		OPTIONAL: 'facoltativo',
		ERROR_EMAIL_INVALID: 'Inserisci un indirizzo e-mail valido',
		ERROR_NOT_A_NUMBER: 'Inserisci solo numeri validi',
		ERROR_URL_INVALID: 'Per favore un url valido',
		OK: 'OK',
		ENTER: 'premere INVIO',
		NEWLINE: 'premere SHIFT + INVIO per creare una nuova riga',
		CONTINUE: 'Continua',
		LEGAL_ACCEPT: 'accetto',
		LEGAL_NO_ACCEPT: 'Non accetto',
		SUBMIT: 'Invia',
		UPLOAD_FILE: 'Carica il tuo file'
  	});

}]);
