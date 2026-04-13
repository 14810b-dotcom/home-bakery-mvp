"use client";

import { useState, useEffect, FormEvent } from "react";

// --- ТИПЫ ДАННЫХ ---
type Language = "en" | "tr";
type ClientMode = "b2b" | "b2c";

interface Product {
  id: number;
  price: number;
  price_b2b: number;
  pack_b2b_en: string;
  pack_b2b_tr: string;
  image: string;
  title_en: string;
  title_tr: string;
  out_of_oven: boolean;
}

export default function HomePage() {
  // --- СТЕЙТЫ МИНИ-КВИЗА ---
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [language, setLanguage] = useState<Language | null>(null);
  const [clientMode, setClientMode] = useState<ClientMode | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});

  // Стейты для формы Custom Order / Lead
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");

  // Реставрация сессии
  useEffect(() => {
    const savedLang = localStorage.getItem("foodlodge_lang") as Language | null;
    const savedMode = localStorage.getItem("foodlodge_mode") as ClientMode | null;
    
    if (savedLang && savedMode) {
      setLanguage(savedLang);
      setClientMode(savedMode);
      setStep(2);
    } else if (savedLang) {
      setLanguage(savedLang);
      setStep(1);
    }
  }, []);

  // --- ФЕТЧ ИЗ API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- ЛОГИКА ШАГОВ ---
  const handleLangSelect = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("foodlodge_lang", lang);
    setStep(1);
  };

  const handleModeSelect = (mode: ClientMode) => {
    setClientMode(mode);
    localStorage.setItem("foodlodge_mode", mode);
    setStep(2);
  };

  const handleLogoClick = () => {
    // Полный сброс сессии
    setStep(0);
    setLanguage(null);
    setClientMode(null);
    localStorage.removeItem("foodlodge_lang");
    localStorage.removeItem("foodlodge_mode");
  };

  // --- ЛОГИКА КОРЗИНЫ (только для B2C демо) ---
  const handleSelect = (id: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id: number) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev };
      if (newItems[id] > 1) {
        newItems[id] -= 1;
      } else {
        delete newItems[id];
      }
      return newItems;
    });
  };

  // --- ЛОГИКА ФОРМЫ ---
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(language === "en" ? "Request sent" : "Talep gönderildi");
    setFormName("");
    setFormCompany("");
    setFormPhone("");
    setFormMessage("");
  };

  // Вычисляемые значения для корзины (B2C)
  const totalItemsCount = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(selectedItems).reduce((sum, [id, count]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + (product ? product.price * count : 0);
  }, 0);

  // --- СЛОВАРИ ---
  const t = {
    en: {
      step1Title: "Welcome! Who are you?",
      gatewayB2B: "For Business (B2B)",
      gatewayB2BSub: "Wholesale, cafes, restaurants",
      gatewayB2C: "For Home (B2C)",
      gatewayB2CSub: "Fresh pastry for you",
      videoTitle: "Bakery for your Business & Home",
      viewProducts: "View Products",
      select: "Select",
      outOfOven: "Out of oven!",
      orderWA: "Order via WhatsApp",
      selectedItems: `Selected ${totalItemsCount} items`,
      total: `Total: €${totalPrice.toFixed(2)}`,
      b2cFeat1: "Baked every morning",
      b2cFeat2: "Carefully packed",
      b2cFeat3: "Fast delivery in Cyprus",
      b2bFeat1: "Morning Delivery for Cafes",
      b2bFeat2: "High Margin",
      b2bFeat3: "Free display equipment",
      formTitleB2B: "Become a Partner",
      formTitleB2C: "Need a custom cake or catering?",
      name: "Name",
      company: "Company / Shop Name",
      phone: "WhatsApp Number",
      message: "What are you looking for?",
      sendB2B: "Become a Partner",
      sendB2C: "Order Now",
      footerMsg: "Freshly baked in Cyprus. Delivered with love.",
    },
    tr: {
      step1Title: "Hoş geldiniz! Kimsiniz?",
      gatewayB2B: "İşletmeler İçin (B2B)",
      gatewayB2BSub: "Toptan satış, kafeler, restoranlar",
      gatewayB2C: "Ev İçin (B2C)",
      gatewayB2CSub: "Sizin için taze hamur işleri",
      videoTitle: "İşletmeniz ve Eviniz İçin Fırın",
      viewProducts: "Ürünleri İncele",
      select: "Seç",
      outOfOven: "Fırından yeni çıktı!",
      orderWA: "WhatsApp ile Sipariş Ver",
      selectedItems: `${totalItemsCount} ürün seçildi`,
      total: `Toplam: €${totalPrice.toFixed(2)}`,
      b2cFeat1: "Her sabah taze pişirilir",
      b2cFeat2: "Özenle paketlenir",
      b2cFeat3: "Kıbrıs içi hızlı teslimat",
      b2bFeat1: "Kafeler için Sabah Teslimatı",
      b2bFeat2: "Yüksek Kar Marjı",
      b2bFeat3: "Ücretsiz Teşhir Ekipmanı",
      formTitleB2B: "Partnerimiz Olun",
      formTitleB2C: "Özel pasta veya catering mi arıyorsunuz?",
      name: "İsim",
      company: "Şirket / Dükkan Adı",
      phone: "WhatsApp Numarası",
      message: "Ne arıyorsunuz?",
      sendB2B: "Partner Ol",
      sendB2C: "Şimdi Sipariş Ver",
      footerMsg: "Kıbrıs'ta taze pişirildi. Sevgiyle teslim edildi.",
    }
  };

  const texts = t[language || "en"];

  return (
    <div className="min-h-screen font-sans text-neutral-800 bg-neutral-50 relative">
      
      {/* FLOATING WHATSAPP WIDGET (скрыт на квизе) */}
      {step === 2 && (
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`fixed right-6 z-[900] flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all shadow-[0_8px_30px_rgba(34,197,94,0.4)] hover:-translate-y-1 active:scale-95 ${
            clientMode === 'b2c' && totalItemsCount > 0 ? "bottom-32" : "bottom-6"
          }`}
          title="Contact Manager on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        </a>
      )}

      {/* ШАГ 0: ВЫБОР ЯЗЫКА */}
      {step === 0 && (
        <main key="step-0" className="min-h-screen flex flex-col items-center justify-center bg-orange-50 font-sans p-6 animate-[fade-in_0.5s_ease-out]">
          <div className="text-7xl mb-8 animate-[bounce_2s_infinite]">🥐</div>
          <h1 className="text-5xl md:text-6xl font-serif font-extrabold mb-12 tracking-tight text-center drop-shadow-sm text-orange-950">
            FOOD LODGE
          </h1>
          <h2 className="text-2xl font-bold text-neutral-800 mb-10 text-center text-balance">
            Choose your language / Dilinizi seçin
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
            <button
              onClick={() => handleLangSelect("en")}
              className="flex-1 flex flex-col items-center justify-center p-8 bg-white border border-transparent rounded-[2rem] shadow-md hover:border-orange-300 hover:shadow-2xl hover:-translate-y-2 transition-all group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🇬🇧</div>
              <div className="text-xl font-extrabold text-orange-950">English</div>
            </button>
            <button
              onClick={() => handleLangSelect("tr")}
              className="flex-1 flex flex-col items-center justify-center p-8 bg-white border border-transparent rounded-[2rem] shadow-md hover:border-orange-300 hover:shadow-2xl hover:-translate-y-2 transition-all group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🇹🇷</div>
              <div className="text-xl font-extrabold text-orange-950">Türkçe</div>
            </button>
          </div>
        </main>
      )}

      {/* ШАГ 1: ВЫБОР РЕЖИМА B2B/B2C */}
      {step === 1 && (
        <main key="step-1" className="min-h-screen flex flex-col items-center justify-center bg-orange-50 font-sans p-6 animate-[fade-in_0.5s_ease-out]">
          
          {/* Кнопка "Назад" к языку */}
          <button 
            onClick={() => setStep(0)}
            className="absolute top-8 left-8 text-neutral-500 hover:text-orange-900 font-bold flex items-center transition-all bg-white/50 px-4 py-2 rounded-full shadow-sm"
          >
            ← Back
          </button>

          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-orange-950 mb-12 tracking-tight text-center drop-shadow-sm px-4 text-balance">
            {texts.step1Title}
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl px-6">
            <button 
              onClick={() => handleModeSelect("b2b")}
              className="flex-1 flex flex-col items-center justify-center p-12 bg-white border border-transparent rounded-[2.5rem] shadow-md hover:border-orange-300 hover:shadow-2xl hover:-translate-y-2 transition-all group"
            >
              <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">💼</div>
              <div className="font-extrabold text-3xl text-orange-950 mb-3 text-center">{texts.gatewayB2B}</div>
              <div className="text-neutral-500 font-medium text-lg text-center text-balance">{texts.gatewayB2BSub}</div>
            </button>
            
            <button 
              onClick={() => handleModeSelect("b2c")}
              className="flex-1 flex flex-col items-center justify-center p-12 bg-white border border-transparent rounded-[2.5rem] shadow-md hover:border-orange-300 hover:shadow-2xl hover:-translate-y-2 transition-all group"
            >
              <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🥐</div>
              <div className="font-extrabold text-3xl text-orange-950 mb-3 text-center">{texts.gatewayB2C}</div>
              <div className="text-neutral-500 font-medium text-lg text-center text-balance">{texts.gatewayB2CSub}</div>
            </button>
          </div>
        </main>
      )}

      {/* ШАГ 2: ОСНОВНОЙ ЛЕНДИНГ */}
      {step === 2 && (
        <div key="step-2" className="animate-[fade-in_0.5s_ease-out]">
          
          {/* HEADER (БЕЗ ЯЗЫКОВ И КНОПОК, ТОЛЬКО ЛОГО) */}
          <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-orange-100/50 shadow-sm transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-center">
              {/* Logo -> Сброс сессии */}
              <button 
                onClick={handleLogoClick}
                title="Restart Setup"
                className="font-serif text-2xl md:text-3xl font-bold text-orange-900 tracking-wide flex items-center hover:opacity-80 transition-opacity focus:outline-none"
              >
                <span className="mr-2 text-3xl leading-none">🥐</span> FOOD LODGE
              </button>
            </div>
          </header>

          {/* БЛОК 1: HERO WITH VIDEO */}
          <section className="relative h-[80vh] w-full bg-neutral-900 overflow-hidden flex items-center justify-center pt-24 md:pt-20">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
            
            <div className="relative z-10 text-center px-4 max-w-4xl">
              <span className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md border border-white/40 text-white font-extrabold rounded-full text-sm mb-6 drop-shadow-md">
                {clientMode === 'b2b' ? texts.gatewayB2B : texts.gatewayB2C}
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight drop-shadow-xl text-balance">
                {texts.videoTitle}
              </h1>
            </div>
          </section>

          {/* БЛОК 2: PRODUCTS GRID */}
          <section id="menu-section" className="max-w-6xl mx-auto px-6 py-24 min-h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading ? (
                // Skeletons
                [...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 h-[400px]">
                    <div className="w-full h-52 bg-neutral-200 rounded-2xl mb-4"></div>
                    <div className="h-6 w-1/2 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 w-1/3 bg-neutral-200 rounded mb-6"></div>
                  </div>
                ))
              ) : (
                products.map((product) => {
                  const count = selectedItems[product.id] || 0;
                  const isSelected = count > 0 && clientMode === 'b2c';
                  
                  const title = language === "en" ? product.title_en : product.title_tr;
                  
                  // Логика отображения цены и упаковки
                  const displayPrice = clientMode === 'b2b' ? product.price_b2b : product.price;
                  const packDesc = clientMode === 'b2b' 
                                    ? (language === "en" ? product.pack_b2b_en : product.pack_b2b_tr)
                                    : null;

                  return (
                    <div 
                      key={product.id}
                      className={`group relative bg-white rounded-3xl p-5 transition-all duration-300 border overflow-hidden ${
                        isSelected 
                          ? "ring-4 ring-offset-2 ring-orange-500 border-transparent shadow-xl scale-[1.02]" 
                          : "border-neutral-200 hover:shadow-xl hover:-translate-y-1"
                      }`}
                    >
                      {/* Badge B2C */}
                      {product.out_of_oven && clientMode === 'b2c' && (
                        <div className="absolute top-7 right-7 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md flex items-center">
                          <span className="inline-block w-2h-2 rounded-full bg-red-100 mr-2 animate-pulse"></span>
                          {texts.outOfOven}
                        </div>
                      )}

                      {/* Фото */}
                      <div className="w-full h-52 rounded-2xl overflow-hidden mb-5 bg-neutral-100 relative">
                        <img 
                          src={product.image} 
                          alt={title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" 
                        />
                        {/* B2B Плашка упаковки */}
                        {clientMode === "b2b" && (
                          <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/80 backdrop-blur text-white text-sm font-semibold rounded-lg px-3 py-2 text-center shadow-md">
                            🛍️ {packDesc}
                          </div>
                        )}
                      </div>

                      {/* Название и Цена */}
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="text-2xl font-extrabold text-neutral-900 leading-tight">
                          {title}
                        </h3>
                        <div className="flex flex-col items-end pl-4">
                          <span className="text-2xl font-black text-orange-600">
                            €{displayPrice.toFixed(2)}
                          </span>
                          {clientMode === "b2b" && (
                            <span className="text-xs text-neutral-400 font-bold uppercase mt-1">Wholesale</span>
                          )}
                        </div>
                      </div>

                      {/* Логика выбора (только для B2C) */}
                      {clientMode === "b2c" && (
                        isSelected ? (
                          <div className="flex items-center justify-between bg-orange-50 h-14 rounded-xl px-2 border border-orange-200">
                            <button 
                              onClick={() => handleRemove(product.id)}
                              className="w-12 h-10 flex items-center justify-center rounded-lg bg-white text-orange-600 font-bold shadow-sm hover:bg-orange-100 active:scale-95 transition-all text-xl"
                            >
                              -
                            </button>
                            <span className="font-extrabold text-orange-900 text-xl w-10 text-center">
                              {count}
                            </span>
                            <button 
                              onClick={() => handleSelect(product.id)}
                              className="w-12 h-10 flex items-center justify-center rounded-lg bg-orange-600 text-white font-bold shadow-sm hover:bg-orange-700 active:scale-95 transition-all text-xl"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleSelect(product.id)}
                            className="w-full h-14 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 font-bold hover:bg-orange-600 hover:text-white active:scale-95 transition-all text-lg"
                          >
                            {texts.select}
                          </button>
                        )
                      )}
                      
                      {/* Заглушка для B2B (форма связи внизу) */}
                      {clientMode === "b2b" && (
                        <button 
                          onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                          className="w-full h-14 flex items-center justify-center rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 active:scale-95 transition-all text-lg"
                        >
                          Request B2B Sample
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* БЛОК 3: FEATURES */}
          <section className="bg-orange-100/30 py-24 px-6 border-y border-neutral-100 transition-colors duration-500">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-neutral-800">
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-6 bg-white w-28 h-28 flex justify-center items-center rounded-full shadow-lg border border-orange-50">
                  {clientMode === 'b2b' ? "☕" : "🥐"}
                </span>
                <h3 className="text-2xl font-extrabold text-balance">
                  {clientMode === 'b2b' ? texts.b2bFeat1 : texts.b2cFeat1}
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-6 bg-white w-28 h-28 flex justify-center items-center rounded-full shadow-lg border border-orange-50">
                  {clientMode === 'b2b' ? "📈" : "📦"}
                </span>
                <h3 className="text-2xl font-extrabold text-balance">
                  {clientMode === 'b2b' ? texts.b2bFeat2 : texts.b2cFeat2}
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-6 bg-white w-28 h-28 flex justify-center items-center rounded-full shadow-lg border border-orange-50">
                  {clientMode === 'b2b' ? "🍽️" : "🛵"}
                </span>
                <h3 className="text-2xl font-extrabold text-balance">
                  {clientMode === 'b2b' ? texts.b2bFeat3 : texts.b2cFeat3}
                </h3>
              </div>
            </div>
          </section>

          {/* БЛОК 4: CONTACTS / LEAD FORM */}
          <section id="contact-form" className="bg-white py-24 px-6">
            <div className="max-w-2xl mx-auto bg-neutral-50 p-8 md:p-12 rounded-[2rem] shadow-2xl border border-neutral-100">
              <div className="mb-10 text-center">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 font-bold rounded-full text-sm mb-4">
                  {clientMode === 'b2b' ? texts.gatewayB2B : texts.gatewayB2C}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-neutral-900 text-balance">
                  {clientMode === 'b2b' ? texts.formTitleB2B : texts.formTitleB2C}
                </h2>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 pl-1">{texts.name}</label>
                  <input 
                    required
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-white"
                  />
                </div>
                
                {clientMode === 'b2b' && (
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2 pl-1">{texts.company}</label>
                    <input 
                      required
                      type="text" 
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 pl-1">{texts.phone}</label>
                  <input 
                    required
                    type="tel" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 pl-1">{texts.message}</label>
                  <textarea 
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-white resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-4 w-full py-5 bg-orange-600 text-white font-extrabold text-xl rounded-2xl hover:bg-orange-700 active:scale-95 transition-all shadow-xl shadow-orange-600/20"
                >
                  {clientMode === 'b2b' ? texts.sendB2B : texts.sendB2C}
                </button>
              </form>
            </div>
          </section>

          {/* БЛОК 5: FOOTER */}
          <footer className="bg-neutral-900 text-neutral-400 py-16 px-6">
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
              <div className="font-serif text-3xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🥐</span> FOOD LODGE
              </div>
              <p className="text-lg text-neutral-300 font-medium mb-8 max-w-md">
                {texts.footerMsg}
              </p>
              <div className="flex flex-col gap-2 font-medium text-neutral-300">
                <span>📍 Nicosia, Cyprus 1080</span>
                <a href="tel:+357991234567" className="hover:text-orange-400 transition-colors">📞 +357 (99) 123-4567</a>
                <a href="mailto:orders@foodlodge.cy" className="hover:text-orange-400 transition-colors">✉️ orders@foodlodge.cy</a>
              </div>
              <div className="mt-12 text-sm text-neutral-600 font-semibold">
                &copy; 2026 FOOD LODGE Cyprus. All rights reserved.
              </div>
            </div>
          </footer>
          
          {/* STICKY BAR (Только для B2C при наличии корзины) */}
          {clientMode === 'b2c' && totalItemsCount > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-[slide-up_0.3s_ease-out_forwards]">
              <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-neutral-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="text-neutral-500 font-medium text-lg">
                    {texts.selectedItems}
                  </div>
                  <div className="h-8 w-[2px] bg-neutral-200 hidden sm:block"></div>
                  <div className="font-extrabold text-3xl text-orange-600">
                    {texts.total}
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Редирект в WhatsApp: \nСумма: €${totalPrice.toFixed(2)}`)}
                  className="w-full sm:w-auto px-8 py-4 bg-green-500 focus:ring-4 focus:ring-green-500/20 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/40 transition-all active:scale-95 flex items-center justify-center gap-3 text-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  {texts.orderWA}
                </button>
                
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tailwind Анимация слайда снизу */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}
