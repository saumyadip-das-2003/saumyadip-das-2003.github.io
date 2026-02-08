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
        // ensure active nav update after scroll
        setTimeout(function(){ window.dispatchEvent(new Event('scroll')); }, 300);
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

  // Publication filters with pagination (show 4, +5 per click)
  var buttons = document.querySelectorAll('[data-filter]');
  var items = Array.from(document.querySelectorAll('.pub-item'));
  var PAGE_INITIAL = 4;
  var PAGE_INCREMENT = 5;
  var visibleCount = PAGE_INITIAL;
  var currentFilter = 'all';

  function renderPubs(){
    var matching = items.filter(function(it){
      if(currentFilter === 'all') return true;
      var tags = it.getAttribute('data-tags') || '';
      return tags.indexOf(currentFilter) !== -1;
    });

    matching.forEach(function(it, idx){
      it.style.display = idx < visibleCount ? '' : 'none';
    });
    // hide non-matching
    items.filter(it => matching.indexOf(it) === -1).forEach(it => it.style.display = 'none');

    var showMoreBtn = document.getElementById('pubShowMore');
    if(!showMoreBtn) return;
    if(matching.length <= PAGE_INITIAL){
      showMoreBtn.style.display = 'none';
    } else {
      showMoreBtn.style.display = '';
      if(visibleCount < matching.length){
        var left = matching.length - visibleCount;
        showMoreBtn.textContent = 'Show more (' + Math.min(PAGE_INCREMENT, left) + ' more)';
      } else {
        showMoreBtn.textContent = 'Show less';
      }
    }
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      buttons.forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      visibleCount = PAGE_INITIAL;
      renderPubs();
    });
  });

  var showMoreBtn = document.getElementById('pubShowMore');
  if(showMoreBtn){
    showMoreBtn.addEventListener('click', function(){
      var matchingCount = items.filter(function(it){
        if(currentFilter === 'all') return true;
        var tags = it.getAttribute('data-tags') || '';
        return tags.indexOf(currentFilter) !== -1;
      }).length;
      if(visibleCount < matchingCount){
        visibleCount += PAGE_INCREMENT;
      } else {
        visibleCount = PAGE_INITIAL;
        document.getElementById('pub-list').scrollIntoView({behavior:'smooth', block:'start'});
      }
      renderPubs();
    });
  }

  // initial render
  renderPubs();

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