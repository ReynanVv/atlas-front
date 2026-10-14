const API='https://controlfinance-app.onrender.com/atlas-api';
const app=document.getElementById('app');
const days=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],short=['D','S','T','Q','Q','S','S'];
let demo=null,token='',user=null,invites=[],students=[],availability=[],workouts=[],session=null,msg='',err='';

async function req(path,opt={}){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),60000);
 try{
  const r=await fetch(API+path,{method:opt.method||'GET',headers:{...(opt.body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},body:opt.body?JSON.stringify(opt.body):undefined,signal:controller.signal});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data.error||'Erro na operação.');
  return data;
 }catch(e){
  if(e?.name==='AbortError') throw new Error('O backend demorou mais de 60 segundos para responder. Tente novamente.');
  throw e;
 }finally{clearTimeout(timer)}
}
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const badge=t=>'<span class="badge">'+esc(t)+'</span>';
const notice=()=> (err?'<div class="notice err">'+esc(err)+'</div>':'')+(msg?'<div class="notice ok">'+esc(msg)+'</div>':'');
function steps(x){return '<div class="steps">'+[['Convite',x.invite],['Disponibilidade',x.availability],['Prescrição',x.workout],['Execução',x.execution]].map(([n,d],i)=>'<div class="step '+(d?'done':'')+'">'+(d?'✓':i+1)+' · '+n+'</div>').join('')+'</div>'}
function top(){return '<div class="top"><div class="brand"><i>⌁</i>Atlas</div><button class="logout" id="logout">Sair</button></div>'}
function panel(title,sub,body,tag=''){return '<section class="panel"><div class="panel-title"><div><h2>'+title+'</h2><p class="muted">'+sub+'</p></div>'+(tag?badge(tag):'')+'</div>'+body+'</section>'}

async function boot(){
 app.innerHTML='<div class="login"><div class="login-box"><span class="pill">ATLAS</span><h1>Conectando ao backend...</h1><p>O serviço gratuito do Render pode levar alguns segundos para iniciar.</p><div class="notice ok">Carregando usuários e banco de dados...</div></div></div>';
 try{
  demo=await req('/demo');
  renderLogin();
 }catch(e){
  app.innerHTML='<div class="login"><div class="login-box"><span class="pill">ERRO DE CONEXÃO</span><h1>Não foi possível carregar o Atlas.</h1><div class="notice err">'+esc(e.message)+'</div><button class="primary" id="retry">Tentar novamente</button></div></div>';
  const retry=document.getElementById('retry');
  if(retry)retry.onclick=boot;
 }
}
function renderLogin(){
 app.innerHTML='<div class="login"><div class="login-box"><span class="pill">BACKEND CONECTADO</span><h1>Professor e aluno.<br><em>Do convite ao treino concluído.</em></h1><p>Escolha um perfil. Este ambiente usa o PostgreSQL do Render e permite repetir o fluxo completo.</p>'+notice()+'<div class="roles"><button class="role" data-role="trainer"><strong>Professor Atlas</strong><span>Convite e prescrição</span></button><button class="role" data-role="student"><strong>Aluno Atlas</strong><span>Disponibilidade e execução</span></button></div></div></div>';
 document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>login(b.dataset.role));
}
async function login(role){err='';msg='';try{const u=demo.users.find(x=>x.role===role);const d=await req('/auth/login',{method:'POST',body:{email:u.email,password:demo.password}});token=d.token;user=d.user;await load()}catch(e){err=e.message;renderLogin()}}
async function load(){
 err='';session=null;
 try{
  if(user.role==='trainer'){[students,invites,workouts]=await Promise.all([req('/trainer/students'),req('/invitations'),req('/workouts')]);renderTrainer()}
  else{const a=await Promise.all([req('/invitations'),req('/availability').catch(()=>({days:[]})),req('/workouts')]);invites=a[0];availability=a[1].days||[];workouts=a[2];renderStudent()}
 }catch(e){err=e.message; user.role==='trainer'?renderTrainer():renderStudent()}
}
function wireBase(){const l=document.getElementById('logout');if(l)l.onclick=()=>{token='';user=null;msg='';err='';renderLogin()}}

