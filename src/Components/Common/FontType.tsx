import React, { useState } from "react";
import { Col, Input, Row } from "antd";
import dynamic from 'next/dynamic';

const FontPicker: any = dynamic(() => import('font-picker-react'), { ssr: false });

const FontType = ({ onTypedSignatureChange, activeFontFamily, setActiveFontFamily, typedSignature }) => {

    const displayText = typedSignature.trim() !== '' ? typedSignature : 'Your Signature';

    return (
        <div>
            <FontPicker
                apiKey="AIzaSyC_1DzvhwgQ-jQhasHu8q0XG8fNy-NlFI0"
                activeFontFamily={activeFontFamily}
                onChange={(nextFont) => setActiveFontFamily(nextFont.family)}
                families={[
                    "Dancing Script", "Indie Flower", "Hurricane",
                    "Great Vibes", "Yellowtail", "Homemade Apple",
                    "Alex Brush", "Reenie Beanie", "Mrs Saint Delafield"
                ]}
            />
            <Input
                type="text"
                className="apply-font font-changing-container mb-20"
                placeholder="Your Signature"
                value={typedSignature}
                onChange={onTypedSignatureChange}
                style={{ fontFamily: 'Arial'}}                
            />
            <div className="all-fonts-container">
                <Row gutter={[32, 32]} justify="space-between" align={"middle"}>
                    {["Dancing Script", "Indie Flower", "Hurricane",
                        "Great Vibes", "Yellowtail", "Homemade Apple",
                        "Alex Brush", "Reenie Beanie", "Mrs Saint Delafield"].map((fontFamily) => (
                            <Col span={8} key={fontFamily}>
                                <p
                                    className={`font-details ${activeFontFamily === fontFamily && 'selected-font-family'} font-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`}
                                    onClick={() => setActiveFontFamily(fontFamily)}
                                    style={{ fontFamily }}
                                >
                                    {displayText}
                                </p>
                            </Col>
                        ))}
                </Row>
            </div>
        </div>
    );
}

export default FontType;
