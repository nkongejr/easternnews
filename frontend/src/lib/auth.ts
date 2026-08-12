import Cookies from 'js-cookie';

const TOKEN_KEY = 'eastern_admin_token';

export const setToken = (token: string) => Cookies.set(TOKEN_KEY, token, { expires: 1 });
export const getToken = () => Cookies.get(TOKEN_KEY);
export const clearToken = () => Cookies.remove(TOKEN_KEY);