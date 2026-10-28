import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, Apple, ArrowLeft, BarChart3, Bell, BookOpen, CalendarDays, Check,
  ChevronDown, ChevronRight, CirclePlus, Clock3, Dumbbell, Flame, History,
  Home, LineChart, ListChecks, Lock, LogIn, LogOut, Mail, Menu, MessageCircle, MoreHorizontal, Pencil,
  Play, Plus, Search, Send, Settings, Share2, Sparkles, TimerReset, Trophy,
  Upload, Download, UserPlus, UserRound, UsersRound, Video, X, Zap
} from 'lucide-react'
import { apiBlob, apiRequest, fileToDataUrl, readStoredToken, storeToken } from './lib/api.js'
import { initialsOf } from './lib/format.js'
import { currentPrescription, workoutPrescriptions } from './lib/prescriptions.js'


function Logo({ compact = false }) {
  return <div className={`logo ${compact ? 'compact' : ''}`}>
    <span className="logo-mark"><Activity size={compact ? 18 : 22} strokeWidth={2.5}/></span>
    {!compact && <span>Atlas</span>}
  </div>
}

function Avatar({ initials = 'AS', size = 'md', src = '' }) {
  return <div className={`avatar avatar-${size}`}>{src?<img src={src} alt="" />:initials}</div>
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
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [registerRole,setRegisterRole]=useState('trainer')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const loginReal = async () => {
    setBusy('login');setError('')
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
      onEnter(data.token, data.user)
    } catch (e) { setError(e.message) } finally { setBusy('') }
  }

  const register = async () => {
    setBusy('register');setError('')
    try {
      const data = await apiRequest('/auth/register', { method:'POST', body:{name,email,password,role:registerRole} })
      onEnter(data.token,data.user)
    } catch(e) { setError(e.message) } finally { setBusy('') }
  }

  const enterAs = async role => {
    setBusy(role);setError('')
    try {
      const data = await apiRequest('/auth/demo-login', { method: 'POST', body: { role } })
      onEnter(data.token, data.user)
    } catch (e) { setError(e.message) } finally { setBusy('') }
  }

  return <div className="auth-screen">
    <div className="auth-decor auth-decor-left"></div><div className="auth-decor auth-decor-right"></div>
    <div className="auth-content">
      <div className="auth-top"><div className="auth-logo"><Logo/></div><div className="auth-dots"><span className="active"></span><span></span><span></span></div></div>
      <section className="auth-hero"><span className="auth-kicker">TREINE. ACOMPANHE. EVOLUA.</span><h1>Sustente sua força.<br/><em>Supere seus limites.</em></h1><p>Treinos, evolução e contato com seu treinador em uma experiência direta e feita para manter sua constância.</p></section>

      {mode==='welcome'&&<section className="auth-card">
        <button className="auth-primary" onClick={()=>{setError('');setMode('login')}}>Entrar</button>
        <button className="auth-outline auth-submit" onClick={()=>{setError('');setMode('register')}}>Criar conta</button>
        <button className="auth-outline auth-submit" onClick={()=>{setError('');setMode('demo')}}>Acessos de teste</button>
        <small className="auth-brandline">Atlas · treino conectado</small>
      </section>}

      {mode==='login'&&<section className="auth-card auth-form-card">
        <button className="auth-back" onClick={()=>{setError('');setMode('welcome')}}><ArrowLeft size={17}/> Voltar</button>
        <span className="eyebrow">Acessar sua conta</span><h2>Entrar no Atlas</h2><p>Use o e-mail e a senha cadastrados.</p>
        {error&&<div className="auth-error">{error}</div>}
        <label className="field-label">E-mail</label><div className="input-wrap"><Mail size={18}/><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></div>
        <label className="field-label">Senha</label><div className="input-wrap"><Lock size={18}/><input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha" onKeyDown={e=>{if(e.key==='Enter'&&email&&password&&!busy)loginReal()}}/></div>
        <button className="auth-primary auth-submit" disabled={!email||!password||!!busy} onClick={loginReal}>{busy==='login'?'Entrando...':'Entrar'} <LogIn size={18}/></button>
      </section>}

      {mode==='register'&&<section className="auth-card auth-form-card">
        <button className="auth-back" onClick={()=>{setError('');setMode('welcome')}}><ArrowLeft size={17}/> Voltar</button>
        <span className="eyebrow">Nova conta</span><h2>Criar conta</h2><p>Você poderá ativar o segundo perfil depois, na área do usuário.</p>
        {error&&<div className="auth-error">{error}</div>}
        <label className="field-label">Nome</label><div className="input-wrap"><UserRound size={18}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome"/></div>
        <label className="field-label">E-mail</label><div className="input-wrap"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></div>
        <label className="field-label">Senha</label><div className="input-wrap"><Lock size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres"/></div>
        <label className="field-label">Perfil inicial</label>
        <div className="profile-register-choice"><button className={registerRole==='trainer'?'active':''} onClick={()=>setRegisterRole('trainer')}><UsersRound size={18}/> Treinador</button><button className={registerRole==='student'?'active':''} onClick={()=>setRegisterRole('student')}><UserRound size={18}/> Aluno</button></div>
        <button className="auth-primary auth-submit" disabled={!name||!email||password.length<8||!!busy} onClick={register}>{busy==='register'?'Criando...':'Criar conta'} <ChevronRight size={18}/></button>
      </section>}

      {mode==='demo'&&<section className="auth-card auth-form-card">
        <button className="auth-back" onClick={()=>{setError('');setMode('welcome')}}><ArrowLeft size={17}/> Voltar</button>
        <span className="eyebrow">Ambiente de teste</span><h2>Escolha o perfil</h2><p>Use os usuários de teste apenas para validar rapidamente o fluxo.</p>
        {error&&<div className="auth-error">{error}</div>}
        <button className="auth-primary auth-submit" disabled={!!busy} onClick={()=>enterAs('trainer')}><UsersRound size={18}/> {busy==='trainer'?'Entrando...':'Professor Atlas'}</button>
        <button className="auth-outline auth-submit" disabled={!!busy} onClick={()=>enterAs('student')}><UserRound size={18}/> {busy==='student'?'Entrando...':'Aluno Atlas'}</button>
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
      await apiRequest('/invitations/accept-token',{token:data.token,method:'POST',body:{token:inviteToken}})
      const me=await apiRequest('/me',{token:data.token})
      setAuth({token:data.token,user:me.user})
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

function Topbar({ profile, user, token, onUserChange, onLogout, onOpenProfile }) {
  const [profileOpen,setProfileOpen]=useState(false)
  const [notificationsOpen,setNotificationsOpen]=useState(false)
  const [notifications,setNotifications]=useState([])
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')

  const loadNotifications=async()=>{
    try{setNotifications(await apiRequest('/notifications',{token}))}catch{}
  }
  useEffect(()=>{loadNotifications()},[token,profile])

  const switchProfile=async(next)=>{
    if(next===profile){setProfileOpen(false);return}
    setBusy('profile');setError('')
    try{
      const data=await apiRequest('/profiles/active',{token,method:'PUT',body:{profile:next}})
      const me=await apiRequest('/me',{token})
      onUserChange(me.user||data.user)
      setProfileOpen(false)
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  const addProfile=async(next)=>{
    setBusy('profile');setError('')
    try{
      await apiRequest('/profiles',{token,method:'POST',body:{profile:next}})
      await apiRequest('/profiles/active',{token,method:'PUT',body:{profile:next}})
      const me=await apiRequest('/me',{token})
      onUserChange(me.user)
      setProfileOpen(false)
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  const unread=notifications.filter(n=>!n.readAt).length
  const profiles=user?.profiles || [profile]
  const other=profile==='trainer'?'student':'trainer'

  return <header className="topbar">
    <Logo/>
    <div className="topbar-actions">
      <div className="topbar-popover-wrap">
        <button className="bell-action" onClick={()=>{setNotificationsOpen(v=>!v);setProfileOpen(false);loadNotifications()}}><Bell size={19}/>{unread>0&&<span className="notification-count">{unread>9?'9+':unread}</span>}</button>
        {notificationsOpen&&<div className="topbar-popover notification-popover">
          <div className="popover-head"><strong>Notificações</strong><button onClick={async()=>{await apiRequest('/notifications/read-all',{token,method:'POST'});await loadNotifications()}}>Marcar lidas</button></div>
          <div className="notification-list">{notifications.length?notifications.slice(0,12).map(n=><button key={n.id} className={n.readAt?'':'unread'} onClick={async()=>{if(!n.readAt)await apiRequest(`/notifications/${n.id}/read`,{token,method:'POST'});await loadNotifications()}}><strong>{n.title}</strong><span>{n.body}</span><small>{new Date(n.createdAt).toLocaleString('pt-BR')}</small></button>):<div className="empty-popover">Nenhuma notificação.</div>}</div>
        </div>}
      </div>
      <div className="profile-switch topbar-popover-wrap">
        <button className="profile-trigger" onClick={()=>{setProfileOpen(v=>!v);setNotificationsOpen(false)}}>
          <Avatar initials={initialsOf(user?.name)} size="sm" src={user?.avatarUrl}/><span><small>{profile==='student'?'Aluno':'Treinador'}</small><strong>{user?.name}</strong></span><ChevronDown size={15}/>
        </button>
        {profileOpen&&<div className="topbar-popover profile-popover">
          <div className="profile-popover-user"><Avatar initials={initialsOf(user?.name)} size="md" src={user?.avatarUrl}/><div><strong>{user?.name}</strong><small>{user?.email}</small></div></div>
          {error&&<div className="popover-error">{error}</div>}
          <div className="profile-options">
            {profiles.includes('trainer')&&<button className={profile==='trainer'?'active':''} disabled={!!busy} onClick={()=>switchProfile('trainer')}><UsersRound size={16}/> Treinador</button>}
            {profiles.includes('student')&&<button className={profile==='student'?'active':''} disabled={!!busy} onClick={()=>switchProfile('student')}><UserRound size={16}/> Aluno</button>}
            {!profiles.includes(other)&&<button disabled={!!busy} onClick={()=>addProfile(other)}><CirclePlus size={16}/> Ativar perfil {other==='trainer'?'Treinador':'Aluno'}</button>}
            <button onClick={()=>{setProfileOpen(false);onOpenProfile?.()}}><Settings size={16}/> Meu perfil</button>
          </div>
        </div>}
        <button className="logout-action" onClick={onLogout} title="Sair"><LogOut size={18}/><span>Sair</span></button>
      </div>
    </div>
  </header>
}

function SideNav({ profile, page, setPage }) {
  const student = [
    ['home', Home, 'Início'], ['trainers', UserPlus, 'Professores'], ['history', History, 'Histórico'], ['progress', LineChart, 'Evolução'], ['messages', MessageCircle, 'Mensagens']
  ]
  const trainer = [
    ['dashboard', BarChart3, 'Visão geral'], ['students', UsersRound, 'Alunos'], ['workouts', Dumbbell, 'Treinos'], ['library', BookOpen, 'Exercícios'], ['messages', MessageCircle, 'Mensagens']
  ]
  const items = profile === 'student' ? student : trainer
  return <aside className="side-nav">
    <nav>{items.map(([key, Icon, label]) =>
      <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon size={19}/><span>{label}</span></button>
    )}</nav>
    <button className={page==='profile'?'side-settings active':'side-settings'} onClick={()=>setPage('profile')}><Settings size={19}/><span>Perfil</span></button>
  </aside>
}

function BottomNav({ profile, page, setPage }) {
  const student = [['home', Home, 'Início'], ['trainers', UserPlus, 'Professores'], ['history', History, 'Histórico'], ['progress', LineChart, 'Evolução'], ['messages', MessageCircle, 'Chat']]
  const trainer = [['dashboard', BarChart3, 'Painel'], ['students', UsersRound, 'Alunos'], ['workouts', Dumbbell, 'Treinos'], ['library', BookOpen, 'Biblioteca'], ['messages', MessageCircle, 'Chat']]
  return <nav className={`bottom-nav bottom-nav-${profile}`}>{(profile === 'student' ? student : trainer).map(([key, Icon, label]) =>
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
  const workouts = backend.workouts || []
  const selected = currentPrescription(workouts)
  const currentWorkout = selected?.workout || null
  const currentPlan = selected?.prescription || null
  const completedCount = Number(backend.progress?.summary?.completedWorkouts || 0)

  useEffect(()=>{ setRoutineDays(backend.availability || []) },[backend.availability])
  const toggleDay = i => setRoutineDays(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i].sort((a,b)=>a-b))

  const saveAvailability = async () => {
    setBusy('availability');setError('');setMessage('')
    try {
      await apiRequest('/availability',{token,method:'PUT',body:{days:routineDays}})
      setMessage('Disponibilidade salva. Seus treinadores já podem usar esses dias nas prescrições.')
      await refreshBackend()
      setRoutineOpen(false)
    } catch(e) { setError(e.message) } finally { setBusy('') }
  }

  return <div className="page-stack">
    <section className="welcome-row">
      <div><span className="eyebrow">Seu espaço de treino</span><h1>Boa noite, {user?.name || 'Aluno'} 👋</h1><p>{currentPlan ? 'Sua próxima prescrição está pronta.' : 'Defina sua rotina e vincule-se a um treinador para receber treinos.'}</p></div>
      <div className="streak-card"><Flame size={21}/><span><strong>{completedCount} sessão{completedCount===1?'':'ões'}</strong><small>concluída{completedCount===1?'':'s'}</small></span></div>
    </section>

    {error && <div className="app-error-banner">{error}</div>}
    {message && <div className="app-success-banner">{message}</div>}

    {currentWorkout&&currentPlan ? <section className="today-card">
      <div className="today-main">
        <div className="today-meta"><Badge tone={currentPlan.status==='Realizado'?'green':currentPlan.status==='Não Realizado'?'gray':'light'}>{currentPlan.status}</Badge><span><Dumbbell size={15}/> {currentPlan.name}</span><span><Clock3 size={14}/> {currentPlan.estimatedMinutes||0} min</span></div>
        <h2>{currentWorkout.name}</h2>
        <p>{currentPlan.notes || currentWorkout.description || currentWorkout.notes || 'Prescrição preparada pelo seu treinador.'}</p>
        <div className="coach-line"><Avatar initials={initialsOf(currentWorkout.trainerName)} size="sm" src={currentWorkout.trainerAvatarUrl}/><span>Prescrito por <strong>{currentWorkout.trainerName || 'Treinador'}</strong></span></div>
        <div className="today-exercise-list">{(currentPlan.exercises||[]).map((ex,idx)=><div key={ex.id||idx}><span>{idx+1}</span><div><strong>{ex.name}</strong><small>{ex.sets} séries · {ex.reps} reps · {Number(ex.suggestedWeight||0).toFixed(1)} kg · {ex.restSeconds}s descanso</small></div></div>)}</div>
        {currentPlan.status!=='Realizado' && <button className="primary-btn" onClick={() => onOpenWorkout(currentWorkout.id,currentPlan.id)}><Play size={18} fill="currentColor"/> {currentPlan.latestSession&&!currentPlan.latestSession.completedAt ? 'Continuar prescrição' : 'Iniciar prescrição'}</button>}
      </div>
      <div className="today-visual">
        <div className="workout-figure"><Dumbbell size={54}/></div>
        <div className="exercise-preview"><small>{currentPlan.exercises?.length || 0} exercícios</small><strong>{(currentPlan.exercises || []).reduce((sum,e)=>sum+Number(e.sets||0),0)} séries totais</strong><span>{(currentPlan.scheduledDays || []).map(d=>names[d]).join(' · ')}</span></div>
      </div>
    </section> : <section className="today-card empty-today-card">
      <div className="today-main"><div className="today-meta"><Badge tone="light">Sem prescrição</Badge></div><h2>Nenhum treino recebido ainda</h2><p>Encontre um professor público ou use o link de convite de um treinador privado.</p><button className="secondary-btn" onClick={()=>setPage('trainers')}><UserPlus size={17}/> Encontrar professores</button></div>
      <div className="today-visual"><div className="workout-figure"><Dumbbell size={54}/></div></div>
    </section>}

    <div className="section-title"><div><h2>Meus treinos</h2><p>Cada treino pode reunir várias prescrições.</p></div><button onClick={() => setPage('history')}>Ver histórico <ChevronRight size={16}/></button></div>
    <section className="panel workout-plan-list">
      {workouts.length?workouts.map(w=><article className="student-workout-plan" key={w.id}><div className="student-workout-plan-head"><div><strong>{w.name}</strong><small><Avatar initials={initialsOf(w.trainerName)} size="xs" src={w.trainerAvatarUrl}/>{w.trainerName}</small></div><Badge tone="light">{workoutPrescriptions(w).length} prescrições</Badge></div>
        <div className="student-prescription-list">{workoutPrescriptions(w).map(p=><button key={p.id||p.name} disabled={p.status==='Realizado'} onClick={()=>onOpenWorkout(w.id,p.id)}><div><strong>{p.name}</strong><small>{(p.scheduledDays||[]).map(d=>names[d]).join(' · ')||'Sem dias'} · {p.estimatedMinutes||0} min · {p.exercises?.length||0} exercícios</small></div><Badge tone={p.status==='Realizado'?'green':p.status==='Não Realizado'?'gray':'light'}>{p.status}</Badge><ChevronRight size={17}/></button>)}</div>
      </article>):<div className="empty-state">Nenhum treino prescrito ainda.</div>}
    </section>

    <div className="grid-2">
      <section className="panel routine-card">
        <div className="panel-head"><div><h3>Minha rotina</h3><p>Você escolhe quando pode treinar; cada prescrição usa alguns desses dias.</p></div><CalendarDays size={20}/></div>
        <div className="routine-days">{labels.map((d,i) => <span key={i} className={routineDays.includes(i) ? 'active' : ''}>{d}</span>)}</div>
        <div className="routine-copy"><strong>{routineDays.length} dias por semana</strong><span>{routineDays.map(i => names[i]).join(' · ') || 'Nenhum dia selecionado'}</span></div>
        <button className="secondary-btn compact" onClick={() => setRoutineOpen(true)}>Editar disponibilidade</button>
      </section>
      <section className="panel"><div className="panel-head"><div><h3>Resumo</h3><p>Dados do seu fluxo atual.</p></div><Trophy size={20}/></div><div className="month-summary"><div className="progress-ring" style={{'--progress':`${Math.min(100,completedCount*10)}%`}}><span>{completedCount}</span></div><div><strong>{completedCount} sessão(ões) concluída(s)</strong><span>As execuções concluídas ficam registradas no seu histórico.</span></div></div></section>
    </div>

    {routineOpen && <div className="modal-backdrop" onClick={() => setRoutineOpen(false)}><div className="standard-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setRoutineOpen(false)}><X size={18}/></button><div className="modal-icon"><CalendarDays size={23}/></div><h2>Escolha sua rotina</h2><p>Selecione os dias em que você consegue treinar.</p>
      <div className="weekday-picker routine-picker">{labels.map((d,i)=><button key={i} className={routineDays.includes(i)?'active':''} onClick={()=>toggleDay(i)}>{d}</button>)}</div>
      <button className="primary-btn full" disabled={!routineDays.length || busy==='availability'} onClick={saveAvailability}>{busy==='availability'?'Salvando...':'Salvar disponibilidade'} <Check size={17}/></button>
    </div></div>}
  </div>
}

function WorkoutExecution({ setPage, token, workout, initialPrescriptionId = '', refreshBackend }) {
  const prescriptions=workoutPrescriptions(workout)
  const [prescriptionId,setPrescriptionId]=useState(initialPrescriptionId||prescriptions[0]?.id||'')
  const [timer,setTimer]=useState(false)
  const [timerSeconds,setTimerSeconds]=useState(90)
  const [timerRunning,setTimerRunning]=useState(false)
  const [openExercise,setOpenExercise]=useState(null)
  const [session,setSession]=useState(null)
  const [drafts,setDrafts]=useState({})
  const [saved,setSaved]=useState({})
  const [loading,setLoading]=useState(false)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')
  const [finalNotes,setFinalNotes]=useState('')
  const [videoSrc,setVideoSrc]=useState('')
  const [videoTitle,setVideoTitle]=useState('')
  const prescription=prescriptions.find(p=>p.id===prescriptionId)||null

  useEffect(()=>{if(initialPrescriptionId)setPrescriptionId(initialPrescriptionId);else if(prescriptions.length===1)setPrescriptionId(prescriptions[0].id)},[workout?.id,initialPrescriptionId])
  useEffect(()=>{if(!timer||!timerRunning)return;if(timerSeconds<=0){setTimerRunning(false);return}const id=setInterval(()=>setTimerSeconds(v=>Math.max(0,v-1)),1000);return()=>clearInterval(id)},[timer,timerRunning,timerSeconds])

  useEffect(()=>{
    let cancelled=false
    const loadSession=async()=>{
      if(!workout||!prescriptionId){setSession(null);return}
      setLoading(true);setError('')
      try{
        const latest=prescription?.latestSession
        const started=latest&&!latest.completedAt?latest:await apiRequest(`/workouts/${workout.id}/start`,{token,method:'POST',body:{prescriptionId}})
        const data=await apiRequest(`/sessions/${started.id}`,{token})
        if(cancelled)return
        setSession(data);setOpenExercise(data.exercises?.[0]?.id||null);setFinalNotes(data.notes||'')
        const nextDrafts={},nextSaved={}
        for(const ex of data.exercises||[])for(let n=1;n<=ex.sets;n++){const log=(data.logs||[]).find(item=>item.exerciseId===ex.id&&item.setNumber===n);const key=`${ex.id}:${n}`;nextDrafts[key]={reps:log?.reps??ex.reps,weight:log?.weight??ex.suggestedWeight,notes:log?.notes||''};if(log?.completed)nextSaved[key]=true}
        setDrafts(nextDrafts);setSaved(nextSaved)
      }catch(e){if(!cancelled)setError(e.message)}finally{if(!cancelled)setLoading(false)}
    }
    loadSession();return()=>{cancelled=true}
  },[workout?.id,prescriptionId])

  const saveSet=async(exerciseId,setNumber)=>{
    if(!session)return
    const key=`${exerciseId}:${setNumber}`;const draft=drafts[key]||{}
    setBusy(key);setError('')
    try{await apiRequest(`/sessions/${session.id}/exercises/${exerciseId}/sets/${setNumber}`,{token,method:'PUT',body:{reps:Number(draft.reps)||0,weight:Number(draft.weight)||0,notes:draft.notes||''}});setSaved(v=>({...v,[key]:true}))}
    catch(e){setError(e.message)}finally{setBusy('')}
  }
  const finish=async()=>{if(!session)return;setBusy('finish');setError('');try{await apiRequest(`/sessions/${session.id}/complete`,{token,method:'POST',body:{notes:finalNotes}});await refreshBackend();setPage('home')}catch(e){setError(e.message)}finally{setBusy('')}}
  const openTimer=seconds=>{setTimerSeconds(Math.max(0,Number(seconds)||90));setTimerRunning(true);setTimer(true)}
  const closeVideo=()=>{if(videoSrc.startsWith('blob:'))URL.revokeObjectURL(videoSrc);setVideoSrc('');setVideoTitle('')}
  const playExerciseVideo=async ex=>{setError('');try{closeVideo();if(ex.videoUrl){setVideoSrc(ex.videoUrl);setVideoTitle(ex.name);return}if(ex.exerciseId){const blob=await apiBlob(`/exercises/${ex.exerciseId}/video`,token);setVideoSrc(URL.createObjectURL(blob));setVideoTitle(ex.name);return}setError('Este exercício não possui vídeo cadastrado.')}catch(e){setError(e.message)}}

  if(!workout)return <div className="page-stack"><button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Voltar</button><section className="panel empty-state"><h2>Nenhum treino selecionado</h2></section></div>
  if(!prescriptionId&&prescriptions.length>1)return <div className="page-stack"><button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Voltar</button><section className="page-heading"><span className="eyebrow">{workout.name}</span><h1>Qual prescrição você vai executar?</h1></section><div className="prescription-choice-grid">{prescriptions.map(p=><button className="panel" key={p.id} onClick={()=>setPrescriptionId(p.id)}><Dumbbell size={25}/><strong>{p.name}</strong><span>{p.exercises?.length||0} exercícios · {p.estimatedMinutes||0} min</span></button>)}</div></div>
  if(loading)return <div className="page-stack"><section className="panel empty-state"><Dumbbell size={30}/><h2>Preparando prescrição...</h2></section></div>
  if(error&&!session)return <div className="page-stack"><button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Voltar</button><div className="app-error-banner">{error}</div></div>

  const sessionExercises=session?.exercises||[]
  const totalSets=sessionExercises.reduce((sum,ex)=>sum+Number(ex.sets||0),0)
  const savedCount=Object.values(saved).filter(Boolean).length
  const exerciseComplete=ex=>Array.from({length:ex.sets},(_,i)=>saved[`${ex.id}:${i+1}`]).every(Boolean)
  const timerText=`${String(Math.floor(timerSeconds/60)).padStart(2,'0')}:${String(timerSeconds%60).padStart(2,'0')}`

  return <div className="page-stack">
    <button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={17}/> Voltar ao início</button>
    {error&&<div className="app-error-banner">{error}</div>}
    <section className="workout-header"><div><div className="today-meta"><Badge>Em andamento</Badge><span><Dumbbell size={15}/> {prescription?.name||session?.prescriptionName}</span><span><Clock3 size={14}/> {prescription?.estimatedMinutes||session?.estimatedMinutes||0} min</span></div><h1>{workout.name}</h1><p>{prescription?.notes||workout.notes||workout.description||'Complete cada série e registre o que realmente executou.'}</p></div><button className="secondary-btn" onClick={()=>openTimer(90)}><TimerReset size={18}/> Descanso</button></section>
    <div className="workout-progress"><div><span>Progresso da prescrição</span><strong>{savedCount}/{totalSets} séries</strong></div><div className="bar"><i style={{width:`${totalSets?savedCount/totalSets*100:0}%`}}></i></div></div>
    <div className="exercise-stack">{sessionExercises.map((ex,idx)=><section key={ex.id} className={`exercise-card ${exerciseComplete(ex)?'completed':''}`}><button className="exercise-summary" onClick={()=>setOpenExercise(openExercise===ex.id?null:ex.id)}><span className="exercise-index">{exerciseComplete(ex)?<Check size={17}/>:idx+1}</span><div><strong>{ex.name}</strong><small>{ex.sets} séries · {ex.reps} reps · {ex.restSeconds}s descanso</small></div>{(ex.videoUrl||ex.exerciseId)&&<span className="video-icon"><Video size={18}/></span>}<ChevronDown size={18} className={openExercise===ex.id?'rotate':''}/></button>
      {openExercise===ex.id&&<div className="exercise-detail">{ex.notes&&<div className="exercise-prescription-note"><strong>Orientação do treinador</strong><p>{ex.notes}</p></div>}<div className="exercise-detail-actions">{(ex.videoUrl||ex.exerciseId)&&<button className="secondary-btn compact" onClick={()=>playExerciseVideo(ex)}><Video size={16}/> Ver execução</button>}<button className="secondary-btn compact" onClick={()=>openTimer(ex.restSeconds)}><TimerReset size={16}/> Descanso {ex.restSeconds}s</button></div><div className="set-table set-table-notes"><div className="set-row header"><span>Série</span><span>Carga</span><span>Reps</span><span>Observação</span><span></span></div>{Array.from({length:ex.sets},(_,i)=>i+1).map(n=>{const key=`${ex.id}:${n}`;const draft=drafts[key]||{};return <div className={`set-row ${saved[key]?'set-row-saved':''}`} key={n}><strong>{n}</strong><input type="number" step="0.5" value={draft.weight??''} onChange={e=>{setDrafts(v=>({...v,[key]:{...v[key],weight:e.target.value}}));setSaved(v=>({...v,[key]:false}))}}/><input type="number" value={draft.reps??''} onChange={e=>{setDrafts(v=>({...v,[key]:{...v[key],reps:e.target.value}}));setSaved(v=>({...v,[key]:false}))}}/><input className="set-note-input" value={draft.notes??''} onChange={e=>{setDrafts(v=>({...v,[key]:{...v[key],notes:e.target.value}}));setSaved(v=>({...v,[key]:false}))}} placeholder="Como foi?"/><button className="set-check" disabled={busy===key} onClick={()=>saveSet(ex.id,n)}>{busy===key?'…':<Check size={15}/>}</button></div>})}</div></div>}
    </section>)}</div>
    <section className="panel workout-final-notes"><label><span>Observação final</span><textarea value={finalNotes} onChange={e=>setFinalNotes(e.target.value)} placeholder="Dor, dificuldade ou comentário para o treinador..."/></label></section>
    <button className="finish-btn" disabled={savedCount<totalSets||busy==='finish'} onClick={finish}>{busy==='finish'?'Finalizando...':'Finalizar prescrição'} <Trophy size={18}/></button>
    {timer&&<div className="modal-backdrop" onClick={()=>setTimer(false)}><div className="timer-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setTimer(false)}><X size={18}/></button><span className="eyebrow">Tempo de descanso</span><div className={`timer-circle ${timerSeconds===0?'done':''}`}>{timerText}</div><p>{timerSeconds===0?'Descanso concluído.':'Mantenha o intervalo indicado na prescrição.'}</p><div className="timer-actions"><button onClick={()=>setTimerSeconds(v=>Math.max(0,v-15))}>-15s</button><button className="primary-btn" onClick={()=>setTimerRunning(v=>!v)}>{timerRunning?'Pausar':'Iniciar'}</button><button onClick={()=>setTimerSeconds(v=>v+15)}>+15s</button></div></div></div>}
    {videoSrc&&<div className="modal-backdrop" onClick={closeVideo}><div className="video-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={closeVideo}><X size={18}/></button><h3>{videoTitle}</h3><video src={videoSrc} controls autoPlay playsInline/></div></div>}
  </div>
}

function StudentHistory({ backend }) {
  const sessions=backend.progress?.sessions || []
  const workouts=backend.workouts || []
  const trainerByWorkout=new Map(workouts.map(w=>[w.id,{name:w.trainerName,avatar:w.trainerAvatarUrl}]))
  return <div className="page-stack"><section className="page-heading"><span className="eyebrow">Histórico</span><h1>Seus treinos anteriores</h1><p>Todas as sessões concluídas no Atlas.</p></section>
    <section className="panel no-pad"><div className="history-list">{sessions.length?[...sessions].reverse().map(item=>{const trainer=trainerByWorkout.get(item.workoutId)||{};return <div className="history-row" key={item.id}><div className="history-date">{new Date(item.completedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).toUpperCase()}</div><div className="history-main"><strong>{item.workoutName}</strong><small><Avatar initials={initialsOf(trainer.name)} size="xs" src={trainer.avatar}/>{trainer.name||'Treinador'} · volume {Math.round(Number(item.volume||0)).toLocaleString('pt-BR')}</small>{item.notes&&<span className="history-note">{item.notes}</span>}</div><Badge tone="green">Realizado</Badge></div>}):<div className="empty-state">Nenhum treino concluído ainda.</div>}</div></section>
  </div>
}

function StudentProgress({ backend }) {
  const progress=backend.progress || {summary:{completedWorkouts:0,workoutsLast30Days:0,totalVolume:0,maxWeight:0},sessions:[],exercises:[]}
  const summary=progress.summary || {}
  const sessions=progress.sessions || []
  const maxVolume=Math.max(1,...sessions.map(s=>Number(s.volume||0)))
  const maxSessionWeight=Math.max(1,...sessions.map(s=>Number(s.maxWeight||0)))
  const annotations=progress.annotations || []
  return <div className="page-stack"><section className="page-heading"><span className="eyebrow">Evolução</span><h1>Seu progresso em números</h1><p>Carga máxima, volume e frequência calculados a partir das séries registradas.</p></section>
    <div className="stats-grid">
      <StatCard icon={Trophy} label="Treinos concluídos" value={summary.completedWorkouts||0} detail="total"/>
      <StatCard icon={CalendarDays} label="Últimos 30 dias" value={summary.workoutsLast30Days||0} detail="treinos"/>
      <StatCard icon={Dumbbell} label="Carga máxima" value={`${Number(summary.maxWeight||0).toFixed(1)} kg`} detail="maior série registrada"/>
      <StatCard icon={Activity} label="Volume total" value={Math.round(Number(summary.totalVolume||0)).toLocaleString('pt-BR')} detail="kg × repetições"/>
    </div>
    <section className="panel"><div className="panel-head"><div><h3>Volume por treino</h3><p>Volume real de cada sessão concluída.</p></div><LineChart size={20}/></div>{sessions.length?<div className="progress-bars">{sessions.slice(-12).map(s=><div className="progress-bar-row" key={s.id}><span>{new Date(s.completedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span><div><i style={{width:`${Math.max(4,Number(s.volume||0)/maxVolume*100)}%`}}></i></div><strong>{Math.round(Number(s.volume||0)).toLocaleString('pt-BR')}</strong></div>)}</div>:<div className="empty-state compact-empty">Conclua treinos e registre séries para gerar o gráfico.</div>}</section>
    <section className="panel"><div className="panel-head"><div><h3>Carga máxima ao longo do tempo</h3><p>Maior carga registrada em cada treino concluído.</p></div><Dumbbell size={20}/></div>{sessions.length?<div className="progress-bars max-load-bars">{sessions.slice(-12).map(s=><div className="progress-bar-row" key={'load-'+s.id}><span>{new Date(s.completedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span><div><i style={{width:`${Math.max(4,Number(s.maxWeight||0)/maxSessionWeight*100)}%`}}></i></div><strong>{Number(s.maxWeight||0).toFixed(1)} kg</strong></div>)}</div>:<div className="empty-state compact-empty">Ainda não há carga registrada.</div>}</section>
    <section className="panel"><div className="panel-head"><div><h3>Melhores cargas por exercício</h3><p>Baseado nas séries concluídas.</p></div><Dumbbell size={20}/></div>{progress.exercises?.length?<div className="progress-exercise-list">{progress.exercises.map(ex=><div key={ex.name}><strong>{ex.name}</strong><span>{Number(ex.maxWeight||0).toFixed(1)} kg</span><small>{ex.sessions} treino(s) · volume {Math.round(Number(ex.volume||0)).toLocaleString('pt-BR')}</small></div>)}</div>:<div className="empty-state compact-empty">Ainda não há dados de carga.</div>}</section>
    <section className="panel"><div className="panel-head"><div><h3>Minhas observações</h3><p>Anotações registradas durante as séries.</p></div><MessageCircle size={20}/></div>{annotations.length?<div className="training-notes-list">{annotations.slice(0,20).map(note=><div key={note.id}><strong>{note.exerciseName} · série {note.setNumber}</strong><span>{note.notes}</span><small>{note.workoutName} · {new Date(note.completedAt).toLocaleDateString('pt-BR')}</small></div>)}</div>:<div className="empty-state compact-empty">Nenhuma observação registrada nas séries.</div>}</section>
  </div>
}

function Messages({ trainer = false, token }) {
  const [contacts,setContacts]=useState([])
  const [selectedId,setSelectedId]=useState('')
  const [conversation,setConversation]=useState(null)
  const [draft,setDraft]=useState('')
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')

  const loadContacts=async()=>{
    try{
      const data=await apiRequest('/messages/contacts',{token})
      setContacts(data)
      if(selectedId && !data.some(c=>c.id===selectedId)){setSelectedId('');setConversation(null)}
    }catch(e){setError(e.message)}
  }
  useEffect(()=>{loadContacts()},[token])

  const openContact=async(id)=>{
    setSelectedId(id);setBusy('conversation');setError('')
    try{setConversation(await apiRequest(`/messages/${id}`,{token}));await loadContacts()}
    catch(e){setError(e.message)}finally{setBusy('')}
  }

  const sendMessage=async()=>{
    if(!selectedId||!draft.trim())return
    setBusy('send');setError('')
    try{
      await apiRequest(`/messages/${selectedId}`,{token,method:'POST',body:{body:draft.trim()}})
      setDraft('')
      setConversation(await apiRequest(`/messages/${selectedId}`,{token}))
      await loadContacts()
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  return <div className="page-stack chat-page"><section className="page-heading"><span className="eyebrow">Mensagens</span><h1>{trainer?'Converse com seus alunos':'Fale com seus treinadores'}</h1><p>Conversas persistidas no Atlas.</p></section>
    {error&&<div className="app-error-banner">{error}</div>}
    <div className="real-chat-layout">
      <section className="panel chat-contact-panel"><h3>Conversas</h3>{contacts.length?<div className="chat-contact-list">{contacts.map(c=><button key={c.id} className={selectedId===c.id?'active':''} onClick={()=>openContact(c.id)}><Avatar initials={initialsOf(c.name)} size="sm" src={c.avatarUrl}/><div><strong>{c.name}</strong><small>{c.lastMessage||c.email}</small></div>{c.unreadCount>0&&<span className="chat-unread">{c.unreadCount}</span>}</button>)}</div>:<div className="empty-state compact-empty">Nenhum contato vinculado.</div>}</section>
      <section className="panel conversation-panel">{selectedId?<>{busy==='conversation'&&!conversation?<div className="empty-state compact-empty">Carregando conversa...</div>:conversation?<><div className="conversation-head"><Avatar initials={initialsOf(conversation.contact?.trainerId===selectedId?conversation.contact?.trainerName:conversation.contact?.studentName)} size="sm"/><strong>{contacts.find(c=>c.id===selectedId)?.name}</strong></div><div className="conversation-messages">{conversation.messages.length?conversation.messages.map(m=><div key={m.id} className={`chat-bubble ${m.senderId===selectedId?'received':'sent'}`}><span>{m.body}</span><small>{new Date(m.createdAt).toLocaleString('pt-BR')}</small></div>):<div className="empty-state compact-empty">Envie a primeira mensagem.</div>}</div><div className="message-composer"><input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey)sendMessage()}} placeholder="Escreva uma mensagem"/><button className="send-btn" disabled={!draft.trim()||busy==='send'} onClick={sendMessage}><Send size={18}/></button></div></>:null}</>:<div className="empty-state"><MessageCircle size={34}/><h3>Selecione uma conversa</h3><p>Escolha um aluno ou treinador ao lado.</p></div>}</section>
    </div>
  </div>
}


function ProfilePage({ user, token, onUserChange }) {
  const [name,setName]=useState(user?.name||'')
  const [image,setImage]=useState('')
  const [trainerPublic,setTrainerPublic]=useState(Boolean(user?.trainerPublic))
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const hasTrainer=(user?.profiles||[]).includes('trainer')

  useEffect(()=>{setName(user?.name||'');setTrainerPublic(Boolean(user?.trainerPublic));setImage('')},[user?.id,user?.name,user?.trainerPublic])

  const chooseAvatar=async file=>{
    if(!file)return
    if(!file.type.startsWith('image/')){setError('Selecione uma imagem.');return}
    if(file.size>1024*1024){setError('A foto deve ter no máximo 1 MB.');return}
    try{setImage(await fileToDataUrl(file));setError('')}catch(e){setError(e.message)}
  }

  const save=async()=>{
    setBusy(true);setError('');setMessage('')
    try{
      const data=await apiRequest('/me',{token,method:'PATCH',body:{
        name:name.trim(),
        ...(image?{avatarUrl:image}:{}),
        ...(hasTrainer?{trainerPublic}:{})
      }})
      onUserChange(data.user)
      setMessage('Perfil atualizado.')
      setImage('')
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  return <div className="page-stack profile-page">
    <section className="page-heading"><span className="eyebrow">Sua conta</span><h1>Perfil</h1><p>Gerencie como você aparece no Atlas e seus dados pessoais.</p></section>
    {error&&<div className="app-error-banner">{error}</div>}{message&&<div className="app-success-banner">{message}</div>}
    <div className="profile-page-grid">
      <section className="panel profile-main-card">
        <div className="profile-page-photo"><Avatar initials={initialsOf(name)} size="lg" src={image||user?.avatarUrl}/><label className="secondary-btn compact"><Upload size={16}/> Alterar foto<input type="file" accept="image/*" onChange={e=>chooseAvatar(e.target.files?.[0])}/></label></div>
        <div className="form-grid"><label className="span-2"><span>Nome</span><input value={name} onChange={e=>setName(e.target.value)} /></label><label className="span-2"><span>E-mail</span><input value={user?.email||''} disabled /></label></div>
      </section>
      {hasTrainer&&<section className="panel visibility-card"><div className="panel-head"><div><h3>Visibilidade como treinador</h3><p>Escolha como novos alunos podem encontrar você.</p></div>{trainerPublic?<UsersRound size={20}/>:<Lock size={20}/>}</div>
        <button type="button" className={trainerPublic?'visibility-option active':'visibility-option'} onClick={()=>setTrainerPublic(true)}><UsersRound size={19}/><div><strong>Público</strong><span>Seu perfil aparece para alunos no Atlas e eles podem se vincular diretamente.</span></div>{trainerPublic&&<Check size={18}/>}</button>
        <button type="button" className={!trainerPublic?'visibility-option active':'visibility-option'} onClick={()=>setTrainerPublic(false)}><Lock size={19}/><div><strong>Privado</strong><span>Novos alunos entram somente pelo seu link de convite.</span></div>{!trainerPublic&&<Check size={18}/>}</button>
      </section>}
    </div>
    <button className="primary-btn profile-save-btn" disabled={!name.trim()||busy} onClick={save}>{busy?'Salvando...':'Salvar perfil'} <Check size={17}/></button>
  </div>
}

function PublicTrainers({ token, backend, refreshBackend }) {
  const [query,setQuery]=useState('')
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const trainers=backend.publicTrainers||[]
  const filtered=trainers.filter(t=>(t.name+' '+t.email).toLowerCase().includes(query.toLowerCase()))

  const link=async id=>{
    setBusy(id);setError('');setMessage('')
    try{
      await apiRequest(`/trainers/${id}/link`,{token,method:'POST'})
      await refreshBackend()
      setMessage('Treinador vinculado. Agora você pode definir sua disponibilidade e receber prescrições.')
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  return <div className="page-stack">
    <section className="page-heading"><span className="eyebrow">Descobrir</span><h1>Professores</h1><p>Encontre treinadores que escolheram manter o perfil público no Atlas.</p></section>
    {error&&<div className="app-error-banner">{error}</div>}{message&&<div className="app-success-banner">{message}</div>}
    <div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar professor"/></div>
    {filtered.length?<div className="trainer-directory">{filtered.map(t=><article className="panel trainer-public-card" key={t.id}><Avatar initials={initialsOf(t.name)} size="lg" src={t.avatarUrl}/><div><h3>{t.name}</h3><p>{t.email}</p><Badge tone={t.linked?'green':'light'}>{t.linked?'Vinculado':'Perfil público'}</Badge></div><button className={t.linked?'secondary-btn':'primary-btn'} disabled={t.linked||busy===t.id} onClick={()=>link(t.id)}>{t.linked?<><Check size={16}/> Vinculado</>:busy===t.id?'Vinculando...':<><UserPlus size={16}/> Vincular</>}</button></article>)}</div>:<section className="panel empty-state"><UsersRound size={34}/><h3>Nenhum professor encontrado</h3><p>Você ainda pode entrar por um link de convite de um treinador privado.</p></section>}
  </div>
}


function TrainerDashboard({ setPage, user, token, backend, onOpenStudent }) {
  const [period, setPeriod] = useState('Dia')
  const [remindBusy,setRemindBusy]=useState('')
  const [feedback,setFeedback]=useState('')
  const [error,setError]=useState('')
  const studentsData=backend.students || []
  const workouts=backend.workouts || []
  const dashboard=backend.dashboard || {students:[],attention:[]}
  const completed=workouts.filter(w=>w.status==='Realizado' || w.latestSession?.completedAt)
  const inProgress=workouts.filter(w=>w.latestSession && !w.latestSession.completedAt)
  const progressById=new Map((dashboard.students||[]).map(st=>[st.id,st]))
  const now=new Date()
  const periodStart=(()=>{
    const start=new Date(now)
    if(period==='Dia'){start.setHours(0,0,0,0);return start}
    if(period==='Semana'){start.setHours(0,0,0,0);const mondayOffset=(start.getDay()+6)%7;start.setDate(start.getDate()-mondayOffset);return start}
    if(period==='Mês')return new Date(now.getFullYear(),now.getMonth(),1)
    return new Date(now.getFullYear(),0,1)
  })()
  const activities=workouts.filter(w=>{const value=w.latestSession?.completedAt||w.latestSession?.startedAt||w.createdAt;return value&&new Date(value)>=periodStart})
    .sort((a,b)=>new Date(b.latestSession?.completedAt||b.latestSession?.startedAt||b.createdAt)-new Date(a.latestSession?.completedAt||a.latestSession?.startedAt||a.createdAt)).slice(0,6)

  const remind=async(st,event)=>{
    event.stopPropagation();setRemindBusy(st.id);setFeedback('');setError('')
    try{
      const result=await apiRequest(`/trainer/students/${st.id}/remind-workout`,{token,method:'POST'})
      setFeedback(result.sent?`Lembrete enviado para ${st.name}.`:`O lembrete de hoje para ${st.name} já foi enviado.`)
    }catch(e){setError(e.message)}finally{setRemindBusy('')}
  }

  return <div className="page-stack"><section className="welcome-row">
    <div><span className="eyebrow">Painel do treinador</span><h1>Boa noite, {user?.name || 'Treinador'} 👋</h1><p>Acompanhe frequência, volume, carga e prescrições dos seus alunos.</p></div>
    <button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={18}/> Criar treino</button>
  </section>
  {feedback&&<div className="app-success-banner">{feedback}</div>}{error&&<div className="app-error-banner">{error}</div>}
  <div className="stats-grid">
    <StatCard icon={UsersRound} label="Alunos vinculados" value={studentsData.length} detail="ativos no Atlas"/>
    <StatCard icon={ListChecks} label="Treinos prescritos" value={workouts.length} detail={`${completed.length} realizados`}/>
    <StatCard icon={Activity} label="Em execução" value={inProgress.length} detail="sessões abertas"/>
    <StatCard icon={Bell} label="Precisam de atenção" value={(dashboard.attention||[]).length} detail="sem treino recente ou sem prescrição"/>
  </div>
  <div className="grid-2 dashboard-grid">
    <section className="panel"><div className="panel-head activities-head"><div><h3>Atividades</h3><p>Estado atual das prescrições.</p></div><button className="text-btn" onClick={()=>setPage('workouts')}>Ver treinos</button></div>
      <div className="period-filter">{['Dia','Semana','Mês','Ano'].map(p=><button key={p} className={period===p?'active':''} onClick={()=>setPeriod(p)}>{p}</button>)}</div>
      <div className="activity-list">{activities.length?activities.map(w=><div className="activity-row" key={w.id}><Avatar initials={initialsOf(w.studentName)} size="sm"/><div><strong>{w.studentName || 'Aluno'}</strong><small>{w.name} · {new Date(w.latestSession?.completedAt||w.latestSession?.startedAt||w.createdAt).toLocaleDateString('pt-BR')}</small></div><Badge tone={w.status==='Realizado'?'green':w.status==='Não Realizado'?'gray':'light'}>{w.status}</Badge></div>):<div className="empty-state compact-empty">Nenhuma atividade neste período.</div>}</div>
    </section>
    <section className="panel"><div className="panel-head"><div><h3>Atenção necessária</h3><p>Alunos sem treino recente ou sem prescrição.</p></div><Bell size={19}/></div>
      {(dashboard.attention||[]).length?<div className="attention-list">{dashboard.attention.map(st=><div className="attention-row" key={st.id}><button className="attention-main" onClick={()=>onOpenStudent?.(st.id)}><Avatar initials={initialsOf(st.name)} size="sm" src={st.avatarUrl}/><div><strong>{st.name}</strong><small>{st.workoutCount?st.lastCompletedAt?`Último treino ${new Date(st.lastCompletedAt).toLocaleDateString('pt-BR')}`:'Nenhum treino concluído':'Sem treino prescrito'}</small></div><ChevronRight size={17}/></button>{st.workoutCount>0&&<button className="attention-remind" title="Notificar aluno sobre treino pendente" disabled={remindBusy===st.id} onClick={e=>remind(st,e)}><Bell size={17}/></button>}</div>)}</div>:<div className="empty-state compact-empty">Nenhum alerta de frequência no momento.</div>}
    </section>
  </div>
  <section className="panel"><div className="panel-head"><div><h3>Ranking dos alunos</h3><p>Frequência, volume e melhor carga dos alunos.</p></div><button className="secondary-btn compact" onClick={()=>setPage('students')}>Gerenciar alunos</button></div>
    {studentsData.length?<div className="student-table progress-student-table"><div className="student-table-head"><span>Aluno</span><span>Concluídos</span><span>Volume</span><span>Carga máx.</span><span>Último treino</span><span></span></div>
    {studentsData.map(st=>{const p=progressById.get(st.id)||{};return <button className="student-table-row dashboard-student-row" key={st.id} onClick={()=>onOpenStudent?.(st.id)}><div><Avatar initials={initialsOf(st.name)} size="sm" src={st.avatarUrl}/><strong>{st.name}</strong></div><strong>{p.completedWorkouts||0}</strong><span>{Math.round(Number(p.totalVolume||0)).toLocaleString('pt-BR')}</span><span>{Number(p.maxWeight||0).toFixed(1)} kg</span><span>{p.lastCompletedAt?new Date(p.lastCompletedAt).toLocaleDateString('pt-BR'):'—'}</span><ChevronRight size={18}/></button>})}</div>:<div className="empty-state compact-empty">Nenhum aluno vinculado ainda.</div>}
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
      <div><span className="eyebrow">Gestão de alunos</span><h1>Seus alunos</h1><p>Convites, disponibilidade e treinos dos seus alunos.</p></div>
      <button className="primary-btn" onClick={()=>setInvite(true)}><Share2 size={18}/> Convidar aluno</button>
    </section>

    {error && <div className="app-error-banner">{error}</div>}
    {message && <div className="app-success-banner">{message}</div>}


    <div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Buscar aluno"/></div><button className="filter">Todos <ChevronDown size={15}/></button></div>

    {linkedStudents.length ? <div className="student-card-grid">{linkedStudents.map((st)=><article className="student-card clickable" key={st.id} onClick={()=>onOpenStudent(st.id)}>
      <div className="student-card-top"><Avatar initials={initialsOf(st.name)} src={st.avatarUrl}/><div><h3>{st.name}</h3><p>{st.email}</p></div><button onClick={e=>e.stopPropagation()}><MoreHorizontal size={19}/></button></div>
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

function StudentDetail({ setPage, backend, studentId, token, refreshBackend }) {
  const [tab,setTab]=useState('workouts')
  const [progress,setProgress]=useState(null)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')
  const [copyWorkout,setCopyWorkout]=useState(null)
  const [copyStudentId,setCopyStudentId]=useState('')
  const [copyDays,setCopyDays]=useState([])
  const student=(backend.students || []).find(st=>st.id===studentId)
  if(!student) return <div className="page-stack"><button className="back-link" onClick={()=>setPage('students')}><ArrowLeft size={17}/> Voltar aos alunos</button><section className="panel empty-state"><UsersRound size={34}/><h2>Aluno não encontrado</h2><p>Selecione um aluno vinculado na tela anterior.</p></section></div>

  const workouts=(backend.workouts || []).filter(w=>w.studentId===student.id)
  const completed=workouts.filter(w=>w.latestSession?.completedAt)
  const initials=initialsOf(student.name)

  const loadProgress=async()=>{
    if(progress)return
    setBusy('progress');setError('')
    try{setProgress(await apiRequest(`/trainer/students/${student.id}/progress`,{token}))}
    catch(e){setError(e.message)}finally{setBusy('')}
  }
  useEffect(()=>{if(tab==='progress')loadProgress()},[tab,student.id])

  const downloadReport=async()=>{
    setBusy('report');setError('')
    try{
      const report=await apiRequest(`/trainer/students/${student.id}/report`,{token})
      const rows=[['Data','Treino','Volume','Carga máxima','Séries','Observação']]
      for(const item of report.sessions||[])rows.push([
        new Date(item.completedAt).toLocaleDateString('pt-BR'),item.workoutName,
        Math.round(Number(item.volume||0)),Number(item.maxWeight||0).toFixed(1),item.setCount||0,item.notes||''
      ])
      const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(';')).join('\n')
      const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'})
      const url=URL.createObjectURL(blob)
      const a=document.createElement('a');a.href=url;a.download=`atlas-${student.name.toLowerCase().replace(/[^a-z0-9]+/gi,'-')}-relatorio.csv`;a.click()
      URL.revokeObjectURL(url)
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  const copyTargets=(backend.students||[]).filter(st=>st.id!==student.id).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'))
  const copyTarget=copyTargets.find(st=>st.id===copyStudentId)||null
  const dayLabels=['D','S','T','Q','Q','S','S']
  const dayNames=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  const openCopyWorkout=workout=>{
    const firstTarget=copyTargets[0]||null
    setCopyWorkout(workout)
    setCopyStudentId(firstTarget?.id||'')
    const allowed=firstTarget?.availability||[]
    const preferred=(workout.scheduledDays||[]).filter(day=>allowed.includes(day))
    setCopyDays(preferred.length?preferred:(allowed[0]!=null?[allowed[0]]:[]))
    setError('')
  }

  const chooseCopyTarget=id=>{
    const target=copyTargets.find(st=>st.id===id)||null
    setCopyStudentId(id)
    const allowed=target?.availability||[]
    const preferred=(copyWorkout?.scheduledDays||[]).filter(day=>allowed.includes(day))
    setCopyDays(preferred.length?preferred:(allowed[0]!=null?[allowed[0]]:[]))
  }

  const toggleCopyDay=day=>{
    if(!copyTarget?.availability?.includes(day))return
    setCopyDays(days=>days.includes(day)?days.filter(x=>x!==day):[...days,day].sort((a,b)=>a-b))
  }

  const confirmCopyWorkout=async()=>{
    if(!copyWorkout||!copyStudentId||!copyDays.length)return
    setBusy('copy');setError('')
    try{
      await apiRequest('/workouts/'+copyWorkout.id+'/copy',{token,method:'POST',body:{studentId:copyStudentId,scheduledDays:copyDays}})
      await refreshBackend()
      setCopyWorkout(null);setCopyStudentId('');setCopyDays([])
    }catch(e){setError(e.message)}finally{setBusy('')}
  }

  const p=progress||{summary:{},sessions:[],exercises:[]}
  const maxVolume=Math.max(1,...(p.sessions||[]).map(x=>Number(x.volume||0)))
  const maxSessionWeight=Math.max(1,...(p.sessions||[]).map(x=>Number(x.maxWeight||0)))
  const annotations=p.annotations || []

  return <div className="page-stack"><button className="back-link" onClick={()=>setPage('students')}><ArrowLeft size={17}/> Voltar aos alunos</button>
    {error&&<div className="app-error-banner">{error}</div>}
    <section className="student-profile-head"><Avatar initials={initials} size="lg" src={student.avatarUrl}/><div><Badge>Aluno vinculado</Badge><h1>{student.name}</h1><p>{student.email}</p></div><div className="profile-actions"><button className="secondary-btn" disabled={busy==='report'} onClick={downloadReport}><Download size={17}/> {busy==='report'?'Gerando...':'Relatório CSV'}</button><button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={17}/> Novo treino</button></div></section>
    <div className="stats-grid"><StatCard icon={CalendarDays} label="Disponibilidade" value={student.availability?.length||0} detail="dias por semana"/><StatCard icon={Dumbbell} label="Treinos prescritos" value={workouts.length} detail="no Atlas"/><StatCard icon={Check} label="Treinos concluídos" value={completed.length} detail="sessões finalizadas"/></div>
    <div className="detail-tabs"><button className={tab==='workouts'?'active':''} onClick={()=>setTab('workouts')}>Treinos criados</button><button className={tab==='history'?'active':''} onClick={()=>setTab('history')}>Histórico</button><button className={tab==='progress'?'active':''} onClick={()=>setTab('progress')}>Evolução</button></div>

    {tab==='workouts'&&<section className="panel no-pad"><div className="detail-workout-list">{workouts.length?workouts.map(w=><div className="detail-workout-row" key={w.id}><span className="workout-icon"><Dumbbell size={18}/></span><div><strong>{w.name}</strong><small>{w.estimatedMinutes||0} min · {(w.scheduledDays||[]).map(d=>['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d]).join(' · ')||'Sem dias'}</small></div><Badge tone={w.status==='Realizado'?'green':w.status==='Não Realizado'?'gray':'light'}>{w.status}</Badge><button className="secondary-btn compact export-workout-btn" disabled={!copyTargets.length} onClick={()=>openCopyWorkout(w)}><Share2 size={15}/> Exportar</button></div>):<div className="empty-state">Nenhum treino prescrito.</div>}</div></section>}

    {tab==='history'&&<section className="panel no-pad"><div className="history-list">{workouts.filter(w=>w.latestSession).length?workouts.filter(w=>w.latestSession).map(w=><div className="history-row detail-history" key={w.id}><div className="history-date">{new Date(w.latestSession.completedAt||w.latestSession.startedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).toUpperCase()}</div><div className="history-main"><strong>{w.name}</strong><small>{w.model}</small></div><Badge tone={w.latestSession.completedAt?'green':'light'}>{w.latestSession.completedAt?'Realizado':'Em andamento'}</Badge></div>):<div className="empty-state">Nenhuma sessão registrada.</div>}</div></section>}

    {tab==='progress'&&<section className="page-stack nested-stack">{busy==='progress'&&!progress?<section className="panel empty-state">Carregando evolução...</section>:<>
      <div className="stats-grid"><StatCard icon={Trophy} label="Concluídos" value={p.summary?.completedWorkouts||0}/><StatCard icon={Activity} label="Volume total" value={Math.round(Number(p.summary?.totalVolume||0)).toLocaleString('pt-BR')}/><StatCard icon={Dumbbell} label="Carga máxima" value={`${Number(p.summary?.maxWeight||0).toFixed(1)} kg`}/></div>
      <section className="panel"><div className="panel-head"><div><h3>Volume por treino</h3><p>Frequência e carga registradas.</p></div><LineChart size={20}/></div>{p.sessions?.length?<div className="progress-bars">{p.sessions.slice(-12).map(x=><div className="progress-bar-row" key={x.id}><span>{new Date(x.completedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span><div><i style={{width:`${Math.max(4,Number(x.volume||0)/maxVolume*100)}%`}}></i></div><strong>{Math.round(Number(x.volume||0))}</strong></div>)}</div>:<div className="empty-state compact-empty">Sem dados de treino concluído.</div>}</section>
      <section className="panel"><div className="panel-head"><div><h3>Carga máxima ao longo do tempo</h3><p>Maior carga por sessão concluída.</p></div><Dumbbell size={20}/></div>{p.sessions?.length?<div className="progress-bars max-load-bars">{p.sessions.slice(-12).map(x=><div className="progress-bar-row" key={'trainer-load-'+x.id}><span>{new Date(x.completedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span><div><i style={{width:`${Math.max(4,Number(x.maxWeight||0)/maxSessionWeight*100)}%`}}></i></div><strong>{Number(x.maxWeight||0).toFixed(1)} kg</strong></div>)}</div>:<div className="empty-state compact-empty">Sem dados de carga.</div>}</section>
      <section className="panel"><div className="panel-head"><div><h3>Cargas por exercício</h3><p>Melhores marcas do aluno.</p></div><Dumbbell size={20}/></div>{p.exercises?.length?<div className="progress-exercise-list">{p.exercises.map(ex=><div key={ex.name}><strong>{ex.name}</strong><span>{Number(ex.maxWeight||0).toFixed(1)} kg</span><small>{ex.sessions} sessão(ões)</small></div>)}</div>:<div className="empty-state compact-empty">Sem séries registradas.</div>}</section>
      <section className="panel"><div className="panel-head"><div><h3>Anotações do aluno</h3><p>Comentários salvos nas séries executadas.</p></div><MessageCircle size={20}/></div>{annotations.length?<div className="training-notes-list">{annotations.slice(0,30).map(note=><div key={note.id}><strong>{note.exerciseName} · série {note.setNumber}</strong><span>{note.notes}</span><small>{note.workoutName} · {new Date(note.completedAt).toLocaleDateString('pt-BR')}</small></div>)}</div>:<div className="empty-state compact-empty">Nenhuma anotação registrada.</div>}</section>
    </>}</section>}

    {copyWorkout&&<div className="modal-backdrop" onClick={()=>setCopyWorkout(null)}><div className="standard-modal copy-workout-modal" onClick={e=>e.stopPropagation()}>
      <button className="modal-close" onClick={()=>setCopyWorkout(null)}><X size={18}/></button>
      <div className="modal-icon"><Share2 size={22}/></div><h2>Exportar treino</h2>
      <p>Copiar <strong>{copyWorkout.name}</strong> de {student.name} para outro aluno vinculado.</p>
      <label className="field-label">Aluno de destino</label>
      <select value={copyStudentId} onChange={e=>chooseCopyTarget(e.target.value)}><option value="">Selecione</option>{copyTargets.map(target=><option key={target.id} value={target.id}>{target.name}</option>)}</select>
      {copyTarget&&<><label className="field-label">Dias para o aluno de destino</label><div className="weekday-picker copy-days-picker">{dayLabels.map((label,day)=><button type="button" key={day} disabled={!copyTarget.availability?.includes(day)} className={copyDays.includes(day)?'active':''} onClick={()=>toggleCopyDay(day)}>{label}</button>)}</div><div className="availability-summary"><strong>{copyDays.length} dia(s) selecionado(s)</strong><span>{copyDays.map(day=>dayNames[day]).join(' · ')||'Selecione os dias'}</span></div></>}
      {!copyTargets.length&&<div className="app-error-banner">Você precisa ter outro aluno vinculado para exportar este treino.</div>}
      <button className="primary-btn full" disabled={busy==='copy'||!copyStudentId||!copyDays.length} onClick={confirmCopyWorkout}>{busy==='copy'?'Exportando...':'Exportar treino'} <Share2 size={17}/></button>
    </div></div>}
  </div>
}

function ExerciseLibrary({ setPage, token }) {
  const [source,setSource]=useState('personal')
  const [items,setItems]=useState([])
  const [externalItems,setExternalItems]=useState([])
  const [filters,setFilters]=useState({name:'',category:'',muscle:''})
  const [modal,setModal]=useState(false)
  const [form,setForm]=useState({name:'',category:'',muscleGroups:'',description:'',videoUrl:'',videoFile:null})
  const [videoSrc,setVideoSrc]=useState('')
  const [videoTitle,setVideoTitle]=useState('')
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')

  const load=async(next=filters)=>{setBusy('load');setError('');try{const q=new URLSearchParams();Object.entries(next).forEach(([k,v])=>{if(String(v||'').trim())q.set(k,String(v).trim())});setItems(await apiRequest(`/exercises${q.toString()?`?${q.toString()}`:''}`,{token}))}catch(e){setError(e.message)}finally{setBusy('')}}
  const loadExternal=async()=>{setBusy('external');setError('');try{const q=new URLSearchParams();if(filters.name.trim())q.set('search',filters.name.trim());const data=await apiRequest(`/exercises/external?${q}`,{token});setExternalItems(data.items||[])}catch(e){setError(e.message)}finally{setBusy('')}}
  useEffect(()=>{load()},[])
  useEffect(()=>{if(source==='external'&&!externalItems.length)loadExternal()},[source])

  const submit=async()=>{if(!form.name.trim())return;setBusy('save');setError('');try{let videoBase64='',videoMime='',videoFilename='';if(form.videoFile){videoBase64=await fileToDataUrl(form.videoFile);videoMime=form.videoFile.type;videoFilename=form.videoFile.name}await apiRequest('/exercises',{token,method:'POST',body:{name:form.name,category:form.category,muscleGroups:form.muscleGroups.split(',').map(v=>v.trim()).filter(Boolean),description:form.description,videoUrl:form.videoUrl,videoBase64,videoMime,videoFilename}});setForm({name:'',category:'',muscleGroups:'',description:'',videoUrl:'',videoFile:null});setModal(false);await load()}catch(e){setError(e.message)}finally{setBusy('')}}
  const play=async(ex)=>{setError('');try{if(videoSrc.startsWith('blob:'))URL.revokeObjectURL(videoSrc);if(ex.videoUrl){setVideoSrc(ex.videoUrl);setVideoTitle(ex.name);return}if(ex.hasUploadedVideo){const blob=await apiBlob(`/exercises/${ex.id}/video`,token);setVideoSrc(URL.createObjectURL(blob));setVideoTitle(ex.name)}}catch(e){setError(e.message)}}
  const remove=async id=>{setBusy(id);setError('');try{await apiRequest(`/exercises/${id}`,{token,method:'DELETE'});await load()}catch(e){setError(e.message)}finally{setBusy('')}}
  const display=source==='personal'?items:externalItems

  return <div className="page-stack">
    <section className="page-heading action-heading"><div><span className="eyebrow">Biblioteca</span><h1>Exercícios</h1><p>Use sua biblioteca pessoal ou consulte exercícios externos em português.</p></div><button className="primary-btn" onClick={()=>setModal(true)}><Plus size={18}/> Novo exercício</button></section>
    {error&&<div className="app-error-banner">{error}</div>}
    <div className="tabs library-source-tabs"><button className={source==='personal'?'active':''} onClick={()=>setSource('personal')}>Pessoal</button><button className={source==='external'?'active':''} onClick={()=>setSource('external')}>Externa · wger</button></div>
    <section className="panel exercise-filter-panel"><div className="exercise-filter-grid"><div className="search-box"><Search size={18}/><input value={filters.name} onChange={e=>setFilters(v=>({...v,name:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&(source==='personal'?load():loadExternal())} placeholder="Nome do exercício"/></div>{source==='personal'&&<><input value={filters.category} onChange={e=>setFilters(v=>({...v,category:e.target.value}))} placeholder="Categoria"/><input value={filters.muscle} onChange={e=>setFilters(v=>({...v,muscle:e.target.value}))} placeholder="Grupo muscular"/></>}<button className="secondary-btn compact" onClick={()=>source==='personal'?load():loadExternal()} disabled={busy==='load'||busy==='external'}>{busy==='load'||busy==='external'?'Buscando...':'Buscar'}</button></div></section>
    {display.length?<div className="exercise-library-grid">{display.map(ex=><article className="panel exercise-library-card" key={ex.id}><div className="panel-head"><div><h3>{ex.name}</h3><p>{source==='external'?'Biblioteca externa · wger':ex.category || 'Sem categoria'}</p></div>{source==='personal'&&<button className="remove-btn" disabled={busy===ex.id} onClick={()=>remove(ex.id)}><X size={16}/></button>}</div>{ex.imageUrl&&<img className="external-exercise-image" src={ex.imageUrl} alt=""/>}<div className="muscle-tags">{(ex.muscleGroups||[]).slice(0,6).map(m=><span key={m}>{m}</span>)}</div><p className="exercise-description">{ex.description || 'Sem descrição.'}</p><div className="exercise-card-actions">{(ex.videoUrl||ex.hasUploadedVideo)&&<button className="secondary-btn compact" onClick={()=>play(ex)}><Video size={16}/> Ver vídeo</button>}<button className="text-btn" onClick={()=>setPage('builder')}>Usar em treino <ChevronRight size={15}/></button></div></article>)}</div>:<section className="panel empty-state"><BookOpen size={34}/><h3>Nenhum exercício encontrado</h3><p>{source==='external'?'Tente outra busca na biblioteca externa.':'Cadastre o primeiro exercício ou ajuste os filtros.'}</p></section>}
    {modal&&<div className="modal-backdrop" onClick={()=>setModal(false)}><div className="standard-modal exercise-create-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setModal(false)}><X size={18}/></button><div className="modal-icon"><Dumbbell size={23}/></div><h2>Novo exercício</h2><label className="field-label">Nome</label><input value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))}/><label className="field-label">Categoria</label><input value={form.category} onChange={e=>setForm(v=>({...v,category:e.target.value}))}/><label className="field-label">Grupos musculares</label><input value={form.muscleGroups} onChange={e=>setForm(v=>({...v,muscleGroups:e.target.value}))}/><label className="field-label">Descrição</label><textarea value={form.description} onChange={e=>setForm(v=>({...v,description:e.target.value}))}/><label className="field-label">URL de vídeo (opcional)</label><input value={form.videoUrl} onChange={e=>setForm(v=>({...v,videoUrl:e.target.value}))}/><label className="video-upload-field"><Upload size={18}/><span>{form.videoFile?form.videoFile.name:'Ou enviar vídeo próprio (até 8 MB)'}</span><input type="file" accept="video/*" onChange={e=>setForm(v=>({...v,videoFile:e.target.files?.[0]||null}))}/></label><button className="primary-btn full" disabled={!form.name.trim()||busy==='save'} onClick={submit}>{busy==='save'?'Salvando...':'Salvar exercício'} <Check size={17}/></button></div></div>}
    {videoSrc&&<div className="modal-backdrop" onClick={()=>{if(videoSrc.startsWith('blob:'))URL.revokeObjectURL(videoSrc);setVideoSrc('')}}><div className="video-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>{if(videoSrc.startsWith('blob:'))URL.revokeObjectURL(videoSrc);setVideoSrc('')}}><X size={18}/></button><h3>{videoTitle}</h3><video src={videoSrc} controls playsInline/></div></div>}
  </div>
}

function Workouts({ setPage, token, backend, onOpenBuilder, onEditWorkout }) {
  const [query,setQuery]=useState('')
  const [tab,setTab]=useState('workouts')
  const [statusFilter,setStatusFilter]=useState('')
  const [templates,setTemplates]=useState([])
  const [error,setError]=useState('')
  const [busy,setBusy]=useState('')
  const loadTemplates=async()=>{setBusy('templates');setError('');try{setTemplates(await apiRequest('/templates',{token}))}catch(e){setError(e.message)}finally{setBusy('')}}
  useEffect(()=>{loadTemplates()},[token])

  const rows=(backend.workouts||[]).map(w=>({id:w.id,name:w.name,student:w.studentName||'Aluno não identificado',routine:(w.scheduledDays||[]).map(d=>['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d]).join(' · ')||'—',prescriptionCount:workoutPrescriptions(w).length,hasStarted:!!w.latestSession,status:w.status||'Pendente',dueState:w.status==='Realizado'?'Realizado':w.status==='Não Realizado'?'Vencido':'A vencer'}))
  const filtered=rows.filter(w=>{const matches=(w.name+' '+w.student+' '+w.status+' '+w.dueState).toLowerCase().includes(query.toLowerCase());return matches&&(!statusFilter||w.dueState===statusFilter)})
  const toneFor=status=>status==='Realizado'?'green':status==='Não Realizado'?'gray':'light'
  const removeTemplate=async id=>{setBusy(id);setError('');try{await apiRequest('/templates/'+id,{token,method:'DELETE'});await loadTemplates()}catch(e){setError(e.message)}finally{setBusy('')}}

  return <div className="page-stack"><section className="page-heading action-heading"><div><span className="eyebrow">Prescrição</span><h1>Treinos & templates</h1><p>Monte planos livres com quantas prescrições forem necessárias.</p></div><div className="heading-actions">{tab==='templates'&&<button className="secondary-btn" onClick={()=>onOpenBuilder('')}><Plus size={18}/> Novo template</button>}<button className="primary-btn" onClick={()=>onOpenBuilder('')}><Plus size={18}/> Criar treino</button></div></section>
    {error&&<div className="app-error-banner">{error}</div>}
    <div className="tabs"><button className={tab==='workouts'?'active':''} onClick={()=>setTab('workouts')}>Treinos prescritos</button><button className={tab==='templates'?'active':''} onClick={()=>setTab('templates')}>Templates</button></div>
    {tab==='workouts'?<><div className="toolbar workout-filters"><div className="search-box grow"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por treino ou aluno"/></div><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">Todas as situações</option><option>A vencer</option><option>Vencido</option><option>Realizado</option></select></div><section className="panel no-pad"><div className="workout-table"><div className="workout-table-head"><span>Treino</span><span>Aluno</span><span>Rotina</span><span>Prescrições</span><span>Status</span><span></span></div>{filtered.map(w=><div className="workout-table-row" key={w.id}><div><span className="workout-icon"><Dumbbell size={18}/></span><div><strong>{w.name}</strong><small>Plano de treino</small></div></div><span>{w.student}</span><span>{w.routine}</span><strong>{w.prescriptionCount}</strong><Badge tone={toneFor(w.status)}>{w.status}</Badge><button disabled={w.hasStarted} title={w.hasStarted?'Treinos já iniciados não podem ser editados.':'Editar treino'} onClick={()=>onEditWorkout(w.id)}><Pencil size={17}/></button></div>)}{!filtered.length&&<div className="empty-state">Nenhum treino prescrito ainda.</div>}</div></section></>:<section className="template-grid">{busy==='templates'&&!templates.length?<div className="panel empty-state">Carregando templates...</div>:templates.length?templates.map(t=><article className="panel template-card" key={t.id}><div className="panel-head"><div><h3>{t.name}</h3><p>{t.description||'Sem descrição'}</p></div><button className="remove-btn" disabled={busy===t.id} onClick={()=>removeTemplate(t.id)}><X size={16}/></button></div><div className="template-meta"><span><Dumbbell size={15}/>{t.exercises?.length||0} exercícios</span><span><Clock3 size={15}/>{t.estimatedMinutes||0} min</span></div><div className="template-actions"><button className="primary-btn compact" onClick={()=>onOpenBuilder(t.id)}>Usar como prescrição</button></div></article>):<div className="panel empty-state"><ListChecks size={34}/><h3>Nenhum template criado</h3><p>Crie modelos reutilizáveis para adicionar a qualquer treino.</p><button className="primary-btn" onClick={()=>onOpenBuilder('')}><Plus size={17}/> Criar template</button></div>}</section>}
  </div>
}

function TemplateBuilder({ setPage, token }) {
  const [name,setName]=useState('')
  const [description,setDescription]=useState('')
  const [notes,setNotes]=useState('')
  const [estimatedMinutes,setEstimatedMinutes]=useState('45')
  const [items,setItems]=useState([])
  const [library,setLibrary]=useState([])
  const [libraryQuery,setLibraryQuery]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  useEffect(()=>{apiRequest('/exercises',{token}).then(setLibrary).catch(e=>setError(e.message))},[token])
  const makeItem=(src={})=>({id:globalThis.crypto?.randomUUID?.()||String(Date.now()+Math.random()),exerciseId:src.id||src.exerciseId||null,name:src.name||'',sets:String(src.sets||3),reps:String(src.reps||10),weight:String(src.suggestedWeight||0),rest:String(src.restSeconds||60),notes:src.notes||'',videoUrl:src.videoUrl||''})
  const addManual=()=>setItems(v=>[...v,makeItem()])
  const addFromLibrary=ex=>setItems(v=>[...v,makeItem(ex)])
  const update=(id,key,value)=>setItems(v=>v.map(x=>x.id===id?{...x,[key]:value}:x))
  const remove=id=>setItems(v=>v.filter(x=>x.id!==id))
  const filtered=library.filter(ex=>(ex.name+' '+ex.category+' '+(ex.muscleGroups||[]).join(' ')).toLowerCase().includes(libraryQuery.toLowerCase()))

  const save=async()=>{
    if(!name.trim()||!items.length||items.some(x=>!x.name.trim()))return
    setBusy(true);setError('')
    try{
      await apiRequest('/templates',{token,method:'POST',body:{name:name.trim(),description,notes,estimatedMinutes:Number(estimatedMinutes)||0,exercises:items.map(x=>({exerciseId:x.exerciseId,name:x.name,sets:Number(x.sets)||1,reps:Number(x.reps)||1,suggestedWeight:Number(x.weight)||0,restSeconds:Number(x.rest)||0,notes:x.notes,videoUrl:x.videoUrl}))}})
      setPage('workouts')
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  return <div className="page-stack builder-page">
    <button className="back-link" onClick={()=>setPage('workouts')}><ArrowLeft size={17}/> Voltar aos templates</button>
    <section className="page-heading"><span className="eyebrow">Template</span><h1>Novo template de treino</h1><p>Crie um modelo reutilizável e edite tudo antes de prescrever.</p></section>
    {error&&<div className="app-error-banner">{error}</div>}
    <div className="builder-layout"><div className="builder-main">
      <section className="panel form-panel"><h3>Informações do template</h3><div className="form-grid">
        <label className="span-2"><span>Nome</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: Hipertrofia A"/></label>
        <label><span>Tempo estimado</span><input type="number" min="0" value={estimatedMinutes} onChange={e=>setEstimatedMinutes(e.target.value)}/></label>
        <label className="span-2"><span>Descrição</span><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Objetivo do template"/></label>
        <label className="span-2"><span>Observações gerais</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Orientações gerais"/></label>
      </div></section>
      <section className="panel"><div className="panel-head"><div><h3>Exercícios</h3><p>Use a biblioteca ou adicione manualmente.</p></div><button className="secondary-btn compact" onClick={addManual}><Plus size={16}/> Manual</button></div>
        <div className="library-picker"><div className="search-box"><Search size={17}/><input value={libraryQuery} onChange={e=>setLibraryQuery(e.target.value)} placeholder="Buscar na biblioteca"/></div>{libraryQuery&&<div className="library-picker-results">{filtered.slice(0,8).map(ex=><button key={ex.id} onClick={()=>{addFromLibrary(ex);setLibraryQuery('')}}><Dumbbell size={15}/><span><strong>{ex.name}</strong><small>{ex.category || 'Sem categoria'}</small></span><Plus size={15}/></button>)}</div>}</div>
        <div className="builder-exercises">{items.length?items.map((ex,idx)=><div className="builder-exercise manual-exercise template-exercise-row" key={ex.id}>
          <span className="exercise-index">{idx+1}</span><div className="builder-ex-main editable-exercise-name"><input value={ex.name} onChange={e=>update(ex.id,'name',e.target.value)} placeholder="Nome do exercício"/><input value={ex.notes} onChange={e=>update(ex.id,'notes',e.target.value)} placeholder="Observação padrão"/></div>
          <label><small>Séries</small><input type="number" min="1" value={ex.sets} onChange={e=>update(ex.id,'sets',e.target.value)}/></label><label><small>Reps</small><input type="number" min="1" value={ex.reps} onChange={e=>update(ex.id,'reps',e.target.value)}/></label><label><small>Carga</small><input type="number" min="0" step="0.5" value={ex.weight} onChange={e=>update(ex.id,'weight',e.target.value)}/></label><label><small>Descanso</small><input type="number" min="0" value={ex.rest} onChange={e=>update(ex.id,'rest',e.target.value)}/></label><button className="remove-btn" onClick={()=>remove(ex.id)}><X size={17}/></button>
        </div>):<div className="empty-state compact-empty">Adicione exercícios ao template.</div>}</div>
      </section>
    </div><aside className="builder-side"><section className="panel summary-panel"><h3>Resumo</h3><div><span>Exercícios</span><strong>{items.length}</strong></div><div><span>Tempo</span><strong>{estimatedMinutes||0} min</strong></div><button className="primary-btn full" disabled={busy||!name.trim()||!items.length} onClick={save}>{busy?'Salvando...':'Salvar template'} <Check size={17}/></button></section></aside></div>
  </div>
}

function WorkoutBuilder({ setPage, token, backend, refreshBackend, initialTemplateId = '', initialWorkoutId = '' }) {
  const linkedStudents=backend.students||[]
  const templates=backend.templates||[]
  const personalLibrary=backend.exercises||[]
  const [syncing,setSyncing]=useState(true)
  const [studentQuery,setStudentQuery]=useState('')
  const [studentOpen,setStudentOpen]=useState(false)
  const [selectedStudentId,setSelectedStudentId]=useState('')
  const [workoutName,setWorkoutName]=useState('')
  const [description,setDescription]=useState('')
  const [notes,setNotes]=useState('')
  const [prescriptions,setPrescriptions]=useState([])
  const [loadedWorkoutId,setLoadedWorkoutId]=useState('')
  const [libraryOpen,setLibraryOpen]=useState(false)
  const [libraryPrescriptionId,setLibraryPrescriptionId]=useState('')
  const [librarySource,setLibrarySource]=useState('personal')
  const [libraryQuery,setLibraryQuery]=useState('')
  const [externalItems,setExternalItems]=useState([])
  const [videoSrc,setVideoSrc]=useState('')
  const [videoTitle,setVideoTitle]=useState('')
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const dayLabels=['D','S','T','Q','Q','S','S']
  const dayNames=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  const uid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`
  const normalizeItem=(ex={})=>({id:uid(),exerciseId:ex.source==='wger'?null:(ex.exerciseId||ex.id||null),name:ex.name||'',sets:String(ex.sets??3),reps:String(ex.reps??10),weight:String(ex.suggestedWeight??ex.weight??0),rest:String(ex.restSeconds??ex.rest??60),notes:ex.notes||'',videoUrl:ex.videoUrl||''})
  const makePrescription=(src={},index=0)=>({localId:uid(),id:src.id||null,name:src.name||`Prescrição ${index+1}`,notes:src.notes||'',estimatedMinutes:String(src.estimatedMinutes??45),scheduledDays:[...(src.scheduledDays||[])],items:(src.exercises||src.items||[]).map(normalizeItem)})
  useEffect(()=>{let active=true;Promise.resolve(refreshBackend()).finally(()=>{if(active)setSyncing(false)});return()=>{active=false}},[])
  useEffect(()=>{if(!prescriptions.length&&!initialWorkoutId)setPrescriptions([makePrescription({},0)])},[syncing])

  const sortedStudents=useMemo(()=>[...linkedStudents].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')),[linkedStudents])
  const matches=sortedStudents.filter(st=>{const q=studentQuery.trim().toLowerCase();return !q||st.name.toLowerCase().includes(q)||st.email.toLowerCase().includes(q)})
  const selectedStudent=linkedStudents.find(st=>st.id===selectedStudentId)||null
  const availableDays=selectedStudent?.availability||[]

  useEffect(()=>{
    if(!initialWorkoutId||loadedWorkoutId===initialWorkoutId)return
    const workout=backend.workouts?.find(w=>w.id===initialWorkoutId)
    if(!workout)return
    setSelectedStudentId(workout.studentId||'');setWorkoutName(workout.name||'');setDescription(workout.description||'');setNotes(workout.notes||'')
    setPrescriptions(workoutPrescriptions(workout).map((p,i)=>makePrescription(p,i)))
    setLoadedWorkoutId(initialWorkoutId)
  },[initialWorkoutId,loadedWorkoutId,backend.workouts])

  const applyTemplate=id=>{
    if(!id)return
    const t=templates.find(x=>x.id===id);if(!t)return
    const next=makePrescription({name:t.name,notes:t.notes,estimatedMinutes:t.estimatedMinutes,exercises:t.exercises},prescriptions.length)
    setPrescriptions(v=>v.length===1&&!v[0].items.length&&!v[0].scheduledDays.length?[next]:[...v,next])
    if(!workoutName.trim())setWorkoutName(t.name||'')
    setMessage('Template adicionado como uma nova prescrição.')
  }
  useEffect(()=>{if(initialTemplateId&&templates.length&&prescriptions.length<=1)applyTemplate(initialTemplateId)},[initialTemplateId,templates.length])

  const chooseStudent=st=>{setSelectedStudentId(st.id);setStudentQuery('');setStudentOpen(false);setPrescriptions(v=>v.map(p=>({...p,scheduledDays:[]})))}
  const updatePrescription=(id,key,value)=>setPrescriptions(v=>v.map(p=>p.localId===id?{...p,[key]:value}:p))
  const toggleDay=(id,day)=>{if(!availableDays.includes(day))return;setPrescriptions(v=>v.map(p=>p.localId===id?{...p,scheduledDays:p.scheduledDays.includes(day)?p.scheduledDays.filter(x=>x!==day):[...p.scheduledDays,day].sort((a,b)=>a-b)}:p))}
  const addPrescription=()=>setPrescriptions(v=>[...v,makePrescription({},v.length)])
  const removePrescription=id=>setPrescriptions(v=>v.length>1?v.filter(p=>p.localId!==id):v)
  const addManual=id=>setPrescriptions(v=>v.map(p=>p.localId===id?{...p,items:[...p.items,normalizeItem()]}:p))
  const updateItem=(pid,id,key,value)=>setPrescriptions(v=>v.map(p=>p.localId===pid?{...p,items:p.items.map(ex=>ex.id===id?{...ex,[key]:value}:ex)}:p))
  const removeItem=(pid,id)=>setPrescriptions(v=>v.map(p=>p.localId===pid?{...p,items:p.items.filter(ex=>ex.id!==id)}:p))
  const openLibrary=pid=>{setLibraryPrescriptionId(pid);setLibraryOpen(true);setLibraryQuery('');setLibrarySource('personal')}
  const personalMatches=personalLibrary.filter(ex=>{const q=libraryQuery.trim().toLowerCase();return !q||(ex.name+' '+(ex.category||'')+' '+(ex.muscleGroups||[]).join(' ')).toLowerCase().includes(q)})
  const loadExternal=async()=>{setBusy('external');setError('');try{const q=new URLSearchParams();if(libraryQuery.trim())q.set('search',libraryQuery.trim());const data=await apiRequest(`/exercises/external?${q}`,{token});setExternalItems(data.items||[])}catch(e){setError(e.message)}finally{setBusy('')}}
  useEffect(()=>{if(libraryOpen&&librarySource==='external'&&!externalItems.length)loadExternal()},[libraryOpen,librarySource])
  const addLibraryExercise=ex=>{setPrescriptions(v=>v.map(p=>p.localId===libraryPrescriptionId?{...p,items:[...p.items,normalizeItem(ex)]}:p));setLibraryOpen(false);setLibraryQuery('')}
  const playLibraryVideo=async ex=>{try{if(videoSrc.startsWith('blob:'))URL.revokeObjectURL(videoSrc);if(ex.videoUrl){setVideoSrc(ex.videoUrl);setVideoTitle(ex.name);return}if(ex.hasUploadedVideo){const blob=await apiBlob(`/exercises/${ex.id}/video`,token);setVideoSrc(URL.createObjectURL(blob));setVideoTitle(ex.name)}}catch(e){setError(e.message)}}

  const mapped=()=>prescriptions.map(p=>({name:p.name.trim(),notes:p.notes,estimatedMinutes:Number(p.estimatedMinutes)||0,scheduledDays:p.scheduledDays,exercises:p.items.map(ex=>({exerciseId:ex.exerciseId||null,name:ex.name.trim(),sets:Math.max(1,parseInt(ex.sets,10)||1),reps:Math.max(1,parseInt(ex.reps,10)||1),suggestedWeight:Math.max(0,Number(String(ex.weight).replace(',','.'))||0),restSeconds:Math.max(0,parseInt(ex.rest,10)||0),notes:ex.notes.trim(),videoUrl:ex.videoUrl.trim()}))}))
  const validate=()=>{if(!workoutName.trim())return 'Informe o nome do treino.';if(!selectedStudent)return 'Selecione um aluno.';if(!prescriptions.length)return 'Adicione uma prescrição.';for(const [i,p] of prescriptions.entries()){if(!p.name.trim())return `Informe o nome da prescrição ${i+1}.`;if(!p.scheduledDays.length)return `Selecione os dias da prescrição ${p.name||i+1}.`;if(!p.items.length)return `Adicione exercícios à prescrição ${p.name||i+1}.`;if(p.items.some(ex=>!ex.name.trim()))return `Preencha todos os exercícios de ${p.name||i+1}.`}return ''}
  const save=async()=>{const validation=validate();if(validation){setError(validation);return}setBusy('workout');setError('');setMessage('');try{const body={studentId:selectedStudent.id,name:workoutName.trim(),description,notes,prescriptions:mapped()};await apiRequest(initialWorkoutId?`/workouts/${initialWorkoutId}`:'/workouts',{token,method:initialWorkoutId?'PATCH':'POST',body});await refreshBackend();setPage('workouts')}catch(e){setError(e.message)}finally{setBusy('')}}
  const saveAsTemplate=async p=>{if(!p.name.trim()||!p.items.length)return;setBusy(`template:${p.localId}`);setError('');try{await apiRequest('/templates',{token,method:'POST',body:{name:p.name,description,notes:p.notes,estimatedMinutes:Number(p.estimatedMinutes)||0,exercises:mapped().find((_,i)=>prescriptions[i].localId===p.localId)?.exercises||[]}});setMessage(`Template "${p.name}" salvo.`);await refreshBackend()}catch(e){setError(e.message)}finally{setBusy('')}}

  if(syncing)return <div className="page-stack builder-page"><section className="panel empty-state"><Dumbbell size={34}/><h2>Atualizando dados...</h2></section></div>
  return <div className="page-stack builder-page"><button className="back-link" onClick={()=>setPage('workouts')}><ArrowLeft size={17}/> Voltar aos treinos</button><section className="page-heading"><span className="eyebrow">{initialWorkoutId?'Edição de treino':'Novo treino'}</span><h1>{initialWorkoutId?'Editar plano de treino':'Montar plano de treino'}</h1><p>Adicione quantas prescrições precisar. O treino não fica limitado a AB, ABC ou qualquer modelo fixo.</p></section>
    {error&&<div className="app-error-banner">{error}</div>}{message&&<div className="app-success-banner">{message}</div>}
    <div className="builder-layout"><div className="builder-main">
      <section className="panel form-panel"><h3>Informações do treino</h3><div className="form-grid"><label className="span-2 combo-field"><span>Aluno</span><div className="combo-box"><Search size={17}/><input value={studentOpen?studentQuery:(selectedStudent?.name||'')} onFocus={()=>{setStudentQuery('');setStudentOpen(true)}} onChange={e=>{setStudentQuery(e.target.value);setStudentOpen(true)}} placeholder="Selecione o aluno"/>{studentOpen&&<div className="combo-menu">{matches.length?matches.map(st=><button type="button" key={st.id} onClick={()=>chooseStudent(st)}><Avatar initials={initialsOf(st.name)} size="xs"/><span><strong>{st.name}</strong><small>{st.email}</small></span></button>):<small>Nenhum aluno encontrado</small>}</div>}</div></label><label className="span-2"><span>Nome do treino</span><input value={workoutName} onChange={e=>setWorkoutName(e.target.value)} placeholder="Ex.: Plano de hipertrofia"/></label><label className="span-2"><span>Descrição</span><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Objetivo e contexto do plano"/></label><label className="span-2"><span>Observações gerais</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Orientações gerais para o aluno"/></label><label className="span-2"><span>Adicionar template como prescrição</span><select value="" onChange={e=>applyTemplate(e.target.value)}><option value="">Selecione um template</option>{templates.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select></label></div></section>

      <div className="prescription-builder-head"><div><h2>Prescrições</h2><p>Ex.: A, B, C, Cardio, Mobilidade — você define livremente.</p></div><button className="secondary-btn" onClick={addPrescription}><Plus size={17}/> Adicionar prescrição</button></div>
      <div className="prescription-builder-list">{prescriptions.map((p,pIndex)=><section className="panel prescription-builder-card" key={p.localId}><div className="panel-head"><div><span className="eyebrow">Prescrição {pIndex+1}</span><h3>{p.name||'Sem nome'}</h3></div><div className="prescription-head-actions"><button className="text-btn" disabled={!p.items.length||busy===`template:${p.localId}`} onClick={()=>saveAsTemplate(p)}>{busy===`template:${p.localId}`?'Salvando...':'Salvar template'}</button><button className="remove-btn" disabled={prescriptions.length===1} onClick={()=>removePrescription(p.localId)}><X size={17}/></button></div></div>
        <div className="form-grid prescription-fields"><label><span>Nome</span><input value={p.name} onChange={e=>updatePrescription(p.localId,'name',e.target.value)} placeholder="Ex.: A — Peito"/></label><label><span>Tempo estimado (min)</span><input type="number" min="0" value={p.estimatedMinutes} onChange={e=>updatePrescription(p.localId,'estimatedMinutes',e.target.value)}/></label><label className="span-2"><span>Observações</span><textarea value={p.notes} onChange={e=>updatePrescription(p.localId,'notes',e.target.value)} placeholder="Orientações específicas desta prescrição"/></label></div>
        <div className="prescription-days"><strong>Dias desta prescrição</strong><div className="weekday-picker readonly selectable-days">{dayLabels.map((d,i)=><button type="button" key={i} disabled={!availableDays.includes(i)} className={p.scheduledDays.includes(i)?'active':''} onClick={()=>toggleDay(p.localId,i)}>{d}</button>)}</div><small>{selectedStudent?availableDays.length?`Disponibilidade de ${selectedStudent.name}: ${availableDays.map(i=>dayNames[i]).join(' · ')}`:'O aluno ainda não definiu disponibilidade.':'Selecione um aluno primeiro.'}</small></div>
        <div className="panel-head prescription-exercises-head"><div><h3>Exercícios</h3><p>{p.items.length} exercício(s)</p></div><div className="builder-add-actions"><button className="secondary-btn compact" onClick={()=>openLibrary(p.localId)}><BookOpen size={16}/> Biblioteca</button><button className="secondary-btn compact" onClick={()=>addManual(p.localId)}><Plus size={16}/> Manual</button></div></div>
        <div className="builder-exercises">{p.items.length?p.items.map((ex,idx)=><div className="builder-exercise manual-exercise extended-exercise" key={ex.id}><span className="exercise-index">{idx+1}</span><div className="builder-ex-main editable-exercise-name"><input value={ex.name} onChange={e=>updateItem(p.localId,ex.id,'name',e.target.value)} placeholder="Nome do exercício"/><textarea value={ex.notes} onChange={e=>updateItem(p.localId,ex.id,'notes',e.target.value)} placeholder="Observação"/></div><label><small>Séries</small><input type="number" min="1" value={ex.sets} onChange={e=>updateItem(p.localId,ex.id,'sets',e.target.value)}/></label><label><small>Reps</small><input type="number" min="1" value={ex.reps} onChange={e=>updateItem(p.localId,ex.id,'reps',e.target.value)}/></label><label><small>Carga kg</small><input type="number" min="0" step="0.5" value={ex.weight} onChange={e=>updateItem(p.localId,ex.id,'weight',e.target.value)}/></label><label><small>Descanso s</small><input type="number" min="0" value={ex.rest} onChange={e=>updateItem(p.localId,ex.id,'rest',e.target.value)}/></label><label className="exercise-video-url"><small>Vídeo URL</small><input value={ex.videoUrl} onChange={e=>updateItem(p.localId,ex.id,'videoUrl',e.target.value)} placeholder="Opcional"/></label><button className="remove-btn" onClick={()=>removeItem(p.localId,ex.id)}><X size={17}/></button></div>):<div className="empty-state compact-empty">Adicione exercícios a esta prescrição.</div>}</div>
      </section>)}</div>
    </div><aside className="builder-side"><section className="panel summary-panel"><h3>Resumo do plano</h3><div><span>Aluno</span><strong>{selectedStudent?.name||'—'}</strong></div><div><span>Prescrições</span><strong>{prescriptions.length}</strong></div><div><span>Exercícios</span><strong>{prescriptions.reduce((sum,p)=>sum+p.items.length,0)}</strong></div><button className="primary-btn full" disabled={busy==='workout'||!selectedStudent||!workoutName.trim()} onClick={save}>{busy==='workout'?'Salvando...':initialWorkoutId?'Salvar alterações':'Salvar e prescrever'} <Check size={17}/></button></section></aside></div>

    {libraryOpen&&<div className="modal-backdrop" onClick={()=>setLibraryOpen(false)}><div className="standard-modal library-picker-modal external-library-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setLibraryOpen(false)}><X size={18}/></button><div className="modal-icon"><BookOpen size={22}/></div><h2>Adicionar da biblioteca</h2><div className="tabs"><button className={librarySource==='personal'?'active':''} onClick={()=>setLibrarySource('personal')}>Pessoal</button><button className={librarySource==='external'?'active':''} onClick={()=>setLibrarySource('external')}>Externa · wger</button></div><div className="library-search-row"><div className="search-box"><Search size={18}/><input value={libraryQuery} onChange={e=>setLibraryQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&librarySource==='external'&&loadExternal()} placeholder="Nome, categoria ou músculo"/></div>{librarySource==='external'&&<button className="secondary-btn compact" onClick={loadExternal} disabled={busy==='external'}>{busy==='external'?'Buscando...':'Buscar'}</button>}</div><div className="library-picker-list">{(librarySource==='personal'?personalMatches:externalItems).length?(librarySource==='personal'?personalMatches:externalItems).map(ex=><div className="library-picker-item" key={ex.id}><button className="library-add-main" onClick={()=>addLibraryExercise(ex)}><div><strong>{ex.name}</strong><small>{librarySource==='external'?'wger':ex.category||'Sem categoria'}</small></div><Plus size={17}/></button>{(ex.videoUrl||ex.hasUploadedVideo)&&<button className="library-video-btn" onClick={()=>playLibraryVideo(ex)}><Video size={16}/></button>}</div>):<div className="empty-state compact-empty">Nenhum exercício encontrado.</div>}</div></div></div>}
    {videoSrc&&<div className="modal-backdrop" onClick={()=>{if(videoSrc.startsWith('blob:'))URL.revokeObjectURL(videoSrc);setVideoSrc('')}}><div className="video-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>{if(videoSrc.startsWith('blob:'))URL.revokeObjectURL(videoSrc);setVideoSrc('')}}><X size={18}/></button><h3>{videoTitle}</h3><video src={videoSrc} controls playsInline/></div></div>}
  </div>
}

function AppShell() {
  const inviteToken = new URLSearchParams(window.location.search).get('invite')
  const emptyBackend={invitations:[],students:[],workouts:[],availability:[],exercises:[],templates:[],progress:null,dashboard:null,publicTrainers:[]}
  const [token,setToken]=useState('')
  const [user,setUser]=useState(null)
  const [restoringSession,setRestoringSession]=useState(true)
  const [page,setPage]=useState('home')
  const [backend,setBackend]=useState(emptyBackend)
  const [backendError,setBackendError]=useState('')
  const [selectedStudentId,setSelectedStudentId]=useState('')
  const [selectedWorkoutId,setSelectedWorkoutId]=useState('')
  const [selectedTemplateId,setSelectedTemplateId]=useState('')
  const [selectedPrescriptionId,setSelectedPrescriptionId]=useState('')

  const profile = user?.role === 'trainer' ? 'trainer' : 'student'

  const refreshBackend = async (nextToken = token, nextUser = user) => {
    if (!nextToken || !nextUser) return
    setBackendError('')
    try {
      if (nextUser.role === 'trainer') {
        const [invitations, studentsData, workouts, exercises, templates, dashboard] = await Promise.all([
          apiRequest('/invitations',{token:nextToken}),
          apiRequest('/trainer/students',{token:nextToken}),
          apiRequest('/workouts',{token:nextToken}),
          apiRequest('/exercises',{token:nextToken}),
          apiRequest('/templates',{token:nextToken}),
          apiRequest('/trainer/dashboard',{token:nextToken}),
        ])
        setBackend({ invitations, students:studentsData, workouts, availability:[], exercises, templates, progress:null, dashboard, publicTrainers:[] })
      } else {
        const [invitations, availabilityData, workouts, progress, publicTrainers] = await Promise.all([
          apiRequest('/invitations',{token:nextToken}),
          apiRequest('/availability',{token:nextToken}),
          apiRequest('/workouts',{token:nextToken}),
          apiRequest('/progress/me',{token:nextToken}),
          apiRequest('/trainers/public',{token:nextToken}),
        ])
        setBackend({ invitations, students:[], workouts, availability:availabilityData.days || [], exercises:[], templates:[], progress, dashboard:null, publicTrainers })
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
        setToken(storedToken);setUser(data.user);setPage(data.user.role==='trainer'?'dashboard':'home')
      }catch{storeToken('')}finally{if(!cancelled)setRestoringSession(false)}
    }
    restore();return()=>{cancelled=true}
  },[])

  useEffect(()=>{refreshBackend()},[token,user?.id,user?.role])

  useEffect(()=>{
    if(!token || !user) return
    const refresh=()=>refreshBackend()
    const onVisibility=()=>{if(document.visibilityState==='visible')refresh()}
    window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',onVisibility)
    return()=>{window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',onVisibility)}
  },[token,user?.id,user?.role])

  const handleLogin=(nextToken,nextUser)=>{
    storeToken(nextToken);setToken(nextToken);setUser(nextUser);setBackend(emptyBackend)
    setPage(nextUser.role==='trainer'?'dashboard':'home')
    apiRequest('/me',{token:nextToken}).then(data=>{
      if(data?.user){
        setUser(data.user)
        setPage(data.user.role==='trainer'?'dashboard':'home')
        refreshBackend(nextToken,data.user)
      }
    }).catch(()=>{})
  }

  const handleUserChange=nextUser=>{
    setUser(nextUser);setBackend(emptyBackend);setSelectedStudentId('');setSelectedWorkoutId('');setSelectedPrescriptionId('');setSelectedTemplateId('')
    setPage(nextUser.role==='trainer'?'dashboard':'home')
    refreshBackend(token,nextUser)
  }

  const openStudent=id=>{setSelectedStudentId(id);setPage('studentDetail')}
  const openWorkout=(id,prescriptionId='')=>{setSelectedWorkoutId(id);setSelectedPrescriptionId(prescriptionId);setPage('workout')}
  const openBuilder=(templateId='')=>{setSelectedTemplateId(templateId);setSelectedWorkoutId('');setPage('builder')}
  const editWorkout=id=>{setSelectedTemplateId('');setSelectedWorkoutId(id);setPage('builder')}

  const logout=()=>{
    const currentToken=token
    storeToken('');setToken('');setUser(null);setBackend(emptyBackend)
    setSelectedStudentId('');setSelectedWorkoutId('');setSelectedPrescriptionId('');setSelectedTemplateId('');setPage('home')
    if(currentToken)apiRequest('/auth/logout',{token:currentToken,method:'POST'}).catch(()=>{})
  }

  if(inviteToken)return <InviteOnboarding inviteToken={inviteToken} onComplete={handleLogin}/>
  if(restoringSession)return <div className="auth-screen session-restore-screen"><div className="session-restore-card"><Logo/><span className="eyebrow">Atlas</span><h2>Restaurando sua sessão...</h2><p>Validando seu acesso.</p></div></div>
  if(!token||!user)return <Login onEnter={handleLogin}/>

  let content
  if(page==='profile'){
    content=<ProfilePage user={user} token={token} onUserChange={handleUserChange}/>
  }else if(profile==='student'){
    content=page==='home'?<StudentHome setPage={setPage} token={token} user={user} backend={backend} refreshBackend={refreshBackend} onOpenWorkout={openWorkout}/>:
      page==='trainers'?<PublicTrainers token={token} backend={backend} refreshBackend={refreshBackend}/>:
      page==='workout'?<WorkoutExecution setPage={setPage} token={token} workout={backend.workouts.find(w=>w.id===selectedWorkoutId)||null} initialPrescriptionId={selectedPrescriptionId} refreshBackend={refreshBackend}/>:
      page==='history'?<StudentHistory backend={backend}/>:
      page==='progress'?<StudentProgress backend={backend}/>:
      <Messages token={token} backend={backend}/>
  }else{
    content=page==='dashboard'?<TrainerDashboard setPage={setPage} user={user} token={token} backend={backend} onOpenStudent={openStudent}/>:
      page==='students'?<Students setPage={setPage} token={token} backend={backend} refreshBackend={refreshBackend} onOpenStudent={openStudent}/>:
      page==='studentDetail'?<StudentDetail setPage={setPage} backend={backend} studentId={selectedStudentId} token={token} refreshBackend={refreshBackend}/>:
      page==='library'?<ExerciseLibrary setPage={setPage} token={token}/>:
      page==='workouts'?<Workouts setPage={setPage} backend={backend} token={token} refreshBackend={refreshBackend} onOpenBuilder={openBuilder} onEditWorkout={editWorkout}/>:
      page==='builder'?<WorkoutBuilder setPage={setPage} token={token} backend={backend} refreshBackend={refreshBackend} initialTemplateId={selectedTemplateId} initialWorkoutId={selectedWorkoutId}/>:
      <Messages trainer token={token} backend={backend}/>
  }

  return <div className="app-shell">
    <Topbar profile={profile} user={user} token={token} onUserChange={handleUserChange} onLogout={logout} onOpenProfile={()=>setPage('profile')}/>
    <SideNav profile={profile} page={page} setPage={setPage}/>
    <main className="app-main">{backendError&&<div className="app-error-banner">{backendError}</div>}{content}</main>
    <BottomNav profile={profile} page={page} setPage={setPage}/>
  </div>
}

export default function App() {
  return <AppShell/>
}
