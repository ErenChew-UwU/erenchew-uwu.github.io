const listEl = document.getElementById('videoList');
const viewer = document.getElementById('viewer');

const viewList = window.viewListJson;

fetch(viewList)
  .then(res => res.json())
  .then(data => {
    const videos = data.content;

    // 1 按 date 从新到旧排序
    videos.sort((a, b) => b.date.localeCompare(a.date));

    // 2 生成 HTML
    videos.forEach(video => {
      const item = document.createElement('div');
      item.className = 'video-item';

      // ===== data 属性 =====
      if (video.type === 'youtube') {
        item.dataset.videoYoutube = video.source;
      } else {
        item.dataset.videoLocal = video.source;
      }

      // ===== 封面图 =====
      let coverUrl = video.coverImg;
      if (video.type === 'youtube' && !coverUrl) {
        coverUrl = `https://img.youtube.com/vi/${video.source}/hqdefault.jpg`;
      }

      // ===== 描述处理（支持多行） =====
      const descLines = Array.isArray(video.descripsion)
        ? video.descripsion
        : [video.descripsion];

      const descHTML = descLines
        .map(line => `<div class="video-desc">${line}</div>`)
        .join('');

      // ===== 拼 HTML =====
      item.innerHTML = `
        <div class="video-cover" style="background-image:url('${coverUrl}')"></div>
        <div class="video-info-overlay">
          <div class="video-title">${video.title}</div>
          ${descHTML}
        </div>
        <div class="video-info-wrapper">
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            ${descHTML}
          </div>
        </div>
        <div class="arrow">›</div>
      `;

      listEl.appendChild(item);
    });
  })
  .catch(err => {
    console.error('Failed to load json', err);
    viewer.innerHTML = '<div class="placeholder" style="color:red;font-size: 80px;">Failed to load JSON file</div>';
});

flipBtn.addEventListener('click', () => {
  viewer.innerHTML = '';
  document.querySelectorAll('.video-item').forEach(el => el.classList.remove('active'));
});


listEl.addEventListener('click', (e) => {
  const item = e.target.closest('.video-item');
  if (!item) return;

  viewer.innerHTML = '';

  let element;

  if (item.dataset.videoYoutube) {
    const videoId = item.dataset.videoYoutube;
    element = document.createElement('iframe');
    element.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    element.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    element.allowFullscreen = true;
  } 
  else if (item.dataset.videoLocal) {
    element = document.createElement('video');
    element.src = item.dataset.videoLocal;
    element.controls = true;
    element.autoplay = true;
    element.style.width = '100%';
    element.style.height = '100%';
  }

  viewer.appendChild(element);

  document.querySelectorAll('.video-item').forEach(el => el.classList.remove('active'));
  item.classList.add('active');
});