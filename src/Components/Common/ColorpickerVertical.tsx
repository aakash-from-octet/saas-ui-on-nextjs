import { Image, Select } from 'antd'
import React, { useState } from 'react'
import { BLACK_PEN, BLUE_PEN, DOWN_ARROW_SM, RED_PEN } from '@/Components/utils/image-constants';

const ColorpickerVertical = ({ selectedTextColor, setSelectedTextColor }) => {
    // const [selectedColor, setSelectedColor] = useState('#4277fd');
    return (
        <div>
            <Select
                bordered={false}
                defaultValue="#2b313f"
                onChange={(value: string) => {
                    console.log(`selected ${value}`);
                    setSelectedTextColor(value);
                }}
                className='color-picker-vertical'
                popupClassName='color-picker-popup'
                value={selectedTextColor}
                suffixIcon={<Image src={DOWN_ARROW_SM.src} preview={false} alt="color" />}
                options={
                    [
                        {
                            value: '#4277fd',
                            label: (<Image src={BLUE_PEN.src} alt="blue" preview={false} className={`cursor-pointer mb-2 border-w`} />)
                        },
                        {
                            value: '#db5858',
                            label: (<Image src={RED_PEN.src} alt="red" preview={false} className={`cursor-pointer mb-2 border-w`} />)
                        },
                        {
                            value: '#2b313f',
                            label: (<Image src={BLACK_PEN.src} alt="black" preview={false} className={`cursor-pointer mb-2 border-w`} />)
                        },
                    ]}
            />
        </div>
    )
}

export default ColorpickerVertical