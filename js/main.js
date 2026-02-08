// Single-page interactions: smooth scroll, active nav, publication filters, modal data
document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(href && (href.startsWith('/#') || href.startsWith('#'))){
        e.preventDefault();
        var id = href.split('#').pop();
        var el = document.getElementById(id);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        // close nav on mobile
        var bs = bootstrap && bootstrap.Collapse ? bootstrap.Collapse.getInstance(document.getElementById('nav')) : null;
        if(bs) bs.hide();
      }
    });
  });

  // Active nav on scroll (simple)
  var sections = document.querySelectorAll('section[id]');
  function onScroll(){
    var scrollPos = window.scrollY + 110;
    sections.forEach(function(sec){
      if(sec.offsetTop <= scrollPos && (sec.offsetTop + sec.offsetHeight) > scrollPos){
        document.querySelectorAll('.nav-link').forEach(function(a){ a.classList.remove('active'); });
        var link = document.querySelector('.nav-link[href="/#'+sec.id+'"]');
        if(link) link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Publication filters
  var buttons = document.querySelectorAll('[data-filter]');
  var items = document.querySelectorAll('.pub-item');
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      buttons.forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      var f = this.getAttribute('data-filter');
      items.forEach(function(it){
        if(f === 'all') it.style.display = '';
        else {
          var tags = it.getAttribute('data-tags');
          it.style.display = tags && tags.indexOf(f) !== -1 ? '' : 'none';
        }
      });
    });
  });

  // Publication modal population
  var pubModal = document.getElementById('pubModal');
  if(pubModal){
    pubModal.addEventListener('show.bs.modal', function(e){
      var trigger = e.relatedTarget;
      var title = trigger.getAttribute('data-title');
      var authors = trigger.getAttribute('data-authors');
      var detail = trigger.getAttribute('data-detail');
      var links = trigger.getAttribute('data-links');
      document.getElementById('pubModalLabel').textContent = title || 'Publication';
      document.getElementById('pubDetail').innerHTML = '<strong>'+authors+'</strong><br>'+(detail||'');
      document.getElementById('pubLinks').innerHTML = links ? '<a href="'+links+'" target="_blank">View paper / DOI</a>' : '';
    });
  }

  // reveal animation
  document.querySelectorAll('.reveal').forEach(function(el,i){ setTimeout(()=>el.classList.add('visible'), 80*i) });
});