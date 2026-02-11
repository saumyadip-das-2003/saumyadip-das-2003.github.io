// Single-page interactions: smooth scroll, active nav, publication filters, modal data
document.addEventListener('DOMContentLoaded', function () {

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && (href.startsWith('/#') || href.startsWith('#'))) {
        e.preventDefault();
        var id = href.split('#').pop();
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // close nav on mobile
        var navEl = document.getElementById('nav');
        var bs = (window.bootstrap && bootstrap.Collapse && navEl) ? bootstrap.Collapse.getInstance(navEl) : null;
        if (bs) bs.hide();

        // ensure active nav update after scroll
        setTimeout(function () { window.dispatchEvent(new Event('scroll')); }, 300);
      }
    });
  });

  // Active nav on scroll (simple)
  var sections = document.querySelectorAll('section[id]');
  function onScroll() {
    var scrollPos = window.scrollY + 110;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos && (sec.offsetTop + sec.offsetHeight) > scrollPos) {
        document.querySelectorAll('.nav-link').forEach(function (a) { a.classList.remove('active'); });
        var link = document.querySelector('.nav-link[href="/#' + sec.id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // navbar shrink on scroll
  var navbarEl = document.querySelector('.navbar');
  function checkNavbar() {
    if (!navbarEl) return;
    if (window.scrollY > 40) navbarEl.classList.add('nav-scrolled');
    else navbarEl.classList.remove('nav-scrolled');
  }
  window.addEventListener('scroll', checkNavbar);
  checkNavbar();

  // Section highlight using IntersectionObserver
  var sectionsToObserve = document.querySelectorAll('main section');
  if (window.IntersectionObserver) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('section-active');
        else e.target.classList.remove('section-active');
      });
    }, { threshold: 0.35 });
    sectionsToObserve.forEach(function (s) { observer.observe(s); });
  } else {
    if (sectionsToObserve[0]) sectionsToObserve[0].classList.add('section-active');
  }

  // Publication filters with pagination (show 4, +5 per click)
  var buttons = document.querySelectorAll('[data-filter]');
  var items = Array.from(document.querySelectorAll('.pub-item'));
  var PAGE_INITIAL = 4;
  var PAGE_INCREMENT = 5;
  var pubVisibleCount = PAGE_INITIAL;
  var currentFilter = 'all';

  function renderPubs() {
    var matching = items.filter(function (it) {
      if (currentFilter === 'all') return true;
      var tags = it.getAttribute('data-tags') || '';
      return tags.indexOf(currentFilter) !== -1;
    });

    matching.forEach(function (it, idx) {
      it.style.display = idx < pubVisibleCount ? '' : 'none';
    });

    items.filter(function (it) { return matching.indexOf(it) === -1; })
      .forEach(function (it) { it.style.display = 'none'; });

    var showMoreBtn = document.getElementById('pubShowMore');
    if (!showMoreBtn) return;

    if (matching.length <= PAGE_INITIAL) {
      showMoreBtn.style.display = 'none';
    } else {
      showMoreBtn.style.display = '';
      if (pubVisibleCount < matching.length) {
        var left = matching.length - pubVisibleCount;
        showMoreBtn.textContent = 'Show more (' + Math.min(PAGE_INCREMENT, left) + ' more)';
      } else {
        showMoreBtn.textContent = 'Show less';
      }
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      pubVisibleCount = PAGE_INITIAL;
      renderPubs();
    });
  });

  var pubShowMoreBtn = document.getElementById('pubShowMore');
  if (pubShowMoreBtn) {
    pubShowMoreBtn.addEventListener('click', function () {
      var matchingCount = items.filter(function (it) {
        if (currentFilter === 'all') return true;
        var tags = it.getAttribute('data-tags') || '';
        return tags.indexOf(currentFilter) !== -1;
      }).length;

      if (pubVisibleCount < matchingCount) {
        pubVisibleCount += PAGE_INCREMENT;
      } else {
        pubVisibleCount = PAGE_INITIAL;
        var pubList = document.getElementById('pub-list');
        if (pubList) pubList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      renderPubs();
    });
  }
  renderPubs();

  // Projects pagination (show 4, +4 per click)
  var projItems = Array.from(document.querySelectorAll('.project-item'));
  var PROJ_INITIAL = 4;
  var PROJ_INCREMENT = 4;
  var projVisible = PROJ_INITIAL;

  function renderProjects() {
    projItems.forEach(function (it, idx) {
      it.style.display = idx < projVisible ? '' : 'none';
    });
    var btn = document.getElementById('projShowMore');
    if (!btn) return;

    if (projItems.length <= PROJ_INITIAL) {
      btn.style.display = 'none';
    } else {
      btn.style.display = '';
      if (projVisible < projItems.length) {
        var left = projItems.length - projVisible;
        btn.textContent = 'Show more (' + Math.min(PROJ_INCREMENT, left) + ' more)';
      } else {
        btn.textContent = 'Show less';
      }
    }
  }

  var projBtn = document.getElementById('projShowMore');
  if (projBtn) {
    projBtn.addEventListener('click', function () {
      if (projVisible < projItems.length) projVisible += PROJ_INCREMENT;
      else projVisible = PROJ_INITIAL;

      renderProjects();
      if (projVisible === PROJ_INITIAL) {
        var projSec = document.getElementById('projects');
        if (projSec) projSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  renderProjects();

  // Awards pagination (show 4, +4 per click)
  var awardItems = Array.from(document.querySelectorAll('.award-item'));
  var AWARD_INITIAL = 4;
  var AWARD_INCREMENT = 4;
  var awardVisible = AWARD_INITIAL;

  function renderAwards() {
    awardItems.forEach(function (it, idx) {
      it.style.display = idx < awardVisible ? '' : 'none';
    });
    var btn = document.getElementById('awardShowMore');
    if (!btn) return;

    if (awardItems.length <= AWARD_INITIAL) {
      btn.style.display = 'none';
    } else {
      btn.style.display = '';
      if (awardVisible < awardItems.length) {
        var left = awardItems.length - awardVisible;
        btn.textContent = 'Show more (' + Math.min(AWARD_INCREMENT, left) + ' more)';
      } else {
        btn.textContent = 'Show less';
      }
    }
  }

  var awardBtn = document.getElementById('awardShowMore');
  if (awardBtn) {
    awardBtn.addEventListener('click', function () {
      if (awardVisible < awardItems.length) awardVisible += AWARD_INCREMENT;
      else awardVisible = AWARD_INITIAL;

      renderAwards();
      if (awardVisible === AWARD_INITIAL) {
        var awardsSec = document.getElementById('awards');
        if (awardsSec) awardsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  renderAwards();

  // ✅ Certifications pagination (show 4, +4 each click; when done -> show less)
  // IMPORTANT: scope cert-items ONLY inside #cert-list (so modal .cert-item doesn't break it)
  var certWrap = document.getElementById('cert-list');
  var certItems = certWrap ? Array.from(certWrap.querySelectorAll('.cert-item')) : [];
  var CERT_INITIAL = 4;
  var CERT_INCREMENT = 4;
  var certVisible = CERT_INITIAL;

  var certShowMoreRow = document.getElementById('cert-showmore-row');
  var certBtn = document.getElementById('certShowMore');
  var certBtnText = document.getElementById('certShowMoreText');
  var certBtnCount = document.getElementById('certShowMoreCount');

  function moveCertButtonAfterLastVisible() {
    if (!certShowMoreRow || certItems.length === 0) return;
    var lastVisibleIndex = Math.min(certVisible, certItems.length) - 1;
    var lastVisible = certItems[lastVisibleIndex];
    if (lastVisible && lastVisible.parentNode) {
      lastVisible.parentNode.insertBefore(certShowMoreRow, lastVisible.nextSibling);
    }
  }

  function renderCerts() {
    certItems.forEach(function (it, idx) {
      it.style.display = idx < certVisible ? '' : 'none';
    });

    if (!certBtn || !certBtnText || !certBtnCount || !certShowMoreRow) return;

    if (certItems.length <= CERT_INITIAL) {
      certShowMoreRow.style.display = 'none';
      return;
    }

    certShowMoreRow.style.display = '';
    moveCertButtonAfterLastVisible();

    if (certVisible < certItems.length) {
      var left = certItems.length - certVisible;
      var willShow = Math.min(CERT_INCREMENT, left);
      certBtnText.textContent = 'Show more';
      certBtnCount.textContent = ' (' + willShow + ' more)';
    } else {
      certBtnText.textContent = 'Show less';
      certBtnCount.textContent = '';
    }
  }

  if (certBtn) {
    certBtn.addEventListener('click', function () {
      if (certVisible < certItems.length) {
        certVisible += CERT_INCREMENT;
        if (certVisible > certItems.length) certVisible = certItems.length;
      } else {
        certVisible = CERT_INITIAL;
        var certSec = document.getElementById('certifications');
        if (certSec) certSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      renderCerts();
    });
  }

  renderCerts();

  // Publication modal population
  var pubModal = document.getElementById('pubModal');
  if (pubModal) {
    pubModal.addEventListener('show.bs.modal', function (e) {
      var trigger = e.relatedTarget;
      if (!trigger) return;
      var title = trigger.getAttribute('data-title');
      var authors = trigger.getAttribute('data-authors');
      var detail = trigger.getAttribute('data-detail');
      var links = trigger.getAttribute('data-links');

      var label = document.getElementById('pubModalLabel');
      var detailEl = document.getElementById('pubDetail');
      var linksEl = document.getElementById('pubLinks');

      if (label) label.textContent = title || 'Publication';
      if (detailEl) detailEl.innerHTML = '<strong>' + (authors || '') + '</strong><br>' + (detail || '');
      if (linksEl) linksEl.innerHTML = links ? '<a href="' + links + '" target="_blank" rel="noopener">View paper / DOI</a>' : '';
    });
  }

  // Transcript modal population (education)
  document.querySelectorAll('.edu-transcript-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pdf = this.getAttribute('data-pdf');
      var pdfUrl = pdf ? encodeURI(pdf) : '';
      var card = this.closest('.card');
      var titleEl = card ? card.querySelector('.card-title') : null;
      var title = titleEl ? titleEl.textContent : 'Transcript';

      var label = document.getElementById('transcriptModalLabel');
      var content = document.getElementById('transcriptContent');
      var download = document.getElementById('transcriptDownload');

      if (label) label.textContent = title + ' — Transcript';

      if (content && pdf && pdf.trim()) {
        content.innerHTML = '<div class="ratio ratio-16x9"><iframe src="' + pdfUrl + '" width="100%" height="600" frameborder="0">Loading…</iframe></div>';
        if (download) { download.href = pdfUrl; download.style.display = ''; }
      } else if (content) {
        content.innerHTML = '<p class="text-muted">Transcript PDF not uploaded yet. Add the PDF to the repository and set the button\'s <code>data-pdf</code> attribute.</p>';
        if (download) download.style.display = 'none';
      }

      var modalEl = document.getElementById('transcriptModal');
      if (window.bootstrap && bootstrap.Modal && modalEl) {
        var modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  });

  // Video modal iframe handling
  var videoModalEl = document.getElementById('videoModal');
  if (videoModalEl) {
    videoModalEl.addEventListener('show.bs.modal', function () {
      var iframe = document.getElementById('videoIframe');
      if (iframe) iframe.src = 'https://www.youtube.com/embed/-tJYN-eG1zk?rel=0';
    });
    videoModalEl.addEventListener('hidden.bs.modal', function () {
      var iframe = document.getElementById('videoIframe');
      if (iframe) iframe.src = '';
    });
  }

  // initialize skill bars: store original percentages and collapse them so they animate on reveal
  document.querySelectorAll('.skill-fill').forEach(function (s) {
    var w = s.style.width || '';
    s.dataset.level = w;
    s.style.width = '0';
  });

  // reveal animation with skill bar restore inside revealed blocks
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    setTimeout(function () {
      el.classList.add('visible');
      var fills = el.querySelectorAll ? el.querySelectorAll('.skill-fill') : [];
      fills.forEach(function (s, j) {
        setTimeout(function () { s.style.width = s.dataset.level || '70%'; }, 120 + j * 70);
      });
    }, 80 * i);
  });

  // fallback restore
  setTimeout(function () {
    document.querySelectorAll('.skill-fill').forEach(function (s) {
      if (s.style.width === '0') s.style.width = s.dataset.level || '70%';
    });
  }, 1500);

});
