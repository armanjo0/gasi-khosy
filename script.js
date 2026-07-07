const SUPPORTED_LANGUAGES = ['en', 'ar', 'ku'];
const RTL_LANGUAGES = ['ar', 'ku'];
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';
const LEGACY_LANGUAGE_STORAGE_KEY = 'gavle-language';
const DEFAULT_LANGUAGE = 'en';

let currentLanguage = DEFAULT_LANGUAGE;
let sectionObserver = null;
let cardObserver = null;
let feedbackSubmitted = false;

const translations = {
  en: {
    documentTitle: 'Gasi Khoshy - Restaurant & Cafe',
    brand: {
      logo: 'Gasi <span>Khoshy</span>',
      name: 'Gasi Khoshy',
    },
    hero: {
      eyebrow: 'Restaurant & Cafe',
      tagline: 'Quality food, crafted with care',
    },
    buttons: {
      language: '🌐 Language',
      feedback: '✍️ Feedback',
      backToTop: 'Back to top',
      close: 'Close',
      sendFeedback: 'Send Feedback →',
    },
    labels: {
      phone: 'Phone',
      currency: 'IQD',
      menuCategories: 'Menu categories',
      viewDetails: 'View details for',
    },
    modals: {
      languageTitle: 'Choose Language',
      languageDescription: 'Choose your preferred menu language.',
      feedbackTitle: 'Share Feedback',
      feedbackDescription: "How was your experience? We'd love to hear from you.",
      itemDetailsContains: 'Contains',
    },
    feedback: {
      placeholder: 'Tell us about your visit...',
      empty: 'Please write something first.',
      thanks: '✅ Thank you for your feedback!',
    },
    footer: {
      tagline: 'Restaurant & Cafe · Fine Food Daily',
      copy: '© 2025 Gasi Khoshy Restaurant & Cafe · All rights reserved',
    },
    empty: {
      menu: 'No menu items available.',
    },
  },
  ar: {
    documentTitle: 'گاسی خۆشی - مطعم وكافيه',
    brand: {
      logo: 'گاسی <span>خۆشی</span>',
      name: 'گاسی خۆشی',
    },
    hero: {
      eyebrow: 'مطعم وكافيه',
      tagline: 'طعام شهي محضر بعناية',
    },
    buttons: {
      language: '🌐 اللغة',
      feedback: '✍️ الملاحظات',
      backToTop: 'العودة إلى الأعلى',
      close: 'إغلاق',
      sendFeedback: 'إرسال الملاحظات ←',
    },
    labels: {
      phone: 'الهاتف',
      currency: 'دينار',
      menuCategories: 'أقسام القائمة',
      viewDetails: 'عرض تفاصيل',
    },
    modals: {
      languageTitle: 'اختر اللغة',
      languageDescription: 'اختر اللغة المفضلة لعرض القائمة.',
      feedbackTitle: 'شارك ملاحظاتك',
      feedbackDescription: 'كيف كانت تجربتك؟ يسعدنا سماع رأيك.',
      itemDetailsContains: 'يحتوي على',
    },
    feedback: {
      placeholder: 'اكتب لنا عن زيارتك...',
      empty: 'يرجى كتابة ملاحظة أولاً.',
      thanks: '✅ شكراً لملاحظاتك!',
    },
    footer: {
      tagline: 'مطعم وكافيه · طعام فاخر يومياً',
      copy: '© 2025 مطعم وكافيه گاسی خۆشی · جميع الحقوق محفوظة',
    },
    empty: {
      menu: 'لا توجد أصناف متاحة حالياً.',
    },
  },
  ku: {
    documentTitle: 'گاسی خۆشی - ڕێستورانت و کافێ',
    brand: {
      logo: 'گاسی <span>خۆشی</span>',
      name: 'گاسی خۆشی',
    },
    hero: {
      eyebrow: 'ڕێستورانت و کافێ',
      tagline: 'خواردنی کوالیتی بە گرنگییەوە ئامادەکراوە',
    },
    buttons: {
      language: '🌐 زمان',
      feedback: '✍️ بۆچوون',
      backToTop: 'گەڕانەوە بۆ سەرەوە',
      close: 'داخستن',
      sendFeedback: 'ناردنی بۆچوون ←',
    },
    labels: {
      phone: 'تەلەفۆن',
      currency: 'دینار',
      menuCategories: 'بەشەکانی لیست',
      viewDetails: 'بینینی وردەکاری',
    },
    modals: {
      languageTitle: 'زمان هەڵبژێرە',
      languageDescription: 'زمانی دڵخوازت بۆ لیستی خواردن هەڵبژێرە.',
      feedbackTitle: 'بۆچوونت بنێرە',
      feedbackDescription: 'ئەزموونت چۆن بوو؟ دڵخۆش دەبین بە بیستنی بۆچوونت.',
      itemDetailsContains: 'پێکهاتووە لە',
    },
    feedback: {
      placeholder: 'دەربارەی سەردانەکەت بۆمان بنووسە...',
      empty: 'تکایە سەرەتا شتێک بنووسە.',
      thanks: '✅ سوپاس بۆ بۆچوونەکەت!',
    },
    footer: {
      tagline: 'ڕێستورانت و کافێ · خواردنی باش بەڕۆژانە',
      copy: '© 2025 ڕێستورانت و کافێی گاسی خۆشی · هەموو مافەکان پارێزراون',
    },
    empty: {
      menu: 'هیچ خواردنێک لە ئێستادا بەردەست نییە.',
    },
  },
};

