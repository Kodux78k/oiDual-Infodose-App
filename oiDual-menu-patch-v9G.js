<style>
/* --- 1. SEU ESTILO ORIGINAL (MANTIDO) --- */
#aiConfigBtn {
  position: fixed;
  top: 20px;
  right: 66px;
  z-index: 1000000;
  background: var(--bg, #111); /* fallback se --bg não existir */
  color: var(--text, #eee);    /* fallback se --text não existir */
  border: 1px solid rgba(0,255,255,0.12);
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 18px rgba(0,255,255,0.06);
}

/* --- 2. ESTILOS DO MODAL (CLEAN & MOBILE) --- */
:root {
  --k-panel: rgba(15,15,15,0.96);
  --k-border: rgba(255,255,255,0.08);
  --k-accent: #00ffff;
  --k-dim: #555555;
}

#aiConfigModal {
  position: fixed; inset: 0; z-index: 1000001;
  display: none; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
}

#aiConfigModal .panel {
  width: 800px; max-width: 95%; max-height: 90vh;
  background: var(--k-panel); color: #ccc;
  border: 1px solid var(--k-border); border-radius: 12px;
  display: flex; flex-direction: column; overflow: hidden;
  font-family: monospace; font-size: 13px;
  box-shadow: 0 20px 50px #000;
}

/* Layout Interno */
.p-head { padding: 12px 16px; display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--k-border); }
.p-body { padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 15px; }
.p-foot { padding: 12px 16px; display: flex; gap: 10px; border-top: 1px solid var(--k-border); background: rgba(0,0,0,0.2); flex-wrap: wrap; }

/* Inputs & Elementos */
input, textarea {
  background: rgba(0,0,0,0.3); border: 1px solid var(--k-border);
  color: #fff; padding: 10px; border-radius: 6px; width: 100%;
  box-sizing: border-box; font-family: inherit; margin-bottom: 5px;
}
input:focus, textarea:focus { border-color: var(--k-accent); outline:none; }
.g-row { display: flex; gap: 8px; }

