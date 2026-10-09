import React, { useMemo, useState } from 'react'
import {
  Activity, Apple, ArrowLeft, BarChart3, Bell, BookOpen, CalendarDays, Check,
  ChevronDown, ChevronRight, CirclePlus, Clock3, Dumbbell, Flame, History,
  Home, LineChart, ListChecks, Lock, LogOut, Mail, Menu, MessageCircle, MoreHorizontal,
  Play, Plus, Search, Send, Settings, Share2, Sparkles, TimerReset, Trophy,
  UserRound, UsersRound, Video, X, Zap
} from 'lucide-react'

const studentWorkouts = [
  { name: 'Upper A — Peito & Costas', coach: 'Rafael Monteiro', day: 'Hoje', intensity: 'Moderada', duration: '52 min', status: 'Pendente' },
  { name: 'Lower A — Quadríceps', coach: 'Rafael Monteiro', day: 'Qua, 08 out.', intensity: 'Alta', duration: '58 min', status: 'Pendente' },
  { name: 'Upper B — Ombros & Braços', coach: 'Camila Alves', day: 'Sex, 10 out.', intensity: 'Moderada', duration: '47 min', status: 'Pendente' },
]

const exercises = [
  { id: 1, name: 'Supino reto com halteres', group: 'Peitoral', category: 'Força', intensity: 'Moderada', sets: 4, reps: '10', weight: '18 kg', rest: '90s' },
  { id: 2, name: 'Remada baixa', group: 'Costas', category: 'Força', intensity: 'Moderada', sets: 4, reps: '12', weight: '42 kg', rest: '75s' },
  { id: 3, name: 'Supino inclinado', group: 'Peitoral', category: 'Força', intensity: 'Alta', sets: 3, reps: '8–10', weight: '16 kg', rest: '90s' },
  { id: 4, name: 'Puxada alta', group: 'Costas', category: 'Força', intensity: 'Moderada', sets: 3, reps: '12', weight: '38 kg', rest: '75s' },
  { id: 5, name: 'Elevação lateral', group: 'Ombros', category: 'Isolamento', intensity: 'Leve', sets: 3, reps: '15', weight: '7 kg', rest: '60s' },
  { id: 6, name: 'Agachamento livre', group: 'Pernas', category: 'Força', intensity: 'Alta', sets: 4, reps: '8', weight: '72 kg', rest: '120s' },
]

const students = [
  { name: 'Marina Costa', model: 'AB', adherence: 92, last: 'Hoje, 07:40', trend: '+12%', initials: 'MC' },
  { name: 'Lucas Nunes', model: 'FULLBODY', adherence: 81, last: 'Ontem, 19:12', trend: '+8%', initials: 'LN' },
  { name: 'Bianca Melo', model: 'ABC', adherence: 76, last: 'Ontem, 06:55', trend: '+15%', initials: 'BM' },
  { name: 'Diego Ramos', model: 'AB', adherence: 64, last: '03 out.', trend: '+4%', initials: 'DR' },
]

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
  return <div className="login-page">
    <section className="login-showcase">
      <div className="showcase-top"><Logo/><Badge tone="light">Protótipo conceitual</Badge></div>
      <div className="showcase-copy">
        <span className="eyebrow"><Sparkles size={15}/> Treino conectado</span>
        <h1>Treino bom é treino que <em>evolui com você.</em></h1>
        <p>Aluno e treinador no mesmo lugar: prescrição, execução, histórico, mensagens e evolução em uma experiência simples.</p>
        <div className="showcase-pills">
          <span><Check size={15}/> Rotina clara</span><span><Check size={15}/> Progresso visível</span><span><Check size={15}/> Feedback próximo</span>
        </div>
      </div>
      <div className="mini-workout-card">
        <div><div className="pulse-dot"></div><small>Treino de hoje</small><strong>Upper A — Peito & Costas</strong></div>
        <div className="mini-ring">72<span>%</span></div>
      </div>
    </section>
    <section className="login-panel">
      <div className="login-box">
        <div className="mobile-login-logo"><Logo/></div>
        <span className="eyebrow">Bem-vindo de volta</span>
        <h2>Entre na sua conta</h2>
        <p className="muted">Acesse seus treinos, alunos e evolução.</p>
        <label className="field-label">E-mail</label>
        <div className="input-wrap"><Mail size={18}/><input defaultValue="demo@atlas.fit" /></div>
        <label className="field-label">Senha</label>
        <div className="input-wrap"><Lock size={18}/><input type="password" defaultValue="12345678" /></div>
        <button className="primary-btn full" onClick={onEnter}>Entrar na demonstração <ChevronRight size={18}/></button>
        <div className="divider"><span>ou continue com</span></div>
        <div className="social-row">
          <button className="social-btn"><span className="google-g">G</span> Google</button>
          <button className="social-btn"><Apple size={18} fill="currentColor"/> Apple</button>
        </div>
        <p className="signup-copy">Ainda não possui conta? <button>Cadastre-se</button></p>
      </div>
    </section>
  </div>
}