const menuData = [
  {
    id: 'gasi-khoshy',
    title: { en: 'Gasi', ar: 'گەص', ku: 'گەص' },
    titleEm: { en: 'Khoshy', ar: '', ku: '' },
    navTitle: { en: 'Gasi Khoshy', ar: 'گەص خۆشی', ku: 'گەص خۆشی' },
    icon: '🥙',
    items: [
      { name: { en: 'Gasi Gosht', ar: 'گەص گۆشت', ku: 'گەص گۆشت' }, price: '4.000' },
      { name: { en: 'Gasi Marishk', ar: 'گەص مریشك', ku: 'گەص مریشك' }, price: '3.000' },
      { name: { en: 'Hamburgi Gosht', ar: 'هەمبەرگری گۆشت', ku: 'هەمبەرگری گۆشت' }, price: '4.000' },
      { name: { en: 'Hamburgi Marishk', ar: 'هەمبەرگری مریشك', ku: 'هەمبەرگری مریشك' }, price: '3.000' },
      { name: { en: 'Chiz Bargir Gosht', ar: 'چیز بەرگەر گۆشت', ku: 'چیز بەرگەر گۆشت' }, price: '4.500' },
      { name: { en: 'Chiz Bargir Marishk', ar: 'چیز بەرگەر مریشك', ku: 'چیز بەرگەر مریشك' }, price: '3.500' },
      { name: { en: 'Saji Gosht', ar: 'ساجی گۆشت', ku: 'ساجی گۆشت' }, price: '6.000' },
      { name: { en: 'Saji Marishk', ar: 'ساجی مریشك', ku: 'ساجی مریشك' }, price: '5.000' },
      { name: { en: 'Kolira Be Qima', ar: 'کولێرە بە قیمە', ku: 'کولێرە بە قیمە' }, price: '4.000' },
      { name: { en: 'Kolira Be Qima Pener', ar: 'کولێرە بە قیمەی پەنیر', ku: 'کولێرە بە قیمەی پەنیر' }, price: '5.000' },
    ],
  },
  {
    id: 'extras',
    title: { en: 'Extras', ar: 'لوحدات', ku: 'زەروە' },
    titleEm: { en: '', ar: '', ku: '' },
    navTitle: { en: 'Extras', ar: 'لوحدات', ku: 'زەروە' },
    icon: '🥟',
    items: [
      { name: { en: 'Finger', ar: 'فینگەر', ku: 'فینگەر' }, price: '3.000' },
      { name: { en: 'Nagit 6 Pieces', ar: 'ناگێت ٦ دانە', ku: 'ناگێت ٦ دانە' }, price: '4.000' },
      { name: { en: 'Moqembelat Small', ar: 'موقەمبیلات بچووك', ku: 'موقەمبیلات بچووك' }, price: '3.000' },
      { name: { en: 'Moqembelat Large', ar: 'موقەمبیلات گەورە', ku: 'موقەمبیلات گەورە' }, price: '5.000' },
    ],
  },
  {
    id: 'cold-drinks',
    title: { en: 'Cold', ar: 'سارد', ku: 'سارد' },
    titleEm: { en: 'Drinks', ar: 'مشروبات', ku: 'خواردنەوە' },
    navTitle: { en: 'Cold Drinks', ar: 'مشروبات باردة', ku: 'خواردنەوەی سارد' },
    icon: '🥤',
    items: [
      { name: { en: 'Sardi Freesh', ar: 'ساردی فرێش', ku: 'ساردی فرێش' }, price: '1.500' },
      { name: { en: 'Sardi Quto', ar: 'ساردی قوتو', ku: 'ساردی قوتو' }, price: '1.000' },
      { name: { en: 'Mastaw', ar: 'ماستاو', ku: 'ماستاو' }, price: '1.000' },
      { name: { en: 'Coffee', ar: 'کۆفی', ku: 'کۆفی' }, price: '2.000' },
    ],
  },
  {
    id: 'meat-portions',
    title: { en: 'Meat', ar: 'گەص', ku: 'گەص' },
    titleEm: { en: 'Portions', ar: 'أجزاء', ku: 'بەشەکان' },
    navTitle: { en: 'Meat Portions', ar: 'أجزاء اللحم', ku: 'بەشەکانی گۆشت' },
    icon: '🥩',
    items: [
      { name: { en: 'Half Person Gasi Gosht', ar: 'نیو نەفەر گەص گۆشت', ku: 'نیو نەفەر گەص گۆشت' }, price: '8.000' },
      { name: { en: 'One Person Gasi Gosht', ar: 'یەك نەفەر گەص گۆشت', ku: 'یەك نەفەر گەص گۆشت' }, price: '15.000' },
      { name: { en: 'One Kilo Gasi Gosht', ar: 'یەك کیلۆ گەص گۆشت', ku: 'یەك کیلۆ گەص گۆشت' }, price: '45.000' },
      { name: { en: 'Half Person Gasi Marishk', ar: 'نیو نەفەر گەص مریشك', ku: 'نیو نەفەر گەص مریشك' }, price: '7.000' },
      { name: { en: 'One Person Gasi Marishk', ar: 'یەك نەفەر گەص مریشك', ku: 'یەك نەفەر گەص مریشك' }, price: '14.000' },
      { name: { en: 'One Kilo Gasi Marishk', ar: 'یەك کیلۆ گەص مریشك', ku: 'یەك کیلۆ گەص مریشك' }, price: '30.000' },
    ],
  },
  {
    id: 'pizza',
    title: { en: 'Pizza', ar: 'پیتزا', ku: 'پیتزا' },
    titleEm: { en: '', ar: '', ku: '' },
    navTitle: { en: 'Pizza', ar: 'پیتزا', ku: 'پیتزا' },
    icon: '🍕',
    items: [
      { name: { en: 'Pizza Moshekhal', ar: 'پیتزای موشەکەل', ku: 'پیتزای موشەکەل' }, price: '8.000' },
      { name: { en: 'Pizza Gosht', ar: 'پیتزای گۆشت', ku: 'پیتزای گۆشت' }, price: '8.000' },
      { name: { en: 'Pizza Marishk', ar: 'پیتزای مریشك', ku: 'پیتزای مریشك' }, price: '7.000' },
      { name: { en: 'Pizza Piperoni', ar: 'پیتزای پیپەرۆنی', ku: 'پیتزای پیپەرۆنی' }, price: '7.000' },
      { name: { en: 'Pizza Sezawat', ar: 'پیتزای سەوزەوات', ku: 'پیتزای سەوزەوات' }, price: '7.000' },
      { name: { en: 'Pizza Masi', ar: 'پیتزای ماسی', ku: 'پیتزای ماسی' }, price: '7.000' },
      { name: { en: 'Pizza Margerita', ar: 'پیتزای مارگەریتا', ku: 'پیتزای مارگەریتا' }, price: '6.000' },
      { name: { en: 'Pizza Calzone', ar: 'پیتزای کالزۆنە', ku: 'پیتزای کالزۆنە' }, price: '8.000' },
    ],
  },
  {
    id: 'rice',
    title: { en: 'Rice', ar: 'برنج', ku: 'برنج' },
    titleEm: { en: 'Dishes', ar: 'أطباق', ku: 'خۆراک' },
    navTitle: { en: 'Rice Dishes', ar: 'أطباق الأرز', ku: 'برنجەکان' },
    icon: '🍚',
    items: [
      { name: { en: 'Brenji Kurdish and Fasolia', ar: 'برنجی کوردی و فاسۆلیا (سادە)', ku: 'برنجی کوردی و فاسۆلیا (سادە)' }, price: '4.000' },
      { name: { en: 'Brenji Kurdish and Fasolia with Gasi Gosht', ar: 'برنجی کوردی و فاسۆلیا لەگەڵ گەص گۆشت', ku: 'برنجی کوردی و فاسۆلیا لەگەڵ گەص گۆشت' }, price: '7.000' },
      { name: { en: 'Brenji Kurdish and Fasolia with Gasi Marishk', ar: 'برنجی کوردی و فاسۆلیا لەگەڵ گەص مریشك', ku: 'برنجی کوردی و فاسۆلیا لەگەڵ گەص مریشك' }, price: '6.000' },
    ],
  },
  {
    id: 'pasta',
    title: { en: 'Pasta', ar: 'پاستا', ku: 'پاستا' },
    titleEm: { en: '', ar: '', ku: '' },
    navTitle: { en: 'Pasta', ar: 'پاستا', ku: 'پاستا' },
    icon: '🍝',
    items: [
      { name: { en: 'Pasta Gosht', ar: 'پاستای گۆشت', ku: 'پاستای گۆشت' }, price: '6.000' },
      { name: { en: 'Pasta Marishk', ar: 'پاستای مریشك', ku: 'پاستای مریشك' }, price: '5.000' },
      { name: { en: 'Kapsalon', ar: 'کاپسالۆن', ku: 'کاپسالۆن' }, price: '6.000' },
    ],
  },
];