/* Botões Internos */
.btn { 
  background: rgba(255,255,255,0.05); border: 1px solid var(--k-border); 
  color: #ccc; padding: 8px 12px; border-radius: 6px; cursor: pointer; flex: 1;
}
.btn:hover { background: rgba(255,255,255,0.1); }
.btn-primary { background: var(--k-accent); color: #000; border: none; font-weight: bold; }
.btn-close { background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }

/* Symbols List */
.sym-item { display: flex; gap: 5px; align-items: center; background: rgba(255,255,255,0.02); padding: 5px; border-radius: 6px; }
.drag-handle { cursor: grab; padding: 0 8px; color: var(--k-dim); }
.btn-del { background:none; border:none; color:#ff5555; cursor:pointer; padding:0 8px; }

/* Iframe Inline */
#iframeBox { display: none; height: 300px; border: 1px solid var(--k-border); margin-top: 8px; background: #fff; }
#iframeBox iframe { width: 100%; height: 100%; border: none; }

/* Mobile Tweaks */
@media (max-width: 600px) {
  #aiConfigModal .panel { width: 100%; height: 100%; border-radius: 0; border: none; }
  .g-row { flex-direction: column; }
  .p-foot { flex-direction: column; }
  .btn { padding: 12px; } /* Área de toque maior */
}
</style>

<button id="aiConfigBtn" title="Configurar IA">🤖</button>

<div id="aiConfigModal">
  <div class="panel" id="aiPanel">
    <div class="p-head">
      <strong>Painel KODUX</strong>
      <button id="aiClose" class="btn-close">✕</button>
    </div>

    <div class="p-body">
      <div>
        <div class="g-row" style="margin-bottom:8px; justify-content:space-between;">
          <span>Botões/Links</span>
          <div style="display:flex; gap:5px;">
             <button id="addSymBtn" class="btn" style="flex:none; padding:4px 10px;">+</button>
             <button id="resetSymBtn" class="btn" style="flex:none; padding:4px 10px;">♻</button>
          </div>
        </div>
        <div id="symList"></div>
      </div>

      <div style="border-top:1px dashed var(--k-border); padding-top:10px;">
        <div class="g-row" style="margin-bottom:5px; justify-content:space-between;">
           <span>Code Map</span>
           <button id="validateCodeBtn" class="btn" style="flex:none; width:auto;">Validar & Preview</button>
        </div>
        <textarea id="codeMapArea" rows="4" placeholder='{"NOME": "url.html"}'></textarea>
        <div id="codeMapPreview" style="display:flex; flex-wrap:wrap; gap:5px; margin-top:5px;"></div>
        <div id="iframeBox">
          <div style="background:#222; text-align:right; padding:2px;"><button id="closeIframe" style="color:#fff; background:none; border:none;">✕</button></div>
          <iframe id="previewFrame"></iframe>
        </div>
      </div>

      <div style="border-top:1px dashed var(--k-border); padding-top:10px;">
        <div class="g-row">
          <input id="roleSystemField" placeholder="Role System..." />
          <button id="embedToggle" class="btn" style="flex:0 0 auto;">Injetar</button>
        </div>
        <div class="g-row">
          <input id="skField" type="password" placeholder="SK Key" />
          <input id="modelField" placeholder="Model ID" />
        </div>
        <div class="g-row">
          <input id="apiUrlField" placeholder="API URL" />
          <input id="tempField" placeholder="0.7" style="flex:0 0 60px;" />
        </div>
      </div>
    </div>

    <div class="p-foot">
      <div class="g-row" style="flex:1;">
        <button id="exportBtn" class="btn">Exp ⬇</button>
        <button id="importBtn" class="btn">Imp ⬆</button>
        <input id="importFile" type="file" style="display:none" />
      </div>
      <div class="g-row" style="flex:1;">
        <button id="applyBtn" class="btn">Aplicar</button>
        <button id="saveBtn" class="btn btn-primary">Salvar</button>
      </div>
    </div>
  </div>
</div>

<script>
(function(){
  const $ = (id) => document.getElementById(id);
  const els = {
    btn: $('aiConfigBtn'), modal: $('aiConfigModal'), close: $('aiClose'),
    list: $('symList'), add: $('addSymBtn'), reset: $('resetSymBtn'),
    map: $('codeMapArea'), preview: $('codeMapPreview'), valid: $('validateCodeBtn'),
    iframeBox: $('iframeBox'), iframe: $('previewFrame'), closeFrame: $('closeIframe'),
    role: $('roleSystemField'), sk: $('skField'), model: $('modelField'),
    api: $('apiUrlField'), temp: $('tempField'), embed: $('embedToggle'),
    save: $('saveBtn'), apply: $('applyBtn'), exp: $('exportBtn'), imp: $('importBtn'), file: $('importFile')
  };

  const KEYS = { SYM:'INFODOSE_SYMBOLS', MAP:'INFODOSE_CODE_MAP', SK:'INFODOSE_SK', MDL:'INFODOSE_MODEL', API:'INFODOSE_API_URL', TMP:'INFODOSE_TEMP' };
  const safeJson = (s) => { try{ return JSON.parse(s) }catch{ return null } };
  
  // --- SYMBOLS ---
  function renderSyms(arr){
    els.list.innerHTML = '';
    arr.forEach((it,i) => {
      const d = document.createElement('div'); d.className = 'sym-item';
      d.draggable = true;
      d.innerHTML = `
        <span class="drag-handle">≡</span>
        <input value="${it.label||''}" data-i="${i}" data-k="label" placeholder="Label">
        <input value="${it.url||''}" data-i="${i}" data-k="url" placeholder="URL">
        <button class="btn-del" data-i="${i}">✕</button>`;
      
      // Drag Logic Minimal
      d.ondragstart = e => e.dataTransfer.setData('i', i);
      d.ondragover = e => e.preventDefault();
      d.ondrop = e => {
        e.preventDefault();
        const from = e.dataTransfer.getData('i');
        const list = safeJson(localStorage.getItem(KEYS.SYM))||[];
        list.splice(i, 0, list.splice(from, 1)[0]);
        saveSyms(list);
      };
      els.list.appendChild(d);
    });
  }
  function saveSyms(a){ localStorage.setItem(KEYS.SYM, JSON.stringify(a)); renderSyms(a); }
  function getDom(){ 
    const b = document.querySelectorAll('.symbol-bar button');
    return Array.from(b).map(x=>({label:x.textContent, url:x.dataset.href||''})); 
  }

  // --- ACTIONS ---
  els.btn.onclick = () => {
    els.modal.style.display = 'flex';
    const s = safeJson(localStorage.getItem(KEYS.SYM)) || getDom();
    renderSyms(s);
    els.map.value = JSON.stringify(safeJson(localStorage.getItem(KEYS.MAP))||window.CODE_MAP||{}, null, 2);
    els.sk.value = localStorage.getItem(KEYS.SK)||'';
    els.model.value = localStorage.getItem(KEYS.MDL)||'';
    els.api.value = localStorage.getItem(KEYS.API)||'';
    els.role.value = sessionStorage.getItem('ROLE')||'';
  };
  els.close.onclick = () => els.modal.style.display = 'none';
  
  // Sym Actions
  els.add.onclick = () => { const l=safeJson(localStorage.getItem(KEYS.SYM))||[]; l.push({label:'New',url:''}); saveSyms(l); };
  els.reset.onclick = () => saveSyms(getDom());
  els.list.onclick = e => { if(e.target.classList.contains('btn-del')) {
     const l=safeJson(localStorage.getItem(KEYS.SYM)); l.splice(e.target.dataset.i,1); saveSyms(l);
  }};
  els.list.oninput = e => {
     if(e.target.tagName==='INPUT'){
       const l=safeJson(localStorage.getItem(KEYS.SYM)); l[e.target.dataset.i][e.target.dataset.k]=e.target.value;
       localStorage.setItem(KEYS.SYM, JSON.stringify(l));
     }
  };

  // Preview Logic
  els.valid.onclick = () => {
    const map = safeJson(els.map.value);
    els.preview.innerHTML = '';
    if(!map) return alert('JSON Inválido');
    Object.entries(map).forEach(([k,v]) => {
      const b = document.createElement('button');
      b.className = 'btn'; b.style.flex='none'; b.textContent = k;
      b.onclick = () => { els.iframeBox.style.display='block'; els.iframe.src=v; };
      els.preview.appendChild(b);
    });
  };
  els.closeFrame.onclick = () => { els.iframeBox.style.display='none'; els.iframe.src=''; };

  // Save/Apply
  const commit = (persist) => {
    const syms = safeJson(localStorage.getItem(KEYS.SYM))||[];
    const bar = document.querySelector('.symbol-bar');
    if(bar) {
      bar.innerHTML = '';
      syms.forEach(s => {
         const b = document.createElement('button'); b.className='symbol-button';
         b.textContent = s.label; b.onclick = () => window.open(s.url,'_blank'); 
         bar.appendChild(b);
      });
    }
    if(persist){
      localStorage.setItem(KEYS.MAP, els.map.value);
      localStorage.setItem(KEYS.SK, els.sk.value);
      localStorage.setItem(KEYS.MDL, els.model.value);
      localStorage.setItem(KEYS.API, els.api.value);
      sessionStorage.setItem('ROLE', els.role.value);
      alert('Salvo!');
    }
  };
  els.apply.onclick = () => commit(false);
  els.save.onclick = () => commit(true);
  
  // Import/Export
  els.exp.onclick = () => {
    const d = { sym:safeJson(localStorage.getItem(KEYS.SYM)), map:safeJson(els.map.value) };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'json'}));
    a.download = 'cfg.json'; a.click();
  };
  els.imp.onclick = () => els.file.click();
  els.file.onchange = e => {
    const r = new FileReader(); r.onload = ev => {
       const d = safeJson(ev.target.result);
       if(d && d.sym) localStorage.setItem(KEYS.SYM, JSON.stringify(d.sym));
       if(d && d.map) els.map.value = JSON.stringify(d.map);
       alert('Importado. Reabra o painel.');
    };
    r.readAsText(e.target.files[0]);
  };
})();
</script>
