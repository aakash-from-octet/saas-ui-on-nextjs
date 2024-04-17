import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = ({ value, onChange }) => {

    const [mobileNumber, setmobileNumber] = useState('');
    const [countryCode, setCountryCode] = useState('');


    const handlePhoneChange = (value: string, country: any) => {
        setmobileNumber(value);
        setCountryCode(`+${country.dialCode}`);
    };
    const extractPhoneNumber = (fullNumber: any, countryCode: any) => {
        const cleanFullNumber = fullNumber.replace(/[^0-9]+/g, "");
        const cleanCountryCode = countryCode.replace(/[^0-9]+/g, "");
        if (cleanFullNumber.startsWith(cleanCountryCode)) {
            return cleanFullNumber.substring(cleanCountryCode.length);
        }
        return fullNumber;
    };

    const actualPhoneNumber = extractPhoneNumber(mobileNumber, countryCode);


    return (
        <div>
            <PhoneInput
                country={'in'}
                value={value}
                onChange={onChange}
                inputStyle={{ width: "100%" }}
                placeholder='+91 98936-79000'
                containerClass='phone-input-custom'
                inputClass='phone-input-custominput'
            />
        </div>
    )
}

export default PhoneNumberInput;








