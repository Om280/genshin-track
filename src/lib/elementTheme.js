// Element accents identify characters; the surrounding application uses Electro chrome.
export const elementTheme=Object.freeze({
  Pyro:{primary:'#e07761',soft:'rgba(224,119,97,.10)',glow:'rgba(182,72,66,.27)',border:'rgba(224,119,97,.35)'},
  Hydro:{primary:'#61b7dd',soft:'rgba(97,183,221,.10)',glow:'rgba(45,125,174,.28)',border:'rgba(97,183,221,.35)'},
  Anemo:{primary:'#78c9b1',soft:'rgba(120,201,177,.10)',glow:'rgba(50,140,123,.26)',border:'rgba(120,201,177,.35)'},
  Electro:{primary:'#ab91db',soft:'rgba(138,109,193,.10)',glow:'rgba(95,62,157,.31)',border:'rgba(171,145,219,.34)'},
  Cryo:{primary:'#8ccfe1',soft:'rgba(140,207,225,.10)',glow:'rgba(75,143,164,.28)',border:'rgba(140,207,225,.35)'},
  Geo:{primary:'#cba65d',soft:'rgba(203,166,93,.10)',glow:'rgba(146,107,51,.27)',border:'rgba(203,166,93,.35)'},
  Dendro:{primary:'#93c77e',soft:'rgba(147,199,126,.10)',glow:'rgba(87,146,69,.27)',border:'rgba(147,199,126,.35)'}
});
const neutral=elementTheme.Electro;
export const getElementTheme=(element)=>elementTheme[element]||neutral;
export const elementThemeStyle=(element)=>{const {primary,soft,glow,border}=getElementTheme(element);return {'--element-primary':primary,'--element-soft':soft,'--element-glow':glow,'--element-border':border}};
