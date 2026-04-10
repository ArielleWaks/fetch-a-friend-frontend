const API = "/api";

export const paths = {
  auth: {
    signup: `${API}/auth/signup`,
    signin: `${API}/auth/signin`,
  },
  user: {
    all: `${API}/user/all`,
  },
  jobs: {
    open: `${API}/jobs/open`,
    myJobs: `${API}/jobs/myjobs`,
    mySitting: `${API}/jobs/mysitting`,
    myBookmarks: `${API}/jobs/myBookmarkedJobs`,
    add: `${API}/jobs/add`,
    byId: (id) => `${API}/jobs/${id}`,
    sitter: (id) => `${API}/jobs/sitter/${id}`,
    bookmark: (jobId) => `${API}/jobs/bookmark/${jobId}`,
  },
  badges: {
    my: `${API}/badges/mybadges`,
  },
  clients: {
    list: "/clients",
    searchZip: (zip) => `/clients/search?zipCode=${encodeURIComponent(zip)}`,
    byId: (id) => `/clients/${id}`,
  },
};
