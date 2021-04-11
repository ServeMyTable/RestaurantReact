import React from 'react';
import Logo from '../../assets/logo.png';

function QRCodesSVG({codes,i,Phone,RestaurantName}){

  return(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="519"
      height="1080"
      viewBox="0 0 519 1080"
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#ffe812"></stop>
          <stop offset="1" stopColor="#fffc00"></stop>
        </linearGradient>
        <pattern
          id="pattern"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 296 244"
        >
          <image
            width="296"
            height="244"
            xlinkHref={Logo}
          ></image>
        </pattern>
        <clipPath id="clip-QRCodes">
          <path d="M0 0H519V1080H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-QRCodes)">
        <path fill="url(#linear-gradient)" d="M0 0H519V1080H0z"></path>
        <path
          fill="#fff"
          d="M238 0h237v814a238 238 0 01-238 238H0V238A238 238 0 01238 0z"
          data-name="Rectangle 98"
          transform="translate(22 14)"
        ></path>
        <g transform="translate(0 -94)">
          <text
            fontFamily="NotoSans, Noto Sans"
            fontSize="15"
            transform="translate(184 1138)"
          >
            <tspan x="0" y="0">
              www.servemytable.in
            </tspan>
          </text>
          <text
            data-name="Serve My Table"
            fontFamily="NotoSans, Noto Sans"
            fontSize="26"
            transform="translate(260 1114)"
          >
            <tspan x="-91.641" y="0">
              Serve My Table
            </tspan>
          </text>
          <path
            fill="url(#pattern)"
            d="M0 0H68V56H0z"
            transform="translate(226 1036)"
          ></path>
        </g>
        <image
          width="363"
          height="363"
          transform="translate(78 347)"
          xlinkHref={codes}
        ></image>
        <text
          data-name="SMT's Kitchen"
          fontFamily="NotoSans, Noto Sans"
          fontSize="29"
          transform="translate(78 135)"          
        >  
          {RestaurantName.length > 23 ?
            <tspan>
            <tspan x="3.825" y="31">
              {RestaurantName.slice(0,23)}
            </tspan>
            <tspan x="3.825" y="70">
              {RestaurantName.slice(23)}
            </tspan>
            </tspan>
            :
            <tspan x="85.869" y="31">
            {RestaurantName}
            </tspan>
          }
          
        </text>
        <text
          stroke="#707070"
          strokeWidth="1"
          data-name="Steps 1. Visit guest.servemytable.com 2. Scan this QR code 3. Place Order"
          fontFamily="NotoSans-Bold, Noto Sans"
          fontSize="22"
          fontWeight="700"
          transform="translate(78 747)"
        >
          <tspan x="0" y="0">
            Steps{" "}
          </tspan>
          <tspan fontFamily="NotoSans, Noto Sans" fontWeight="400">
            <tspan x="0" y="60">
              1. Visit guest.servemytable.com
            </tspan>
            <tspan x="0" y="90">
              2. Scan this QR code
            </tspan>
            <tspan x="0" y="120">
              3. Place Order
            </tspan>
          </tspan>
        </text>
        <g transform="translate(-2 -13)">
          <text
            data-name="9730525275"
            fontFamily="NotoSans, Noto Sans"
            fontSize="22"
            transform="translate(105 309)"
          >
            <tspan x="0" y="0">
              {Phone}
            </tspan>
          </text>
          <text
            data-name="Table No. 1"
            fontFamily="NotoSans, Noto Sans"
            fontSize="22"
            transform="translate(304 309)"
          >
            <tspan x="0" y="0">
              Table No. {i}
            </tspan>
          </text>
          <image
            width="64"
            height="64"
            transform="translate(330 228)"
            xlinkHref="data:image/png;base64,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"
          ></image>
          <image
            width="32"
            height="32"
            transform="translate(145 244)"
            xlinkHref="data:image/png;base64,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"
          ></image>
        </g>
      </g>
    </svg>
	);
}

export default QRCodesSVG;