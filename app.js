import {validate,sourceURL,addHighlight,markdown,parseBackup,merge,MAX_FILE} from './core.js';
import {KEY,read,write,recover} from './storage.js';
const $=id=>document.getElementById(id),say=message=>I18n.text($('status'),message);
let library=null,active=null,busy=false,recoveryRaw=undefined;
const article=()=>library?.articles.find(a=>a.id===active);
function draft(){return ['title','url','body'].some(id=>$(id).value)||[...document.querySelectorAll('.note textarea')].some(e=>e.value!==e.dataset.saved);}
function leave(){return !draft()||confirm(I18n.t('Discard unsaved text and notes?'));}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function list(){const query=$('search').value.trim().toLocaleLowerCase(),items=(library?.articles||[]).filter(a=>[a.title,a.body,...a.highlights.map(h=>h.note)].join(' ').toLocaleLowerCase().includes(query));
 $('library').replaceChildren(...items.map(a=>{const li=document.createElement('li'),button=document.createElement('button');button.textContent=a.title;button.setAttribute('aria-current',String(a.id===active));button.onclick=()=>{if(!busy&&leave()){resetDraft();active=a.id;render();}};li.append(button);return li;}));
 I18n.text($('count'),'{0} articles',{0:items.length});$('empty').hidden=!!items.length;
}
function resetDraft(){$('article-form').reset();$('notes').replaceChildren();}
function render(){list();const a=article();$('create').hidden=!!a;$('reading').hidden=!a;$('save').disabled=!library||busy;$('example').disabled=!library||busy;if(!a)return;
 $('article-title').textContent=a.title;$('source').hidden=!a.url;$('source').textContent=a.url;$('source').href=a.url||'#';
 const parts=[];let offset=0;for(const h of a.highlights){parts.push(document.createTextNode(a.body.slice(offset,h.start)));const mark=document.createElement('mark');mark.textContent=h.quote;parts.push(mark);offset=h.end;}parts.push(document.createTextNode(a.body.slice(offset)));$('text').replaceChildren(...parts);
 const drafts=new Map([...document.querySelectorAll('.note textarea')].map(el=>[el.dataset.id,el.value]));
 $('notes').replaceChildren(...a.highlights.map(h=>{const wrap=document.createElement('div'),quote=document.createElement('blockquote'),label=document.createElement('label'),input=document.createElement('textarea'),save=document.createElement('button'),remove=document.createElement('button'),row=document.createElement('div');wrap.className='note';quote.textContent=h.quote;I18n.text(label,'Your note');input.rows=3;input.maxLength=4000;input.value=drafts.has(h.id)?drafts.get(h.id):h.note;input.dataset.saved=h.note;input.dataset.id=h.id;label.append(input);I18n.text(save,'Save note');I18n.text(remove,'Remove highlight');remove.className='quiet';row.className='row';
 save.onclick=()=>change(s=>({...s,articles:s.articles.map(x=>x.id===active?{...x,highlights:x.highlights.map(y=>y.id===h.id?{...y,note:input.value}:y)}:x)}),'Note saved.');
 remove.onclick=()=>{if(confirm(I18n.t('Remove this highlight and its note?')))change(s=>({...s,articles:s.articles.map(x=>x.id===active?{...x,highlights:x.highlights.filter(y=>y.id!==h.id)}:x)}),'Highlight removed.');};
 row.append(save,remove);wrap.append(quote,label,row);return wrap;}));$('no-highlights').hidden=!!a.highlights.length;
}
async function change(fn,message,after=()=>{}){if(!library||busy)return;busy=true;try{library=await write(library.revision,fn);after();render();say(message);}catch(e){say(e.message);}finally{busy=false;$('save').disabled=!library;$('example').disabled=!library;}}
function load(){try{library=read();recoveryRaw=undefined;active=null;resetDraft();render();say('Library loaded. Your reading stays here.');}catch(e){library=null;active=null;render();say(e.message);}}
$('article-form').onsubmit=e=>{e.preventDefault();try{const a=validate({version:1,articles:[{id:crypto.randomUUID(),title:$('title').value,url:sourceURL($('url').value.trim()),body:$('body').value,highlights:[]}]}).articles[0];change(s=>({...s,articles:[...s.articles,a]}),'Article saved.',()=>{resetDraft();active=a.id;});}catch(err){say(err.message);}};
$('new').onclick=()=>{if(!busy&&leave()){resetDraft();active=null;render();$('title').focus();}};
$('search').oninput=list;
$('highlight').onmousedown=e=>e.preventDefault();
$('highlight').onclick=()=>{if(busy||!article())return;try{const selection=window.getSelection();if(!selection?.rangeCount||selection.isCollapsed)throw Error('Select a passage inside the article first.');const range=selection.getRangeAt(0),reader=$('text');if(!reader.contains(range.startContainer)||!reader.contains(range.endContainer))throw Error('Select a passage inside the article first.');const prefix=document.createRange();prefix.selectNodeContents(reader);prefix.setEnd(range.startContainer,range.startOffset);const start=prefix.toString().length,end=start+range.toString().length,id=crypto.randomUUID();change(s=>({...s,articles:s.articles.map(a=>a.id===active?addHighlight(a,start,end,id):a)}),'Highlight saved.',()=>selection.removeAllRanges());}catch(e){say(e.message);}};
$('delete').onclick=()=>{if(!busy&&confirm(I18n.t('Delete this article and all its highlights? Export it first to keep a copy.')))change(s=>({...s,articles:s.articles.filter(a=>a.id!==active)}),'Article deleted.',()=>{active=null;resetDraft();});};
$('export').onclick=()=>{if(!article())return;try{const a=article();download((a.title.replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,70)||'article')+'.md',markdown(a),'text/markdown');say('Markdown exported. Unsaved notes are not included.');}catch(e){say(e.message);}};
$('backup').onclick=()=>{try{download('margin-ferry-backup.json',JSON.stringify(validate(read()),null,2),'application/json');say('Backup exported. Unsaved drafts are not included.');}catch(e){say(e.message);}};
$('raw').onclick=()=>{try{recoveryRaw=localStorage.getItem(KEY);download('margin-ferry-recovery.txt',recoveryRaw??'','text/plain');say('Recovery data exported without changes.');}catch(e){say(e.message);}};
$('reload').onclick=()=>{if(!busy&&leave())load();};
$('import').onchange=async()=>{if(busy)return;const file=$('import').files[0];$('import').value='';if(!file)return;busy=true;try{if(file.size>MAX_FILE)throw Error('Backup exceeds 4 MB.');const incoming=parseBackup(await file.text()),replace=$('mode').value==='replace';if(!leave())return;if(replace&&!confirm(I18n.t('Replace the entire library? Export a backup first.')))return;
 if(!library){if(!replace||recoveryRaw===undefined)throw Error('Export recovery data, then use replace mode with a valid backup.');library=await recover(recoveryRaw,incoming);}else library=await write(library.revision,s=>replace?incoming:merge(s,incoming));active=null;resetDraft();render();say('Library imported.');}catch(e){say(e.message);}finally{busy=false;$('save').disabled=!library;$('example').disabled=!library;}};
$('example').onclick=()=>{if(!busy&&leave()){const a={id:crypto.randomUUID(),title:'The art of noticing',url:'',body:'A good question changes the way we read. Instead of collecting every sentence, look for the one that makes you pause.\n\nA highlight is a starting point. Add a note about why it matters, where you disagree, or what you want to try next.\n\nKeep the original words close to your own thoughts. When you return later, the conversation can continue.',highlights:[]};change(s=>({...s,articles:[...s.articles,a]}),'Sample article added.',()=>{resetDraft();active=a.id;});}};
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null)say('Library changed in another tab. Your draft is preserved. Reload before saving.');});
window.addEventListener('beforeunload',e=>{if(busy||draft()){e.preventDefault();e.returnValue='';}});
load();
