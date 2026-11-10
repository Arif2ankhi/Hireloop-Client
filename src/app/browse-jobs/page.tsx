import React from 'react';

const BrowseJobsPage = async({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
    const search = await searchParams
    console.log('Search params', search);
    return (
        <div>
            <h1>Brows Jobs</h1>
        </div>
    );
};

export default BrowseJobsPage;

// https://www.linkedin.com/jobs/search-results/?currentJobId=4485356395&eBP=CwEAAAGhwr7XLNs-qZac2BYvrC5CBB8wKX_tB0lbjUeEKOJ1SdwtG7Hv_Ua4xXRmUAE38_EWBqwVSGyp4srPYuKAjRxyiobX7EafndR2yFoPcaRBFjl2SY2TBTAst2IoFEUd3KUF8oHgv4XxF2ewKYCAs-CaTqHqzd1K5upy2rlrsbwdyM2_pZwFmi_855g9hLuqSsM--3SchtETtyhBoft3b9BHwUpkRLMo7HHLJqs9T9RrXCgAxst902OBy4fiV9Z2JUJgB_2IQ24VVhU09lErr0swvN5iVLq6WnIpIKYhavn1IjJDbhrCNvW7UHn5zizkdcom6iIDo-ep5MCkmqIv4Ttddp18WkNQ60pdL1IrK9lLf6ze3Xy4LYO_mn8oqLLvTQer7R6XgHEaMzAotiV0L1s3AVTgZqkqFroNw5vstKwCbWzs06GH070xybQMH7QzmyW0M_Cve8V3vf9dN_jVtQ&refId=GW1PpqxmkM4bZpEz%2BxLlCg%3D%3D&trackingId=MZXe9%2FSGGDTcvJtrVC1MbQ%3D%3D&keywords=full-time%20Information%20Technology%20Technician%2C%20on-site%20or%20hybrid&origin=PREFERENCES_LANDING&referralSearchId=VmqzWRUaHrTrmSpmrO9RNA%3D%3D&geoId=100495523