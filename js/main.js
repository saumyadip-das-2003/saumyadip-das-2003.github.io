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

  // navbar shrink on scroll
  var navbarEl = document.querySelector('.navbar');
  function checkNavbar(){
    if(!navbarEl) return;
    if(window.scrollY > 40) navbarEl.classList.add('nav-scrolled');
    else navbarEl.classList.remove('nav-scrolled');
  }
  window.addEventListener('scroll', checkNavbar);
  checkNavbar();



  // Section highlight using IntersectionObserver
  var sectionsToObserve = document.querySelectorAll('main section');
  if(window.IntersectionObserver){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('section-active'); }
        else { e.target.classList.remove('section-active'); }
      });
    }, {threshold:0.35});
    sectionsToObserve.forEach(function(s){ observer.observe(s); });
  } else {
    // Fallback: add highlight to first section
    if(sectionsToObserve[0]) sectionsToObserve[0].classList.add('section-active');
  }

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

  // Projects pagination (show 4, +4 per click)
  var projItems = Array.from(document.querySelectorAll('.project-item'));
  var PROJ_INITIAL = 4;
  var PROJ_INCREMENT = 4;
  var projVisible = PROJ_INITIAL;

  function renderProjects(){
    projItems.forEach(function(it, idx){
      it.style.display = idx < projVisible ? '' : 'none';
    });
    var btn = document.getElementById('projShowMore');
    if(!btn) return;
    if(projItems.length <= PROJ_INITIAL){
      btn.style.display = 'none';
    } else {
      btn.style.display = '';
      if(projVisible < projItems.length){
        var left = projItems.length - projVisible;
        btn.textContent = 'Show more (' + Math.min(PROJ_INCREMENT, left) + ' more)';
      } else {
        btn.textContent = 'Show less';
      }
    }
  }

  var projBtn = document.getElementById('projShowMore');
  if(projBtn){
    projBtn.addEventListener('click', function(){
      if(projVisible < projItems.length) projVisible += PROJ_INCREMENT;
      else projVisible = PROJ_INITIAL;
      renderProjects();
      if(projVisible === PROJ_INITIAL) document.getElementById('projects').scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // initial render for projects
  renderProjects();

  // Awards pagination (show 4, +4 per click) - display in 2 columns (handled by Bootstrap)
  var awardItems = Array.from(document.querySelectorAll('.award-item'));
  var AWARD_INITIAL = 4;
  var AWARD_INCREMENT = 4;
  var awardVisible = AWARD_INITIAL;

  function renderAwards(){
    awardItems.forEach(function(it, idx){
      it.style.display = idx < awardVisible ? '' : 'none';
    });
    var btn = document.getElementById('awardShowMore');
    if(!btn) return;
    if(awardItems.length <= AWARD_INITIAL){
      btn.style.display = 'none';
    } else {
      btn.style.display = '';
      if(awardVisible < awardItems.length){
        var left = awardItems.length - awardVisible;
        btn.textContent = 'Show more (' + Math.min(AWARD_INCREMENT, left) + ' more)';
      } else {
        btn.textContent = 'Show less';
      }
    }
  }

  var awardBtn = document.getElementById('awardShowMore');
  if(awardBtn){
    awardBtn.addEventListener('click', function(){
      if(awardVisible < awardItems.length) awardVisible += AWARD_INCREMENT;
      else awardVisible = AWARD_INITIAL;
      renderAwards();
      if(awardVisible === AWARD_INITIAL) document.getElementById('awards').scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // Certifications pagination (show 4, +4 per click) - 4 columns layout
  var certItems = Array.from(document.querySelectorAll('.cert-item'));
  var CERT_INITIAL = 4;
  var CERT_INCREMENT = 4;
  var certVisible = CERT_INITIAL;

  function renderCerts(){
    certItems.forEach(function(it, idx){
      it.style.display = idx < certVisible ? '' : 'none';
    });
    var btn = document.getElementById('certShowMore');
    if(!btn) return;
    if(certItems.length <= CERT_INITIAL){
      btn.style.display = 'none';
    } else {
      btn.style.display = '';
      if(certVisible < certItems.length){
        var left = certItems.length - certVisible;
        btn.textContent = 'Show more (' + Math.min(CERT_INCREMENT, left) + ' more)';
      } else {
        btn.textContent = 'Show less';
      }
    }
  }

  var certBtn = document.getElementById('certShowMore');
  if(certBtn){
    certBtn.addEventListener('click', function(){
      if(certVisible < certItems.length) certVisible += CERT_INCREMENT;
      else certVisible = CERT_INITIAL;
      renderCerts();
      if(certVisible === CERT_INITIAL) document.getElementById('certifications').scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // initial render for awards and certs
  renderAwards();
  renderCerts();

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

  // Transcript modal population (education)
  document.querySelectorAll('.edu-transcript-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var pdf = this.getAttribute('data-pdf');
      var pdfUrl = pdf ? encodeURI(pdf) : '';
      var title = this.closest('.card').querySelector('.card-title').textContent || 'Transcript';
      document.getElementById('transcriptModalLabel').textContent = title + ' — Transcript';
      var content = document.getElementById('transcriptContent');
      var download = document.getElementById('transcriptDownload');
      if(pdf && pdf.trim()){
        content.innerHTML = '<div class="ratio ratio-16x9"><iframe src="'+pdfUrl+'" width="100%" height="600" frameborder="0">Loading…</iframe></div>';
        download.href = pdfUrl; download.style.display = '';
      } else {
        content.innerHTML = '<p class="text-muted">Transcript PDF not uploaded yet. You can add the PDF to the repository and set the button\'s <code>data-pdf</code> attribute to the file path, or send me the file and I will add it.</p>';
        download.style.display = 'none';
      }
      var modal = new bootstrap.Modal(document.getElementById('transcriptModal'));
      modal.show();
    });
  });

  // Video modal iframe handling
  var videoModalEl = document.getElementById('videoModal');
  if(videoModalEl){
    videoModalEl.addEventListener('show.bs.modal', function(e){
      var iframe = document.getElementById('videoIframe');
      // Use YouTube embed URL (video ID: -tJYN-eG1zk)
      iframe.src = 'https://www.youtube.com/embed/-tJYN-eG1zk?rel=0';
    });
    videoModalEl.addEventListener('hidden.bs.modal', function(e){
      var iframe = document.getElementById('videoIframe');
      iframe.src = '';
    });
  }

  // initialize skill bars: store original percentages and collapse them so they animate on reveal
  document.querySelectorAll('.skill-fill').forEach(function(s){
    var w = s.style.width || '';
    s.dataset.level = w;
    s.style.width = '0';
  });

  // reveal animation with skill bar restore inside revealed blocks
  document.querySelectorAll('.reveal').forEach(function(el,i){
    setTimeout(function(){
      el.classList.add('visible');
      // animate skill fills inside this element (staggered)
      var fills = el.querySelectorAll ? el.querySelectorAll('.skill-fill') : [];
      fills.forEach(function(s,j){ setTimeout(function(){ s.style.width = s.dataset.level || '70%'; }, 120 + j*70); });
    }, 80*i);
  });

  // In case some skill bars are outside .reveal containers, restore them once DOM is ready (graceful fallback)
  setTimeout(function(){ document.querySelectorAll('.skill-fill').forEach(function(s){ if(s.style.width === '0') s.style.width = s.dataset.level || '70%'; }); }, 1500);

  // Theme toggle logic
  var themeBtn = document.getElementById('themeToggleBtn');
  function setTheme(theme) {
    if(theme === 'dark') {
      document.documentElement.setAttribute('data-theme','dark');
      localStorage.setItem('theme','dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme','light');
    }
  }
  // Init theme from storage or OS
  var savedTheme = localStorage.getItem('theme');
  if(savedTheme) setTheme(savedTheme);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  else setTheme('light');
  if(themeBtn) themeBtn.onclick = function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  };

});