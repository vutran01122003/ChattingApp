export const countSelector = state => state.count;
export const productSelector = state => state.product;
export const countryCodeSelector = state => state.countryCode.data;
export const selectedCountrySelector = state => state.countryCode.isSlected;
export const otpTokenSelector = state => state.authentication.otpToken;
export const tokenValidSelector = state => state.authentication.is_valid;
export const userSelector = state => state.authentication.user;
export const friendSelector = state => state.friend;