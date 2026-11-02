'use strict';

// Dados demonstrativos: não existe backend neste projeto.
const dadosIniciais = {
  reservas: [
    {id:101,pet:'Thor',dono:'Mariana Souza',entrada:'2026-10-14',saida:'2026-10-18',status:'Finalizada',notas:'Estadia concluída.'},
    {id:102,pet:'Mel',dono:'João Pedro',entrada:'2026-10-25',saida:'2026-11-03',status:'Em andamento',notas:'Alimentação duas vezes ao dia.'},
    {id:103,pet:'Luna',dono:'Ana Clara',entrada:'2026-11-05',saida:'2026-11-08',status:'Reservada',notas:''},
    {id:104,pet:'Bob',dono:'Rafael Lima',entrada:'2026-11-10',saida:'2026-11-12',status:'Cancelada',notas:''}
  ],
  pets: [
    {id:1,nome:'Thor',tipo:'Cão',raca:'Golden Retriever',tamanho:'Grande',dono:'Mariana Souza'},
    {id:2,nome:'Mel',tipo:'Gato',raca:'Siamês',tamanho:'Pequeno',dono:'João Pedro'},
    {id:3,nome:'Luna',tipo:'Cão',raca:'Shih-tzu',tamanho:'Pequeno',dono:'Ana Clara'},
    {id:4,nome:'Bob',tipo:'Cão',raca:'Labrador',tamanho:'Grande',dono:'Rafael Lima'}
  ],
  usuarios: [
    {id:1,nome:'Mariana Souza',email:'mariana@email.com',funcao:'Cliente'},
    {id:2,nome:'Roberto Alves',email:'roberto@email.com',funcao:'Funcionário'},
    {id:3,nome:'João Pedro',email:'joao@email.com',funcao:'Cliente'},
    {id:4,nome:'Carlos Mendes',email:'carlos@hotelpet.com',funcao:'Gerente'}
  ],
  configuracoes:{diaria:85,vagas:20}
};

