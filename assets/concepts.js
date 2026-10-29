const navToggle=document.querySelector('.menu-toggle');
const mainNav=document.querySelector('#main-nav');
navToggle?.addEventListener('click',()=>{
  const open=navToggle.getAttribute('aria-expanded')!=='true';
  navToggle.setAttribute('aria-expanded',String(open));
  mainNav.classList.toggle('is-open',open);
  navToggle.textContent=open?'Close −':'Menu +';
});
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mainNav.classList.remove('is-open');navToggle.setAttribute('aria-expanded','false');navToggle.textContent='Menu +';
}));
const homeFilters=[...document.querySelectorAll('[data-filter]')];
const rows=[...document.querySelectorAll('.event-row')];
homeFilters.forEach(button=>button.addEventListener('click',()=>{
  homeFilters.forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  let visible=0;
  rows.forEach(row=>{const show=button.dataset.filter==='all'||row.dataset.category===button.dataset.filter;row.hidden=!show;if(show)visible++;});
  document.querySelector('.filter-status').textContent=`Showing ${visible} sample event ${visible===1?'idea':'ideas'}`;
}));
const enquiry=document.querySelector('#enquiry-form');
if(enquiry){
  let enquiryText='';
  const result=document.querySelector('.enquiry-result');
  const field=name=>enquiry.elements.namedItem(name);
  const params=new URLSearchParams(location.search);
  if(params.get('type')&&[...field('eventType').options].some(o=>o.value===params.get('type')))field('eventType').value=params.get('type');
  if(params.get('request')==='tour')field('requestType').value='Arrange a venue tour';
  enquiry.addEventListener('submit',e=>{
    e.preventDefault();
    const d=new FormData(enquiry);
    const prettyDate=new Date(d.get('date')+'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    const tour=d.get('requestType')==='Arrange a venue tour'?'I’d also like to arrange a venue tour.\n\n':'';
    enquiryText=`Hi, I’m ${d.get('name')}.\n\nI’m interested in a ${String(d.get('eventType')).toLowerCase()} for approximately ${d.get('guests')} guests on ${prettyDate}.\n\n${tour}${d.get('details')||'I’d love to learn more about availability and options.'}`;
    document.querySelector('#enquiry-preview').textContent=enquiryText;
    result.hidden=false;result.focus();document.querySelector('#copy-status').textContent='';
  });
  document.querySelector('.copy-button:not(.download-enquiry):not(.reset-enquiry)')?.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(enquiryText);document.querySelector('#copy-status').textContent='Copied.';}
    catch{document.querySelector('#copy-status').textContent='Select the preview text above to copy it.';}
  });
  document.querySelector('.download-enquiry')?.addEventListener('click',()=>downloadText('VUE-ON-MAIN-enquiry-preview.txt','DEMO ENQUIRY — NOT SENT\n\n'+enquiryText));
  document.querySelector('.reset-enquiry')?.addEventListener('click',()=>{
    enquiry.reset();result.hidden=true;enquiryText='';field('eventType').focus();
  });
}
function downloadText(filename,text){
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=filename;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.querySelector('.select-direction')?.addEventListener('click',()=>{
  try{const key='the-vue-meeting-notes-v1';const saved=JSON.parse(localStorage.getItem(key)||'{}');saved.direction=document.body.dataset.concept;localStorage.setItem(key,JSON.stringify(saved));}catch{}
});
