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

const ARROW_DOWN = `<svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15L7 10H17L12 15Z"
                fill="var(--Color-schemes-Surface-colors-On-surface-variant, #444746)"
              />
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

const Google = `<svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 12.2727C24 11.4218 23.9221 10.6036 23.7774 9.81818H12.2449V14.4655H18.8349C18.5455 15.96 17.6772 17.2255 16.3748 18.0764V21.0982H20.3488C22.6642 19.0036 24 15.9273 24 12.2727Z"
              fill="#4285F4"
            />
            <path
              d="M12.2449 24C15.551 24 18.3228 22.9309 20.3488 21.0982L16.3748 18.0764C15.2839 18.7964 13.8924 19.2327 12.2449 19.2327C9.06122 19.2327 6.35622 17.1273 5.38776 14.2909H1.31354V17.3891C3.32839 21.3055 7.45826 24 12.2449 24Z"
              fill="#34A853"
            />
            <path
              d="M5.38776 14.28C5.14286 13.56 4.99814 12.7964 4.99814 12C4.99814 11.2036 5.14286 10.44 5.38776 9.72V6.62182H1.31354C0.478664 8.23636 0 10.0582 0 12C0 13.9418 0.478664 15.7636 1.31354 17.3782L4.48609 14.9564L5.38776 14.28Z"
              fill="#FBBC05"
            />
            <path
              d="M12.2449 4.77818C14.0482 4.77818 15.6512 5.38909 16.9314 6.56727L20.4379 3.13091C18.3117 1.18909 15.551 0 12.2449 0C7.45826 0 3.32839 2.69455 1.31354 6.62182L5.38776 9.72C6.35622 6.88364 9.06122 4.77818 12.2449 4.77818Z"
              fill="#EA4335"
            />
          </svg>`;

export const ICON_PICKER = {
  BURGER,
  DOWNLOAD,
  LOGO,
  RS,
  Google,
  ARROW_DOWN,
} as const;
