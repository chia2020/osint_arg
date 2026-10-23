(
  function(){
  window.el=function(t,c,x){var e=document.createElement(t);
    if(c)e.className=c;
    if(x!==undefined)e.textContent=x;
    return e};

  window.getJSON=function(u){
    return fetch(u).then(function(r){if(!r.ok)throw new Error(u+' ('+r.status+')');
      return r.json()})};

  // Resolve the one shared data file beside this script, regardless of the
  // URL path used to open a page.
  var DATA_URL=new URL('data.json',document.currentScript.src).toString(),_p;
  window.loadData=function(){
    return _p||(_p=getJSON(DATA_URL).then(function(d){
      if(!d||!Array.isArray(d.collaborators))throw new Error('data.json must contain a collaborators array');
      if(!Array.isArray(d.projects))throw new Error('data.json must contain a projects array');
      var base=(d.site.portfolio_base||'').replace(/\/+$/,'');
      d.collaborators.forEach(function(c){var p=c.portfolio_path||'';c.portfolio_url=/^https?:/.test(p)?p:(p?base+'/'+p.replace(/^\/+/,''):'')});
    return d}))};
  window.fmtDate=function(iso)
  {var d=new Date(iso+'T00:00:00');return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})};
  var page=document.body.getAttribute('data-page')||'';

  var nav=[['home','Home','home.html'],['directory','Directory','index.html'],['projects','Projects','projects.html'],['announcements','Announcements','announcements.html']];

  var h='<header class="top"><div class="top-in"><a class="logo" href="home.html">ORION <span>Scholar</span></a>'+
   '<form class="gsearch" role="search"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="M21 21l-6-6"/></svg>'+
   '<input id="q" type="search" placeholder="Search researchers, projects or handles" aria-label="Search directory" autocomplete="off"></form><nav class="nav" aria-label="Main">'+
   nav.map(function(n){return '<a href="'+n[2]+'" data-k="'+n[0]+'"'+(n[0]===page?' class="on"':'')+'>'+n[1]+'</a>'}).join('')+
   '</nav><div class="me" title="Guest">G</div></div></header>';

  document.getElementById('top').innerHTML=h;
  var q=document.getElementById('q');
  document.querySelector('.gsearch').addEventListener('submit',function(e){e.preventDefault();if(page!=='directory')location.href='index.html?q='+encodeURIComponent(q.value)});
  loadData().then(function(d){var a=document.querySelector('.nav [data-k=announcements]');if(a&&d.site.announcements_url){a.href=d.site.announcements_url}}).catch(function(){});
})();