function renderTrainer(){
 const st=students[0],pending=invites.find(x=>x.status==='Pending'),avail=st?.availability||[];
 const p={invite:!!(st||pending),availability:avail.length>0,workout:workouts.length>0,execution:workouts.some(w=>w.latestSession?.completedAt)};
 let inviteBody=st?'<div class="state"><strong>'+esc(st.name)+'</strong>'+badge('Vinculado')+'</div>':pending?'<div class="state"><strong>Aluno Atlas</strong>'+badge('Aguardando aceite')+'</div>':'<button class="primary" id="invite">Enviar convite para Aluno Atlas</button>';
 let availBody=avail.length?'<div class="days">'+short.map((d,i)=>'<span class="'+(avail.includes(i)?'active':'')+'">'+d+'</span>').join('')+'</div><strong>'+avail.length+' dias: '+avail.map(d=>days[d]).join(' · ')+'</strong>':'<p class="muted">'+(st?'Aguardando o aluno informar sua disponibilidade.':'O aluno precisa aceitar o convite primeiro.')+'</p>';
 let workoutRows=workouts.map(w=>'<div class="workout"><div><strong>'+esc(w.name)+'</strong><small>'+esc(w.model)+' · '+w.scheduledDays.map(d=>days[d]).join(' · ')+'</small></div>'+badge(w.latestSession?.completedAt?'Concluído':w.latestSession?'Em execução':'Prescrito')+'</div>').join('');
 let prescribeBody=avail.length?'<button class="primary" id="prescribe">Prescrever treino AB</button>':'<p class="muted">A prescrição será liberada depois da disponibilidade.</p>';
 app.innerHTML=top()+'<main class="main"><div class="head"><div><span class="pill">PAINEL DO PROFESSOR</span><h1>Fluxo de acompanhamento</h1><p>Convide, acompanhe os dias do aluno e prescreva o treino.</p></div><button class="secondary" id="reset">Reiniciar demo</button></div>'+steps(p)+notice()+panel('1. Convidar aluno','O vínculo só existe após o aceite.',inviteBody,st?'Vinculado':pending?'Pendente':'')+panel('2. Disponibilidade','Somente o aluno escolhe quando pode treinar.',availBody,avail.length?'Informada':'')+panel('3. Prescrever treino','O treino respeita a disponibilidade.',prescribeBody+workoutRows,workouts.length?workouts.length+' treino(s)':'')+'</main>';
 wireBase();
 const i=document.getElementById('invite');if(i)i.onclick=inviteStudent;
 const pr=document.getElementById('prescribe');if(pr)pr.onclick=()=>prescribe(st);
 document.getElementById('reset').onclick=resetDemo;
}
async function inviteStudent(){err='';msg='';try{await req('/invitations',{method:'POST',body:{studentEmail:'aluno@atlas.test'}});msg='Convite enviado. Entre como aluno para aceitar.';await load()}catch(e){err=e.message;renderTrainer()}}
async function prescribe(st){err='';msg='';try{await req('/workouts',{method:'POST',body:{studentId:st.id,name:'Treino A — Peito & Costas',model:'AB',notes:'Amplitude controlada e progressão de carga.',scheduledDays:st.availability.slice(0,2),exercises:[{name:'Supino reto com halteres',sets:3,reps:10,suggestedWeight:18,restSeconds:90},{name:'Remada baixa',sets:3,reps:12,suggestedWeight:42,restSeconds:75},{name:'Elevação lateral',sets:3,reps:15,suggestedWeight:7,restSeconds:60}]}});msg='Treino prescrito e salvo no banco.';await load()}catch(e){err=e.message;renderTrainer()}}
async function resetDemo(){if(!confirm('Reiniciar convites, disponibilidade, treinos e execuções do Atlas?'))return;try{await req('/demo/reset',{method:'POST',body:{confirm:'RESET'}});msg='Fluxo reiniciado.';await load()}catch(e){err=e.message;renderTrainer()}}

