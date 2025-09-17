import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export const useTicketAPI = () => {
  const { token } = useAuth();

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/tickets`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const createTicket = (ticket) => api.post("/create", ticket).then(res => res.data);
  const getTicketsByBuilding = (buildingId) => api.get(`/by-building/${buildingId}`).then(res => res.data);
  const updateTicketStatus = (id, status) => api.put(`/${id}/status?status=${status}`).then(res => res.data);
  const deleteTicket = (id) => api.delete(`/delete/${id}`);

  return { createTicket, getTicketsByBuilding, updateTicketStatus, deleteTicket };
};
