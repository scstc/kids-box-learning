import type { AnimalId } from "../data/animals";

export default function AnimalArt({
  animal,
  className = "",
}: {
  animal: AnimalId;
  className?: string;
}) {
  return (
    <svg
      className={`animal-art ${className}`}
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="160" cy="287" rx="91" ry="13" fill="#435d36" opacity=".10" />
      {animal === "giraffe" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M207 216q51 9 43 48" stroke="#b87437" strokeWidth="7" />
          <path d="m250 259-6 15 12-2" fill="#735336" />
          <path
            d="M116 222v59q5 10 16 0l9-50M175 228l5 53q7 9 17-1l-1-63"
            fill="#e5a746"
          />
          <path
            d="M122 194q-32 5-34 30c-1 20 27 29 60 27l42-2q31-2 31-29c0-19-23-31-39-24L177 79l-47 6z"
            fill="#f5c463"
          />
          <path d="m133 94-12 111" stroke="#c9893e" strokeWidth="10" />
          <path d="m142 56-5-26m32 23 2-27" stroke="#9c6935" strokeWidth="8" />
          <circle cx="136" cy="27" r="8" fill="#775136" />
          <circle cx="172" cy="25" r="8" fill="#775136" />
          <path
            d="M137 63q-30-29-37-17t26 30m48-13q28-30 35-18t-25 32"
            fill="#edb458"
          />
          <path
            d="m126 65-18-16m72 16 20-17"
            stroke="#cf934b"
            strokeWidth="5"
          />
          <path
            d="M129 62q4-19 27-18c18 1 30 12 28 31l-2 19q-7 22-31 16-21-5-22-27z"
            fill="#f7ca6e"
          />
          <path
            d="M159 78q13-6 32 0 20 9 12 24-7 13-30 10-25-4-23-18z"
            fill="#f9d990"
          />
          <ellipse cx="191" cy="87" rx="3" ry="4" fill="#83572e" />
          <circle cx="156" cy="69" r="4.5" fill="#3e442d" />
          <circle cx="157" cy="68" r="1.2" fill="white" />
          <path d="M174 100q7 5 12 0" stroke="#9c6935" strokeWidth="2.5" />
          <ellipse cx="146" cy="85" rx="7" ry="4" fill="#e9a066" opacity=".7" />
          <g fill="#ba7a38">
            <path d="m141 117 17-5 7 13-10 12-15-5zM139 150l15-4 9 12-10 11-16-5zM147 182l15-6 9 11-9 14-15-3zM111 209l15-5 9 13-8 12-17-4zM148 220l12-11 15 8-3 16-16 2zM186 204l13-2 11 13-13 9-13-8z" />
          </g>
          <path d="M114 282h19m47 0h17" stroke="#79583c" strokeWidth="7" />
        </g>
      )}
      {animal === "elephant" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="m83 184-16 38" stroke="#8c91b4" strokeWidth="8" />
          <path d="m65 222 2 13" stroke="#5f668d" strokeWidth="8" />
          <path d="M87 186q-5-60 68-64 67-5 78 59l-6 62H95z" fill="#a1a8ce" />
          <path
            d="M99 222v55q15 13 30 0l5-49m48-1 5 51q16 11 28-2l6-56"
            fill="#8e98c1"
          />
          <ellipse cx="207" cy="155" rx="54" ry="59" fill="#aab3d8" />
          <ellipse cx="160" cy="164" rx="44" ry="52" fill="#8e99c3" />
          <ellipse cx="158" cy="166" rx="32" ry="40" fill="#b0b7dc" />
          <path
            d="M235 166q7 35-2 64-2 28 18 26 20-4 13-21"
            stroke="#aab3d8"
            strokeWidth="29"
          />
          <path d="m232 212 12 2m-13 9 12 2" stroke="#8f99c1" strokeWidth="3" />
          <path d="m222 188-6 24q16-3 20-17" fill="#fff5db" />
          <circle cx="225" cy="149" r="5" fill="#374058" />
          <circle cx="226" cy="147" r="1.5" fill="white" />
          <ellipse cx="223" cy="170" rx="9" ry="5" fill="#d7abbe" />
          <path
            d="m103 277 4-8m9 9 2-8m74 8 2-8m9 8 1-8"
            stroke="#d5d9eb"
            strokeWidth="5"
          />
        </g>
      )}
      {animal === "snake" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M88 264q-39-15-19-40t74-5q62 27 73-8-1-22-35-39"
            stroke="#729d63"
            strokeWidth="35"
          />
          <path
            d="M88 264q-39-15-19-40t74-5q62 27 73-8"
            stroke="#98b779"
            strokeWidth="17"
          />
          <path
            d="M179 192q-42-40-24-77 15-36 52-17 36 16 19 49-11 21-29 27l8 25"
            fill="#81a66b"
          />
          <path
            d="M166 155q18 14 45 2-11 17-17 23l10 20-18 7q-20-24-20-52"
            fill="#c8d59a"
          />
          <ellipse cx="200" cy="122" rx="29" ry="23" fill="#91b578" />
          <circle cx="206" cy="113" r="5" fill="#344c36" />
          <circle cx="207" cy="112" r="1.4" fill="white" />
          <path d="M219 130q-7 5-14 1" stroke="#4c7148" strokeWidth="2.5" />
          <path
            d="m229 130 15 2 9-7m-10 7 8 7"
            stroke="#d88f85"
            strokeWidth="3"
          />
          <g fill="#597f4f">
            <ellipse
              cx="161"
              cy="139"
              rx="6"
              ry="10"
              transform="rotate(-14 161 139)"
            />
            <ellipse
              cx="170"
              cy="171"
              rx="5"
              ry="8"
              transform="rotate(-34 170 171)"
            />
            <circle cx="215" cy="219" r="6" />
            <circle cx="176" cy="235" r="6" />
            <circle cx="100" cy="223" r="6" />
          </g>
        </g>
      )}
      {animal === "hippo" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="m77 209-13 4" stroke="#9c81aa" strokeWidth="8" />
          <ellipse cx="154" cy="211" rx="78" ry="55" fill="#ab8fb7" />
          <path
            d="m99 237-3 40q14 12 29 0l6-34m42 2 6 32q17 10 28-3l1-37"
            fill="#977aa6"
          />
          <circle cx="171" cy="132" r="16" fill="#a88ab4" />
          <circle cx="233" cy="130" r="16" fill="#a88ab4" />
          <circle cx="171" cy="132" r="9" fill="#d0afc7" />
          <circle cx="233" cy="130" r="9" fill="#d0afc7" />
          <rect x="157" y="131" width="90" height="84" rx="38" fill="#b59abe" />
          <ellipse cx="213" cy="200" rx="59" ry="39" fill="#c3a6c9" />
          <circle cx="181" cy="157" r="4.5" fill="#49394e" />
          <circle cx="226" cy="156" r="4.5" fill="#49394e" />
          <ellipse cx="190" cy="191" rx="5" ry="4" fill="#9976a4" />
          <ellipse cx="238" cy="191" rx="5" ry="4" fill="#9976a4" />
          <path d="M188 216q26 11 49-2" stroke="#916b9e" strokeWidth="3" />
          <path d="M200 219v8q7 4 10-1v-5m11-1v8q8 2 9-3v-7" fill="#fff8e9" />
          <path
            d="m100 276 3-6m10 7 1-7m71 7 2-7m10 7v-7"
            stroke="#cdb3d0"
            strokeWidth="4"
          />
        </g>
      )}
      {animal === "crocodile" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M116 215Q64 251 28 220q28 46 92 27" fill="#78965c" />
          <ellipse cx="159" cy="228" rx="71" ry="37" fill="#8da56a" />
          <path
            d="m119 243-15 30h30l10-22m42-7 5 29h29l-14-35"
            fill="#749257"
          />
          <path
            d="M176 217q-6-58 35-55 32 0 36 39h32q19 0 15 18-1 20-50 20h-45"
            fill="#91ac6e"
          />
          <path d="M194 223q50 13 95-4-10 26-59 21h-33" fill="#c3cc8d" />
          <path
            d="m220 227 6 9 6-8m15-1 6 8 5-10m14-2 4 7 5-9"
            fill="#fff8de"
          />
          <circle cx="211" cy="173" r="14" fill="#91ac6e" />
          <circle cx="211" cy="172" r="5" fill="#344b34" />
          <circle cx="212" cy="170" r="1.4" fill="white" />
          <circle cx="281" cy="207" r="3" fill="#547241" />
          <path d="M184 211q39 13 102 5" stroke="#547241" strokeWidth="3" />
          <path
            d="m79 232 9-14 9 13 7-27 15 15 9-28 17 14 12-24 15 18 12-25 10 18"
            fill="#5f814d"
          />
          <g fill="#729155">
            <circle cx="134" cy="229" r="4" />
            <circle cx="155" cy="238" r="4" />
            <circle cx="171" cy="223" r="4" />
          </g>
        </g>
      )}
      {animal === "monkey" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M115 238q-62 30-67-22-4-38 24-32 23 4 8 24"
            stroke="#a47b50"
            strokeWidth="15"
          />
          <path
            d="m130 201-35 40m96-39 35 33"
            stroke="#ac8154"
            strokeWidth="19"
          />
          <circle cx="93" cy="243" r="12" fill="#e8c493" />
          <circle cx="229" cy="237" r="12" fill="#e8c493" />
          <ellipse cx="161" cy="219" rx="43" ry="52" fill="#ae8356" />
          <ellipse cx="161" cy="221" rx="27" ry="37" fill="#e8c998" />
          <path
            d="m137 255-16 21 29 4 8-22m22-5 16 24-29 3-7-21"
            fill="#ac8154"
          />
          <circle cx="111" cy="139" r="24" fill="#a77c51" />
          <circle cx="211" cy="139" r="24" fill="#a77c51" />
          <circle cx="111" cy="139" r="15" fill="#dfb88c" />
          <circle cx="211" cy="139" r="15" fill="#dfb88c" />
          <circle cx="161" cy="137" r="55" fill="#af8355" />
          <path
            d="M139 109q13-9 22 4 15-15 31-2 17 14 9 32 23 32-8 45-30 15-65-4-27-16-5-39-9-22 16-36"
            fill="#efd3a4"
          />
          <path
            d="M150 88q-8-21 5-29 0 20 14 25m-6 1q7-23 20-17-11 12-9 20"
            fill="#af8355"
          />
          <circle cx="143" cy="135" r="5" fill="#4b3e2e" />
          <circle cx="178" cy="135" r="5" fill="#4b3e2e" />
          <ellipse cx="161" cy="154" rx="7" ry="5" fill="#a77c51" />
          <path d="M145 166q17 16 33-1" stroke="#9d724a" strokeWidth="3" />
          <ellipse cx="132" cy="151" rx="7" ry="4" fill="#e7ab8b" />
          <ellipse cx="190" cy="151" rx="7" ry="4" fill="#e7ab8b" />
        </g>
      )}
      {animal === "tiger" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M200 244q57 4 41-44" stroke="#df9a43" strokeWidth="15" />
          <path d="m244 214 3-4m-5 22 5-3" stroke="#6c583b" strokeWidth="9" />
          <ellipse cx="158" cy="225" rx="52" ry="54" fill="#eeb05b" />
          <ellipse cx="158" cy="233" rx="31" ry="44" fill="#fff0cf" />
          <path
            d="m124 253-8 23q16 12 32 1l2-24m21 0 2 24q17 10 30-1l-11-25"
            fill="#eeb05b"
          />
          <circle cx="112" cy="111" r="24" fill="#e9a14b" />
          <circle cx="205" cy="111" r="24" fill="#e9a14b" />
          <circle cx="112" cy="111" r="14" fill="#5e503c" />
          <circle cx="205" cy="111" r="14" fill="#5e503c" />
          <path
            d="M104 126q3-39 54-39 52 0 57 42l-3 34q-6 39-54 40-52 0-57-40z"
            fill="#f2b55f"
          />
          <path
            d="m145 88 13 35 13-35m-66 30 29 17-31-1m-2 15 31 10-28 5m109-46-29 17 31-1m2 15-31 10 28 5"
            fill="#6f583b"
          />
          <path
            d="M158 162q-19-23-34-4-15 25 12 33 14 5 22-4 12 10 27 2 22-10 9-29-14-18-36 2"
            fill="#fff2d5"
          />
          <circle cx="137" cy="141" r="5" fill="#443d2e" />
          <circle cx="180" cy="141" r="5" fill="#443d2e" />
          <path d="m150 160 9 10 9-10q-9-6-18 0" fill="#74533d" />
          <path
            d="M159 169v9m0 0q-9 8-16 0m16 0q9 8 15-1"
            stroke="#74533d"
            strokeWidth="2.5"
          />
          <path
            d="m108 210 19 7-19 4m99-11-18 7 19 4m-99 15 18 6-15 4m91-10-18 6 15 4"
            fill="#6f583b"
          />
          <path
            d="m117 167-21-4m21 12-22 3m105-11 21-4m-21 12 22 3"
            stroke="#8f7955"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}

