// ==================== 从视频提取音频（ffmpeg.wasm） ====================
let ffmpegInstance = null;
let ffmpegLoading = false;
async function loadFFmpeg(){
  if(ffmpegInstance) return ffmpegInstance;
  if(ffmpegLoading){
    while(ffmpegLoading){ await new Promise(r=>setTimeout(r,100)); }
    return ffmpegInstance;
  }
  ffmpegLoading = true;
  try{
    // 动态加载 ffmpeg.wasm UMD
    await window.flLoadScriptOnce('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js');
    await window.flLoadScriptOnce('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js');
    const { FFmpeg } = FFmpegWASM;
    const ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress }) => {
      const p = document.getElementById('vpAudioProgress');
      if(p) p.textContent = '⏳ 转换中... ' + Math.round(progress * 100) + '%';
    });
    await ffmpeg.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
    });
    ffmpegInstance = ffmpeg;
    return ffmpegInstance;
  }catch(e){
    console.error('ffmpeg加载失败:', e);
    throw e;
  }finally{
    ffmpegLoading = false;
  }
}
async function extractAudioFromVideo(){
  if(!vpCurrentData || !vpCurrentData.videoUrl){ showToast('视频地址无效'); return; }
  const btn = document.getElementById('vpExtractAudioBtn');
  const progress = document.getElementById('vpAudioProgress');
  btn.disabled = true;
  btn.style.opacity = '0.6';
  progress.style.display = 'block';
  progress.textContent = '⏳ 正在加载转换引擎（首次约10秒）...';
  try{
    const ffmpeg = await loadFFmpeg();
    progress.textContent = '⏳ 正在下载视频...';
    // 下载视频
    const videoRes = await fetch(vpCurrentData.videoUrl);
    const videoBlob = await videoRes.blob();
    const videoArray = new Uint8Array(await videoBlob.arrayBuffer());
    // 写入ffmpeg
    await ffmpeg.writeFile('input.mp4', videoArray);
    progress.textContent = '⏳ 正在提取音频...';
    // 提取音频为mp3
    await ffmpeg.exec(['-i','input.mp4','-vn','-acodec','libmp3lame','-q:a','2','output.mp3']);
    // 读取输出
    const data = await ffmpeg.readFile('output.mp3');
    const audioBlob = new Blob([data.buffer], {type:'audio/mpeg'});
    const audioUrl = URL.createObjectURL(audioBlob);
    // 下载
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = (vpCurrentData.title || 'audio').substring(0,30) + '.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(audioUrl);
    // 清理
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output.mp3');
    progress.textContent = '✅ 提取完成！';
    setTimeout(()=>{ progress.style.display = 'none'; }, 2000);
    showToast('音频提取完成');
  }catch(e){
    console.error(e);
    progress.textContent = '❌ 提取失败：' + (e.message || '未知错误');
    showToast('音频提取失败');
  }finally{
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