function Topbar({ profile, setProfile, onLogout }) {
  const [open, setOpen] = useState(false)
  return <header className="topbar">
    <Logo/>
    <div className="topbar-actions">
      <button className="icon-btn"><Bell size={19}/><span className="notification-dot"></span></button>
      <div className="profile-switch">
        <button className="profile-trigger" onClick={() => setOpen(v => !v)}>
          <Avatar initials="AS" size="sm"/>
          <span><small>Perfil ativo</small><strong>{profile === 'student' ? 'Aluno' : 'Treinador'}</strong></span>
          <ChevronDown size={16}/>
        </button>
        {open && <div className="profile-menu">
          <small>Trocar perfil</small>
          <button className={profile === 'student' ? 'active' : ''} onClick={() => {setProfile('student'); setOpen(false)}}><UserRound size={17}/> Aluno {profile === 'student' && <Check size={15}/>}</button>
          <button className={profile === 'trainer' ? 'active' : ''} onClick={() => {setProfile('trainer'); setOpen(false)}}><UsersRound size={17}/> Treinador {profile === 'trainer' && <Check size={15}/>}</button>
          <hr/>
          <button onClick={onLogout}><LogOut size={17}/> Sair</button>
        </div>}
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

function StudentHome({ setPage }) {
  const [routineOpen, setRoutineOpen] = useState(false)
  const [routineDays, setRoutineDays] = useState([1, 3, 5])
  const labels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  const names = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const toggleDay = i => setRoutineDays(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i].sort())

  return <div className="page-stack">
    <section className="welcome-row">
      <div><span className="eyebrow">Terça-feira, 6 de outubro</span><h1>Boa noite, Amanda 👋</h1><p>Seu treino está pronto. Hoje é dia de construir consistência.</p></div>
      <div className="streak-card"><Flame size={21}/><span><strong>7 dias</strong><small>sequência atual</small></span></div>
    </section>

    <section className="today-card">
      <div className="today-main">
        <div className="today-meta"><Badge>Treino de hoje</Badge><span><Clock3 size={15}/> 52 min</span><span><Zap size={15}/> Moderada</span></div>
        <h2>Upper A — Peito & Costas</h2>
        <p>Foco em progressão de carga, amplitude controlada e 1–2 repetições em reserva.</p>
        <div className="coach-line"><Avatar initials="RM" size="sm"/><span>Prescrito por <strong>Rafael Monteiro</strong></span></div>
        <button className="primary-btn" onClick={() => setPage('workout')}><Play size={18} fill="currentColor"/> Iniciar treino</button>
      </div>
      <div className="today-visual">
        <div className="workout-figure"><Dumbbell size={54}/></div>
        <div className="exercise-preview">
          <small>5 exercícios</small><strong>18 séries totais</strong><span>Próximo: Supino reto</span>
        </div>
      </div>
    </section>

    <div className="section-title"><div><h2>Próximos treinos</h2><p>O que vem pela frente.</p></div><button onClick={() => setPage('history')}>Ver histórico <ChevronRight size={16}/></button></div>
    <section className="panel no-pad upcoming-main">
      <div className="compact-list">
        {studentWorkouts.slice(1).map((w,i) => <button className="compact-row upcoming-row" key={i}>
          <div className="date-box"><strong>{i === 0 ? '08' : '10'}</strong><small>OUT</small></div>
          <div><strong>{w.name}</strong><small>{w.duration} · {w.intensity}</small></div>
          <Badge tone="light">{w.status}</Badge><ChevronRight size={18}/>
        </button>)}
      </div>
    </section>

    <div className="grid-2">
      <section className="panel routine-card">
        <div className="panel-head"><div><h3>Minha rotina</h3><p>Você escolhe os dias disponíveis; o treinador distribui seus treinos.</p></div><CalendarDays size={20}/></div>
        <div className="routine-days">
          {labels.map((d,i) => <span key={i} className={routineDays.includes(i) ? 'active' : ''}>{d}</span>)}
        </div>
        <div className="routine-copy"><strong>{routineDays.length} dias por semana</strong><span>{routineDays.map(i => names[i]).join(' · ') || 'Nenhum dia selecionado'}</span></div>
        <button className="secondary-btn compact" onClick={() => setRoutineOpen(true)}>Editar disponibilidade</button>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h3>Resumo do mês</h3><p>Consistência em outubro.</p></div><Trophy size={20}/></div>
        <div className="month-summary">
          <div className="progress-ring"><span>86<small>%</small></span></div>
          <div><strong>6 de 7 treinos</strong><span>Você está acima da sua média de setembro.</span><button onClick={() => setPage('progress')}>Ver evolução</button></div>
        </div>
      </section>
    </div>

    {routineOpen && <div className="modal-backdrop" onClick={() => setRoutineOpen(false)}><div className="standard-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setRoutineOpen(false)}><X size={18}/></button>
      <div className="modal-icon"><CalendarDays size={23}/></div><h2>Escolha sua rotina</h2>
      <p>Selecione os dias em que você consegue treinar. Seu treinador usará essa disponibilidade para definir quais treinos serão executados em cada dia.</p>
      <div className="weekday-picker routine-picker">{labels.map((d,i)=><button key={i} className={routineDays.includes(i)?'active':''} onClick={()=>toggleDay(i)}>{d}</button>)}</div>
      <button className="primary-btn full" onClick={() => setRoutineOpen(false)}>Salvar disponibilidade <Check size={17}/></button>
    </div></div>}
  </div>
}

