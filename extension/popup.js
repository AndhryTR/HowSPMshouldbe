(function () {
    'use strict';

    const toggleEl = document.getElementById('spm-toggle-enabled');
    const darkEl = document.getElementById('spm-toggle-dark');
    const badgeEl = document.getElementById('spm-status-badge');
    const hintEl = document.getElementById('spm-status-hint');

    function renderState(enabled, darkMode) {
        if (toggleEl) toggleEl.checked = enabled;
        if (darkEl) {
            darkEl.checked = darkMode;
            darkEl.disabled = !enabled;
        }
        if (badgeEl) {
            badgeEl.textContent = enabled ? 'Aktif' : 'Nonaktif';
            badgeEl.classList.toggle('is-off', !enabled);
        }
        if (hintEl) {
            hintEl.textContent = enabled
                ? (darkMode
                    ? 'SPM Fakturis Pro aktif (Dark Mode) di tab staging.'
                    : 'Tampilan SPM Fakturis Pro aktif di tab staging.')
                : 'Mode tampilan asli web aktif (ekstensi dijeda).';
        }
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get({ spm_enabled: true, spm_dark_mode: false }, (result) => {
            renderState(result.spm_enabled !== false, Boolean(result.spm_dark_mode));
        });

        toggleEl?.addEventListener('change', () => {
            const nextEnabled = Boolean(toggleEl.checked);
            const currDark = Boolean(darkEl?.checked);
            chrome.storage.local.set({ spm_enabled: nextEnabled }, () => {
                renderState(nextEnabled, currDark);
            });
        });

        darkEl?.addEventListener('change', () => {
            const nextDark = Boolean(darkEl.checked);
            const currEnabled = Boolean(toggleEl?.checked);
            chrome.storage.local.set({ spm_dark_mode: nextDark }, () => {
                renderState(currEnabled, nextDark);
            });
        });
    } else {
        renderState(true, false);
    }
})();
