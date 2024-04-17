import React, { useEffect, useState } from "react";
import { Select, Image } from "antd";
import { DOWN_ARROW_SM } from "@/Components/utils/image-constants";
import { DEV_BASE_URL } from "@/config";
import axios from "axios";

const ElementSigneeSelect = ({
    styleColor,
    documentId,
    className,
    onChangefunc,
    defaultSignee
}) => {
    const [SigneesData, setSigneesData] = useState([]);
    const [elementSigneeOption, setElementSigneeOption] = useState(defaultSignee);

    // console.log('signatures defaults', defaultSignee);
    // console.log('signatres elementSigneeOption', elementSigneeOption);

    console.log('elementSigneeOption', elementSigneeOption);

    useEffect(() => {
        const fetchSigneeData = async () => {
            try {
                const payload = {
                    documentId: documentId
                }
                console.log(documentId, "docid here")
                const response = await axios.post(`${DEV_BASE_URL}/document/details`, payload);
                if (response.data.success) {
                    setSigneesData(response.data.documentSignerDetails.signers);
                    console.log("response", response.data.documentSignerDetails.signers);

                    // Assuming you want to set the default value based on some condition
                    setElementSigneeOption(defaultSignee || response.data.documentSignerDetails.signers[0]);
                }
            } catch (error) {
                console.error("Error fetching signee data:", error);
            }
        };

        if (documentId) {
            fetchSigneeData();
        }
    }, [documentId, defaultSignee]);

    const handleSelectChange = (value) => {
        const selectedSignee = SigneesData.find((signee) => signee.name === value);
        setElementSigneeOption(selectedSignee);
        if (onChangefunc) {
            onChangefunc(selectedSignee);
        }
    };

    const documentOwner =
        SigneesData && SigneesData.find((signee) => signee.isDocumentOwner);
    const singleSignee = SigneesData.length === 1 && documentOwner;

    const customStyles: any = {
        "--ter-color": styleColor?.ter,
    };
    return (
        <div>
            {singleSignee ? (
                <div className="div-row align-center gap-8 editor-single-signee">
                    <div className="img-20">
                        <p
                            className="text-capital signee-selection-initial img-20"
                            style={{
                                color: styleColor?.primary,
                                background: styleColor?.secondary,
                            }}
                        >
                            {documentOwner.name ? documentOwner.name[0].toUpperCase() : ""}
                        </p>
                    </div>
                    <p className="text-capital text-white signee-selection-name overflow-signee-select">
                        {documentOwner.name}
                    </p>
                </div>
            ) : (
                <Select
                    style={customStyles}
                    defaultValue={defaultSignee?.name}
                    suffixIcon={
                        <Image
                            src={DOWN_ARROW_SM.src}
                            alt="select"
                            preview={false}
                            className="img-centered"
                        />
                    }
                    placement="topLeft"
                    value={elementSigneeOption?.name}
                    onChange={handleSelectChange}
                    className={`select-signee-here ${className}`}
                    popupClassName="select-signee-popupContainer"
                    options={SigneesData?.map((signee) => ({
                        value: signee.name,
                        label: (
                            <div className="div-row align-center gap-8">
                                <div className="img-18">
                                    <p
                                        className="text-capital signee-selection-initial img-25"
                                        style={{
                                            color: styleColor?.primary,
                                            background: styleColor?.secondary,
                                            // color: signee?.color?.primary,
                                            // background: signee?.color?.secondary,
                                        }}
                                    >
                                        {signee.name ? signee.name[0].toUpperCase() : ""}
                                    </p>
                                </div>
                                <p className="text-capital signee-selection-name overflow-signee-select">
                                    {signee.name}
                                    <span className="signee-selection-last-name">
                                        {signee.lastName}
                                    </span>
                                    {signee.isDocumentOwner && " (Me)"}
                                </p>
                            </div>
                        ),
                    }))}
                />
            )}
        </div>
    );
};

export default ElementSigneeSelect;