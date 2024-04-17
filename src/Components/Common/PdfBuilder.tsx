import React, { useEffect, useRef, useState } from "react";
import { Col, Image, Row, Select, Tooltip } from "antd";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import jsPDF from "jspdf";

import NavbarSec from "@/Components/Common/NavbarSec";
import ColorpickerVertical from "@/Components/Common/ColorpickerVertical";
import {
  COPY_ELEMENT,
  DEL_SIGN,
  DOWN_ARROW_SM,
  EDIT_SIGN,
  PREV_PAGE,
  NEXT_PAGE,
  ZOOM_IN,
  ZOOM_OUT,
  STAMP,
  FIT,
} from "@/Components/utils/image-constants";

import SignatureModal from "@/Components/Modal/SignatureModal";
import SelectedSigneeOption from "@/Components/Common/SelectedSigneeOption";
import ToolbarTools from "@/Components/Common/ToolbarTools";
import AddRecipients from "@/Components/Modal/AddRecipients";
import { useSelector } from "react-redux";
import ElementSigneeSelect from "@/Components/Common/ElementSigneeSelect";
import NavbarBuilder from "@/Components/Common/NavbarBuilder";
import axios from "axios";
import { DEV_BASE_URL } from "@/config";
import ProductSigneeSelection from "@/Components/Common/ProductSigneeSelection";

interface Box {
  id: string;
  message: string;
  pageIndex: number;
  selectedSignee: string;
  type: string;
  x: number;
  y: number;
  width: number;
  src?: string;
}
const PdfBuilder = ({
  signers,
  pdfDoc,
  docName,
  fetchDocumentDetails,
  docID,
  product,
  loading,
}: {
  signers?: any;
  pdfDoc?: any;
  fetchDocumentDetails?: any;
  docName?: any;
  docID?: any;
  product?: any;
  loading?: any;
}) => {
  // states for pdf and canvases
  // const [loading, setLoading] = useState(true);
  const [fabricCanvases, setFabricCanvases] = useState({});
  const [pageHeights, setPageHeights] = useState<any>({});
  const defaultEleColor = "#2b313f"; //default black shade for website
  const [modifiedPdf, setModifiedPdf] = useState(null);

  // states for textboxes
  const [focusedTextBoxId, setFocusedTextBoxId] = useState(null);
  const [textboxesInfo, setTextboxesInfo] = useState({});
  const [isTextAddingMode, setIsTextAddingMode] = useState(false);
  const isTextAddingModeRef = useRef(isTextAddingMode);

  // states for dates
  const [isDateAddingMode, setIsDateAddingMode] = useState(false);
  const isDateAddingModeRef = useRef(isDateAddingMode);
  const [dateElements, setDateElements] = useState({});
  const [activeDateareaId, setActiveDateareaId] = useState(null);
  const defaultDateFormat = "MM/DD/YYYY"; // default date format

  //states for signature
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null); //this state to store t he signature
  const signatureImageRef = useRef(null);

  const [signatures, setSignatures] = useState<any>({});
  const [isAddingSignature, setIsAddingSignature] = useState(false);
  const isSignatureModeRef = useRef(isAddingSignature);
  const [focusedSignatureId, setFocusedSignatureId] = useState(null);
  const [isEditingSignature, setIsEditingSignature] = useState(false); // Add this state to track edit mode

  //other states
  const [zoomLevel, setZoomLevel] = useState(1.2);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [boxesForOtherSignees, setBoxesForOtherSignees] = useState<any>({});