function WorkoutExecution({ setPage }) {
  const [completed, setCompleted] = useState([1])
  const [timer, setTimer] = useState(false)
  const [openExercise, setOpenExercise] = useState(1)
  const toggle = id => setCompleted(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id])
  return <div className="page-stack">
    <button className="back-link" onClick={() => setPage('home')}><ArrowLeft size={17}/> Voltar ao início</button>
    <section className="workout-header">
      <div><div className="today-meta"><Badge>Em andamento</Badge><span><Clock3 size={15}/> 12:34</span></div><h1>Upper A — Peito & Costas</h1><p>Complete cada série e registre sua carga real.</p></div>
      <button className="secondary-btn" onClick={() => setTimer(true)}><TimerReset size={18}/> Descanso</button>
    </section>
    <div className="workout-progress"><div><span>Progresso do treino</span><strong>{completed.length}/{exercises.slice(0,5).length} exercícios</strong></div><div className="bar"><i style={{width:`${completed.length/5*100}%`}}></i></div></div>

    <div className="exercise-stack">
      {exercises.slice(0,5).map((ex,idx) => <section key={ex.id} className={`exercise-card ${completed.includes(ex.id) ? 'completed' : ''}`}>
        <button className="exercise-summary" onClick={() => setOpenExercise(openExercise === ex.id ? null : ex.id)}>
          <span className="exercise-index">{completed.includes(ex.id) ? <Check size={17}/> : idx+1}</span>
          <div><strong>{ex.name}</strong><small>{ex.sets} séries · {ex.reps} reps · {ex.rest} descanso</small></div>
          <button className="video-icon" onClick={(e) => e.stopPropagation()}><Video size={18}/></button>
          <ChevronDown size={18} className={openExercise === ex.id ? 'rotate' : ''}/>
        </button>
        {openExercise === ex.id && <div className="exercise-detail">
          <div className="set-table">
            <div className="set-row header"><span>Série</span><span>Carga</span><span>Reps</span><span></span></div>
            {[1,2,3,4].slice(0,ex.sets).map(s => <div className="set-row" key={s}><strong>{s}</strong><input defaultValue={ex.weight.replace(' kg','')}/><input defaultValue={ex.reps.replace('–10','')}/><button className="set-check"><Check size={15}/></button></div>)}
          </div>
          <div className="exercise-note"><span><MessageCircle size={15}/> Observação do treinador</span><p>Controle a descida por 2 segundos e mantenha as escápulas apoiadas.</p></div>
          <button className={completed.includes(ex.id) ? 'secondary-btn' : 'primary-btn'} onClick={() => toggle(ex.id)}>{completed.includes(ex.id) ? 'Marcar como pendente' : 'Concluir exercício'} <Check size={17}/></button>
        </div>}
      </section>)}
    </div>
    <button className="finish-btn">Finalizar treino <Trophy size={18}/></button>
    {timer && <div className="modal-backdrop" onClick={() => setTimer(false)}><div className="timer-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setTimer(false)}><X size={18}/></button><span className="eyebrow">Tempo de descanso</span><div className="timer-circle">01:12</div><p>Meta: 90 segundos</p><div className="timer-actions"><button>-15s</button><button className="primary-btn"><Play size={16} fill="currentColor"/> Pausar</button><button>+15s</button></div>
    </div></div>}
  </div>
}

function StudentHistory() {
  const history = [
    ['04 OUT','Lower A — Quadríceps','Rafael Monteiro','58 min','Realizado'],
    ['02 OUT','Upper B — Ombros & Braços','Camila Alves','49 min','Realizado'],
    ['30 SET','Upper A — Peito & Costas','Rafael Monteiro','54 min','Realizado'],
    ['28 SET','Lower B — Posteriores','Rafael Monteiro','—','Não realizado'],
  ]
  return <div className="page-stack"><section className="page-heading"><span className="eyebrow">Histórico</span><h1>Seus treinos</h1><p>Acompanhe constância, duração e execução das últimas sessões.</p></section>
    <div className="filter-row"><button className="filter active">Todos</button><button className="filter">Realizados</button><button className="filter">Pendentes</button><button className="filter">Não realizados</button></div>
    <section className="panel no-pad"><div className="history-list">{history.map((h,i) => <div className="history-row" key={i}>
      <div className="history-date">{h[0]}</div><div className="history-main"><strong>{h[1]}</strong><small><Avatar initials={h[2].startsWith('R')?'RM':'CA'} size="xs"/>{h[2]}</small></div>
      <span className="desktop-only">{h[3]}</span><Badge tone={h[4] === 'Realizado' ? 'green' : 'gray'}>{h[4]}</Badge><ChevronRight size={18}/>
    </div>)}</div></section>
  </div>
}