const itemImages = {
  beefBurger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=420&q=80',
  chickenBurger: 'https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=420&q=80',
  beefCheeseburger: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=420&q=80',
  chickenCheeseburger: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=420&q=80',
  zingerSandwich: 'https://images.unsplash.com/photo-1606755962773-d324e9a13086?auto=format&fit=crop&w=420&q=80',
  crispySandwich: 'https://images.unsplash.com/photo-1606755962773-d324e9a13086?auto=format&fit=crop&w=420&q=80',
  beefShawarma: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=420&q=80',
  chickenShawarma: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=420&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=420&q=80',
  superPizza: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=420&q=80',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=420&q=80',
  cola: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=420&q=80',
  laban: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=420&q=80',
  water: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=420&q=80',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=420&q=80',
  meatPlate: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=420&q=80',
  shawarmaPlate: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=420&q=80',
  falafel: 'https://images.unsplash.com/photo-1593001874117-c99c800e3ebd?auto=format&fit=crop&w=420&q=80',
  falafelPlate: 'https://images.unsplash.com/photo-1593001874117-c99c800e3ebd?auto=format&fit=crop&w=420&q=80',
};

function getItemImageKey(section, item) {
  const itemName = localize(item.name, DEFAULT_LANGUAGE).toLowerCase();

  if (section.id === 'gasi-khoshy') {
    return 'beefShawarma';
  }

  if (section.id === 'extras') {
    return 'fries';
  }

  if (section.id === 'cold-drinks') {
    return 'cola';
  }

  if (section.id === 'meat-portions') {
    return 'meatPlate';
  }

  if (section.id === 'rice') {
    return 'pizza';
  }

  if (section.id === 'pasta') {
    return 'pizza';
  }

  if (section.id === 'burgers') {
    if (itemName.includes('chicken') && itemName.includes('cheese')) {
      return 'chickenCheeseburger';
    }

    if (itemName.includes('chicken')) {
      return 'chickenBurger';
    }

    return itemName.includes('cheese') ? 'beefCheeseburger' : 'beefBurger';
  }

  if (section.id === 'sandwiches') {
    if (itemName.includes('zinger')) {
      return 'zingerSandwich';
    }

    if (itemName.includes('crispy')) {
      return 'crispySandwich';
    }

    return itemName.includes('chicken') ? 'chickenShawarma' : 'beefShawarma';
  }

  if (section.id === 'shawarma') {
    return itemName.includes('chicken') ? 'chickenShawarma' : 'beefShawarma';
  }

  if (section.id === 'pizza') {
    return itemName.includes('super') ? 'superPizza' : 'pizza';
  }

  if (section.id === 'drinks') {
    if (itemName.includes('cola')) {
      return 'cola';
    }

    if (itemName.includes('yogurt') || itemName.includes('laban')) {
      return 'laban';
    }

    return itemName.includes('tea') ? 'tea' : 'water';
  }

  if (section.id === 'meat') {
    return 'meatPlate';
  }

  if (section.id === 'shawarma-plates') {
    return 'shawarmaPlate';
  }

  if (section.id === 'falafel') {
    return itemName.includes('plate') ? 'falafelPlate' : 'falafel';
  }

  return section.id === 'fries' ? 'fries' : 'pizza';
}

