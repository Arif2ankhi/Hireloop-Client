import { getJobs } from '@/lib/api/jobs';


const BrowseJobsPage = async({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {

    const search = await searchParams;

const urlSearch = new URLSearchParams(search as Record<string, string>);
const query = urlSearch.toString();

    console.log('Search params:', query);
    const jobs= await getJobs(query)
     

    return (
        <div>
            <h1 className='text-3xl font bold'>Brows Jobs</h1>
            <ul>
                <div>
                    {
                        jobs.map((job) =>(
                            <li key ={job._id}>{job.title}</li>
                        ))
                    }
                </div>
            </ul>
        </div>
    );
};

export default BrowseJobsPage;

