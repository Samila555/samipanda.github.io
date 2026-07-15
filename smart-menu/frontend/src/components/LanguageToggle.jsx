import { useState, useEffect } from 'react';

export default function LanguageToggle() {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        // Detect current language from cookie
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        if (match && match[1] === 'am') setLang('am');
    }, []);

    const toggle = () => {
        const select = document.querySelector('#google_translate_element select');
        const newLang = lang === 'en' ? 'am' : 'en';

        if (select) {
            select.value = newLang;
            select.dispatchEvent(new Event('change'));
            setLang(newLang);
        }
    };

    return (
        <button
            onClick={toggle}
            title={lang === 'en' ? 'Switch to Amharic' : 'Switch to English'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border border-amber-400/40 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
            <span className="text-base">🌍</span>
            <span className="text-amber-600 dark:text-amber-400">
                {lang === 'en' ? 'EN' : 'አማ'}
            </span>
            <span className="text-gray-400 text-xs">|</span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">
                {lang === 'en' ? 'አማ' : 'EN'}
            </span>
        </button>
    );
}
