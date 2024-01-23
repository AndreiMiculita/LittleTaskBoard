// This service is used by the LoginForm to login a user and by the PrivateRoute to check if a user is logged in.

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';

export default class AuthService {
    // Initializing important variables
    constructor(private domain: string = 'http://localhost:3000/api') {
        this.fetch = this.fetch.bind(this); // React binding stuff
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    async login(username: string, password: string): Promise<any> {
        // Get a token from api server using the fetch api
        const res = await this.fetch(`${this.domain}/auth/login`, {
            method: 'POST',
            data: JSON.stringify({
                username,
                password
            })
        });
        this.setToken(res.token); // Setting the token in localStorage
        return await Promise.resolve(res);
    }

    async register(username: string, password: string): Promise<any> {
        // Get a token from api server using the fetch api
        const res = await this.fetch(`${this.domain}/auth/register`, {
            method: 'POST',
            data: JSON.stringify({
                username,
                password
            })
        });
        this.setToken(res.token); // Setting the token in localStorage
        return await Promise.resolve(res);
    }

    isLoggedIn(): boolean {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // Getting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }

    isTokenExpired(token: string): boolean {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp && decoded.exp < Date.now() / 3600) {
                // Checking if token is expired. N
                return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }

    setToken(idToken: string): void {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    getToken(): string | null {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    logout(): void {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile(): any {
        // Using jwt-decode npm package to decode the token
        const token = this.getToken();
        if (token) {
            return jwtDecode(token);
        }
        return null;
    }

    async fetch(url: string, options: AxiosRequestConfig): Promise<any> {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.isLoggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }

        const response: AxiosResponse = await axios(url, {
            headers,
            ...options
        });
        const response_1 = await this._checkStatus(response);
        return response_1.data;
    }

    _checkStatus(response: AxiosResponse): AxiosResponse {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            // Success status lies between 200 to 300
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }
}
