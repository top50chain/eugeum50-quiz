/* 서버 문제 테이블이 아직 연결되지 않은 환경에서도 기본 문제은행을 보여준다. */
(()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='ui-system.css';document.head.append(l);const s=document.createElement('script');s.src='ui-dialog.js';document.head.append(s)})();
(() => {
  const original = window.loadQuestions;
  window.loadQuestions = async function loadQuestionsWithFallback(){
    const box = document.querySelector('#questionRows');
    if (box) box.innerHTML = '<div class="empty">문제를 불러오는 중…</div>';
    try {
      await original();
      if (Array.isArray(window.questions) && window.questions.length) return;
    } catch (error) {
      console.warn(error);
    }
    questions = (window.QUIZ_ADMIN_BANK || []).map((item, index) => ({
      ...item,
      source_key: item.source_key || `basic-${index + 1}`,
      active: item.active !== false
    }));
    fillTopics();
    paintQuestions();
    if (box) {
      const note = document.createElement('div');
      note.className = 'muted';
      note.style.marginBottom = '12px';
      note.textContent = '기본 문제은행을 표시하고 있습니다. 서버 설정 후 수정·저장 내용이 전체 매장에 반영됩니다.';
      box.prepend(note);
    }
  };
})();
