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
    documentTitle: 'Gasi Khoshy - SHAWARMA & GRILL',
    brand: {
      logo: 'Gasi <span>Khoshy</span>',
      name: 'Gasi Khoshy',
    },
    hero: {
      eyebrow: 'SHAWARMA & GRILL',
      tagline: 'EST. 1980 - Taste and quality, made with love',
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
    },
    feedback: {
      placeholder: 'Tell us about your visit...',
      empty: 'Please write something first.',
      thanks: '✅ Thank you for your feedback!',
    },
    footer: {
      tagline: 'SHAWARMA & GRILL · Taste and quality, made with love',
      copy: '© 2025 Gasi Khoshy Restaurant & Cafe · All rights reserved',
    },
    empty: {
      menu: 'No menu items available.',
    },
  },
  ar: {
    documentTitle: 'گەصی خۆشی - شاورما ومشويات',
    brand: {
      logo: 'گەصی <span>خۆشی</span>',
      name: 'گەصی خۆشی',
    },
    hero: {
      eyebrow: 'شاورما ومشويات',
      tagline: 'مذاق وجودة، مصنوع بحب',
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
    },
    feedback: {
      placeholder: 'اكتب لنا عن زيارتك...',
      empty: 'يرجى كتابة ملاحظة أولاً.',
      thanks: '✅ شكراً لملاحظاتك!',
    },
    footer: {
      tagline: 'شاورما ومشويات · مذاق وجودة، مصنوع بحب',
      copy: '© 2025 شاورما ومشويات گەصی خۆشی · جميع الحقوق محفوظة',
    },
    empty: {
      menu: 'لا توجد أصناف متاحة حالياً.',
    },
  },
  ku: {
    documentTitle: 'گەصی خۆشی - شاورمە و برژاو',
    brand: {
      logo: 'گەصی <span>خۆشی</span>',
      name: 'گەصی خۆشی',
    },
    hero: {
      eyebrow: 'شاورمە و برژاو',
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
    },
    feedback: {
      placeholder: 'دەربارەی سەردانەکەت بۆمان بنووسە...',
      empty: 'تکایە سەرەتا شتێک بنووسە.',
      thanks: '✅ سوپاس بۆ بۆچوونەکەت!',
    },
    footer: {
      tagline: 'شاورمە و برژاو · خواردنی باش بەڕۆژانە',
      copy: '© 2025 شاورمە و برژاو گەصی خۆشی · هەموو مافەکان پارێزراون',
    },
    empty: {
      menu: 'هیچ خواردنێک لە ئێستادا بەردەست نییە.',
    },
  },
};