function getItemImage(section, item) {
  return item.image ?? itemImages[getItemImageKey(section, item)];
}

function translate(path, lang = currentLanguage) {
  const value = path.split('.').reduce((node, key) => node?.[key], translations[lang]);
  const fallback = path.split('.').reduce((node, key) => node?.[key], translations[DEFAULT_LANGUAGE]);

  return value ?? fallback ?? path;
}

function localize(value, lang = currentLanguage) {
  if (!value || typeof value !== 'object') {
    return value ?? '';
  }

  return value[lang] ?? value[DEFAULT_LANGUAGE] ?? '';
}

function isRtl(lang = currentLanguage) {
  return RTL_LANGUAGES.includes(lang);
}

function saveLanguage(lang = currentLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
}

function loadLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
  currentLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;

  if (savedLanguage && savedLanguage !== localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
    saveLanguage(currentLanguage);
  }

  return currentLanguage;
}

function applyDirection(lang = currentLanguage) {
  const direction = isRtl(lang) ? 'rtl' : 'ltr';

  document.documentElement.lang = lang;
  document.documentElement.dir = direction;
  document.body.dir = direction;
  document.body.classList.toggle('is-rtl', direction === 'rtl');
}

function updateStaticTranslations() {
  document.title = translate('documentTitle');

  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    element.innerHTML = translate(element.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    element.dataset.i18nAttr.split(',').forEach(binding => {
      const [attribute, key] = binding.split(':').map(part => part.trim());

      if (attribute && key) {
        element.setAttribute(attribute, translate(key));
      }
    });
  });
}

