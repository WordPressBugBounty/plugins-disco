const getDocs = async () => {
	try {
		const response = await fetch(
			'https://discoplugin.com/wp-json/wp/v2/docs?per_page=100'
		);
		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		return data;
	} catch (err) {
		console.error('Failed to fetch docs:', err);
	}
};

const getDocsLength = async () => {
	try {
		const response = await getDocs();
		return response ? response.length : 0;
	} catch (err) {
		console.error('Failed to fetch docs length:', err);
		return 0;
	}
};

export { getDocsLength };

export default getDocs;
