import React, { useCallback, useEffect, useRef, useState } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import { Button, Image, notification } from "antd";
import {
  UPLOAD,
  PDF,
  UPLOADED_GIF,
  CLOUD_UPLOADER,
  TEMPLATE_MOCK,
  TRASH_GRAY,
} from "@/Components/utils/image-constants";
import { useRouter } from "next/router";
import { DEV_BASE_URL } from "@/config";
import moment from "moment";
import { useSelector } from "react-redux";
// Disable auto-discovery
declare global {
  interface Window {
    removeFile: (fileName: string) => void;
  }
}
Dropzone.autoDiscover = false;
const todayDateString = moment().format("D MMMM, YYYY"); // "3 March, 2022"
const ProductFileUploader = ({ uploadDocument, fileName }: any) => {
  const router = useRouter();

  const dropzoneRef = useRef(null);
  const previewsContainerRef = useRef(null); // Ref for the previews container
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const isUploaded = useSelector((state: any) => state?.isUploaded);
  console.log(isUploaded);
  const removeFile = useCallback((file) => {
    const dropzone = Dropzone.forElement(dropzoneRef.current);
    dropzone.removeFile(file);
    setUploadedFiles((currentFiles) => currentFiles.filter((f) => f !== file));
  }, []);
  const previewTemplate = `
        <div class="dz-preview-outer product-dz-preview-outer">
        <div class="dz-preview dz-file-preview product-upload-main-preview w-fit">
            <div class="dz-details product-upload-main-dz-details">
            <div class="product-img-dz-details-inner">
                <Image src="${TEMPLATE_MOCK.src}" alt="file" preview={false} />
                <!-- <div class="dz-filename upload-main-dz-filename"><span data-dz-name></span><span class="upload-progress-text"></span> </div>   -->
            </div>
            <div class="space-between gap-12">
            <div class="div-col gap-4 align-start">
                <span data-dz-name class="text-12 font-600 text-dark"></span>
                <span class="text-10 font-500 text-gray400">${todayDateString}</span>
            </div>
                        <Image src="${TRASH_GRAY.src}" alt="file" preview={false}  data-dz-remove />
                  
            </div>
           
            <div class="uploaded-gif-placeholder"></div>
            </div>
            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            <!-- Add any other elements you want here -->
        </div>
        </div>`;

  useEffect(() => {
    if (Dropzone.instances.length > 0 && dropzoneRef.current) {
      // Find an instance attached to the ref element, if any
      const existingInstance = Dropzone.instances.find(
        (instance) => instance.element === dropzoneRef.current
      );
      if (existingInstance) {
        // If there's an existing instance, use that instead of creating a new one
        // Optionally, you might want to update its options or simply continue using it as is
        return;
      }
    }

    const token = sessionStorage.getItem("accessToken") || "";
    const dropzone = new Dropzone(dropzoneRef.current, {
      url: `${DEV_BASE_URL}/document/upload`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${token}`,
      },
      autoProcessQueue: false,
      previewsContainer: previewsContainerRef.current,
      previewTemplate: previewTemplate && previewTemplate,
    });

    dropzone.on("addedfile", async function (file) {
      try {
        await uploadDocument(file);

        notification.success({
          message: "Success",
          description: `Document Uploaded Successfully.`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      } catch (error) {
        console.error("Upload error:", error);
        notification.error({
          message: "Upload Failed",
          description: `An error occured while adding the fileaaa.`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    });

    dropzone.on("uploadprogress", function (file, progress) {
      console.log(file);
      const previewElement = file.previewElement;
      const filenameElement = previewElement.querySelector(
        ".dz-filename .upload-progress-text"
      );
      const progressElement = previewElement.querySelector(".dz-upload");
      const currentTime = Date.now();
      const timeElapsed = (currentTime - file.startTime) / 1000; // Time elapsed in seconds
      // Update the progress bar width
      progressElement.style.width = `${progress}%`;
      if (progress > 0) {
        const totalEstimatedTime = timeElapsed / (progress / 100);
        const timeRemaining = totalEstimatedTime - timeElapsed;
        const timeRemainingRounded = Math.round(timeRemaining);
        // filenameElement?.textContent = ` ${Math.round(
        //     progress
        // )}%  ${timeRemainingRounded} Sec remaining`;
      }

      if (progress >= 100) {
        setTimeout(() => {
          const placeholder = file.previewElement.querySelector(
            ".uploaded-gif-placeholder"
          );
          // placeholder?.innerHTML = `<Image src="${UPLOADED_GIF.src}" alt="file" preview={false}  class="uploaded-gif" />`;
          // Save to localStorage
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64data = reader.result;
            localStorage.setItem("uploadedPdf", base64data as string);
          };
        }, 600);
      }
    });
    const handleFileRemoveClick = (event) => {
        const storedFileName = sessionStorage.getItem("fileName");
        if (storedFileName === fileName) {
           
            sessionStorage.removeItem("fileName");
          }
      let target = event.target;
      while (target != null && !target.getAttribute("data-dz-remove")) {
        target = target.parentElement;
      }

      if (target && target.getAttribute("data-dz-remove")) {
        const fileName = target.getAttribute("data-file-name");
        const fileToRemove = dropzone.files?.find(
          (file) => file.name === fileName
        );
        if (fileToRemove) {
          dropzone.removeFile(fileToRemove);
        }
      }
    };

    const previewsContainer = previewsContainerRef.current;
    previewsContainer?.addEventListener("click", handleFileRemoveClick);

    return () => {
      previewsContainer?.removeEventListener("click", handleFileRemoveClick);
    };
  }, [uploadDocument == true, removeFile]);

  return (
    <div className="product-uploader-container">
      {/* Uploaded files display */}
      {/* Dropzone for new uploads */}
      <div ref={dropzoneRef} className="dropzone dropzone-hero-upload-pro">
        <div className="dz-message">
          <div className="dropzone-hero-inner-pro">
            <div className="ant-upload-drag-icon">
              <Image src={CLOUD_UPLOADER.src} preview={false} alt="upload" />
            </div>
            <p className="text-14 font-500 text-gray400">
              Drag & drop file here
            </p>
            <p className="text-14 font-500 text-gray400 mb-24">
              {" "}
              Supported files: PDF, Word, PowerPoint, JPG, PNG
            </p>
            <Button type="primary" className="mb-15 h-40">
              Select Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductFileUploader;
