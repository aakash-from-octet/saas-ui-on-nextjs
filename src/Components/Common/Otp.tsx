import React, { useState } from "react";
import OtpInput from 'react-otp-input';

export default function OtpComponent({ OTP, setOTP }) {



    return (
        <>
            <OtpInput
                inputStyle="otp-inputs otp-input-lg"
                containerStyle={{ justifyContent: 'space-between', gap: '12px' }}
                value={OTP} onChange={setOTP}
                numInputs={6}
                renderInput={(props) => <input {...props} />}
            />

        </>
    )

}