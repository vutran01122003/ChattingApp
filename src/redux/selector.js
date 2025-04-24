export const countSelector = state => state.count;
export const productSelector = state => state.product;
export const countryCodeSelector = state => state.countryCode.data;
export const selectedCountrySelector = state => state.countryCode.isSlected;
export const otpTokenSelector = state => state.authentication.otpToken;
export const tokenValidSelector = state => state.authentication.is_valid;
export const userSelector = state => state.user.user;
export const messagesSelector = state => state.chat.messages;
export const messagePaginationSelector = state => state.chat.messagePagination;
export const currentConversationSelector = state =>
  state.chat.currentConversation;
export const friendConversationsSelector = state =>
  state.chat.friendConversations;
export const strangerConversationsSelector = state =>
  state.chat.strangerConversations;
export const groupConversationsSelector = state =>
  state.chat.groupConversations;