function updateLanguageOptions() {
  document.querySelectorAll('.lang-opt').forEach(option => {
    const isSelected = option.dataset.lang === currentLanguage;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', String(isSelected));
  });
}

function renderFeedbackForm() {
  const form = document.getElementById('feedbackForm');

  if (!form || (!feedbackSubmitted && form.querySelector('#feedbackText'))) {
    const textarea = document.getElementById('feedbackText');
    const button = form?.querySelector('.feedback-submit');

    if (textarea) {
      textarea.placeholder = translate('feedback.placeholder');
      textarea.dir = isRtl() ? 'rtl' : 'ltr';
    }

    if (button) {
      button.textContent = translate('buttons.sendFeedback');
    }

    return;
  }

  feedbackSubmitted = false;
  form.innerHTML = '';

  const textarea = document.createElement('textarea');
  textarea.id = 'feedbackText';
  textarea.placeholder = translate('feedback.placeholder');
  textarea.dir = isRtl() ? 'rtl' : 'ltr';

  const submitButton = document.createElement('button');
  submitButton.className = 'feedback-submit';
  submitButton.type = 'button';
  submitButton.textContent = translate('buttons.sendFeedback');
  submitButton.addEventListener('click', submitFeedback);

  form.append(textarea, submitButton);
}

const ingredientLabels = {
  bun: { en: 'Bun', ar: 'خبز البرغر', ku: 'نانی بەرگەر' },
  bread: { en: 'Bread', ar: 'خبز', ku: 'نان' },
  tomatoes: { en: 'Tomatoes', ar: 'طماطم', ku: 'تەماتە' },
  onions: { en: 'Onions', ar: 'بصل', ku: 'پیاز' },
  lettuce: { en: 'Lettuce', ar: 'خس', ku: 'کاهوو' },
  pickles: { en: 'Pickles', ar: 'مخلل', ku: 'ترشی' },
  houseSauce: { en: 'House sauce', ar: 'صلصة خاصة', ku: 'سۆسی تایبەت' },
  garlicSauce: { en: 'Garlic sauce', ar: 'صلصة الثوم', ku: 'سۆسی سیر' },
  sauce: { en: 'Sauce', ar: 'صلصة', ku: 'سۆس' },
  beefMeat: { en: 'Beef meat', ar: 'لحم بقري', ku: 'گۆشتی مانگا' },
  chicken: { en: 'Chicken', ar: 'دجاج', ku: 'مریشک' },
  cheese: { en: 'Cheese', ar: 'جبن', ku: 'پەنیر' },
  zingerChicken: { en: 'Zinger chicken', ar: 'دجاج زنجر', ku: 'مریشکی زینگەر' },
  crispyChicken: { en: 'Crispy chicken', ar: 'دجاج كرسبي', ku: 'مریشکی کریسپی' },
  beefShawarma: { en: 'Beef shawarma', ar: 'شاورما لحم', ku: 'شاوەرمەی گۆشت' },
  chickenShawarma: { en: 'Chicken shawarma', ar: 'شاورما دجاج', ku: 'شاوەرمەی مریشک' },
  shawarmaMeat: { en: 'Shawarma meat', ar: 'لحم شاورما', ku: 'گۆشتی شاوەرمە' },
  pizzaDough: { en: 'Pizza dough', ar: 'عجينة بيتزا', ku: 'هەویری پیتزا' },
  tomatoSauce: { en: 'Tomato sauce', ar: 'صلصة طماطم', ku: 'سۆسی تەماتە' },
  mozzarella: { en: 'Mozzarella cheese', ar: 'جبن موزاريلا', ku: 'پەنیری مۆزارێلا' },
  vegetables: { en: 'Vegetables', ar: 'خضار', ku: 'سەوزە' },
  meat: { en: 'Meat', ar: 'لحم', ku: 'گۆشت' },
  potatoes: { en: 'Potatoes', ar: 'بطاطا', ku: 'پەتاتە' },
  salt: { en: 'Salt', ar: 'ملح', ku: 'خوێ' },
  houseSeasoning: { en: 'House seasoning', ar: 'بهارات خاصة', ku: 'بەهاراتی تایبەت' },
  drinkServing: {
    en: 'Served chilled or hot, depending on the drink',
    ar: 'يقدم بارداً أو ساخناً حسب المشروب',
    ku: 'بەپێی جۆری خواردنەوەکە سارد یان گەرم پێشکەش دەکرێت',
  },
  grilledMeat: { en: 'Grilled meat', ar: 'لحم مشوي', ku: 'گۆشتی برژاو' },
  salad: { en: 'Salad', ar: 'سلطة', ku: 'زەڵاتە' },
  fries: { en: 'Fries', ar: 'بطاطا مقلية', ku: 'پەتاتەی سوورکراوە' },
  chickpeas: { en: 'Chickpeas', ar: 'حمص', ku: 'نۆک' },
  parsley: { en: 'Parsley', ar: 'بقدونس', ku: 'مەعدەنۆس' },
  garlic: { en: 'Garlic', ar: 'ثوم', ku: 'سیر' },
  spices: { en: 'Spices', ar: 'بهارات', ku: 'بەهارات' },
  askTeam: {
    en: 'Ask our team for today\'s ingredients',
    ar: 'اسأل فريقنا عن مكونات اليوم',
    ku: 'لە تیمەکەمان پرسیار بکە دەربارەی پێکهاتەکانی ئەمڕۆ',
  },
};