export function SceneLeaves() {
  return (
    <svg
      className="scene-leaves"
      viewBox="0 0 500 410"
      fill="none"
      aria-hidden="true"
    >
      <path d="M22 406q28-90 5-189" stroke="#688756" strokeWidth="5" />
      <path
        d="M30 331q-51-10-45-67 52 13 45 67M33 302q55-13 54-66-54 10-54 66M32 269Q-7 248-5 202q49 11 37 67M32 238q43-20 38-61-45 12-38 61"
        fill="#7c9c67"
      />
      <path d="M460 415q-36-74-23-145" stroke="#688756" strokeWidth="4" />
      <path
        d="M447 361q-46-3-49-46 44 6 49 46M439 336q41-17 40-53-44 15-40 53M436 310q-39-11-37-47 39 8 37 47M438 289q34-12 36-45-38 6-36 45"
        fill="#90a675"
      />
      <path
        d="M78 411q0-46-16-69m15 43q17-27 29-29M402 412q-7-26 4-45"
        stroke="#91a773"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="m365 69 3-9 3 9 9 3-9 3-3 9-3-9-9-3zM78 116l2-6 2 6 6 2-6 2-2 6-2-6-6-2z"
        fill="#d6aa54"
      />
      <circle cx="400" cy="131" r="4" fill="#c6d2ad" />
      <circle cx="103" cy="48" r="3" fill="#c6d2ad" />
    </svg>
  );
}
