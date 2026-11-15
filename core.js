export const MAX_FILE=4*1024*1024;
function text(value,max,label){if(typeof value!=='string'||value.length>max)throw Error(`${label} exceeds its text limit.`);return value;}
export function sourceURL(raw){if(!raw)return '';let u;try{u=new URL(raw);}catch{throw Error('Use a complete HTTP or HTTPS source URL.');}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Only HTTP(S) sources without credentials are supported.');return u.href;}
export function validate(value){
 if(!value||value.version!==1||!Array.isArray(value.articles)||value.articles.length>500)throw Error('Expected a version 1 library with at most 500 articles.');
 const ids=new Set();
 const articles=value.articles.map(a=>{
  if(!a||typeof a!=='object')throw Error('Invalid article.');
  const id=text(a.id,100,'ID'),title=text(a.title,200,'Title').trim(),body=text(a.body,200000,'Article');
  if(!id||ids.has(id)||!title||!body.trim())throw Error('Articles need a unique ID, a title and text.');ids.add(id);
  const url=sourceURL(text(a.url,4000,'URL'));
  if(!Array.isArray(a.highlights)||a.highlights.length>500)throw Error('An article can contain at most 500 highlights.');
  const seen=new Set();let end=0;
  const highlights=[...a.highlights].sort((x,y)=>x?.start-y?.start).map(h=>{
   if(!h||typeof h!=='object')throw Error('Invalid highlight.');
   const hid=text(h.id,100,'Highlight ID'),note=text(h.note,4000,'Note');
   if(!hid||seen.has(hid)||!Number.isSafeInteger(h.start)||!Number.isSafeInteger(h.end)||h.start<end||h.start<0||h.end<=h.start||h.end>body.length||typeof h.quote!=='string'||h.quote!==body.slice(h.start,h.end))throw Error('Highlights must match the article text and must not overlap.');
   // Do not split a UTF-16 surrogate pair at either boundary.
   for(const offset of [h.start,h.end])if(offset>0&&offset<body.length&&/[\uD800-\uDBFF]/.test(body[offset-1])&&/[\uDC00-\uDFFF]/.test(body[offset]))throw Error('A highlight boundary splits a character.');
   seen.add(hid);end=h.end;return {id:hid,start:h.start,end:h.end,quote:h.quote,note};
  });
  return {id,title,url,body,highlights};
 });return {version:1,articles};
}
export function parseBackup(raw){if(typeof raw!=='string'||new TextEncoder().encode(raw).length>MAX_FILE)throw Error('Backup exceeds 4 MB.');let value;try{value=JSON.parse(raw);}catch{throw Error('This is not a valid JSON backup.');}return validate(value);}
export function addHighlight(article,start,end,id){return validate({version:1,articles:[{...article,highlights:[...article.highlights,{id,start,end,quote:article.body.slice(start,end),note:''}]}]}).articles[0];}
export function merge(current,incoming){const result=validate(current).articles,byId=new Map(result.map(a=>[a.id,a]));for(const a of validate(incoming).articles){if(byId.has(a.id)){if(JSON.stringify(byId.get(a.id))!==JSON.stringify(a))throw Error('Conflicting article ID. Nothing was imported.');}else{result.push(a);byId.set(a.id,a);}}return validate({version:1,articles:result});}
const literal=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/([\\`*_{}\[\]()#+.!|~-])/g,'\\$1');
export function markdown(article){const a=validate({version:1,articles:[article]}).articles[0];let out='# '+literal(a.title)+'\n\n';if(a.url)out+='Source: <'+a.url+'>\n\n';out+='## Article\n\n'+literal(a.body)+'\n\n## Highlights and notes\n';for(const h of a.highlights){out+='\n'+literal(h.quote).split('\n').map(s=>'> '+s).join('\n')+'\n';if(h.note)out+='\n'+literal(h.note)+'\n';}return out;}
