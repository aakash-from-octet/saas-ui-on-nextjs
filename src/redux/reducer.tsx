import { CLEAR_SIGNATURES_PLACEHOLDERS, SET_LOADING_STATE, SET_SELECTED_STATUS, SET_SIGNEE_TYPE, SET_UPLOAD_STATUS, UPDATE_SIGNEES } from "./action";

interface State {
    signeeType:any;
    signees:any;
    signatures: any;
    placeholders:any;
    selectedStatus?:any;
    isUploaded?:any
    isLoading?: any,

}
const initialState = {
    signeeType: 'single',
    signees: [],
    signatures: {},
    placeholders: {},
    selectedStatus: " ",
    isUploaded: false,
    isLoading: false,
  };
  
  const reducer = (state = initialState, action:any) :State=> {
    switch (action.type) {
      case SET_SIGNEE_TYPE:
        return {
          ...state,
          signeeType: action.payload,
        };
      case UPDATE_SIGNEES:
        return {
          ...state,
          signees: action.payload,
        };
        case SET_LOADING_STATE:
          
            return {
                ...state,
                isLoading: action.payload,
            };
        case CLEAR_SIGNATURES_PLACEHOLDERS:
          return {
            ...state,
            signatures: {},
            placeholders: {},
          };
          case SET_SELECTED_STATUS:
            return {
              ...state,
              selectedStatus: action.payload,
            };
            case SET_UPLOAD_STATUS:
              return {
                ...state,
                isUploaded: action.payload,
              };
      default:
        return state;
    }
  };
  
  export default reducer;
  