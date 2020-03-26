import axios from 'axios'

const api = axios.create({ 
    baseURL: 'http://localhost:3000/', 
})

export const getPatientInfo = () => api.get('/patient')
export const getReceptionistInfo = () => api.get('/receptionist')
export const getManagerInfo = () => api.get('/manager')
export const getAdminInfo = () => api.get('/admin')
export const prepareLogin = () => api.get('/login')
export const performLogin = (payload) => api.post('/login', payload)
export const prepareRegister = () => api.get('/register')
export const performRegister = (payload) => api.post('/register', payload)
export const doSignout = () => api.get('/signout')
export const getAllClinics = () => api.get('/clinics')
export const getClinic = (id) => api.get(`/clinics/${id}`)
export const getAllDoctors = () => api.get('/doctors')
export const getDoctor = (id) => api.get(`/doctors/${id}`)
export const getDoctorsFromClinic = (id) => api.get(`/clinics/${id}/doctors`)
export const getAllAppointments = () => api.get('/appointments')
export const getAppointment = (id) => api.get(`/appointmnets/${id}`)
export const getAllAnnouncements = () => api.get('/announcements')
export const addClinic = (payload) => api.post('/clinics', payload)
export const addDoctorToClinic = (id, payload) => api.post(`/clinics/${id}/doctor`, payload)
export const addAppointment = (payload) => api.post('/appointments', payload)
export const addAnouncement = (payload) => api.post('/announcements', payload)


const apis = {
    getPatientInfo,
    getReceptionistInfo,
    getManagerInfo,
    getAdminInfo,
    prepareLogin,
    performLogin,
    prepareRegister,
    performRegister,
    doSignout,
    getAllClinics,
    getClinic,
    getAllDoctors,
    getDoctor,
    getDoctorsFromClinic,
    getAllAppointments,
    getAppointment,
    getAllAnnouncements,
    addClinic,
    addDoctorToClinic,
    addAppointment,
    addAnouncement,
}

export default apis