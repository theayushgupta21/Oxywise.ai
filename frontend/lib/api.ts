const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function googleAuthApi(idToken: string) {
    const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Google authentication failed");
    }

    return res.json(); // { token, user }
}

export async function loginApi(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
    }

    return res.json();
}

export async function signupApi(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Signup failed");
    }

    return res.json();
}