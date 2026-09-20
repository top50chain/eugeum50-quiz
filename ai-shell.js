(function(){
  if(new URLSearchParams(location.search).get('admin')==='1')return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.body.classList.add('has-ai-shell');
  const header=document.createElement('header');header.className='ai-fixed-header';header.innerHTML=`<a class="shell-logo" href="service.html"><img src="eutteum50-logo.png" alt="으뜸50안경 서비스 선택 홈"></a><div class="shell-top-actions"><details class="shell-service"><summary>AI 콘텐츠 <i></i></summary><a href="profile-list.html?next=quiz">교육용 퀴즈 <i></i></a></details><details class="shell-store"><summary><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8m0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg><span>${esc(window.storeName?.()||'지점명')}</span><i></i></summary><div><button data-action="store">내 매장 정보</button><button data-action="logout">로그아웃</button></div></details></div>`;
  if(document.body.dataset.shell!=='dialog-only')document.body.append(header);
  document.addEventListener('click',e=>{header.querySelectorAll('details').forEach(d=>{if(!d.contains(e.target))d.open=false})});
  const nav=document.createElement('nav');nav.className='ai-bottom-nav';nav.setAttribute('aria-label','AI 콘텐츠 하단 메뉴');
  nav.innerHTML='<button data-go="ai-home.html" aria-label="홈"><span>홈</span></button><button data-menu="create" aria-label="글 생성"><span>글 생성</span></button><button data-go="archive.html" aria-label="보관함"><span>보관함</span></button><button data-menu="settings" aria-label="설정"><span>설정</span></button>';
  const shade=document.createElement('div');shade.className='shell-backdrop';
  const create=document.createElement('div');create.className='ai-popover create';create.innerHTML='<button data-go="product.html"><img class="pop-icon" src="assets/ui-parts/menu-product.png" alt=""><span>제품 홍보글 만들기</span><span class="chev">›</span></button><button data-go="ai-tools.html?open=idea"><img class="pop-icon" src="assets/ui-parts/menu-idea.png" alt=""><span>홍보 아이디어 찾기</span><span class="chev">›</span></button><button data-go="ai-tools.html?open=monthly"><img class="pop-icon" src="assets/ui-parts/menu-monthly.png" alt=""><span>월간 문자·알림톡</span><span class="chev">›</span></button><button data-go="ai-tools.html?open=shared"><img class="pop-icon" src="assets/ui-parts/menu-shared.png" alt=""><span>공유 홍보글</span><span class="chev">›</span></button>';
  const settings=document.createElement('div');settings.className='ai-popover settings';settings.innerHTML='<button data-action="store"><img class="pop-icon" src="assets/ui-parts/menu-store.png" alt=""><span>매장정보</span><span class="chev">›</span></button><button data-action="guide"><img class="pop-icon" src="assets/ui-parts/menu-guide.png" alt=""><span>사용가이드</span><span class="chev">›</span></button><button data-action="feedback"><img class="pop-icon" src="assets/ui-parts/menu-feedback.png" alt=""><span>의견보내기</span><span class="chev">›</span></button><button data-action="logout"><img class="pop-icon" src="assets/ui-parts/menu-logout.png" alt=""><span>로그아웃</span><span class="chev">›</span></button>';
  document.body.append(shade,create,settings,nav);
  const closeMenus=()=>{create.classList.remove('open');settings.classList.remove('open');shade.classList.remove('open');nav.classList.remove('menu-create','menu-settings')};
  const openMenu=which=>{const target=which==='create'?create:settings,other=which==='create'?settings:create,was=target.classList.contains('open');other.classList.remove('open');target.classList.toggle('open',!was);shade.classList.toggle('open',!was);nav.classList.toggle('menu-create',!was&&which==='create');nav.classList.toggle('menu-settings',!was&&which==='settings')};
  function modal(title,body,saveText='저장'){
    document.querySelector('.shell-modal-layer')?.remove();const layer=document.createElement('div');layer.className='shell-modal-layer';layer.innerHTML=`<section class="shell-modal" role="dialog" aria-modal="true"><header class="shell-modal-head"><h2>${esc(title)}</h2><button class="shell-modal-close" type="button" aria-label="닫기">×</button></header><div class="shell-modal-body">${body}</div><footer class="shell-modal-foot"><button class="shell-cancel" type="button">닫기</button><button class="shell-save" type="button">${esc(saveText)}</button></footer></section>`;document.body.append(layer);const close=()=>layer.remove();layer.querySelector('.shell-modal-close').onclick=close;layer.querySelector('.shell-cancel').onclick=close;layer.onclick=e=>{if(e.target===layer)close()};return{layer,close,save:layer.querySelector('.shell-save')};
  }
  async function storeInfo(){
    let s={...(window.session?.()?.store||{})};try{const got=window.scalar(await window.rpc('get_my_store',{p_token:window.session().token}));if(got&&typeof got==='object')s={...s,...got}}catch(e){}
    const name=s.name||s.full_name||s.store_name||'로그인 매장';
    const m=modal('내 매장 정보',`<p class="shell-modal-note">이 정보는 AI 홍보글을 만들 때 자동으로 참고합니다. 매장명은 본사에서 관리합니다.</p><div class="shell-form-grid"><label class="shell-field"><span>매장명</span><input value="${esc(name)}" disabled></label><label class="shell-field"><span>지역</span><input id="sm-region" value="${esc(s.region||'')}"></label><label class="shell-field wide"><span>주소</span><input id="sm-addr" value="${esc(s.addr||s.address||'')}"></label><label class="shell-field"><span>영업시간</span><input id="sm-hours" value="${esc(s.hours||'')}"></label><label class="shell-field"><span>주차</span><select id="sm-parking"><option value="가능" ${s.parking==='가능'?'selected':''}>가능</option><option value="불가능" ${s.parking!=='가능'?'selected':''}>불가능</option></select></label><label class="shell-field"><span>매장전화</span><input id="sm-phone" value="${esc(s.phone||'')}"></label><label class="shell-field"><span>매장 핸드폰</span><input id="sm-mobile" value="${esc(s.mobile||'')}"></label><label class="shell-field wide"><span>인스타그램 계정</span><input id="sm-insta" value="${esc(s.insta||'')}" placeholder="@아이디"></label><label class="shell-field wide"><span>매장 특징·추가 안내</span><textarea id="sm-extra" placeholder="예: 3번 출구 도보 1분, 건물 주차 2시간 무료">${esc(s.extra||'')}</textarea></label></div><div id="sm-error" class="shell-modal-error" hidden></div>`);
    m.save.onclick=async()=>{const v=id=>m.layer.querySelector(id).value.trim(),patch={region:v('#sm-region'),addr:v('#sm-addr'),hours:v('#sm-hours'),parking:v('#sm-parking'),phone:v('#sm-phone'),mobile:v('#sm-mobile'),insta:v('#sm-insta'),extra:v('#sm-extra')};m.save.disabled=true;m.save.textContent='저장 중…';try{const saved=window.scalar(await window.rpc('update_my_store',{p_token:window.session().token,p_region:patch.region,p_addr:patch.addr,p_phone:patch.phone,p_mobile:patch.mobile,p_hours:patch.hours,p_insta:patch.insta,p_parking:patch.parking,p_extra:patch.extra,p_current_password:null,p_new_password:null}))||{...s,...patch};const ses=window.session();localStorage.setItem(window.SESSION||'eutteum50:portal-session',JSON.stringify({...ses,store:{...(ses.store||{}),...saved,...patch}}));document.querySelectorAll('#headerStore,#storeMenu').forEach(el=>el.textContent=saved.name||saved.full_name||name);m.close();window.uiAlert?.('매장 정보를 저장했습니다. 다음 AI 글부터 반영됩니다.','저장 완료')}catch(e){const box=m.layer.querySelector('#sm-error');box.textContent=e.message;box.hidden=false;m.save.disabled=false;m.save.textContent='저장'}};
  }
  window.openStoreInfo=storeInfo;
  function feedback(){
    const m=modal('의견 보내기','<p class="shell-modal-note">보내주신 내용은 본사에서 확인하고 서비스 개선에 참고합니다.</p><div class="shell-form-grid"><label class="shell-field wide"><span>의견 종류</span><select id="sf-category"><option value="feature">기능 개선</option><option value="product">제품 추가·수정</option><option value="content">추천 주제·콘텐츠</option><option value="error">오류 신고</option><option value="other">기타</option></select></label><label class="shell-field wide"><span>제목</span><input id="sf-title" maxlength="80" placeholder="내용을 간단히 적어주세요"></label><label class="shell-field wide"><span>자세한 내용</span><textarea id="sf-detail" maxlength="1000" placeholder="필요한 기능이나 개선할 내용을 자세히 적어주세요."></textarea></label></div><div id="sf-error" class="shell-modal-error" hidden></div>','보내기');
    m.save.onclick=async()=>{const cat=m.layer.querySelector('#sf-category').value,title=m.layer.querySelector('#sf-title').value.trim(),detail=m.layer.querySelector('#sf-detail').value.trim(),err=m.layer.querySelector('#sf-error');if(!title||!detail){err.textContent='제목과 내용을 모두 입력해 주세요.';err.hidden=false;return}m.save.disabled=true;m.save.textContent='보내는 중…';try{await window.rpc('submit_store_request',{p_token:window.session().token,p_category:cat,p_title:title,p_details:detail});m.close();window.uiAlert?.('본사에 의견을 보냈습니다.','전송 완료')}catch(e){err.textContent=e.message;err.hidden=false;m.save.disabled=false;m.save.textContent='보내기'}};
  }
  window.openFeedback=feedback;

  function showGuide(force=false){
    const key='eutteum50:ai-guide-seen-v2';
    if(!force&&localStorage.getItem(key)==='1') return;
    if(!document.body.dataset.nav||document.body.dataset.nav!=='home'){
      const m=modal('사용가이드','<p class="shell-modal-note">AI 콘텐츠 홈에서 제품 홍보글, 아이디어, 보관함, 설정을 차례대로 안내해드릴게요.</p>','확인');
      m.save.onclick=()=>{ if(!force) localStorage.setItem(key,'1'); m.close(); location.href='ai-home.html?guide=1'; };
      return;
    }
    document.querySelector('.shell-guide-tour')?.remove();
    const steps=[
      {selector:'#guideProduct',title:'1. 제품 홍보글 만들기',desc:'제품을 고르면 매장 홍보에 바로 쓸 수 있는 문구를 만들어요. 제품 특징과 매장 정보를 함께 반영합니다.'},
      {selector:'#guideIdea',title:'2. 홍보 아이디어 찾기',desc:'무슨 내용을 올릴지 막힐 때 사용해요. 주제 아이디어와 실제 홍보 문구까지 이어서 만들 수 있습니다.'},
      {selector:'#guideMonthly',title:'3. 월간 문자·알림톡',desc:'고객에게 보낼 월간 안내 문구를 만들어요. 문자나 알림톡에 맞는 길이와 말투로 작성할 수 있습니다.'},
      {selector:'#guideShared',title:'4. 공유 홍보글',desc:'매장에서 함께 활용할 공통 홍보문구를 확인하거나 작성하는 메뉴예요.'},
      {selector:'#guidePromotions',title:'5. 이달의 프로모션',desc:'현재 본사에서 운영하는 프로모션을 확인하고 홍보에 참고할 수 있어요.'},
      {selector:'button[data-menu="create"]',title:'6. 하단 글 생성',desc:'글 생성 버튼을 누르면 작성 기능이 한 번에 펼쳐집니다.',before:()=>openMenu('create')},
      {selector:'button[data-go="archive.html"]',title:'7. 보관함',desc:'만들어 둔 콘텐츠를 다시 확인하고 필요한 내용을 이어서 사용할 수 있어요.',before:()=>closeMenus()},
      {selector:'button[data-menu="settings"]',title:'8. 설정',desc:'매장정보 수정, 사용가이드 다시 보기, 의견 보내기, 로그아웃을 사용할 수 있어요.',before:()=>openMenu('settings')}
    ];
    const layer=document.createElement('div');
    layer.className='shell-guide-tour';
    layer.innerHTML='<div class="guide-backdrop"></div><div class="guide-hole"></div><section class="guide-card"><div class="guide-step"></div><h3></h3><p></p><div class="guide-actions"><button type="button" class="guide-skip">건너뛰기</button><button type="button" class="guide-next">다음</button></div><label class="guide-check"><input type="checkbox" checked> 다음부터 자동으로 닫기</label></section>';
    document.body.append(layer);
    const hole=layer.querySelector('.guide-hole'),card=layer.querySelector('.guide-card'),stepEl=layer.querySelector('.guide-step'),titleEl=layer.querySelector('h3'),descEl=layer.querySelector('p'),nextBtn=layer.querySelector('.guide-next'),skipBtn=layer.querySelector('.guide-skip'),seenCheck=layer.querySelector('input');
    let index=0;
    const close=()=>{closeMenus();layer.remove(); if(seenCheck.checked) localStorage.setItem(key,'1');};
    function paint(){
      closeMenus();
      const step=steps[index];
      step.before?.();
      const target=document.querySelector(step.selector);
      if(!target){ index++; if(index<steps.length) paint(); else close(); return; }
      const r=target.getBoundingClientRect();
      hole.style.cssText=`left:${r.left-8}px;top:${r.top-8}px;width:${r.width+16}px;height:${r.height+16}px`;
      const below=r.bottom+18, above=window.innerHeight-r.top+18;
      const placeBelow=below+220<window.innerHeight || above<220;
      card.style.left=Math.max(16, Math.min(window.innerWidth-316, r.left))+'px';
      card.style.top=(placeBelow ? Math.min(window.innerHeight-210, r.bottom+18) : Math.max(16, r.top-210))+'px';
      stepEl.textContent=`${index+1}/${steps.length}`;
      titleEl.textContent=step.title;
      descEl.textContent=step.desc;
      nextBtn.textContent=index===steps.length-1?'확인':'다음';
    }
    nextBtn.onclick=()=>{ index++; if(index>=steps.length){ close(); return; } paint(); };
    skipBtn.onclick=close;
    window.addEventListener('resize', paint, {passive:true});
    layer.addEventListener('click', e=>{ if(e.target===layer||e.target.classList.contains('guide-backdrop')) close(); });
    paint();
  }
  window.showAiGuide=showGuide;
  document.addEventListener('click',async e=>{const goEl=e.target.closest('[data-go]');if(goEl){location.href=goEl.dataset.go;return}const menu=e.target.closest('[data-menu]');if(menu){openMenu(menu.dataset.menu);return}const act=e.target.closest('[data-action]');if(!act)return;closeMenus();header.querySelectorAll('details').forEach(d=>d.open=false);if(act.dataset.action==='store')await storeInfo();else if(act.dataset.action==='guide')showGuide(true);else if(act.dataset.action==='feedback')feedback();else if(act.dataset.action==='logout'){const yes=window.uiConfirm?await window.uiConfirm('로그아웃할까요?','로그아웃'):confirm('로그아웃할까요?');if(yes){localStorage.removeItem(window.SESSION||'eutteum50:portal-session');localStorage.removeItem('eutteum50:private:fc:session');location.href='index.html'}}});

  const guideStyle=document.createElement('style');guideStyle.textContent=`
  .shell-guide-tour{position:fixed;inset:0;z-index:1200}
  .shell-guide-tour .guide-backdrop{position:absolute;inset:0;background:rgba(13,18,28,.62)}
  .shell-guide-tour .guide-hole{position:fixed;border:2px solid #ff6b25;border-radius:18px;box-shadow:0 0 0 9999px rgba(13,18,28,.62);pointer-events:none;transition:all .18s ease}
  .shell-guide-tour .guide-card{position:fixed;width:min(300px,calc(100vw - 32px));background:#fff;border-radius:20px;padding:18px 18px 16px;box-shadow:0 18px 40px rgba(0,0,0,.2)}
  .shell-guide-tour .guide-step{display:inline-flex;align-items:center;justify-content:center;min-width:50px;height:26px;padding:0 10px;border-radius:999px;background:#fff1e7;color:#ff6b25;font-size:12px;font-weight:800;margin-bottom:10px}
  .shell-guide-tour h3{margin:0 0 8px;font-size:20px;line-height:1.35;color:#24262b}
  .shell-guide-tour p{margin:0;color:#666;font-size:14px;line-height:1.6}
  .shell-guide-tour .guide-actions{display:flex;justify-content:space-between;gap:10px;margin-top:16px}
  .shell-guide-tour .guide-actions button{flex:1;height:42px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;font-weight:800}
  .shell-guide-tour .guide-actions .guide-next{background:#ff6b25;border-color:#ff6b25;color:#fff}
  .shell-guide-tour .guide-check{display:flex;align-items:center;gap:8px;margin-top:12px;color:#777;font-size:12px;font-weight:700}
  `;document.head.append(guideStyle);

  shade.addEventListener('click',closeMenus);document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenus();document.querySelector('.shell-modal-layer')?.remove();document.querySelector('.shell-guide-tour')?.remove()}}); if(document.body.dataset.nav==='home' || new URLSearchParams(location.search).get('guide')==='1') setTimeout(()=>showGuide(false), 250);
})();
