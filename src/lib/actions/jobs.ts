const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"


// Shape of the job object coming from the New Job form (all fields are
// native form controls, so FormData → Object.fromEntries → flat strings).
export type JobInput = Record<string, string>

export const createJob = async (data: JobInput) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data),

     })

     if (!res.ok) {
        throw new Error(`createJob failed: ${res.status}`)
     }

     return res.json();

    }
    
    
