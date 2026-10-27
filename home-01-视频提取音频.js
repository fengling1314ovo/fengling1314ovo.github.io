/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
(function(){
  if (document.getElementById("flVideoAudioStyles")) return;
  /* Styles moved to css/home-01-视频提取音频.css. */
})();

window.flRegisterToolPage("pageVideoAudio", "<!-- pageVideoAudio -->\n<div class=\"tool-page\" id=\"pageVideoAudio\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎵 视频提取音频</h3>\n      <div class=\"va-upload-area\" id=\"vaUploadArea\" onclick=\"document.getElementById('vaFile').click()\">\n        <input type=\"file\" id=\"vaFile\" accept=\"video/*\" onchange=\"vaUpdateFileInfo()\" style=\"display:none;\">\n        <div class=\"va-upload-icon\">🎬</div>\n        <div class=\"va-upload-text\">点击选择视频，或<span class=\"va-upload-highlight\">拖拽</span>到此处</div>\n        <div class=\"va-upload-hint\">支持 MP4 / WebM / MOV 等浏览器可解码格式</div>\n        <div id=\"vaFileChip\" class=\"va-file-chip\" style=\"display:none;\">\n          <span>📄</span>\n          <span class=\"va-chip-name\" id=\"vaChipName\"></span>\n          <span class=\"va-chip-size\" id=\"vaChipSize\"></span>\n        </div>\n      </div>\n      <div class=\"va-format-group\">\n        <div class=\"va-format-label\">输出格式</div>\n        <div class=\"va-format-btns\">\n          <button type=\"button\" class=\"va-format-btn active\" data-format=\"wav\" onclick=\"vaSetFormat('wav')\">WAV 无损</button>\n          <button type=\"button\" class=\"va-format-btn\" data-format=\"mp3\" onclick=\"vaSetFormat('mp3')\">MP3 压缩</button>\n        </div>\n        <div class=\"va-mp3-options\" id=\"vaMp3Options\" style=\"display:none;\">\n          <span class=\"va-mp3-label\">比特率</span>\n          <select id=\"vaMp3Kbps\" class=\"va-mp3-select\">\n            <option value=\"128\">128 kbps（标准）</option>\n            <option value=\"192\">192 kbps（较高）</option>\n            <option value=\"320\">320 kbps（高品质）</option>\n          </select>\n        </div>\n      </div>\n      <button class=\"common-btn\" onclick=\"vaExtract()\" id=\"vaExtractBtn\" style=\"width:100%;\">🎵 提取音频</button>\n      <div id=\"vaStatus\" style=\"margin-top:12px;text-align:center;font-size:14px;color:var(--text-secondary);\"></div>\n      <div id=\"vaResult\" style=\"display:none;margin-top:16px;padding:16px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-color);\">\n        <div style=\"font-size:14px;font-weight:600;margin-bottom:10px;\">✅ 提取完成</div>\n        <audio id=\"vaAudio\" controls style=\"width:100%;margin-bottom:12px;\"></audio>\n        <div style=\"display:flex;gap:10px;flex-wrap:wrap;\">\n          <a id=\"vaDownload\" class=\"common-btn\" style=\"flex:1;min-width:120px;text-align:center;text-decoration:none;\">⬇️ 下载 WAV</a>\n          <button class=\"common-btn\" onclick=\"vaReset()\" style=\"flex:1;min-width:120px;\">🔄 重新选择</button>\n        </div>\n      </div>\n      <div style=\"margin-top:16px;padding:12px 14px;border-radius:var(--radius-md);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(99,102,241,0.12);font-size:12px;line-height:1.7;color:var(--text-secondary);\">\n        <b>说明：</b>纯本地处理，文件不上传。支持 MP4/WebM/MOV 等浏览器可解码的视频格式，导出为 WAV 无损音频。大文件可能需要较长时间，请耐心等待。\n      </div>\n    </div>\n  </div>");
// ==================== 视频提取音频 ====================
let vaObjectUrl = null;
let vaCurrentFormat = 'wav';

function vaSetFormat(fmt){
  vaCurrentFormat = fmt;
  document.querySelectorAll('.va-format-btn').forEach(function(b){
    b.classList.toggle('active', b.dataset.format === fmt);
  });
  document.getElementById('vaMp3Options').style.display = fmt === 'mp3' ? 'flex' : 'none';
  document.getElementById('vaResult').style.display = 'none';
  document.getElementById('vaStatus').textContent = '';
}

function vaUpdateFileInfo(){
  const file = document.getElementById('vaFile').files[0];
  const chip = document.getElementById('vaFileChip');
  if(file){
    const sizeMB = (file.size / 1024 / 1024);
    const sizeStr = sizeMB >= 1 ? sizeMB.toFixed(2) + ' MB' : (file.size / 1024).toFixed(0) + ' KB';
    document.getElementById('vaChipName').textContent = file.name;
    document.getElementById('vaChipSize').textContent = sizeStr;
    chip.style.display = 'inline-flex';
  } else {
    chip.style.display = 'none';
  }
  document.getElementById('vaResult').style.display = 'none';
  document.getElementById('vaStatus').textContent = '';
}

