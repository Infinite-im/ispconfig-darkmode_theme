/* -------------------------------------------------------------------------
   ISPConfig theme toggle
   Switches the light/dark class on <html> (so CSS custom properties recolor
   the whole UI, including AJAX-loaded content) and persists the choice.
   ------------------------------------------------------------------------- */
(function ($) {
	"use strict";

	var STORAGE_KEY = "ispconfig-theme";

	function isDark() {
		return document.documentElement.classList.contains("dark");
	}

	function applyTheme(dark) {
		if (dark) document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
	}

	function resolveTheme() {
		var stored = null;
		try {
			stored = localStorage.getItem(STORAGE_KEY);
		} catch (e) {}
		if (stored === "dark" || stored === "light") {
			return stored === "dark";
		}
		// Fall back to the operating system preference
		return window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
	}

	function persist(dark) {
		try {
			localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
		} catch (e) {}
	}

	// Apply the saved / system theme as soon as the library is ready
	applyTheme(resolveTheme());
	persist(isDark());

	// Toggle on click (delegated so it works for static and AJAX content)
	$(document).on("click", "[data-toggle-theme]", function (e) {
		e.preventDefault();
		applyTheme(!isDark());
		persist(isDark());
	});

	// Expose a tiny API for other code
	window.ISPConfigTheme = {
		toggle: function () {
			applyTheme(!isDark());
			persist(isDark());
		},
		set: function (mode) {
			applyTheme(mode === "dark");
			persist(isDark());
		},
		isDark: isDark
	};
})(jQuery);
