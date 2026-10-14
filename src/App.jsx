import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, Apple, ArrowLeft, BarChart3, Bell, BookOpen, CalendarDays, Check,
  ChevronDown, ChevronRight, CirclePlus, Clock3, Dumbbell, Flame, History,
  Home, LineChart, ListChecks, Lock, LogIn, LogOut, Mail, Menu, MessageCircle, MoreHorizontal,
  Play, Plus, Search, Send, Settings, Share2, Sparkles, TimerReset, Trophy,
  UserPlus, UserRound, UsersRound, Video, X, Zap
} from 'lucide-react'


const API_URL = 'https://controlfinance-app.onrender.com/atlas-api'

const SESSION_STORAGE_KEY = 'atlas.auth.token'

function readStoredToken() {
  try { return localStorage.getItem(SESSION_STORAGE_KEY) || '' } catch { return '' }
}

function storeToken(token) {
  try {
    if (token) localStorage.setItem(SESSION_STORAGE_KEY, token)
    else localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {}
}


function initialsOf(name) {
  const parts=String(name || '').trim().split(/\s+/).filter(Boolean)
  if(!parts.length) return '?'
  return (parts.length===1 ? parts[0].slice(0,2) : parts[0][0]+parts[parts.length-1][0]).toUpperCase()
}

async function apiRequest(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = response.status === 204 ? null : await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error || 'Não foi possível concluir a ação.')
  return payload
}


function Logo({ compact = false }) {
  return <div className={`logo ${compact ? 'compact' : ''}`}>
    <span className="logo-mark"><Activity size={compact ? 18 : 22} strokeWidth={2.5}/></span>
    {!compact && <span>Atlas</span>}
  </div>
}

function Avatar({ initials = 'AS', size = 'md' }) {
  return <div className={`avatar avatar-${size}`}>{initials}</div>
}

