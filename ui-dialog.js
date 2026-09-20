(()=>{
  if(window.__EUTTEUM_UI__)return;window.__EUTTEUM_UI__=true;
  const nativeAlert=window.alert.bind(window);
  function card({title='안내',message='',input=false,placeholder='',confirmText='확인',cancelText=''}){
    return new Promise(resolve=>{try{
      const layer=document.createElement('div');layer.className='ui-toast-layer';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');
      layer.innerHTML=`<section class="ui-toast-card"><div class="ui-toast-mark">!</div><strong></strong><p class="ui-toast-text"></p>${input?'<input class="ui-dialog-input" inputmode="numeric" autocomplete="off">':''}<div class="ui-dialog-actions">${cancelText?'<button class="ui-dialog-cancel" type="button"></button>':''}<button class="ui-toast-ok" type="button"></button></div></section>`;
      layer.querySelector('strong').textContent=title;layer.querySelector('.ui-toast-text').textContent=String(message??'');
      const field=layer.querySelector('input');if(field)field.placeholder=placeholder;
      const ok=layer.querySelector('.ui-toast-ok');ok.textContent=confirmText;const cancel=layer.querySelector('.ui-dialog-cancel');if(cancel)cancel.textContent=cancelText;
      const close=v=>{layer.remove();resolve(v)};ok.onclick=()=>close(field?field.value:true);if(cancel)cancel.onclick=()=>close(null);
      layer.onclick=e=>{if(e.target===layer&&cancel)close(null)};if(field)field.onkeydown=e=>{if(e.key==='Enter')ok.click()};
      document.body.append(layer);requestAnimationFrame(()=>field?field.focus():ok.focus());
    }catch(e){nativeAlert(String(message??''));resolve(input?'':true)}})
  }
  window.uiAlert=(message,title='안내')=>card({title,message});
  window.uiConfirm=(message,title='확인')=>card({title,message,confirmText:'확인',cancelText:'취소'});
  window.uiPrompt=(message,{title='입력',placeholder='숫자를 입력하세요'}={})=>card({title,message,input:true,placeholder,confirmText:'확인',cancelText:'취소'});
  window.alert=message=>{void window.uiAlert(message)};
})();
