import L from "leaflet";

const colors = {
  red: "#FF6465",
  green: "#15803d",
  blue: "#3D85F7",
};

function Pin(color: keyof typeof colors) {
  switch (color) {
    case "red":
      return `<svg
      height="40" 
      width="40"
      version="1.1"
      id="Layer_1"
      viewBox="0 0 512 512"
      xml:space="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg">
      <defs
      id="defs185"><filter
        style="color-interpolation-filters:sRGB"
        id="filter1091"
        x="-0.32383439"
        y="-0.27601853"
        width="1.6476688"
        height="1.552037"><feGaussianBlur
          stdDeviation="25.558679"
          result="fbSourceGraphic"
          id="feGaussianBlur1089" /><feColorMatrix
          result="fbSourceGraphicAlpha"
          in="fbSourceGraphic"
          values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
          id="feColorMatrix1093" /><feGaussianBlur
          id="feGaussianBlur1095"
          stdDeviation="2 2"
          result="fbSourceGraphic"
          in="fbSourceGraphic" /><feColorMatrix
          result="fbSourceGraphicAlpha"
          in="fbSourceGraphic"
          values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
          id="feColorMatrix1097" /><feGaussianBlur
          id="feGaussianBlur1099"
          stdDeviation="2 2"
          result="fbSourceGraphic"
          in="fbSourceGraphic" /><feColorMatrix
          result="fbSourceGraphicAlpha"
          in="fbSourceGraphic"
          values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
          id="feColorMatrix2190" /><feGaussianBlur
          id="feGaussianBlur2192"
          stdDeviation="5 5"
          result="blur"
          in="fbSourceGraphic" /></filter></defs>
    
          <path
          style="opacity:0.733193;mix-blend-mode:normal;fill:#000000;stroke-width:0.531061;filter:url(#filter1091)"
          d="m 471.82783,215.25169 c -42.36223,-0.75587 -108.14786,41.12406 -146.93665,93.54199 -35.28979,47.68946 -72.27847,138.56946 -75.41551,206.93803 96.81008,-66.69659 193.53396,-156.51129 228.82379,-204.20077 38.78879,-52.4179 35.89106,-95.52334 -6.47163,-96.27925 z"
          id="path189-6"
          transform="matrix(0.96117253,0.0074331,-0.00743217,0.96129356,-5.742501,10.514794)" />
    <path
      style="fill:#ff6465"
      d="M 255.999,0 C 166.683,0 94.278,72.405 94.278,161.722 94.278,242.982 157.25,396.928 256,512 354.75,396.929 417.722,242.982 417.722,161.722 417.722,72.405 345.316,0 255.999,0 Z"
      id="path189" />
    <g
      style="opacity:0.1"
      id="g193">
    <path
      d="M 168.207,125.87 C 183.942,61.805 235.837,16.129 296.841,5.206 283.794,1.811 270.109,0 255.999,0 166.683,0 94.277,72.405 94.277,161.722 c 0,73.715 51.824,207.247 135.167,317.311 C 170.39,349.158 150.032,199.872 168.207,125.87 Z"
      id="path191" />
    </g>
    <path
      style="fill:#ffffff;stroke-width:1.36258"
      d="m 257.24216,261.30952 c -55.60682,0 -100.84987,-45.24169 -100.85668,-100.84987 0.007,-55.58638 45.24986,-100.828064 100.85668,-100.828064 55.60682,0 100.84987,45.241684 100.85668,100.849864 -0.004,55.58775 -45.24986,100.82807 -100.85668,100.82807 z"
      id="path195" />
    <g
      id="g544"
      transform="matrix(0.24836474,0,0,0.24836474,194.73448,94.214035)"><path
        style="fill:#a9b1bc"
        d="m 415.983,53.316 c -17.666,0 -31.99,14.324 -31.99,31.99 h -0.109 v 136.286 h 21.337 V 85.306 h 0.094 c 0,-5.881 4.78,-10.668 10.669,-10.668 5.889,0 10.668,-4.772 10.668,-10.661 -10e-4,-5.889 -4.781,-10.661 -10.669,-10.661 z"
        id="path425" /><path
        style="fill:#ec5564"
        d="m 63.981,42.647 h 202.601 l 53.133,171.065 c 0,0 163.06,-3.116 192.129,53.538 L 511.25,383.879 H 21.134 Z"
        id="path427" /><polygon
        style="fill:#5e9cea"
        points="74.79,298.967 101.61,85.306 235.171,85.306 288.162,255.918 175.181,255.918 "
        id="polygon429" /><g
        id="g435">
     <path
      style="fill:#424953"
      d="m 319.902,373.227 c 0,-53.016 42.971,-95.971 95.971,-95.971 52.999,0 95.971,42.955 95.971,95.971 0,52.982 -42.972,95.971 -95.971,95.971 -53,-10e-4 -95.971,-42.99 -95.971,-95.971 z"
      id="path431" />
     <path
      style="fill:#424953"
      d="m 0,341.236 c 0,-70.682 57.295,-127.978 127.961,-127.978 70.673,0 127.961,57.296 127.961,127.978 0,70.666 -57.288,127.961 -127.961,127.961 C 57.295,469.197 0,411.902 0,341.236 Z"
      id="path433" />
    </g><path
        style="fill:#e5e8ec"
        d="m 415.873,405.217 c -17.65,0 -31.99,-14.371 -31.99,-31.99 0,-17.652 14.34,-31.99 31.99,-31.99 17.65,0 31.99,14.338 31.99,31.99 0,17.619 -14.339,31.99 -31.99,31.99 z"
        id="path437" /><path
        style="fill:#cbd0d8"
        d="m 415.873,330.551 c -23.556,0 -42.644,19.119 -42.644,42.676 0,23.555 19.088,42.643 42.644,42.643 23.555,0 42.643,-19.088 42.643,-42.643 0,-23.558 -19.088,-42.676 -42.643,-42.676 z m 0,63.98 c -11.762,0 -21.338,-9.559 -21.338,-21.305 0,-11.777 9.576,-21.338 21.338,-21.338 11.762,0 21.337,9.561 21.337,21.338 0,11.747 -9.575,21.305 -21.337,21.305 z"
        id="path439" /><path
        style="fill:#e5e8ec"
        d="m 127.961,383.879 c -23.517,0 -42.651,-19.135 -42.651,-42.643 0,-23.525 19.135,-42.676 42.651,-42.676 23.516,0 42.651,19.15 42.651,42.676 0,23.507 -19.135,42.643 -42.651,42.643 z"
        id="path441" /><g
        id="g447">
     <path
      style="fill:#cbd0d8"
      d="m 127.961,287.908 c -29.444,0 -53.32,23.867 -53.32,53.328 0,29.428 23.875,53.295 53.32,53.295 29.444,0 53.319,-23.867 53.319,-53.295 0,-29.46 -23.875,-53.328 -53.319,-53.328 z m 0,85.319 c -17.643,0 -31.99,-14.371 -31.99,-31.99 0,-17.652 14.347,-31.99 31.99,-31.99 17.643,0 31.99,14.338 31.99,31.99 0,17.618 -14.347,31.99 -31.99,31.99 z"
      id="path443" />
     <path
      style="fill:#cbd0d8"
      d="m 405.22,106.628 h -21.337 c -11.73,0 -21.338,9.599 -21.338,21.33 v 42.846 c 0,11.73 9.607,21.329 21.338,21.329 h 21.337 c 11.716,0 21.306,-9.599 21.306,-21.329 v -42.846 c 0,-11.732 -9.59,-21.33 -21.306,-21.33 z"
      id="path445" />
    </g><path
        style="fill:#424953"
        d="M 287.912,42.647 H 53.319 c -5.889,0 -10.668,4.78 -10.668,10.668 0,5.888 4.78,10.661 10.668,10.661 h 234.593 c 5.889,0 10.652,-4.772 10.652,-10.661 0,-5.889 -4.763,-10.668 -10.652,-10.668 z"
        id="path449" /><g
        id="g499">
     <path
      style="fill:#646c77"
      d="m 117.323,213.704 c 0.234,5.686 4.897,10.224 10.638,10.224 5.74,0 10.411,-4.538 10.645,-10.224 -3.515,-0.289 -7.061,-0.445 -10.645,-0.445 -3.585,0 -7.131,0.156 -10.638,0.445 z"
      id="path451" />
     <path
      style="fill:#646c77"
      d="m 127.961,458.512 c -5.741,0 -10.403,4.547 -10.638,10.232 3.507,0.297 7.053,0.453 10.638,0.453 3.584,0 7.13,-0.156 10.645,-0.453 -0.234,-5.685 -4.905,-10.232 -10.645,-10.232 z"
      id="path453" />
     <path
      style="fill:#646c77"
      d="m 78.991,223.006 c -3.312,1.367 -6.529,2.866 -9.661,4.483 2.39,5.155 8.443,7.568 13.746,5.366 5.303,-2.195 7.88,-8.177 5.92,-13.512 -3.358,1.078 -6.693,2.288 -10.005,3.663 z"
      id="path455" />
     <path
      style="fill:#646c77"
      d="m 172.853,449.594 c -5.303,2.201 -7.88,8.168 -5.92,13.512 3.351,-1.062 6.686,-2.281 9.997,-3.656 3.311,-1.375 6.529,-2.873 9.661,-4.482 -2.39,-5.171 -8.435,-7.577 -13.738,-5.374 z"
      id="path457" />
     <path
      style="fill:#646c77"
      d="m 37.481,250.74 c -2.538,2.538 -4.936,5.155 -7.208,7.842 4.178,3.85 10.692,3.764 14.745,-0.297 4.062,-4.062 4.155,-10.568 0.297,-14.754 -2.68,2.281 -5.304,4.678 -7.834,7.209 z"
      id="path459" />
     <path
      style="fill:#646c77"
      d="m 210.904,424.164 c -4.062,4.061 -4.147,10.574 -0.297,14.76 2.687,-2.279 5.303,-4.686 7.841,-7.215 2.53,-2.531 4.928,-5.156 7.208,-7.842 -4.185,-3.844 -10.691,-3.75 -14.752,0.297 z"
      id="path461" />
     <path
      style="fill:#646c77"
      d="m 14.222,282.598 c -1.609,3.123 -3.108,6.342 -4.483,9.652 -1.367,3.312 -2.585,6.654 -3.663,9.998 5.342,1.967 11.325,-0.609 13.519,-5.904 2.195,-5.311 -0.211,-11.358 -5.373,-13.746 z"
      id="path463" />
     <path
      style="fill:#646c77"
      d="m 236.334,386.113 c -2.203,5.295 0.211,11.355 5.365,13.73 1.609,-3.125 3.117,-6.342 4.483,-9.654 1.375,-3.311 2.585,-6.654 3.663,-9.996 -5.341,-1.968 -11.317,0.625 -13.511,5.92 z"
      id="path465" />
     <path
      style="fill:#646c77"
      d="m 10.669,341.236 c 0,-5.748 -4.545,-10.42 -10.224,-10.654 -0.289,3.5 -0.445,7.061 -0.445,10.654 0,3.561 0.156,7.123 0.445,10.621 5.686,-0.218 10.224,-4.904 10.224,-10.621 z"
      id="path467" />
     <path
      style="fill:#646c77"
      d="m 255.477,330.582 c -5.678,0.234 -10.216,4.906 -10.216,10.654 0,5.717 4.538,10.402 10.216,10.621 0.289,-3.498 0.445,-7.061 0.445,-10.621 0,-3.593 -0.156,-7.154 -0.445,-10.654 z"
      id="path469" />
     <path
      style="fill:#646c77"
      d="m 6.076,380.193 c 1.078,3.342 2.296,6.686 3.663,9.996 1.375,3.312 2.875,6.529 4.483,9.654 5.162,-2.375 7.568,-8.436 5.373,-13.73 -2.194,-5.295 -8.177,-7.888 -13.519,-5.92 z"
      id="path471" />
     <path
      style="fill:#646c77"
      d="m 249.845,302.247 c -1.078,-3.344 -2.288,-6.686 -3.663,-9.998 -1.367,-3.311 -2.875,-6.529 -4.483,-9.652 -5.154,2.389 -7.568,8.436 -5.365,13.746 2.194,5.296 8.17,7.872 13.511,5.904 z"
      id="path473" />
     <path
      style="fill:#646c77"
      d="m 30.272,423.867 c 2.272,2.686 4.67,5.311 7.208,7.842 2.53,2.529 5.147,4.936 7.833,7.215 3.858,-4.186 3.765,-10.699 -0.297,-14.76 -4.052,-4.047 -10.566,-4.141 -14.744,-0.297 z"
      id="path475" />
     <path
      style="fill:#646c77"
      d="m 225.657,258.582 c -2.28,-2.688 -4.678,-5.304 -7.208,-7.842 -2.538,-2.531 -5.155,-4.928 -7.841,-7.209 -3.851,4.187 -3.765,10.692 0.297,14.754 4.06,4.052 10.566,4.147 14.752,0.297 z"
      id="path477" />
     <path
      style="fill:#646c77"
      d="m 83.076,449.594 c -5.303,-2.203 -11.356,0.203 -13.746,5.373 3.132,1.609 6.35,3.107 9.661,4.482 3.311,1.375 6.646,2.594 10.005,3.656 1.961,-5.343 -0.617,-11.311 -5.92,-13.511 z"
      id="path479" />
     <path
      style="fill:#646c77"
      d="m 166.933,219.343 c -1.96,5.334 0.617,11.317 5.92,13.512 5.303,2.195 11.348,-0.211 13.738,-5.374 -3.132,-1.609 -6.35,-3.108 -9.661,-4.475 -3.311,-1.375 -6.646,-2.585 -9.997,-3.663 z"
      id="path481" />
     <path
      style="fill:#646c77"
      d="m 415.873,277.256 c -3.593,0 -7.154,0.188 -10.653,0.578 0.109,5.795 4.843,10.449 10.653,10.449 5.81,0 10.543,-4.654 10.652,-10.449 -3.498,-0.391 -7.06,-0.578 -10.652,-0.578 z"
      id="path483" />
     <path
      style="fill:#646c77"
      d="m 415.873,469.197 c 3.592,0 7.139,-0.219 10.637,-0.594 -0.312,-5.623 -4.951,-10.092 -10.637,-10.092 -5.686,0 -10.325,4.469 -10.638,10.092 3.499,0.376 7.045,0.594 10.638,0.594 z"
      id="path485" />
     <path
      style="fill:#646c77"
      d="m 348.019,305.355 c -2.562,2.547 -4.921,5.201 -7.123,7.951 4.187,4.014 10.81,3.967 14.933,-0.141 4.109,-4.107 4.156,-10.762 0.125,-14.918 -2.749,2.189 -5.405,4.564 -7.935,7.108 z"
      id="path487" />
     <path
      style="fill:#646c77"
      d="m 483.727,441.079 c 2.547,-2.547 4.905,-5.201 7.107,-7.936 -4.186,-3.748 -10.605,-3.623 -14.636,0.391 -4.03,4.016 -4.155,10.451 -0.406,14.637 2.749,-2.187 5.405,-4.56 7.935,-7.092 z"
      id="path489" />
     <path
      style="fill:#646c77"
      d="m 319.902,373.227 c 0,3.592 0.203,7.154 0.594,10.652 5.795,-0.125 10.465,-4.842 10.465,-10.652 0,-5.842 -4.67,-10.561 -10.465,-10.654 -0.39,3.499 -0.594,7.044 -0.594,10.654 z"
      id="path491" />
     <path
      style="fill:#646c77"
      d="m 511.844,373.227 c 0,-3.609 -0.203,-7.154 -0.594,-10.654 -5.607,0.312 -10.06,4.953 -10.06,10.654 0,5.686 4.452,10.309 10.06,10.621 0.391,-3.498 0.594,-7.03 0.594,-10.621 z"
      id="path493" />
     <path
      style="fill:#646c77"
      d="m 348.019,441.079 c 2.53,2.547 5.187,4.904 7.935,7.107 4.031,-4.17 3.984,-10.809 -0.125,-14.918 -4.123,-4.123 -10.746,-4.154 -14.933,-0.141 2.202,2.736 4.561,5.391 7.123,7.952 z"
      id="path495" />
     <path
      style="fill:#646c77"
      d="m 483.727,305.355 c -2.529,-2.545 -5.186,-4.904 -7.935,-7.107 -3.749,4.188 -3.624,10.623 0.406,14.652 4.03,4.014 10.45,4.139 14.636,0.391 -2.202,-2.734 -4.56,-5.389 -7.107,-7.936 z"
      id="path497" />
    </g></g></svg>`;
    default:
      return `
     <svg height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     viewBox="0 0 512 512" xml:space="preserve">
     <defs
      id="defs185"><filter
        style="color-interpolation-filters:sRGB"
        id="filter1091"
        x="-0.32383439"
        y="-0.27601853"
        width="1.6476688"
        height="1.552037"><feGaussianBlur
          stdDeviation="25.558679"
          result="fbSourceGraphic"
          id="feGaussianBlur1089" /><feColorMatrix
          result="fbSourceGraphicAlpha"
          in="fbSourceGraphic"
          values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
          id="feColorMatrix1093" /><feGaussianBlur
          id="feGaussianBlur1095"
          stdDeviation="2 2"
          result="fbSourceGraphic"
          in="fbSourceGraphic" /><feColorMatrix
          result="fbSourceGraphicAlpha"
          in="fbSourceGraphic"
          values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
          id="feColorMatrix1097" /><feGaussianBlur
          id="feGaussianBlur1099"
          stdDeviation="2 2"
          result="fbSourceGraphic"
          in="fbSourceGraphic" /><feColorMatrix
          result="fbSourceGraphicAlpha"
          in="fbSourceGraphic"
          values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
          id="feColorMatrix2190" /><feGaussianBlur
          id="feGaussianBlur2192"
          stdDeviation="5 5"
          result="blur"
          in="fbSourceGraphic" /></filter></defs>
    
          <path
          style="opacity:0.733193;mix-blend-mode:normal;fill:#000000;stroke-width:0.531061;filter:url(#filter1091)"
          d="m 471.82783,215.25169 c -42.36223,-0.75587 -108.14786,41.12406 -146.93665,93.54199 -35.28979,47.68946 -72.27847,138.56946 -75.41551,206.93803 96.81008,-66.69659 193.53396,-156.51129 228.82379,-204.20077 38.78879,-52.4179 35.89106,-95.52334 -6.47163,-96.27925 z"
          id="path189-6"
          transform="matrix(0.96117253,0.0074331,-0.00743217,0.96129356,-5.742501,10.514794)" />
     <path style="fill:${colors[color]};" d="M255.999,0C166.683,0,94.278,72.405,94.278,161.722c0,81.26,62.972,235.206,161.722,350.278
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
}

export function MakePin(
  color: "red" | "green" | "blue",
  label: string,
  imagesUrl: string | null,
) {
  return L.divIcon({
    html: `
        <div class="custom-marker">
            <div class="marker-label ${color === "red" ? "marker-label-red" : ""}">
            ${imagesUrl ? `<img width="20" height="20" src="${`/_next/image?url=${imagesUrl}`}&w=48&q=75" alt="Logo ${label}" class="marker-icon" />` : ""}
            ${label}
            </div>
            ${Pin(color)}
        </div>
    `,
    className: "", // No default styles
    iconSize: [40, 40], // Size of the marker icon
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
  });
}
