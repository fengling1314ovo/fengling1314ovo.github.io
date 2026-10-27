/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageAudioConverter", "<!-- pageAudioConverter -->\n<div class=\"tool-page\" id=\"pageAudioConverter\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 24px\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;\">\n        <h3 style=\"margin:0;\">🎶 音频转换</h3>\n        <button type=\"button\" onclick=\"flAudioShowHelp();document.activeElement.blur();\" style=\"background:var(--primary-bg);color:var(--primary);border:none;border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;font-weight:700;\">?</button>\n      </div>\n      <div id=\"flAudioToolHost\">\n        <div style=\"padding:16px;border:1px solid var(--border-color);border-radius:12px;background:var(--bg-input);color:var(--text-secondary);text-align:center;\">打开工具后加载音频处理模块</div>\n      </div>\n    </div>\n      <div id=\"flAudioHelpModal\" style=\"display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:9999;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .25s ease;\">\n      <div id=\"flAudioHelpCard\" style=\"background:var(--bg-card);border-radius:16px;padding:24px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);transform:scale(0.85) translateY(20px);transition:transform .25s ease;\">\n        <h4 style=\"margin:0 0 16px 0;font-size:17px;text-align:center;\">📖 使用说明</h4>\n        <div style=\"font-size:14px;line-height:2;color:var(--text-primary);\">\n          <div>普通音频可在本机转换为 WAV 或 MP3，并可裁剪、调节增益和淡入淡出。</div>\n          <div>音乐软件下载的音频有时采用加密格式，例如网易云音乐的 .ncm 文件。</div>\n          <div>本工具目前可以解密网易云音乐 NCM 格式。</div>\n          <div>QQ 音乐和酷狗音乐的大部分加密音频暂时无法解密。</div>\n          <div>请仅处理你有权使用的文件。</div>\n        </div>\n        <button type=\"button\" class=\"qr-btn\" style=\"margin-top:18px;width:100%;\" onclick=\"flAudioCloseHelp()\">知道了</button>\n      </div>\n    </div>\n</div>");
/* 本地加密音频提取器。仅在用户打开音频工具页后加载。 *//*
 * KWM/QMC implementation adapted from Aaron-gx/KGG-Decryptor.
 * MIT License
 * Copyright (c) 2026
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
  window.initFlAudioTool = function initFlAudioTool() {
    const host = document.getElementById("flAudioToolHost");
    if (!host || host.dataset.flAudioReady === "1") return;
    host.innerHTML = "<div class=\"fl-audio-root\"><div class=\"fl-audio-panel\" aria-label=\"本地音频文件处理\"><div class=\"content\">\n        <div class=\"drop\" id=\"dropZone\" role=\"button\" tabindex=\"0\" aria-label=\"选择或拖入音频文件\">\n      <span class=\"drop-icon\" aria-hidden=\"true\">📁</span>\n      <label id=\"fileLabel\" class=\"drop-prompt\" for=\"fileInput\" tabindex=\"0\" role=\"button\">点击或拖拽音频文件到此处</label>\n      <input id=\"fileInput\" type=\"file\" accept=\".mp3,.wav,.ogg,.oga,.flac,.aac,.m4a,.webm,.opus,.ncm,.kwm,.kmw,.mgg,.mgg0,.mgg1,.mggl,.mflac,.mflac0,.mflac1,.mflac2,.mflac3,.mflac4,.mflac5,.kgg,.kgg.flac,application/octet-stream\" multiple>\n      <small>支持 MP3 / WAV / OGG / FLAC / AAC / M4A，以及 NCM、KWM/KMW、MGG/MFLAC、KGG 文件。</small>\n    </div>\n    <label class=\"key-entry\" id=\"keyEntry\" for=\"ekeyInput\" hidden>对应的 ekey（可选）<input id=\"ekeyInput\" type=\"password\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"仅当解密失败提示需要时填写；不会保存或上传\"><small>输入后再次点击“提取音频”重试；密钥仅保留在当前页面。</small></label>\n    <div class=\"picked\" id=\"pickedBox\" aria-live=\"polite\">\n      <div class=\"picked-title\" id=\"pickedTitle\"></div>\n      <ul class=\"file-list\" id=\"fileList\"></ul>\n    </div>\n    <section class=\"normal-panel\" id=\"normalPanel\" hidden>\n      <h3 class=\"section-title\">⚙️ 转换参数</h3>\n      <div class=\"audio-info\" id=\"audioInfo\"></div>\n      <div class=\"setting-group\">\n        <label class=\"setting-label\" for=\"outputFormat\">输出格式</label>\n        <select id=\"outputFormat\"><option value=\"wav\">WAV（无损，推荐）</option><option value=\"mp3\">MP3（压缩）</option></select>\n      </div>\n      <div class=\"setting-group mp3-options\" id=\"mp3Options\" hidden>\n        <label class=\"setting-label\" for=\"mp3Bitrate\">MP3 比特率</label>\n        <select id=\"mp3Bitrate\"><option value=\"128\">128 kbps</option><option value=\"192\" selected>192 kbps</option><option value=\"256\">256 kbps</option><option value=\"320\">320 kbps</option></select>\n      </div>\n      <div class=\"setting-group\">\n        <label class=\"setting-label\" for=\"channelMode\">声道模式</label>\n        <select id=\"channelMode\"><option value=\"original\">保持原始</option><option value=\"mono\">单声道</option><option value=\"stereo\">立体声</option></select>\n      </div>\n      <div class=\"setting-group\">\n        <label class=\"setting-label\" for=\"sampleRate\">输出采样率</label>\n        <select id=\"sampleRate\"><option value=\"44100\">44100 Hz</option><option value=\"48000\">48000 Hz</option><option value=\"original\">保持原始</option></select>\n      </div>\n      <div class=\"setting-group\">\n        <label class=\"setting-label\" for=\"gainRange\">音量增益 <strong id=\"gainValue\">1.0x</strong></label>\n        <input id=\"gainRange\" type=\"range\" min=\"0\" max=\"2\" step=\"0.1\" value=\"1\">\n      </div>\n      <div class=\"setting-group\">\n        <label class=\"setting-label\" for=\"startRange\">裁剪 - 起始 <strong id=\"startValue\">0:00.0</strong></label>\n        <input id=\"startRange\" type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" value=\"0\">\n      </div>\n      <div class=\"setting-group\">\n        <label class=\"setting-label\" for=\"endRange\">裁剪 - 结束 <strong id=\"endValue\">0:00.0</strong></label>\n        <input id=\"endRange\" type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" value=\"1\">\n      </div>\n      <div class=\"setting-grid\">\n        <label class=\"setting-group\">淡入时长（秒）<input id=\"fadeIn\" type=\"number\" min=\"0\" step=\"0.1\" value=\"0\"></label>\n        <label class=\"setting-group\">淡出时长（秒）<input id=\"fadeOut\" type=\"number\" min=\"0\" step=\"0.1\" value=\"0\"></label>\n      </div>\n      <p class=\"normal-status\" id=\"normalStatus\" aria-live=\"polite\">正在读取音频信息…</p>\n    </section>\n    <div class=\"toolbar\">\n      <button class=\"button secondary\" id=\"previewButton\" type=\"button\" disabled hidden>预览结果</button>\n      <button class=\"button\" id=\"convertButton\" type=\"button\" disabled>提取音频</button>\n      <button class=\"button secondary\" id=\"clearButton\" type=\"button\" disabled>清空</button>\n    </div>\n    <section class=\"work\" id=\"workArea\" aria-live=\"polite\">\n      <div class=\"work-head\"><span id=\"workTitle\">准备中</span><span id=\"percent\">0%</span></div>\n      <progress id=\"progress\" max=\"100\" value=\"0\" aria-label=\"处理进度\"></progress>\n      <p class=\"status\" id=\"statusText\">等待开始。</p>\n      <div class=\"results\" id=\"results\"></div>\n    </section><div class=\"usage-card\">\n      <div><strong>支持格式：</strong>普通音频支持 MP3、WAV、OGG、FLAC、AAC、M4A；加密音频支持 NCM、KWM/KMW、MGG/MFLAC、KGG。</div>\n      <div><strong>使用方法：</strong>选择普通音频后设置输出格式和裁剪参数；选择加密音频后点击“提取音频”。</div>\n      <div><strong>提示：</strong>若加密失败并提示需要密钥，可填写对应 ekey 后重试；请仅处理你有权使用的文件。</div>\n    </div></div></div></div>";
    window.flInitRangeControls(host);
"use strict";

    // NCM format references: taurusxin/ncmdump and Johnserf-Seed/ncm2mp3.
    // AES block operations use the browser's native Web Crypto implementation.
    const CORE_AES_KEY = new TextEncoder().encode("hzHRAmso5kInbaxW");
    const NCM_KEY_PREFIX = new TextEncoder().encode("neteasecloudmusic");
    const NCM_MAGIC = new TextEncoder().encode("CTENFDAM");
    const AUDIO_CHUNK_SIZE = 512 * 1024;

    function concatBytes(a, b) {
      const joined = new Uint8Array(a.length + b.length);
      joined.set(a, 0);
      joined.set(b, a.length);
      return joined;
    }

    function equalAt(bytes, offset, expected) {
      if (offset + expected.length > bytes.length) return false;
      for (let i = 0; i < expected.length; i++) {
        if (bytes[offset + i] !== expected[i]) return false;
      }
      return true;
    }

    function stripPkcs7(bytes, label) {
      if (!bytes.length || bytes.length % 16 !== 0) {
        throw new Error(label + " 长度无效。");
      }
      const padding = bytes[bytes.length - 1];
      if (padding < 1 || padding > 16 || padding > bytes.length) {
        throw new Error(label + " 的填充无效，文件可能损坏或不是受支持的 NCM 文件。");
      }
      for (let i = bytes.length - padding; i < bytes.length; i++) {
        if (bytes[i] !== padding) throw new Error(label + " 的填充校验失败。");
      }
      return bytes.subarray(0, bytes.length - padding);
    }

    // NCM stores AES-128-ECB ciphertext. Web Crypto exposes AES-CBC, so use
    // CBC with a zero IV and correct each block's chaining XOR. A generated
    // terminal block decrypts to a full PKCS#7 pad, allowing Web Crypto to
    // return every original block without implementing AES in page code.
    async function decryptEcbBlocks(ciphertext, rawKey) {
      if (!ciphertext.length || ciphertext.length % 16 !== 0) {
        throw new Error("NCM 密钥块长度无效。");
      }
      if (!globalThis.crypto || !crypto.subtle) {
        throw new Error("当前浏览器未开放 Web Crypto。请用最新版 Chrome、Edge 或 Firefox 打开此文件。");
      }
      const key = await crypto.subtle.importKey("raw", rawKey, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
      const zeroIv = new Uint8Array(16);
      const lastBlock = ciphertext.subarray(ciphertext.length - 16);
      const fullPadding = new Uint8Array(16).fill(16);
      const encryptedTail = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv: lastBlock }, key, fullPadding));
      const paddedCiphertext = concatBytes(ciphertext, encryptedTail.subarray(0, 16));
      const plaintext = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-CBC", iv: zeroIv }, key, paddedCiphertext));
      if (plaintext.length !== ciphertext.length) throw new Error("AES 解密结果长度异常。");
      for (let offset = 16; offset < plaintext.length; offset += 16) {
        const previousCipherBlock = offset - 16;
        for (let i = 0; i < 16; i++) plaintext[offset + i] ^= ciphertext[previousCipherBlock + i];
      }
      return plaintext;
    }

    function makeNcmStreamKey(keyBytes) {
      if (!keyBytes.length) throw new Error("NCM 音频密钥为空。");
      const box = new Uint8Array(256);
      for (let i = 0; i < 256; i++) box[i] = i;
      let j = 0;
      for (let i = 0; i < 256; i++) {
        j = (j + box[i] + keyBytes[i % keyBytes.length]) & 0xff;
        const t = box[i]; box[i] = box[j]; box[j] = t;
      }
      return box;
    }

    function ncmStreamByte(box, offset) {
      const j = (offset + 1) & 0xff;
      return box[(box[j] + box[(box[j] + j) & 0xff]) & 0xff];
    }

    function detectAudioFormat(header) {
      const ascii = (start, text) => {
        if (start + text.length > header.length) return false;
        for (let i = 0; i < text.length; i++) if (header[start + i] !== text.charCodeAt(i)) return false;
        return true;
      };
      if (ascii(0, "ID3") || (header.length > 1 && header[0] === 0xff && (header[1] & 0xe0) === 0xe0)) {
        return { ext: "mp3", mime: "audio/mpeg", label: "MP3" };
      }
      if (ascii(0, "fLaC")) return { ext: "flac", mime: "audio/flac", label: "FLAC" };
      if (ascii(4, "ftyp")) return { ext: "m4a", mime: "audio/mp4", label: "M4A / MP4" };
      if (ascii(0, "OggS")) return { ext: "ogg", mime: "audio/ogg", label: "Ogg" };
      if (ascii(0, "RIFF") && ascii(8, "WAVE")) return { ext: "wav", mime: "audio/wav", label: "WAV" };
      if (ascii(0, "MAC ")) return { ext: "ape", mime: "audio/ape", label: "APE" };
      if (ascii(0, "DSD ") || ascii(0, "DSF ")) return { ext: "dsf", mime: "audio/dsf", label: "DSF" };
      if (header.length >= 4 && header[0] === 0x30 && header[1] === 0x26 && header[2] === 0xb2 && header[3] === 0x75) return { ext: "wma", mime: "audio/x-ms-wma", label: "WMA" };
      if (ascii(0, "FRM8")) return { ext: "dff", mime: "audio/dsf", label: "DFF / DSD" };
      if (header.length > 1 && header[0] === 0xff && (header[1] & 0xf6) === 0xf0) return { ext: "aac", mime: "audio/aac", label: "AAC" };
      return null;
    }

    async function parseNcmHeader(file) {
      let position = 0;
      const read = async (length, label) => {
        if (!Number.isSafeInteger(length) || length < 0 || position + length > file.size) {
          throw new Error("文件在" + label + "处意外结束，可能不完整或已损坏。");
        }
        const bytes = new Uint8Array(await file.slice(position, position + length).arrayBuffer());
        position += length;
        return bytes;
      };
      const readU32 = async (label) => {
        const bytes = await read(4, label);
        return new DataView(bytes.buffer, bytes.byteOffset, 4).getUint32(0, true);
      };

      const magic = await read(8, "文件头");
      if (!equalAt(magic, 0, NCM_MAGIC)) throw new Error("文件头不是 CTENFDAM；请选择有效的 .ncm 文件。");
      await read(2, "文件头间隔");

      const keyLength = await readU32("密钥长度");
      if (!keyLength || keyLength > 1024 * 1024) throw new Error("NCM 密钥块长度异常。");
      const keyCiphertext = await read(keyLength, "密钥块");
      for (let i = 0; i < keyCiphertext.length; i++) keyCiphertext[i] ^= 0x64;
      const paddedKey = await decryptEcbBlocks(keyCiphertext, CORE_AES_KEY);
      const decryptedKey = stripPkcs7(paddedKey, "NCM 密钥块");
      if (!equalAt(decryptedKey, 0, NCM_KEY_PREFIX)) throw new Error("密钥块标记不匹配；文件可能损坏或格式不受支持。");
      const audioKey = decryptedKey.subarray(NCM_KEY_PREFIX.length);
      if (!audioKey.length) throw new Error("NCM 音频密钥为空。");

      const metadataLength = await readU32("元数据长度");
      if (metadataLength > file.size - position) throw new Error("NCM 元数据长度超过文件范围。");
      position += metadataLength; // Metadata is optional for decrypting the audio payload.
      await read(4, "CRC 字段");
      await read(1, "封面版本字段");
      const coverFrameLength = await readU32("封面帧长度");
      const imageLength = await readU32("封面图片长度");
      if (imageLength > coverFrameLength) throw new Error("封面图片长度超过封面帧长度。");
      await read(imageLength, "封面图片");
      const paddingLength = coverFrameLength - imageLength;
      await read(paddingLength, "封面帧填充");
      if (position >= file.size) throw new Error("文件中没有音频数据。");
      return { audioKey, audioStart: position, audioSize: file.size - position };
    }

    async function decodeNcmFile(file, onProgress) {
      const header = await parseNcmHeader(file);
      const audioHeaderLength = Math.min(16, header.audioSize);
      const encryptedHeader = new Uint8Array(await file.slice(header.audioStart, header.audioStart + audioHeaderLength).arrayBuffer());
      const streamKey = makeNcmStreamKey(header.audioKey);
      for (let i = 0; i < encryptedHeader.length; i++) encryptedHeader[i] ^= ncmStreamByte(streamKey, i);
      const format = detectAudioFormat(encryptedHeader);
      if (!format) throw new Error("NCM 已解密，但音频头不是本工具识别的格式；请检查文件完整性。");

      const parts = [];
      let completed = 0;
      if (onProgress) onProgress(0, format.label);
      while (completed < header.audioSize) {
        const length = Math.min(AUDIO_CHUNK_SIZE, header.audioSize - completed);
        const chunk = new Uint8Array(await file.slice(header.audioStart + completed, header.audioStart + completed + length).arrayBuffer());
        for (let i = 0; i < chunk.length; i++) chunk[i] ^= ncmStreamByte(streamKey, completed + i);
        parts.push(chunk);
        completed += chunk.length;
        if (onProgress) onProgress(Math.floor(completed * 100 / header.audioSize), format.label);
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return { blob: new Blob(parts, { type: format.mime }), format, size: header.audioSize };
    }

    // KWM and QMC algorithms follow the MIT-licensed KGG-Decryptor reference.
    // The page does not retrieve keys or inspect application databases.
    const KWM_MAGIC_A = new TextEncoder().encode("yeelion-kuwo-tme");
    const KWM_MAGIC_B = new Uint8Array([121,101,101,108,105,111,110,45,107,117,119,111,0,0,0,0]);
    const KWM_BASE_KEY = new TextEncoder().encode("MoOtOiTvINGwd2E6n0E1i7L5t2IoOoNk");
    const KGM_MAGIC = new Uint8Array([0x7c,0xd5,0x32,0xeb,0x86,0x02,0x7f,0x4b,0xa8,0xaf,0xa6,0x8e,0x0f,0xff,0x99,0x14]);
    const QMC_STATIC_BOX = new Uint8Array([
      0x77,0x48,0x32,0x73,0xde,0xf2,0xc0,0xc8,0x95,0xec,0x30,0xb2,0x51,0xc3,0xe1,0xa0,
      0x9e,0xe6,0x9d,0xcf,0xfa,0x7f,0x14,0xd1,0xce,0xb8,0xdc,0xc3,0x4a,0x67,0x93,0xd6,
      0x28,0xc2,0x91,0x70,0xca,0x8d,0xa2,0xa4,0xf0,0x08,0x61,0x90,0x7e,0x6f,0xa2,0xe0,
      0xeb,0xae,0x3e,0xb6,0x67,0xc7,0x92,0xf4,0x91,0xb5,0xf6,0x6c,0x5e,0x84,0x40,0xf7,
      0xf3,0x1b,0x02,0x7f,0xd5,0xab,0x41,0x89,0x28,0xf4,0x25,0xcc,0x52,0x11,0xad,0x43,
      0x68,0xa6,0x41,0x8b,0x84,0xb5,0xff,0x2c,0x92,0x4a,0x26,0xd8,0x47,0x6a,0x7c,0x95,
      0x61,0xcc,0xe6,0xcb,0xbb,0x3f,0x47,0x58,0x89,0x75,0xc3,0x75,0xa1,0xd9,0xaf,0xcc,
      0x08,0x73,0x17,0xdc,0xaa,0x9a,0xa2,0x16,0x41,0xd8,0xa2,0x06,0xc6,0x8b,0xfc,0x66,
      0x34,0x9f,0xcf,0x18,0x23,0xa0,0x0a,0x74,0xe7,0x2b,0x27,0x70,0x92,0xe9,0xaf,0x37,
      0xe6,0x8c,0xa7,0xbc,0x62,0x65,0x9c,0xc2,0x08,0xc9,0x88,0xb3,0xf3,0x43,0xac,0x74,
      0x2c,0x0f,0xd4,0xaf,0xa1,0xc3,0x01,0x64,0x95,0x4e,0x48,0x9f,0xf4,0x35,0x78,0x95,
      0x7a,0x39,0xd6,0x6a,0xa0,0x6d,0x40,0xe8,0x4f,0xa8,0xef,0x11,0x1d,0xf3,0x1b,0x3f,
      0x3f,0x07,0xdd,0x6f,0x5b,0x19,0x30,0x19,0xfb,0xef,0x0e,0x37,0xf0,0x0e,0xcd,0x16,
      0x49,0xfe,0x53,0x47,0x13,0x1a,0xbd,0xa4,0xf1,0x40,0x19,0x60,0x0e,0xed,0x68,0x09,
      0x06,0x5f,0x4d,0xcf,0x3d,0x1a,0xfe,0x20,0x77,0xe4,0xd9,0xda,0xf9,0xa4,0x2b,0x76,
      0x1c,0x71,0xdb,0x00,0xbc,0xfd,0x0c,0x6c,0xa5,0x47,0xf7,0xf6,0x00,0x79,0x4a,0x11
    ]);

    async function readFileRange(file, start, length, label) {
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(length) || start < 0 || length < 0 || start + length > file.size) {
        throw new Error((label || "文件数据") + "长度不足，文件可能不完整。");
      }
      return new Uint8Array(await file.slice(start, start + length).arrayBuffer());
    }

    function readU32LE(bytes, offset) {
      if (offset < 0 || offset + 4 > bytes.length) throw new Error("加密文件头长度不足。");
      return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, true);
    }

    function readU32BE(bytes, offset) {
      if (offset < 0 || offset + 4 > bytes.length) throw new Error("加密文件头长度不足。");
      return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, false);
    }

    function bytesEqual(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    }

    function decodeBase64(text) {
      let value = String(text || "").replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
      if (!value) throw new Error("ekey 为空。");
      while (value.length % 4) value += "=";
      let binary;
      try { binary = atob(value); } catch (_) { throw new Error("ekey 不是有效的 Base64 文本。"); }
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }

    function teaDecryptBlock(block, key) {
      const input = new DataView(block.buffer, block.byteOffset, 8);
      const keyView = new DataView(key.buffer, key.byteOffset, 16);
      let v0 = input.getUint32(0, false), v1 = input.getUint32(4, false);
      const k0 = keyView.getUint32(0, false), k1 = keyView.getUint32(4, false);
      const k2 = keyView.getUint32(8, false), k3 = keyView.getUint32(12, false);
      let sum = Math.imul(0x9e3779b9, 16) >>> 0;
      for (let round = 0; round < 16; round++) {
        let t = ((((v0 << 4) + k2) >>> 0) ^ ((v0 + sum) >>> 0) ^ (((v0 >>> 5) + k3) >>> 0)) >>> 0;
        v1 = (v1 - t) >>> 0;
        t = ((((v1 << 4) + k0) >>> 0) ^ ((v1 + sum) >>> 0) ^ (((v1 >>> 5) + k1) >>> 0)) >>> 0;
        v0 = (v0 - t) >>> 0;
        sum = (sum - 0x9e3779b9) >>> 0;
      }
      const out = new Uint8Array(8);
      const view = new DataView(out.buffer);
      view.setUint32(0, v0, false); view.setUint32(4, v1, false);
      return out;
    }

    function decryptTencentTea(input, key) {
      if (input.length < 16 || input.length % 8 || key.length !== 16) throw new Error("ekey 的 TEA 数据长度无效。");
      let dest = teaDecryptBlock(input.subarray(0, 8), key);
      const padLength = dest[0] & 7;
      const outputLength = input.length - 1 - padLength - 2 - 7;
      if (outputLength < 0) throw new Error("ekey 的 TEA 填充无效。");
      let ivPrev = new Uint8Array(8), ivCurrent = input.slice(0, 8);
      let inputPosition = 8, destIndex = 1 + padLength;
      const nextBlock = () => {
        const oldPrev = ivPrev; ivPrev = ivCurrent; ivCurrent = oldPrev;
        ivCurrent = input.slice(inputPosition, inputPosition + 8);
        if (ivCurrent.length !== 8) throw new Error("ekey 的 TEA 数据被截断。");
        for (let i = 0; i < 8; i++) dest[i] ^= ivCurrent[i];
        dest = teaDecryptBlock(dest, key);
        inputPosition += 8;
        destIndex = 0;
      };
      let skipped = 0;
      while (skipped < 2) {
        if (destIndex < 8) { destIndex++; skipped++; }
        else nextBlock();
      }
      const output = new Uint8Array(outputLength);
      let outputPosition = 0;
      while (outputPosition < outputLength) {
        if (destIndex < 8) {
          output[outputPosition++] = dest[destIndex] ^ ivPrev[destIndex++];
        } else nextBlock();
      }
      return output;
    }

    function deriveEkey(ekeyText) {
      const decoded = decodeBase64(ekeyText);
      const v2Prefix = new TextEncoder().encode("QQMusic EncV2,Key:");
      let raw = decoded;
      if (equalAt(decoded, 0, v2Prefix)) {
        const key1 = new Uint8Array([0x33,0x38,0x36,0x5a,0x4a,0x59,0x21,0x40,0x23,0x2a,0x24,0x25,0x5e,0x26,0x29,0x28]);
        const key2 = new Uint8Array([0x2a,0x2a,0x23,0x21,0x28,0x23,0x24,0x25,0x26,0x5e,0x61,0x31,0x63,0x5a,0x2c,0x54]);
        const stageOne = decryptTencentTea(decoded.subarray(v2Prefix.length), key1);
        const stageTwo = decryptTencentTea(stageOne, key2);
        raw = decodeBase64(new TextDecoder().decode(stageTwo));
      }
      if (raw.length < 16) throw new Error("ekey 数据太短，无法建立解密密钥。");
      const teaKey = new Uint8Array(16);
      for (let i = 0; i < 8; i++) {
        const value = Math.abs(Math.tan(106 + i * 0.1) * 100);
        teaKey[i * 2] = Math.min(255, Math.trunc(value));
        teaKey[i * 2 + 1] = raw[i];
      }
      const resultTail = decryptTencentTea(raw.subarray(8), teaKey);
      const result = new Uint8Array(8 + resultTail.length);
      result.set(raw.subarray(0, 8)); result.set(resultTail, 8);
      if (!result.length) throw new Error("ekey 没有生成有效密钥。");
      return result;
    }

    function makeQmcCipher(key) {
      if (!key || !key.length) throw new Error("ekey 未生成有效密钥。");
      if (key.length <= 300) return { kind: "map", key };
      const state = new Uint8Array(key.length);
      for (let i = 0; i < state.length; i++) state[i] = i & 0xff;
      let j = 0;
      for (let i = 0; i < state.length; i++) {
        j = (j + state[i] + key[i % key.length]) % state.length;
        const value = state[i]; state[i] = state[j]; state[j] = value;
      }
      let hash = 1;
      for (const value of key) {
        if (!value) continue;
        const next = Math.imul(hash, value) >>> 0;
        if (!next || next <= hash) break;
        hash = next;
      }
      return { kind: "rc4", key, state, hash };
    }

    function qmcSkip(cipher, id) {
      const seed = cipher.key[id % cipher.key.length];
      const denominator = (id + 1) * seed;
      if (!denominator) return 0;
      return Math.floor((cipher.hash / denominator) * 100) % cipher.key.length;
    }

    function qmcRc4Segment(bytes, start, length, offset, cipher) {
      const keyLength = cipher.key.length;
      const state = cipher.state.slice();
      const skip = (offset % 5120) + qmcSkip(cipher, Math.floor(offset / 5120));
      let j = 0, k = 0;
      for (let i = -skip; i < length; i++) {
        j = (j + 1) % keyLength;
        k = (state[j] + k) % keyLength;
        const value = state[j]; state[j] = state[k]; state[k] = value;
        if (i >= 0) bytes[start + i] ^= state[(state[j] + state[k]) % keyLength];
      }
    }

    function decryptQmc(bytes, offset, cipher) {
      if (cipher.kind === "static") {
        for (let i = 0; i < bytes.length; i++) {
          const at = offset + i;
          const period = at > 0x7fff ? at % 0x7fff : at;
          bytes[i] ^= QMC_STATIC_BOX[(period * period + 27) & 0xff];
        }
        return;
      }
      if (cipher.kind === "map") {
        const key = cipher.key, size = key.length;
        for (let i = 0; i < bytes.length; i++) {
          const at = offset + i;
          const period = at > 0x7fff ? at % 0x7fff : at;
          const index = (period * period + 71214) % size;
          const value = key[index], shift = ((index & 7) + 4) % 8;
          bytes[i] ^= ((value << shift) | (value >>> shift)) & 0xff;
        }
        return;
      }
      let off = offset, processed = 0, remaining = bytes.length;
      if (off < 128) {
        const amount = Math.min(remaining, 128 - off);
        for (let i = 0; i < amount; i++) bytes[processed + i] ^= cipher.key[qmcSkip(cipher, off + i)];
        off += amount; remaining -= amount; processed += amount;
      }
      if (remaining > 0 && off % 5120 !== 0) {
        const amount = Math.min(remaining, 5120 - off % 5120);
        qmcRc4Segment(bytes, processed, amount, off, cipher);
        off += amount; remaining -= amount; processed += amount;
      }
      while (remaining > 5120) {
        qmcRc4Segment(bytes, processed, 5120, off, cipher);
        off += 5120; remaining -= 5120; processed += 5120;
      }
      if (remaining > 0) qmcRc4Segment(bytes, processed, remaining, off, cipher);
    }

    function decryptWithCipher(bytes, offset, cipher) {
      if (cipher.kind === "kwm") {
        for (let i = 0; i < bytes.length; i++) bytes[i] ^= cipher.mask[(offset + i) & 31];
      } else decryptQmc(bytes, offset, cipher);
    }

    async function parseKwmFile(file) {
      if (file.size <= 0x400) throw new Error("KWM 文件太短或没有音频数据。");
      const header = await readFileRange(file, 0, 0x20, "KWM 文件头");
      if (!equalAt(header, 0, KWM_MAGIC_A) && !equalAt(header, 0, KWM_MAGIC_B)) {
        throw new Error("文件头不是酷我 KWM 格式；.kmw 也只会按 KWM 文件头识别。");
      }
      const keyView = new DataView(header.buffer, header.byteOffset + 0x18, 8);
      const keyText = keyView.getBigUint64(0, true).toString(10);
      const repeated = new TextEncoder().encode(keyText.repeat(Math.ceil(32 / keyText.length)).slice(0, 32));
      const mask = new Uint8Array(32);
      for (let i = 0; i < 32; i++) mask[i] = KWM_BASE_KEY[i] ^ repeated[i];
      return { audioStart: 0x400, audioSize: file.size - 0x400, cipher: { kind: "kwm", mask }, label: "KWM" };
    }

    async function parseKggFile(file, ekeyText) {
      const header = await readFileRange(file, 0, Math.min(file.size, 0x48), "KGG 文件头");
      if (file.size < 0x4c || !equalAt(header, 0, KGM_MAGIC)) throw new Error("不是受支持的 KGG/KGM 文件头。");
      const audioStart = readU32LE(header, 0x10);
      const version = readU32LE(header, 0x14);
      if (version !== 5) throw new Error("当前只支持 KGG v5；文件版本为 " + version + "。");
      const hashLengthBytes = await readFileRange(file, 0x44, 4, "KGG 密钥标识");
      const hashLength = readU32LE(hashLengthBytes, 0);
      if (!hashLength || hashLength > 4096 || 0x48 + hashLength > file.size || audioStart > file.size || audioStart < 0x48 + hashLength) {
        throw new Error("KGG v5 文件头中的音频偏移或密钥标识无效。");
      }
      if (!ekeyText) throw new Error("KGG v5 需要这首歌对应的 ekey。请从你有权使用的密钥来源中取得后，在上方本地输入；本工具不会扫描数据库或联网取钥。");
      const key = deriveEkey(ekeyText);
      return { audioStart, audioSize: file.size - audioStart, cipher: makeQmcCipher(key), label: "KGG v5" };
    }

    async function parseQmcFile(file, ekeyText) {
      if (file.size < 4) throw new Error("MGG/MFLAC 文件太短。");
      const tailLength = Math.min(file.size, 16);
      const tail = await readFileRange(file, file.size - tailLength, tailLength, "QMC 文件尾部");
      let audioSize = file.size, cipher = null, label = "MGG/MFLAC";
      if (tailLength === 16 && equalAt(tail, 8, new TextEncoder().encode("musicex\0"))) {
        const footerLength = readU32LE(tail, 0), version = readU32LE(tail, 4);
        if (footerLength !== 0xc0 || version !== 1 || footerLength + 16 >= file.size) throw new Error("新版 musicex 文件尾部版本或长度无效。");
        if (!ekeyText) throw new Error("这个新版 musicex 文件需要有效的 QQ 音乐会话 ekey；本工具不会联网取钥。");
        audioSize -= footerLength + 16;
        cipher = makeQmcCipher(deriveEkey(ekeyText));
        label = "MGG/MFLAC musicex（本地 ekey）";
      } else if (equalAt(tail, tail.length - 4, new TextEncoder().encode("STag"))) {
        if (!ekeyText) throw new Error("此 STag 文件没有可离线读取的密钥；若你持有匹配 ekey，可在上方输入。");
        if (file.size >= 8) {
          const footer = await readFileRange(file, file.size - 8, 8, "STag 尾部");
          const metadataLength = readU32BE(footer, 0);
          audioSize -= metadataLength > 0 && metadataLength <= 256 && metadataLength + 8 < file.size ? metadataLength + 8 : 4;
        } else audioSize -= 4;
        cipher = makeQmcCipher(deriveEkey(ekeyText));
        label += "（本地 ekey）";
      } else if (equalAt(tail, tail.length - 4, new TextEncoder().encode("QTag"))) {
        if (tail.length < 8) throw new Error("QTag 文件太短。");
        const lengthBytes = await readFileRange(file, file.size - 8, 4, "QTag ekey 长度");
        const keyLength = readU32BE(lengthBytes, 0);
        if (!keyLength || keyLength > 0xffff || keyLength + 8 > file.size) throw new Error("QTag ekey 长度无效。");
        audioSize = file.size - 8 - keyLength;
        const raw = await readFileRange(file, audioSize, keyLength, "QTag ekey");
        const comma = raw.indexOf(0x2c);
        const embeddedText = new TextDecoder().decode(comma >= 0 ? raw.subarray(0, comma) : raw).trim();
        cipher = makeQmcCipher(deriveEkey(ekeyText || embeddedText));
        label += "（QTag ekey）";
      } else {
        const lengthBytes = await readFileRange(file, file.size - 4, 4, "QMC 文件尾");
        const keyLength = readU32LE(lengthBytes, 0);
        if (keyLength > 0 && keyLength <= 0xffff && keyLength + 4 < file.size) {
          const candidateSize = file.size - 4 - keyLength;
          const raw = await readFileRange(file, candidateSize, keyLength, "QMC ekey");
          const embeddedText = new TextDecoder().decode(raw).replace(/\0+$/g, "").trim();
          if (/^[A-Za-z0-9+/_=-]{16,}$/.test(embeddedText)) {
            audioSize = candidateSize;
            cipher = makeQmcCipher(deriveEkey(ekeyText || embeddedText));
            label += ekeyText ? "（本地 ekey）" : "（尾部 ekey）";
          }
        }
        if (!cipher && ekeyText) {
          cipher = makeQmcCipher(deriveEkey(ekeyText));
          label += "（本地 ekey）";
        }
        if (!cipher) {
          cipher = { kind: "static" };
          label += "（旧版静态密钥）";
        }
      }
      if (!audioSize) throw new Error("文件中没有音频数据。");
      return { audioStart: 0, audioSize, cipher, label };
    }

    async function decodeWithCipher(file, header, onProgress) {
      const probeSize = Math.min(16, header.audioSize);
      const probe = await readFileRange(file, header.audioStart, probeSize, "音频数据");
      decryptWithCipher(probe, 0, header.cipher);
      const format = detectAudioFormat(probe);
      if (!format && header.label.startsWith("MGG/MFLAC")) {
        throw new Error("MGG/MFLAC 解密后未识别到音频头。不同客户端版本的密钥格式可能不同；请确认文件完整，并确认使用了这首歌对应、且与来源客户端匹配的 ekey。没有匹配密钥时无法离线解密。");
      }
      if (!format) throw new Error("解密后未识别出音频头；请确认文件完整，并检查是否需要该歌曲匹配的 ekey。");
      const parts = [];
      let completed = 0;
      if (onProgress) onProgress(0, format.label + " · " + header.label);
      while (completed < header.audioSize) {
        const length = Math.min(AUDIO_CHUNK_SIZE, header.audioSize - completed);
        const chunk = await readFileRange(file, header.audioStart + completed, length, "音频数据");
        decryptWithCipher(chunk, completed, header.cipher);
        parts.push(chunk);
        completed += chunk.length;
        if (onProgress) onProgress(Math.floor(completed * 100 / header.audioSize), format.label + " · " + header.label);
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return { blob: new Blob(parts, { type: format.mime }), format, size: header.audioSize };
    }

    async function decodeAudioFile(file, onProgress, ekeyText) {
      const extension = (file.name.split(".").pop() || "").toLowerCase();
      if (extension === "ncm") return decodeNcmFile(file, onProgress);
      let header;
      if (extension === "kwm" || extension === "kmw") header = await parseKwmFile(file);
      else if (extension === "kgg" || file.name.toLowerCase().endsWith(".kgg.flac")) header = await parseKggFile(file, ekeyText);
      else if (["mgg","mgg0","mgg1","mggl","mflac","mflac0","mflac1","mflac2","mflac3","mflac4","mflac5"].includes(extension)) header = await parseQmcFile(file, ekeyText);
      else throw new Error("暂不支持此文件扩展名。支持 NCM、KWM/KMW、MGG/MFLAC 和 KGG。");
      return decodeWithCipher(file, header, onProgress);
    }

    const fileInput = document.getElementById("fileInput");
    const ekeyInput = document.getElementById("ekeyInput");
    const keyEntry = document.getElementById("keyEntry");
    const fileLabel = document.getElementById("fileLabel");
    const dropZone = document.getElementById("dropZone");
    const pickedBox = document.getElementById("pickedBox");
    const pickedTitle = document.getElementById("pickedTitle");
    const fileList = document.getElementById("fileList");
    const previewButton = document.getElementById("previewButton");
    const convertButton = document.getElementById("convertButton");
    const clearButton = document.getElementById("clearButton");
    const workArea = document.getElementById("workArea");
    const workTitle = document.getElementById("workTitle");
    const percent = document.getElementById("percent");
    const progress = document.getElementById("progress");
    const statusText = document.getElementById("statusText");
    const results = document.getElementById("results");
    const normalPanel = document.getElementById("normalPanel");
    const audioInfo = document.getElementById("audioInfo");
    const normalStatus = document.getElementById("normalStatus");
    const outputFormat = document.getElementById("outputFormat");
    const mp3Options = document.getElementById("mp3Options");
    const mp3Bitrate = document.getElementById("mp3Bitrate");
    const channelMode = document.getElementById("channelMode");
    const sampleRate = document.getElementById("sampleRate");
    const gainRange = document.getElementById("gainRange");
    const gainValue = document.getElementById("gainValue");
    const startRange = document.getElementById("startRange");
    const startValue = document.getElementById("startValue");
    const endRange = document.getElementById("endRange");
    const endValue = document.getElementById("endValue");
    const fadeIn = document.getElementById("fadeIn");
    const fadeOut = document.getElementById("fadeOut");
    let selectedFiles = [];
    let objectUrls = [];
    let sourceAudioBuffer = null;
    let loadRevision = 0;
    let isProcessing = false;
    let previewContext = null;
    let previewSource = null;
    let previewToken = 0;

    function formatBytes(value) {
      if (value < 1024) return value + " B";
      if (value < 1024 * 1024) return (value / 1024).toFixed(1) + " KB";
      return (value / (1024 * 1024)).toFixed(1) + " MB";
    }

    function formatTime(value) {
      const seconds = Math.max(0, Number(value) || 0);
      const minutes = Math.floor(seconds / 60);
      const tail = (seconds % 60).toFixed(1).padStart(4, "0");
      return minutes + ":" + tail;
    }

    function isStandardAudio(file) {
      if (!file || /\.(?:ncm|kwm|kmw|mgg(?:0|1|l)?|mflac[0-5]?|kgg(?:\.flac)?)$/i.test(file.name)) return false;
      return /\.(?:mp3|wav|ogg|oga|flac|aac|m4a|webm|opus)$/i.test(file.name);
    }

    function clearObjectUrls() {
      for (const url of objectUrls) URL.revokeObjectURL(url);
      objectUrls = [];
    }

    function updateCropLabels() {
      const duration = sourceAudioBuffer ? sourceAudioBuffer.duration : Number(endRange.max) || 0;
      const gap = Math.min(0.1, duration);
      startRange.max = String(Math.max(0, (Number(endRange.value) || duration) - gap));
      const start = Number(startRange.value) || 0;
      endRange.min = String(Math.min(duration, start + gap));
      const end = Number(endRange.value) || duration;
      startValue.textContent = formatTime(start);
      endValue.textContent = formatTime(end);
      gainValue.textContent = (Number(gainRange.value) || 0).toFixed(1) + "x";
      window.flUpdateRangeControl(gainRange);
      window.flUpdateRangeControl(startRange);
      window.flUpdateRangeControl(endRange);
    }

    function fillAudioInfo(file, buffer) {
      audioInfo.replaceChildren();
      const rows = [
        ["📄 文件名", file.name],
        ["📏 时长", formatTime(buffer.duration)],
        ["📊 采样率", buffer.sampleRate + " Hz"],
        ["🔊 声道", buffer.numberOfChannels === 1 ? "单声道" : buffer.numberOfChannels === 2 ? "立体声" : buffer.numberOfChannels + " 声道"],
        ["💾 原始大小", formatBytes(file.size)]
      ];
      for (const item of rows) {
        const row = document.createElement("div");
        row.className = "audio-meta-row";
        const label = document.createElement("span");
        const value = document.createElement("strong");
        label.textContent = item[0];
        value.textContent = item[1];
        row.append(label, value);
        audioInfo.append(row);
      }
    }

    async function prepareStandardAudio(file, revision) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) { normalStatus.textContent = "当前浏览器不支持音频解码。"; return; }
      const context = new AudioContextClass();
      try {
        normalStatus.textContent = "正在读取音频信息…";
        const buffer = await context.decodeAudioData(await file.arrayBuffer());
        if (revision !== loadRevision) return;
        sourceAudioBuffer = buffer;
        previewButton.disabled = false;
        fillAudioInfo(file, buffer);
        startRange.min = "0"; startRange.max = String(Math.max(0, buffer.duration - 0.1)); startRange.value = "0";
        endRange.min = String(Math.min(0.1, buffer.duration)); endRange.max = String(buffer.duration); endRange.value = String(buffer.duration);
        updateCropLabels();
        normalStatus.textContent = "音频已读取，可以设置转换和裁剪参数。";
        convertButton.disabled = false;
      } catch (error) {
        if (revision !== loadRevision) return;
        normalStatus.textContent = "浏览器无法解码这个文件；请尝试 MP3、WAV、OGG、FLAC、AAC 或 M4A。";
        convertButton.disabled = true;
        previewButton.disabled = true;
      } finally {
        if (context.state !== "closed") await context.close().catch(() => {});
      }
    }

    function setFiles(files) {
      if (isProcessing) return;
      stopAudioPreview();
      let incoming = Array.from(files || []).filter(file => file && file.size > 0);
      const normalFiles = incoming.filter(isStandardAudio);
      let limitedSelection = false;
      if (normalFiles.length && incoming.length > 1) { incoming = [normalFiles[0]]; limitedSelection = true; }
      selectedFiles = incoming;
      const revision = ++loadRevision;
      sourceAudioBuffer = null;
      keyEntry.hidden = true; ekeyInput.value = "";
      normalPanel.hidden = !(selectedFiles.length === 1 && isStandardAudio(selectedFiles[0]));
      const normalMode = !normalPanel.hidden;
      previewButton.hidden = !normalMode;
      previewButton.disabled = !sourceAudioBuffer || !normalMode;
      previewButton.textContent = "预览结果";
      convertButton.textContent = normalMode ? "转换 / 裁剪音频" : "提取音频";
      pickedBox.classList.toggle("show", selectedFiles.length > 0);
      pickedTitle.textContent = selectedFiles.length ? "已选择 " + selectedFiles.length + " 个文件" + (limitedSelection ? "（普通音频一次处理一个）" : "") : "";
      fileList.replaceChildren();
      for (const file of selectedFiles) {
        const li = document.createElement("li");
        const name = document.createElement("span");
        const size = document.createElement("span");
        name.className = "name"; name.textContent = file.name;
        size.className = "size"; size.textContent = formatBytes(file.size);
        li.append(name, size); fileList.append(li);
      }
      convertButton.disabled = selectedFiles.length === 0 || normalMode;
      clearButton.disabled = selectedFiles.length === 0;
      workArea.classList.remove("show"); results.replaceChildren(); clearObjectUrls();
      if (normalMode) { normalStatus.textContent = "正在读取音频信息…"; prepareStandardAudio(selectedFiles[0], revision); }
    }

    function addResult(name, message, isError, downloadUrl, downloadName) {
      const row = document.createElement("div"); row.className = "result" + (isError ? " error" : "");
      const copy = document.createElement("div"); copy.className = "result-copy";
      const outputName = document.createElement("div"); outputName.className = "result-name"; outputName.textContent = name;
      const note = document.createElement("div"); note.className = "result-note"; note.textContent = message;
      copy.append(outputName, note); row.append(copy);
      if (downloadUrl) {
        const link = document.createElement("a"); link.className = "download"; link.href = downloadUrl;
        link.download = downloadName; link.textContent = "下载"; row.append(link);
      }
      results.append(row);
    }

    function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, Number(value) || 0)); }

    function closePreviewContext() {
      const context = previewContext;
      previewContext = null;
      if (context && context.state !== "closed") context.close().catch(() => {});
    }

    function refreshPreviewButton() {
      previewButton.textContent = "预览结果";
      previewButton.disabled = !sourceAudioBuffer || normalPanel.hidden || isProcessing;
    }

    function stopAudioPreview() {
      previewToken++;
      const source = previewSource;
      previewSource = null;
      if (source) {
        source.onended = null;
        try { source.stop(); } catch (_) {}
      }
      closePreviewContext();
      refreshPreviewButton();
    }

    async function renderEditedAudio(input, settings) {
      const duration = settings.end - settings.start;
      if (duration <= 0.02) throw new Error("裁剪时长太短，请调整起止位置。");
      const frames = Math.max(1, Math.ceil(duration * settings.sampleRate));
      const offline = new OfflineAudioContext(settings.channels, frames, settings.sampleRate);
      const source = offline.createBufferSource(); const gain = offline.createGain();
      source.buffer = input; source.connect(gain); gain.connect(offline.destination);
      const fadeInSeconds = Math.min(settings.fadeIn, duration);
      const fadeOutSeconds = Math.min(settings.fadeOut, Math.max(0, duration - fadeInSeconds));
      gain.gain.setValueAtTime(settings.gain, 0);
      if (fadeInSeconds > 0) { gain.gain.setValueAtTime(0, 0); gain.gain.linearRampToValueAtTime(settings.gain, fadeInSeconds); }
      if (fadeOutSeconds > 0) {
        gain.gain.setValueAtTime(settings.gain, Math.max(fadeInSeconds, duration - fadeOutSeconds));
        gain.gain.linearRampToValueAtTime(0, duration);
      }
      source.start(0, settings.start, duration);
      return offline.startRendering();
    }

    async function encodeWav(buffer, onProgress) {
      const channels = buffer.numberOfChannels, frames = buffer.length, bytesPerSample = 2;
      const dataSize = frames * channels * bytesPerSample;
      if (dataSize > 0xffffffff - 36) throw new Error("WAV 文件超过单文件大小限制，请缩短裁剪时长。");
      const array = new ArrayBuffer(44 + dataSize), view = new DataView(array);
      const writeText = (offset, value) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
      writeText(0, "RIFF"); view.setUint32(4, 36 + dataSize, true); writeText(8, "WAVE");
      writeText(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
      view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true);
      view.setUint32(28, buffer.sampleRate * channels * bytesPerSample, true);
      view.setUint16(32, channels * bytesPerSample, true); view.setUint16(34, 16, true);
      writeText(36, "data"); view.setUint32(40, dataSize, true);
      const channelData = Array.from({length: channels}, (_, channel) => buffer.getChannelData(channel));
      let offset = 44;
      for (let frame = 0; frame < frames; frame++) {
        for (let channel = 0; channel < channels; channel++) {
          const sample = clamp(channelData[channel][frame], -1, 1);
          view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true); offset += 2;
        }
        if (frame && frame % 300000 === 0) { onProgress(70 + Math.round(frame / frames * 25)); await new Promise(resolve => setTimeout(resolve, 0)); }
      }
      return new Blob([array], {type: "audio/wav"});
    }

    async function encodeMp3(buffer, kbps, onProgress) {
      const encoderLibrary = window.lamejs || (typeof lamejs !== "undefined" ? lamejs : null);
      if (!encoderLibrary || !encoderLibrary.Mp3Encoder) throw new Error("MP3 编码组件未加载；请检查网络后刷新页面，或改选 WAV。");
      const channels = Math.min(buffer.numberOfChannels, 2);
      const left = buffer.getChannelData(0), right = channels > 1 ? buffer.getChannelData(1) : null;
      const left16 = new Int16Array(left.length), right16 = right ? new Int16Array(right.length) : null;
      for (let i = 0; i < left.length; i++) {
        left16[i] = Math.max(-32768, Math.min(32767, left[i] * 32768));
        if (right16) right16[i] = Math.max(-32768, Math.min(32767, right[i] * 32768));
      }
      const encoder = new encoderLibrary.Mp3Encoder(channels, buffer.sampleRate, kbps);
      const blockSize = 1152, output = [];
      for (let i = 0; i < left16.length; i += blockSize) {
        const leftChunk = left16.subarray(i, i + blockSize), rightChunk = right16 ? right16.subarray(i, i + blockSize) : null;
        const chunk = rightChunk ? encoder.encodeBuffer(leftChunk, rightChunk) : encoder.encodeBuffer(leftChunk);
        if (chunk.length) output.push(chunk);
        if (i && i % (blockSize * 160) === 0) { onProgress(70 + Math.round(i / left16.length * 25)); await new Promise(resolve => setTimeout(resolve, 0)); }
      }
      const tail = encoder.flush(); if (tail.length) output.push(tail);
      return new Blob(output, {type: "audio/mpeg"});
    }

    fileInput.addEventListener("click", () => { fileInput.value = ""; });
    fileInput.addEventListener("change", () => setFiles(fileInput.files));
    fileLabel.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInput.click(); }
    });
    dropZone.addEventListener("click", event => {
      if (event.target !== fileInput && !event.target.closest("#fileLabel")) fileInput.click();
    });
    dropZone.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target === dropZone) { event.preventDefault(); fileInput.click(); }
    });
    clearButton.addEventListener("click", () => {
      stopAudioPreview();
      fileInput.value = ""; ekeyInput.value = ""; keyEntry.hidden = true; normalPanel.hidden = true;
      sourceAudioBuffer = null; loadRevision++; setFiles([]);
      statusText.textContent = "等待选择文件。"; percent.textContent = "0%"; progress.value = 0;
    });
    for (const eventName of ["dragenter", "dragover"]) {
      dropZone.addEventListener(eventName, event => { event.preventDefault(); dropZone.classList.add("dragover"); });
    }
    for (const eventName of ["dragleave", "drop"]) {
      dropZone.addEventListener(eventName, event => { event.preventDefault(); dropZone.classList.remove("dragover"); });
    }
    dropZone.addEventListener("drop", event => setFiles(event.dataTransfer.files));
    gainRange.addEventListener("input", updateCropLabels);
    startRange.addEventListener("input", () => {
      const duration = sourceAudioBuffer ? sourceAudioBuffer.duration : Number(endRange.max), gap = Math.min(0.1, duration);
      if (Number(startRange.value) > Number(endRange.value) - gap) endRange.value = String(Math.min(duration, Number(startRange.value) + gap));
      updateCropLabels();
    });
    endRange.addEventListener("input", () => {
      const duration = sourceAudioBuffer ? sourceAudioBuffer.duration : Number(endRange.max), gap = Math.min(0.1, duration);
      if (Number(endRange.value) < Number(startRange.value) + gap) startRange.value = String(Math.max(0, Number(endRange.value) - gap));
      updateCropLabels();
    });
    outputFormat.addEventListener("change", () => { mp3Options.hidden = outputFormat.value !== "mp3"; });

    previewButton.addEventListener("click", async () => {
      if (previewSource) {
        stopAudioPreview();
        normalStatus.textContent = "预览已停止。";
        return;
      }
      if (!sourceAudioBuffer || isProcessing) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        normalStatus.textContent = "当前浏览器不支持音频预览。";
        return;
      }

      const token = ++previewToken;
      previewButton.disabled = true;
      previewButton.textContent = "正在准备预览…";
      try {
        const context = new AudioContextClass();
        previewContext = context;
        await context.resume();
        if (token !== previewToken || previewContext !== context) return;

        const duration = sourceAudioBuffer.duration;
        const start = clamp(startRange.value, 0, duration);
        const end = clamp(endRange.value, start, duration);
        const playDuration = end - start;
        if (playDuration <= 0.02) throw new Error("裁剪时长太短，请调整起止位置。");

        const source = context.createBufferSource();
        const gainNode = context.createGain();
        source.buffer = sourceAudioBuffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);

        const gain = Number(gainRange.value);
        const fadeInSeconds = Math.min(clamp(fadeIn.value, 0, playDuration), playDuration);
        const fadeOutSeconds = Math.min(clamp(fadeOut.value, 0, playDuration), Math.max(0, playDuration - fadeInSeconds));
        const playAt = context.currentTime + 0.04;
        gainNode.gain.setValueAtTime(gain, playAt);
        if (fadeInSeconds > 0) {
          gainNode.gain.setValueAtTime(0, playAt);
          gainNode.gain.linearRampToValueAtTime(gain, playAt + fadeInSeconds);
        }
        if (fadeOutSeconds > 0) {
          gainNode.gain.setValueAtTime(gain, playAt + Math.max(fadeInSeconds, playDuration - fadeOutSeconds));
          gainNode.gain.linearRampToValueAtTime(0, playAt + playDuration);
        }

        previewSource = source;
        source.onended = () => {
          if (token !== previewToken || previewSource !== source) return;
          previewSource = null;
          closePreviewContext();
          refreshPreviewButton();
          normalStatus.textContent = "预览播放完成。";
        };
        previewButton.disabled = false;
        previewButton.textContent = "停止预览";
        normalStatus.textContent = "正在试听当前裁剪结果…";
        source.start(playAt, start, playDuration);
      } catch (error) {
        if (token !== previewToken) return;
        const source = previewSource;
        previewSource = null;
        if (source) {
          source.onended = null;
          try { source.stop(); } catch (_) {}
        }
        closePreviewContext();
        refreshPreviewButton();
        normalStatus.textContent = "预览失败：" + (error && error.message ? error.message : String(error));
      }
    });

    for (const control of [gainRange, startRange, endRange, fadeIn, fadeOut]) {
      control.addEventListener("input", stopAudioPreview);
    }
    for (const control of [channelMode, sampleRate, outputFormat, mp3Bitrate]) {
      control.addEventListener("change", stopAudioPreview);
    }
    convertButton.addEventListener("click", async () => {
      if (!selectedFiles.length || isProcessing) return;
      stopAudioPreview();
      isProcessing = true; convertButton.disabled = true; clearButton.disabled = true; previewButton.disabled = true; fileInput.disabled = true;
      workArea.classList.add("show"); results.replaceChildren(); clearObjectUrls();
      let succeeded = 0, failed = 0;
      for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index], normalMode = isStandardAudio(file);
        workTitle.textContent = "正在处理 " + (index + 1) + " / " + selectedFiles.length;
        percent.textContent = "0%"; progress.value = 0;
        statusText.textContent = file.name + (normalMode ? "：正在准备音频…" : "：正在读取文件头…");
        try {
          let outputBlob, outputName, outputLabel;
          if (normalMode) {
            if (!sourceAudioBuffer) throw new Error("音频还没有读取完成，稍后再试。");
            const duration = sourceAudioBuffer.duration;
            const startTime = clamp(startRange.value, 0, duration), endTime = clamp(endRange.value, startTime, duration);
            const chosenRate = sampleRate.value === "original" ? sourceAudioBuffer.sampleRate : Number(sampleRate.value);
            const settings = {
              start: startTime, end: endTime, gain: Number(gainRange.value),
              fadeIn: clamp(fadeIn.value, 0, endTime - startTime), fadeOut: clamp(fadeOut.value, 0, endTime - startTime),
              channels: channelMode.value === "mono" ? 1 : channelMode.value === "stereo" ? 2 : Math.min(sourceAudioBuffer.numberOfChannels, 2),
              sampleRate: chosenRate
            };
            if (outputFormat.value === "mp3" && ![8000,11025,12000,16000,22050,24000,32000,44100,48000].includes(settings.sampleRate)) settings.sampleRate = 44100;
            statusText.textContent = file.name + "：正在应用裁剪、增益和淡入淡出…";
            progress.value = 20; percent.textContent = "20%";
            const processed = await renderEditedAudio(sourceAudioBuffer, settings);
            progress.value = 65; percent.textContent = "65%";
            statusText.textContent = file.name + "：正在编码 " + outputFormat.value.toUpperCase() + "…";
            const baseName = file.name.replace(/\.[^.]+$/, "") || "audio";
            if (outputFormat.value === "mp3") {
              outputBlob = await encodeMp3(processed, Number(mp3Bitrate.value), value => { progress.value = value; percent.textContent = value + "%"; });
              outputName = baseName + ".mp3"; outputLabel = "MP3 " + mp3Bitrate.value + " kbps";
            } else {
              outputBlob = await encodeWav(processed, value => { progress.value = value; percent.textContent = value + "%"; });
              outputName = baseName + ".wav"; outputLabel = "WAV · " + processed.sampleRate + " Hz";
            }
          } else {
            const decoded = await decodeAudioFile(file, (value, formatLabel) => {
              progress.value = value; percent.textContent = value + "%";
              statusText.textContent = file.name + "：正在解密 " + formatLabel + " 音频…";
            }, ekeyInput.value.trim());
            const baseName = file.name.replace(/\.(kgg\.flac|ncm|kwm|kmw|mgg(?:0|1|l)?|mflac[0-5]?|kgg)$/i, "") || "audio";
            outputName = baseName + "." + decoded.format.ext; outputBlob = decoded.blob; outputLabel = decoded.format.label;
          }
          const url = URL.createObjectURL(outputBlob); objectUrls.push(url);
          addResult(outputName, outputLabel + " · " + formatBytes(outputBlob.size) + " · 已完成", false, url, outputName);
          succeeded++; statusText.textContent = file.name + (normalMode ? "：转换完成。" : "：提取完成。");
          progress.value = 100; percent.textContent = "100%";
        } catch (error) {
          failed++; const message = error instanceof Error ? error.message : "处理失败。";
          addResult(file.name, message, true); statusText.textContent = file.name + "：处理失败。";
          progress.value = 0; percent.textContent = "—";
          if (!normalMode) {
            keyEntry.hidden = false;
            requestAnimationFrame(() => keyEntry.scrollIntoView({behavior: "smooth", block: "center"}));
          }
        }
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      if (succeeded && !failed) { keyEntry.hidden = true; ekeyInput.value = ""; }
      workTitle.textContent = "处理结束：成功 " + succeeded + " 个" + (failed ? "，失败 " + failed + " 个" : "");
      if (succeeded && !failed) statusText.textContent = normalPanel.hidden ? "提取完成。使用每个文件旁的“下载”按钮保存音频。" : "转换完成。使用每个文件旁的“下载”按钮保存音频。";
      else if (succeeded) statusText.textContent = "部分文件失败；查看对应文件的提示后再试。";
      else statusText.textContent = "没有文件成功处理；查看错误提示并确认文件完整。";
      convertButton.textContent = normalPanel.hidden ? "提取音频" : "转换 / 裁剪音频";
      convertButton.disabled = selectedFiles.length === 0 || (!normalPanel.hidden && !sourceAudioBuffer);
      clearButton.disabled = selectedFiles.length === 0; fileInput.disabled = false; isProcessing = false;
      refreshPreviewButton();
    });

    window.addEventListener("beforeunload", clearObjectUrls);

    // Exposed for local format verification; no network or file upload is used.
    window.NCM_LOCAL_TOOL = { decodeNcmFile, decodeAudioFile, parseNcmHeader, detectAudioFormat, parseKwmFile, parseQmcFile, parseKggFile, decryptQmc, makeQmcCipher, deriveEkey };
    host.dataset.flAudioReady = "1";
  };
})();
