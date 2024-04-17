import SettingLayout from "@/Components/Common/SettingLayout";
import KycModal from "@/Components/Modal/KycModal";
import SignatureModal from "@/Components/Modal/SignatureModal";
import {
  ARROW_DOWN,
  MOCK_INITIAL_BIG,
  MOCK_SIGN_BIG,
  SHIELD,
  TRASH_DARK,
  TRASH_GRAY,
  VERIFIED,
} from "@/Components/utils/image-constants";
import { DEV_BASE_URL } from "@/config";
import {
  Button,
  Form,
  Input,
  Image,
  Row,
  Col,
  Divider,
  Upload,
  message,
  Select,
  Checkbox,
  notification,
  Spin,
} from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import EmailChangeVerifyOtp from "@/Components/Modal/EmailChangeVerifyOtp";
import ChangePasswordModal from "@/Components/Modal/ChangePasswordModal";
import { timezoneData } from "@/Components/utils/timezone";
import ProfileSkeleton from "@/Components/Common/Skeletons/ProfileSkeleton";
import { json } from "stream/consumers";

const ProfileSettings = () => {
  const today = new Date();

  // State for name input
  const [name, setName] = useState(" ");
  const [editableName, setEditableName] = useState(name);
  const [isInputReadOnly, setIsInputReadOnly] = useState(true);

  // State for email input
  const [email, setEmail] = useState(" ");
  const [editableEmail, setEditableEmail] = useState(email);
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(true);
  const [verifyEmailOtp, setVerifyEmailOtp] = useState(false);

  // State for password input
  const [password, setPassword] = useState(" ");
  const [changePswdModal, setChangePswdModal] = useState(false);

  //for kyc - aadhar and pan
  const [aadhar, setAadhar] = useState("4569 1111 2222");
  const [aadharVerified, setAadharVerified] = useState(false);

  const [pan, setPan] = useState("NVGOT0492D");
  const [panVerified, setPanVerified] = useState(true);

  // console.log(timezoneData)

  const [signatures, setSignatures] = useState([]);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null when adding, index when editing

  const [initials, setInitials] = useState([]); // to manage multiple signatures
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [editingIndexInitial, setEditingIndexInitial] = useState(null); // null when adding, index when editing
  const [initialData, setInitialData] = useState<any>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // upload =====================================================
  const [fileList, setFileList] = useState([]);
  const fetchProfileData = async () => {
    setProfileLoaded(true);
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const response = await axios.get(`${DEV_BASE_URL}/user/profile`, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      console.log(response.data.user, "yo");
      setInitialData(response.data.user);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setProfileLoaded(false);
    }
  };
  useEffect(() => {
    

    fetchProfileData();
  }, []);

  const [form] = Form.useForm();
  useEffect(() => {
    if (initialData && initialData.user) {
      const user = initialData.user;

      // Set name and editableName
      setName(user.fullName || "");
      setEditableName(user.fullName || "");

      // Set email and editableEmail
      setEmail(user.email || "");
      setEditableEmail(user.email || "");

      // Update signatures state with user's signatures
    const signaturesUrls = initialData.userSignaturesFileUrls?.map(signature => {
  const matchingSignature = initialData.user.mySignatures?.find(s => s.fileName === signature.fileName);
  return {
    data: signature.url,
    default: matchingSignature?.isDefault || false,
    _id: matchingSignature?._id // Include _id here
  };
});
setSignatures(signaturesUrls);
const initialsUrls = initialData.userSignInitialsFileUrls?.map(initial => {
  const matchingInitial = initialData.user.mySignIntial?.find(i => i.fileName === initial.fileName);
  return {
    data: initial.url,
    default: matchingInitial?.isDefault || false,
    _id: matchingInitial?._id 
  };
});
setInitials(initialsUrls);
      setFileList(user.avatar ? [{
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: initialData.userAvatarFileUrl,
      }] : []);


      form.setFieldsValue({
        myDateFromat: moment(today).format(user.myDateFormat),
   
      });


      form.setFieldsValue({
         myTimeZoneFromat: user?.myTimeZoneFormat,
       
      });

      form.setFieldsValue({
        myTimeFromat: user?.myTimeFormat,
        // myTimeFromat: 12
      });
      form.setFieldsValue({
        // myDateFromat: initialData?.myDateFormat,
        myDateFromat: moment(today).format("MMM DD, YYYY")
      });
    }
}, [initialData]);

  const [Nameform] = Form.useForm();
  useEffect(() => {
    Nameform.setFieldsValue({ name: editableName });
  }, [editableName, Nameform]);
  const [emailForm] = Form.useForm();

  useEffect(() => {
    emailForm.setFieldsValue({ email: editableEmail });
  }, [editableEmail, emailForm]);
  const handleChange = async (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(fileList);

    if (fileList.length > 0) {
      const token = sessionStorage.getItem("accessToken") || "";
      const formData = new FormData();
      const userData: any = {};
      const userDataString = JSON.stringify(userData);
      formData.append("file", fileList[0].originFileObj);
      // formData.append("userData", userDataString);
      try {
        const response = await axios.put(
          `${DEV_BASE_URL}/user/update-profile-pic`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success === true) {
          notification.success({
            message: "Success!",
            description: `${response.data.message}.`,
            placement: "bottomRight",
            className: "toast-primary",
            duration: 2,
          });
        } else {
          notification.error({
            message: "Error!",
            description: `${response.data.message}.`,
            placement: "bottomRight",
            className: "toast-primary",
            duration: 2,
          });
        }
        console.log(response.data);
      } catch (error) {
        notification.error({
          message: "Error!",
          description: `Failed to upload image.`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        console.error("Error uploading image:", error);
      }
    }
  };

  console.log(initials?.length,"length")

  const handlePreview = async (file) => {
    let src = file.url || file.preview;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    // You can implement a preview modal here to show the image
    const image = new window.Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  const deleteSignatureApiCall = async (signatureId) => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const response = await axios.delete(`${DEV_BASE_URL}/user/delete-file`, {
        data: { signatureId },
        headers: {
          Authorization: `${token}`,
        },
      });
  
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Signature deleted successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        // Remove the signature from state
        const updatedSignatures = signatures.filter(signature => signature._id !== signatureId);
        setSignatures(updatedSignatures);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting signature:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete signature.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };
  
  const deleteInitialApiCall = async (initialId) => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const response = await axios.delete(`${DEV_BASE_URL}/user/delete-file`, {
        headers: {
          Authorization: `${token}`,
        },
        data: { signInitialId: initialId }, 
      });
  
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Initial deleted successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        // Update state to reflect the deletion
        const updatedInitials = initials?.filter(initial => initial._id !== initialId);
        setInitials(updatedInitials);
      } else {
        throw new Error(response.data.message || "Failed to delete initial.");
      }
    } catch (error) {
      console.error("Error deleting initial:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to delete initial.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };
  
  


  // Function to delete the profile picture
const deleteProfilePicture = async () => {
  try {
    const token = sessionStorage.getItem("accessToken") || "";
  const body ={
    avatar:true
  }
  const response = await axios.delete(`${DEV_BASE_URL}/user/delete-file`, {
    data: body, 
    headers: {
      Authorization: `${token}`,
    },
  });
   
    if (response.data.success) {
    
      setFileList([]);
      notification.success({
        message: "Success!",
        description: "Profile picture removed successfully.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    } else {
      notification.error({
        message: "Error",
        description: "An error occurred while deleting the profile picture.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    
    }
  } catch (error) {
 
    console.error("Error deleting profile picture:", error);
    notification.error({
      message: "Error",
      description: error.message || "An error occurred while deleting the profile picture.",
      placement: "bottomRight",
      className: "toast-primary",
      duration: 2,
    });
  }
};
const handleRemove = () => {
  deleteProfilePicture();
};




  //signatures ====================================================
  const openSignatureModal = (index = null) => {
    console.log("index for sign:", index);
    setEditingIndex(index);
    setIsSignatureModalOpen(true);
  };

  const closeSignatureModal = () => {
    setIsSignatureModalOpen(false);
    setEditingIndex(null); // Reset editing index when modal is closed
  };

  const saveSignature = async (newSignatureData) => {
    console.log("12345indexis: ", editingIndex, "sign is:", newSignatureData);
    if (editingIndex !== null) {
      // Editing an existing signature
      const updatedSignatures = signatures?.map((signature, idx) =>
        idx === editingIndex
          ? { ...signature, data: newSignatureData }
          : signature
      );
      setSignatures(updatedSignatures);
    } else {
      // Adding a new signature
      if (signatures?.length < 3) {
        const newSignature = {
          data: newSignatureData,
          default: signatures.length === 0,
        };
        setSignatures([...signatures, newSignature]);
      }
    }
    closeSignatureModal();
    const base64 = newSignatureData.split(",")[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const fileName = `signature_${new Date().getTime()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const token = sessionStorage.getItem("accessToken") || "";
    const formData = new FormData();
    const userData: any = {};
    const userDataString = JSON.stringify(userData);
    formData.append("file", file);
    // formData.append("userData", userDataString);
    try {
      const response = await axios.put(
        `${DEV_BASE_URL}/user/upload-signature`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
     
        notification.success({
          message: "Success",
          description: `Signature successfully added.`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        fetchProfileData()
        console.log(response.data);
      } else {
        notification.error({
          message: "error!",
          description: `An error occured while adding the signature.`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
    }
  };
  const updateName = async (newName) => {
   
    const formData = new FormData();
    const body={
     fullName: newName
    }
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const response = await axios.put(
        `${DEV_BASE_URL}/user/update-fullname`,
        body,
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Name updated successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Failed to update name.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Error updating name:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while updating the name.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };

  const deleteSignature = (indexToDelete) => {
    const signatureId = signatures[indexToDelete]._id;
    deleteSignatureApiCall(signatureId);
  };

  // ===================================================================
  // initails ==================================================================

  const openInitialModal = (index = null) => {
    setIsInitialModalOpen(true);
    setEditingIndexInitial(index); // Set to null for adding a new signature, or to the index of the signature being edited
  };

  const closeInitialModal = () => {
    setIsInitialModalOpen(false);
    setEditingIndexInitial(null); // Reset editing index when modal is closed
  };

  const saveInitial = async (newInitialData) => {
    if (editingIndexInitial !== null) {
      // Editing an existing signature
      const updatedInitials = initials?.map((initial, idx) =>
        idx === editingIndexInitial
          ? { ...initial, data: newInitialData }
          : initial
      );
      setInitials(updatedInitials);
    } else {
      // Adding a new signature
      if (initials?.length < 3) {
        const newInitial = {
          data: newInitialData,
          default: initials?.length === 0,
        };
        setInitials([...initials, newInitial]);
      }
    }
    closeInitialModal();

    const base64 = newInitialData.split(",")[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const fileName = `signature_${new Date().getTime()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });

    const token = sessionStorage.getItem("accessToken") || "";
    const formData = new FormData();
    const userData: any = {};
    const userDataString = JSON.stringify(userData);
    formData.append("file", file);
    // formData.append("userData", userDataString);

    try {
      const response = await axios.put(
        `${DEV_BASE_URL}/user/upload-sign-initials`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        
        notification.success({
          message: "Success!",
          description: `Initial successfully added.`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        fetchProfileData()
        console.log(response.data);
      } else {
        notification.error({
          message: "error!",
          description: `An error occured while adding the initial.`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error uploading initial:", error);
    }
  };

  const deleteInitial = (indexToDelete) => {
    const initialId = initials[indexToDelete]._id;
    deleteInitialApiCall(initialId);
    console.log(initialId,"yid")
  };

  const changeDefaultInitial = (newDefaultIndex) => {
    // const updatedInitials = initials.map((initial, index) => ({
    //   ...initial,
    //   default: index === newDefaultIndex,
    // }));
    // setInitials(updatedInitials);
    // notification.success({
    //   message: "Success!",
    //   description: `Default initial successfully changed.`,
    //   placement: "bottomRight",
    //   className: "toast-primary",
    //   duration: 2,
    // });


    const initialId = initials[newDefaultIndex]._id;
    updateDefaultInitial(initialId, () => {
      // Update the state to reflect the change immediately
      const updatedSignatures = initials?.map((signature, index) => ({
        ...signature,
        default: index === newDefaultIndex,
      }));
      setInitials(updatedSignatures);
    });
  };

  
  // ==================================================================

  // Handlers for name input
  const toggleNameReadOnly = () => {
    if (!isInputReadOnly) {
      setName(editableName);
    }
    setIsInputReadOnly(!isInputReadOnly);
  };
  const saveName = (values) => {
    console.log("Name:", values.name);
    updateName(values.name);
    setName(editableName);
    setIsInputReadOnly(true);
  };

  const toggleEmailReadOnly = () => {
    if (!isEmailReadOnly) {
      setEmail(editableEmail);
    }
    setIsEmailReadOnly(!isEmailReadOnly);
  };

  const saveEmail = async (values) => {
    // const formData = new FormData();
    // let userData: any = {
    //     newEmail:values. email
    // };
    // formData.append("userData", JSON.stringify(userData))
    console.log(values);
    const token = sessionStorage.getItem("accessToken") || "";
    try {
      const response = await axios.put(
        `${DEV_BASE_URL}/user/update-email-otp`,
        {
          newEmail: values.email,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: `${response.data.message}`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        setVerifyEmailOtp(true);
      } else {
        notification.error({
          message: "Error",
          description: `${response.data.message}`,
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Error initiating OTP request:", error);
      message.error("Failed to initiate OTP request.");
    }
  };

  const savePassword = (values) => {
    console.log("Password:", values);
  };

  const updateDefaultSign = async (signatureId, callback) => {
    const token = sessionStorage.getItem("accessToken") || "";
    const url = `${DEV_BASE_URL}/user/update-default-sign`;
    const headers = {
      Authorization: ` ${token}`,
      'Content-Type': 'application/json'
    };
    const data = JSON.stringify({ signatureId });
  
    try {
      const response = await axios.put(url, data, { headers });
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Default signature updated successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        callback(); 
      } else {
        notification.error({
          message: "Error",
          description:"An error occurred while updating the default signature.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description:"An error occurred while updating the default signature.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
      console.error("Error updating the default signature/initial:", error);
    }
  };
  
  const updateDefaultInitial = async (initialId, callback) => {
    const token = sessionStorage.getItem("accessToken") || "";
    const url = `${DEV_BASE_URL}/user/update-default-sign`;
    const headers = {
      Authorization: ` ${token}`,
      'Content-Type': 'application/json'
    };
    const data = JSON.stringify({ initialId });
  
    try {
      const response = await axios.put(url, data, { headers });
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Default signature updated successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        callback(); 
      } else {
        notification.error({
          message: "Error",
          description:"An error occurred while updating the default Initial.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description:"An error occurred while updating the default Initial.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
      console.error("Error updating the default signature/initial:", error);
    }
  };
  const changeDefaultSignature = (newDefaultIndex) => {
    const signatureId = signatures[newDefaultIndex]._id;
    updateDefaultSign(signatureId, () => {
      // Update the state to reflect the change immediately
      const updatedSignatures = signatures?.map((signature, index) => ({
        ...signature,
        default: index === newDefaultIndex,
      }));
      setSignatures(updatedSignatures);
    });
  };
  
  const VerifiedDetail = () => {
    return (
      <div className="div-row gap-4">
        <Image
          src={VERIFIED.src}
          preview={false}
          alt="verified"
          height={16}
          width={16}
          className="img-centered"
        />
        <p className="text-green3 font-500 text-14">Verified</p>
      </div>
    );
  };

  const updateDateFormat = async (date) => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const formData = new FormData();
    
      const body={
        dateFormat : date
    }
      const response = await axios.put(
        `${DEV_BASE_URL}/user/update-date`,
       body,
        {
          headers: {
            Authorization: `${token}`,
          
          },
        }
      );
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Date Format updated successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        // Optionally, update the state or perform any actions after the timezone is updated
      } else {
        notification.error({
          message: "Error",
          description: "Failed to update the Date Format.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Error updating Date Format:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while updating the Date Format.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };
  const handleChangeDate = (value: any) => {
    console.log(value, "date value");
    updateDateFormat(value);
  };

  const updateTimeFormat = async (time: any) => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";

     const body={
      timeFormat : Number(time)
  }
  console.log(typeof time)
      const response = await axios.put(
        `${DEV_BASE_URL}/user/update-time`,
        body,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json"
         
          },
        }
      );
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Time Format updated successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Failed to update the Time Format.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Error updating Date Format:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while updating the Time Format.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };
  const handleChangeTime = (value: any) => {
    console.log(value, "time value");
    updateTimeFormat(value);
  };

  const options = timezoneData?.map((timezone) => ({
    value: timezone.id,
    label: timezone.display_name,
  }));

  const updateTimezone = async (newTimezone) => {
    const selectedTimezone = timezoneData.find(
      (tz: any) => tz.id === newTimezone
    );
    console.log(selectedTimezone,"huuu")
    try {
      const token = sessionStorage.getItem("accessToken") || "";

  const body={
    timeZoneFormat : selectedTimezone?.id
  }
  
      const response = await axios.put(
        `${DEV_BASE_URL}/user/update-time-zone`, JSON.stringify(body), 
        {
         
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json"
      
          },
        }
      );
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Timezone updated successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        
      } else {
        notification.error({
          message: "Error",
          description: "Failed to update the Timezone.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Error updating timezone:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while updating the Timezone.",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };

  const handleChangeTimeZone = (id: any) => {
    console.log(id, "timeZone value");
    updateTimezone(id);
  };

  return (
    <SettingLayout>
      {profileLoaded ? (
        <ProfileSkeleton />
      ) : (
        <div className="bg-white">
          <div className="div-col">
            <p className="text-18 font-600 p-16 text-gray">Profile</p>
            <div className="p-32 div-col gap-32">
              <p className="text-16 font-500 text-p">Account Information</p>
              {/* Uploading display picture  */}
              <div className="div-row gap-6 align-center">
                <Upload
                  listType="picture-card"
                  // onPreview={handlePreview}
                  // onRemove={handleRemove}
                  className="account-display-picture"
                  beforeUpload={(file) => {
                    setFileList([file]);
                    return false;
                  }}
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: false,
                    showDownloadIcon: false,
                  }}
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 0 && (
                    <Button type="primary">Upload Photo</Button>
                  )}
                </Upload>
                {fileList.length >= 1 && (
                  <Button danger onClick={handleRemove}>
                    Remove
                  </Button>
                )}
              </div>
              {/* Separate form for name */}
              <Form
                name="name_form"
                onFinish={saveName}
                autoComplete="off"
                form={Nameform}
              >
                <p className="product-form-label mb-8">Name</p>
                <div className="div-row gap-4">
                  <Form.Item
                    className="form-input--design"
                    name="name"
                    rules={[
                      { required: true, message: "Please enter a name." },
                    ]}
                  >
                    <Input
                      type="text"
                      value={name}
                      readOnly={isInputReadOnly}
                      style={{ width: "320px" }}
                      onChange={(e) => setEditableName(e.target.value)}
                      className="product-input-text"
                      suffix={
                        isInputReadOnly ? (
                          <p
                            className="text-12 font-500 text-link cursor-pointer"
                            onClick={toggleNameReadOnly}
                          >
                            Change
                          </p>
                        ) : null
                      }
                    />
                  </Form.Item>
                  {!isInputReadOnly && (
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        className="ml-10"
                      >
                        Save
                      </Button>
                    </Form.Item>
                  )}
                </div>
              </Form>{" "}
              {/* Separate form for email */}
              <Form form={emailForm} name="email_form" onFinish={saveEmail}>
                <p className="product-form-label mb-8">Email</p>
                <div className="div-row gap-4">
                  <Form.Item
                    className="form-input--design"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter an email address.",
                      },
                      {
                        type: "email",
                        message: "Please enter a valid email address.",
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      value={name}
                      readOnly={isEmailReadOnly}
                      style={{ width: "320px" }}
                      onChange={(e) => setEditableEmail(e.target.value)}
                      className="product-input-text"
                      suffix={
                        isEmailReadOnly ? (
                          <p
                            className="text-12 font-500 text-link cursor-pointer"
                            onClick={toggleEmailReadOnly}
                          >
                            Change
                          </p>
                        ) : null
                      }
                    />
                  </Form.Item>
                  {!isEmailReadOnly && (
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        disabled={!editableEmail.trim()}
                        type="primary"
                        size="large"
                        className="ml-10 h-38"
                      >
                        Verify
                      </Button>
                    </Form.Item>
                  )}
                  <EmailChangeVerifyOtp
                    verifyEmailOtp={verifyEmailOtp}
                    setVerifyEmailOtp={setVerifyEmailOtp}
                    setEmail={setEmail}
                    setIsEmailReadOnly={setIsEmailReadOnly}
                    editableEmail={editableEmail}
                    email={editableEmail}
                  />
                </div>
              </Form>
              {/* seperate form for password  */}
              <div className="p-12 border-dark br-6 w-fit mt-n12">
                <Form
                  name="password_form"
                  onFinish={savePassword}
                  autoComplete="off"
                  initialValues={{ email: email }}
                >
                  <p className="font-500 text-gray text-12 mb-8">Password</p>
                  <div className="div-col gap-4">
                    <Form.Item className="form-input--design" name="password">
                      <Input
                        type="password"
                        defaultValue={"sanjeevani"}
                        readOnly
                        value={password}
                        style={{ width: "296px" }}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-no-border p-0"
                        suffix={
                          <p
                            className="text-12 font-500 text-link cursor-pointer"
                            onClick={() => setChangePswdModal(true)}
                          >
                            Change
                          </p>
                        }
                      />
                    </Form.Item>
                    <ChangePasswordModal
                      changePswdModal={changePswdModal}
                      setChangePswdModal={setChangePswdModal}
                    />
                    <div className="div-row align-center gap-12 w-full">
                      <Image src={SHIELD.src} alt="warning" preview={false} />
                      <p className="text-gray400 text-10 font-500">
                        A secure & stronge password helps protect your <br />
                        ElasticSign Account
                      </p>
                    </div>
                  </div>
                </Form>
              </div>
              <Divider className="m-0" />
              {/* Signatures  */}
              <div className="div-col gap-16">
                <p className="text-16 font-500 text-p">
                  Signatures{" "}
                  <span className="text-gray400 text-11 font-500 ml-6">
                    ( You can add upto 3 signatures )
                  </span>
                </p>
                <div
                  className={`settings-sign-container ${
                    signatures?.length <= 0 ? "gap-0" : "gap-20"
                  }`}
                >
                  {/* Display signatures */}
                  <div className="signatures-display">
                    {signatures?.map((signature, index) => (
                      <div className="settings-sign" key={index}>
                        <div className="space-between w-full h-32">
                          {signature?.default ? (
                            <Button className="green-btn h-20">Default</Button>
                          ) : (
                            <Button
                              type="text"
                              className="text-12 font-500 text-link"
                              onClick={() => changeDefaultSignature(index)}
                            >
                              Make this Default
                            </Button>
                          )}
                          <div className="div-row gap-8">
                            <p
                              className="text-12 font-500 text-link cursor-pointer"
                              onClick={() => openSignatureModal(index)}
                            >
                              Change
                            </p>
                            <Image
                              src={TRASH_GRAY.src}
                              alt="delete"
                              height={14}
                              preview={false}
                              className="img-centered cursor-pointer"
                              onClick={() => deleteSignature(index)}
                            />
                          </div>
                        </div>
                        <Image
                          src={signature?.data}
                          preview={false}
                          alt={`Signature ${index + 1}`}
                          className="settings-sign-img"
                        />
                      </div>
                    ))}
                  </div>
                  {(signatures?.length <= 2 || signatures?.length == undefined) &&(
                    <div
                      className="add-sign-area"
                      onClick={() => openSignatureModal(null)}
                    >
                      <Image
                        src={MOCK_SIGN_BIG.src}
                        preview={false}
                        alt="sign"
                        className="add-sign-area-mock"
                      />
                      <Button className="w-fit">Add Signature</Button>
                    </div>
                  )}
                  <SignatureModal
                    isOpen={isSignatureModalOpen}
                    onClose={closeSignatureModal}
                    onSaveSignature={saveSignature}
                  />
                </div>
              </div>
              <Divider className="m-0" />
              {/* Initials  */}
              <div className="div-col gap-16">
                <p className="text-16 font-500 text-p">
                  Initials{" "}
                  <span className="text-gray400 text-11 font-500 ml-6">
                    ( You can add upto 3 initials )
                  </span>
                </p>
                {/* <div><Button onClick={openInitialModal} disabled={initials.length >= 3}>Add Initials</Button></div> */}
                <div
                  className={`settings-sign-container ${
                    initials?.length <= 0 ? "gap-0" : "gap-20"
                  }`}
                >
                  {/* Display initials */}
                  <div className="signatures-display">
                    {initials?.map((initial, index) => (
                      <div className="settings-sign" key={index}>
                        <div className="space-between w-full h-32">
                          {initial.default ? (
                            <Button className="green-btn h-20">Default</Button>
                          ) : (
                            <Button
                              type="text"
                              className="text-12 font-500 text-link"
                              onClick={() => changeDefaultInitial(index)}
                            >
                              Make this Default
                            </Button>
                          )}
                          <div className="div-row gap-8">
                            <p
                              className="text-12 font-500 text-link cursor-pointer"
                              onClick={() => openInitialModal(index)}
                            >
                              Change
                            </p>

                            <Image
                              src={TRASH_GRAY.src}
                              alt="delete"
                              height={14}
                              preview={false}
                              className="img-centered cursor-pointer"
                              onClick={() => deleteInitial(index)}
                            />
                          </div>
                        </div>
                        <Image
                          src={initial.data}
                          preview={false}
                          alt={`Signature ${index + 1}`}
                          className="settings-sign-img"
                        />
                      </div>
                    ))}
                  </div>
                  {(initials?.length <= 2 || initials?.length == undefined )&& (
                    <div
                      className="add-sign-area"
                      onClick={() => openInitialModal(null)}
                    >
                      <Image
                        src={MOCK_INITIAL_BIG.src}
                        preview={false}
                        alt="initial"
                        className="add-sign-area-mock"
                      />
                      <Button className="w-fit">Add Initial</Button>
                    </div>
                  )}
                  <SignatureModal
                    isOpen={isInitialModalOpen}
                    onClose={closeInitialModal}
                    onSaveSignature={saveInitial}
                  />
                </div>
              </div>
              <Divider className="m-0" />
              {/* Date and Time  */}
              <div className="div-col gap-24">
                <p className="text-16 font-500 text-p">Date & Time</p>
                {/* date format  */}
                <div className="div-col gap-8">
                  <p className="text-gray text-14 font-600">Date Format</p>
                  <Form form={form}>
                    <Form.Item name="myDateFromat">
                      <Select
                        placeholder="Select Date Format"
                        style={{ width: "335px" }}
                        className="h-40 product-select-recipient"
                        
                        suffixIcon={
                          <Image
                            src={ARROW_DOWN.src}
                            alt="select"
                            preview={false}
                          />
                        }
                        onChange={handleChangeDate}
                        popupClassName="select-popup-container"
                        options={[
                          {
                            value: moment(today).format("MMM DD, YYYY"),
                            label: moment(today).format("MMM DD, YYYY"),
                          },
                          {
                            value: moment(today).format("DD MMMM YYYY"),
                            label: moment(today).format("DD MMMM YYYY"),
                          },
                          {
                            value: moment(today).format("MM/DD/YYYY"),
                            label: moment(today).format("MM/DD/YYYY"),
                          },
                          {
                            value: moment(today).format("dddd, MMM D YYYY"),
                            label: moment(today).format("dddd, MMM D YYYY"),
                          },
                        ]}
                      />
                    </Form.Item>
                  </Form>
                </div>
                {/* time format  */}
                <div className="div-col gap-8">
                  <p className="text-gray text-14 font-600">Time Format</p>
                  <Form form={form}>
                    <Form.Item name="myTimeFromat">
                      <Select
                        placeholder="Select Time Zone"
                        style={{ width: "335px" }}
                        popupClassName="select-popup-container"
                        onChange={handleChangeTime}
                        suffixIcon={
                          <Image
                            src={ARROW_DOWN.src}
                            alt="select"
                            preview={false}
                          />
                        }
                        className="h-40 product-select-recipient"
                      >
                        {[
                          { value: 12, label: "12 Hour" },
                          { value: 24, label: "24 Hour" },
                        ]?.map((option) => (
                          <Select.Option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
                {/* timezone format */}
                <div className="div-col gap-8">
                  <p className="text-gray text-14 font-600">
                    Default Time Zone
                  </p>
                  <Form form={form}>
                    <Form.Item name="myTimeZoneFromat">
                      <Select
                        placeholder="Select Time Zone"
                        style={{ width: "335px" }}
                        popupClassName="select-popup-container"
                        onChange={handleChangeTimeZone}
                        suffixIcon={
                          <Image
                            src={ARROW_DOWN.src}
                            alt="select"
                            preview={false}
                          />
                        }
                        className="h-40 product-select-recipient"
                      >
                        {options.map((option) => (
                          <Select.Option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
              </div>
              {/* Notifications */}
              <div className="div-col gap-24">
                <p className="text-16 font-500 text-p">Notifications</p>
                <div className="div-col gap-12">
                  <Checkbox>
                    <span className="text-14 font-400 text-p">
                      Notify me when a document I have sent is opened
                    </span>
                  </Checkbox>
                  <Checkbox>
                    <span className="text-14 font-400 text-p">
                      Send me a daily summary of outstanding documents
                    </span>
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SettingLayout>
  );
};

export default ProfileSettings;
