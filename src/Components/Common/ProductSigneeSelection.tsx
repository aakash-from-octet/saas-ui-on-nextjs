import { Select, Image, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { UP_ARROW_SM, PLUS_CIRCLE } from "@/Components/utils/image-constants";
import AddRecipients from "@/Components/Modal/AddRecipients";
import { useSelector } from "react-redux";
import ManageSignee from "@/Components/Modal/ManageSigneeModal";
import ManageSigneePopup from "@/Components/Modal/ManageSigneePopup";
import axios from "axios";
import { DEV_BASE_URL } from "@/config";
import AvatarDescSkeleton from "./Skeletons/AvatarDescSkeleton";

const ProductSigneeSelection = ({
    className,
    styleColor,
    selectedSigneeOption,
    boxesForOtherSignees,
    setBoxesForOtherSignees,
    setSelectedSigneeOption,
    signers,
    docID,
    handleSigneeSelection,
    size,
    fetchDocumentDetails,
    signatures,
    setSignatures,
    dateElements,
    setDateElements,
    textElements,
    setTextElements
}: {
    fetchDocumentDetails?: any;
    signatures?: any;
    setSignatures?: any;
    setBoxesForOtherSignees?: any;
    boxesForOtherSignees?: any;
    dateElements?: any;
    setDateElements?: any,
    textElements?: any
    setTextElements?: any
    selectedSigneeOption?: any;
    setSelectedSigneeOption?: any;
    signers?: any;
    docID?: any;
    handleSigneeSelection?: any;
    size?: any;
    className?: any;
    styleColor?: any;

}) => {

    const [manageSigneePopup, setmanageSigneepopup] = useState(false);
    const [signeeData, setsigneeData] = useState<any>([])
    const [isManageSigneeModalOpen, setManageSigneeModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    // =========================================================================

    // different color of toolbar
    const signeeColors = useMemo(() => [
        { primary: "#4277FD", secondary: "#C5D5FF", ter: "#F2F5FF" }, // blue shades
        { primary: "#CB6232", secondary: "#FAC8B3", ter: "#FFF3ED" }, // Orange shades
        { primary: "#419E78", secondary: "#AFE6D0", ter: "#E6F8F1" }, // Green shades
        { primary: "#D885A3", secondary: "#F2C1D1", ter: "#F9E6EF" }, // Pink shades
        { primary: "#FFC107", secondary: "#FFE082", ter: "#FFF8E1" }, // Yellow shades
        { primary: "#6A1B9A", secondary: "#B39DDB", ter: "#EDE7F6" }, // Purple shades
    ], []);

    const assignColorsToSignees = (signees, colors) => {
        return signees?.map((signee, index) => {
            // If the signee already has a color, return as is
            if (signee.color) return signee;

            // Otherwise, assign a new color
            const colorIndex = index % colors.length;
            return { ...signee, color: colors[colorIndex] };
        });
    };

    const signeesData = signers;
    // const signeesData = useSelector(
    //     (state: any) => state?.signeeType?.signeeType?.document?.eSigners
    // );

    // const [signersData, setSignersData] = useState(() =>
    //     assignColorsToSignees(signeesData, signeeColors)
    // );

    const [signersData, setSignersData] = useState([]);

    useEffect(() => {
        const updatedSignersData = assignColorsToSignees(signeesData, signeeColors);
        setSignersData(updatedSignersData);
    }, [signeesData]);

    //this is to update the color of border as well
    useEffect(() => {
        if (signersData?.length > 0) {
            const signee = signersData.find(
                (signee) => selectedSigneeOption?.name == signee.name
            );
            if (signee) {
                setSelectedSigneeOption(signee);
                handleSigneeSelection(signee);
            }
        }
    }, [signersData]);



    const handleSignersDataUpdate = (updatedData) => {
        const updatedDataWithColors = assignColorsToSignees(updatedData, signeeColors);
        setSignersData(updatedDataWithColors);
        // setSignersData([...updatedData]);
    };








    // =========================================================================




    useEffect(() => {
        const signeesWithColors = assignColorsToSignees(signers, signeeColors);
        setsigneeData(signeesWithColors);
    }, [docID, signeesData]);


    const handleAddSigneeClick = () => {
        setManageSigneeModalOpen(true);
    };

    const documentOwner =
        signeeData && signeeData.find((signee) => signee.isDocumentOwner);

    useEffect(() => {
        if (signeeData && signeeData?.length > 0) {
            const documentOwner = signeeData.find((signee) => signee.isDocumentOwner);
            if (documentOwner) {
                setSelectedSigneeOption(documentOwner);
            }
        }
    }, [signeeData, setSelectedSigneeOption]);



    const handleSelectChange = (name) => {
        const signee = (signersData.length > 0 ? signersData : signeeData).find(
            (signee) => signee.name === name
        );
        if (signee) {
            setSelectedSigneeOption(signee);
            handleSigneeSelection(signee);
        }
    };
    // const customStyles: any = {
    //     "--ter-color": styleColor?.ter,
    // };
    useEffect(() => {
        const documentOwnerhere = signers && signers.find((signee) => signee.isDocumentOwner);
        setSelectedSigneeOption(documentOwnerhere);
    }, []);

    console.log('selectedSigneeOption', selectedSigneeOption);
    console.log('signersData- product signe', signersData);

    return (
        <div>
            {selectedSigneeOption ?
                <Select
                    // style={customStyles}
                    defaultValue={documentOwner?.name}
                    suffixIcon={
                        <Image src={UP_ARROW_SM.src} alt="select" preview={false} className="img-centered" />
                    }
                    placement="topLeft"
                    value={selectedSigneeOption?.name}
                    onChange={(value) => handleSelectChange(value)}
                    className={`select-signee-here ${className}`}
                    popupClassName="select-signee-popupContainer"
                    options={((signersData || []).length > 0 ? signersData : signeeData || [])
                        // .sort((a, b) => a.name.localeCompare(b.name)) // sort by alphabet
                        .map((signee) => ({
                            value: signee.name,
                            disabled: signee.recipient === 'CC',
                            label: (
                                <div className="div-row align-center gap-8">
                                    <p
                                        className="text-capital signee-selection-initial"
                                        style={{
                                            // color: styleColor?.primary,
                                            // background: styleColor?.secondary,
                                            color: signee?.color?.primary,
                                            background: signee?.color?.secondary,
                                        }}
                                    >
                                        {signee.name ? signee.name[0].toUpperCase() : ""}
                                    </p>
                                    <p className="text-capital signee-selection-name">
                                        {signee.isDocumentOwner ? signee.name + " (Me)" : signee.name}
                                        {signee?.recipient === 'CC' ? ' (cc)' : ''}
                                        <span className="signee-selection-last-name">
                                            {signee.lastName}
                                        </span>
                                    </p>
                                </div>
                            ),
                        }))
                        .concat([
                            {
                                value: signeeData[0]?.isDocumentOwner.name,
                                label: (
                                    <div
                                        className="div-row align-center gap-8"
                                        onClick={handleAddSigneeClick}
                                    >
                                        <Image
                                            src={PLUS_CIRCLE.src}
                                            height={16}
                                            width={16}
                                            alt="select"
                                            preview={false}
                                            className="img-centered"
                                        />
                                        <p className="signee-selection-addsignee">Manage Signee</p>
                                    </div>
                                ),
                            },
                        ])}
                /> : (<AvatarDescSkeleton />)}
            {manageSigneePopup && (
                <ManageSigneePopup
                    manageSigneePopup={manageSigneePopup}
                    setmanageSigneepopup={setmanageSigneepopup}
                    documentId={docID}
                    onSignersDataUpdate={handleSignersDataUpdate}
                    setManageSigneeModalOpen={setManageSigneeModalOpen}
                    dateElements={dateElements}
                    setDateElements={setDateElements}
                    textElements={textElements}
                    setTextElements={setTextElements}
                    fetchDocumentDetails={fetchDocumentDetails}
                />
            )}
            {isManageSigneeModalOpen && (
                <ManageSignee
                    signatures={signatures}
                    dateElements={dateElements}
                    setDateElements={setDateElements}
                    textElements={textElements}
                    setTextElements={setTextElements}
                    setSignatures={setSignatures}
                    isManageSigneeModalOpen={isManageSigneeModalOpen}
                    setManageSigneeModalOpen={setManageSigneeModalOpen}
                    docID={docID}
                    onSignersDataUpdate={handleSignersDataUpdate}
                    resetPdf={fetchDocumentDetails}
                    boxesForOtherSignees={boxesForOtherSignees}
                    setBoxesForOtherSignees={setBoxesForOtherSignees}
                />
            )}
        </div>
    );
};

export default ProductSigneeSelection;
