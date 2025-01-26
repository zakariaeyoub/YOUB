document.addEventListener('DOMContentLoaded', () => {
  const languageSwitcher = document.getElementById('languageSwitcher');
  const elements = document.querySelectorAll('[data-i18n]');

  const changeLanguage = (language) => {
      fetch(`./Languages/${language}.json`)
          .then(response => response.json())
          .then(translations => {
              elements.forEach(element => {
                  const key = element.getAttribute('data-i18n');
                  element.textContent = translations[key] || element.textContent;
              });
              document.documentElement.lang = language;
              document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
              localStorage.setItem('language', language);
          });
  };

  languageSwitcher.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
  });

  const language = localStorage.getItem('language') || 'ar';
  languageSwitcher.value = language;
  changeLanguage(language);
});