import api from "@/lib/axios";
import { SignupDto, LoginDto, TokenDto, UserDto } from "@bankme/shared";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

export class AuthService {
  async signup(data: SignupDto): Promise<UserDto> {
    const user = await api.post<UserDto>("/auth/signup", data);
    await this.login({
      login: data.login,
      password: data.password,
    });
    return user.data;
  }

  async login(data: LoginDto): Promise<TokenDto> {
    const token = await api.post<TokenDto>("/auth", data);
    this.setToken(token.data.accessToken);
    return token.data;
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }
    
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }
}
