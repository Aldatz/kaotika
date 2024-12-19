import React, { useState } from 'react';
import Loading from '@/components/Loading';
import Layout from '@/components/Layout';


const Results = () => {
	const [loading, setLoading] = useState(false);
	if (loading) {
    return <Loading />;
	}
  return (
		<Layout>
    	<div>RESULTS</div>
		</Layout>
  )
}



export default Results;