function StudentProgress() {
  return <div className="page-stack"><section className="page-heading"><span className="eyebrow">Evolução</span><h1>Seu progresso em números</h1><p>Volume, carga e consistência para você entender o que está mudando.</p></section>
    <div className="stats-grid"><StatCard icon={Dumbbell} label="Volume no mês" value="18.420 kg" detail="+11% vs. setembro"/><StatCard icon={Flame} label="Treinos concluídos" value="14" detail="88% de aderência"/><StatCard icon={Trophy} label="Recordes pessoais" value="5" detail="nos últimos 30 dias"/></div>
    <div className="grid-2 progress-grid">
      <section className="panel"><div className="panel-head"><div><h3>Carga máxima — Supino</h3><p>Últimas 8 semanas</p></div><Badge>+14%</Badge></div>
        <div className="line-chart"><svg viewBox="0 0 500 190" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c9e72" stopOpacity=".28"/><stop offset="100%" stopColor="#6c9e72" stopOpacity="0"/></linearGradient></defs><path d="M0,165 C55,160 70,145 115,148 S170,120 220,126 S280,93 330,104 S400,65 500,48 L500,190 L0,190 Z" fill="url(#fill)"/><path d="M0,165 C55,160 70,145 115,148 S170,120 220,126 S280,93 330,104 S400,65 500,48" fill="none" stroke="#497b50" strokeWidth="4" strokeLinecap="round"/></svg><div className="chart-labels"><span>12 ago.</span><span>9 set.</span><span>6 out.</span></div></div>
      </section>
      <section className="panel"><div className="panel-head"><div><h3>Volume por grupo</h3><p>Distribuição neste mês</p></div><MoreHorizontal size={20}/></div>
        <div className="bar-chart">{[['Peito',84],['Costas',92],['Pernas',76],['Ombros',61],['Braços',54]].map(([n,v]) => <div className="bar-item" key={n}><div><span>{n}</span><strong>{v}%</strong></div><div className="bar"><i style={{width:`${v}%`}}></i></div></div>)}</div>
      </section>
    </div>
  </div>
}

function Messages({ trainer = false }) {
  return <div className="page-stack chat-page"><section className="page-heading"><span className="eyebrow">Mensagens</span><h1>{trainer ? 'Converse com seus alunos' : 'Fale com seu treinador'}</h1><p>Feedback rápido e contexto de treino no mesmo lugar.</p></section>
    <section className="chat-shell">
      <aside className="chat-list">
        <div className="chat-search"><Search size={17}/><input placeholder="Buscar conversa"/></div>
        {(trainer ? students.slice(0,3).map(s=>[s.initials,s.name]) : [['RM','Rafael Monteiro'],['CA','Camila Alves']]).map((c,i)=><button key={i} className={i===0?'active':''}><Avatar initials={c[0]} size="sm"/><span><strong>{c[1]}</strong><small>{i===0?'Perfeito, pode manter assim...':'Treino atualizado para sexta.'}</small></span><i>{i===0?'2':''}</i></button>)}
      </aside>
      <div className="conversation">
        <div className="conversation-head"><Avatar initials={trainer?'MC':'RM'} size="sm"/><div><strong>{trainer?'Marina Costa':'Rafael Monteiro'}</strong><small><span className="online-dot"></span> Online agora</small></div></div>
        <div className="messages">
          <div className="message received">Como foi o supino hoje? A carga de 18 kg ficou confortável?<small>18:22</small></div>
          <div className="message sent">Fiz as 4 séries. As duas últimas ficaram pesadas, mas consegui manter 10 reps.<small>18:24</small></div>
          <div className="message received">Perfeito. Pode manter assim no próximo treino. Se fechar 10 reps com mais folga, subimos 2 kg. 👊<small>18:25</small></div>
        </div>
        <div className="message-input"><button><CirclePlus size={20}/></button><input placeholder="Escreva uma mensagem..."/><button className="send-btn"><Send size={18}/></button></div>
      </div>
    </section>
  </div>
}

