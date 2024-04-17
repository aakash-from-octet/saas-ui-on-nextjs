import { Button, Divider, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Tabs } from 'antd';
import SignatureCanvas from 'react-signature-canvas';
import { BLACK_PEN, BLUE_PEN, CLEAR_CANVAS, DRAW_SA, DRAW_SI, MODAL_CLOSE, RED_PEN, TEXT_SA, TEXT_SI, UNDO_CANVAS, UPLOAD_SA, UPLOAD_SI } from '@/Components/utils/image-constants';
import DragDrop from '../Common/DragDrop';
import FontType from '../Common/FontType';

interface SignatureModalProps {
    isOpen?: any;
    onClose?: any;
    onSaveSignature?: any;
    editingSignature?: any;
    signatures?: any;
    setSignatures?: any;
    setEditingSignature?: any;
}
const { TabPane } = Tabs;
const SignatureModal = ({
    isOpen, onClose, onSaveSignature, editingSignature, signatures, setSignatures, setEditingSignature }: SignatureModalProps) => {

    const sigPad = useRef<any>({});
    const [lines, setLines] = useState([]);

    const [selectedPen, setSelectedPen] = useState('#2b313f');
    const [typedSignature, setTypedSignature] = useState('');
    const [uploadedSignature, setUploadedSignature] = useState<any>(null); // State for uploaded signature
    const [activeTab, setActiveTab] = useState('1');
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [activeFontFamily, setActiveFontFamily] = useState("Dancing Script")

    useEffect(() => {
        setActiveTab('1');
    }, [isOpen])

    const handleTypedSignatureChange = (e) => {
        const newValue = e.target?.value;
        setTypedSignature(newValue);
        console.log('here types 35', e.target.value);
        if (activeTab === '3') {
            setIsSaveEnabled(newValue.trim() !== '');
        }
    };


    // Update handleUpload for Upload Tab
    const handleUpload = (uploadedImage) => {
        setUploadedSignature(uploadedImage);
        if (activeTab === '2') {
            setIsSaveEnabled(true); // Enable Save Button if on Upload Tab
        }
    };


    const handleTabChange = (key) => {
        setActiveTab(key);
        clearCanvas(); //reset the canvas clear
        setTypedSignature(''); //reset the typed signature
        setUploadedSignature(null); //reset the upload tab

        // setIsSaveEnabled(false); // Reset Save Button when changing tabs
        // Check if there is any value in the typed signature when the 'Type' tab is selected
        // const isInputNotEmpty = typedSignature.trim() !== '';
        // Ensure typedSignature is defined and is a string before calling .trim()
        const isInputNotEmpty = typedSignature && typeof typedSignature === 'string' && typedSignature.trim() !== '';
        setIsSaveEnabled(key === '3' && isInputNotEmpty);

    };


    // Update handleEnd for Draw Tab
    const handleEnd = () => {
        const data = sigPad.current.toData();
        if (data.length !== lines.length) {
            setLines(data);
            if (activeTab === '1') {
                setIsSaveEnabled(true); // Enable Save Button if on Draw Tab
            }
        }
    };

    const undoLast = () => {
        // Undo the last line drawn
        const newData = lines.slice(0, -1);
        setLines(newData);
        sigPad.current.fromData(newData);
    };

    const clearCanvas = () => {
        // Clear the entire canvas
        sigPad.current.clear();
        setLines([]);
    };

    const getTextSignatureDataUrl = (text, font, maxWidth, maxHeight) => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Initial font size
        let fontSize = 100; // Start with a large font size

        // Set font styles
        ctx.font = `${fontSize}px ${font}`;

        // Measure text
        let textWidth = ctx.measureText(text).width;

        // Adjust font size and canvas width to fit text
        while (textWidth > maxWidth && fontSize > 10) {
            fontSize -= 5; // Decrease font size
            ctx.font = `${fontSize}px ${font}`;
            textWidth = ctx.measureText(text).width;
        }

        // Set canvas dimensions
        canvas.width = Math.min(maxWidth, textWidth + 40); // Add some padding
        canvas.height = maxHeight;

        // Calculate text position
        const textX = canvas.width / 2;
        const textY = canvas.height / 2;

        // Set font again with adjusted size
        ctx.font = `${fontSize}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        canvas.style.objectFit = 'cover';

        // Draw text
        ctx.fillText(text, textX, textY);

        // Convert to data URL
        return canvas.toDataURL();
    };


    const saveModalSignature = () => {
        let signatureData;

        // Determine the source of the signature data based on the active tab
        if (activeTab === '1' && sigPad.current) { // If the active tab is Draw
            signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
        } else if (activeTab === '2' && uploadedSignature) { // If the active tab is Upload
            signatureData = uploadedSignature;
        } else if (activeTab === '3') {
            signatureData = getTextSignatureDataUrl(typedSignature, activeFontFamily, 500, 200); // Use the font and dimensions as per your requirement
        }

        // Check if there is signature data to save
        if (signatureData) {
            console.log(editingSignature, 'editingSignature');
            if (editingSignature >= 0) {
                // Replace the specific edited signature
                setSignatures(prevSignatures => {
                    console.log(prevSignatures, 'prevSignatures')
                    return Object.keys(prevSignatures).reduce((acc, page) => {
                        const updatedPageSignatures = prevSignatures[page].map(signature => {
                            if (signature.id === editingSignature.id) {
                                return { ...signature, imageData: signatureData };
                            }
                            return signature;
                        });
                        return { ...acc, [page]: updatedPageSignatures };
                    }, {});
                });

                onSaveSignature(signatureData);
                setEditingSignature(null);

            } else {
                // Save new signature
                console.log('Signature data is', signatureData);
                onSaveSignature(signatureData);
            }
            onClose(); // Close the modal
        } else {
            console.log('No signature data to save');
            // Optionally, provide user feedback that no signature was created
        }
    };






    if (!isOpen) return null;
    return (
        <Modal
            centered
            title={<p className='text-16 font-600 text-p'>Your Signature</p>}
            closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={onClose} />}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" disabled={!isSaveEnabled} type="primary" onClick={saveModalSignature}>
                    Save
                </Button>,
            ]}
        >
            <div className='modal-content-details'>
                <Tabs defaultActiveKey="1" className='auth-tab align-center' onChange={handleTabChange}>
                    <TabPane
                        className='business-info-tabsouter'
                        tab={
                            <div className='div-row gap-8 align-center'>
                                <Image src={activeTab == '1' ? DRAW_SA.src : DRAW_SI.src} alt="sign" preview={false} />
                                <p className={`text-12 ${activeTab == '1' ? 'text-gray' : 'text-gray400'}`}>Draw</p>
                            </div>}
                        key="1"
                    >
                        <div className="signature-modal">
                            <SignatureCanvas
                                ref={sigPad}
                                penColor={selectedPen}
                                canvasProps={{ width: 450, height: 200, className: 'sigCanvas' }}
                                onEnd={handleEnd}
                            />
                            <div className='space-between sign-canvas-options'>
                                <div className='div-row gap-12 align-center'>
                                    <Image src={BLUE_PEN.src} alt="blue" preview={false} onClick={() => setSelectedPen('#4277fd')} className={`cursor-pointer ${selectedPen == '#4277fd' && 'blue-cborder'}`} />
                                    <Image src={RED_PEN.src} alt="red" preview={false} onClick={() => setSelectedPen('#db5858')} className={`cursor-pointer ${selectedPen == '#db5858' && 'red-cborder'}`} />
                                    <Image src={BLACK_PEN.src} alt="black" preview={false} onClick={() => setSelectedPen('#2b313f')} className={`cursor-pointer ${selectedPen == '#2b313f' && 'black-cborder'}`} />
                                    <Divider type="vertical" className='border-gray mt-5' />
                                    <Image src={UNDO_CANVAS.src} alt="undo" preview={false} onClick={undoLast} className='cursor-pointer' />
                                    <Image src={CLEAR_CANVAS.src} alt="clear" preview={false} onClick={clearCanvas} className='cursor-pointer' />
                                </div>
                                {/* <p className='text-12 font-500 text-link cursor-pointer'>Draw on mobile</p> */}
                            </div>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={
                            <div className='div-row gap-8 align-center'>
                                <Image src={activeTab == '2' ? UPLOAD_SA.src : UPLOAD_SI.src} alt="sign" preview={false} />
                                <p className={`text-12 ${activeTab == '2' ? 'text-gray' : 'text-gray400'}`}>Upload</p>
                            </div>}
                        key="2">
                        <DragDrop onUpload={handleUpload} />
                    </TabPane>
                    <TabPane
                        tab={
                            <div className='div-row gap-8 align-center'>
                                <Image src={activeTab == '3' ? TEXT_SA.src : TEXT_SI.src} alt="sign" preview={false} />
                                <p className={`text-12 ${activeTab == '3' ? 'text-gray' : 'text-gray400'}`}>Type</p>
                            </div>}
                        key="3">
                        <FontType
                            activeFontFamily={activeFontFamily}
                            setActiveFontFamily={setActiveFontFamily}
                            onTypedSignatureChange={handleTypedSignatureChange}
                            typedSignature={typedSignature} // Pass the current typedSignature as a prop
                        />
                    </TabPane>
                </Tabs>
            </div>
        </Modal>
    );
};
export default SignatureModal;