function vaExtract(){
  const file = document.getElementById('vaFile').files[0];
  if(!file){ showToast('请先选择视频文件'); return; }
  const btn = document.getElementById('vaExtractBtn');
  const status = document.getElementById('vaStatus');
  const fmt = vaCurrentFormat;
  btn.disabled = true;
  btn.style.opacity = '0.6';
  status.textContent = fmt === 'mp3' ? '正在解码并转换为 MP3，请稍候...' : '正在解码音频，请稍候...';
  status.style.color = 'var(--text-secondary)';
  if(vaObjectUrl){ URL.revokeObjectURL(vaObjectUrl); vaObjectUrl = null; }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx();
  file.arrayBuffer().then(function(arrayBuffer){
    return audioCtx.decodeAudioData(arrayBuffer);
  }).then(function(audioBuffer){
    let blob;
    if(fmt === 'mp3'){
      const kbps = parseInt(document.getElementById('vaMp3Kbps').value);
      blob = vaEncodeMP3(audioBuffer, kbps);
    } else {
      blob = vaEncodeWAV(audioBuffer);
    }
    vaObjectUrl = URL.createObjectURL(blob);
    document.getElementById('vaAudio').src = vaObjectUrl;
    const dl = document.getElementById('vaDownload');
    dl.href = vaObjectUrl;
    dl.download = file.name.replace(/\.[^.]+$/, '') + '.' + fmt;
    dl.textContent = fmt === 'mp3' ? '⬇️ 下载 MP3' : '⬇️ 下载 WAV';
    document.getElementById('vaResult').style.display = 'block';
    const extra = fmt === 'mp3' ? '，比特率 ' + document.getElementById('vaMp3Kbps').value + 'kbps' : '';
    status.textContent = '提取完成！时长 ' + vaFormatTime(audioBuffer.duration) + '，采样率 ' + audioBuffer.sampleRate + 'Hz' + extra + '，大小 ' + (blob.size/1024/1024).toFixed(1) + 'MB';
    status.style.color = '#16a34a';
    btn.disabled = false;
    btn.style.opacity = '1';
    audioCtx.close();
  }).catch(function(err){
    console.error(err);
    status.textContent = '提取失败：该视频格式或编码浏览器无法解码，请尝试 MP4/WebM 格式';
    status.style.color = '#ef4444';
    btn.disabled = false;
    btn.style.opacity = '1';
    audioCtx.close();
  });
}

function vaEncodeWAV(audioBuffer){
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const numFrames = audioBuffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  vaWriteStr(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  vaWriteStr(view, 8, 'WAVE');
  vaWriteStr(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  vaWriteStr(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  const channels = [];
  for(let c = 0; c < numChannels; c++){ channels.push(audioBuffer.getChannelData(c)); }
  let offset = 44;
  for(let i = 0; i < numFrames; i++){
    for(let c = 0; c < numChannels; c++){
      let s = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
  }
  return new Blob([buffer], {type: 'audio/wav'});
}

function vaEncodeMP3(audioBuffer, kbps){
  const channels = Math.min(audioBuffer.numberOfChannels, 2);
  const sampleRate = audioBuffer.sampleRate;
  const left = audioBuffer.getChannelData(0);
  const right = channels > 1 ? audioBuffer.getChannelData(1) : null;
  const left16 = new Int16Array(left.length);
  for(let i = 0; i < left.length; i++){
    left16[i] = Math.max(-32768, Math.min(32767, left[i] * 32768));
  }
  let right16 = null;
  if(right){
    right16 = new Int16Array(right.length);
    for(let i = 0; i < right.length; i++){
      right16[i] = Math.max(-32768, Math.min(32767, right[i] * 32768));
    }
  }
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
  const blockSize = 1152;
  const mp3Data = [];
  for(let i = 0; i < left16.length; i += blockSize){
    const lChunk = left16.subarray(i, i + blockSize);
    const rChunk = right16 ? right16.subarray(i, i + blockSize) : null;
    const buf = rChunk ? encoder.encodeBuffer(lChunk, rChunk) : encoder.encodeBuffer(lChunk);
    if(buf.length > 0) mp3Data.push(buf);
  }
  const end = encoder.flush();
  if(end.length > 0) mp3Data.push(end);
  return new Blob(mp3Data, {type: 'audio/mpeg'});
}

function vaWriteStr(view, offset, str){
  for(let i = 0; i < str.length; i++){ view.setUint8(offset + i, str.charCodeAt(i)); }
}

function vaFormatTime(sec){
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function vaReset(){
  document.getElementById('vaFile').value = '';
  document.getElementById('vaFileChip').style.display = 'none';
  document.getElementById('vaResult').style.display = 'none';
  document.getElementById('vaStatus').textContent = '';
  if(vaObjectUrl){ URL.revokeObjectURL(vaObjectUrl); vaObjectUrl = null; }
}

// 视频提取音频 - 拖拽上传初始化
(function(){
  const area = document.getElementById('vaUploadArea');
  if(!area) return;
  area.addEventListener('dragover', function(e){
    e.preventDefault();
    e.stopPropagation();
    area.classList.add('dragover');
  });
  area.addEventListener('dragleave', function(e){
    e.preventDefault();
    e.stopPropagation();
    area.classList.remove('dragover');
  });
  area.addEventListener('drop', function(e){
    e.preventDefault();
    e.stopPropagation();
    area.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if(files.length > 0){
      const f = files[0];
      if(f.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|flv|wmv|m4v)$/i.test(f.name)){
        const dt = new DataTransfer();
        dt.items.add(f);
        document.getElementById('vaFile').files = dt.files;
        vaUpdateFileInfo();
      } else {
        showToast('请拖入视频文件');
      }
    }
  });
})();

