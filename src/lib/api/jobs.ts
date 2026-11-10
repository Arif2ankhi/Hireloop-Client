import { API_BASE_URL } from "@/lib/api/config";
import type { JobFormData } from "@/lib/types/job-form-data";

export const getJobs = async (query = ""): Promise<JobFormData[]> => {
    try {
        // 3s cap so a stopped backend can't hang the page render.
        const res = await fetch(`${API_BASE_URL}/jobs?${query}`, {
            signal: AbortSignal.timeout(3000),
        })

        if (!res.ok) {
            throw new Error(`getJobs failed: ${res.status}`)
        }

        return (await res.json()) as JobFormData[]
    } catch (err) {
        // Backend offline → render an empty table instead of crashing the
        // whole route (the previous behavior threw ECONNREFUSED on render).
        console.error("getJobs unavailable:", err)
        return []
    }
}

export const deleteJob = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
        signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
        throw new Error(`deleteJob failed: ${res.status}`)
    }

    // 204 No Content responses have no body to parse.
    try {
        return await res.json()
    } catch {
        return null
    }
}