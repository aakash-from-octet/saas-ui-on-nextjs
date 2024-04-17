import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, Input, notification } from 'antd';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from '../../../node_modules/pdfjs-dist/build/pdf.worker.entry';
import { SIGN_PDF, TEXT_PDF, DATE_PDF, EDIT_SIGN } from '@/Components/utils/image-constants';
import NavbarSigner from '@/Components/Common/NavbarSigner';
import { signerOne } from '@/Components/utils/constants';
import moment from 'moment';
import SignatureModal from '@/Components/Modal/SignatureModal';
import axios from 'axios';
import { DEV_BASE_URL} from '@/config';
import { useRouter } from 'next/router';
import { fabric } from 'fabric';
import jsPDF from 'jspdf';
import { BsPersonX } from 'react-icons/bs';
// pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/{pdfjs-version}/pdf.worker.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const { TextArea } = Input;
const MeOthersFlow = () => {
    const [modifiedPdf, setModifiedPdf] = useState(null);
    const [boxforsignees, setBoxforsignees] = useState<any>([]);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [signature, setSignature] = useState(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [finalurlData, seturlData] = useState(null)
    const canvasRefs = useRef([]);
    const [pageHeights, setPageHeights] = useState<any>({});
    const [numPages, setNumPages] = useState(0);
    const [pdfUrl, setPdfUrl] = useState("");
    const [fabricCanvases, setFabricCanvases] = useState({});
    const { query } = useRouter();
    const [loading, setLoading] = useState(true);
    const { urlData } = query as { urlData?: any }
    const { documentId } = query as { documentId?: any }
    // Placeholder for the currently selected sign placeholder
    let currentSignPlaceholderRef = useRef<any>(null);
    console.log(urlData, "urlData")
    useEffect(() => {
        if(window!=undefined)
        {
            sessionStorage.getItem("documentId")
        }
        
      }, [ documentId]);
    const loadPdfDocument = async (pdfUrl) => {
        try {
            console.log(`Loading PDF from URL: ${pdfUrl}`);
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            console.log(`PDF loaded with ${pdf.numPages} pages.`);
            setNumPages(pdf.numPages); 
            setPdfDoc(pdf); 
        } catch (error) {
            console.error(`Error loading PDF document: ${error}`);
        }
    };
const fetchDocumentDetails = async () => {
console.log("function fwtch")
    try {
        
        if (!documentId) return;
        const token = sessionStorage.getItem("accessToken") || "";
        const requestBody={
            documentId:documentId
        }
        const response = await axios.post(`${DEV_BASE_URL}/document`, requestBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        });
       
        if (response.data.success) {
        
           
            const pdfUrl = response.data?.documentUrl;
            setPdfUrl(pdfUrl); 
            loadPdfDocument(pdfUrl);
           
        } else {
            console.error(`Request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching document details:", error);
    } finally {
        setLoading(false);
    }
  };
  useEffect(() => {
    
    if (documentId) {
      fetchDocumentDetails();
    }
  }, [ documentId]);
    
  console.log(urlData,documentId,"hi")
    useEffect(() => {
        if (urlData && documentId) {
            console.log("function sign")
            const fetchSignDetails = async () => {
                try {
                    
                    const response = await axios.get(`${DEV_BASE_URL}/document/sign-placeholders/${urlData}`);
                    const signDetails = response?.data?.message;
                    console.log(signDetails, "placeholders");
                    const nonOwnerSignDetails = signDetails?.filter(detail => !detail.isDocumentOwner);
                    console.log(nonOwnerSignDetails,"gg")
                    setBoxforsignees(nonOwnerSignDetails);

                    
                } catch (error) {
                    console.error('Error fetching sign details:', error);
                    notification.error({
                        message: 'Failed to fetch sign details',
                        description: 'Could not fetch sign details from the server.',
                    });
                }
            };
            fetchSignDetails();
        }
    }, [urlData]);
    useEffect(() => {
        console.log(pdfDoc,"jiijkk")
        if (pdfDoc) {

            renderPdfPages(pdfDoc);
        }
    }, [pdfDoc]);
    const renderPdfPages = async (pdfDoc) => {
        if (!pdfDoc) return;
        const canvasContainer = document.getElementById('canvas-container-main');
        if (!canvasContainer) {
            console.error('Canvas container not found');
            return;
        }
        // canvasContainer.innerHTML = ''; // Clear existing content
        let newFabricCanvases = {};
        for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
            const page = await pdfDoc.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 1.4 });

            const pageContainer = document.createElement('div');
            pageContainer.setAttribute('data-page-number', pageNumber.toString());
            pageContainer.classList.add('pdf-page-container'); // For styling and selection

            // Hidden canvas for PDF rendering
            const hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = viewport.width;
            hiddenCanvas.height = viewport.height;
            const ctx = hiddenCanvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            // Fabric.js canvas setup
            const fabricCanvasEl = document.createElement('canvas');
            fabricCanvasEl.id = `fabric-canvas-${pageNumber}`;
            fabricCanvasEl.width = viewport.width;
            fabricCanvasEl.height = viewport.height;
            // canvasContainer.appendChild(fabricCanvasEl);

            pageContainer.appendChild(fabricCanvasEl); // Append the canvas to the page container
            canvasContainer.appendChild(pageContainer); // Append the page container to the main container

            const fabricCanvas = new fabric.Canvas(fabricCanvasEl.id, {
                width: viewport.width,
                height: viewport.height,
            });
            fabricCanvas.selection = false; //this is to diable group selection
            setPageHeights(prevHeights => ({
                ...prevHeights,
                [pageNumber]: viewport.height
            }));

            // Convert the hidden canvas content to an image and set as background
            const pageImageUrl = hiddenCanvas.toDataURL();
            fabric.Image.fromURL(pageImageUrl, (img) => {
                img.set({
                    selectable: false,
                    evented: false,
                });
                fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
            });
            newFabricCanvases[`${pageNumber}`] = fabricCanvas;
            console.log('boxforsignees', boxforsignees);
            // Add placeholders for the current page

            boxforsignees?.forEach((boxhere) => {
                boxhere?.eSignDetails.filter(detail => detail.pageIndex === pageNumber).forEach(detail => {
                    let placeholder;
                    switch (detail.type) {
                        case 'sign':

                            if (boxhere.isSignDone) {
                                // If isSignDone is true, add the signature image
                                fabric.Image.fromURL(detail.src, (img) => {
                                    img.set({
                                        left: detail.x,
                                        top: detail.y,
                                        scaleX: 0.5,
                                        scaleY: 0.5,
                                        selectable: false,
                                        evented: false, // This makes the image non-interactive
                                    });
                                    fabricCanvas.add(img);
                                });
                            } else {

                                placeholder = new fabric.Rect({
                                    left: detail.x,
                                    top: detail.y,
                                    width: 202,
                                    height: 62,
                                    // fill: '#D9F1E7',
                                    fill: 'transparent',
                                    // stroke: '#419E78', //Set border color
                                    strokeWidth: 1,
                                    selectable: true,
                                    hasControls: false, // Disable resizing
                                    hasBorders: false,
                                    lockRotation: true, // Disable rotation
                                    // cornerColor: '#419E78',
                                    // borderColor: '#419E78',
                                    lockMovementX: true,
                                    lockMovementY: true,
                                    type: 'sign',
                                });
                                // Add an event listener for the 'mouse:up' event on the placeholder
                                placeholder.on('selected', () => {
                                    currentSignPlaceholderRef.current = placeholder; // Store the current placeholder
                                    openSignatureModal(); // Open the modal
                                });
                            }
                            break;
                        case 'date':
                            placeholder = new fabric.Text(moment().format('DD/MM/YYYY'), {
                                left: detail.x,
                                top: detail.y,
                                width: 150,
                                height: 40,
                                // styles: { width: 150, height: 40, border:'1px solid #000' },
                                fontSize: 20,
                                selectable: true,
                                hasControls: false, // Disable resizing
                                hasBorders: false,
                                lockRotation: true, // Disable rotation
                                lockMovementX: true, // Disable horizontal dragging
                                lockMovementY: true, // Disable vertical dragging
                                // borderColor: '#419E78', // Set border color
                                // cornerColor: '#419E78', // Set corner color
                                // backgroundColor: '#D9F1E7', // Set background color if needed
                            });
                            break;
                        case 'text':
                            placeholder = new fabric.IText('Enter text here', {
                                left: detail.x,
                                top: detail.y,
                                fontSize: 20,
                                width: 200,
                                height: 80,
                                // backgroundColor: '#D9F1E7',
                                // textBackgroundColor: '#D9F1E7',
                                selectable: true,
                                hasControls: false, // Disable resizing
                                hasBorders: false,
                                lockRotation: true, // Disable rotation
                                // cornerColor: '#419E78',
                                // borderColor: '#419E78',
                                lockMovementX: true,
                                lockMovementY: true,
                            });
                            break;
                        // Handle other types as needed
                    }
                    if (placeholder) {
                        fabricCanvas.add(placeholder);
                    }
                });
            });


            // Ensure Fabric.js canvas is rendered
            fabricCanvas.renderAll();
        }
        setFabricCanvases(newFabricCanvases);
    };

    console.log(boxforsignees,"signData")
    //    to save the signature 
    const openSignatureModal = () => setIsSignatureModalOpen(true);
    const closeSignatureModal = () => setIsSignatureModalOpen(false);
    // Assuming `fabricCanvases` is an object that stores references to all your fabric canvases
    // and that you have a way to tag or identify signature placeholders
    const saveSignature = (signatureData) => {
        setSignature(signatureData); // Store the signature globally.
        console.log('fabricCanvases', fabricCanvases)
        Object.values(fabricCanvases).forEach((canvas: any) => {
            console.log('canvas222', canvas)
            const signPlaceholders = canvas.getObjects().filter(obj => obj.type === 'sign');
            signPlaceholders.forEach(placeholder => {
                fabric.Image.fromURL(signatureData, (signatureImage) => {

                    const scaleX = 200 / signatureImage.width;    //     placeholder.width / signatureImage.width, change it here based on height and width from API
                    const scaleY = 60 / signatureImage.height;
                    const scaleToFit = Math.min(scaleX, scaleY);
                    signatureImage.set({
                        left: placeholder.left + 8,
                        top: placeholder.top + 2,
                        padding: 10,
                        scaleX: scaleToFit,
                        scaleY: scaleToFit,
                        originX: 'left',
                        originY: 'top',
                        hasControls: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        lockRotation: true,
                        selectable: false,
                        // strokeWidth: 1,
                        // stroke: '#419E78',
                        // width: 200,
                        // height: 60
                    });
                    // Remove the placeholder and add the signature image in its place.
                    canvas.remove(placeholder);
                    canvas.add(signatureImage);
                    canvas.renderAll();
                }, { crossOrigin: 'anonymous'});
            });
        });
        // Close the modal after updating all placeholders.
        setIsSignatureModalOpen(false);
    };

    const updatePdfWithSignature = async () => {
        const pdf = new jsPDF("portrait", "px", "a4");
        for (let pageNumber = 1; pageNumber <= pdfDoc?.numPages; pageNumber++) {
            const activeCanvas = fabricCanvases[pageNumber];
            console.log(fabricCanvases, "activecanvas")
            if (activeCanvas) {
                const canvasDataUrl = activeCanvas.toDataURL({
                    format: "pdf",
                    quality: 1.0,
                });
                console.log(canvasDataUrl, "canvasdataurl");
                if (pageNumber !== 1) {
                    pdf.addPage();
                }
                pdf.addImage(
                    canvasDataUrl,
                    "pdf",
                    0,
                    0,
                    pdf.internal.pageSize.width,
                    pdf.internal.pageSize.height
                );
            }
        }
        // Use output to get the Blob
        const blob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(blob);

        sessionStorage.setItem("modifiedPdfurl", pdfUrl);
        // pdf.save('modified-doceeeee');
        setModifiedPdf(pdfUrl);
        console.log("modifiedPdf", pdfUrl);
    };

    console.log(modifiedPdf, "modifiedPdf"
    );


    useEffect(() => {
        console.log('boxforsignees1', boxforsignees);
    }, []);

    //function to calculate the editing options height in diff pages
    const calculateTopPosition = (pageNumber, boxTop) => {
        console.log('now pagenumber is')
        let totalHeight = 0;
        for (let i = 1; i < pageNumber; i++) {
            totalHeight += pageHeights[i] || 0;
        }
        const extraSpace = (pageNumber - 1) * 24; // value based on actual space between pages
        return totalHeight + boxTop - 45 + extraSpace; // 45 is the offset
    };

    const signerPlaceholders = boxforsignees?.filter(signee => !signee.isSignDone)?.map(signee => {
        return {
            ...signee
        };
    });
    const signerName = signerPlaceholders[0]?.name;

    console.log('signeesWithSignDoneFalse', signerPlaceholders);



    return (
        <div>
            <NavbarSigner
                generateAndSetModifiedPdf={updatePdfWithSignature}
                modifiedPdf={modifiedPdf && modifiedPdf}
                urlData={urlData}
            />
            <div className='justify-center' style={{ padding: '34px', background: '#f1f4fc' }}>
                <div id='canvas-container-main' style={{ position: 'relative' }}>

                    {signerPlaceholders && signerPlaceholders[0]?.eSignDetails?.map((box, index) => {
                        console.log(`rendered at `, box);
                        return (
                            <>
                                <div key={index} style={{
                                    left: `${box.x}px`, // Use dynamic values from `box` for positioning
                                    top: `${box.y}px`,
                                    height: '62px',
                                    width: '202px',
                                    position: 'absolute', // This positions the divs absolutely within `#canvas-container-main`
                                    // background: '#D9F1E7',
                                }}
                                    className='outline-boxes'
                                >
                                </div>
                                <div className='outline-boxes-title div-row align-start gap-4'
                                    style={{
                                        left: `${box.x}px`,
                                        top: `${box.y - 13}px`,
                                        position: 'absolute',
                                        fontSize: 10,
                                        fontWeight: 500,
                                        color: '#419E78',
                                        zIndex: 2,
                                    }}
                                >
                                    {signerName + "'s " + box.type + ' ' + 'here'}

                                    {box.type == 'sign' && (<Image
                                        src={EDIT_SIGN.src}
                                        preview={false}
                                        height={20}
                                        width={20}
                                        alt="edit"
                                        className="signer-edit-sign"
                                        onClick={(box) => {
                                            currentSignPlaceholderRef.current = box;
                                            openSignatureModal();
                                        }}
                                    />)

                                    }
                                </div>
                            </>
                        )
                    }
                    )}
                </div>

            </div>
            <SignatureModal
                isOpen={isSignatureModalOpen}
                onClose={closeSignatureModal}
                onSaveSignature={saveSignature}
                // editingSignature={signature}
                signatures={signature}
                setSignatures={setSignature}
            // setEditingSignature={setSignature}
            />
            {/* Additional components like modals for capturing signature, text input, etc. */}
        </div>
    );
};
export default MeOthersFlow;