function localizeIngredientKeys(keys) {
  return keys.map(key => localize(ingredientLabels[key]) || key);
}

function getItemDetails(section, item) {
  return [];
}

function openItemDetails(sectionIndex, itemIndex) {
  const section = menuData[sectionIndex];
  const item = section?.items[itemIndex];

  if (!section || !item) {
    return;
  }

  const overlay = document.getElementById('itemDetailsOverlay');
  const title = document.getElementById('itemDetailsTitle');
  const icon = document.getElementById('itemDetailsIcon');
  const price = document.getElementById('itemDetailsPrice');
  const modalImage = document.createElement('img');

  title.textContent = localize(item.name);
  icon.innerHTML = '';
  modalImage.src = getItemImage(section, item);
  modalImage.alt = localize(item.name);
  icon.appendChild(modalImage);
  price.textContent = `${item.price} ${translate('labels.currency')}`;

  overlay.classList.add('open');
}

function renderNavigation() {
  const navInner = document.getElementById('navInner');
  const existingButtons = navInner.querySelectorAll('.nav-btn');

  if (existingButtons.length !== menuData.length) {
    navInner.innerHTML = '';

    menuData.forEach(section => {
      const button = document.createElement('button');
      button.className = 'nav-btn';
      button.dataset.target = section.id;
      button.type = 'button';

      button.addEventListener('click', () => {
        document.getElementById(section.id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });

      navInner.appendChild(button);
    });
  }

  navInner.querySelectorAll('.nav-btn').forEach((button, index) => {
    button.textContent = localize(menuData[index].navTitle);
  });
}

function createMenuSection(section, sectionIndex) {
  const menuSection = document.createElement('section');
  menuSection.className = 'menu-section';
  menuSection.id = section.id;
  menuSection.dataset.sectionIndex = String(sectionIndex);

  const header = document.createElement('div');
  header.className = 'section-header';

  const icon = document.createElement('div');
  icon.className = 'section-icon';

  const sectionImage = document.createElement('img');
  sectionImage.src = getItemImage(section, section.items[0]);
  sectionImage.alt = localize(section.navTitle);
  icon.appendChild(sectionImage);

  const title = document.createElement('h2');
  title.className = 'section-title';

  const titleText = document.createElement('span');
  titleText.className = 'section-title-main';

  const titleEmphasis = document.createElement('em');

  title.append(titleText, titleEmphasis);
  header.append(icon, title);

  const container = document.createElement('div');
  container.className = 'items-container';
  container.id = `items-${section.id}`;

  menuSection.append(header, container);

  section.items.forEach((item, itemIndex) => {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.dataset.sectionIndex = String(sectionIndex);
    card.dataset.itemIndex = String(itemIndex);
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.style.animationDelay = `${itemIndex * 0.07}s`;

    card.addEventListener('click', () => openItemDetails(sectionIndex, itemIndex));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openItemDetails(sectionIndex, itemIndex);
      }
    });

    const itemPhoto = document.createElement('img');
    itemPhoto.className = 'item-photo';
    itemPhoto.src = getItemImage(section, item);
    itemPhoto.alt = localize(item.name);
    itemPhoto.loading = 'lazy';

    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';

    const itemName = document.createElement('div');
    itemName.className = 'item-name';

    const itemNote = document.createElement('div');
    itemNote.className = 'item-note';

    itemInfo.append(itemName, itemNote);

    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';

    const priceValue = document.createTextNode(item.price);
    const currency = document.createElement('span');
    currency.className = 'currency';

    itemPrice.append(priceValue, currency);
    // Grid layout: image on top, name info in middle, price at bottom
    card.append(itemPhoto, itemInfo, itemPrice);
    container.appendChild(card);
  });

  return menuSection;
}