// -----------------------------------------------------------------------
// Menu data — corrected names in EN / AR / KU based on the physical menu
// -----------------------------------------------------------------------
const menuData = [
  {
    id: 'gasi-khoshy',
    title: { en: 'Grill', ar: 'مشويات', ku: 'برژاو' },
    titleEm: { en: '& Burgers', ar: 'وبرغر', ku: 'و بەرگەر' },
    navTitle: { en: 'Grill & Burgers', ar: 'مشويات وبرغر', ku: 'برژاو و بەرگەر' },
    icon: '🥙',
    items: [
      { name: { en: 'Beef Shawarma', ar: 'گص لحم', ku: 'گەص گۆشت' }, price: '4.000', image: 'assets/images/beef-shawarma-samoon.jpeg' },
      { name: { en: 'Chicken Shawarma', ar: 'گص دجاج', ku: 'گەص مریشك' }, price: '3.000', image: 'assets/images/chicken-shawarma-samoon.jpeg' },
      { name: { en: 'Beef Burger', ar: 'همبرگر لحم', ku: 'هەمبەرگری گۆشت' }, price: '4.000', image: 'assets/images/beef-burger.jpg' },
      { name: { en: 'Chicken Burger', ar: 'همبرگر دجاج', ku: 'هەمبەرگری مریشك' }, price: '3.000', image: 'assets/images/chicken-burger.jpeg' },
      { name: { en: 'Cheese Beef Burger', ar: 'جيز برگر لحم', ku: 'چیز بەرگەر گۆشت' }, price: '4.500', image: 'assets/images/beef-burger.jpg' },
      { name: { en: 'Cheese Chicken Burger', ar: 'جيز برگر دجاج', ku: 'چیز بەرگەر مریشك' }, price: '3.500', image: 'assets/images/chicken-burger.jpeg' },
      {
        name: { en: 'Beef Saj', ar: 'صاج لحم', ku: 'ساجی گۆشت' },
        note: {
          en: 'Beef, fries, olives, salad',
          ar: 'گص لحم، بطاطا، زيتون، سلطة',
          ku: 'گەص گۆشت، فینگر، زەیتون، زەڵاتە',
        },
        price: '6.000',
        image: 'assets/images/beef-saj.jpeg',
      },
      {
        name: { en: 'Chicken Saj', ar: 'صاج دجاج', ku: 'ساجی مریشك' },
        note: {
          en: 'Chicken, fries, olives, salad',
          ar: 'گص دجاج، بطاطا، زيتون، سلطة',
          ku: 'گەص مریشك، فینگر، زەیتون، زەڵاتە',
        },
        price: '5.000',
        image: 'assets/images/chicken-saj.jpeg',
      },
      { name: { en: 'Meat Pastry (Lahm Bi Ajeen)', ar: 'لحم بالعجين', ku: 'لحم بالعجین' }, price: '4.000', image: 'assets/images/meat-pastry.jpg' },
      { name: { en: 'Meat Pastry with Cheese', ar: 'لحم بالعجين مع الجبن', ku: 'لحم بالعجین لەگەڵ پەنیر' }, price: '5.000', image: 'assets/images/meat-pastry-cheese.jpg' },
    ],
  },
  {
    id: 'extras',
    title: { en: 'Sides &', ar: 'المقبلات', ku: 'خۆراکی' },
    titleEm: { en: 'Appetizers', ar: 'الجانبية ', ku: 'لاوەکی ' },
    navTitle: { en: 'Sides & Appetizers', ar: 'المقبلات', ku: 'خۆراکی لاوەکی' },
    icon: '🍟',
    items: [
      { name: { en: 'fries', ar: 'فنگر', ku: 'فینگەر' }, price: '3.000', image: 'assets/images/fries.jpg' },
      { name: { en: 'Nuggets (6 pcs)', ar: 'ناگيت (كنتاكي) 6 عدد', ku: 'ناگێت (کنتاکی) ٦ دانە' }, price: '4.000', image: 'assets/images/nuggets.jpg' },
      { name: { en: 'Small Appetizer Platter', ar: 'مقبلات صغيرة', ku: 'موقەمبیلات بچووك' }, price: '3.000', image: 'assets/images/appetizer.jpg' },
      { name: { en: 'Large Appetizer Platter', ar: 'مقبلات كبيرة', ku: 'موقەمبیلات گەورە' }, price: '5.000', image: 'assets/images/appetizer.jpg' },
    ],
  },
  {
    id: 'cold-drinks',
    title: { en: 'Cold', ar: 'مشروبات', ku: 'خواردنەوەی' },
    titleEm: { en: 'Drinks', ar: 'باردة', ku: 'سارد' },
    navTitle: { en: 'Cold Drinks', ar: 'مشروبات باردة', ku: 'خواردنەوەی سارد' },
    icon: '🥤',
    items: [
      { name: { en: 'Fresh Pepsi', ar: 'بيبسي فريش', ku: 'بێبسی فرێش' }, price: '1.500', image: 'assets/images/fresh-pepsi.jpg' },
      { name: { en: 'Canned Soft Drink', ar: 'بارد قواطي', ku: 'ساردی قوتی' }, price: '1.000', image: 'assets/images/canned-soft-drink.jpg' },
      { name: { en: 'Ayran (Yogurt Drink)', ar: 'لبن شنينة', ku: 'ماستاو' }, price: '1.000', image: 'assets/images/ayran.jpg' },
      { name: { en: 'Coffee', ar: 'كوفي (قهوة)', ku: 'کۆفی (قاوە)' }, price: '2.000', image: 'assets/images/coffee.jpg' },
    ],
  },
  {
    id: 'meat-portions',
    title: { en: 'Meat', ar: 'أجزاء', ku: 'بەشەکانی' },
    titleEm: { en: 'Portions', ar: 'اللحم', ku: 'گۆشت' },
    navTitle: { en: 'Meat Portions', ar: 'أجزاء اللحم', ku: 'بەشەکانی گۆشت' },
    icon: '🥩',
    items: [
      { name: { en: 'Half Portion Beef Shawarma', ar: 'نص نفر گص لحم', ku: 'نیو نەفەر گەص گۆشت' }, price: '8.000', image: 'assets/images/beef-shawarma-half.jpg' },
      { name: { en: 'Full Portion Beef Shawarma', ar: 'نفر كامل گص لحم', ku: 'یەك نەفەر گەص گۆشت' }, price: '15.000', image: 'assets/images/beef-shawarma-full.jpeg' },
      { name: { en: '1 Kilo Beef Shawarma', ar: 'واحد كيلو گص لحم', ku: 'یەك کیلۆ گەص گۆشت' }, price: '45.000', image: 'assets/images/beef-shawarma-kilo.jpeg' },
      { name: { en: 'Half Portion Chicken Shawarma', ar: 'نص نفر گص دجاج', ku: 'نیو نەفەر گەص مریشك' }, price: '7.000', image: 'assets/images/chicken-shawarma-half.jpg' },
      { name: { en: 'Full Portion Chicken Shawarma', ar: 'نفر كامل گص دجاج', ku: 'یەك نەفەر گەص مریشك' }, price: '14.000', image: 'assets/images/chicken-shawarma-full.jpeg' },
      { name: { en: '1 Kilo Chicken Shawarma', ar: 'واحد كيلو گص دجاج', ku: 'یەك کیلۆ گەص مریشك' }, price: '30.000', image: 'assets/images/chicken-shawarma-kilo.jpeg' },
    ],
  },
  {
    id: 'pizza',
    title: { en: 'Pizza', ar: 'پیتزا', ku: 'پیتزا' },
    titleEm: { en: '', ar: '', ku: '' },
    navTitle: { en: 'Pizza', ar: 'پیتزا', ku: 'پیتزا' },
    icon: '🍕',
    items: [
      { name: { en: 'Mixed Pizza', ar: 'بيتزا مشكل', ku: 'پیتزای موشەکەل' }, price: '8.000', image: 'assets/images/pizza-mixed.jpg' },
      { name: { en: 'Beef Pizza', ar: 'بيتزا لحم', ku: 'پیتزای گۆشت' }, price: '8.000', image: 'assets/images/pizza-beaf.jpg' },
      { name: { en: 'Chicken Pizza', ar: 'بيتزا دجاج', ku: 'پیتزای مریشك' }, price: '7.000', image: 'assets/images/pizza-chicken.jpg' },
      { name: { en: 'Pepperoni Pizza', ar: 'بيتزا بيبروني', ku: 'پیتزای پیپەرۆنی' }, price: '7.000', image: 'assets/images/pizza-pepperoni.jpg' },
      { name: { en: 'Vegetable Pizza', ar: 'بيتزا خضروات', ku: 'پیتزای سەوزەوات' }, price: '7.000', image: 'assets/images/pizza-vegetable.jpg' },
      { name: { en: 'Tuna Pizza', ar: 'بيتزا سمك', ku: 'پیتزای ماسی' }, price: '7.000', image: 'assets/images/pizza-tuna.jpg' },
      { name: { en: 'Margherita Pizza', ar: 'بيتزا مارگريتا', ku: 'پیتزای مارگەریتا' }, price: '6.000', image: 'assets/images/pizza-margherita.jpg' },
      { name: { en: 'Calzone Pizza (Closed)', ar: 'بيتزا كالزوني (مغلق)', ku: 'پیتزای کالزۆنی (داخراو)' }, price: '8.000', image: 'assets/images/pizza-calzone.jpg' },
    ],
  },
  {
    id: 'rice',
    title: { en: 'Rice', ar: 'أطباق', ku: 'برنج' },
    titleEm: { en: 'Dishes', ar: 'الأرز', ku: 'و فاسۆلیا' },
    navTitle: { en: 'Rice Dishes', ar: 'أطباق الأرز', ku: 'برنج و فاسۆلیا' },
    icon: '🍚',
    items: [
      { name: { en: 'Rice with Beans (Plain)', ar: 'تمن مع فاصوليا (ساده)', ku: 'برنجی کوردی و فاسۆلیا (سادە)' }, price: '4.000', image: 'assets/images/rice-beans.jpeg' },
      { name: { en: 'Rice & Beans with Beef Shawarma', ar: 'تمن و فاصوليا مع گص لحم', ku: 'برنجی کوردی و فاسۆلیا لەگەڵ گەص گۆشت' }, price: '7.000', image: 'assets/images/rice-beans-beef.jpeg' },
      { name: { en: 'Rice & Beans with Chicken Shawarma', ar: 'تمن و فاصوليا مع گص دجاج', ku: 'برنجی کوردی و فاسۆلیا لەگەڵ گەص مریشك' }, price: '6.000', image: 'assets/images/rice-beans-chicken.jpeg' },
    ],
  },
  {
    id: 'pasta',
    title: { en: 'Pasta', ar: 'پاستا', ku: 'پاستا' },
    titleEm: { en: '', ar: '', ku: '' },
    navTitle: { en: 'Pasta', ar: 'پاستا', ku: 'پاستا' },
    icon: '🍝',
    items: [
      { name: { en: 'Beef Pasta', ar: 'باستا لحم', ku: 'پاستای گۆشت' }, price: '6.000', image: 'assets/images/pasta-beef.jpg' },
      { name: { en: 'Chicken Pasta', ar: 'باستا دجاج', ku: 'پاستای مریشك' }, price: '5.000', image: 'assets/images/pasta-chicken.jpg' },
      { name: { en: 'Kapsalon', ar: 'كابسالون', ku: 'کاپسالۆن' }, price: '6.000', image: 'assets/images/kapsalon.jpg' },
    ],
  },
];

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
  modalImage.src = item.image;
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
  sectionImage.src = section.items[0].image;
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
    itemPhoto.src = item.image;
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