function renderStudent(){
 const pending=invites.find(x=>x.status==='Pending'),linked=invites.some(x=>x.status==='Accepted');
 const p={invite:linked,availability:availability.length>0,workout:workouts.length>0,execution:workouts.some(w=>w.latestSession?.completedAt)};
 let inv=pending?'<button class="primary" id="accept">Aceitar convite do Professor Atlas</button>':linked?badge('Professor vinculado'):'<p class="muted">Entre como professor e envie o convite.</p>';
 let dayButtons='<div class="days">'+short.map((d,i)=>'<button data-day="'+i+'" class="'+(availability.includes(i)?'active':'')+'">'+d+'</button>').join('')+'</div><button class="primary" id="saveDays" '+(!availability.length?'disabled':'')+'>Salvar disponibilidade</button>';
 let rows=workouts.length?workouts.map(w=>'<div class="workout"><div><strong>'+esc(w.name)+'</strong><small>'+esc(w.model)+' · '+w.exercises.length+' exercícios</small></div><button class="primary start" data-id="'+w.id+'" '+(w.latestSession?.completedAt?'disabled':'')+'>'+(w.latestSession?.completedAt?'Concluído':w.latestSession?'Continuar':'Iniciar treino')+'</button></div>').join(''):'<p class="muted">Aguardando o professor prescrever um treino.</p>';
 app.innerHTML=top()+'<main class="main"><div class="head"><div><span class="pill">PAINEL DO ALUNO</span><h1>Seu fluxo de treino</h1><p>Aceite o professor, informe seus dias e execute o treino.</p></div></div>'+steps(p)+notice()+panel('1. Convite','Você decide se deseja criar o vínculo.',inv,linked?'Aceito':'')+panel('2. Minha disponibilidade','Escolha os dias em que você consegue treinar.',linked?dayButtons:'<p class="muted">Aceite o convite primeiro.</p>',availability.length?availability.length+' dias':'')+panel('3. Meus treinos','Treinos prescritos pelo professor.',rows,workouts.length?workouts.length+' treino(s)':'')+'</main>';
 wireBase();
 const a=document.getElementById('accept');if(a)a.onclick=acceptInvite;
 document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{const d=Number(b.dataset.day);availability=availability.includes(d)?availability.filter(x=>x!==d):[...availability,d].sort();renderStudent()});
 const sd=document.getElementById('saveDays');if(sd)sd.onclick=saveDays;
 document.querySelectorAll('.start').forEach(b=>b.onclick=()=>startWorkout(b.dataset.id));
}
async function acceptInvite(){try{const p=invites.find(x=>x.status==='Pending');await req('/invitations/'+p.id+'/accept',{method:'POST'});msg='Convite aceito. Agora informe sua disponibilidade.';await load()}catch(e){err=e.message;renderStudent()}}
async function saveDays(){try{await req('/availability',{method:'PUT',body:{days:availability}});msg='Disponibilidade salva. O professor já pode montar seu treino.';await load()}catch(e){err=e.message;renderStudent()}}
async function startWorkout(id){try{const w=workouts.find(x=>x.id===id);const s=w.latestSession&&!w.latestSession.completedAt?w.latestSession:await req('/workouts/'+id+'/start',{method:'POST'});session=await req('/sessions/'+s.id);renderSession()}catch(e){err=e.message;renderStudent()}}
function renderSession(){
 app.innerHTML=top()+'<main class="main"><button class="secondary" id="back">← Voltar</button><div class="head"><div><span class="pill">TREINO EM ANDAMENTO</span><h1>'+esc(session.workoutName)+'</h1><p>Confira a prescrição. Ao concluir, todas as séries serão registradas.</p></div></div>'+notice()+session.exercises.map(ex=>'<section class="panel"><h2>'+esc(ex.name)+'</h2><p class="muted">'+ex.sets+' séries × '+ex.reps+' reps · '+ex.suggestedWeight+' kg · descanso '+ex.restSeconds+'s</p></section>').join('')+'<button class="primary" id="finish">Registrar séries e concluir treino</button></main>';
 wireBase();document.getElementById('back').onclick=renderStudent;document.getElementById('finish').onclick=finishWorkout;
}
async function finishWorkout(){try{const calls=[];session.exercises.forEach(ex=>{for(let n=1;n<=ex.sets;n++)calls.push(req('/sessions/'+session.id+'/exercises/'+ex.id+'/sets/'+n,{method:'PUT',body:{reps:ex.reps,weight:ex.suggestedWeight}}))});await Promise.all(calls);await req('/sessions/'+session.id+'/complete',{method:'POST',body:{notes:'Treino concluído no fluxo de demonstração.'}});session=null;msg='Treino concluído e registrado no histórico.';await load()}catch(e){err=e.message;renderSession()}}
boot();