const P='2gram_pwa_posts',U='2gram_pwa_user';
let posts=JSON.parse(localStorage.getItem(P)||'[]');
let user=JSON.parse(localStorage.getItem(U)||'{"name":"2Gram User","bio":"Welcome to 2Gram!"}');
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function save(){localStorage.setItem(P,JSON.stringify(posts))}
function render(){let q=$('search').value.toLowerCase();$('feed').innerHTML=posts.filter(p=>p.text.toLowerCase().includes(q)).map(p=>`<article class="post"><b>${esc(user.name)}</b><div class="meta">${new Date(p.time).toLocaleString()}</div><p>${esc(p.text)}</p>${p.img?`<img src="${p.img}">`:''}<div class="actions"><button onclick="like('${p.id}')">❤️ ${p.likes}</button></div><div class="comments">${p.comments.map(c=>`<div class="comment"><b>${esc(c.name)}</b>: ${esc(c.text)}</div>`).join('')}<div class="commentBox"><input id="c${p.id}" placeholder="Comment"><button onclick="comment('${p.id}')">Send</button></div></div></article>`).join('')||'<article class="post"><b>Welcome to 2Gram 👋</b><p>Create your first post.</p></article>'}
$('postBtn').onclick=()=>{let text=$('caption').value.trim(),f=$('photo').files[0];if(!text&&!f)return alert('Write something or choose a photo.');let add=img=>{posts.unshift({id:Date.now().toString(),text,img:img||'',likes:0,comments:[],time:Date.now()});save();$('caption').value='';$('photo').value='';render()};if(f){let r=new FileReader();r.onload=()=>add(r.result);r.readAsDataURL(f)}else add('')};
window.like=id=>{let p=posts.find(x=>x.id===id);p.likes++;save();render()};
window.comment=id=>{let i=$('c'+id),t=i.value.trim();if(!t)return;posts.find(x=>x.id===id).comments.push({name:user.name,text:t});save();render()};
window.profile=()=>{
  const name=prompt("Your name:",user.name)||user.name;
  const bio=prompt("Your bio:",user.bio)||user.bio;
  user={name,bio};
  localStorage.setItem(U,JSON.stringify(user));
  alert("Profile saved!\nName: "+user.name+"\nBio: "+user.bio);
  render();
}
$('search').oninput=render;render(); 
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
