(()=>{if(!document.querySelector('link[data-ui-system]')){const l=document.createElement('link');l.rel='stylesheet';l.href='ui-system.css';l.dataset.uiSystem='1';document.head.append(l)}if(!document.querySelector('script[data-ui-dialog]')){const s=document.createElement('script');s.src='ui-dialog.js';s.dataset.uiDialog='1';document.head.append(s)}})();
const API='https://rzhjgjujmvxhvkbuofck.supabase.co',KEY='sb_publishable_j3VXPJJw6znG_hquWCRIfg_1nnCDp9F',SESSION='eutteum50:portal-session';
async function rpc(name,body={}){const r=await fetch(`${API}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)});const t=await r.text();let d;try{d=t?JSON.parse(t):null}catch{d=t}if(!r.ok)throw new Error(d?.message||'서버 오류');return d}
function scalar(v){if(Array.isArray(v)&&v.length===1)return scalar(v[0]);if(v&&typeof v==='object'){const k=Object.keys(v);if(k.length===1)return v[k[0]]}return v}
function session(){try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}}
function storeName(){const s=session();return s?.store?.name||s?.store?.full_name||'지점명'}
function aiUsage(){const s=session()?.store||{};const used=Number(s.ai_used??s.ai_usage??s.used_ai??0)||0;const limit=Number(s.ai_limit??s.ai_quota??s.total_ai??20)||20;return{used,limit}}
async function refreshAiUsage(){const ses=session();if(!ses?.token)return aiUsage();try{const r=await fetch(`${API}/functions/v1/generate-content`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify({action:'status',storeToken:ses.token,token:ses.token})});const d=await r.json();if(!r.ok||!d?.usage)throw new Error(d?.message||'사용량 조회 실패');const u=d.usage,store={...(ses.store||{}),ai_used:Number(u.used||0),ai_limit:Number(u.limit||20),ai_remaining:Number(u.remaining??Math.max(0,Number(u.limit||20)-Number(u.used||0))),ai_reset_date:u.next_reset_date||null};localStorage.setItem(SESSION,JSON.stringify({...ses,store}));return{used:store.ai_used,limit:store.ai_limit,remaining:store.ai_remaining,next_reset_date:store.ai_reset_date}}catch(e){console.warn(e);return aiUsage()}}
function go(u){location.href=u}
document.addEventListener('DOMContentLoaded',()=>{const stage=document.querySelector('.art-stage');if(stage&&!stage.querySelector('.logo-home-hit')){const b=document.createElement('button');b.type='button';b.className='logo-home-hit';b.setAttribute('aria-label','서비스 선택 홈');b.onclick=()=>go('service.html');stage.append(b)}});

/* Shared quiz avatar renderer + quiz feedback dialog */
function normalizeQuizAvatar(a={}){
  let accessories=Array.isArray(a.accessories)?a.accessories.filter(x=>/^a[1-6]$/.test(x)):(/^a[1-6]$/.test(a.accessory||'')?[a.accessory]:[]);
  accessories=[...new Set(accessories)];
  let glasses=(/^g[1-6]$/.test(a.glasses)||a.glasses==='none'||a.glasses==='default')?a.glasses:'default';
  const outfit=/^o[1-6]$/.test(a.outfit||'')?a.outfit:'none';
  if(glasses==='none'&&outfit==='none'&&accessories.length===0)glasses='default';
  return{preset:glasses==='default'&&outfit==='none'&&accessories.length===0?'default':'custom',glasses,outfit,accessories,accessory:accessories[0]||'none'};
}
function quizAvatarLayers(a={}){
  a=normalizeQuizAvatar(a);
  const custom=!(a.glasses==='default'&&a.outfit==='none'&&a.accessories.length===0);
  const out=[];
  if(a.accessories.includes('a6'))out.push('<img class="qa-layer qa-accessory qa-a6" src="avatar/aligned/accessory-6.png" alt="">');
  out.push(`<img class="qa-layer qa-base" src="avatar/aligned/${custom?'base-editor.png':'base-default.png'}" alt="">`);
  if(a.outfit!=='none')out.push(`<img class="qa-layer qa-outfit" src="avatar/aligned/outfit-${a.outfit.slice(1)}.png" alt="">`);
  const g=a.glasses==='default'&&custom?'g1':a.glasses;
  if(/^g[1-6]$/.test(g))out.push(`<img class="qa-layer qa-glasses" src="avatar/aligned/glasses-${g.slice(1)}.png" alt="">`);
  for(const ac of a.accessories){if(ac==='a6')continue;out.push(`<img class="qa-layer qa-accessory qa-${ac}" src="avatar/aligned/accessory-${ac.slice(1)}.png" alt="">`)}
  return out.join('');
}
function quizAvatarMarkup(a={},extra=''){return `<span class="quiz-avatar-fit ${extra}">${quizAvatarLayers(a)}</span>`}
function openQuizFeedback(){
  document.querySelector('.quiz-feedback-layer')?.remove();
  const layer=document.createElement('div');layer.className='quiz-feedback-layer';layer.innerHTML=`<section class="quiz-feedback-card" role="dialog" aria-modal="true"><header><h2>의견 보내기</h2><button type="button" class="qf-close" aria-label="닫기">×</button></header><p class="qf-note">교육용 퀴즈와 관련된 오류나 요청사항을 본사에 전달할 수 있어요.</p><label><span>카테고리</span><select id="qf-category"><option value="error">오류수정</option><option value="quiz">퀴즈 요청 및 수정</option><option value="other">기타</option></select></label><label><span>제목</span><input id="qf-title" maxlength="80" placeholder="내용을 간단히 적어주세요"></label><label><span>자세한 내용</span><textarea id="qf-detail" maxlength="1000" placeholder="오류 위치나 필요한 수정 내용을 자세히 적어주세요."></textarea></label><p id="qf-error" class="qf-error"></p><footer><button type="button" class="qf-cancel">취소</button><button type="button" class="qf-send">보내기</button></footer></section>`;document.body.append(layer);
  const close=()=>layer.remove();layer.querySelector('.qf-close').onclick=close;layer.querySelector('.qf-cancel').onclick=close;layer.onclick=e=>{if(e.target===layer)close()};
  layer.querySelector('.qf-send').onclick=async()=>{const cat=layer.querySelector('#qf-category').value,title=layer.querySelector('#qf-title').value.trim(),detail=layer.querySelector('#qf-detail').value.trim(),err=layer.querySelector('#qf-error'),btn=layer.querySelector('.qf-send');if(!title||!detail){err.textContent='제목과 자세한 내용을 입력해 주세요.';return}btn.disabled=true;btn.textContent='보내는 중…';try{await rpc('submit_store_request',{p_token:session().token,p_category:cat,p_title:title,p_details:detail});close();window.uiAlert?uiAlert('의견을 보냈습니다.','전송 완료'):alert('의견을 보냈습니다.')}catch(e){err.textContent=e.message;btn.disabled=false;btn.textContent='보내기'}};
}
