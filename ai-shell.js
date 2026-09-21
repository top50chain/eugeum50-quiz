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

  function guideOverlay(target,title,desc,{nextText='다음',onNext=null,requireClick=false,onTargetClick=null}={}){
    document.querySelector('.shell-guide-tour')?.remove();
    const layer=document.createElement('div');layer.className='shell-guide-tour';
    layer.innerHTML='<div class="guide-backdrop"></div><div class="guide-hole"></div><section class="guide-card"><div class="guide-step"></div><h3></h3><p></p><div class="guide-actions"><button type="button" class="guide-skip">가이드 종료</button><button type="button" class="guide-next"></button></div></section>';
    document.body.append(layer);
    const hole=layer.querySelector('.guide-hole'),card=layer.querySelector('.guide-card'),next=layer.querySelector('.guide-next');
    layer.querySelector('h3').textContent=title;layer.querySelector('p').textContent=desc;next.textContent=nextText;
    const place=()=>{const el=typeof target==='string'?document.querySelector(target):target;if(!el){hole.style.display='none';card.style.left='16px';card.style.top='100px';return null}el.scrollIntoView?.({block:'center',behavior:'auto'});const r=el.getBoundingClientRect();hole.style.display='block';hole.style.cssText=`display:block;left:${Math.max(6,r.left-8)}px;top:${Math.max(6,r.top-8)}px;width:${Math.min(innerWidth-12,r.width+16)}px;height:${r.height+16}px`;const cardW=Math.min(310,innerWidth-32);card.style.width=cardW+'px';card.style.left=Math.max(16,Math.min(innerWidth-cardW-16,r.left))+'px';const below=r.bottom+18;card.style.top=(below+220<innerHeight?below:Math.max(16,r.top-220))+'px';return el};
    let el=place();
    const close=()=>{layer.remove();};layer.querySelector('.guide-skip').onclick=()=>{sessionStorage.removeItem('eutteum50:ai-guide-step');localStorage.setItem('eutteum50:ai-guide-seen','1');close()};
    if(requireClick){next.textContent='버튼을 눌러보세요';next.disabled=true;if(el){const fn=()=>{onTargetClick?.();close();el.removeEventListener('click',fn,true)};el.addEventListener('click',fn,true)}}else next.onclick=()=>{close();onNext?.()};
    addEventListener('resize',place,{once:true,passive:true});
    return {layer,close};
  }
  function runGuideStep(step){
    const path=location.pathname.split('/').pop()||'ai-home.html';
    if(path==='ai-home.html' && (!step||step==='home-product')){
      sessionStorage.setItem('eutteum50:ai-guide-step','home-product');
      guideOverlay('.art-stage .hit[onclick*="product.html"]','제품 홍보글 만들기','먼저 제품 홍보글 만들기를 눌러보세요. 실제 제품 검색 화면으로 이동해서 다음 기능을 이어서 설명할게요.',{requireClick:true,onTargetClick:()=>sessionStorage.setItem('eutteum50:ai-guide-step','product-search')});return;
    }
    if(path==='product.html' && step==='product-search'){
      guideOverlay('#query','제품 검색','홍보할 제품명을 입력하는 곳이에요. 제품명 일부만 입력해도 검색할 수 있어요.',{nextText:'다음',onNext:()=>{sessionStorage.setItem('eutteum50:ai-guide-step','product-find');runGuideStep('product-find')}});return;
    }
    if(path==='product.html' && step==='product-find'){
      guideOverlay('#findProduct','제품 찾기','검색 버튼을 누르면 등록된 제품이 아래에 표시돼요. 제품을 고른 뒤 채널·목적·톤을 선택하고 AI 홍보글을 만들 수 있어요.',{nextText:'보관함 보기',onNext:()=>{sessionStorage.setItem('eutteum50:ai-guide-step','home-archive');location.href='ai-home.html'}});return;
    }
    if(path==='ai-home.html' && step==='home-archive'){
      guideOverlay('button[data-go="archive.html"]','보관함','만든 홍보글은 보관함에 저장돼요. 보관함 버튼을 직접 눌러 저장된 콘텐츠 화면을 확인해보세요.',{requireClick:true,onTargetClick:()=>sessionStorage.setItem('eutteum50:ai-guide-step','archive-page')});return;
    }
    if(path==='archive.html' && step==='archive-page'){
      guideOverlay('main, .art-stage, body','보관함 화면','여기에서 저장한 홍보글을 다시 열고 확인할 수 있어요. 이제 설정 메뉴도 확인해볼게요.',{nextText:'설정 보기',onNext:()=>{sessionStorage.setItem('eutteum50:ai-guide-step','home-settings');location.href='ai-home.html'}});return;
    }
    if(path==='ai-home.html' && step==='home-settings'){
      guideOverlay('button[data-menu="settings"]','설정','설정을 누르면 매장정보, 사용가이드, 의견보내기, 로그아웃 메뉴가 열려요.',{requireClick:true,onTargetClick:()=>{sessionStorage.setItem('eutteum50:ai-guide-step','settings-open');setTimeout(()=>{openMenu('settings');runGuideStep('settings-open')},60)}});return;
    }
    if(path==='ai-home.html' && step==='settings-open'){
      openMenu('settings');
      guideOverlay('.ai-popover.settings','설정 메뉴','매장정보를 수정하거나 사용가이드를 다시 볼 수 있고, 문제가 있으면 의견보내기로 본사에 전달할 수 있어요.',{nextText:'가이드 완료',onNext:()=>{sessionStorage.removeItem('eutteum50:ai-guide-step');localStorage.setItem('eutteum50:ai-guide-seen','1');closeMenus()}});return;
    }
  }
  function showGuide(force=false){
    if(!force && localStorage.getItem('eutteum50:ai-guide-seen')==='1') return;
    sessionStorage.setItem('eutteum50:ai-guide-step','home-product');
    const path=location.pathname.split('/').pop()||'ai-home.html';
    if(path!=='ai-home.html'){location.href='ai-home.html?guide=1';return;}
    runGuideStep('home-product');
  }
  window.showAiGuide=showGuide;
  document.addEventListener('click',async e=>{const goEl=e.target.closest('[data-go]');if(goEl){location.href=goEl.dataset.go;return}const menu=e.target.closest('[data-menu]');if(menu){openMenu(menu.dataset.menu);return}const act=e.target.closest('[data-action]');if(!act)return;closeMenus();header.querySelectorAll('details').forEach(d=>d.open=false);if(act.dataset.action==='store')await storeInfo();else if(act.dataset.action==='guide')showGuide(true);else if(act.dataset.action==='feedback')feedback();else if(act.dataset.action==='logout'){const yes=window.uiConfirm?await window.uiConfirm('로그아웃할까요?','로그아웃'):confirm('로그아웃할까요?');if(yes){localStorage.removeItem(window.SESSION||'eutteum50:portal-session');localStorage.removeItem('eutteum50:private:fc:session');location.href='index.html'}}});

  shade.addEventListener('click',closeMenus);document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenus();document.querySelector('.shell-modal-layer')?.remove();document.querySelector('.shell-guide-tour')?.remove()}});
  const pendingGuide=sessionStorage.getItem('eutteum50:ai-guide-step');
  if(pendingGuide){setTimeout(()=>runGuideStep(pendingGuide),550)}
  else if(document.body.dataset.nav==='home' && localStorage.getItem('eutteum50:ai-guide-seen')!=='1'){setTimeout(()=>showGuide(false),550)}
})();