function Badge({ children, tone = 'green' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function StatCard({ icon: Icon, label, value, detail }) {
  return <div className="stat-card">
    <div className="stat-icon"><Icon size={19}/></div>
    <div><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>
  </div>
}

function Login({ onEnter }) {
  const [mode, setMode] = useState('welcome')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const loginReal = async () => {
    setBusy('login')
    setError('')
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
      onEnter(data.token, data.user)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  const enterAs = async role => {
    setBusy(role)
    setError('')
    try {
      const data = await apiRequest('/auth/demo-login', { method: 'POST', body: { role } })
      onEnter(data.token, data.user)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  return <div className="auth-screen">
    <div className="auth-decor auth-decor-left"></div>
    <div className="auth-decor auth-decor-right"></div>

    <div className="auth-content">
      <div className="auth-top">
        <div className="auth-logo"><Logo/></div>
        <div className="auth-dots"><span className="active"></span><span></span><span></span></div>
      </div>

      <section className="auth-hero">
        <span className="auth-kicker">TREINE. ACOMPANHE. EVOLUA.</span>
        <h1>Sustente sua força.<br/><em>Supere seus limites.</em></h1>
        <p>Treinos, evolução e contato com seu treinador em uma experiência direta e feita para manter sua constância.</p>
      </section>

      {mode === 'welcome' && <section className="auth-card">
        <button className="auth-primary" onClick={() => {setError('');setMode('login')}}>Entrar</button>
        <button className="auth-outline auth-submit" onClick={() => {setError('');setMode('demo')}}>Acessos de teste</button>
        <small className="auth-brandline">Atlas · treino conectado</small>
      </section>}

      {mode === 'login' && <section className="auth-card auth-form-card">
        <button className="auth-back" onClick={() => {setError('');setMode('welcome')}}><ArrowLeft size={17}/> Voltar</button>
        <span className="eyebrow">Acessar sua conta</span>
        <h2>Entrar no Atlas</h2>
        <p>Use o e-mail e a senha cadastrados na sua conta.</p>
        {error && <div className="auth-error">{error}</div>}
        <label className="field-label">E-mail</label>
        <div className="input-wrap"><Mail size={18}/><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></div>
        <label className="field-label">Senha</label>
        <div className="input-wrap"><Lock size={18}/><input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha" onKeyDown={e=>{if(e.key==='Enter'&&email&&password&&!busy)loginReal()}}/></div>
        <button className="auth-primary auth-submit" disabled={!email||!password||!!busy} onClick={loginReal}>{busy==='login'?'Entrando...':'Entrar'} <LogIn size={18}/></button>
        <small className="auth-brandline">Contas de aluno podem ser criadas através do link de convite do treinador.</small>
      </section>}

      {mode === 'demo' && <section className="auth-card auth-form-card">
        <button className="auth-back" onClick={() => {setError('');setMode('welcome')}}><ArrowLeft size={17}/> Voltar</button>
        <span className="eyebrow">Ambiente de teste</span>
        <h2>Escolha o perfil</h2>
        <p>Use os usuários de teste apenas para validar rapidamente o fluxo.</p>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-primary auth-submit" disabled={!!busy} onClick={() => enterAs('trainer')}><UsersRound size={18}/> {busy === 'trainer' ? 'Entrando...' : 'Professor Atlas'}</button>
        <button className="auth-outline auth-submit" disabled={!!busy} onClick={() => enterAs('student')}><UserRound size={18}/> {busy === 'student' ? 'Entrando...' : 'Aluno Atlas'}</button>
      </section>}
    </div>
  </div>
}

function InviteOnboarding({ inviteToken, onComplete }) {
  const [invite,setInvite]=useState(null)
  const [stage,setStage]=useState('loading')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [auth,setAuth]=useState(null)
  const [days,setDays]=useState([])
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const labels=['D','S','T','Q','Q','S','S']
  const names=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  useEffect(()=>{
    let cancelled=false
    apiRequest(`/invitations/resolve/${inviteToken}`)
      .then(data=>{
        if(cancelled)return
        setInvite(data)
        setStage('choice')
      })
      .catch(e=>{if(!cancelled){setError(e.message);setStage('error')}})
    return()=>{cancelled=true}
  },[inviteToken])

  const register=async()=>{
    setBusy(true);setError('')
    try{
      const data=await apiRequest('/auth/register',{method:'POST',body:{
        name,email,password,inviteToken
      }})
      setAuth(data)
      setStage('availability')
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  const loginAndAccept=async()=>{
    setBusy(true);setError('')
    try{
      const data=await apiRequest('/auth/login',{method:'POST',body:{email,password}})
      if(data.user.role!=='student')throw new Error('Este convite precisa ser aceito por uma conta de aluno.')
      await apiRequest('/invitations/accept-token',{token:data.token,method:'POST',body:{token:inviteToken}})
      setAuth(data)
      setStage('availability')
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  const toggleDay=i=>setDays(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i].sort((a,b)=>a-b))

  const finish=async()=>{
    if(!auth)return
    setBusy(true);setError('')
    try{
      await apiRequest('/availability',{token:auth.token,method:'PUT',body:{days}})
      window.history.replaceState({},'',window.location.pathname)
      onComplete(auth.token,auth.user)
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  if(stage==='loading')return <div className="auth-screen invite-onboarding"><div className="invite-flow-card"><Logo/><div className="invite-loading"><span className="eyebrow">Convite Atlas</span><h1>Carregando convite...</h1><p>Estamos preparando seu acesso.</p></div></div></div>
  if(stage==='error')return <div className="auth-screen invite-onboarding"><div className="invite-flow-card"><Logo/><div className="auth-error">{error}</div><h2>Não foi possível abrir este convite</h2><p>Peça ao treinador um novo link.</p><button className="auth-primary" onClick={()=>window.location.href=window.location.pathname}>Voltar ao Atlas</button></div></div>

  return <div className="auth-screen invite-onboarding">
    <div className="invite-flow-card">
      <div className="invite-flow-top"><Logo/><Badge>Convite de {invite?.trainerName}</Badge></div>

      {stage==='choice'&&<>
        <span className="eyebrow">Você foi convidado</span>
        <h1>Treine com {invite?.trainerName}</h1>
        <p>Use sua conta do Atlas ou crie uma nova. Depois você escolherá os dias em que pode treinar.</p>
        <div className="invite-choice-grid">
          <button className="invite-choice-card" onClick={()=>{setError('');setStage('register')}}><UserPlus size={24}/><div><strong>Criar minha conta</strong><span>Ainda não uso o Atlas</span></div><ChevronRight size={18}/></button>
          <button className="invite-choice-card" onClick={()=>{setError('');setStage('login')}}><LogIn size={24}/><div><strong>Já tenho conta</strong><span>Entrar e aceitar convite</span></div><ChevronRight size={18}/></button>
        </div>
      </>}

      {stage==='register'&&<>
        <button className="auth-back invite-back" onClick={()=>setStage('choice')}><ArrowLeft size={17}/> Voltar</button>
        <span className="eyebrow">Primeiro acesso</span>
        <h1>Crie sua conta</h1>
        <p>Ao finalizar o cadastro, você será vinculado automaticamente a {invite?.trainerName}.</p>
        {error&&<div className="auth-error">{error}</div>}
        <label className="field-label">Nome</label>
        <div className="input-wrap"><UserRound size={18}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome"/></div>
        <label className="field-label">E-mail</label>
        <div className="input-wrap"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></div>
        <label className="field-label">Crie uma senha</label>
        <div className="input-wrap"><Lock size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres"/></div>
        <button className="auth-primary auth-submit" disabled={!name||!email||password.length<8||busy} onClick={register}>{busy?'Criando conta...':'Criar conta e aceitar convite'} <ChevronRight size={18}/></button>
      </>}

      {stage==='login'&&<>
        <button className="auth-back invite-back" onClick={()=>setStage('choice')}><ArrowLeft size={17}/> Voltar</button>
        <span className="eyebrow">Conta existente</span>
        <h1>Entre para aceitar</h1>
        <p>Use sua conta de aluno do Atlas para aceitar o convite de {invite?.trainerName}.</p>
        {error&&<div className="auth-error">{error}</div>}
        <label className="field-label">E-mail</label>
        <div className="input-wrap"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></div>
        <label className="field-label">Senha</label>
        <div className="input-wrap"><Lock size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha"/></div>
        <button className="auth-primary auth-submit" disabled={!email||!password||busy} onClick={loginAndAccept}>{busy?'Entrando...':'Entrar e aceitar convite'} <Check size={18}/></button>
      </>}

      {stage==='availability'&&<>
        <span className="eyebrow">Último passo</span>
        <h1>Quando você pode treinar?</h1>
        <p>Escolha seus dias disponíveis. {invite?.trainerName} verá essa informação para organizar seus treinos.</p>
        {error&&<div className="auth-error">{error}</div>}
        <div className="invite-day-grid">{labels.map((label,i)=><button key={i} className={days.includes(i)?'active':''} onClick={()=>toggleDay(i)}><strong>{label}</strong><small>{names[i]}</small></button>)}</div>
        <div className="invite-availability-summary">{days.length?<><strong>{days.length} dias selecionados</strong><span>{days.map(i=>names[i]).join(' · ')}</span></>:<span>Selecione pelo menos um dia.</span>}</div>
        <button className="auth-primary auth-submit" disabled={!days.length||busy} onClick={finish}>{busy?'Salvando...':'Salvar disponibilidade e entrar'} <Check size={18}/></button>
      </>}
    </div>
  </div>
}

function Topbar({ profile, user, onLogout }) {
  return <header className="topbar">
    <Logo/>
    <div className="topbar-actions">
      <button className="icon-btn"><Bell size={19}/><span className="notification-dot"></span></button>
      <div className="profile-switch">
        <div className="profile-trigger static-profile">
          <Avatar initials={initialsOf(user?.name)} size="sm"/>
          <span><small>{profile === 'student' ? 'Aluno' : 'Treinador'}</small><strong>{user?.name}</strong></span>
        </div>
        <button className="logout-action" onClick={onLogout} title="Sair"><LogOut size={18}/><span>Sair</span></button>
      </div>
    </div>
  </header>
}

function SideNav({ profile, page, setPage }) {
  const student = [
    ['home', Home, 'Início'], ['history', History, 'Histórico'], ['progress', LineChart, 'Evolução'], ['messages', MessageCircle, 'Mensagens']
  ]
  const trainer = [
    ['dashboard', BarChart3, 'Visão geral'], ['students', UsersRound, 'Alunos'], ['workouts', Dumbbell, 'Treinos'], ['library', BookOpen, 'Exercícios'], ['messages', MessageCircle, 'Mensagens']
  ]
  const items = profile === 'student' ? student : trainer
  return <aside className="side-nav">
    <nav>{items.map(([key, Icon, label]) =>
      <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon size={19}/><span>{label}</span></button>
    )}</nav>
    <button className="side-settings"><Settings size={19}/><span>Configurações</span></button>
  </aside>
}

function BottomNav({ profile, page, setPage }) {
  const student = [['home', Home, 'Início'], ['history', History, 'Histórico'], ['progress', LineChart, 'Evolução'], ['messages', MessageCircle, 'Chat']]
  const trainer = [['dashboard', BarChart3, 'Painel'], ['students', UsersRound, 'Alunos'], ['workouts', Dumbbell, 'Treinos'], ['library', BookOpen, 'Biblioteca']]
  return <nav className="bottom-nav">{(profile === 'student' ? student : trainer).map(([key, Icon, label]) =>
    <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon size={20}/><span>{label}</span></button>
  )}</nav>
}

function StudentHome({ setPage, token, user, backend, refreshBackend, onOpenWorkout }) {
  const [routineOpen, setRoutineOpen] = useState(false)
  const [routineDays, setRoutineDays] = useState(backend.availability || [])
  const [busy,setBusy]=useState('')
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')
  const labels = ['D','S','T','Q','Q','S','S']
  const names = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const pendingInvite = backend.invitations.find(i => i.status === 'Pending')
  const acceptedInvite = backend.invitations.find(i => i.status === 'Accepted')
  const workouts = backend.workouts || []
  const currentWorkout = workouts.find(w => !w.latestSession?.completedAt) || workouts[0]
  const completedCount = workouts.filter(w => w.latestSession?.completedAt).length

  useEffect(()=>{ setRoutineDays(backend.availability || []) },[backend.availability])

  const toggleDay = i => setRoutineDays(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i].sort((a,b)=>a-b))

  const acceptInvite = async () => {
    if (!pendingInvite) return
    setBusy('invite');setError('');setMessage('')
    try {
      await apiRequest(`/invitations/${pendingInvite.id}/accept`,{token,method:'POST'})
      setMessage('Convite aceito. Agora escolha sua disponibilidade.')
      await refreshBackend()
    } catch(e) { setError(e.message) } finally { setBusy('') }
  }

  const saveAvailability = async () => {
    setBusy('availability');setError('');setMessage('')
    try {
      await apiRequest('/availability',{token,method:'PUT',body:{days:routineDays}})
      setMessage('Disponibilidade salva. Seu professor já pode usar esses dias na prescrição.')
      await refreshBackend()
      setRoutineOpen(false)
    } catch(e) { setError(e.message) } finally { setBusy('') }
  }

  return <div className="page-stack">
    <section className="welcome-row">
      <div><span className="eyebrow">Seu espaço de treino</span><h1>Boa noite, {user?.name || 'Aluno'} 👋</h1><p>{currentWorkout ? 'Seu treino está pronto. Hoje é dia de construir consistência.' : 'Organize sua rotina e aguarde a prescrição do seu professor.'}</p></div>
      <div className="streak-card"><Flame size={21}/><span><strong>{completedCount} treino{completedCount===1?'':'s'}</strong><small>concluídos</small></span></div>
    </section>

    {error && <div className="app-error-banner">{error}</div>}
    {message && <div className="app-success-banner">{message}</div>}

    {pendingInvite && <section className="panel invite-official-card">
      <div className="panel-head"><div><h3>Convite de treinador</h3><p><strong>{pendingInvite.trainerName}</strong> quer vincular você como aluno.</p></div><Badge>Novo convite</Badge></div>
      <button className="primary-btn" disabled={busy==='invite'} onClick={acceptInvite}><Check size={17}/> {busy==='invite'?'Aceitando...':'Aceitar convite'}</button>
    </section>}

    {currentWorkout ? <section className="today-card">
      <div className="today-main">
        <div className="today-meta"><Badge>{currentWorkout.latestSession?.completedAt ? 'Concluído' : currentWorkout.latestSession ? 'Em andamento' : 'Treino disponível'}</Badge><span><Dumbbell size={15}/> {currentWorkout.model}</span></div>
        <h2>{currentWorkout.name}</h2>
        <p>{currentWorkout.notes || 'Treino prescrito pelo seu professor.'}</p>
        <div className="coach-line"><Avatar initials={initialsOf(currentWorkout.trainerName)} size="sm"/><span>Prescrito por <strong>{currentWorkout.trainerName || 'Treinador'}</strong></span></div>
        {!currentWorkout.latestSession?.completedAt && <button className="primary-btn" onClick={() => onOpenWorkout(currentWorkout.id)}><Play size={18} fill="currentColor"/> {currentWorkout.latestSession ? 'Continuar treino' : 'Iniciar treino'}</button>}
      </div>
      <div className="today-visual">
        <div className="workout-figure"><Dumbbell size={54}/></div>
        <div className="exercise-preview">
          <small>{currentWorkout.exercises?.length || 0} exercícios</small>
          <strong>{(currentWorkout.exercises || []).reduce((sum,e)=>sum+Number(e.sets||0),0)} séries totais</strong>
          <span>{(currentWorkout.scheduledDays || []).map(d=>names[d]).join(' · ')}</span>
        </div>
      </div>
    </section> : <section className="today-card empty-today-card">
      <div className="today-main"><div className="today-meta"><Badge tone="light">Aguardando prescrição</Badge></div><h2>Nenhum treino recebido ainda</h2><p>{acceptedInvite ? 'Seu professor já está vinculado. Salve sua disponibilidade para que ele possa montar seu treino.' : 'Aceite o convite do seu professor para iniciar o fluxo.'}</p></div>
      <div className="today-visual"><div className="workout-figure"><Dumbbell size={54}/></div></div>
    </section>}

    <div className="section-title"><div><h2>Meus treinos</h2><p>Prescrições recebidas do seu professor.</p></div><button onClick={() => setPage('history')}>Ver histórico <ChevronRight size={16}/></button></div>
    <section className="panel no-pad upcoming-main">
      <div className="compact-list">
        {workouts.length ? workouts.map((w,i) => <button className="compact-row upcoming-row" key={w.id} onClick={()=>!w.latestSession?.completedAt&&onOpenWorkout(w.id)}>
          <div className="date-box"><strong>{String(i+1).padStart(2,'0')}</strong><small>{w.model}</small></div>
          <div><strong>{w.name}</strong><small>{(w.scheduledDays||[]).map(d=>names[d]).join(' · ') || 'Sem dias definidos'}</small></div>
          <Badge tone={w.latestSession?.completedAt?'green':'light'}>{w.latestSession?.completedAt?'Concluído':w.latestSession?'Em andamento':'Pendente'}</Badge><ChevronRight size={18}/>
        </button>) : <div className="empty-state">Nenhum treino prescrito ainda.</div>}
      </div>
    </section>

    <div className="grid-2">
      <section className="panel routine-card">
        <div className="panel-head"><div><h3>Minha rotina</h3><p>Você escolhe os dias disponíveis; o treinador distribui seus treinos.</p></div><CalendarDays size={20}/></div>
        <div className="routine-days">
          {labels.map((d,i) => <span key={i} className={routineDays.includes(i) ? 'active' : ''}>{d}</span>)}
        </div>
        <div className="routine-copy"><strong>{routineDays.length} dias por semana</strong><span>{routineDays.map(i => names[i]).join(' · ') || 'Nenhum dia selecionado'}</span></div>
        <button className="secondary-btn compact" disabled={!acceptedInvite && !pendingInvite} onClick={() => setRoutineOpen(true)}>Editar disponibilidade</button>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h3>Resumo</h3><p>Dados do seu fluxo atual.</p></div><Trophy size={20}/></div>
        <div className="month-summary">
          <div className="progress-ring" style={{'--progress':`${workouts.length ? Math.round(completedCount/workouts.length*100) : 0}%`}}><span>{workouts.length ? Math.round(completedCount/workouts.length*100) : 0}<small>%</small></span></div>
          <div><strong>{completedCount} de {workouts.length} treinos</strong><span>{completedCount ? 'Treinos concluídos ficam registrados no histórico.' : 'Conclua seu primeiro treino para iniciar seu histórico.'}</span></div>
        </div>
      </section>
    </div>

    {routineOpen && <div className="modal-backdrop" onClick={() => setRoutineOpen(false)}><div className="standard-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setRoutineOpen(false)}><X size={18}/></button>
      <div className="modal-icon"><CalendarDays size={23}/></div><h2>Escolha sua rotina</h2>
      <p>Selecione os dias em que você consegue treinar. Seu treinador verá exatamente essa disponibilidade.</p>
      <div className="weekday-picker routine-picker">{labels.map((d,i)=><button key={i} className={routineDays.includes(i)?'active':''} onClick={()=>toggleDay(i)}>{d}</button>)}</div>
      <button className="primary-btn full" disabled={!routineDays.length || busy==='availability'} onClick={saveAvailability}>{busy==='availability'?'Salvando...':'Salvar disponibilidade'} <Check size={17}/></button>
    </div></div>}
  </div>
}

function WorkoutExecution({ setPage, token, workout, refreshBackend }) {
  const [timer, setTimer] = useState(false)
  const [openExercise, setOpenExercise] = useState(null)
  const [session,setSession]=useState(null)
  const [drafts,setDrafts]=useState({})
  const [saved,setSaved]=useState({})
  const [loading,setLoading]=useState(true)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    const loadSession=async()=>{
      if(!workout){setLoading(false);return}
      try{
        const started=workout.latestSession && !workout.latestSession.completedAt
          ? workout.latestSession
          : await apiRequest(`/workouts/${workout.id}/start`,{token,method:'POST'})
        const data=await apiRequest(`/sessions/${started.id}`,{token})
        if(cancelled)return
        setSession(data)
        setOpenExercise(data.exercises?.[0]?.id || null)
        const nextDrafts={},nextSaved={}
        for(const ex of data.exercises || []){
          for(let n=1;n<=ex.sets;n++){
            const log=(data.logs||[]).find(item=>item.exerciseId===ex.id && item.setNumber===n)
            const key=`${ex.id}:${n}`
            nextDrafts[key]={reps:log?.reps ?? ex.reps,weight:log?.weight ?? ex.suggestedWeight}
            if(log?.completed)nextSaved[key]=true
          }
        }
        setDrafts(nextDrafts);setSaved(nextSaved)
      }catch(e){if(!cancelled)setError(e.message)}finally{if(!cancelled)setLoading(false)}
    }
    loadSession()
    return()=>{cancelled=true}
  },[workout?.id])

  const saveSet=async(exerciseId,setNumber)=>{
    if(!session)return
    const key=`${exerciseId}:${setNumber}`
    const draft=drafts[key] || {}
    setBusy(key);setError('')
    try{
      await apiRequest(`/sessions/${session.id}/exercises/${exerciseId}/sets/${setNumber}`,{
        token,method:'PUT',body:{reps:Number(draft.reps)||0,weight:Number(draft.weight)||0}
      })
      setSaved(v=>({...v,[key]:true}))
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  const finish=async()=>{
    if(!session)return
    setBusy('finish');setError('')
    try{
      await apiRequest(`/sessions/${session.id}/complete`,{token,method:'POST',body:{notes:'Treino concluído pelo aluno no Atlas.'}})
      await refreshBackend()
      setPage('home')
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  if(loading)return <div className="page-stack"><section className="panel empty-state"><Dumbbell size={30}/><h2>Preparando treino...</h2><p>Carregando sua sessão no backend.</p></section></div>
  if(!workout)return <div className="page-stack"><button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Voltar ao início</button><section className="panel empty-state"><h2>Nenhum treino disponível</h2><p>Aguarde uma prescrição do seu professor.</p></section></div>
  if(error && !session)return <div className="page-stack"><button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Voltar ao início</button><div className="app-error-banner">{error}</div></div>

  const sessionExercises=session?.exercises || []
  const totalSets=sessionExercises.reduce((sum,ex)=>sum+Number(ex.sets||0),0)
  const savedCount=Object.values(saved).filter(Boolean).length
  const exerciseComplete=ex=>Array.from({length:ex.sets},(_,i)=>saved[`${ex.id}:${i+1}`]).every(Boolean)

  return <div className="page-stack">
    <button className="back-link" onClick={() => setPage('home')}><ArrowLeft size={17}/> Voltar ao início</button>
    {error && <div className="app-error-banner">{error}</div>}
    <section className="workout-header">
      <div><div className="today-meta"><Badge>Em andamento</Badge><span><Dumbbell size={15}/> {workout.model}</span></div><h1>{workout.name}</h1><p>{workout.notes || 'Complete cada série e registre sua carga real.'}</p></div>
      <button className="secondary-btn" onClick={() => setTimer(true)}><TimerReset size={18}/> Descanso</button>
    </section>
    <div className="workout-progress"><div><span>Progresso do treino</span><strong>{savedCount}/{totalSets} séries</strong></div><div className="bar"><i style={{width:`${totalSets?savedCount/totalSets*100:0}%`}}></i></div></div>

    <div className="exercise-stack">
      {sessionExercises.map((ex,idx) => <section key={ex.id} className={`exercise-card ${exerciseComplete(ex) ? 'completed' : ''}`}>
        <button className="exercise-summary" onClick={() => setOpenExercise(openExercise === ex.id ? null : ex.id)}>
          <span className="exercise-index">{exerciseComplete(ex) ? <Check size={17}/> : idx+1}</span>
          <div><strong>{ex.name}</strong><small>{ex.sets} séries · {ex.reps} reps · {ex.restSeconds}s descanso</small></div>
          <span className="video-icon"><Video size={18}/></span>
          <ChevronDown size={18} className={openExercise === ex.id ? 'rotate' : ''}/>
        </button>
        {openExercise === ex.id && <div className="exercise-detail">
          <div className="set-table">
            <div className="set-row header"><span>Série</span><span>Carga</span><span>Reps</span><span></span></div>
            {Array.from({length:ex.sets},(_,i)=>i+1).map(n => {
              const key=`${ex.id}:${n}`
              const draft=drafts[key] || {}
              return <div className={`set-row ${saved[key]?'set-row-saved':''}`} key={n}>
                <strong>{n}</strong>
                <input type="number" step="0.5" value={draft.weight ?? ''} onChange={e=>{setDrafts(v=>({...v,[key]:{...v[key],weight:e.target.value}}));setSaved(v=>({...v,[key]:false}))}}/>
                <input type="number" value={draft.reps ?? ''} onChange={e=>{setDrafts(v=>({...v,[key]:{...v[key],reps:e.target.value}}));setSaved(v=>({...v,[key]:false}))}}/>
                <button className="set-check" disabled={busy===key} onClick={()=>saveSet(ex.id,n)}>{busy===key?'…':<Check size={15}/>}</button>
              </div>
            })}
          </div>
          <div className="exercise-note"><span><MessageCircle size={15}/> Prescrição</span><p>Carga sugerida: {ex.suggestedWeight} kg. Registre o que realmente executou.</p></div>
        </div>}
      </section>)}
    </div>
    <button className="finish-btn" disabled={savedCount<totalSets || busy==='finish'} onClick={finish}>{busy==='finish'?'Finalizando...':'Finalizar treino'} <Trophy size={18}/></button>
    {timer && <div className="modal-backdrop" onClick={() => setTimer(false)}><div className="timer-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setTimer(false)}><X size={18}/></button><span className="eyebrow">Tempo de descanso</span><div className="timer-circle">01:30</div><p>Use o tempo de descanso indicado na prescrição.</p><div className="timer-actions"><button>-15s</button><button className="primary-btn"><Play size={16} fill="currentColor"/> Pausar</button><button>+15s</button></div>
    </div></div>}
  </div>
}

function StudentHistory({ backend }) {
  const workouts=backend.workouts || []
  const history=workouts.filter(w=>w.latestSession)
  return <div className="page-stack"><section className="page-heading"><span className="eyebrow">Histórico</span><h1>Seus treinos</h1><p>Somente sessões registradas no backend.</p></section>
    <section className="panel no-pad"><div className="history-list">{history.length?history.map(w=>{
      const date=w.latestSession?.completedAt || w.latestSession?.startedAt || w.createdAt
      const label=date?new Date(date).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).toUpperCase():'—'
      const status=w.latestSession?.completedAt?'Realizado':'Em andamento'
      return <div className="history-row" key={w.id}>
        <div className="history-date">{label}</div>
        <div className="history-main"><strong>{w.name}</strong><small><Avatar initials={initialsOf(w.trainerName)} size="xs"/>{w.trainerName || 'Treinador'}</small></div>
        <Badge tone={status==='Realizado'?'green':'light'}>{status}</Badge><ChevronRight size={18}/>
      </div>
    }):<div className="empty-state">Nenhuma sessão registrada ainda.</div>}</div></section>
  </div>
}

function StudentProgress({ backend }) {
  const workouts=backend.workouts || []
  const completed=workouts.filter(w=>w.latestSession?.completedAt).length
  const started=workouts.filter(w=>w.latestSession).length
  const completionRate=workouts.length?Math.round(completed/workouts.length*100):0
  return <div className="page-stack"><section className="page-heading"><span className="eyebrow">Evolução</span><h1>Seu progresso em números</h1><p>Os indicadores abaixo usam somente dados já registrados no backend.</p></section>
    <div className="stats-grid">
      <StatCard icon={Dumbbell} label="Treinos prescritos" value={workouts.length} detail="total recebido"/>
      <StatCard icon={Flame} label="Treinos iniciados" value={started} detail="sessões abertas ou concluídas"/>
      <StatCard icon={Trophy} label="Treinos concluídos" value={completed} detail={`${completionRate}% das prescrições`}/>
    </div>
    <section className="panel empty-state"><LineChart size={32}/><h3>Evolução de carga e volume</h3><p>Esses gráficos aparecerão quando houver um endpoint real de agregação das séries registradas. Nenhum valor de exemplo é exibido.</p></section>
  </div>
}

function Messages({ trainer = false, backend }) {
  const participants=trainer ? (backend.students || []) : []
  return <div className="page-stack chat-page"><section className="page-heading"><span className="eyebrow">Mensagens</span><h1>{trainer ? 'Converse com seus alunos' : 'Fale com seu treinador'}</h1><p>As conversas aparecerão quando o backend de mensagens estiver implementado.</p></section>
    <section className="panel empty-state"><MessageCircle size={34}/><h3>Nenhuma conversa registrada</h3><p>{trainer && participants.length ? `Você tem ${participants.length} aluno(s) vinculado(s), mas ainda não existe endpoint de mensagens.` : 'O Atlas ainda não possui mensagens persistidas no backend.'}</p></section>
  </div>
}

function TrainerDashboard({ setPage, user, backend }) {
  const [period, setPeriod] = useState('Dia')
  const studentsData=backend.students || []
  const workouts=backend.workouts || []
  const completed=workouts.filter(w=>w.latestSession?.completedAt)
  const inProgress=workouts.filter(w=>w.latestSession && !w.latestSession.completedAt)
  return <div className="page-stack"><section className="welcome-row">
    <div><span className="eyebrow">Painel do treinador</span><h1>Boa noite, {user?.name || 'Treinador'} 👋</h1><p>Acompanhe os alunos e prescrições registradas no Atlas.</p></div>
    <button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={18}/> Criar treino</button>
  </section>
  <div className="stats-grid">
    <StatCard icon={UsersRound} label="Alunos vinculados" value={studentsData.length} detail="dados do backend"/>
    <StatCard icon={ListChecks} label="Treinos prescritos" value={workouts.length} detail={`${completed.length} concluídos`}/>
    <StatCard icon={Activity} label="Em execução" value={inProgress.length} detail="sessões abertas"/>
  </div>
  <div className="grid-2 dashboard-grid">
    <section className="panel"><div className="panel-head activities-head"><div><h3>Atividades</h3><p>Estado atual das prescrições registradas.</p></div><button className="text-btn" onClick={()=>setPage('workouts')}>Ver treinos</button></div>
      <div className="period-filter">{['Dia','Semana','Mês','Ano'].map(p=><button key={p} className={period===p?'active':''} onClick={()=>setPeriod(p)}>{p}</button>)}</div>
      <div className="activity-list">{workouts.length?workouts.slice(0,5).map(w=><div className="activity-row" key={w.id}><Avatar initials={initialsOf(w.studentName)} size="sm"/><div><strong>{w.studentName || 'Aluno'}</strong><small>{w.name}</small></div><Badge tone={w.latestSession?.completedAt?'green':w.latestSession?'light':'gray'}>{w.latestSession?.completedAt?'Concluído':w.latestSession?'Em execução':'Prescrito'}</Badge></div>):<div className="empty-state compact-empty">Nenhuma atividade registrada ainda.</div>}</div>
    </section>
    <section className="panel"><div className="panel-head"><div><h3>Atenção necessária</h3><p>Alertas aparecerão quando houver regras reais de frequência.</p></div><Bell size={19}/></div>
      <div className="empty-state compact-empty">Nenhum alerta real disponível no momento.</div>
    </section>
  </div>
  <section className="panel"><div className="panel-head"><div><h3>Visão geral dos alunos</h3><p>Somente alunos realmente vinculados.</p></div><button className="secondary-btn compact" onClick={()=>setPage('students')}>Gerenciar alunos</button></div>
    {studentsData.length?<div className="student-table"><div className="student-table-head"><span>Aluno</span><span>Disponibilidade</span><span>Treinos</span><span>Status</span><span>E-mail</span><span></span></div>
    {studentsData.map(st=><div className="student-table-row" key={st.id}><div><Avatar initials={initialsOf(st.name)} size="sm"/><strong>{st.name}</strong></div><span>{st.availability?.length || 0} dias</span><strong>{st.workoutCount || 0}</strong><Badge>Vinculado</Badge><span>{st.email}</span><ChevronRight size={18}/></div>)}</div>:<div className="empty-state compact-empty">Nenhum aluno vinculado ainda.</div>}
  </section>
  </div>
}

function Students({ setPage, token, backend, refreshBackend, onOpenStudent }) {
  const [invite, setInvite] = useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const [inviteResult,setInviteResult]=useState(null)
  const linkedStudents=backend.students || []
  const pendingInvites=(backend.invitations || []).filter(i=>i.status==='Pending')

  const sendInvite=async()=>{
    setBusy(true);setError('');setMessage('')
    try{
      const result=await apiRequest('/invitations',{token,method:'POST'})
      setInviteResult(result)
      setMessage('Link de convite gerado com sucesso.')
      await refreshBackend()
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  return <div className="page-stack">
    <section className="page-heading action-heading">
      <div><span className="eyebrow">Gestão de alunos</span><h1>Seus alunos</h1><p>Convites, disponibilidade e treinos vinculados ao backend.</p></div>
      <button className="primary-btn" onClick={()=>setInvite(true)}><Share2 size={18}/> Convidar aluno</button>
    </section>

    {error && <div className="app-error-banner">{error}</div>}
    {message && <div className="app-success-banner">{message}</div>}

    {pendingInvites.length>0 && <section className="panel">
      <div className="panel-head"><div><h3>Convites pendentes</h3><p>Aguardando aceite dos alunos.</p></div><Badge>{pendingInvites.length}</Badge></div>
      <div className="compact-list">{pendingInvites.map(inv=><div className="compact-row" key={inv.id}><div><strong>{inv.studentEmail || 'Link de convite'}</strong><small>{inv.studentEmail ? 'Convite aceito por e-mail após o cadastro' : 'Aguardando alguém abrir e aceitar o link'}</small></div><Badge tone="light">Pendente</Badge></div>)}</div>
    </section>}

    <div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Buscar aluno"/></div><button className="filter">Todos <ChevronDown size={15}/></button></div>

    {linkedStudents.length ? <div className="student-card-grid">{linkedStudents.map((st)=><article className="student-card clickable" key={st.id} onClick={()=>onOpenStudent(st.id)}>
      <div className="student-card-top"><Avatar initials={initialsOf(st.name)}/><div><h3>{st.name}</h3><p>{st.email}</p></div><button onClick={e=>e.stopPropagation()}><MoreHorizontal size={19}/></button></div>
      <div className="student-kpis">
        <div><span>Disponibilidade</span><strong>{st.availability?.length || 0} dias</strong></div>
        <div><span>Treinos</span><strong>{st.workoutCount || 0}</strong></div>
        <div><span>Status</span><strong>Vinculado</strong></div>
      </div>
      <div className="routine-days mini-routine">{['D','S','T','Q','Q','S','S'].map((d,i)=><span key={i} className={st.availability?.includes(i)?'active':''}>{d}</span>)}</div>
      <div className="student-actions"><button onClick={(e)=>{e.stopPropagation();onOpenStudent(st.id)}}>Abrir perfil</button><button onClick={(e)=>{e.stopPropagation();setPage('builder')}}>Criar treino <ChevronRight size={15}/></button></div>
    </article>)}</div> : <section className="panel empty-state">
      <UsersRound size={30}/><h3>Nenhum aluno vinculado ainda</h3><p>Gere um link de convite e peça para o aluno concluir o cadastro ou login pelo próprio link.</p>
    </section>}

    {invite && <div className="modal-backdrop" onClick={()=>setInvite(false)}><div className="standard-modal invite-modal" onClick={e=>e.stopPropagation()}>
      <button className="modal-close" onClick={()=>setInvite(false)}><X size={18}/></button>
      <div className="modal-icon"><Share2 size={23}/></div><h2>Convidar novo aluno</h2>
      {!inviteResult ? <>
        <p>Gere um link e compartilhe com quem você quiser convidar. O aluno cria uma conta ou entra no Atlas depois de abrir o link.</p>
        <div className="generic-invite-preview"><Share2 size={22}/><div><strong>Convite sem e-mail</strong><span>Qualquer pessoa com o link poderá aceitá-lo uma única vez.</span></div></div>
        <button className="primary-btn full" disabled={busy} onClick={sendInvite}>{busy?'Gerando link...':'Gerar link de convite'} <Share2 size={17}/></button>
      </> : <>
        <div className="invite-link-success"><Check size={20}/><div><strong>Convite pronto</strong><span>Compartilhe o link com o aluno. Ele poderá criar uma conta ou entrar em uma já existente.</span></div></div>
        <label className="field-label">Link de convite</label>
        <div className="copy-link official-invite-link"><span>{inviteResult.inviteUrl}</span><button onClick={()=>navigator.clipboard?.writeText(inviteResult.inviteUrl)}>Copiar</button></div>
        <div className="invite-link-actions">
          <button className="primary-btn full" onClick={async()=>{
            if(navigator.share){
              try{await navigator.share({title:'Convite Atlas',text:'Você foi convidado para treinar pelo Atlas.',url:inviteResult.inviteUrl})}catch{}
            }else{
              await navigator.clipboard?.writeText(inviteResult.inviteUrl)
            }
          }}><Share2 size={17}/> Compartilhar convite</button>
          <button className="secondary-btn full" onClick={()=>setInviteResult(null)}>Gerar outro convite</button>
        </div>
        <small className="helper-text">O link expira em {inviteResult.expiresInDays || 7} dias.</small>
      </>}
    </div></div>}
  </div>
}

function StudentDetail({ setPage, backend, studentId }) {
  const [tab,setTab]=useState('workouts')
  const student=(backend.students || []).find(st=>st.id===studentId)
  if(!student) return <div className="page-stack"><button className="back-link" onClick={()=>setPage('students')}><ArrowLeft size={17}/> Voltar aos alunos</button><section className="panel empty-state"><UsersRound size={34}/><h2>Aluno não encontrado</h2><p>Selecione um aluno vinculado na tela anterior.</p></section></div>

  const workouts=(backend.workouts || []).filter(w=>w.studentId===student.id)
  const completed=workouts.filter(w=>w.latestSession?.completedAt)
  const initials=(student.name||'A').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()

  return <div className="page-stack"><button className="back-link" onClick={()=>setPage('students')}><ArrowLeft size={17}/> Voltar aos alunos</button>
    <section className="student-profile-head"><Avatar initials={initials} size="lg"/><div><Badge>Aluno vinculado</Badge><h1>{student.name}</h1><p>{student.email}</p></div><div className="profile-actions"><button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={17}/> Novo treino</button></div></section>
    <div className="stats-grid">
      <StatCard icon={CalendarDays} label="Disponibilidade" value={student.availability?.length || 0} detail="dias por semana"/>
      <StatCard icon={Dumbbell} label="Treinos prescritos" value={workouts.length} detail="dados do backend"/>
      <StatCard icon={Check} label="Treinos concluídos" value={completed.length} detail="sessões finalizadas"/>
    </div>

    <div className="detail-tabs"><button className={tab==='workouts'?'active':''} onClick={()=>setTab('workouts')}>Treinos criados</button><button className={tab==='history'?'active':''} onClick={()=>setTab('history')}>Histórico de treinos</button><button className={tab==='progress'?'active':''} onClick={()=>setTab('progress')}>Evolução</button></div>

    {tab==='workouts' && <section className="panel no-pad"><div className="detail-workout-list">{workouts.length?workouts.map(w=><div className="detail-workout-row" key={w.id}><span className="workout-icon"><Dumbbell size={18}/></span><div><strong>{w.name}</strong><small>Modelo {w.model} · {(w.scheduledDays||[]).map(d=>['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d]).join(' · ') || 'Sem dias'}</small></div><Badge tone={w.latestSession?.completedAt?'green':w.latestSession?'light':'gray'}>{w.latestSession?.completedAt?'Concluído':w.latestSession?'Em execução':'Prescrito'}</Badge></div>):<div className="empty-state">Nenhum treino prescrito para este aluno.</div>}</div></section>}

    {tab==='history' && <section className="panel no-pad"><div className="history-list">{workouts.filter(w=>w.latestSession).length?workouts.filter(w=>w.latestSession).map(w=><div className="history-row detail-history" key={w.id}><div className="history-date">{new Date(w.latestSession.completedAt||w.latestSession.startedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).toUpperCase()}</div><div className="history-main"><strong>{w.name}</strong><small>{w.model}</small></div><Badge tone={w.latestSession.completedAt?'green':'light'}>{w.latestSession.completedAt?'Realizado':'Em andamento'}</Badge></div>):<div className="empty-state">Nenhuma sessão registrada para este aluno.</div>}</div></section>}

    {tab==='progress' && <section className="panel empty-state"><LineChart size={32}/><h3>Evolução sem dados agregados</h3><p>O backend ainda não possui endpoint de evolução por carga/volume para este aluno. Nenhum gráfico fictício é exibido.</p></section>}
  </div>
}

function ExerciseLibrary({ setPage }) {
  return <div className="page-stack"><section className="page-heading action-heading"><div><span className="eyebrow">Biblioteca</span><h1>Exercícios</h1><p>A biblioteca ainda não possui exercícios persistidos no backend.</p></div></section>
    <section className="panel empty-state"><BookOpen size={34}/><h3>Nenhum exercício cadastrado</h3><p>Para testar uma prescrição sem mocks, adicione exercícios manualmente ao criar o treino.</p><button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={17}/> Criar treino</button></section>
  </div>
}

function Workouts({ setPage, backend }) {
  const [query,setQuery]=useState('')
  const rows=(backend.workouts || []).map(w=>({
    id:w.id,
    name:w.name,
    student:w.studentName || 'Aluno não identificado',
    routine:(w.scheduledDays || []).map(d=>['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d]).join(' · ') || '—',
    model:w.model,
    status:w.latestSession?.completedAt?'Concluído':w.latestSession?'Em execução':'Prescrito'
  }))
  const filtered=rows.filter(w=>`${w.name} ${w.student} ${w.model} ${w.status}`.toLowerCase().includes(query.toLowerCase()))
  const toneFor=s=>s==='Concluído'?'green':s==='Em execução'?'light':'gray'

  return <div className="page-stack"><section className="page-heading action-heading"><div><span className="eyebrow">Prescrição</span><h1>Treinos & templates</h1><p>Prescrições salvas no backend para seus alunos.</p></div><button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={18}/> Criar treino</button></section>
    <div className="tabs"><button className="active">Treinos prescritos</button><button>Templates</button></div>
    <div className="toolbar workout-filters"><div className="search-box grow"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por treino, aluno, modelo ou status"/></div></div>
    <section className="panel no-pad"><div className="workout-table"><div className="workout-table-head"><span>Treino</span><span>Aluno</span><span>Rotina</span><span>Modelo</span><span>Status</span><span></span></div>
    {filtered.map(w=><div className="workout-table-row" key={w.id}><div><span className="workout-icon"><Dumbbell size={18}/></span><strong>{w.name}</strong></div><span>{w.student}</span><span>{w.routine}</span><strong>{w.model}</strong><Badge tone={toneFor(w.status)}>{w.status}</Badge><button><MoreHorizontal size={18}/></button></div>)}
    {!filtered.length && <div className="empty-state">Nenhum treino prescrito ainda. Crie o primeiro treino para um aluno vinculado.</div>}</div></section>
  </div>
}

function WorkoutBuilder({ setPage, token, backend, refreshBackend }) {
  const linkedStudents=backend.students || []
  const [syncingStudents,setSyncingStudents]=useState(true)
  useEffect(()=>{
    let active=true
    Promise.resolve(refreshBackend()).finally(()=>{ if(active)setSyncingStudents(false) })
    return()=>{active=false}
  },[])
  const [items,setItems]=useState([])
  const [studentQuery,setStudentQuery]=useState('')
  const [studentOpen,setStudentOpen]=useState(false)
  const [selectedStudentId,setSelectedStudentId]=useState('')
  const [workoutName,setWorkoutName]=useState('')
  const [model,setModel]=useState('AB')
  const [scheduledDays,setScheduledDays]=useState([])
  const [notes,setNotes]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  const makeExercise=()=>({
    id:(globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`),
    name:'', group:'', sets:'3', reps:'10', weight:'0', rest:'60'
  })
  const addExercise=()=>setItems(v=>[...v,makeExercise()])
  const remove=id=>setItems(v=>v.filter(e=>e.id!==id))
  const updateItem=(id,key,value)=>setItems(v=>v.map(ex=>ex.id===id?{...ex,[key]:value}:ex))

  const sortedStudents=useMemo(()=>[...linkedStudents].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')),[linkedStudents])
  const matches=sortedStudents.filter(st=>{
    const q=studentQuery.trim().toLowerCase()
    return !q || st.name.toLowerCase().includes(q) || st.email.toLowerCase().includes(q)
  })
  const selectedStudent=linkedStudents.find(st=>st.id===selectedStudentId) || null
  const availableDays=selectedStudent?.availability || []
  const dayLabels=['D','S','T','Q','Q','S','S']
  const dayNames=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  const chooseStudent = st => {
    setSelectedStudentId(st.id)
    setStudentQuery('')
    setScheduledDays([])
    setStudentOpen(false)
  }

  const toggleScheduledDay = day => {
    if(!availableDays.includes(day)) return
    setScheduledDays(v=>v.includes(day)?v.filter(x=>x!==day):[...v,day].sort((a,b)=>a-b))
  }

  const saveWorkout=async()=>{
    if(!selectedStudent?.id) { setError('Vincule um aluno antes de criar o treino.'); return }
    if(!workoutName.trim()) { setError('Informe o nome do treino.'); return }
    if(!scheduledDays.length) { setError('Selecione ao menos um dia disponível do aluno.'); return }
    if(!items.length) { setError('Adicione pelo menos um exercício.'); return }
    if(items.some(ex=>!ex.name.trim())) { setError('Preencha o nome de todos os exercícios.'); return }

    setBusy(true);setError('')
    try{
      await apiRequest('/workouts',{token,method:'POST',body:{
        studentId:selectedStudent.id,
        name:workoutName.trim(),
        model,
        notes:notes.trim(),
        scheduledDays,
        exercises:items.map(ex=>({
          name:ex.name.trim(),
          sets:Math.max(1,Number.parseInt(ex.sets,10)||1),
          reps:Math.max(1,Number.parseInt(ex.reps,10)||1),
          suggestedWeight:Math.max(0,Number.parseFloat(String(ex.weight).replace(',','.'))||0),
          restSeconds:Math.max(0,Number.parseInt(ex.rest,10)||0),
        }))
      }})
      await refreshBackend()
      setPage('workouts')
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  if(syncingStudents) return <div className="page-stack builder-page">
    <button className="back-link" onClick={()=>setPage('workouts')}><ArrowLeft size={17}/> Voltar aos treinos</button>
    <section className="panel empty-state"><UsersRound size={34}/><h2>Atualizando alunos...</h2><p>Buscando os vínculos mais recentes antes de montar a prescrição.</p></section>
  </div>

  if(!linkedStudents.length) return <div className="page-stack builder-page">
    <button className="back-link" onClick={()=>setPage('students')}><ArrowLeft size={17}/> Voltar aos alunos</button>
    <section className="panel empty-state"><UsersRound size={34}/><h2>Nenhum aluno vinculado</h2><p>Gere um link de convite e aguarde o aluno aceitar antes de montar a prescrição.</p><button className="primary-btn" onClick={()=>setPage('students')}>Ir para Alunos</button></section>
  </div>

  return <div className="page-stack builder-page"><button className="back-link" onClick={()=>setPage('workouts')}><ArrowLeft size={17}/> Voltar aos treinos</button>
    <section className="page-heading"><span className="eyebrow">Novo treino</span><h1>Montar prescrição</h1><p>Nenhum exercício de exemplo é carregado. Cadastre somente o que deseja prescrever.</p></section>
    {error && <div className="app-error-banner">{error}</div>}
    <div className="builder-layout"><div className="builder-main">
      <section className="panel form-panel"><h3>Informações gerais</h3><div className="form-grid">
        <label className="combo-field"><span>Aluno</span><div className="combo-box"><Search size={17}/><input value={studentOpen ? studentQuery : (selectedStudent?.name || '')} onFocus={()=>{setStudentQuery('');setStudentOpen(true)}} onChange={e=>{setStudentQuery(e.target.value);setStudentOpen(true)}} placeholder="Selecione ou busque um aluno"/><button type="button" onClick={()=>{setStudentQuery('');setStudentOpen(v=>!v)}}><ChevronDown size={16}/></button>{studentOpen && <div className="combo-menu">{matches.length?matches.map(st=><button type="button" key={st.id} className={selectedStudentId===st.id?'active':''} onClick={()=>chooseStudent(st)}><Avatar initials={initialsOf(st.name)} size="xs"/><span><strong>{st.name}</strong><small>{st.email}</small></span>{selectedStudentId===st.id&&<Check size={14}/>}</button>):<small>Nenhum aluno encontrado</small>}</div>}</div></label>
        <label><span>Modelo de treino</span><select value={model} onChange={e=>setModel(e.target.value)}><option>AB</option><option>ABC</option><option>FULLBODY</option></select></label>
        <label className="span-2"><span>Nome do treino</span><input value={workoutName} onChange={e=>setWorkoutName(e.target.value)} placeholder="Ex.: Treino A — Peito e costas"/></label>
        <label className="span-2"><span>Observações gerais</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Orientações para o aluno"/></label>
      </div></section>

      <section className="panel"><div className="panel-head"><div><h3>Exercícios</h3><p>Adicione manualmente os exercícios desta prescrição.</p></div><button className="secondary-btn compact" type="button" onClick={addExercise}><Plus size={16}/> Adicionar exercício</button></div>
        <div className="builder-exercises">
          {items.length?items.map((ex,idx)=><div className="builder-exercise manual-exercise" key={ex.id}>
            <span className="drag-handle">⋮⋮</span><span className="exercise-index">{idx+1}</span>
            <div className="builder-ex-main editable-exercise-name"><input value={ex.name} onChange={e=>updateItem(ex.id,'name',e.target.value)} placeholder="Nome do exercício"/><input value={ex.group} onChange={e=>updateItem(ex.id,'group',e.target.value)} placeholder="Grupo muscular (opcional)"/></div>
            <label><small>Séries</small><input type="number" min="1" value={ex.sets} onChange={e=>updateItem(ex.id,'sets',e.target.value)}/></label>
            <label><small>Reps</small><input type="number" min="1" value={ex.reps} onChange={e=>updateItem(ex.id,'reps',e.target.value)}/></label>
            <label><small>Carga kg</small><input type="number" min="0" step="0.5" value={ex.weight} onChange={e=>updateItem(ex.id,'weight',e.target.value)}/></label>
            <label><small>Descanso s</small><input type="number" min="0" value={ex.rest} onChange={e=>updateItem(ex.id,'rest',e.target.value)}/></label>
            <button className="remove-btn" onClick={()=>remove(ex.id)}><X size={17}/></button>
          </div>):<div className="empty-state compact-empty"><Dumbbell size={28}/><h3>Nenhum exercício adicionado</h3><p>Clique em “Adicionar exercício” para começar a prescrição.</p></div>}
        </div>
      </section>
    </div>
    <aside className="builder-side"><section className="panel routine-readonly"><div className="panel-head"><div><h3>Disponibilidade do aluno</h3><p>Escolhida por {selectedStudent?.name}.</p></div><Lock size={18}/></div>
      <div className="weekday-picker readonly selectable-days">{dayLabels.map((d,i)=><button type="button" key={i} disabled={!availableDays.includes(i)} className={scheduledDays.includes(i)?'active':''} onClick={()=>toggleScheduledDay(i)}>{d}</button>)}</div>
      <div className="availability-summary"><strong>{availableDays.length} dias disponíveis</strong><span>{availableDays.map(i=>dayNames[i]).join(' · ') || 'Ainda não informado'}</span></div>
      <div className="info-note">O aluno define quando consegue treinar. Selecione, dentro desses dias, quando este treino poderá ser executado.</div>
    </section>
    <section className="panel summary-panel"><h3>Resumo</h3><div><span>Aluno</span><strong>{selectedStudent?.name}</strong></div><div><span>Modelo</span><strong>{model}</strong></div><div><span>Exercícios</span><strong>{items.length}</strong></div><div><span>Dias</span><strong>{scheduledDays.map(i=>dayNames[i]).join(' · ') || '—'}</strong></div><button className="primary-btn full" disabled={busy||!scheduledDays.length||!items.length||!workoutName.trim()} onClick={saveWorkout}>{busy?'Salvando...':'Salvar e prescrever'} <Check size={17}/></button></section></aside></div>
  </div>
}

function AppShell() {
  const inviteToken = new URLSearchParams(window.location.search).get('invite')
  const [token,setToken]=useState('')
  const [user,setUser]=useState(null)
  const [restoringSession,setRestoringSession]=useState(true)
  const [page,setPage]=useState('home')
  const [backend,setBackend]=useState({ invitations:[], students:[], workouts:[], availability:[] })
  const [backendError,setBackendError]=useState('')
  const [selectedStudentId,setSelectedStudentId]=useState('')
  const [selectedWorkoutId,setSelectedWorkoutId]=useState('')

  const profile = user?.role === 'trainer' ? 'trainer' : 'student'

  const refreshBackend = async (nextToken = token, nextUser = user) => {
    if (!nextToken || !nextUser) return
    setBackendError('')
    try {
      if (nextUser.role === 'trainer') {
        const [invitations, studentsData, workouts] = await Promise.all([
          apiRequest('/invitations',{token:nextToken}),
          apiRequest('/trainer/students',{token:nextToken}),
          apiRequest('/workouts',{token:nextToken}),
        ])
        setBackend({ invitations, students:studentsData, workouts, availability:[] })
      } else {
        const [invitations, availabilityData, workouts] = await Promise.all([
          apiRequest('/invitations',{token:nextToken}),
          apiRequest('/availability',{token:nextToken}),
          apiRequest('/workouts',{token:nextToken}),
        ])
        setBackend({ invitations, students:[], workouts, availability:availabilityData.days || [] })
      }
    } catch (e) {
      setBackendError(e.message)
    }
  }

  useEffect(()=>{
    let cancelled=false
    const restore=async()=>{
      const storedToken=readStoredToken()
      if(!storedToken){if(!cancelled)setRestoringSession(false);return}
      try{
        const data=await apiRequest('/me',{token:storedToken})
        if(cancelled)return
        setToken(storedToken)
        setUser(data.user)
        setPage(data.user.role==='trainer'?'dashboard':'home')
      }catch{
        storeToken('')
      }finally{
        if(!cancelled)setRestoringSession(false)
      }
    }
    restore()
    return()=>{cancelled=true}
  },[])

  useEffect(()=>{ refreshBackend() },[token,user?.id])

  useEffect(()=>{
    if(!token || !user) return
    const refresh=()=>refreshBackend()
    const onVisibility=()=>{ if(document.visibilityState==='visible') refresh() }
    window.addEventListener('focus',refresh)
    document.addEventListener('visibilitychange',onVisibility)
    return()=>{
      window.removeEventListener('focus',refresh)
      document.removeEventListener('visibilitychange',onVisibility)
    }
  },[token,user?.id])

  useEffect(()=>{
    if(token && user) refreshBackend()
  },[page])

  const handleLogin = (nextToken,nextUser) => {
    storeToken(nextToken)
    setToken(nextToken)
    setUser(nextUser)
    setPage(nextUser.role === 'trainer' ? 'dashboard' : 'home')
  }

  const openStudent = id => { setSelectedStudentId(id); setPage('studentDetail') }
  const openWorkout = id => { setSelectedWorkoutId(id); setPage('workout') }

  const logout = () => {
    const currentToken = token
    storeToken('')
    setToken('')
    setUser(null)
    setBackend({ invitations:[], students:[], workouts:[], availability:[] })
    setSelectedStudentId('')
    setSelectedWorkoutId('')
    setPage('home')
    if (currentToken) apiRequest('/auth/logout',{token:currentToken,method:'POST'}).catch(()=>{})
  }

  if (inviteToken) return <InviteOnboarding inviteToken={inviteToken} onComplete={handleLogin}/>

  if (restoringSession) return <div className="auth-screen session-restore-screen">
    <div className="session-restore-card"><Logo/><span className="eyebrow">Atlas</span><h2>Restaurando sua sessão...</h2><p>Validando seu acesso.</p></div>
  </div>

  if (!token || !user) return <Login onEnter={handleLogin}/>

  let content
  if (profile === 'student') {
    content = page === 'home' ? <StudentHome setPage={setPage} token={token} user={user} backend={backend} refreshBackend={refreshBackend} onOpenWorkout={openWorkout}/> :
      page === 'workout' ? <WorkoutExecution setPage={setPage} token={token} workout={backend.workouts.find(w=>w.id===selectedWorkoutId) || null} refreshBackend={refreshBackend}/> :
      page === 'history' ? <StudentHistory backend={backend}/> :
      page === 'progress' ? <StudentProgress backend={backend}/> :
      <Messages backend={backend}/>
  } else {
    content = page === 'dashboard' ? <TrainerDashboard setPage={setPage} user={user} backend={backend}/> :
      page === 'students' ? <Students setPage={setPage} token={token} backend={backend} refreshBackend={refreshBackend} onOpenStudent={openStudent}/> :
      page === 'studentDetail' ? <StudentDetail setPage={setPage} backend={backend} studentId={selectedStudentId}/> :
      page === 'library' ? <ExerciseLibrary setPage={setPage}/> :
      page === 'workouts' ? <Workouts setPage={setPage} backend={backend}/> :
      page === 'builder' ? <WorkoutBuilder setPage={setPage} token={token} backend={backend} refreshBackend={refreshBackend}/> :
      <Messages trainer backend={backend}/>
  }

  return <div className="app-shell">
    <Topbar profile={profile} user={user} onLogout={logout}/>
    <SideNav profile={profile} page={page} setPage={setPage}/>
    <main className="app-main">
      {backendError && <div className="app-error-banner">{backendError}</div>}
      {content}
    </main>
    <BottomNav profile={profile} page={page} setPage={setPage}/>
  </div>
}

export default function App() {
  return <AppShell/>
}
