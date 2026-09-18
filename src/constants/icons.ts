const BURGER = `<svg xmlns="http://www.w3.org/2000/svg"
	 viewBox="0 0 16 10" enable-background="new 0 0 16 10" xml:space="preserve">
<line fill="none" stroke="#242145" stroke-width="2" x1="0" y1="1" x2="16" y2="1"/>
<line fill="none" stroke="#242145" stroke-width="2" x1="0" y1="5" x2="16" y2="5"/>
<line fill="none" stroke="#242145" stroke-width="2" x1="0" y1="9" x2="16" y2="9"/>
</svg>`;

const DOWNLOAD = `<svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2V10M4.66667 5.33333L8 2L11.3333 5.33333M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
              stroke="var(--on-primary, #242145)"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>`;

export const ICON_PICKER = {
  BURGER,
  DOWNLOAD,
} as const;
