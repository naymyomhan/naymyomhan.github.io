/**
 * Pixel Art Portfolio - Interactive Scripts & 8-Bit Audio Engine
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. 8-BIT AUDIO SYNTHESIZER (Web Audio API)
  // ---------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  // Initialize Web Audio Context upon first user interaction (browser policy)
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play synthetic 8-bit sound tones
  function play8BitSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch (type) {
      case 'click':
        // Quick retro square wave blip
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
        break;

      case 'coin':
        // Super Mario style coin chirp: B5 (987.77Hz) -> E6 (1318.51Hz)
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.setValueAtTime(0.09, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'select':
        // High soft blip for filters
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.setValueAtTime(720, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'glitch':
        // Cyber digital glitch chirp
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.setValueAtTime(220, now + 0.03);
        osc.frequency.setValueAtTime(1400, now + 0.06);
        osc.frequency.setValueAtTime(320, now + 0.09);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
        break;

      case 'levelup':
        // RPG Level Up Arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
        notes.forEach((freq, i) => {
          const noteOsc = audioCtx.createOscillator();
          const noteGain = audioCtx.createGain();
          noteOsc.type = 'square';
          noteOsc.frequency.setValueAtTime(freq, now + (i * 0.07));
          noteGain.gain.setValueAtTime(0.07, now + (i * 0.07));
          noteGain.gain.linearRampToValueAtTime(0.001, now + (i * 0.07) + 0.12);
          noteOsc.connect(noteGain);
          noteGain.connect(audioCtx.destination);
          noteOsc.start(now + (i * 0.07));
          noteOsc.stop(now + (i * 0.07) + 0.12);
        });
        break;
    }
  }

  // Load sound setting
  const savedSound = localStorage.getItem('pixel_sound_enabled');
  if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
  }

  // ---------------------------------------------------------------------------
  // 2. LO-FI BACKGROUND MUSIC ENGINE (5 Procedural Lo-Fi Tracks + Vinyl Crackle)
  // ---------------------------------------------------------------------------
  const bgmBtn = document.getElementById('toggle-bgm');
  const nextBgmBtn = document.getElementById('next-bgm');
  let bgmEnabled = localStorage.getItem('pixel_bgm_enabled') !== 'false'; // default ON per user request
  let isBgmPlaying = false;
  let bgmSchedulerTimer = null;
  let bgmMasterGain = null;
  let vinylSource = null;
  let currentStep = 0;
  let nextStepTime = 0;
  let stepsPlayedInTrack = 0;
  let toastTimeout = null;

  // Track Collection: 5 Unique Lo-Fi Tracks
  const lofiTracks = [
    {
      id: 1,
      title: "Midnight Coffee",
      tempo: 74,
      chords: [
        [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7 (F3, A3, C4, E4, G4)
        [164.81, 196.00, 246.94, 293.66, 392.00], // Em7 (E3, G3, B3, D4, G4)
        [146.83, 174.61, 220.00, 261.63, 349.23], // Dm7 (D3, F3, A3, C4, F4)
        [130.81, 164.81, 196.00, 246.94, 329.63]  // Cmaj7 (C3, E3, G3, B3, E4)
      ],
      bass: [87.31, 82.41, 73.42, 65.41],
      melody: {
        4: 523.25, 8: 440.00, 12: 392.00, 20: 392.00, 24: 329.63,
        36: 349.23, 40: 440.00, 44: 523.25, 52: 493.88, 56: 392.00, 60: 329.63
      }
    },
    {
      id: 2,
      title: "Rainy Shibuya",
      tempo: 70,
      chords: [
        [138.59, 174.61, 207.65, 261.63, 311.13], // Dbmaj7
        [130.81, 155.56, 196.00, 233.08, 293.66], // Cm7
        [116.54, 138.59, 174.61, 207.65, 261.63], // Bbm7
        [103.83, 130.81, 155.56, 196.00, 261.63]  // Abmaj7
      ],
      bass: [69.30, 65.41, 58.27, 51.91],
      melody: {
        4: 698.46, 8: 622.25, 12: 523.25, 18: 466.16, 24: 523.25,
        36: 622.25, 40: 523.25, 46: 415.30, 52: 466.16, 58: 523.25
      }
    },
    {
      id: 3,
      title: "Pixel Sunset",
      tempo: 78,
      chords: [
        [196.00, 246.94, 293.66, 369.99, 440.00], // Gmaj7
        [185.00, 220.00, 277.18, 329.63, 440.00], // F#m7
        [164.81, 196.00, 246.94, 293.66, 392.00], // Em7
        [146.83, 185.00, 220.00, 277.18, 369.99]  // Dmaj7
      ],
      bass: [98.00, 92.50, 82.41, 73.42],
      melody: {
        2: 587.33, 6: 493.88, 12: 440.00, 20: 369.99, 26: 392.00,
        34: 440.00, 38: 493.88, 44: 587.33, 50: 493.88, 56: 440.00
      }
    },
    {
      id: 4,
      title: "Campfire Code",
      tempo: 72,
      chords: [
        [220.00, 261.63, 329.63, 392.00, 493.88], // Am7
        [146.83, 174.61, 220.00, 261.63, 329.63], // Dm7
        [196.00, 246.94, 293.66, 349.23, 440.00], // G7
        [130.81, 164.81, 196.00, 246.94, 329.63]  // Cmaj7
      ],
      bass: [110.00, 73.42, 98.00, 65.41],
      melody: {
        4: 659.25, 8: 587.33, 14: 523.25, 20: 440.00, 28: 392.00,
        36: 440.00, 42: 523.25, 48: 587.33, 54: 659.25, 60: 523.25
      }
    },
    {
      id: 5,
      title: "Neon Stargaze",
      tempo: 76,
      chords: [
        [116.54, 146.83, 174.61, 220.00, 293.66], // Bbmaj7
        [110.00, 130.81, 164.81, 196.00, 261.63], // Am7
        [98.00, 116.54, 146.83, 174.61, 233.08],  // Gm7
        [87.31, 110.00, 130.81, 164.81, 220.00]   // Fmaj7
      ],
      bass: [58.27, 55.00, 49.00, 43.65],
      melody: {
        4: 587.33, 10: 698.46, 16: 523.25, 22: 440.00, 28: 392.00,
        36: 349.23, 42: 440.00, 48: 523.25, 54: 587.33, 60: 698.46
      }
    }
  ];

  // Random track initialization
  let currentTrackIndex = Math.floor(Math.random() * lofiTracks.length);
  let currentTrack = lofiTracks[currentTrackIndex];
  let stepDuration = (60 / currentTrack.tempo) / 4; // 16th note step duration

  function showTrackToast(title) {
    let toast = document.getElementById('lofi-track-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'lofi-track-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<div class="toast-cat-frame"><img src="images/bongo-cat.gif" alt="Bongo Cat" class="toast-cat-gif"></div><div class="toast-track-info"><span class="toast-note">♫</span> <span>TRACK [${currentTrackIndex + 1}/${lofiTracks.length}]:</span> <strong>${title}</strong></div>`;
    toast.classList.remove('show');
    void toast.offsetWidth; // Trigger reflow for animation
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function selectNextRandomTrack(manual = false) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * lofiTracks.length);
    } while (lofiTracks.length > 1 && nextIndex === currentTrackIndex);

    currentTrackIndex = nextIndex;
    currentTrack = lofiTracks[currentTrackIndex];
    stepDuration = (60 / currentTrack.tempo) / 4;
    stepsPlayedInTrack = 0;

    if (manual) {
      currentStep = 0;
    }

    showTrackToast(currentTrack.title);
    updateBgmButton();
  }

  function playRhodesChord(chordNotes, time) {
    if (!audioCtx || !bgmMasterGain) return;
    chordNotes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const detuneOsc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.setValueAtTime(-4, time);

      detuneOsc.type = 'sine';
      detuneOsc.frequency.setValueAtTime(freq, time);
      detuneOsc.detune.setValueAtTime(4, time);

      const vol = 0.042 / (idx * 0.3 + 1);
      noteGain.gain.setValueAtTime(0.0001, time);
      noteGain.gain.linearRampToValueAtTime(vol, time + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

      osc.connect(filter);
      detuneOsc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(bgmMasterGain);

      osc.start(time);
      detuneOsc.start(time);
      osc.stop(time + 1.65);
      detuneOsc.stop(time + 1.65);
    });
  }

  function playLofiBass(freq, time) {
    if (!audioCtx || !bgmMasterGain) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, time);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.07, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(bgmMasterGain);

    osc.start(time);
    osc.stop(time + 1.25);
  }

  function playMelodyNote(freq, time) {
    if (!audioCtx || !bgmMasterGain) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1300, time);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.035, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(bgmMasterGain);

    osc.start(time);
    osc.stop(time + 0.9);
  }

  function playLofiKick(time) {
    if (!audioCtx || !bgmMasterGain) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.16);

    gain.gain.setValueAtTime(0.11, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(bgmMasterGain);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  function playLofiSnare(time) {
    if (!audioCtx || !bgmMasterGain) return;
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.1);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1700, time);
    filter.Q.setValueAtTime(1.4, time);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.035, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(bgmMasterGain);

    noise.start(time);
    noise.stop(time + 0.12);
  }

  function playLofiHat(time, vol = 0.018) {
    if (!audioCtx || !bgmMasterGain) return;
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.04);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(bgmMasterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  function startVinylCrackle() {
    if (!audioCtx || !bgmMasterGain) return;
    const bufferSize = audioCtx.sampleRate * 3;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const isPop = Math.random() < 0.0006;
      const popVal = isPop ? (Math.random() * 2 - 1) * 0.7 : 0;
      data[i] = (Math.random() * 2 - 1) * 0.015 + popVal;
    }

    vinylSource = audioCtx.createBufferSource();
    vinylSource.buffer = buffer;
    vinylSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, audioCtx.currentTime);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.014, audioCtx.currentTime);

    vinylSource.connect(filter);
    filter.connect(gain);
    gain.connect(bgmMasterGain);

    vinylSource.start();
  }

  function scheduleLofiStep(step, time) {
    const bar = Math.floor(step / 16) % 4;
    const stepInBar = step % 16;

    // Chords on beat 1 (step 0) and beat 3.5 (step 10)
    if (stepInBar === 0) {
      playRhodesChord(currentTrack.chords[bar], time);
      playLofiBass(currentTrack.bass[bar], time);
    } else if (stepInBar === 10) {
      playRhodesChord(currentTrack.chords[bar], time);
    }

    // Melody note
    if (currentTrack.melody[step % 64]) {
      playMelodyNote(currentTrack.melody[step % 64], time);
    }

    // Drums
    if (stepInBar === 0 || stepInBar === 10) {
      playLofiKick(time);
    }
    if (stepInBar === 4 || stepInBar === 12) {
      playLofiSnare(time);
    }
    if (stepInBar % 2 === 0) {
      const vol = (stepInBar % 4 === 0) ? 0.022 : 0.014;
      playLofiHat(time, vol);
    }

    // Automatic random track rotation after 2 full cycles (128 steps)
    stepsPlayedInTrack++;
    if (stepsPlayedInTrack >= 128 && stepInBar === 15 && bar === 3) {
      selectNextRandomTrack(false);
    }
  }

  function bgmLoop() {
    if (!isBgmPlaying || !audioCtx) return;
    const lookahead = 0.12;
    while (nextStepTime < audioCtx.currentTime + lookahead) {
      scheduleLofiStep(currentStep, nextStepTime);
      currentStep = (currentStep + 1) % 64;
      nextStepTime += stepDuration;
    }
    bgmSchedulerTimer = setTimeout(bgmLoop, 40);
  }

  function startBgm() {
    initAudio();
    if (!audioCtx) return;

    if (isBgmPlaying) return;
    isBgmPlaying = true;

    bgmMasterGain = audioCtx.createGain();
    bgmMasterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    bgmMasterGain.gain.linearRampToValueAtTime(0.85, audioCtx.currentTime + 1.0);
    bgmMasterGain.connect(audioCtx.destination);

    currentStep = 0;
    stepsPlayedInTrack = 0;
    nextStepTime = audioCtx.currentTime + 0.1;

    startVinylCrackle();
    bgmLoop();
    updateBgmButton();
    showTrackToast(currentTrack.title);
  }

  function stopBgm() {
    if (!isBgmPlaying) return;
    isBgmPlaying = false;
    clearTimeout(bgmSchedulerTimer);

    if (bgmMasterGain && audioCtx) {
      bgmMasterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      setTimeout(() => {
        try {
          if (vinylSource) {
            vinylSource.stop();
            vinylSource.disconnect();
            vinylSource = null;
          }
          if (bgmMasterGain) {
            bgmMasterGain.disconnect();
            bgmMasterGain = null;
          }
        } catch (e) {}
      }, 450);
    }
    updateBgmButton();
  }

  function updateBgmButton() {
    if (!bgmBtn) return;
    if (isBgmPlaying || bgmEnabled) {
      bgmBtn.classList.add('playing');
      bgmBtn.innerHTML = '<span class="bgm-icon">🎵</span> BGM: ON <span class="bgm-bars" aria-hidden="true"><span class="bar"></span><span class="bar"></span><span class="bar"></span></span>';
      bgmBtn.setAttribute('title', `BGM: ON • [${currentTrackIndex + 1}/${lofiTracks.length}] ${currentTrack.title} (Click to Stop, ⏭️ to Skip)`);
      bgmBtn.setAttribute('aria-label', 'Stop Lo-Fi Background Music');
    } else {
      bgmBtn.classList.remove('playing');
      bgmBtn.innerHTML = '<span class="bgm-icon">🎵</span> BGM: OFF <span class="bgm-bars" aria-hidden="true"><span class="bar"></span><span class="bar"></span><span class="bar"></span></span>';
      bgmBtn.setAttribute('title', 'Play Lo-Fi Background Music');
      bgmBtn.setAttribute('aria-label', 'Play Lo-Fi Background Music');
    }
  }
  updateBgmButton();

  if (bgmBtn) {
    bgmBtn.addEventListener('click', function () {
      initAudio();
      if (isBgmPlaying || bgmEnabled) {
        stopBgm();
        bgmEnabled = false;
      } else {
        startBgm();
        bgmEnabled = true;
      }
      localStorage.setItem('pixel_bgm_enabled', bgmEnabled);
      updateBgmButton();
    });
  }

  if (nextBgmBtn) {
    nextBgmBtn.addEventListener('click', function () {
      initAudio();
      if (!isBgmPlaying) {
        bgmEnabled = true;
        localStorage.setItem('pixel_bgm_enabled', true);
        startBgm();
      } else {
        selectNextRandomTrack(true);
      }
    });
  }

  // Auto-start Lo-Fi BGM on user's first interaction (satisfying browser autoplay policy)
  if (bgmEnabled) {
    const handleFirstInteraction = () => {
      if (bgmEnabled && !isBgmPlaying) {
        startBgm();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
  }

  // ---------------------------------------------------------------------------
  // 3. CONTROLS: SOUND, THEME, CRT
  // ---------------------------------------------------------------------------
  const soundBtn = document.getElementById('toggle-sound');
  const themeBtn = document.getElementById('toggle-theme');
  const crtBtn = document.getElementById('toggle-crt');
  const glitchBtn = document.getElementById('toggle-glitch');

  function updateSoundButton() {
    if (!soundBtn) return;
    soundBtn.innerHTML = soundEnabled ? '<span>🔊</span> SFX: ON' : '<span>🔇</span> SFX: OFF';
    soundBtn.setAttribute('aria-label', soundEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects');
  }
  updateSoundButton();

  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      localStorage.setItem('pixel_sound_enabled', soundEnabled);
      updateSoundButton();
      if (soundEnabled) {
        initAudio();
        play8BitSound('coin');
      }
    });
  }

  // Themes: arcade -> gameboy -> synthwave
  const themes = ['arcade', 'gameboy', 'synthwave'];
  let currentTheme = localStorage.getItem('pixel_theme') || 'arcade';
  document.documentElement.setAttribute('data-theme', currentTheme);

  function updateThemeButton() {
    if (!themeBtn) return;
    const names = {
      arcade: 'ARCADE',
      gameboy: 'GAMEBOY',
      synthwave: 'SYNTH'
    };
    themeBtn.innerHTML = `<span>🎨</span> ${names[currentTheme] || 'ARCADE'}`;
  }
  updateThemeButton();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
      currentTheme = themes[nextIndex];
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('pixel_theme', currentTheme);
      updateThemeButton();
      play8BitSound('coin');
    });
  }

  // CRT Scanline & Curved Screen Toggle (Default ON per user preference)
  let crtEnabled = localStorage.getItem('pixel_crt') !== 'false'; // default ON
  if (!crtEnabled) {
    document.body.classList.add('crt-off');
  } else {
    document.body.classList.remove('crt-off');
  }

  function updateCrtButton() {
    if (!crtBtn) return;
    crtBtn.innerHTML = crtEnabled ? '<span>📺</span> CRT: ON' : '<span>📺</span> CRT: OFF';
  }
  updateCrtButton();

  if (crtBtn) {
    crtBtn.addEventListener('click', function () {
      crtEnabled = !crtEnabled;
      document.body.classList.toggle('crt-off', !crtEnabled);
      localStorage.setItem('pixel_crt', crtEnabled);
      updateCrtButton();
      play8BitSound('click');
    });
  }

  // Cyber Glitch Effect Toggle (Default ON)
  let glitchEnabled = localStorage.getItem('pixel_glitch') !== 'false'; // default ON
  if (glitchEnabled) {
    document.body.classList.add('glitch-active');
  } else {
    document.body.classList.remove('glitch-active');
  }

  function updateGlitchButton() {
    if (!glitchBtn) return;
    glitchBtn.innerHTML = glitchEnabled ? '<span>⚡</span> GLITCH: ON' : '<span>⚡</span> GLITCH: OFF';
    glitchBtn.classList.toggle('glitch-active-btn', glitchEnabled);
  }
  updateGlitchButton();

  if (glitchBtn) {
    glitchBtn.addEventListener('click', function () {
      glitchEnabled = !glitchEnabled;
      document.body.classList.toggle('glitch-active', glitchEnabled);
      localStorage.setItem('pixel_glitch', glitchEnabled);
      updateGlitchButton();
      play8BitSound(glitchEnabled ? 'glitch' : 'click');
    });
  }

  // Interactive Click on Glitch Text Elements
  document.querySelectorAll('.glitch-text').forEach(el => {
    el.addEventListener('click', function () {
      play8BitSound('glitch');
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), 600);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. SOUND ATTACHMENTS FOR BUTTONS & LINKS
  // ---------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    const target = e.target.closest('.pixel-btn, .hud-link, .filter-btn, .item-badge');
    if (target && target !== soundBtn && target !== themeBtn && target !== crtBtn && target !== bgmBtn && target !== glitchBtn) {
      if (target.classList.contains('filter-btn')) {
        play8BitSound('select');
      } else {
        play8BitSound('click');
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 4. PROJECT CATEGORY FILTER
  // ---------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = card.classList.contains('featured-quest-card') ? 'grid' : 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 5. EASTER EGG: CHARACTER CLICK FOR EXP
  // ---------------------------------------------------------------------------
  const character = document.querySelector('.pixel-character');
  const xpFill = document.querySelector('.bar-fill.xp');
  let currentXp = 70;

  if (character) {
    character.style.cursor = 'pointer';
    character.addEventListener('click', function () {
      play8BitSound('levelup');

      // Floating +100 EXP notification
      const pop = document.createElement('div');
      pop.textContent = '+100 EXP!';
      pop.style.position = 'absolute';
      pop.style.top = '20px';
      pop.style.left = '50%';
      pop.style.transform = 'translateX(-50%)';
      pop.style.fontFamily = 'var(--font-pixel)';
      pop.style.fontSize = '0.75rem';
      pop.style.color = 'var(--color-gold)';
      pop.style.textShadow = '2px 2px 0 #000';
      pop.style.pointerEvents = 'none';
      pop.style.transition = 'all 0.8s ease-out';
      pop.style.zIndex = '10';

      const frame = document.querySelector('.character-sprite-frame');
      if (frame) {
        frame.appendChild(pop);
        setTimeout(() => {
          pop.style.top = '-10px';
          pop.style.opacity = '0';
        }, 30);
        setTimeout(() => pop.remove(), 800);
      }

      // Fill XP bar slightly
      if (xpFill) {
        currentXp = (currentXp + 10) % 100 || 100;
        xpFill.style.width = currentXp + '%';
      }
    });
  }

  // Bongo Cat Click Interaction
  const bongoCat = document.querySelector('.bongo-cat-wrapper');
  if (bongoCat) {
    bongoCat.addEventListener('click', function () {
      play8BitSound('coin');

      const pop = document.createElement('div');
      pop.textContent = 'MEOW! ♫';
      pop.style.position = 'absolute';
      pop.style.top = '-10px';
      pop.style.left = '50%';
      pop.style.transform = 'translateX(-50%)';
      pop.style.fontFamily = 'var(--font-pixel)';
      pop.style.fontSize = '0.72rem';
      pop.style.color = 'var(--color-gold)';
      pop.style.textShadow = '2px 2px 0 #000';
      pop.style.pointerEvents = 'none';
      pop.style.transition = 'all 0.8s ease-out';
      pop.style.zIndex = '10';

      bongoCat.appendChild(pop);
      setTimeout(() => {
        pop.style.top = '-32px';
        pop.style.opacity = '0';
      }, 30);
      setTimeout(() => pop.remove(), 800);
    });
  }

  // ---------------------------------------------------------------------------
  // 6. SCROLL NAVIGATION HIGHLIGHT
  // ---------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.hud-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

})();
