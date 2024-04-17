import React, { useEffect, useRef, useState } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import { Button, Image, notification } from "antd";
import { UPLOAD, PDF, UPLOADED_GIF } from "@/Components/utils/image-constants";
import { useRouter } from "next/router";
import {DEV_BASE_URL} from "@/config";

// Disable auto-discovery
Dropzone.autoDiscover = false;

const UploadDocu = () => {
  const router = useRouter();
  const dropzoneRef = useRef(null);
  const [files, setFiles] = useState([]);

  const previewTemplate = `
    <div class="dz-preview-outer">
        <div class="dz-preview dz-file-preview upload-main-preview">
            <div class="dz-details upload-main-dz-details">
            <div class="upload-main-dz-details-inner">
                <Image src="${PDF.src}" alt="file" preview={false} />
                <div class="dz-filename upload-main-dz-filename"><span data-dz-name></span><span class="upload-progress-text"></span> </div>
            </div>
           
            <div class="uploaded-gif-placeholder"></div>
            </div>
            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            <!-- Add any other elements you want here -->
        </div>
        </div>`;

  useEffect(() => {
    const token: string = sessionStorage.getItem("token") || "";
    const dropzone = new Dropzone(dropzoneRef.current, {
      url: `${DEV_BASE_URL}/document/upload`,
      headers: {
        Authorization: `${token}`,
      },
      acceptedFiles: 'application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      previewTemplate: previewTemplate,
    });

    dropzone.on("addedfile", function (file) {
      file.startTime = Date.now(); // Record start time
    });

    dropzone.on("uploadprogress", function (file, progress) {
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
        filenameElement.textContent = ` ${Math.round(
          progress
        )}%  ${timeRemainingRounded} Sec remaining`;
      }
      if (progress >= 100) {
        setTimeout(() => {
          const placeholder = file.previewElement.querySelector(
            ".uploaded-gif-placeholder"
          );
          placeholder.innerHTML = `<Image src="${UPLOADED_GIF.src}" alt="file" preview={false}  class="uploaded-gif" />`;
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

    dropzone.on("success", function (file, response) {
      const documentId = response.documentId;
      localStorage.setItem("uploadedPdfDocID", documentId); // You can handle the success response from the API here

      setTimeout(() => {
        router.push("/me-only-flow3");
      }, 2000);
    });

    dropzone.on("error", function (file, errorMessage) {
      notification.error({
        message: "Upload Failed!",
        description: `${errorMessage}`,
        duration: 1,
        placement: "bottomRight",
      });
    });

    return () => dropzone.destroy();
  }, [router]);

  return (
    <div ref={dropzoneRef} className="dropzone dropzone-hero-upload">
      <div className="dz-message">
        <div className="dropzone-hero-inner">
          <div className="ant-upload-drag-icon mb-20">
            <Image src={UPLOAD.src} preview={false} alt="upload" />
          </div>
          <Button size="large" type="primary" className="mb-15">
            Choose File
          </Button>
          <p className="hero-upload-desc">or drop PDF, DocX files here.</p>
        </div>
      </div>
    </div>
  );
};

export default UploadDocu;
