(()=>{
const ses=session();if(!ses?.token){location.replace('index.html');return}
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selectedId='',pinValue='',part='glasses',avatar={preset:'custom',glasses:'g1',outfit:'none',accessory:'none'};
const files={glasses:'glasses',outfit:'outfit',accessory:'accessory'},prefix={glasses:'g',outfit:'o',accessory:'a'},labels={glasses:['빨간 안경','그린 안경','하트 안경','호피 안경','선글라스','오렌지 안경'],outfit:['세일러복','멜빵옷','가운','정장','유니폼','후드티'],accessory:['머리핀','넥타이','머리띠','목도리','왕관','튜브']};
const itemScroller=$('itemOptions');
function norm(a={}){const g=(/^g[1-6]$/.test(a.glasses)||a.glasses==='none'||a.glasses==='default')?a.glasses:'default';return{preset:a.preset||'default',glasses:g,outfit:/^o[1-6]$/.test(a.outfit)?a.outfit:'none',accessory:/^a[1-6]$/.test(a.accessory)?a.accessory:'none'}}
function avatarBaseSrc(a){a=norm(a);return (a.glasses==='default' || (a.glasses==='none'&&a.outfit==='none'&&a.accessory==='none')) ? 'avatar/base-default.png' : 'avatar/base-editor.png'}
function avatarLayers(a={}){a=norm(a);const layers=[`<img class="avatar-layer layer-base" src="${avatarBaseSrc(a)}" alt="">`];
  if(a.accessory==='a6')layers.push(`<img class="avatar-layer layer-accessory behind item-a6" src="avatar/accessory-6.png" alt="">`);
  if(a.outfit!=='none')layers.push(`<img class="avatar-layer layer-outfit item-${a.outfit}" src="avatar/outfit-${a.outfit.slice(1)}.png" alt="">`);
  if(/^g[1-6]$/.test(a.glasses))layers.push(`<img class="avatar-layer layer-glasses item-${a.glasses}" src="avatar/glasses-${a.glasses.slice(1)}.png" alt="">`);
  if(a.accessory!=='none' && a.accessory!=='a6')layers.push(`<img class="avatar-layer layer-accessory item-${a.accessory}" src="avatar/accessory-${a.accessory.slice(1)}.png" alt="">`);
  return layers.join('')
}
function avatarThumb(a={}){a=norm(a);const layers=[`<img src="${avatarBaseSrc(a)}" alt="">`];
  if(a.outfit!=='none')layers.push(`<img src="avatar/outfit-${a.outfit.slice(1)}.png" alt="">`);
  if(/^g[1-6]$/.test(a.glasses))layers.push(`<img src="avatar/glasses-${a.glasses.slice(1)}.png" alt="">`);
  if(a.accessory!=='none')layers.push(`<img src="avatar/accessory-${a.accessory.slice(1)}.png" alt="">`);
  return layers.join('')
}
async function choose(id,pin=''){const d=scalar(await rpc('quiz_load_progress',{p_token:ses.token,p_profile_id:id,p_pin:pin}));sessionStorage.setItem('eutteum50:quiz-active-profile',JSON.stringify({id,display_name:d.display_name,xp:Number(d.xp||0),avatar:d.avatar||{},pin}));location.href='quiz.html'}
async function load(){try{const raw=await rpc('quiz_list_profiles',{p_token:ses.token}),list=Array.isArray(raw)?raw:scalar(raw)||[];$('profiles').innerHTML=list.map(p=>`<button class="profile-card" data-id="${esc(p.id)}" data-pin="${p.has_pin?'1':'0'}"><span class="profile-face">${avatarThumb(p.avatar)}</span><span class="profile-copy"><strong>${esc(p.display_name)}</strong><small>${Number(p.xp||0).toLocaleString()} XP${p.has_pin?' · PIN 사용':''}</small></span><b class="chev">›</b></button>`).join('')||'<p class="empty">아직 프로필이 없습니다. 새 프로필을 만들어 주세요.</p>';$('profiles').querySelectorAll('button').forEach(b=>b.onclick=async()=>{selectedId=b.dataset.id;if(b.dataset.pin==='1'){openPin();return}b.disabled=true;try{await choose(selectedId)}catch(e){$('profileError').textContent=e.message;b.disabled=false}})}catch(e){$('profiles').innerHTML=`<p class="empty">프로필을 불러오지 못했습니다.<br>${esc(e.message)}</p>`}}
function draw(){avatar.preset=avatar.glasses==='default'&&avatar.outfit==='none'&&avatar.accessory==='none'?'default':'custom';$('avatarStage').innerHTML=avatarLayers(avatar);document.querySelectorAll('#customTabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===part)));const selected=avatar[part],items=[];if(part==='glasses'){items.push(`<button type="button" class="none" data-value="none" aria-pressed="${selected==='none'}">선택 안함</button>`);}else{items.push(`<button type="button" class="none" data-value="none" aria-pressed="${selected==='none'}">선택 안함</button>`);}for(let i=1;i<=6;i++){const value=prefix[part]+i;items.push(`<button type="button" data-value="${value}" aria-pressed="${selected===value}"><img src="avatar/${files[part]}-${i}.png" alt="${labels[part][i-1]}"></button>`)}$('itemOptions').innerHTML=items.join('');toggleArrowState()}
function scrollItems(dir){const card=$('itemOptions').querySelector('button');const step=(card?.offsetWidth||96)+7;$('itemOptions').scrollBy({left:dir*step,behavior:'smooth'});setTimeout(toggleArrowState,240)}
function toggleArrowState(){const box=$('itemOptions');if(!box)return;$('itemsPrev').disabled=box.scrollLeft<=4;$('itemsNext').disabled=box.scrollLeft+box.clientWidth>=box.scrollWidth-4}
$('itemsPrev').onclick=()=>scrollItems(-1);$('itemsNext').onclick=()=>scrollItems(1);itemScroller.addEventListener('scroll',toggleArrowState);
$('openCreate').onclick=()=>{avatar={preset:'custom',glasses:'g1',outfit:'none',accessory:'none'};$('profileApp').classList.add('creating');draw();scrollTo(0,0)};$('closeCreate').onclick=()=>{$('profileApp').classList.remove('creating');$('profileError').textContent='';scrollTo(0,0)};$('customTabs').onclick=e=>{const b=e.target.closest('button[data-part]');if(!b)return;part=b.dataset.part;draw()};$('itemOptions').onclick=e=>{const b=e.target.closest('button[data-value]');if(!b)return;avatar[part]=b.dataset.value; if(part==='glasses'&&avatar.glasses==='none') avatar.glasses='none'; draw()};
$('profilePinToggle').onclick=()=>{const input=$('profilePin');input.type=input.type==='password'?'text':'password'};
function renderPin(){[...$('pinDots').children].forEach((d,i)=>d.textContent=i<pinValue.length?'●':'')}
function syncPinInput(){ $('pinInput').value=pinValue; renderPin(); }
function closePin(){ $('pinDialog').close(); pinValue=''; syncPinInput(); }
function openPin(){pinValue='';$('pinError').textContent='';syncPinInput();$('pinDialog').showModal();setTimeout(()=>$('pinInput').focus(),30)}
async function submitPin(){ if(pinValue.length!==4)return; try{await choose(selectedId,pinValue)}catch(err){$('pinError').textContent=err.message;pinValue='';setTimeout(syncPinInput,100)} }
function onPinKey(k){ if(k==='cancel'){closePin();return;} if(k==='back'){pinValue=pinValue.slice(0,-1);syncPinInput();return;} if(/^[0-9]$/.test(k)&&pinValue.length<4){pinValue+=k;syncPinInput(); if(pinValue.length===4) submitPin();} }
$('pinClose').onclick=closePin;$('pinPad').onclick=e=>{const b=e.target.closest('button[data-key]');if(!b)return;onPinKey(b.dataset.key)};
$('pinInput').addEventListener('input',e=>{const digits=e.target.value.replace(/\D/g,'').slice(0,4);pinValue=digits;syncPinInput(); if(pinValue.length===4) submitPin()});
$('pinDialog').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closePin();return}if(/^[0-9]$/.test(e.key)){e.preventDefault();onPinKey(e.key);return}if(e.key==='Backspace'){e.preventDefault();onPinKey('back');return}if(e.key==='Enter'){e.preventDefault();submitPin();return}});
$('profilePin').addEventListener('input',e=>e.target.value=e.target.value.replace(/\D/g,'').slice(0,4));
$('createProfile').onsubmit=async e=>{e.preventDefault();const name=$('displayName').value.trim(),pin=$('profilePin').value;if(!name)return $('profileError').textContent='프로필명을 입력해 주세요.';if(pin&&!/^\d{4}$/.test(pin))return $('profileError').textContent='PIN은 숫자 4자리로 입력하거나 비워 주세요.';const b=e.submitter;b.disabled=true;$('profileError').textContent='';const payloadAvatar={...avatar};if(payloadAvatar.glasses==='none')payloadAvatar.glasses='default';try{await rpc('quiz_create_profile_v2',{p_token:ses.token,p_display_name:name,p_pin:pin,p_avatar:payloadAvatar});$('createProfile').reset();avatar={preset:'custom',glasses:'g1',outfit:'none',accessory:'none'};$('profileApp').classList.remove('creating');await load()}catch(err){$('profileError').textContent=err.message}finally{b.disabled=false}};
load();
})();