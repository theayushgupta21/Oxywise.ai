const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

type AuthResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        authProvider?: "local" | "google";
    };
};

type MeResponse = Pick<AuthResponse, "user">;

async function readResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await res.json().catch(() => ({}))
        : {};

    if (!res.ok) {
        throw new Error(body.message || `${fallbackMessage} (HTTP ${res.status})`);
    }

    if (!contentType.includes("application/json")) {
        throw new Error("The API returned HTML instead of JSON. Check NEXT_PUBLIC_API_URL and make sure the backend is running.");
    }

    return body as T;
}

export async function getMeApi(token: string) {
    const res = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return readResponse<MeResponse>(res, "Session expired");
}

export async function googleAuthApi(idToken: string) {
    const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });

    return readResponse<AuthResponse>(res, "Google authentication failed");
}

export async function loginApi(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    return readResponse<AuthResponse>(res, "Login failed");
}

export async function signupApi(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    return readResponse<AuthResponse>(res, "Signup failed");
}