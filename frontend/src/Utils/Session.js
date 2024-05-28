import Cookies from "js-cookie";
import AuthService from "../Services/AuthService";
import RoutesPath from "./RoutesPath";
import { handleApiErrors } from "./Utils";

const SESSION_TOKEN = "SessionToken";
const FORGOT_PASSWORD_TOKEN = "ForgotPasswordToken";
const USER_DATA = "UserData";
const COOKIE_EXPIRY = 1; // In Days

class SessionManager {
    static shared = new SessionManager();
    tokenListener = [];
    dataListener = [];

    getData = async () => {
        try {
            const response = await AuthService.getDetails();
            if (response) {
                this.storeUserData(response.user);
            }
        } catch (error) {
            handleApiErrors(error);
        }
    };

    setSessionToken(token) {
        Cookies.set(SESSION_TOKEN, token, { expires: COOKIE_EXPIRY });
        this.notifyTokenListeners();
    }

    setForgotPasswordToken(token) {
        localStorage.setItem(FORGOT_PASSWORD_TOKEN, token);
    }

    getForgotPasswordToken() {
        return localStorage.getItem(FORGOT_PASSWORD_TOKEN);
    }

    storeUserData(user) {
        Cookies.set(USER_DATA, JSON.stringify(user), { expires: COOKIE_EXPIRY });
        this.notifyDataListeners();
    }

    getSessionToken() {
        return Cookies.get(SESSION_TOKEN);
    }

    retrieveUserData() {
        const userData = Cookies.get(USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    logout() {
        Cookies.remove(SESSION_TOKEN);
        Cookies.remove(USER_DATA);
        this.notifyTokenListeners();
        this.notifyDataListeners();
        window.location.href = RoutesPath.login;
    }

    // Subscribe a listener to session changes
    subscribeData(listener) {
        this.dataListener?.push(listener);
    }

    // Subscribe a listener to session changes
    subscribeToken(listener) {
        this.tokenListener?.push(listener);
    }

    // Unsubscribe a listener from session changes
    unsubscribeData(listener) {
        this.listeners = this.listeners?.filter((l) => l !== listener);
    }

    // Unsubscribe a listener from session changes
    unsubscribeToken(listener) {
        this.tokenListener = this.tokenListener?.filter((l) => l !== listener);
    }

    // Notify all listeners of session changes
    notifyDataListeners() {
        this.dataListener?.forEach((listener) => listener());
    }

    // Notify all listeners of session changes
    notifyTokenListeners() {
        this.tokenListener?.forEach((listener) => listener());
    }
}

export default SessionManager;
