/* ═══════════════════════════════════════════════════════════
   i18n MODULE
   Depends on: config.js (TRANSLATIONS), state.js
═══════════════════════════════════════════════════════════ */
const i18n = {
  lang: 'en',

  init: function() {
    var saved = localStorage.getItem('zakat_lang');
    if (saved) {
      this.lang = saved;
    } else {
      var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      this.lang = nav.startsWith('ar') ? 'ar' : 'en';
    }
    this.apply();
  },

  t: function(key) {
    return (TRANSLATIONS[this.lang] && TRANSLATIONS[this.lang][key]) ||
           (TRANSLATIONS['en'][key]) ||
           key;
  },

  apply: function() {
    var html = document.documentElement;
    if (this.lang === 'ar') {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
    } else {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
    }

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = i18n.t(key);
    });

    // Update lang toggle buttons
    var langEn = document.getElementById('lang-en');
    var langAr = document.getElementById('lang-ar');
    if (langEn) langEn.classList.toggle('active', this.lang === 'en');
    if (langAr) langAr.classList.toggle('active', this.lang === 'ar');

    // Rebuild dynamic content with new language
    renderAssetRows();
    renderTrackerTable();
    updateTrackerSummary();
    calcZakat();
  }
};

function setLang(lang) {
  i18n.lang = lang;
  localStorage.setItem('zakat_lang', lang);
  i18n.apply();
}