function TrainerDashboard({ setPage }) {
  const [period, setPeriod] = useState('Dia')
  return <div className="page-stack"><section className="welcome-row">
    <div><span className="eyebrow">Painel do treinador</span><h1>Boa noite, Amanda 👋</h1><p>Acompanhe quem está treinando e onde sua atenção faz mais diferença.</p></div>
    <button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={18}/> Criar treino</button>
  </section>
  <div className="stats-grid"><StatCard icon={UsersRound} label="Alunos ativos" value="24" detail="+3 neste mês"/><StatCard icon={ListChecks} label="Treinos hoje" value="18" detail="12 já concluídos"/><StatCard icon={Activity} label="Aderência média" value="84%" detail="+6% vs. mês anterior"/></div>
  <div className="grid-2 dashboard-grid">
    <section className="panel"><div className="panel-head activities-head"><div><h3>Atividades</h3><p>Execuções e programações dos seus alunos.</p></div><button className="text-btn" onClick={()=>setPage('students')}>Ver todos</button></div>
      <div className="period-filter">{['Dia','Semana','Mês','Ano'].map(p=><button key={p} className={period===p?'active':''} onClick={()=>setPeriod(p)}>{p}</button>)}</div>
      <div className="activity-list">{students.slice(0,3).map((s,i)=><div className="activity-row" key={s.name}><Avatar initials={s.initials} size="sm"/><div><strong>{s.name}</strong><small>{i===0?'Finalizou Upper A':period === 'Dia' ? 'Treino programado para hoje' : `Atividade registrada no período: ${period.toLowerCase()}`}</small></div><Badge tone={i===0?'green':'light'}>{i===0?'Concluído':'Pendente'}</Badge></div>)}</div>
    </section>
    <section className="panel"><div className="panel-head"><div><h3>Atenção necessária</h3><p>Alunos com queda de frequência.</p></div><Bell size={19}/></div>
      <div className="attention-list"><div><Avatar initials="DR" size="sm"/><span><strong>Diego Ramos</strong><small>2 treinos não realizados nesta semana</small></span><ChevronRight size={18}/></div><div><Avatar initials="LN" size="sm"/><span><strong>Lucas Nunes</strong><small>Comentou dor no ombro após o treino</small></span><ChevronRight size={18}/></div></div>
    </section>
  </div>
  <section className="panel"><div className="panel-head"><div><h3>Visão geral dos alunos</h3><p>Aderência aos treinos nos últimos 30 dias.</p></div><button className="secondary-btn compact" onClick={()=>setPage('students')}>Gerenciar alunos</button></div>
    <div className="student-table"><div className="student-table-head"><span>Aluno</span><span>Modelo</span><span>Aderência</span><span>Último treino</span><span>Evolução</span><span></span></div>
    {students.map(s=><div className="student-table-row" key={s.name}><div><Avatar initials={s.initials} size="sm"/><strong>{s.name}</strong></div><span>{s.model}</span><div className="adherence"><div className="bar"><i style={{width:`${s.adherence}%`}}></i></div><strong>{s.adherence}%</strong></div><span>{s.last}</span><Badge>{s.trend}</Badge><ChevronRight size={18}/></div>)}</div>
  </section>
  </div>
}

