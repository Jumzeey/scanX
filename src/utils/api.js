import axios from '../lib/axios'
// client_id: 6,
// client_secret: 'YgvHmPQ3iwqvbcdtdgd8L5zyJ1Pa0J27LfngOJN8',

export const getRandomPrize = async (payload) => {
  try {
    const response = await axios.post('prize/random', payload)

    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getAllVendors = async (name) => {
  try {
    const response = await axios.get('auth/vendor', { name })

    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const refreshApp = async () => {
  try {
    const response = await axios.delete('settings/refreshAuth')
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const adminLogin = async (payload) => {
  try {
    const response = await axios.post('auth/login', {
      ...payload,
      client_id: 3,
      client_secret: 'Nbz3vujBeqgCqNgcRyZm0sA72sJ6DDTVPmDPegIS',
      // client_secret: 'ymcwi1vcQKmI7nZQJ02AA98wBoYWChfdu2oeK0Fh',
    })
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getUser = async () => {
  try {
    const response = await axios.get('user')
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const registerUser = async (payload) => {
  try {
    const response = await axios.post('auth/register', {
      ...payload,
      client_id: 3,
      client_secret: 'Nbz3vujBeqgCqNgcRyZm0sA72sJ6DDTVPmDPegIS',
      // client_secret: 'ymcwi1vcQKmI7nZQJ02AA98wBoYWChfdu2oeK0Fh',
    })
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const importUsers = async (payload) => {
  try {
    const response = await axios.post('auth/import', payload)
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const logoutUser = async () => {
  try {
    const response = await axios.get('auth/logout')
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getPrizes = async () => {
  try {
    const response = await axios.get('prize')
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}


export const deletePrize = async (id) => {
  try {
    const response = await axios.delete(`prize/${id}`)
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}
export const editVendorsFunc = async (data, refetch) => {
  try {
    const response = await axios.post('https://scanx.live/api/v1/auth/edit_admin_vendor/', data)
    // return { data: response.data }
    if(response?.status === 201){
      console.log({ data: response.data })
      refetch()
    }
  } catch (e) {
    return { error: e }
  }
}
export const allocatePrize = async () => {
  try {
    const payload = { admin_id: '4532' };
    
    const response = await axios.get('https://scanx.live/api/v1/auth/all_admin_prize', {
      params: payload
    });

    console.log({ data: response.data });
    // refetch(); // Not sure what refetch does, but you might want to use it accordingly
    return response.data; // Return the response data as a promise
  } catch (e) {
    console.error(e);
    return { error: e };
  }
};


export const getAllAdmin = async () => {
  try {
    const response = await axios.get('https://scanx.live/api/v1/auth/admin_all_vendors');
    console.log({ data: response.data });
    // refetch(); // Not sure what refetch does, but you might want to use it accordingly
    return response.data; // Return the response data as a promise
  } catch (e) {
    console.error(e);
    return { error: e };
  }
};


export const addPrize = async (payload) => {
  try {
    const response = await axios.post('prize', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getSettings = async (id) => {
  try {
    const response = await axios.get(`settings/${id}`)
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getSiteKey = async () => {
  try {
    const response = await axios.get('settings/sitekey')
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const changeSettings = async (payload) => {
  try {
    const response = await axios.post('settings/update', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const redeemPrize = async (id, payload) => {
  try {
    const response = await axios.put(`prize/redeem/${id}`, payload)
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getWins = async () => {
  try {
    const response = await axios.get(`win`)
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getUserRedeemList = async () => {
  try {
    const response = await axios.get(`redeem/my-list`)
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}

export const getUserAllRedeemList = async () => {
  try {
    const response = await axios.get(`redeem`)
    return { data: response.data }
  } catch (e) {
    return { error: e }
  }
}