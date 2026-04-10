import { paths } from "@/api/paths";

const bookmarkUpdate = async (jobObject, navigate) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const jobId = jobObject.id;
  const url = paths.jobs.bookmark(jobId);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + user.accessToken,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export default bookmarkUpdate;