console.log(pdfDoc,"pdfnum")
  //toolbar states

  // different color of toolbar

  const [currentColor, setCurrentColor] = useState<any>({
    primary: "#4277FD",
    secondary: "#C5D5FF",
    ter: "#F2F5FF",
  });
  const [esignerEmail, setEsignerEmail] = useState("");
  const [selectedSigneeOption, setSelectedSigneeOption] = useState(null);

  const selectedSigneeOptionRef = useRef(selectedSigneeOption);

  const [activeMode, setActiveMode] = useState<"text" | "date" | "signature">(
    null
  );

  // Pre-map signees to color sets when the component mounts

  //double clicks
  const ignoreNextClickRef = useRef<any>(null);
  const ignoreNextTextClickRef = useRef<any>(null);
  const ignoreNextDateClickRef = useRef<any>(null);

  // to render the pdf file
  useEffect(() => {
    if (pdfDoc) {
      renderPdfPages(pdfDoc);
    } else {
      console.log("ERROR - Pdf is not rendering");
    }
  }, [pdfDoc]);

  //=========================================== functions ====================================================

  //open and close signature modal
  const openSignatureModal = () => {
    const currentSigneeOption = selectedSigneeOptionRef.current;
    if (currentSigneeOption && currentSigneeOption.isDocumentOwner) {
      setIsSignatureModalOpen(true);
    } else {
      setIsAddingSignature(true);
    }
    setActiveMode("signature");
    setIsDateAddingMode(false);
    setIsTextAddingMode(false);
  };

  const closeSignatureModal = () => setIsSignatureModalOpen(false);

  // create a new date element
  useEffect(() => {
    isDateAddingModeRef.current = isDateAddingMode;
  }, [isDateAddingMode]);

  //create a new text element
  useEffect(() => {
    isTextAddingModeRef.current = isTextAddingMode;
  }, [isTextAddingMode]);

  //create a new sign element
  useEffect(() => {
    isSignatureModeRef.current = isAddingSignature;
  }, [isAddingSignature]);

  // Update the enableTextAddingMode function
  const enableTextAddingMode = () => {
    setActiveMode("text");
    setIsTextAddingMode(!isTextAddingMode);
    setIsDateAddingMode(false);
    setIsAddingSignature(false);
  };

  // Update the enableDateAddingMode function
  const enableDateAddingMode = () => {
    setIsDateAddingMode(!isDateAddingMode);
    setActiveMode("date");
    setIsTextAddingMode(false);
    setIsAddingSignature(false);
  };

  // Update the ref whenever selectedSigneeOption changes
  useEffect(() => {
    selectedSigneeOptionRef.current = selectedSigneeOption;
  }, [selectedSigneeOption]);

  //===========================================================================================
  //========================== fetching and rendering pdf
  const signeeData = useSelector(
    (state: any) => state?.signeeType?.signeeType?.document?.eSigners
  );

  const renderPdfPages = async (pdfDoc) => {
    if (!pdfDoc) return;
    const canvasContainer = document.getElementById("canvas-container-main");
    if (!canvasContainer) {
      console.error("Canvas container not found");
      return;
    }
    canvasContainer.innerHTML = ""; // Clear existing canvases if any
    for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
      const page = await pdfDoc.getPage(pageNumber);
      const scale = 1.4;
      const viewport = page.getViewport({ scale: scale });

      // Create a container for each page
      const pageContainer = document.createElement("div");
      pageContainer.setAttribute("data-page-number", pageNumber.toString());
      pageContainer.classList.add("pdf-page-container"); // For styling and selection

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;
      const tempContext = tempCanvas.getContext("2d");
      tempContext.imageSmoothingEnabled = true;
      tempContext.imageSmoothingQuality = "high";
      await page.render({ canvasContext: tempContext, viewport: viewport })
        .promise;

      const pageDataUrl = tempCanvas.toDataURL();
      const htmlCanvasElement = document.createElement("canvas");
      htmlCanvasElement.id = `canvas-${pageNumber}`;
      htmlCanvasElement.width = viewport.width;
      htmlCanvasElement.height = viewport.height;

      pageContainer.appendChild(htmlCanvasElement); // Append the canvas to the page container
      canvasContainer.appendChild(pageContainer); // Append the page container to the main container

      const fabricCanvas = new fabric.Canvas(htmlCanvasElement.id, {
        preserveObjectStacking: true,
      });
      restrictMovementWithinCanvas(fabricCanvas);

      setPageHeights((prevHeights) => ({
        ...prevHeights,
        [pageNumber]: viewport.height,
      }));

      fabricCanvas.setBackgroundImage(
        pageDataUrl,
        fabricCanvas.renderAll.bind(fabricCanvas),
        {
          originX: "left",
          originY: "top",
          scaleX: 1,
          scaleY: 1,
        }
      );
      fabricCanvases[pageNumber] = fabricCanvas;
      // Add a click event listener to the canvas for adding text and date
      fabricCanvas.on("mouse:down", (options) => {
        if (isTextAddingModeRef.current && !options.target) {
          const pointer = fabricCanvas.getPointer(options.e);
          if (ignoreNextDateClickRef.current == true) {
            ignoreNextDateClickRef.current = false;
            fabricCanvas.defaultCursor = `url(${STAMP.src}), auto`; // Update the canvas cursor
          } else {
            addTextToCanvas(fabricCanvas, pointer.x, pointer.y, pageNumber);
            fabricCanvas.defaultCursor = "default";
            ignoreNextDateClickRef.current = true;
          }
        } else if (isDateAddingModeRef.current && !options.target) {
          const pointer = fabricCanvas.getPointer(options.e);
          if (ignoreNextTextClickRef.current == true) {
            ignoreNextTextClickRef.current = false;
            fabricCanvas.defaultCursor = `url(${STAMP.src}), auto`; // Update the canvas cursor
          } else {
            addDateToCanvas(fabricCanvas, pointer.x, pointer.y, pageNumber);
            fabricCanvas.defaultCursor = "default";
            ignoreNextTextClickRef.current = true;
          }
        } else if (isSignatureModeRef.current && !options.target) {
          const pointer = fabricCanvas.getPointer(options.e);
          if (ignoreNextClickRef.current == true) {
            ignoreNextClickRef.current = false;
            fabricCanvas.defaultCursor = `url(${STAMP.src}), auto`; // Update the canvas cursor
          } else {
            addSignatureToCanvas(fabricCanvas, pointer, pageNumber);
            fabricCanvas.defaultCursor = "default";
            ignoreNextClickRef.current = true;
          }
        }
      });

      setFabricCanvases(fabricCanvases);
      setupIntersectionObserver();
    }
  };

  //function to calculate the editing options height in diff pages
  const calculateTopPosition = (pageNumber, boxTop) => {
    console.log("now pagenumber is");
    let totalHeight = 0;
    for (let i = 1; i < pageNumber; i++) {
      totalHeight += pageHeights[i] || 0;
    }
    const extraSpace = (pageNumber - 1) * 24; // value based on actual space between pages
    return totalHeight + boxTop - 45 + extraSpace; // 45 is the offset
  };

  //========================================== DATE =================================================

  //function to add date in fabric canvas
  const addDateToCanvas = (canvas, x, y, pageNumber) => {
    const currentSigneeOption = selectedSigneeOptionRef.current;

    if (currentSigneeOption && !currentSigneeOption.isDocumentOwner) {
      // Add a textbox instead of a signature
      addTextboxForNonOwnerDate(canvas, x, y, pageNumber, currentSigneeOption);
    } else {
      const today = new Date();
      const dateString = moment(today).format("DD/MM/YYYY");
      const dateId = `date-${uuidv4()}`; // Generate a unique ID for each date

      console.log(`first x:${x}, y: ${y}`);
      const dateText: any = new fabric.Text(dateString, {
        left: x,
        top: y,
        width: 150,
        height: 40,
        fontSize: 20,
        fill: defaultEleColor,
        borderColor: "#4277FD",
        cornerColor: "#4277FD",
        cornerSize: 6,
        borderScaleFactor: 1,
        hasRotatingPoint: false,
        styles: { position: "relative" },
      });

      dateText.dateId = dateId; // Assign the ID to the Fabric.js object
      dateText.setControlsVisibility({
        mtr: false,
        mt: false,
        mb: false,
        ml: false,
        mr: false,
      });

      dateText.on("selected", () => {
        setActiveDateareaId(dateId); // Update active date element on selection
      });

      dateText.on("moving", () => {
        updateDateBoxPosition(dateId, dateText.left, dateText.top);
      });
      dateText.on("modified", () => {
        updateDateBoxPosition(dateId, dateText.left, dateText.top); // Update position on modification
      });

      canvas.setActiveObject(dateText);
      canvas.add(dateText);
      canvas.renderAll();

      // Update the date elements state
      setDateElements((prev) => ({
        ...prev,
        [dateId]: {
          id: dateId,
          value: dateString,
          format: defaultDateFormat,
          fill: defaultEleColor,
          left: x,
          top: y,
          pageNumber: pageNumber,
          signee: currentSigneeOption && currentSigneeOption, // Store the associated signee
        },
      }));

      // Handle date deselection
      canvas.on("before:selection:cleared", (options) => {
        if (options.target && options.target === dateText) {
          setActiveDateareaId(null); // Clear the focused textbox when it's deselected
        }
      });
    }
  };

  //function to update the position of date element
  const updateDateBoxPosition = (id, left, top) => {
    setDateElements((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        updated[id].left = left;
        updated[id].top = top;
      }
      return updated;
    });
  };

  //function for updating the format of a particular date element using select in editor options
  const handleFormatChange = (value) => {
    let newFormat;
    switch (value) {
      case "DD/MM/YY":
        newFormat = "DD/MM/YYYY";
        break;
      case "MM/DD/YY":
        newFormat = "MM/DD/YYYY";
        break;
      case "MM.DD.YY":
        newFormat = "MM.DD.YYYY";
        break;
      case "DD.MM.YY":
        newFormat = "DD.MM.YYYY";
        break;
      case "YY-MM-DD":
        newFormat = "YYYY-MM-DD";
        break;
      default:
        newFormat = "DD/MM/YYYY";
    }

    if (activeDateareaId && dateElements[activeDateareaId]) {
      const currentDateElement = dateElements[activeDateareaId];
      const momentDate = moment(
        currentDateElement.value,
        currentDateElement.format
      );

      if (momentDate.isValid()) {
        const formattedDate = momentDate.format(newFormat);
        console.log("formattedDate", formattedDate);

        // Find and update the text of the date element on the canvas
        Object.values(fabricCanvases).forEach((canvas: any) => {
          const dateElement = canvas
            .getObjects()
            .find((obj) => obj.dateId === activeDateareaId);
          if (dateElement) {
            dateElement.set("text", formattedDate);
            canvas.renderAll();
          }
        });

        // Update the dateElements state with the new formatted date and format
        setDateElements((prev) => ({
          ...prev,
          [activeDateareaId]: {
            ...prev[activeDateareaId],
            value: formattedDate,
            format: newFormat, // Update the format
          },
        }));
      } else {
        console.error("Invalid date format encountered");
      }
    }
  };

  //function to delete a particular date element
  const handleDeleteDateElement = () => {
    if (activeDateareaId) {
      // Iterate over each canvas in fabricCanvases to find the one with the active date element
      Object.values(fabricCanvases).forEach((canvas: any) => {
        const dateElement = canvas
          .getObjects()
          .find((obj) => obj.dateId === activeDateareaId);
        if (dateElement) {
          canvas.remove(dateElement); // Remove the date element from the canvas
          canvas.renderAll(); // Re-render the canvas

          // Update the dateElements state to remove the deleted element
          setDateElements((prev) => {
            const updatedElements = { ...prev };
            delete updatedElements[activeDateareaId]; // Remove the element with the given id
            return updatedElements;
          });

          setActiveDateareaId(null); // Reset the active date element
        }
      });
    }
  };

  //function to change the color of a particular date element
  const handleDateColorChange = (color) => {
    if (activeDateareaId) {
      // Find the canvas that contains the active date element
      const canvasWithActiveDate: any = Object.values(fabricCanvases).find(
        (canvas: any) =>
          canvas.getObjects().some((obj) => obj.dateId === activeDateareaId)
      );

      if (canvasWithActiveDate) {
        const activeDateElement = canvasWithActiveDate
          .getObjects()
          .find((obj) => obj.dateId === activeDateareaId);
        if (activeDateElement) {
          activeDateElement.set("fill", color); // Update the color
          canvasWithActiveDate.renderAll(); // Re-render the canvas

          // Update the state to reflect the color change
          setDateElements((prev) => ({
            ...prev,
            [activeDateareaId]: {
              ...prev[activeDateareaId],
              fill: color,
            },
          }));
        }
      }
    }
  };

  // Utility function to update boxesForOtherSignees for any element type (text, date, signature)
  const handleDeleteElementAndUpdateBoxes = (
    elementId: string,
    elementType: "textbox" | "date" | "signature"
  ) => {
    // Use type assertion here for canvas as fabric.Canvas
    Object.values(fabricCanvases).forEach((canvas: unknown) => {
      const fabricCanvas = canvas as fabric.Canvas; // Type assertion
      const element = fabricCanvas.getObjects().find((obj) => {
        return obj[elementType + "Id"] === elementId;
      });
      if (element) {
        fabricCanvas.remove(element);
        fabricCanvas.renderAll();
      }
    });

    setBoxesForOtherSignees((prevBoxes) => {
      const updatedBoxes: { [signeeEmail: string]: any[] } = {};
      Object.entries(prevBoxes).forEach(([signeeEmail, boxes]: any) => {
        const remainingBoxes = boxes?.filter(
          (box: any) => box.id !== elementId
        );
        updatedBoxes[signeeEmail] = remainingBoxes;
      });
      return updatedBoxes;
    });

    // Clear the focused element ID based on the element type
    switch (elementType) {
      case "textbox":
        setFocusedTextBoxId(null);
        break;
      case "date":
        setActiveDateareaId(null);
        break;
      case "signature":
        setFocusedSignatureId(null);
        break;
      default:
        break; // Handle other types if necessary
    }
  };

  //========================================== TEXT =================================================

  //function to add text in fabric canvas
  const addTextToCanvas = (canvas, x, y, pageNumber) => {
    const currentSigneeOption = selectedSigneeOptionRef.current;

    if (currentSigneeOption && !currentSigneeOption.isDocumentOwner) {
      // Add a textbox instead of a signature
      addTextboxForNonOwnerText(canvas, x, y, pageNumber, currentSigneeOption);
    } else {
      const textBoxId = `text-box-${uuidv4()}`;
      const textbox: any = new fabric.Textbox("New Text", {
        left: x,
        top: y,
        width: 150,
        fontSize: 20,
        fill: defaultEleColor,
        borderColor: "#4277FD",
        cornerColor: "#4277FD",
        cornerSize: 6,
        borderScaleFactor: 1,
        hasRotatingPoint: false,
        styles: { position: "relative" },
      });
      textbox.textBoxId = textBoxId;
      textbox.setControlsVisibility({ mtr: false, mt: false, mb: false });

      textbox.on("selected", () => {
        setFocusedTextBoxId(textBoxId); // Update focused text box on selection
      });

      textbox.on("moving", () => {
        updateTextboxPosition(textBoxId, textbox.left, textbox.top);
      });

      textbox.on("modified", () => {
        updateTextboxPosition(textBoxId, textbox.left, textbox.top); // Update position on modification
      });

      canvas.setActiveObject(textbox);
      canvas.add(textbox);
      canvas.renderAll();
      // Correct event for Fabric.js version 4.x and above
      textbox.on("changed", () => {
        setTextboxesInfo((prev) => ({
          ...prev,
          [textBoxId]: {
            ...prev[textBoxId],
            content: textbox.text,
          },
        }));
        console.log("textbox.text0", textbox.text); // Debugging line to verify text updates
      });

      // Update the text elements state
      setTextboxesInfo((prev) => ({
        ...prev,
        [textBoxId]: {
          id: textBoxId,
          content: textbox.text,
          left: x,
          top: y,
          width: 150,
          fontSize: 20,
          fill: defaultEleColor,
          pageNumber: pageNumber,
          signee: currentSigneeOption && currentSigneeOption, // Store the associated signee
        },
      }));

      setFocusedTextBoxId(textBoxId);

      // Handle textbox deselection
      canvas.on("before:selection:cleared", (options) => {
        if (options.target && options.target === textbox) {
          setFocusedTextBoxId(null); // Clear the focused textbox when it's deselected
        }
      });
    }
  };

  //function to update the position of text element
  const updateTextboxPosition = (id, left, top) => {
    setTextboxesInfo((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        updated[id].left = left;
        updated[id].top = top;
      }
      return updated;
    });
  };

  // function to handle text color change
  const handleColorChange = (color) => {
    if (focusedTextBoxId) {
      const focusedCanvas: any = Object.values(fabricCanvases).find(
        (canvas: any) =>
          canvas
            .getObjects("textbox")
            .some((textbox) => textbox.textBoxId === focusedTextBoxId)
      );

      if (focusedCanvas) {
        const focusedTextBox = focusedCanvas
          .getObjects("textbox")
          .find((textbox) => textbox.textBoxId === focusedTextBoxId);
        if (focusedTextBox) {
          focusedTextBox.set("fill", color); // Update the color of the text element
          focusedCanvas.renderAll(); // Re-render the canvas

          // Update the state to reflect the color change
          setTextboxesInfo((prev) => ({
            ...prev,
            [focusedTextBoxId]: {
              ...prev[focusedTextBoxId],
              fill: color, // Update the color in the state
            },
          }));
        }
      }
    }
  };

  // function to delete the text element
  const handleDeleteTextElement = () => {
    if (focusedTextBoxId) {
      Object.values(fabricCanvases).forEach((canvas: any) => {
        const textbox = canvas
          .getObjects()
          .find(
            (obj) =>
              obj.type === "textbox" && obj.textBoxId === focusedTextBoxId
          );
        if (textbox) {
          canvas.remove(textbox);
          canvas.renderAll();
        }
      });

      setTextboxesInfo((prevTextboxes) => {
        const updatedTextboxes = { ...prevTextboxes };
        delete updatedTextboxes[focusedTextBoxId];
        return updatedTextboxes;
      });

      // Update boxes for other signees
      setFocusedTextBoxId(null);
    }
  };

  //===================================== SIGN ======================================================

  //function to add signature in fabric canvas
  const addSignatureToCanvas = (canvas, position, pageNumber) => {
    // Check if the selected signee is the document owner
    const currentSigneeOption = selectedSigneeOptionRef.current;

    if (currentSigneeOption && !currentSigneeOption.isDocumentOwner) {
      // Add a textbox instead of a signature
      addTextboxForNonOwner(
        canvas,
        position.x,
        position.y,
        pageNumber,
        currentSigneeOption
      );
    } else {
      if (signatureImageRef.current) {
        const signatureId = signatureImage
          ? signatureImage.id
          : `signature-${uuidv4()}`;

        console.log(`first x:${position.x}, y: ${position.y}`);

        fabric.Image.fromURL(signatureImageRef.current, (img: any) => {
          img.set({
            left: position.x,
            top: position.y,
            scaleX: 0.5,
            scaleY: 0.5,
            hasRotatingPoint: false,
            signatureId: signatureId,
            borderColor: "#4277FD",
            cornerColor: "#4277FD",
            cornerSize: 6,
            borderScaleFactor: 1,
          });
          img.setControlsVisibility({
            mtr: false,
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          });
          img.on("selected", () => {
            setFocusedSignatureId(img.signatureId);
            const associatedSignee = signatures[img.signatureId]?.signee;
            if (associatedSignee) {
              setSelectedSigneeOption(associatedSignee);
            }
          });
          img.on("moving", () => {
            updateSignaturePosition(signatureId, img.left, img.top);
            ignoreNextClickRef.current = true;
          });

          // Event listener for modifying the signature
          img.on("modified", () => {
            updateSignaturePosition(signatureId, img.left, img.top);
          });
          if (!signatureImage) {
            setSignatures((prev) => ({
              ...prev,
              [signatureId]: {
                id: signatureId,
                left: position.x,
                top: position.y,
                pageNumber: pageNumber,
                scaleX: 0.5,
                scaleY: 0.5,
                src: signatureImageRef.current, // Store the image source
                signee: currentSigneeOption && currentSigneeOption, // Store the associated signee
              },
            }));

            canvas.add(img);
          } else {
            updateSignatureOnCanvas();
          }
          canvas.setActiveObject(img);
          canvas.renderAll();
        });

        // Handle signature deselection
        canvas.on("before:selection:cleared", (options) => {
          if (options.target && options.target.signatureId === signatureId) {
            setFocusedSignatureId(null); // Clear the focused signature ID when it's deselected
          }
        });
      }
      console.log(`second x:${position.x}, y: ${position.y}`);
    }
  };

  // function to add textbox for non owner - in signatures
  const addTextboxForNonOwner = (canvas, x, y, pageNumber, signeeDetail) => {
    const signatureId = `signature-${uuidv4()}`;
    const textSignee = `\n ${signeeDetail?.name}'s Sign here \n`;

    const signtextbox: any = new fabric.Textbox(textSignee, {
      left: x,
      top: y,
      width: 150,
      height: 60,
      fontSize: 12,
      fill: defaultEleColor,
      borderColor: "#EEBAA3",
      cornerColor: "#EEBAA3",
      cornerSize: 6,
      borderScaleFactor: 1,
      hasRotatingPoint: false,
      textAlign: "center",
      editable: false, // Make the text non-editable
      backgroundColor: "#FAF2ED",
      selectionBackgroundColor: "#FFF3ED",
      // styles: { position: 'relative' }
    });

    signtextbox.textBoxId = signatureId; // Assign the ID to the Fabric.js object

    signtextbox.setControlsVisibility({
      mtr: false,
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    });

    signtextbox.on("selected", () => {
      setFocusedSignatureId(signatureId); // Update focused text box on selection
      signtextbox.set({ backgroundColor: "#FFF3ED" }); // Set a different background color when selected
    });

    signtextbox.on("moving", () => {
      updateSignaturePosition(signatureId, signtextbox.left, signtextbox.top);
    });

    signtextbox.on("modified", () => {
      updateSignaturePosition(signatureId, signtextbox.left, signtextbox.top); // Update position on modification
    });

    canvas.setActiveObject(signtextbox);
    canvas.add(signtextbox);
    canvas.renderAll();

    // Update the text elements state
    setSignatures((prev) => ({
      ...prev,
      [signatureId]: {
        id: signatureId,
        content: "New Text",
        left: x,
        top: y,
        width: 150,
        fontSize: 20,
        fill: defaultEleColor,
        pageNumber: pageNumber,
        signee: signeeDetail,
      },
    }));
    setFocusedSignatureId(signatureId);

    // Handle textbox deselection
    canvas.on("before:selection:cleared", (options) => {
      if (options.target && options.target === signtextbox) {
        setFocusedSignatureId(null); // Clear the focused textbox when it's deselected
        signtextbox.set({ backgroundColor: "#FAF2ED" });
      }
    });
  };

  //function to save signature
  const saveSignature = (newSignature) => {
    signatureImageRef.current = newSignature; // Update the signature ref
    setIsSignatureModalOpen(false);

    Object.values(fabricCanvases).forEach((canvas: any) => {
      canvas.getObjects().forEach((obj) => {
        if (obj.type === "image" && obj.signatureId) {
          // Replace the image source of each signature
          obj.setSrc(signatureImageRef.current, () => {
            canvas.renderAll();
          });

          // Update the signature details in the state
          setSignatures((prev) => ({
            ...prev,
            [obj.signatureId]: {
              ...prev[obj.signatureId],
              src: signatureImageRef.current,
            },
          }));
        }
      });
      // Set the default cursor back to stamp only if adding new signatures
      if (!isEditingSignature) {
        canvas.defaultCursor = `url(${STAMP.src}), auto`;
      }
    });

    // If adding a new signature, enable adding mode. Do not enable if editing
    if (!signatureImage && !isEditingSignature) {
      setIsAddingSignature(true);
    }

    // After saving, if it was an edit operation, reset the edit mode flag
    if (isEditingSignature) {
      setIsEditingSignature(false); // Reset the editing flag
    }
  };
  // Function to update the position of a signature
  const updateSignaturePosition = (id, left, top) => {
    setSignatures((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        updated[id].left = left;
        updated[id].top = top;
      }
      return updated;
    });
  };

  //funcation to update the signature , if new signature is added, so that all signatures will be same
  const updateSignatureOnCanvas = () => {
    if (signatureImageRef.current) {
      Object.values(fabricCanvases).forEach((canvas: any) => {
        canvas.getObjects().forEach((obj) => {
          if (obj.signatureId && obj.signatureId === signatureImage.id) {
            obj.setSrc(signatureImageRef.current, () => {
              canvas.renderAll();
            });
          }
        });
      });
    }
  };
  useEffect(() => {
    // Code to run when boxesForOtherSignees updates
    console.log("boxesForOtherSignees updated", boxesForOtherSignees);
  }, [boxesForOtherSignees]);
  // function to delete the signature
  const handleDeleteSignature = () => {
    console.log("handle ");
    if (focusedSignatureId) {
      Object.values(fabricCanvases).forEach((canvas: any) => {
        const signature = canvas
          .getObjects()
          .find(
            (obj) =>
              obj.signatureId === focusedSignatureId ||
              obj.textBoxId === focusedSignatureId
          );
        if (signature) {
          canvas.remove(signature);
          canvas.renderAll();
        }
      });

      setSignatures((prev) => {
        const updatedSignatures = { ...prev };
        delete updatedSignatures[focusedSignatureId];
        return updatedSignatures;
      });

      // Update boxes for other signees
      setFocusedSignatureId(null);
    }
  };

  // function to copy the signature
  const handleDuplicateSign = () => {
    if (focusedSignatureId) {
      const signatureToCopy = signatures[focusedSignatureId];
      if (!signatureToCopy) return;

      const canvas = fabricCanvases[signatureToCopy.pageNumber];
      if (!canvas) return;

      const offsetX = 20; // Offset for the new signature position
      const offsetY = 20;
      const newPosition = {
        x: signatureToCopy.left + offsetX,
        y: signatureToCopy.top + offsetY,
      };

      if (signatureToCopy?.signee?.isDocumentOwner) {
        // Call addSignatureToCanvas with the new position and same pageNumber
        addSignatureToCanvas(canvas, newPosition, signatureToCopy.pageNumber);
      } else {
        // Duplicate the textbox
        addTextboxForNonOwner(
          canvas,
          newPosition.x,
          newPosition.y,
          signatureToCopy.pageNumber,
          signatureToCopy.signee
        );
      }
    }
  };

  // ============================= CONSOLES =============================

  useEffect(() => {
    console.log("Updated signatures:", signatures);
    console.log("focusedSignatureId", focusedSignatureId);
  }, [signatures, focusedSignatureId]);

  useEffect(() => {
    console.log("Updated dateElements:", dateElements);
  }, [dateElements]);
  useEffect(() => {
    console.log("Updated textElements:", textboxesInfo);
  }, [textboxesInfo]);
  useEffect(() => {
    console.log(
      "Updated allElements:",
      signatures,
      dateElements,
      textboxesInfo
    );
  }, [signatures, dateElements, textboxesInfo]);

  //===========================selected signee toolbar========================
  const handleContinueFromAddRecipients = (esignerEmail: any) => {
    setEsignerEmail(esignerEmail);
    console.log("Received esigner email:", esignerEmail);
  };

  const handleSigneeSelection = (signeee) => {
    console.log("7777 atHandleSIgnee", signeee);
    setSelectedSigneeOption(signeee); // Update the state with the selected signee object
    setCurrentColor(signeee?.color);
  };

  //this is to handle signee changes in a signature
  const handleElementSigneeChange = (newSignee) => {
    console.log("888 newSignee", newSignee);
    if (focusedSignatureId) {
      // Retrieve the current state for the focused signature
      const currentSignature = signatures[focusedSignatureId];

      // Determine if the current and new signees are document owners
      const currentIsDocumentOwner = currentSignature.signee.isDocumentOwner;
      const newIsDocumentOwner = newSignee.isDocumentOwner;

      if (currentIsDocumentOwner && !newIsDocumentOwner) {
        // Case: Current is owner, new is not - Convert Signature to Textbox
        convertSignatureToTextbox({
          ...currentSignature,
          signee: newSignee, // Update with new signee info
        });
      } else if (!currentIsDocumentOwner && newIsDocumentOwner) {
        // Case: Current is not owner, new is - Convert Textbox to Signature
        convertTextboxToSignature({
          ...currentSignature,
          signee: newSignee, // Update with new signee info
        });
      } else if (!currentIsDocumentOwner && !newIsDocumentOwner) {
        // Case: Both current and new are not owners - Just update the signee info
        // No need to convert, just update the signee information
        updateSigneeInfoForTextbox(focusedSignatureId, newSignee);
      } // Assuming if both are owners, nothing changes in terms of conversion

      // Update signatures state with the new signee info regardless of conversion
      // Note: This assumes updateSigneeInfoForTextbox function handles state update internally for the non-conversion case
      setSignatures({
        ...signatures,
        [focusedSignatureId]: {
          ...signatures[focusedSignatureId],
          signee: newSignee,
        },
      });
      handleSigneeSelection(newSignee);
    }
  };

  //this is to update signtextbox to signtextbox with new signee
  const updateSigneeInfoForTextbox = (signatureId, newSignee) => {
    const canvas = fabricCanvases[signatures[signatureId].pageNumber];
    if (!canvas) {
      console.error(
        "Canvas not found for page:",
        signatures[signatureId].pageNumber
      );
      return;
    }

    const textbox = canvas
      .getObjects()
      .find((obj) => obj.textBoxId === signatureId);
    if (textbox) {
      // Construct the new text to display the new signee's name
      const newText = `\n${newSignee.name}'s Sign here \n`;
      textbox.set("text", newText);
      canvas.renderAll();
    } else {
      console.error("Textbox not found with ID:", signatureId);
    }

    // Assuming `signatures` is part of your component's state and you have a setter method `setSignatures`
    setSignatures((prevSignatures) => {
      // Create a copy of the previous signatures state to avoid direct mutation
      const updatedSignatures = { ...prevSignatures };

      // Check if the signatureId exists in the current signatures state
      if (updatedSignatures[signatureId]) {
        // Update the signee information for the specified signatureId
        updatedSignatures[signatureId] = {
          ...updatedSignatures[signatureId],
          signee: newSignee, // Assign the new signee to the selected element
        };
      } else {
        console.error(
          "Signature ID not found in the current state:",
          signatureId
        );
      }

      // Return the updated signatures object to update the state
      return updatedSignatures;
    });
  };

  // this function is to convert textbox to signature
  const convertTextboxToSignature = (signature) => {
    const canvas = fabricCanvases[signature.pageNumber];
    if (!canvas) return;

    // Find and remove the textbox
    const textbox = canvas
      .getObjects()
      .find((obj) => obj.textBoxId === signature.id);
    if (textbox) {
      canvas.remove(textbox);
    }

    // Add signature at the same position
    fabric.Image.fromURL(signatureImageRef.current, (img: any) => {
      img.set({
        left: signature.left,
        top: signature.top,
        scaleX: 0.5,
        scaleY: 0.5,
        hasRotatingPoint: false,
        signatureId: signature.id,
        borderColor: "#4277FD",
        cornerColor: "#4277FD",
        cornerSize: 6,
        borderScaleFactor: 1,
      });
      img.setControlsVisibility({
        mtr: false,
        mt: false,
        mb: false,
        ml: false,
        mr: false,
      });
      img.on("selected", () => {
        setFocusedSignatureId(img.signatureId);
      });
      img.on("moving", () => {
        updateSignaturePosition(img.signatureId, img.left, img.top);
      });
      img.on("modified", () => {
        updateSignaturePosition(img.signatureId, img.left, img.top);
      });

      canvas.setActiveObject(img);
      canvas.add(img);
      canvas.renderAll();

      setFocusedSignatureId(img.signatureId);
      // Handle signature deselection
      canvas.on("before:selection:cleared", (options) => {
        if (options.target && options.target.signatureId === img.signatureId) {
          setFocusedSignatureId(null); // Clear the focused signature ID when it's deselected
        }
      });
    });
  };

  // this function is to convert signature to textbox
  const convertSignatureToTextbox = (signature) => {
    const canvas = fabricCanvases[signature.pageNumber];
    if (!canvas) return;

    // Find and remove the signature
    const signatureImage = canvas
      .getObjects()
      .find((obj) => obj.signatureId === signature.id);
    if (signatureImage) {
      canvas.remove(signatureImage);
    }

    // Retrieve the current signee's name for the signature
    const signeeName = signature.signee?.name || "Signer";
    const signeeSign = `\n${signeeName}'s Sign here \n`;

    // Add a textbox at the same position
    const textbox: any = new fabric.Textbox(signeeSign, {
      left: signature.left,
      top: signature.top,
      width: 150,
      height: 60,
      fontSize: 12,
      fill: defaultEleColor,
      borderColor: "#EEBAA3",
      cornerColor: "#EEBAA3",
      cornerSize: 6,
      borderScaleFactor: 1,
      hasRotatingPoint: false,
      textAlign: "center",
      editable: false, // Make the text non-editable
      backgroundColor: "#FAF2ED",
      selectionBackgroundColor: "#FFF3ED",
    });

    textbox.textBoxId = signature.id; // Use the same ID for consistency
    textbox.setControlsVisibility({
      mtr: false,
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    });

    textbox.on("selected", () => {
      setFocusedSignatureId(signature.id); // Update focused text box on selection
      textbox.set({ backgroundColor: "#FFF3ED" }); // Set a different background color when selected
    });

    textbox.on("moving", () => {
      updateSignaturePosition(signature.id, textbox.left, textbox.top);
    });

    textbox.on("modified", () => {
      updateSignaturePosition(signature.id, textbox.left, textbox.top); // Update position on modification
    });

    canvas.setActiveObject(textbox);
    canvas.add(textbox);
    canvas.renderAll();

    // Handle textbox deselection
    canvas.on("before:selection:cleared", (options) => {
      if (options.target && options.target.textBoxId === signature.id) {
        setFocusedSignatureId(null); // Clear the focused textbox ID when it's deselected
        textbox.set({ backgroundColor: "#FAF2ED" }); // Set a different background color when selected
      }
    });
  };

  //============================== COPY FUNCTIONALITY ============================

  // for copy of date
  const handleDuplicateDate = () => {
    if (activeDateareaId) {
      const dateToCopy = dateElements[activeDateareaId];
      if (!dateToCopy) return;

      const canvas = fabricCanvases[dateToCopy.pageNumber];
      if (!canvas) return;

      const offsetX = 20; // Offset for the new date position
      const offsetY = 20;
      const newPosition = {
        x: dateToCopy.left + offsetX,
        y: dateToCopy.top + offsetY,
      };

      // Create and add a new date element to the canvas at the new position
      if (dateToCopy.signee?.isDocumentOwner) {
        addDateToCanvas(
          canvas,
          newPosition.x,
          newPosition.y,
          dateToCopy.pageNumber
        );
      } else {
        addTextboxForNonOwnerDate(
          canvas,
          newPosition.x,
          newPosition.y,
          dateToCopy.pageNumber,
          dateToCopy.signee
        );
      }
    }
  };

  // for copy of text
  const handleDuplicateText = () => {
    if (focusedTextBoxId) {
      const textToCopy = textboxesInfo[focusedTextBoxId];
      if (!textToCopy) return;

      const canvas = fabricCanvases[textToCopy.pageNumber];
      if (!canvas) return;

      const offsetX = 20; // Offset for the new date position
      const offsetY = 20;
      const newPosition = {
        x: textToCopy.left + offsetX,
        y: textToCopy.top + offsetY,
      };

      // Create and add a new date element to the canvas at the new position
      if (textToCopy.signee?.isDocumentOwner) {
        addTextToCanvas(
          canvas,
          newPosition.x,
          newPosition.y,
          textToCopy.pageNumber
        );
      } else {
        addTextboxForNonOwnerText(
          canvas,
          newPosition.x,
          newPosition.y,
          textToCopy.pageNumber,
          textToCopy.signee
        );
      }
    }
  };

  const handleElementDateChange = (newSignee) => {
    if (activeDateareaId) {
      // Retrieve the current state for the focused signature
      const currentSelectedDate = dateElements[activeDateareaId];

      // Determine if the current and new signees are document owners
      const currentIsDocumentOwner = currentSelectedDate.signee.isDocumentOwner;
      const newIsDocumentOwner = newSignee.isDocumentOwner;

      if (currentIsDocumentOwner && !newIsDocumentOwner) {
        // Case: Current is owner, new is not - Convert Signature to Textbox
        updateDateTextboxContent(activeDateareaId, newSignee);
      } else if (!currentIsDocumentOwner && newIsDocumentOwner) {
        // Case: Current is not owner, new is - Convert Textbox to Signature
        updateTextboxToDateContent(activeDateareaId, "DD/MM/YYYY");
      } else if (!currentIsDocumentOwner && !newIsDocumentOwner) {
        // Case: Both current and new are not owners - Just update the signee info
        updateTextSigneeInfo(activeDateareaId, newSignee);
      }
      setDateElements({
        ...dateElements,
        [activeDateareaId]: {
          ...dateElements[activeDateareaId],
          signee: newSignee,
        },
      });
      handleSigneeSelection(newSignee);
    }
  };

  //update datecontent when date to textbox
  const updateDateTextboxContent = (dateId, newSignee) => {
    const dateElement = dateElements[dateId];
    const canvas = fabricCanvases[dateElement.pageNumber];
    if (!canvas) return;

    // Find the textbox object in the canvas
    const textbox = canvas.getObjects().find((obj) => obj.dateId == dateId);

    // const textbox = canvas.getObjects().find(obj => obj.activeDateareaId == dateId);
    if (textbox) {
      const newText = `\n  ${newSignee.name}'s Date here  \n`;
      textbox.set("text", newText);
      textbox.set({
        fontSize: 12,
        width: 150,
        height: 60,
        fill: defaultEleColor,
        borderColor: "#EEBAA3",
        cornerColor: "#EEBAA3",
        cornerSize: 6,
        borderScaleFactor: 1,
        hasRotatingPoint: false,
        textAlign: "center",
        editable: false,
        backgroundColor: "#FAF2ED",
        selectionBackgroundColor: "#FFF3ED",
        scaleX: 1,
        scaleY: 1,
      });

      canvas.renderAll();
    } else {
      console.error("Textbox for date element not found:", dateId);
    }
  };

  //update datecontent when textbox to date
  const updateTextboxToDateContent = (dateId, newFormat) => {
    const dateElement = dateElements[dateId];
    const canvas = fabricCanvases[dateElement.pageNumber];
    if (!canvas) return;

    // Find the textbox object in the canvas
    const textbox = canvas.getObjects().find((obj) => obj.dateId == dateId);
    if (textbox) {
      // Format the current date with the new format
      const currentDate = moment().format(newFormat);

      // Update the textbox with the formatted date
      textbox.set("text", currentDate);
      textbox.set({
        // Reset any specific styles you had for signee textboxes
        fontSize: 20, // Example: Larger font size for date
        borderColor: "#4277FD",
        cornerColor: "#4277FD",
        backgroundColor: "#FFF",
        selectionBackgroundColor: "#FFF",
        // ... other style properties if needed
      });

      // Update the dateElements state to reflect the new format and text
      setDateElements((prev) => ({
        ...prev,
        [dateId]: {
          ...prev[dateId],
          value: currentDate,
          format: newFormat, // Update the format in state
        },
      }));

      canvas.renderAll();
    } else {
      console.error("Textbox for date element not found:", dateId);
    }
  };

  //update datecontent when textbox to textbox
  const updateTextSigneeInfo = (dateId, newSignee) => {
    const dateElement = dateElements[dateId];
    const canvas = fabricCanvases[dateElement.pageNumber];
    if (!canvas) return;

    const textbox = canvas.getObjects().find((obj) => obj.dateId === dateId);
    if (textbox) {
      // Update the text content to reflect the new signee's name
      const newText = `\n  ${newSignee.name}'s Date here  \n`;
      textbox.set("text", newText);
      textbox.set({
        fontSize: 12,
        width: 150,
        height: 60,
        fill: defaultEleColor,
        borderColor: "#EEBAA3",
        cornerColor: "#EEBAA3",
        cornerSize: 6,
        borderScaleFactor: 1,
        hasRotatingPoint: false,
        textAlign: "center",
        editable: false,
        backgroundColor: "#FAF2ED",
        selectionBackgroundColor: "#FFF3ED",
        scaleX: 1,
        scaleY: 1,
      });
      canvas.renderAll();

      // Additionally, update the state if necessary to reflect the new signee info
      setDateElements((prev) => ({
        ...prev,
        [dateId]: {
          ...prev[dateId],
          signee: newSignee,
        },
      }));
    } else {
      console.error("Textbox for date element not found:", dateId);
    }
  };

  // function to add textbox for non owner in date
  const addTextboxForNonOwnerDate = (
    canvas,
    x,
    y,
    pageNumber,
    signeeDetail
  ) => {
    const dateId = `date-${uuidv4()}`;
    const textSignee = `\n ${signeeDetail?.name}'s Date here \n`;

    const datetextbox: any = new fabric.Textbox(textSignee, {
      left: x,
      top: y,
      width: 150,
      height: 60,
      fontSize: 12,
      fill: defaultEleColor,
      borderColor: "#EEBAA3",
      cornerColor: "#EEBAA3",
      cornerSize: 6,
      borderScaleFactor: 1,
      hasRotatingPoint: false,
      textAlign: "center",
      editable: false, // Make the text non-editable
      backgroundColor: "#FAF2ED",
      selectionBackgroundColor: "#FFF3ED",
      // styles: { position: 'relative' }
    });

    datetextbox.dateId = dateId; // Assign the ID to the Fabric.js object

    datetextbox.setControlsVisibility({
      mtr: false,
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    });

    datetextbox.on("selected", () => {
      setActiveDateareaId(dateId); // Update focused text box on selection
      datetextbox.set({ backgroundColor: "#FFF3ED" }); // Set a different background color when selected
    });

    datetextbox.on("moving", () => {
      updateDateBoxPosition(dateId, datetextbox.left, datetextbox.top);
    });

    datetextbox.on("modified", () => {
      updateDateBoxPosition(dateId, datetextbox.left, datetextbox.top); // Update position on modification
    });

    canvas.setActiveObject(datetextbox);
    canvas.add(datetextbox);
    canvas.renderAll();

    // Update the text elements state
    setDateElements((prev) => ({
      ...prev,
      [dateId]: {
        id: dateId,
        left: x,
        top: y,
        width: 150,
        fontSize: 12,
        fill: defaultEleColor,
        pageNumber: pageNumber,
        signee: signeeDetail,
      },
    }));
    setActiveDateareaId(dateId);

    // Handle textbox deselection
    canvas.on("before:selection:cleared", (options) => {
      if (options.target && options.target === datetextbox) {
        setActiveDateareaId(null); // Clear the focused textbox when it's deselected
        datetextbox.set({ backgroundColor: "#FAF2ED" }); // Set a different background color when selected
      }
    });
  };

  // for extra text functions=================================================================
  const handleElementTextChange = (newSignee) => {
    if (focusedTextBoxId) {
      // Retrieve the current state for the focused signature
      const currentSelectedText = textboxesInfo[focusedTextBoxId];

      // Determine if the current and new signees are document owners
      const currentIsDocumentOwner = currentSelectedText.signee.isDocumentOwner;
      const newIsDocumentOwner = newSignee.isDocumentOwner;

      if (currentIsDocumentOwner && !newIsDocumentOwner) {
        // Case: Current is owner, new is not - Convert Signature to Textbox
        updateMainTextboxContent(focusedTextBoxId, newSignee);
      } else if (!currentIsDocumentOwner && newIsDocumentOwner) {
        // Case: Current is not owner, new is - Convert Textbox to Signature
        updateTextboxToMainTextContent(focusedTextBoxId, "DD/MM/YYYY");
      } else if (!currentIsDocumentOwner && !newIsDocumentOwner) {
        // Case: Both current and new are not owners - Just update the signee info
        updateMainTextSigneeInfo(focusedTextBoxId, newSignee);
      }
      setTextboxesInfo({
        ...textboxesInfo,
        [focusedTextBoxId]: {
          ...textboxesInfo[focusedTextBoxId],
          signee: newSignee,
        },
      });
      handleSigneeSelection(newSignee);
    }
  };

  //update datecontent when main text to textbox
  const updateMainTextboxContent = (textBoxId, newSignee) => {
    const textElement = textboxesInfo[textBoxId];
    const canvas = fabricCanvases[textElement.pageNumber];
    if (!canvas) return;

    // Find the textbox object in the canvas
    const textbox = canvas
      .getObjects()
      .find((obj) => obj.textBoxId == textBoxId);

    if (textbox) {
      const newText = `\n  ${newSignee.name}'s Text here  \n`;
      textbox.set("text", newText);
      textbox.set({
        fontSize: 12,
        width: 150,
        height: 60,
        fill: defaultEleColor,
        borderColor: "#EEBAA3",
        cornerColor: "#EEBAA3",
        cornerSize: 6,
        borderScaleFactor: 1,
        hasRotatingPoint: false,
        textAlign: "center",
        editable: false,
        backgroundColor: "#FAF2ED",
        selectionBackgroundColor: "#FFF3ED",
        scaleX: 1,
        scaleY: 1,
        content: "",
      });

      canvas.renderAll();
    } else {
      console.error("Textbox for text element not found:", textBoxId);
    }
  };
  //update datecontent when  text to main textbox

  const updateTextboxToMainTextContent = (textBoxId, newFormat) => {
    const textElement = textboxesInfo[textBoxId];
    const canvas = fabricCanvases[textElement.pageNumber];
    if (!canvas) return;

    // Find the textbox object in the canvas
    const textbox = canvas
      .getObjects()
      .find((obj) => obj.textBoxId == textBoxId);
    if (textbox) {
      // Format the current date with the new format
      // const currentDate = moment().format(newFormat);

      // Update the textbox with the formatted date
      textbox.set("text", "New Text");
      textbox.set({
        // Reset any specific styles you had for signee textboxes
        fontSize: 20, // Example: Larger font size for date
        borderColor: "#4277FD",
        cornerColor: "#4277FD",
        backgroundColor: "#fff",
        selectionBackgroundColor: "#FFF",
        editable: true,
        // ... other style properties if needed
      });

      // Update the dateElements state to reflect the new format and text
      setTextboxesInfo((prev) => ({
        ...textboxesInfo,
        [textBoxId]: {
          ...prev[textBoxId],
          // value: currentDate,
        },
      }));

      canvas.renderAll();
    } else {
      console.error("Textbox for date element not found:", textBoxId);
    }
  };

  //update datecontent when textbox to textbox
  const updateMainTextSigneeInfo = (textBoxId, newSignee) => {
    const textElement = textboxesInfo[textBoxId];
    const canvas = fabricCanvases[textElement.pageNumber];
    if (!canvas) return;

    const textbox = canvas
      .getObjects()
      .find((obj) => obj.textBoxId === textBoxId);
    if (textbox) {
      // Update the text content to reflect the new signee's name
      const newText = `\n  ${newSignee.name}'s Text here  \n`;
      textbox.set("text", newText);
      textbox.set({
        fontSize: 12,
        width: 150,
        height: 60,
        fill: defaultEleColor,
        borderColor: "#EEBAA3",
        cornerColor: "#EEBAA3",
        cornerSize: 6,
        borderScaleFactor: 1,
        hasRotatingPoint: false,
        textAlign: "center",
        editable: false,
        backgroundColor: "#FAF2ED",
        selectionBackgroundColor: "#FFF3ED",
        scaleX: 1,
        scaleY: 1,
      });
      canvas.renderAll();

      // Additionally, update the state if necessary to reflect the new signee info
      setTextboxesInfo((prev) => ({
        ...prev,
        [textBoxId]: {
          ...prev[textBoxId],
          signee: newSignee,
        },
      }));
    } else {
      console.error("Textbox for date element not found:", textBoxId);
    }
  };

  // function to add textbox for non owner in text
  const addTextboxForNonOwnerText = (
    canvas,
    x,
    y,
    pageNumber,
    signeeDetail
  ) => {
    const textBoxId = `text-box-${uuidv4()}`;
    const textSignee = `\n ${signeeDetail?.name}'s Text here \n`;

    const maintextbox: any = new fabric.Textbox(textSignee, {
      left: x,
      top: y,
      width: 150,
      height: 60,
      fontSize: 12,
      fill: defaultEleColor,
      borderColor: "#EEBAA3",
      cornerColor: "#EEBAA3",
      cornerSize: 6,
      borderScaleFactor: 1,
      hasRotatingPoint: false,
      textAlign: "center",
      editable: false, // Make the text non-editable
      backgroundColor: "#FAF2ED",
      selectionBackgroundColor: "#FFF3ED",
      // styles: { position: 'relative' }
    });

    maintextbox.textBoxId = textBoxId; // Assign the ID to the Fabric.js object

    maintextbox.setControlsVisibility({
      mtr: false,
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    });

    maintextbox.on("selected", () => {
      setFocusedTextBoxId(textBoxId); // Update focused text box on selection
      maintextbox.set({ backgroundColor: "#FFF3ED" }); // Set a different background color when selected
    });

    maintextbox.on("moving", () => {
      updateTextboxPosition(textBoxId, maintextbox.left, maintextbox.top);
    });

    maintextbox.on("modified", () => {
      updateTextboxPosition(textBoxId, maintextbox.left, maintextbox.top); // Update position on modification
    });

    canvas.setActiveObject(maintextbox);
    canvas.add(maintextbox);
    canvas.renderAll();

    // Update the text elements state
    setTextboxesInfo((prev) => ({
      ...prev,
      [textBoxId]: {
        id: textBoxId,
        left: x,
        top: y,
        width: 150,
        fontSize: 12,
        fill: defaultEleColor,
        pageNumber: pageNumber,
        signee: signeeDetail,
      },
    }));
    setFocusedTextBoxId(textBoxId);

    // Handle textbox deselection
    canvas.on("before:selection:cleared", (options) => {
      if (options.target && options.target === maintextbox) {
        setFocusedTextBoxId(null); // Clear the focused textbox when it's deselected
        maintextbox.set({ backgroundColor: "#FAF2ED" }); // Set a different background color when selected
      }
    });
  };
  const updatePdfWithSignature = async () => {
    const pdf = new jsPDF('portrait', 'px', 'a4');
    for (let pageNumber = 1; pageNumber <= pdfDoc?.numPages; pageNumber++) {
        const activeCanvas = fabricCanvases[pageNumber];
        if (activeCanvas) {
            // Temporarily hide non-owner signature placeholders
            const nonOwnerSignatures = activeCanvas.getObjects().filter(obj => 
                obj.type === 'textbox' && !signatures[obj.signatureId]?.signee?.isDocumentOwner
            );
            nonOwnerSignatures.forEach(sig => sig.visible = false);
            
            const canvasDataUrl = activeCanvas.toDataURL({ format: 'pdf', quality: 1.0 });
            if (pageNumber !== 1) pdf.addPage();
            pdf.addImage(canvasDataUrl, 'pdf', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

            // Show non-owner signatures placeholders back
            nonOwnerSignatures.forEach(sig => sig.visible = true);
        }
    }
    const blob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(blob);
    setModifiedPdf(pdfUrl);
    sessionStorage.setItem('midifiedPdfurl', pdfUrl);
};
  useEffect(() => {
    console.log("docID set", docID);
  }, [docID]);

  // ppages right end options

  // Restrict object movement to within canvas boundaries
  const restrictMovementWithinCanvas = (canvas) => {
    canvas.on("object:moving", function (e) {
      const obj = e.target;

      // Object dimensions considering scaling
      const objWidth = obj.getScaledWidth();
      const objHeight = obj.getScaledHeight();

      // Canvas dimensions
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      // Calculate boundaries
      const topLimit = 0;
      const leftLimit = 0;
      const bottomLimit = canvasHeight - objHeight;
      const rightLimit = canvasWidth - objWidth;

      // Check and adjust the object's position if necessary
      const top = Math.min(Math.max(obj.top, topLimit), bottomLimit);
      const left = Math.min(Math.max(obj.left, leftLimit), rightLimit);

      // Use 'set' method to update position safely
      obj
        .set({
          top: top,
          left: left,
        })
        .setCoords(); // Update the object's coordinates after moving
    });
  };

  //navigations - footer

  //dpuble clicks

  const setupIntersectionObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = Number(
            entry.target.getAttribute("data-page-number")
          );
          setCurrentPage(pageNumber); // Update the current page state
        }
      });
    }, observerOptions);

    document.querySelectorAll(".pdf-page-container").forEach((container) => {
      observer.observe(container);
    });
  };

  const scrollToPage = (pageNumber) => {
    const pageElement = document.querySelector(
      `.pdf-page-container[data-page-number='${pageNumber}']`
    );
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNumber); // Update the current page state
    }
  };
  const goToNextPage = () => {
    if (currentPage < pdfDoc.numPages) {
      const nextPage = currentPage + 1;
      scrollToPage(nextPage);
      setCurrentPage(nextPage); // Ensure the currentPage state is updated
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      scrollToPage(prevPage);
      setCurrentPage(prevPage); // Ensure the currentPage state is updated
    }
  };

  const zoomIn = () => {
    Object.values(fabricCanvases).forEach((canvas: fabric.Canvas) => {
      const zoom = canvas.getZoom();
      canvas.setZoom(zoom * 1.1);
      canvas.setWidth(canvas.getWidth() * 1.1);
      canvas.setHeight(canvas.getHeight() * 1.1);
      canvas.renderAll();
    });
  };

  const zoomOut = () => {
    Object.values(fabricCanvases).forEach((canvas: fabric.Canvas) => {
      const zoom = canvas.getZoom();
      canvas.setZoom(zoom * 0.9);
      canvas.setWidth(canvas.getWidth() * 0.9);
      canvas.setHeight(canvas.getHeight() * 0.9);
      canvas.renderAll();
    });
  };

  const combinedObject = { ...signatures, ...dateElements, ...textboxesInfo };
  console.log("boxesforcombined", combinedObject);

  const groupedBySignee = Object.values(combinedObject).reduce(
    (acc, item: any) => {
      const email = item?.signee.email;
      const newItem = {
        id: item.id,
        message: "Your Text Here",
        pageIndex: item.pageNumber,
        selectedSignee: item?.signee.email,
        type: item.id.substring(0, 4),
        x: item.left,
        y: item.top,
        width: item.width,
        ...(item.src && { src: item.src }),
      };
      if (!acc[email]) {
        acc[email] = [];
      }
      acc[email].push(newItem);
      return acc;
    },
    {}
  );
  // setBoxesForOtherSignees(groupedBySignee);

  console.log(boxesForOtherSignees, "boxesForOtherSignees");

  return (
    <div>
      {product ? (
        <NavbarBuilder
          docName={docName}
          updatePdfWithSignature={updatePdfWithSignature}
          documentID={docID}
          esignerEmail={esignerEmail}
          modifiedPdf={modifiedPdf && modifiedPdf}
          // boxesForOtherSignees={boxesForOtherSignees}
          boxesForOtherSignees={groupedBySignee}
          setBoxesForOtherSignees={setBoxesForOtherSignees}
        />
      ) : (
        <NavbarSec
          logoOnly={false}
          updatePdfWithSignature={updatePdfWithSignature}
          documentID={docID}
          esignerEmail={esignerEmail}
          modifiedPdf={modifiedPdf && modifiedPdf}
          // boxesForOtherSignees={boxesForOtherSignees}
          boxesForOtherSignees={groupedBySignee}
          setBoxesForOtherSignees={setBoxesForOtherSignees}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          className="justify-center"
          style={{ padding: "34px", background: "#f1f4fc" }}
        >
          <div id="canvas-container-main">
            {/*  editing options for text elements */}
            {focusedTextBoxId && textboxesInfo[focusedTextBoxId] && (
              <div
                className="text-editing-options"
                style={{
                  position: "absolute",
                  top: `${calculateTopPosition(
                    textboxesInfo[focusedTextBoxId].pageNumber,
                    textboxesInfo[focusedTextBoxId].top
                  )}px`,
                  left: `${textboxesInfo[focusedTextBoxId].left - 5}px`,
                }}
              >
                <ElementSigneeSelect
                  className="dark-options-signee"
                  styleColor={currentColor}
                  documentId={docID}
                  defaultSignee={textboxesInfo[focusedTextBoxId].signee}
                  onChangefunc={handleElementTextChange}
                />
                {textboxesInfo[focusedTextBoxId]?.signee?.isDocumentOwner && (
                  <ColorpickerVertical
                    selectedTextColor={textboxesInfo[focusedTextBoxId].fill}
                    setSelectedTextColor={(color) => handleColorChange(color)}
                  />
                )}
                <Image
                  src={COPY_ELEMENT.src}
                  preview={false}
                  alt="copy"
                  className="p-6 cursor-pointer"
                  onClick={handleDuplicateText}
                />
                <Image
                  src={DEL_SIGN.src}
                  preview={false}
                  alt="delete"
                  className="p-6"
                  onClick={() => handleDeleteTextElement()}
                />
              </div>
            )}

            {/*  editing options for date elements */}
            {activeDateareaId && dateElements[activeDateareaId] && (
              <div
                className="date-editing-options"
                style={{
                  position: "absolute",
                  top: `${calculateTopPosition(
                    dateElements[activeDateareaId].pageNumber,
                    dateElements[activeDateareaId].top
                  )}px`,
                  left: `${dateElements[activeDateareaId].left - 5}px`,
                }}
              >
                <ElementSigneeSelect
                  className="dark-options-signee"
                  styleColor={currentColor}
                  documentId={docID}
                  defaultSignee={dateElements[activeDateareaId].signee}
                  onChangefunc={handleElementDateChange}
                />
                {dateElements[activeDateareaId]?.signee?.isDocumentOwner && (
                  <>
                    <Select
                      suffixIcon={
                        <Image
                          src={DOWN_ARROW_SM.src}
                          preview={false}
                          alt="arrow"
                        />
                      }
                      className="date-format-selector"
                      defaultValue="DD/MM/YYYY"
                      style={{ width: 120 }}
                      onChange={(value) => handleFormatChange(value)}
                      options={[
                        { value: "DD/MM/YY", label: "DD/MM/YYYY" },
                        { value: "MM/DD/YY", label: "MM/DD/YYYY" },
                        { value: "MM.DD.YY", label: "MM.DD.YYYY" },
                        { value: "DD.MM.YY", label: "DD.MM.YYYY" },
                        { value: "YY-MM-DD", label: "YYYY-MM-DD" },
                      ]}
                      popupClassName="date-formats-selection"
                    />
                    <ColorpickerVertical
                      selectedTextColor={dateElements[activeDateareaId].fill}
                      setSelectedTextColor={(color) =>
                        handleDateColorChange(color)
                      }
                    />{" "}
                  </>
                )}
                <Image
                  src={COPY_ELEMENT.src}
                  preview={false}
                  alt="copy"
                  className="p-6 cursor-pointer"
                  onClick={handleDuplicateDate}
                />

                <Image
                  src={DEL_SIGN.src}
                  preview={false}
                  alt="delete"
                  className="p-6 cursor-pointer"
                  onClick={() => handleDeleteDateElement()}
                />
              </div>
            )}

            {/*  editing options for signature elements */}
            {focusedSignatureId && signatures[focusedSignatureId] && (
              <div
                className="sign-editor-options"
                style={{
                  position: "absolute",
                  top: `${calculateTopPosition(
                    signatures[focusedSignatureId].pageNumber,
                    signatures[focusedSignatureId].top
                  )}px`,
                  left: `${signatures[focusedSignatureId].left - 5}px`,
                }}
              >
                <ElementSigneeSelect
                  className="dark-options-signee"
                  styleColor={currentColor}
                  documentId={docID}
                  defaultSignee={signatures[focusedSignatureId].signee}
                  onChangefunc={handleElementSigneeChange}
                />
                {signatures[focusedSignatureId]?.signee?.isDocumentOwner && (
                  <Image
                    src={EDIT_SIGN.src}
                    preview={false}
                    alt="edit"
                    className="p-6 cursor-pointer"
                    onClick={openSignatureModal}
                  />
                )}
                <Image
                  src={COPY_ELEMENT.src}
                  preview={false}
                  alt="copy"
                  className="p-6 cursor-pointer"
                  onClick={handleDuplicateSign}
                />
                <Image
                  src={DEL_SIGN.src}
                  preview={false}
                  alt="delete"
                  className="p-6 cursor-pointer"
                  onClick={() => handleDeleteSignature()}
                />
              </div>
            )}
          </div>

          {/* bottom toolbar - start */}

          <div
            className={`flow-pdf-viewer-footer ${
              !signers ? "blur-effect" : "no-blur"
            }`}
          >
            <Row
              gutter={[10, 10]}
              justify={"center"}
              align="bottom"
              className="w-full"
            >
              <Col span={6}>
                <div className="flow-pdf-footer-dummy"></div>
              </Col>
              <Col span={12} className="div-row justify-center">
                <div
                  className="div-row justify-center flow-pdf-footer-center"
                  style={{ border: `2px solid ${currentColor?.primary}` }}
                >
                  {/* you can change the signeeType to either single or multiple */}
                  {/* {signers ? 
                                    (
                                    <SelectedSigneeOption
                                        selectedSigneeOption={selectedSigneeOption}
                                        dateElements={dateElements}
                                        setDateElements={setDateElements}
                                        textElements={textboxesInfo}
                                        setTextElements={setTextboxesInfo}
                                        setSelectedSigneeOption={setSelectedSigneeOption}
                                        handleSigneeSelection={handleSigneeSelection}
                                        signatures={signatures}
                                        // boxesForOtherSignees={boxesForOtherSignees}
                                        // setBoxesForOtherSignees={setBoxesForOtherSignees}
                                        setSignatures={setSignatures}
                                        docID={docID}
                                        fetchDocumentDetails={fetchDocumentDetails}
                                        size="small"
                                        styleColor={currentColor}
                                    />) : (null)} */}

                  {signers && (
                    <ProductSigneeSelection
                      signers={signers}
                      selectedSigneeOption={selectedSigneeOption}
                      setSelectedSigneeOption={setSelectedSigneeOption}
                      handleSigneeSelection={handleSigneeSelection}
                      dateElements={dateElements}
                      setDateElements={setDateElements}
                      textElements={textboxesInfo}
                      setTextElements={setTextboxesInfo}
                      signatures={signatures}
                      setSignatures={setSignatures}
                      docID={docID}
                      fetchDocumentDetails={fetchDocumentDetails}
                      size="small"
                      styleColor={currentColor}
                    />
                  )}
                  {/* {esignerEmail ? (
                                        <SelectedSigneeOption
                                            selectedSigneeOption={selectedSigneeOption}
                                            dateElements={dateElements}
                                            setDateElements={setDateElements}
                                            textElements={textboxesInfo}
                                            setTextElements={setTextboxesInfo}
                                            setSelectedSigneeOption={setSelectedSigneeOption}
                                            handleSigneeSelection={handleSigneeSelection}
                                            signatures={signatures}
                                            // boxesForOtherSignees={boxesForOtherSignees}
                                            // setBoxesForOtherSignees={setBoxesForOtherSignees}
                                            setSignatures={setSignatures}
                                            docID={docID}
                                            fetchDocumentDetails={fetchDocumentDetails}
                                            size="small"
                                            styleColor={currentColor}
                                        />
                                    ) : (

                                        <AddRecipients
                                            DocumentID={docID}
                                            onContinue={handleContinueFromAddRecipients}
                                        />
                                    )} */}

                  <ToolbarTools
                    handleSignatureClick={openSignatureModal}
                    activeMode={activeMode}
                    currentColor={currentColor}
                    handleDateClick={enableDateAddingMode}
                    handleTextClick={enableTextAddingMode}
                  />
                </div>
              </Col>
              <Col span={6} className="justify-end">
                <div className="flow-pdf-footer-right">
                  <div className="pdf-footer-page-navigation">
                    <div className="pdf-footer-page-navigator align-center gap-10">
                      <Image
                        src={PREV_PAGE.src}
                        preview={false}
                        alt="prev"
                        onClick={goToPrevPage}
                        className="prev-navigator-btn-border"
                      />
                      <p
                        id="currentPageDisplay"
                        className="text-14 font-500"
                        style={{ width: "10px" }}
                      >
                        {currentPage}
                      </p>
                      <Image
                        src={NEXT_PAGE.src}
                        preview={false}
                        alt="next"
                        onClick={goToNextPage}
                        className="next-navigator-btn-border"
                      />
                    </div>
                    <p className="text-14 font-500">
                      of {pdfDoc ? pdfDoc.numPages : 0}
                    </p>
                  </div>
                  <div className="div-row gap-15 align-center pdf-footer-page-scaling">
                    <Tooltip
                      title={<p>Fit to Width</p>}
                      overlayClassName="primary-tooltip"
                      trigger={"hover"}
                    >
                      <Image
                        src={FIT.src}
                        preview={false}
                        alt="fit"
                        // onClick={zoomIn}
                        className="cursor-pointer img-centered"
                      />
                    </Tooltip>

                    <Tooltip
                      title={<p>Zoom Out</p>}
                      overlayClassName="primary-tooltip"
                      trigger={"hover"}
                    >
                      <Image
                        src={ZOOM_OUT.src}
                        preview={false}
                        alt="logo"
                        onClick={zoomOut}
                        className="cursor-pointer img-centered"
                      />
                    </Tooltip>

                    <Tooltip
                      title={<p>Zoom In</p>}
                      overlayClassName="primary-tooltip"
                      trigger={"hover"}
                    >
                      <Image
                        src={ZOOM_IN.src}
                        preview={false}
                        alt="logo"
                        onClick={zoomIn}
                        className="cursor-pointer img-centered"
                      />
                    </Tooltip>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* bottom toolbar - end */}

          <SignatureModal
            isOpen={isSignatureModalOpen}
            onClose={closeSignatureModal}
            onSaveSignature={saveSignature}
            // editingSignature={editingSignature}
            signatures={signatures}
            setSignatures={setSignatures}
            // setEditingSignature={setEditingSignature}
          />
        </div>
      )}
    </div>
  );
};
export default PdfBuilder;
