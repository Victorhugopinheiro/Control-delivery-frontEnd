import { cookies } from "next/headers";
import "server-only";
import apiPrivate from "../apiPrivate";


import { AuthApiResponse, AuthUser } from "../auth/types";
import { redirect } from "next/navigation";


async function IsAdmin() {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;


    if (!accessToken && !refreshToken) {
        return false;
    }

    // Build a minimal Cookie header with only auth cookies
    const authCookies = [
        accessToken ? `accessToken=${encodeURIComponent(accessToken)}` : null,
        refreshToken ? `refreshToken=${encodeURIComponent(refreshToken)}` : null,
    ]
        .filter(Boolean)
        .join("; ");


    try {

        const me = await apiPrivate.get<AuthApiResponse>("/api/user/me", {
            headers: {
                Cookie: authCookies,
            },
        });

        console.log("User dataaaaaaaa:", me.data.user.role);


        return me.data.user.role === "ADMIN";


    } catch (error) {
        console.error("Error checking admin status:");
        return false;
    }
}


export async function IsUserAdmin() {

    const role = await IsAdmin();

    if (!role) {
        redirect("/dashboard/employeeMetrics")
    }

}