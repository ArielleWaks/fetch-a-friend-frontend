const bookmarkUpdate = async (jobObject, API_URL, navigate) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const jobId = jobObject.id;
    const url = `${API_URL}/jobs/bookmark/${jobId}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + user.accessToken,
          'Content-Type': 'application/json'
        }
      });
  
     if (response.status === 401) {
        localStorage.removeItem("user");
        navigate('/login');
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  export default bookmarkUpdate;