function updateMenuText() {
  document.querySelectorAll('.menu-section').forEach(sectionElement => {
    const section = menuData[Number(sectionElement.dataset.sectionIndex)];

    sectionElement.querySelector('.section-title-main').textContent = localize(section.title);
    sectionElement.querySelector('.section-title em').textContent = localize(section.titleEm);
    sectionElement.querySelector('.section-icon img').alt = localize(section.navTitle);

    const itemCards = sectionElement.querySelectorAll('.menu-item');

    if (!itemCards.length) {
      sectionElement.querySelector('.items-container').textContent = translate('empty.menu');
      return;
    }

    itemCards.forEach(card => {
      const item = section.items[Number(card.dataset.itemIndex)];
      const noteText = localize(item.note);

      card.querySelector('.item-name').textContent = localize(item.name);
      card.querySelector('.item-note').textContent = noteText;
      card.querySelector('.item-note').hidden = !noteText;
      card.querySelector('.currency').textContent = ' ' + translate('labels.currency');
      card.querySelector('.item-photo').alt = localize(item.name);
      card.setAttribute('aria-label', `${translate('labels.viewDetails')} ${localize(item.name)}`);
    });
  });
}

function renderMenu() {
  const main = document.getElementById('menuMain');
  const existingSections = main.querySelectorAll('.menu-section');

  if (existingSections.length !== menuData.length) {
    main.innerHTML = '';

    menuData.forEach((section, sectionIndex) => {
      main.appendChild(createMenuSection(section, sectionIndex));

      if (sectionIndex < menuData.length - 1) {
        const separator = document.createElement('div');
        separator.className = 'section-sep';
        main.appendChild(separator);
      }
    });

    initSectionObserver();
    initCardObserver();
  }

  updateMenuText();
}

