export const API = 'https://controlfinance-app.onrender.com/atlas-api'
export const DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
export const DAY_SHORT = ['D','S','T','Q','Q','S','S']

export async function api(path,{token,method='GET',body}={}){
  const response=await fetch(`${API}${path}`,{
    method,
    headers:{
      ...(body?{'Content-Type':'application/json'}:{}),
      ...(token?{Authorization:`Bearer ${token}`}:{})
    },
    body:body?JSON.stringify(body):undefined
  })
  const payload=response.status===204?null:await response.json().catch(()=>({}))
  if(!response.ok) throw new Error(payload?.error||'Não foi possível concluir a ação.')
  return payload
}
