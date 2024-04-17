// actions.js
export const SET_SIGNEE_TYPE='SET_SIGNEE_TYPE'
export const UPDATE_SIGNEES='UPDATE_SIGNEES'
export const CLEAR_SIGNATURES_PLACEHOLDERS = 'CLEAR_SIGNATURES_PLACEHOLDERS';
export const SET_SELECTED_STATUS = 'SET_SELECTED_STATUS';
export const SET_UPLOAD_STATUS = 'SET_UPLOAD_STATUS';
export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export const setSigneeType = (signeeType:any[]) => ({
    type: 'SET_SIGNEE_TYPE',
    payload: {
        signeeType:signeeType
      },
  });
  
  export const updateSignees = (signees) => ({
    type: 'UPDATE_SIGNEES',
    payload: signees,
  });
  export const clearSignaturesAndPlaceholders = () => {
    return {
      type: CLEAR_SIGNATURES_PLACEHOLDERS,
    };
  };
  export const setLoadingState = (isLoading:any) => {
    console.log("Action setLoadingState dispatched, isLoading:", isLoading);
    return {
      type: SET_LOADING_STATE,
      payload: isLoading,
    };
  };
  
export const setSelectedStatus = (status) => ({
  type: SET_SELECTED_STATUS,
  payload: status,
});


export const setUploadStatus = (isUploaded) => {
  return {
    type: SET_UPLOAD_STATUS,
    payload: isUploaded,
  };
};