export default function LanguageToggle() {
    // Read current lang from cookie
    const cookies = document.cookie;
    const isAmharic = cookies.includes('googtrans=/en/am');
    const lang = isAmharic ? 'am' : 'en';

    const switchLang = () => {
        const newLang = lang === 'en' ? 'am' : 'en';
        // Remove old cookie
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // Set new cookie for Google Translate
        document.cookie = `googtrans=/en/${newLang}; path=/`;
        // Reload to apply translation
        window.location.reload();
    };

    return (
        <button
            onClick={switchLang}
            title={lang === 'en' ? 'Switch to Amharic / ወደ አማርኛ ቀይር' : 'Switch to English'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border border-amber-400/40 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer"
        >
            <span className="text-base">🌍</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
                {lang === 'en' ? 'EN' : 'AM'}
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
                {lang === 'en' ? 'AM' : 'EN'}
            </span>
        </button>
    );
}
