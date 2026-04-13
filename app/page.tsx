"use client";

import { useState, useEffect } from "react";

// --- ТИПЫ ДАННЫХ ---
type Language = "en" | "tr";

interface Product {
  id: number;
  price: number;
  image: string;
  title_en: string;
  title_tr: string;
  out_of_oven: boolean;
}

export default function HomePage() {
  // --- СТЕЙТЫ ---
  const [language, setLanguage] = useState<Language>("en");
  const [languageSelected, setLanguageSelected] = useState<boolean>(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});

  // Стейты для формы Custom Order
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");

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

  // --- ЛОГИКА КОРЗИНЫ ---
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
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === "en" ? "Request sent" : "Talep gönderildi");
    setFormName("");
    setFormPhone("");
    setFormMessage("");
  };

  // Вычисляемые значения
  const totalItemsCount = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(selectedItems).reduce((sum, [id, count]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + (product ? product.price * count : 0);
  }, 0);

  // --- СЛОВАРИ ---
  const t = {
    en: {
      heroTitle: "Fresh from the oven to your door",
      viewMenu: "View Menu",
      select: "Select",
      outOfOven: "Out of oven!",
      orderWA: "Order via WhatsApp",
      selectedItems: `Selected ${totalItemsCount} items`,
      total: `Total: €${totalPrice.toFixed(2)}`,
      feat1: "Baked every morning",
      feat2: "Carefully packed",
      feat3: "Fast delivery in Cyprus",
      formTitle: "Need a custom cake or catering?",
      name: "Name",
      phone: "WhatsApp Number",
      message: "What are you looking for?",
      send: "Send Request",
      footerMsg: "Freshly baked in Cyprus. Delivered with love.",
    },
    tr: {
      heroTitle: "Fırından kapınıza taze taze",
      viewMenu: "Menüyü İncele",
      select: "Seç",
      outOfOven: "Fırından yeni çıktı!",
      orderWA: "WhatsApp ile Sipariş Ver",
      selectedItems: `${totalItemsCount} ürün seçildi`,
      total: `Toplam: €${totalPrice.toFixed(2)}`,
      feat1: "Her sabah taze pişirilir",
      feat2: "Özenle paketlenir",
      feat3: "Kıbrıs içi hızlı teslimat",
      formTitle: "Özel pasta veya catering mi arıyorsunuz?",
      name: "İsim",
      phone: "WhatsApp Numarası",
      message: "Ne arıyorsunuz?",
      send: "Talep Gönder",
      footerMsg: "Kıbrıs'ta taze pişirildi. Sevgiyle teslim edildi.",
    }
  };

  const texts = t[language];

  // ---------------------------------------------
  // 1. SPLASH SCREEN (Языковой селектор)
  // ---------------------------------------------
  if (!languageSelected) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-orange-50 font-sans text-orange-950 transition-opacity duration-500">
        <div className="text-7xl mb-8 animate-[bounce_2s_infinite]">🥐</div>
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold mb-12 tracking-tight text-center drop-shadow-sm">
          Home Bakery
        </h1>
        <div className="flex flex-col gap-5 w-72">
          <button 
            onClick={() => { setLanguage("en"); setLanguageSelected(true); }}
            className="px-8 py-5 bg-orange-600 text-white rounded-2xl font-extrabold text-xl hover:bg-orange-700 shadow-xl shadow-orange-600/30 active:scale-95 transition-all"
          >
            English
          </button>
          <button 
            onClick={() => { setLanguage("tr"); setLanguageSelected(true); }}
            className="px-8 py-5 bg-orange-600 text-white rounded-2xl font-extrabold text-xl hover:bg-orange-700 shadow-xl shadow-orange-600/30 active:scale-95 transition-all"
          >
            Türkçe
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // ОСНОВНОЙ САЙТ
  // ---------------------------------------------
  return (
    <div className="min-h-screen font-sans text-neutral-800 bg-neutral-50 relative pb-28 md:pb-24">
      
      {/* 2. HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-serif text-3xl font-bold text-orange-900 tracking-wide cursor-pointer flex items-center">
            <span className="mr-3 text-4xl leading-none">🥐</span> Home Bakery
          </div>
          
          <div className="flex bg-orange-100/50 p-1 rounded-lg border border-orange-200">
            <button
              onClick={() => setLanguage("en")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                language === "en"
                  ? "bg-white text-orange-900 shadow-sm"
                  : "text-orange-700/70 hover:text-orange-900 hover:bg-orange-100"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("tr")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                language === "tr"
                  ? "bg-white text-orange-900 shadow-sm"
                  : "text-orange-700/70 hover:text-orange-900 hover:bg-orange-100"
              }`}
            >
              TR
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO BLOCK */}
      <section className="bg-orange-50 py-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-extrabold text-orange-950 mb-10 max-w-4xl tracking-tight leading-tight drop-shadow-sm">
          {texts.heroTitle}
        </h1>
        <button 
          onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-10 py-5 bg-orange-600 text-white rounded-full font-bold text-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-600/30 active:scale-95"
        >
          {texts.viewMenu}
        </button>
      </section>

      {/* 4. MENU GRID */}
      <main id="menu-section" className="max-w-6xl mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 h-[360px]">
                <div className="w-full h-48 bg-neutral-200 rounded-xl mb-4"></div>
                <div className="h-6 w-1/2 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-neutral-200 rounded mb-6"></div>
                <div className="h-12 w-full bg-neutral-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const count = selectedItems[product.id] || 0;
              const isSelected = count > 0;
              const title = language === "en" ? product.title_en : product.title_tr;

              return (
                <div 
                  key={product.id}
                  className={`relative bg-white rounded-2xl p-5 transition-all duration-300 border ${
                    isSelected 
                      ? "ring-4 ring-offset-2 ring-orange-500 border-transparent shadow-xl scale-[1.02]" 
                      : "border-neutral-200 hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  {/* Badge Out of Oven */}
                  {product.out_of_oven && (
                    <div className="absolute top-7 right-7 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md flex items-center">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-100 mr-2 animate-[pulse_1s_ease-in-out_infinite]"></span>
                      {texts.outOfOven}
                    </div>
                  )}

                  {/* Фото */}
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-5 bg-neutral-100">
                    <img 
                      src={product.image} 
                      alt={title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.08]" 
                    />
                  </div>

                  {/* Название и Цена */}
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-extrabold text-neutral-900 leading-tight">
                      {title}
                    </h3>
                    <span className="text-2xl font-bold text-orange-600 pl-4">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Логика выбора */}
                  {isSelected ? (
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
                      className="w-full h-14 flex items-center justify-center rounded-xl border-2 border-orange-600 text-orange-600 font-bold hover:bg-orange-600 hover:text-white active:scale-95 transition-all text-lg"
                    >
                      {texts.select}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. DELIVERY FEATURES */}
      <section className="bg-white py-24 px-6 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-neutral-800">
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6 bg-orange-50 w-24 h-24 flex justify-center items-center rounded-full">🥐</span>
            <h3 className="text-2xl font-extrabold">{texts.feat1}</h3>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6 bg-orange-50 w-24 h-24 flex justify-center items-center rounded-full">📦</span>
            <h3 className="text-2xl font-extrabold">{texts.feat2}</h3>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6 bg-orange-50 w-24 h-24 flex justify-center items-center rounded-full">🛵</span>
            <h3 className="text-2xl font-extrabold">{texts.feat3}</h3>
          </div>
        </div>
      </section>

      {/* 6. CUSTOM ORDER FORM */}
      <section className="bg-orange-100/50 py-24 px-6 border-t border-orange-100">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50">
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-orange-950 mb-8 text-center text-balance">
            {texts.formTitle}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-orange-900 mb-2">{texts.name}</label>
              <input 
                required
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full p-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-orange-900 mb-2">{texts.phone}</label>
              <input 
                required
                type="tel" 
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full p-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-orange-900 mb-2">{texts.message}</label>
              <textarea 
                required
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full p-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-neutral-50 resize-none"
              />
            </div>
            <button 
              type="submit"
              className="mt-4 w-full py-4 bg-orange-600 text-white font-extrabold rounded-xl hover:bg-orange-700 active:scale-95 transition-all shadow-md"
            >
              {texts.send}
            </button>
          </form>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-neutral-900 text-neutral-400 py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="font-serif text-3xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">🥐</span> Home Bakery
          </div>
          <p className="text-lg text-neutral-300 font-medium mb-8 max-w-md">
            {texts.footerMsg}
          </p>
          <div className="flex flex-col gap-2 font-medium">
            <span>+357 (99) 123-4567</span>
            <span>orders@homebakery.cy</span>
          </div>
          <div className="mt-12 text-sm text-neutral-600 font-semibold">
            &copy; 2026 Home Bakery Cyprus. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 8. STICKY BAR */}
      {totalItemsCount > 0 && (
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

      {/* Tailwind Анимация */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
