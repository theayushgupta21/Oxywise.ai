const required = ["MONGODB_URI", "JWT_SECRET", "GOOGLE_CLIENT_ID", "GROQ_API_KEY"];

export function validateEnv() {
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error(`❌ Missing required env variables: ${missing.join(", ")}`);
        process.exit(1);
    }
    console.log("✅ Environment variables validated");
}