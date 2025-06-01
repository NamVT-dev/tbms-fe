import axios from "axios";

function getTours() {
  return axios.get(`${process.env.REACT_APP_API_URL}tours`);
}

function getTourBySlug(slug) {
  return axios.get(`${process.env.REACT_APP_API_URL}tours/${slug}`);
}

export { getTours, getTourBySlug };
