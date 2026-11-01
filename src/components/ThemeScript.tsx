// Sets the saved theme before first paint to avoid a flash.
const code = `(function(){try{var s=JSON.parse(localStorage.getItem("cg.settings.v1")||"{}");if(s.theme==="light"||s.theme==="dark")document.documentElement.setAttribute("data-theme",s.theme);if(s.discreetTitle)document.title="Notes";}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function applyTheme(theme: "system" | "light" | "dark") {
  const el = document.documentElement;
  if (theme === "system") el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", theme);
}