function updateLanguage() {
  applyDirection(currentLanguage);
  updateStaticTranslations();
  renderNavigation();
  renderMenu();
  renderFeedbackForm();
  updateLanguageOptions();
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return;
  }

  currentLanguage = lang;
  saveLanguage(lang);
  updateLanguage();
  closeAll();
}

function initSectionObserver() {
  sectionObserver?.disconnect();

  const observerOptions = { rootMargin: '-30% 0px -60% 0px' };
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      document.querySelectorAll('.nav-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.target === entry.target.id);
      });

      const activeButton = document.querySelector(`.nav-btn[data-target="${entry.target.id}"]`);

      activeButton?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    });
  }, observerOptions);

  document.querySelectorAll('.menu-section').forEach(section => sectionObserver.observe(section));
}

function initCardObserver() {
  cardObserver?.disconnect();

  cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.menu-item').forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
  });
}

function initScrollTop() {
  const button = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    button.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

function openLang() {
  updateLanguageOptions();
  document.getElementById('langOverlay').classList.add('open');
}

function openFeedback() {
  renderFeedbackForm();
  document.getElementById('feedbackOverlay').classList.add('open');
}

function closeAll(event) {
  if (
    !event ||
    event.target.classList.contains('overlay') ||
    event.target.classList.contains('modal-close')
  ) {
    document.querySelectorAll('.overlay').forEach(overlay => overlay.classList.remove('open'));
  }
}

function submitFeedback() {
  const feedbackText = document.getElementById('feedbackText');
  const value = feedbackText?.value.trim();

  if (!value) {
    alert(translate('feedback.empty'));
    return;
  }

  feedbackSubmitted = true;
  document.getElementById('feedbackForm').innerHTML = `
    <p class="feedback-success">${translate('feedback.thanks')}</p>
  `;

  setTimeout(closeAll, 2000);
}

function initLangOptions() {
  document.querySelectorAll('.lang-opt').forEach(option => {
    option.addEventListener('click', () => setLanguage(option.dataset.lang));
  });
}

function init() {
  loadLanguage();
  renderNavigation();
  renderMenu();
  initScrollTop();
  initLangOptions();
  updateLanguage();
}

init();
