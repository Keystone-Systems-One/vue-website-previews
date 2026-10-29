// Keep the same view when comparing visual directions.
const compareParams=new URLSearchParams();
const currentParams=new URLSearchParams(location.search);
for(const key of ['event','category','type','request'])if(currentParams.has(key))compareParams.set(key,currentParams.get(key));
if(compareParams.size)document.querySelectorAll('[aria-label="Switch website concept"] a').forEach(a=>{a.href=a.getAttribute('href')+'?'+compareParams.toString();});
const showFilters=[...document.querySelectorAll('[data-show-filter]')];
if(showFilters.length){
  let category='all';
  const cards=[...document.querySelectorAll('.show-card')];
  const search=document.querySelector('#show-search');const month=document.querySelector('#show-month');
  const apply=()=>{
    let count=0;const query=search.value.trim().toLowerCase();
    cards.forEach(card=>{
      const visible=(category==='all'||card.dataset.category===category)&&(month.value==='all'||card.dataset.month===month.value)&&card.dataset.search.includes(query);
      card.hidden=!visible;if(visible)count++;
    });
    document.querySelector('.show-count').textContent=`${count} example ${count===1?'event':'events'}`;
    document.querySelector('.empty-events').hidden=count!==0;
  };
  showFilters.forEach(button=>button.addEventListener('click',()=>{
    category=button.dataset.showFilter;
    showFilters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});apply();
  }));
  search.addEventListener('input',apply);month.addEventListener('change',apply);
  document.querySelector('.reset-filters').addEventListener('click',()=>{search.value='';month.value='all';showFilters[0].click();search.focus();});
}
const ticketForm=document.querySelector('#ticket-form');
if(ticketForm){
  const shows={
    live:{title:'Live at Vue on Main',category:'LIVE MUSIC',date:'Saturday, November 14, 2026',time:'8:00 PM',price:20,word:'LIVE',big:'& LOUD',art:'music-art',description:'A band, your friends, and a room full of songs you know.',story:'Good songs, good company, and an excuse to stay for the encore. Explore how a concert listing can bring the artist, the atmosphere and the ticket flow together.'},
    boots:{title:'Boots on the Floor',category:'LINE DANCING',date:'Friday, November 20, 2026',time:'7:00 PM',price:15,word:'BOOTS',big:'ON THE FLOOR',art:'dance-art',description:'Find a new step, bring a friend, and make a night of it.',story:'A sample line dancing night for a different kind of evening out. The final listing can include an instructor, level, lesson format and what guests should bring, once confirmed.'},
    laughs:{title:'Laugh Out Loud',category:'COMEDY',date:'Friday, November 27, 2026',time:'8:00 PM',price:20,word:'JUST',big:'FOR LAUGHS',art:'comedy-art',description:'A night of stand-up and the kind of laughs you take home.',story:'Let the punchlines do the work. This example shows how a comedy night can feature the performer, show time and admission details in one simple booking journey.'},
    acoustic:{title:'The Acoustic Session',category:'LIVE MUSIC',date:'Saturday, December 5, 2026',time:'7:30 PM',price:15,word:'STRIPPED',big:'BACK',art:'music-art',description:'Turn the volume down a little. Stay for one more song.',story:'A more intimate kind of music night. This example can become a home for acoustic artists, singer-songwriters and listening-room performances once the real programme is available.'}
  };
  const id=new URLSearchParams(location.search).get('event')||'live';const show=shows[id];
  if(!show){
    document.querySelector('.detail-grid').hidden=true;
    const message=document.createElement('p');message.className='empty-events';message.textContent='That example event isn’t available. Use “Back to all events” to choose another night.';document.querySelector('.event-detail').append(message);
  }else{
    document.title=`${show.title} — VUE ON MAIN / Demo event`;
    for(const [key,value] of Object.entries({title:show.title,category:show.category,date:show.date,time:show.time,description:show.description,story:show.story}))document.querySelector('#detail-'+key).textContent=value;
    document.querySelector('#poster-word').textContent=show.word;document.querySelector('#poster-big').textContent=show.big;
    document.querySelector('.detail-poster').className='detail-poster '+show.art;
    const control=name=>ticketForm.elements.namedItem(name);
    const total=()=>show.price*(control('ticketType').value==='premium'?1.5:1)*Number(control('quantity').value);
    const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
    const update=()=>{document.querySelector('#ticket-total').textContent=money(total());};
    ticketForm.addEventListener('change',update);update();
    let summary='';
    ticketForm.addEventListener('submit',e=>{
      e.preventDefault();
      summary=`DEMO RESERVATION — NOT A REAL TICKET\n\nGuest: ${control('guest').value}\nEvent: ${show.title}\nExample date: ${show.date}\nExample time: ${show.time}\nTicket type: ${control('ticketType').selectedOptions[0].textContent}\nQuantity: ${control('quantity').value}\nIllustrative total: ${money(total())}\n\nNo booking was made and no payment was taken. Event dates, prices and booking details are illustrative. Venue: Vue on Main, 250 W. Main St., Greenwood, Indiana.`;
      document.querySelector('#ticket-summary').textContent=summary.split('\n\n')[1];
      ticketForm.hidden=true;const confirmation=document.querySelector('#ticket-confirmation');confirmation.hidden=false;confirmation.focus();
    });
    document.querySelector('#download-reservation').addEventListener('click',()=>downloadText('THE-VUE-demo-reservation.txt',summary));
    document.querySelector('#edit-reservation').addEventListener('click',()=>{document.querySelector('#ticket-confirmation').hidden=true;ticketForm.hidden=false;control('ticketType').focus();});
  }
}
const viewer=document.querySelector('#gallery-viewer');
if(viewer){
  const photos=[...document.querySelectorAll('.gallery-photo')];
  const buttons=[...document.querySelectorAll('[data-gallery-filter]')];
  let current=0;let lastTrigger=null;
  const paint=()=>{
    const photo=photos[current];const original=photo.querySelector('img');const full=document.querySelector('#gallery-full');
    full.src=original.getAttribute('src');full.alt=original.alt;document.querySelector('#gallery-caption').textContent=photo.dataset.caption;document.querySelector('#gallery-source').textContent=photo.dataset.credit||'Stock inspiration';
  };
  const move=offset=>{
    const visible=photos.map((p,i)=>p.hidden?null:i).filter(i=>i!==null);
    current=visible[(visible.indexOf(current)+offset+visible.length)%visible.length];paint();
  };
  photos.forEach((photo,index)=>photo.addEventListener('click',()=>{current=index;lastTrigger=photo;paint();viewer.showModal();document.querySelector('#gallery-close').focus();}));
  document.querySelector('#gallery-close').addEventListener('click',()=>viewer.close());
  viewer.addEventListener('close',()=>lastTrigger?.focus());
  document.querySelector('#gallery-prev').addEventListener('click',()=>move(-1));
  document.querySelector('#gallery-next').addEventListener('click',()=>move(1));
  viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='ArrowRight'){e.preventDefault();move(1);}});
  const filter=button=>{
    buttons.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    photos.forEach(p=>p.hidden=button.dataset.galleryFilter!=='all'&&p.dataset.gallery!==button.dataset.galleryFilter);
  };
  buttons.forEach(b=>b.addEventListener('click',()=>filter(b)));
  const category=new URLSearchParams(location.search).get('category');const selected=buttons.find(b=>b.dataset.galleryFilter===category);if(selected)filter(selected);
}