function Students({ setPage }) {
  const [invite, setInvite] = useState(false)
  return <div className="page-stack"><section className="page-heading action-heading"><div><span className="eyebrow">Gestão de alunos</span><h1>Seus alunos</h1><p>Modelos, frequência e evolução em uma única visão.</p></div><button className="primary-btn" onClick={()=>setInvite(true)}><Share2 size={18}/> Convidar aluno</button></section>
    <div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Buscar aluno"/></div><button className="filter">Todos os modelos <ChevronDown size={15}/></button><button className="filter">Aderência <ChevronDown size={15}/></button></div>
    <div className="student-card-grid">{students.map((s)=><article className="student-card clickable" key={s.name} onClick={()=>setPage('studentDetail')}><div className="student-card-top"><Avatar initials={s.initials}/><div><h3>{s.name}</h3><p>Modelo {s.model}</p></div><button onClick={e=>e.stopPropagation()}><MoreHorizontal size={19}/></button></div>
      <div className="student-kpis"><div><span>Aderência</span><strong>{s.adherence}%</strong></div><div><span>Último treino</span><strong>{s.last.split(',')[0]}</strong></div><div><span>Volume</span><strong>{s.trend}</strong></div></div>
      <div className="bar"><i style={{width:`${s.adherence}%`}}></i></div><div className="student-actions"><button onClick={(e)=>{e.stopPropagation();setPage('studentDetail')}}>Abrir perfil</button><button onClick={(e)=>{e.stopPropagation();setPage('builder')}}>Criar treino <ChevronRight size={15}/></button></div>
    </article>)}</div>
    {invite && <div className="modal-backdrop" onClick={()=>setInvite(false)}><div className="standard-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setInvite(false)}><X size={18}/></button><div className="modal-icon"><Share2 size={23}/></div><h2>Convidar novo aluno</h2><p>Compartilhe este link. Ao criar a conta, a pessoa será vinculada ao seu perfil de treinador.</p><div className="copy-link"><span>atlas.fit/convite/amanda-7f3a</span><button>Copiar</button></div><button className="primary-btn full">Compartilhar convite <Share2 size={17}/></button></div></div>}
  </div>
}

function StudentDetail({ setPage }) {
  const [tab,setTab]=useState('workouts')
  const [exporting,setExporting]=useState(null)
  const [target,setTarget]=useState('Bianca Melo')
  const prescribed = [
    {name:'Upper A — Peito & Costas', model:'AB', routine:'Seg · Qui', status:'Ativo'},
    {name:'Lower A — Quadríceps', model:'AB', routine:'Ter · Sex', status:'Ativo'},
  ]
  const history = [
    {date:'06 out.',name:'Upper A — Peito & Costas',duration:'54 min',status:'Realizado'},
    {date:'03 out.',name:'Lower A — Quadríceps',duration:'58 min',status:'Realizado'},
    {date:'30 set.',name:'Upper A — Peito & Costas',duration:'51 min',status:'Realizado'},
    {date:'27 set.',name:'Lower A — Quadríceps',duration:'—',status:'Não realizado'},
  ]
  return <div className="page-stack"><button className="back-link" onClick={()=>setPage('students')}><ArrowLeft size={17}/> Voltar aos alunos</button>
    <section className="student-profile-head"><Avatar initials="MC" size="lg"/><div><Badge>Aluno ativo</Badge><h1>Marina Costa</h1><p>Modelo AB · vinculada desde 12 mar. 2026</p></div><div className="profile-actions"><button className="secondary-btn"><MessageCircle size={17}/> Mensagem</button><button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={17}/> Novo treino</button></div></section>
    <div className="stats-grid"><StatCard icon={Activity} label="Aderência" value="92%" detail="últimos 30 dias"/><StatCard icon={Dumbbell} label="Volume total" value="21.840 kg" detail="+12% no período"/><StatCard icon={Flame} label="Sequência" value="8 treinos" detail="melhor marca: 11"/></div>

    <div className="detail-tabs"><button className={tab==='workouts'?'active':''} onClick={()=>setTab('workouts')}>Treinos criados</button><button className={tab==='history'?'active':''} onClick={()=>setTab('history')}>Histórico de treinos</button><button className={tab==='progress'?'active':''} onClick={()=>setTab('progress')}>Evolução</button></div>

    {tab==='workouts' && <section className="panel no-pad"><div className="detail-workout-list">{prescribed.map((w,i)=><div className="detail-workout-row" key={w.name}><span className="workout-icon"><Dumbbell size={18}/></span><div><strong>{w.name}</strong><small>Modelo {w.model} · {w.routine}</small></div><Badge>{w.status}</Badge><button className="secondary-btn compact" onClick={()=>setExporting(w)}>Exportar para outro aluno <Share2 size={15}/></button><ChevronRight size={17}/></div>)}</div></section>}

    {tab==='history' && <section className="panel no-pad"><div className="history-list">{history.map((h,i)=><div className="history-row detail-history" key={i}><div className="history-date">{h.date.toUpperCase()}</div><div className="history-main"><strong>{h.name}</strong><small>{h.duration}</small></div><Badge tone={h.status==='Realizado'?'green':'gray'}>{h.status}</Badge><ChevronRight size={18}/></div>)}</div></section>}

    {tab==='progress' && <div className="grid-2"><section className="panel"><div className="panel-head"><div><h3>Progressão de carga</h3><p>Supino reto · últimas 8 semanas</p></div><Badge>+11%</Badge></div><div className="line-chart"><svg viewBox="0 0 500 190" preserveAspectRatio="none"><path d="M0,165 C80,150 110,160 155,130 S250,120 300,95 S410,76 500,46" fill="none" stroke="#497b50" strokeWidth="4" strokeLinecap="round"/></svg></div></section>
    <section className="panel"><div className="panel-head"><div><h3>Anotações recentes</h3><p>Feedbacks registrados pela aluna.</p></div></div><div className="notes-list"><div><span>04 out.</span><p>“Última série do agachamento ficou bem pesada, mas sem perder a técnica.”</p></div><div><span>30 set.</span><p>“Supino mais estável. Sem desconforto no ombro.”</p></div></div></section></div>}

    {exporting && <div className="modal-backdrop" onClick={()=>setExporting(null)}><div className="standard-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setExporting(null)}><X size={18}/></button><div className="modal-icon"><Share2 size={23}/></div><h2>Exportar treino</h2><p>Copie <strong>{exporting.name}</strong> para outro aluno. A cópia poderá ser editada antes de ser prescrita.</p><label className="field-label export-label">Aluno de destino</label><select className="export-target" value={target} onChange={e=>setTarget(e.target.value)}>{students.filter(s=>s.name!=='Marina Costa').sort((a,b)=>a.name.localeCompare(b.name)).map(s=><option key={s.name}>{s.name}</option>)}</select><button className="primary-btn full" onClick={()=>setExporting(null)}>Exportar para {target} <Share2 size={17}/></button></div></div>}
  </div>
}

function ExerciseLibrary({ setPage }) {
  const [query,setQuery]=useState('')
  const filtered=exercises.filter(e=>e.name.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-stack"><section className="page-heading action-heading"><div><span className="eyebrow">Biblioteca</span><h1>Exercícios</h1><p>Encontre exercícios por nome, grupo muscular ou categoria.</p></div><button className="primary-btn"><Video size={18}/> Adicionar vídeo próprio</button></section>
    <div className="toolbar"><div className="search-box grow"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar exercício por nome"/></div><button className="filter">Grupo muscular <ChevronDown size={15}/></button><button className="filter">Categoria <ChevronDown size={15}/></button></div>
    <div className="exercise-library-grid">{filtered.map(ex=><article className="library-card" key={ex.id}><div className="library-video"><Dumbbell size={34}/><button><Play size={17} fill="currentColor"/></button></div><div className="library-copy"><div><Badge tone="light">{ex.group}</Badge><Badge tone="gray">{ex.category}</Badge></div><h3>{ex.name}</h3><p>Execução guiada com foco em amplitude, controle e estabilidade.</p><div><span>Biblioteca Atlas</span><button onClick={()=>setPage('builder')}><Plus size={15}/> Usar</button></div></div></article>)}</div>
  </div>
}

function Workouts({ setPage }) {
  const [query,setQuery]=useState('')
  const [status,setStatus]=useState('Todos')
  const rows = [
    {name:'Upper/Lower — A',student:'Marina Costa',routine:'Seg · Qui',model:'AB',status:'Ativo'},
    {name:'Full Body — A',student:'Lucas Nunes',routine:'Seg · Qua · Sex',model:'FULLBODY',status:'A vencer'},
    {name:'Hipertrofia — Push',student:'Bianca Melo',routine:'Ter · Sex',model:'ABC',status:'Vencido'},
    {name:'Recondicionamento 01',student:'Diego Ramos',routine:'Ter · Sáb',model:'AB',status:'Pausado'},
  ]
  const filtered = rows.filter(w => {
    const text = `${w.name} ${w.student} ${w.model}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (status==='Todos' || w.status===status)
  })
  const toneFor = s => s==='Ativo'?'green':s==='A vencer'?'light':'gray'

  return <div className="page-stack"><section className="page-heading action-heading"><div><span className="eyebrow">Prescrição</span><h1>Treinos & templates</h1><p>Crie modelos reutilizáveis ou personalize uma rotina para cada aluno.</p></div><button className="primary-btn" onClick={()=>setPage('builder')}><Plus size={18}/> Criar treino</button></section>
    <div className="tabs"><button className="active">Treinos prescritos</button><button>Templates</button></div>
    <div className="toolbar workout-filters"><div className="search-box grow"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por treino, aluno ou modelo"/></div><label className="status-filter"><span>Status</span><select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option><option>Ativo</option><option>A vencer</option><option>Vencido</option><option>Pausado</option></select></label></div>
    <section className="panel no-pad"><div className="workout-table"><div className="workout-table-head"><span>Treino</span><span>Aluno</span><span>Rotina</span><span>Modelo</span><span>Status</span><span></span></div>
    {filtered.map((w,i)=><div className="workout-table-row" key={i}><div><span className="workout-icon"><Dumbbell size={18}/></span><strong>{w.name}</strong></div><span>{w.student}</span><span>{w.routine}</span><strong>{w.model}</strong><Badge tone={toneFor(w.status)}>{w.status}</Badge><button><MoreHorizontal size={18}/></button></div>)}
    {!filtered.length && <div className="empty-state">Nenhum treino encontrado com esses filtros.</div>}</div></section>
  </div>
}

function WorkoutBuilder({ setPage }) {
  const [items,setItems]=useState(exercises.slice(0,3))
  const [studentQuery,setStudentQuery]=useState('Marina Costa')
  const [studentOpen,setStudentOpen]=useState(false)
  const [selectedStudent,setSelectedStudent]=useState('Marina Costa')
  const [workoutName,setWorkoutName]=useState('Upper A — Peito & Costas')
  const [model,setModel]=useState('AB')
  const remove=id=>setItems(v=>v.filter(e=>e.id!==id))
  const sortedStudents=useMemo(()=>[...students].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')),[ ])
  const matches=sortedStudents.filter(s=>s.name.toLowerCase().includes(studentQuery.toLowerCase()))
  const availability={
    'Marina Costa':[0,1,3,4],
    'Lucas Nunes':[0,2,4],
    'Bianca Melo':[1,2,4,5],
    'Diego Ramos':[1,5],
  }
  const dayLabels=['S','T','Q','Q','S','S','D']
  const dayNames=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']
  const selectedDays=availability[selectedStudent] || []
  const templateNames=['Upper A — Peito & Costas','Lower A — Quadríceps','Upper B — Ombros & Braços','Full Body — Base','Push — Hipertrofia']

  const chooseStudent = name => {setSelectedStudent(name);setStudentQuery(name);setStudentOpen(false)}

  return <div className="page-stack builder-page"><button className="back-link" onClick={()=>setPage('workouts')}><ArrowLeft size={17}/> Voltar aos treinos</button>
    <section className="page-heading"><span className="eyebrow">Novo treino</span><h1>Montar prescrição</h1><p>Escolha o aluno, aproveite um treino já criado e ajuste os exercícios antes de salvar.</p></section>
    <div className="builder-layout"><div className="builder-main">
      <section className="panel form-panel"><h3>Informações gerais</h3><div className="form-grid">
        <label className="combo-field"><span>Aluno</span><div className="combo-box"><Search size={17}/><input value={studentQuery} onFocus={()=>setStudentOpen(true)} onChange={e=>{setStudentQuery(e.target.value);setStudentOpen(true)}} placeholder="Buscar aluno"/><button type="button" onClick={()=>{setStudentQuery(studentOpen?'':selectedStudent);setStudentOpen(v=>!v)}}><ChevronDown size={16}/></button>{studentOpen && <div className="combo-menu">{matches.length?matches.map(s=><button type="button" key={s.name} className={selectedStudent===s.name?'active':''} onClick={()=>chooseStudent(s.name)}><Avatar initials={s.initials} size="xs"/><span>{s.name}</span>{selectedStudent===s.name&&<Check size={14}/>}</button>):<small>Nenhum aluno encontrado</small>}</div>}</div></label>
        <label><span>Modelo de treino</span><select value={model} onChange={e=>setModel(e.target.value)}><option>AB</option><option>ABC</option><option>FULLBODY</option></select></label>
        <label className="span-2"><span>Nome do treino / treino já criado</span><select value={workoutName} onChange={e=>setWorkoutName(e.target.value)}>{templateNames.map(t=><option key={t}>{t}</option>)}</select><small className="helper-text">Selecione um treino previamente criado para usar como base e editar antes de salvar.</small></label>
        <label><span>Tempo estimado</span><input defaultValue="52 min"/></label>
        <label><span>Posição na rotina</span><select><option>Treino A</option><option>Treino B</option><option>Treino C</option></select></label>
        <label className="span-2"><span>Observações gerais</span><textarea defaultValue="Intensidade moderada. Foco em progressão de carga e controle da fase excêntrica."/></label>
      </div></section>
      <section className="panel"><div className="panel-head"><div><h3>Exercícios</h3><p>Arraste conceitualmente para reorganizar a ordem.</p></div><button className="secondary-btn compact"><Plus size={16}/> Adicionar exercício</button></div>
        <div className="builder-exercises">{items.map((ex,idx)=><div className="builder-exercise" key={ex.id}><span className="drag-handle">⋮⋮</span><span className="exercise-index">{idx+1}</span><div className="builder-ex-main"><strong>{ex.name}</strong><small>{ex.group}</small></div><label><small>Séries</small><input defaultValue={ex.sets}/></label><label><small>Reps</small><input defaultValue={ex.reps}/></label><label><small>Carga</small><input defaultValue={ex.weight}/></label><label><small>Descanso</small><input defaultValue={ex.rest}/></label><button className="remove-btn" onClick={()=>remove(ex.id)}><X size={17}/></button></div>)}</div>
      </section>
    </div>
    <aside className="builder-side"><section className="panel routine-readonly"><div className="panel-head"><div><h3>Disponibilidade do aluno</h3><p>Essa rotina foi escolhida por {selectedStudent}.</p></div><Lock size={18}/></div><div className="weekday-picker readonly">{dayLabels.map((d,i)=><span key={i} className={selectedDays.includes(i)?'active':''}>{d}</span>)}</div><div className="availability-summary"><strong>{selectedDays.length} dias disponíveis</strong><span>{selectedDays.map(i=>dayNames[i]).join(' · ')}</span></div><div className="info-note">O aluno define quando consegue treinar. Você define quais treinos (A, B, C...) serão distribuídos dentro dessa disponibilidade.</div></section>
    <section className="panel summary-panel"><h3>Resumo</h3><div><span>Aluno</span><strong>{selectedStudent}</strong></div><div><span>Modelo</span><strong>{model}</strong></div><div><span>Exercícios</span><strong>{items.length}</strong></div><div><span>Séries totais</span><strong>{items.reduce((a,b)=>a+b.sets,0)}</strong></div><button className="primary-btn full" onClick={()=>setPage('workouts')}>Salvar e prescrever <Check size={17}/></button><button className="text-btn centered">Salvar como template</button></section></aside></div>
  </div>
}

function AppShell() {
  const [profile,setProfile]=useState('student')
  const [page,setPage]=useState('home')
  const [logged,setLogged]=useState(false)

  const changeProfile = p => {
    setProfile(p)
    setPage(p === 'student' ? 'home' : 'dashboard')
  }

  if (!logged) return <Login onEnter={()=>setLogged(true)}/>

  let content
  if (profile === 'student') {
    content = page === 'home' ? <StudentHome setPage={setPage}/> :
      page === 'workout' ? <WorkoutExecution setPage={setPage}/> :
      page === 'history' ? <StudentHistory/> :
      page === 'progress' ? <StudentProgress/> :
      <Messages/>
  } else {
    content = page === 'dashboard' ? <TrainerDashboard setPage={setPage}/> :
      page === 'students' ? <Students setPage={setPage}/> :
      page === 'studentDetail' ? <StudentDetail setPage={setPage}/> :
      page === 'library' ? <ExerciseLibrary setPage={setPage}/> :
      page === 'workouts' ? <Workouts setPage={setPage}/> :
      page === 'builder' ? <WorkoutBuilder setPage={setPage}/> :
      <Messages trainer/>
  }

  return <div className="app-shell">
    <Topbar profile={profile} setProfile={changeProfile} onLogout={()=>setLogged(false)}/>
    <SideNav profile={profile} page={page} setPage={setPage}/>
    <main className="app-main">{content}</main>
    <BottomNav profile={profile} page={page} setPage={setPage}/>
  </div>
}

export default function App() {
  return <AppShell/>
}
