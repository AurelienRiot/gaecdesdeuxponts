import L from "leaflet";

function Pin(color: "red" | "green" | "blue") {
  const hex =
    color === "red" ? "#FF6465" : color === "green" ? "#15803d" : "#3D85F7";
  return `
<svg height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
viewBox="0 0 512 512" xml:space="preserve">
<defs>
 <filter id="f1" x="0" y="0" xmlns="http://www.w3.org/2000/svg">
   <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
 </filter>
</defs>

<path  filter="url(#f1)"
       fill="rgba(0,0,0,0.5)"
       style=" opacity: 1; transform:rotateX(60deg) rotateY(40deg) translateX(15%) translateY(27%)"
       d="M255.999,0C166.683,0,94.278,72.405,94.278,161.722c0,81.26,62.972,235.206,161.722,350.278
       c98.75-115.071,161.722-269.018,161.722-350.278C417.722,72.405,345.316,0,255.999,0z"
     />
<path style="fill:${hex};" d="M255.999,0C166.683,0,94.278,72.405,94.278,161.722c0,81.26,62.972,235.206,161.722,350.278
c98.75-115.071,161.722-269.018,161.722-350.278C417.722,72.405,345.316,0,255.999,0z"/>
<g style="opacity:0.1;">
<path d="M168.207,125.87c15.735-64.065,67.63-109.741,128.634-120.664C283.794,1.811,270.109,0,255.999,0
 C166.683,0,94.277,72.405,94.277,161.722c0,73.715,51.824,207.247,135.167,317.311C170.39,349.158,150.032,199.872,168.207,125.87z
 "/>
</g>
<path style="fill:#FFFFFF;" d="M255.999,235.715c-40.81,0-74.014-33.203-74.019-74.014c0.005-40.795,33.209-73.998,74.019-73.998
s74.014,33.203,74.019,74.014C330.015,202.513,296.809,235.715,255.999,235.715z"/>
</svg>

`;
}

export function MakePin(color: "red" | "green" | "blue", label: string) {
  return L.divIcon({
    html: `
        <div class="custom-marker">
            <div class="marker-label">${label}</div>
            ${Pin(color)}
        </div>
    `,
    className: "", // No default styles
    iconSize: [40, 40], // Size of the marker icon
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
  });
}
