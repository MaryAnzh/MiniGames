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
const LOGO = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"
  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g clip-path="url(#clip0_2_112)">
    <path
      d="M26 1H6C3.23858 1 1 3.23858 1 6V26C1 28.7614 3.23858 31 6 31H26C28.7614 31 31 28.7614 31 26V6C31 3.23858 28.7614 1 26 1Z"
      fill="url(#pattern0_2_112)"
      stroke="var(--on-primary, #242145)"
      stroke-width="2"
    />
  </g>
  <defs>
    <pattern id="pattern0_2_112" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_2_112" transform="scale(0.03125)"/>
    </pattern>
    <clipPath id="clip0_2_112">
      <rect width="32" height="32" fill="white"/>
    </clipPath>
    <image
      id="image0_2_112"
      width="32"
      height="32"
      preserveAspectRatio="none"
      xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAABCNJREFUeAG1V91rXEUU/83szeazNj5YTRVJQWoEg1YqKD6of4KKL2KxD4qPPuiLltpabKlatUIefFFEQQT7KAhFSAVfRKFSQQShXbWUZrMJCdm0m9175/TM1/3YvR9J0x52mLkzc875na+ZHcAREU1yO6KI5rnRbWrnQ6KDSJFwyqcJmOfhNMqIPMe2qcFinhVCNIw4RnapUvmtR6SV76uRdcnBm5Mryhn8dP7yJE9vCB0X/ngUt4y25JVzGgBtT8b2MMjcWVEhnTGTUuh2Q9PrJtKsWwAvsSUi81OK8MHps9j/9EnMPnEcn8z9pBM5DvdWKD8EfjEWmPKpViQE9swexq5dO3mW0Gyu4eKfx7JQDUt1LEo9QBko2WGnG9k9/N3rRYM8pbGgzQHwm3u9EKFWYtxshX564gV4BB+ffD7ZrXOD96soyYvBuCTASkNgmQkX/rqMA699g4iFs1yjZGJiGEGtZmSFoUK73UEgJfjH8xJfff4yHpm9vzIngirlmu69507U6wFqtRyHkVU4uXMsmWKUU1OTsa2UsptSfHqiPATOU2NjdWNlpr6LeqZeFOGOidFYT1pnv+xyAI5jZDiwNS98dts1kTbJR5Lnuhuh8ZjZg/I6CNKAKFaqjDwpLT5ddpGiRJDKyStfdowy5L1SJmqV+87LB5nmt9p0nUu8+fYZ7H3sKO6bOYSvv/sVE+PDzgNkeo2GPPI+C3aMj+DbM79h94Pv4IF9R/DWoe8NiDzKVoEbdrnkHn/mFEZHAqNM5PGKxGg9ZkFQukdiqYQGKzgkEX45+wbGR0cs+BQFGR+6oJIWpnTMa1ZgfKWm71fbKQeQZAqM26EMC7FBG2xMPTcZZMYk19frNbx64Ek0F9Zx+f8lzH34ojmMtALhDiPh8Eple0HJUa2T8PSJ53D1ygoWFtt4/ZWnjNy8g7nwINKHjU9CTXv3H+Nat6VllPHSUusaJ2eEu+/aYYSTuSeA1dXr+Pv3d2NepW9LmVOvKClDwcpNwhGZBBoyh5CznIcPz+zGP+cP49KF9/DQzFRGrD4RtVJjiJNVVJCDAHL80dnoYWgoMO7XMpoLbXwx95IpT01f8ri1vB6fCwGHsNMJE4HWPcijQQA5ibKyeg31wGcbIRjqY2HNxmIX5HpQQ3u9k5VZcBrJEr2uKoB//1vG4lKbLV9Ds7XGNx3h+Ec/WPsY0PunfuRkgllb5P8GreU2LjZaiRwq1LCJ27AAILlw+NX+deX+uFSRzKIsIB/GuFHsHX+ymIRN7ckop2IdGsA5WCOKSRSggj8mU4DK+Ae3/CGZ9edc2aXks4pQfd8VE6fNZ8I8SgH9OJmuYkjfvv3z6FsTJd9u3JBC7OEmVvRDkecaqCDa5Foe0L4/Jg2ns28TvxP1U+02Ps/nI6Kj2ute5w08AKp+H2eCQgAAAABJRU5ErkJggg=="
    />
  </defs>
</svg>`;

const RS = `<svg width="24" height="24" viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg">
  <rect
    x="0"
    y="0"
    width="24"
    height="24"
    rx="12"
    fill="var(--on-primary, #242145)"
  />
  <text
    x="12"
    y="13"
    text-anchor="middle"
    dominant-baseline="central"
    fill="var(--primary, #FFD02B)"
    font-family="Inter, system-ui, -apple-system, BlinkMacSystemFont"
    font-size="10"
    font-weight="700"
  >
    RS
  </text>
</svg>`;

export const ICON_PICKER = {
  BURGER,
  DOWNLOAD,
  LOGO,
  RS,
} as const;