function carregarDados(){
  try {
    const salvo=localStorage.getItem('hotelPetDados');
    if(!salvo) return structuredClone(dadosIniciais);
    const dados=JSON.parse(salvo);
    return {reservas:Array.isArray(dados.reservas)?dados.reservas:structuredClone(dadosIniciais.reservas),pets:Array.isArray(dados.pets)?dados.pets:structuredClone(dadosIniciais.pets),usuarios:Array.isArray(dados.usuarios)?dados.usuarios:structuredClone(dadosIniciais.usuarios),configuracoes:{...dadosIniciais.configuracoes,...dados.configuracoes}};
  } catch { return structuredClone(dadosIniciais); }
}
let dados=carregarDados();
function salvarDados(){localStorage.setItem('hotelPetDados',JSON.stringify(dados));}
function textoSeguro(valor){return String(valor??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function normalizar(valor){return String(valor??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function dataBR(valor){if(!valor)return '—';const [a,m,d]=valor.split('-');return `${d}/${m}/${a}`;}
function moeda(valor){return Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function mensagemVazia(id,lista){const el=document.getElementById(id);if(el)el.hidden=lista.length!==0;}

// ETAPA 2: as buscas filtram os registros enquanto o usuário digita.
function configurarBusca(inputId,botaoId,render){const input=document.getElementById(inputId);if(!input)return;input.addEventListener('input',render);document.getElementById(botaoId)?.addEventListener('click',()=>{input.value='';render();input.focus();});}

function renderReservas(){const termo=normalizar(document.getElementById('buscaReservas')?.value||'');const lista=dados.reservas.filter(r=>normalizar([r.id,r.pet,r.dono,r.entrada,r.saida,r.status].join(' ')).includes(termo));const tbody=document.getElementById('tabelaReservas');if(!tbody)return;tbody.innerHTML=lista.map(r=>`<tr><td>#${r.id}</td><td>${textoSeguro(r.pet)}</td><td>${textoSeguro(r.dono)}</td><td>${dataBR(r.entrada)}</td><td>${dataBR(r.saida)}</td><td><span class="status">${textoSeguro(r.status)}</span></td><td><button class="table-action" data-editar-reserva="${r.id}">Editar</button></td></tr>`).join('');mensagemVazia('vazioReservas',lista);tbody.querySelectorAll('[data-editar-reserva]').forEach(b=>b.addEventListener('click',()=>editarReserva(Number(b.dataset.editarReserva))));}
function editarReserva(id){const r=dados.reservas.find(x=>x.id===id);if(!r)return;document.getElementById('reservaId').value=r.id;document.getElementById('reservaPet').value=r.pet;document.getElementById('reservaDono').value=r.dono;document.getElementById('reservaEntrada').value=r.entrada;document.getElementById('reservaSaida').value=r.saida;document.getElementById('reservaStatus').value=r.status;document.getElementById('reservaNotas').value=r.notas||'';document.getElementById('editorReserva').scrollIntoView({behavior:'smooth'});}
function limparFormReserva(){document.getElementById('formReserva')?.reset();document.getElementById('reservaId').value='';}
function iniciarReservas(){configurarBusca('buscaReservas','limparReservas',renderReservas);renderReservas();document.getElementById('formReserva')?.addEventListener('submit',e=>{e.preventDefault();const id=Number(document.getElementById('reservaId').value);const r=dados.reservas.find(x=>x.id===id);if(!r)return;const entrada=document.getElementById('reservaEntrada').value,saida=document.getElementById('reservaSaida').value;if(saida<=entrada){alert('A data de saída deve ser posterior à data de entrada.');return;}Object.assign(r,{pet:document.getElementById('reservaPet').value.trim(),dono:document.getElementById('reservaDono').value.trim(),entrada,saida,status:document.getElementById('reservaStatus').value,notas:document.getElementById('reservaNotas').value.trim()});salvarDados();renderReservas();limparFormReserva();alert('Reserva atualizada com sucesso!');});document.getElementById('cancelarReserva')?.addEventListener('click',limparFormReserva);}

function renderPets(){const termo=normalizar(document.getElementById('buscaPets')?.value||'');const lista=dados.pets.filter(p=>normalizar([p.nome,p.tipo,p.raca,p.tamanho,p.dono].join(' ')).includes(termo));const tbody=document.getElementById('tabelaPets');if(!tbody)return;tbody.innerHTML=lista.map(p=>`<tr><td>${textoSeguro(p.nome)}</td><td>${textoSeguro(p.tipo)}</td><td>${textoSeguro(p.raca)}</td><td>${textoSeguro(p.tamanho)}</td><td>${textoSeguro(p.dono)}</td><td><button class="table-action" data-editar-pet="${p.id}">Editar</button></td></tr>`).join('');mensagemVazia('vazioPets',lista);tbody.querySelectorAll('[data-editar-pet]').forEach(b=>b.addEventListener('click',()=>editarPet(Number(b.dataset.editarPet))));}
function editarPet(id){const p=dados.pets.find(x=>x.id===id);if(!p)return;document.getElementById('petId').value=p.id;document.getElementById('petNome').value=p.nome;document.getElementById('petTipo').value=p.tipo;document.getElementById('petRaca').value=p.raca;document.getElementById('petTamanho').value=p.tamanho;document.getElementById('petDono').value=p.dono;document.getElementById('formPet').scrollIntoView({behavior:'smooth'});}
function iniciarPets(){configurarBusca('buscaPets','limparPets',renderPets);renderPets();document.getElementById('formPet')?.addEventListener('submit',e=>{e.preventDefault();const id=Number(document.getElementById('petId').value);const p=dados.pets.find(x=>x.id===id);if(!p)return;Object.assign(p,{nome:document.getElementById('petNome').value.trim(),tipo:document.getElementById('petTipo').value,raca:document.getElementById('petRaca').value.trim(),tamanho:document.getElementById('petTamanho').value,dono:document.getElementById('petDono').value.trim()});salvarDados();renderPets();e.target.reset();document.getElementById('petId').value='';alert('Cadastro do pet atualizado com sucesso!');});document.getElementById('cancelarPet')?.addEventListener('click',()=>{document.getElementById('formPet').reset();document.getElementById('petId').value='';});}

function renderUsuarios(){const termo=normalizar(document.getElementById('buscaUsuarios')?.value||'');const lista=dados.usuarios.filter(u=>normalizar([u.nome,u.email,u.funcao].join(' ')).includes(termo));const tbody=document.getElementById('tabelaUsuarios');if(!tbody)return;tbody.innerHTML=lista.map(u=>`<tr><td>${textoSeguro(u.nome)}</td><td>${textoSeguro(u.email)}</td><td><select aria-label="Função de ${textoSeguro(u.nome)}" data-funcao="${u.id}"><option ${u.funcao==='Cliente'?'selected':''}>Cliente</option><option ${u.funcao==='Funcionário'?'selected':''}>Funcionário</option><option ${u.funcao==='Gerente'?'selected':''}>Gerente</option></select></td><td><button class="table-action" data-salvar-usuario="${u.id}">Salvar</button></td></tr>`).join('');mensagemVazia('vazioUsuarios',lista);tbody.querySelectorAll('[data-salvar-usuario]').forEach(b=>b.addEventListener('click',()=>{const u=dados.usuarios.find(x=>x.id===Number(b.dataset.salvarUsuario));const select=tbody.querySelector(`[data-funcao="${u.id}"]`);u.funcao=select.value;salvarDados();renderUsuarios();alert('Função do usuário atualizada com sucesso!');}));}
function iniciarUsuarios(){configurarBusca('buscaUsuarios','limparUsuarios',renderUsuarios);renderUsuarios();}

function iniciarConfig(){const form=document.getElementById('formConfig');if(!form)return;document.getElementById('diaria').value=dados.configuracoes.diaria;document.getElementById('vagas').value=dados.configuracoes.vagas;form.addEventListener('submit',e=>{e.preventDefault();const diaria=Number(document.getElementById('diaria').value),vagas=Number(document.getElementById('vagas').value);if(diaria<=0||vagas<1||!Number.isInteger(vagas)){alert('Informe uma diária positiva e um número inteiro de vagas.');return;}dados.configuracoes={diaria,vagas};salvarDados();document.getElementById('mensagemConfig').textContent='Configurações salvas com sucesso!';});}
function iniciarDashboard(){const recentes=document.getElementById('recentes');if(!recentes)return;recentes.innerHTML=dados.reservas.slice(0,4).map(r=>`<tr><td>#${r.id}</td><td>${textoSeguro(r.pet)}</td><td>${textoSeguro(r.dono)}</td><td>${dataBR(r.entrada)} – ${dataBR(r.saida)}</td><td><span class="status">${textoSeguro(r.status)}</span></td><td><a href="reservas.html">Ver/editar</a></td></tr>`).join('');document.getElementById('valorDiaria').textContent=moeda(dados.configuracoes.diaria);document.getElementById('ativas').textContent=dados.reservas.filter(r=>['Reservada','Em andamento'].includes(r.status)).length;document.getElementById('ocupadas').textContent=`12 / ${dados.configuracoes.vagas}`;}

document.addEventListener('DOMContentLoaded',()=>{iniciarReservas();iniciarPets();iniciarUsuarios();iniciarConfig();iniciarDashboard();});
