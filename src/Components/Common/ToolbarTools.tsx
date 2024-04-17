import { Tooltip } from 'antd';
import React from 'react'

const ToolbarTools = ({ handleSignatureClick, activeMode, currentColor, handleDateClick, handleTextClick }: { handleSignatureClick?: any; activeMode?: any; currentColor?: any; handleDateClick?: any; handleTextClick?: any; }) => {
    return (
        <>
            {/* signature component  */}
            <Tooltip title={<p>Signature<span>S</span></p>} overlayClassName='primary-tooltip' trigger={'hover'} >
                <div onClick={handleSignatureClick} className={`justify-center cursor-pointer tools-inactive ${activeMode == 'signature' ? 'active-mode-outline' : ''}`} style={{ border: activeMode == 'signature' ? `2px solid ${currentColor?.primary}` : `0.8px solid #d0d3d9`, background: activeMode == 'signature' ? `${currentColor?.ter}` : `#fff` }}>
                    <svg width="25" height="25" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5269 3.96456C16.7201 2.77125 18.6549 2.77125 19.8482 3.96458C21.0415 5.15789 21.0415 7.09264 19.8482 8.28595L18.2589 9.87529L18.3661 9.98254C19.3424 10.9588 19.3424 12.5418 18.3661 13.5181L16.567 15.3172C16.3229 15.5614 15.9271 15.5614 15.683 15.3172C15.439 15.0731 15.439 14.6775 15.683 14.4334L17.4822 12.6342C17.9704 12.146 17.9704 11.3546 17.4822 10.8664L17.375 10.7592L9.06695 19.0672C8.98685 19.1472 8.88649 19.2041 8.7766 19.2316L3.7766 20.4816C3.5553 20.5369 3.32142 20.4673 3.16644 20.2999C3.01145 20.1325 2.95995 19.894 3.03209 19.6776L4.59459 14.9901C4.62527 14.8981 4.67696 14.8144 4.74557 14.7459L15.5269 3.96456ZM18.9644 4.84845C18.2591 4.14329 17.1159 4.14329 16.4107 4.84845L5.73379 15.5254L4.57797 18.9928L8.30549 18.0609L18.9644 7.40206C19.6695 6.6969 19.6695 5.55361 18.9644 4.84845Z" fill={activeMode == 'signature' ? currentColor?.primary : '#4E5461'} stroke={activeMode == 'signature' ? currentColor?.primary : '#4E5461'} />
                        <path d="M4.52148 21.5839C4.54258 21.5995 4.56391 21.6151 4.58545 21.6309C5.51385 22.306 6.89023 23.0004 8.62493 23.0004C9.55368 23.0004 10.4044 22.6754 11.1608 22.2446C11.9143 21.8155 12.615 21.2571 13.2378 20.7511L13.3841 20.6321C13.9638 20.1604 14.4607 19.7561 14.9188 19.4861C15.4228 19.1891 15.7239 19.1506 15.9273 19.2184C16.2587 19.3289 16.4481 19.5844 16.7762 20.6799C16.8854 21.0445 17.0803 21.4434 17.3654 21.7636C17.6511 22.0846 18.0761 22.3755 18.6249 22.3755C19.2177 22.3755 19.8039 22.0902 20.2567 21.8232C20.5549 21.6472 20.8756 21.4269 21.1354 21.2481C21.2632 21.1602 21.3764 21.0824 21.4651 21.0249C21.8001 20.8076 22.0823 20.667 22.2756 20.5822C22.3721 20.54 22.4462 20.5116 22.4934 20.4947C22.5169 20.4862 22.5338 20.4807 22.5432 20.4776L22.5518 20.475C22.8816 20.3777 23.0711 20.0321 22.9752 19.7015C22.8792 19.37 22.5313 19.1795 22.1998 19.2756L22.1983 19.276L22.1951 19.277L22.1861 19.2796L22.1593 19.2881C22.1376 19.2951 22.1082 19.305 22.0718 19.318C21.9991 19.3441 21.8979 19.383 21.7736 19.4375C21.5249 19.5465 21.1822 19.7185 20.7848 19.9761C20.6383 20.0711 20.4982 20.168 20.3569 20.2656C20.1258 20.4254 19.8913 20.5875 19.6217 20.7465C19.1948 20.9982 18.8586 21.1255 18.6249 21.1255C18.5488 21.1255 18.4376 21.0881 18.2991 20.9325C18.1598 20.776 18.0422 20.55 17.9737 20.3211C17.6737 19.3199 17.3493 18.3749 16.3226 18.0326C15.5883 17.7877 14.8739 18.0617 14.2842 18.4092C13.7398 18.73 13.1684 19.1955 12.6123 19.6485L12.4496 19.781C11.8224 20.2905 11.1949 20.7867 10.5422 21.1584C9.89232 21.5285 9.2587 21.7504 8.62493 21.7504C7.69243 21.7504 6.87991 21.5004 6.20743 21.1624L4.52148 21.5839ZM22.3749 19.8755C22.2009 19.2752 22.1999 19.2755 22.1998 19.2756L22.3749 19.8755Z" fill={activeMode == 'signature' ? currentColor?.primary : '#4E5461'} />
                        <path d="M22.1998 19.2756C22.5313 19.1795 22.8792 19.37 22.9752 19.7015C23.0711 20.0321 22.8816 20.3777 22.5518 20.475L22.5432 20.4776C22.5338 20.4807 22.5169 20.4862 22.4934 20.4947C22.4462 20.5116 22.3721 20.54 22.2756 20.5822C22.0823 20.667 21.8001 20.8076 21.4651 21.0249C21.3764 21.0824 21.2632 21.1602 21.1354 21.2481C20.8756 21.4269 20.5549 21.6472 20.2567 21.8232C19.8039 22.0902 19.2177 22.3755 18.6249 22.3755C18.0761 22.3755 17.6511 22.0846 17.3654 21.7636C17.0803 21.4434 16.8854 21.0445 16.7762 20.6799C16.4481 19.5844 16.2587 19.3289 15.9273 19.2184C15.7239 19.1506 15.4228 19.1891 14.9188 19.4861C14.4607 19.7561 13.9638 20.1604 13.3841 20.6321L13.2378 20.7511C12.615 21.2571 11.9143 21.8155 11.1608 22.2446C10.4044 22.6754 9.55368 23.0004 8.62493 23.0004C6.89023 23.0004 5.51385 22.306 4.58545 21.6309C4.56391 21.6151 4.54258 21.5995 4.52148 21.5839L6.20743 21.1624C6.87991 21.5004 7.69243 21.7504 8.62493 21.7504C9.2587 21.7504 9.89232 21.5285 10.5422 21.1584C11.1949 20.7867 11.8224 20.2905 12.4496 19.781L12.6123 19.6485C13.1684 19.1955 13.7398 18.73 14.2842 18.4092C14.8739 18.0617 15.5883 17.7877 16.3226 18.0326C17.3493 18.3749 17.6737 19.3199 17.9737 20.3211C18.0422 20.55 18.1598 20.776 18.2991 20.9325C18.4376 21.0881 18.5488 21.1255 18.6249 21.1255C18.8586 21.1255 19.1948 20.9982 19.6217 20.7465C19.8913 20.5875 20.1258 20.4254 20.3569 20.2656C20.4982 20.168 20.6383 20.0711 20.7848 19.9761C21.1822 19.7185 21.5249 19.5465 21.7736 19.4375C21.8979 19.383 21.9991 19.3441 22.0718 19.318C22.1082 19.305 22.1376 19.2951 22.1593 19.2881L22.1861 19.2796L22.1951 19.277L22.1983 19.276L22.1998 19.2756ZM22.1998 19.2756C22.1999 19.2755 22.2009 19.2752 22.3749 19.8755L22.1998 19.2756Z" stroke={activeMode == 'signature' ? currentColor?.primary : '#4E5461'} />
                    </svg>
                </div>
            </Tooltip>

            {/* signature component  */}


            {/* date component  */}
            <Tooltip title={<p>Date<span>D</span></p>} overlayClassName='primary-tooltip' trigger={'hover'} >
                <div onClick={handleDateClick} className={`justify-center cursor-pointer tools-inactive ${activeMode == 'date' ? 'active-mode-outline' : ''}`} style={{ border: activeMode == 'date' ? `2px solid ${currentColor?.primary}` : `0.8px solid #d0d3d9`, background: activeMode == 'date' ? `${currentColor?.ter}` : `#fff` }}>
                    <svg width="29" height="29" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33301 10.1667H24.6663" stroke={activeMode == 'date' ? currentColor?.primary : '#4E5461'} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M23.458 5.33325H6.54134C5.874 5.33325 5.33301 5.87424 5.33301 6.54159V23.4583C5.33301 24.1256 5.874 24.6666 6.54134 24.6666H23.458C24.1254 24.6666 24.6663 24.1256 24.6663 23.4583V6.54159C24.6663 5.87424 24.1254 5.33325 23.458 5.33325Z" stroke={activeMode == 'date' ? currentColor?.primary : '#4E5461'} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19.833 2.91675V5.33341" stroke={activeMode == 'date' ? currentColor?.primary : '#4E5461'} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10.167 2.91675V5.33341" stroke={activeMode == 'date' ? currentColor?.primary : '#4E5461'} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </Tooltip>
            {/* date component  */}


            {/* text component  */}
            <Tooltip title={<p>Text<span>T</span></p>} overlayClassName='primary-tooltip' trigger={'hover'} >
                <div onClick={handleTextClick} className={`justify-center cursor-pointer tools-inactive ${activeMode == 'text' ? 'active-mode-outline' : ''}`} style={{ border: activeMode == 'text' ? `2px solid ${currentColor?.primary}` : `0.8px solid #d0d3d9`, background: activeMode == 'text' ? `${currentColor?.ter}` : `#fff` }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Edit / Text">
                            <path id="Vector" d="M11.667 22.1667H16.3337" stroke={activeMode == 'text' ? currentColor?.primary : '#4E5461'} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path id="Vector_2" d="M14 5.83325L14 22.1666" stroke={activeMode == 'text' ? currentColor?.primary : '#4E5461'} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path id="Vector_3" d="M7 6.99992V5.83325L21 5.83325V6.99992" stroke={activeMode == 'text' ? currentColor?.primary : '#4E5461'} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>
                </div>
            </Tooltip>
            {/* text component  */}
        </>
    )
}

export default ToolbarTools