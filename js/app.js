/**
 * MEU PORTAL SAGRADO — APPLICATION CORE
 * Personal Study Sanctuary & Daily Journey Manager
 */

(function () {
  'use strict';

  // =========================================================================
  // State & Constants
  // =========================================================================

  const STORAGE_KEYS = {
    JOURNEY: 'portal_sagrado_journey_v1',
    REFLECTIONS: 'portal_sagrado_reflections_v1',
    JOURNAL: 'portal_sagrado_journal_entries_v1',
    SETTINGS: 'portal_sagrado_settings_v1'
  };

  const PDF_DOCS = {
    mantras: {
      id: 'mantras',
      title: 'Ebook de Mantras e Ativações em Matriz de Alma',
      subtitle: 'Programa Portal Sagrado da Prosperidade',
      originalFile: 'docs/Ebook de Mantras e Ativações em Matriz de Alma para o Programa Portal Sagrado da Prosperidade.pdf',
      safeFile: 'docs/ebook-mantras.pdf',
      pages: 53,
      author: 'Ednalva Brito de Jesus (Nalva Brito)',
      size: '3.0 MB',
      description: 'Ativações da Personagem de Matriz de Alma, decretos ancestrais, orações de reconexão vital, mantras para finanças, saúde e autocuidado.'
    },
    banho: {
      id: 'banho',
      title: 'Banho Energético Auto Adoçamento e Autoestima',
      subtitle: 'Ritual de Autocuidado Sagrado',
      originalFile: 'docs/Banho Energético Auto Adoçamento.pdf',
      safeFile: 'docs/banho-energetico.pdf',
      pages: 4,
      author: 'Portal Sagrado da Prosperidade',
      size: '287 KB',
      description: 'Banho energético com alecrim, manjericão, pétalas de rosa e mel para fortalecer o amor-próprio, presença e sensação de valor.'
    }
  };

  const DAILY_TASK_KEYS = [
    { id: 'morning_video', label: 'Assistir ativação matinal (Matriz de Alma)', period: 'morning', icon: '☀️' },
    { id: 'morning_practice', label: 'Prática dos Mantras de Prosperidade', period: 'morning', icon: '📿' },
    { id: 'morning_intention', label: 'Escrever intenção do dia no diário', period: 'morning', icon: '✍️' },
    { id: 'evening_video', label: 'Assistir aula noturna de EFT', period: 'evening', icon: '🌙' },
    { id: 'evening_practice', label: 'Prática de liberação emocional com EFT', period: 'evening', icon: '🕊️' },
    { id: 'evening_reflection', label: 'Registrar reflexão e gratidão noturna', period: 'evening', icon: '✨' }
  ];

  const SACRED_MANTRAS = [
    { text: "Eu reconheço a minha Matriz de Alma. Eu me desidentifico das dores do ego e escolho operar a partir da minha soberania divina.", ref: "Ativação 01 • Matriz de Alma" },
    { text: "Eu acolho a minha criança ferida com compaixão e libero todo medo de escassez através do fluxo perpétuo da criação.", ref: "Liberação EFT Noturna" },
    { text: "Minha prosperidade é reflexo da ordem interna que eu sustento no meu templo sagrado.", ref: "Decreto de Prosperidade" },
    { text: "Eu abençoo a minha existência com doçura e autorizo o universo a me presentear hoje.", ref: "Ritual do Auto Adoçamento" },
    { text: "Eu solto o controle pelo medo e descanso na certeza do suprimento infinito.", ref: "Mantra de Confiança" }
  ];

  // Application Data Store
  const State = {
    currentDate: getTodayString(),
    selectedDate: getTodayString(),
    activeSection: 'dashboard',
    activePdfId: 'mantras',
    journeyData: {},
    reflectionsData: {},
    journalEntries: [],
    settings: {
      ambientVolume: 0.25,
      soundMuted: true
    },
    editingEntryId: null
  };

  // =========================================================================
  // Date Helpers
  // =========================================================================

  function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${weekdays[date.getDay()]}, ${d} de ${months[date.getMonth()]} de ${y}`;
  }

  function formatShortDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  // =========================================================================
  // Storage Manager
  // =========================================================================

  function loadPersistedData() {
    try {
      const journey = localStorage.getItem(STORAGE_KEYS.JOURNEY);
      if (journey) State.journeyData = JSON.parse(journey);

      const reflections = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
      if (reflections) State.reflectionsData = JSON.parse(reflections);

      const journal = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (journal) State.journalEntries = JSON.parse(journal);

      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settings) State.settings = { ...State.settings, ...JSON.parse(settings) };
    } catch (e) {
      console.warn('Storage read warning:', e);
    }

    // Independent multi-user guarantee: start completely empty for every new visitor browser
    if (!Array.isArray(State.journalEntries)) {
      State.journalEntries = [];
    }
    if (!State.journeyData || typeof State.journeyData !== 'object') {
      State.journeyData = {};
    }
    if (!State.reflectionsData || typeof State.reflectionsData !== 'object') {
      State.reflectionsData = {};
    }
  }

  function saveJourneyData() {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(State.journeyData));
    } catch (e) {
      console.error('Failed to save journey data:', e);
    }
  }

  function saveReflectionsData() {
    try {
      localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(State.reflectionsData));
    } catch (e) {
      console.error('Failed to save reflections data:', e);
    }
  }

  function saveJournalEntries() {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(State.journalEntries));
    } catch (e) {
      console.error('Failed to save journal entries:', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(State.settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  // =========================================================================
  // Web Audio Ambience Synthesizer (432Hz Ambient Sanctuary Soundscape)
  // =========================================================================

  let audioCtx = null;
  let synthNodes = null;
  let isPlayingAudio = false;

  function initAudioSynthesizer() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  function startAmbience() {
    initAudioSynthesizer();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Stop existing nodes if any
    stopAmbience(false);

    // Warm 432Hz sacred harmonic tuning
    // A4 = 432 Hz, A3 = 216 Hz, E4 = 324 Hz, C#4 = 272 Hz
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 3);

    // Filter for deep, soothing warm ambiance
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);

    // LFO to create gentle wave breathing
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // 8 second gentle swell
    lfoGain.gain.setValueAtTime(80, audioCtx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    // Harmonics
    const freqs = [216, 272, 324, 432];
    const oscillators = freqs.map((freq) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      oscGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    synthNodes = { masterGain, filter, lfo, oscillators };
    isPlayingAudio = true;
    updateAmbienceUI();
  }

  function stopAmbience(fade = true) {
    if (!synthNodes || !audioCtx) return;
    const { masterGain, lfo, oscillators } = synthNodes;

    if (fade) {
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
      setTimeout(() => {
        try {
          oscillators.forEach(osc => osc.stop());
          lfo.stop();
        } catch (_) {}
        synthNodes = null;
      }, 1600);
    } else {
      try {
        oscillators.forEach(osc => osc.stop());
        lfo.stop();
      } catch (_) {}
      synthNodes = null;
    }
    isPlayingAudio = false;
    updateAmbienceUI();
  }

  function toggleAmbience() {
    if (isPlayingAudio) {
      stopAmbience(true);
      showToast('Som ambiente pausado');
    } else {
      startAmbience();
      showToast('✨ Ressonância 432Hz iniciada');
    }
  }

  function updateAmbienceUI() {
    const btns = document.querySelectorAll('.ambience-toggle-btn');
    const icons = document.querySelectorAll('.ambience-icon');
    btns.forEach(btn => {
      btn.innerHTML = isPlayingAudio 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      btn.title = isPlayingAudio ? 'Pausar som ambiente' : 'Ouvir som ambiente sagrado (432Hz)';
    });

    icons.forEach(ic => {
      if (isPlayingAudio) ic.classList.add('playing');
      else ic.classList.remove('playing');
    });
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================

  function showToast(message, icon = '✨') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  // =========================================================================
  // Navigation & View Routing
  // =========================================================================

  function navigateTo(sectionId) {
    const validSections = ['dashboard', 'morning', 'evening', 'library', 'journey', 'journal'];
    if (!validSections.includes(sectionId)) {
      sectionId = 'dashboard';
    }

    State.activeSection = sectionId;

    // Update Section Views
    document.querySelectorAll('.section-view').forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(`view-${sectionId}`);
    if (targetView) targetView.classList.add('active');

    // Update Nav Items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add('active');
      }
    });

    // Update Return to Home Button visibility in Top Bar
    const topBackBtn = document.getElementById('btn-top-back');
    if (topBackBtn) {
      if (sectionId === 'dashboard') {
        topBackBtn.style.display = 'none';
        document.body.classList.remove('in-subview');
      } else {
        topBackBtn.style.display = 'inline-flex';
        document.body.classList.add('in-subview');
      }
    }

    // Close Mobile Drawer if open
    closeMobileMenu();

    // Refresh view specific logic
    if (sectionId === 'dashboard') renderDashboard();
    if (sectionId === 'journey') renderJourney();
    if (sectionId === 'journal') renderJournal();
    if (sectionId === 'morning') renderMorningPractice();
    if (sectionId === 'evening') renderEveningPractice();
    if (sectionId === 'library') renderLibrary();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = sectionId;
  }

  // =========================================================================
  // Daily Journey Logic & Checklists
  // =========================================================================

  function getDayJourney(dateStr) {
    return State.journeyData[dateStr] || {};
  }

  function toggleTask(dateStr, taskId) {
    if (!State.journeyData[dateStr]) {
      State.journeyData[dateStr] = {};
    }
    const day = State.journeyData[dateStr];
    day[taskId] = !day[taskId];
    saveJourneyData();

    // Feedback
    const taskInfo = DAILY_TASK_KEYS.find(t => t.id === taskId);
    const isDone = day[taskId];
    if (isDone) {
      showToast(`Prática concluída: ${taskInfo ? taskInfo.label : 'Hábito registrado'}`, '🌟');
    }

    renderDashboard();
    renderJourney();
    renderMorningPractice();
    renderEveningPractice();
  }

  function calculateDayStats(dateStr) {
    const day = getDayJourney(dateStr);
    let completedCount = 0;
    const totalCount = DAILY_TASK_KEYS.length;

    DAILY_TASK_KEYS.forEach(task => {
      if (day[task.id]) completedCount++;
    });

    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const morningCompleted = day['morning_video'] && day['morning_practice'];
    const eveningCompleted = day['evening_video'] && day['evening_practice'];

    return { completedCount, totalCount, percent, morningCompleted, eveningCompleted };
  }

  function calculateStreak() {
    let streak = 0;
    let checkDate = new Date();

    // If today has at least 1 completed task, start streak counting from today
    // Otherwise check if yesterday had completion
    const todayStr = getTodayString();
    const todayStats = calculateDayStats(todayStr);

    let offset = todayStats.completedCount > 0 ? 0 : 1;
    checkDate.setDate(checkDate.getDate() - offset);

    while (true) {
      const y = checkDate.getFullYear();
      const m = String(checkDate.getMonth() + 1).padStart(2, '0');
      const d = String(checkDate.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${d}`;

      const stats = calculateDayStats(dateKey);
      if (stats.completedCount > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }

      if (streak > 365) break; // safety guard
    }

    return streak;
  }

  // =========================================================================
  // Dashboard Renderer
  // =========================================================================

  function renderDashboard() {
    const todayStats = calculateDayStats(State.currentDate);
    const streak = calculateStreak();

    // Top Bar Date & Streak
    const dateElement = document.getElementById('top-bar-date-text');
    if (dateElement) dateElement.textContent = formatDisplayDate(State.currentDate);

    const streakElement = document.getElementById('top-bar-streak-text');
    if (streakElement) streakElement.textContent = `${streak} ${streak === 1 ? 'dia de luz' : 'dias de luz'}`;

    // Greeting
    const greetingEl = document.getElementById('overview-greeting');
    if (greetingEl) greetingEl.textContent = `${getGreeting()}, buscador(a) da prosperidade.`;

    // Progress percentage & circle
    const percentEl = document.getElementById('dash-progress-percent');
    if (percentEl) percentEl.textContent = `${todayStats.percent}%`;

    const circleBar = document.getElementById('dash-circle-bar');
    if (circleBar) {
      const radius = 38;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (todayStats.percent / 100) * circumference;
      circleBar.style.strokeDasharray = `${circumference} ${circumference}`;
      circleBar.style.strokeDashoffset = offset;
    }

    // Morning & Evening status chips in Dashboard
    const morningChip = document.getElementById('dash-morning-status');
    const todayJourney = getDayJourney(State.currentDate);
    if (morningChip) {
      const isDone = todayJourney['morning_video'] && todayJourney['morning_practice'];
      morningChip.className = `practice-status-chip ${isDone ? 'completed' : 'pending'}`;
      morningChip.textContent = isDone ? '✓ Concluída hoje' : 'Pendente';
    }

    const eveningChip = document.getElementById('dash-evening-status');
    if (eveningChip) {
      const isDone = todayJourney['evening_video'] && todayJourney['evening_practice'];
      eveningChip.className = `practice-status-chip ${isDone ? 'completed' : 'pending'}`;
      eveningChip.textContent = isDone ? '✓ Concluída hoje' : 'Pendente';
    }

    // Indicators in progress card
    const morningIndicator = document.getElementById('dash-ind-morning');
    if (morningIndicator) {
      const isDone = todayJourney['morning_video'] || todayJourney['morning_practice'];
      morningIndicator.className = `stat-check-indicator ${isDone ? 'done' : ''}`;
      morningIndicator.textContent = isDone ? '✓' : '';
    }

    const eveningIndicator = document.getElementById('dash-ind-evening');
    if (eveningIndicator) {
      const isDone = todayJourney['evening_video'] || todayJourney['evening_practice'];
      eveningIndicator.className = `stat-check-indicator ${isDone ? 'done' : ''}`;
      eveningIndicator.textContent = isDone ? '✓' : '';
    }

    const journalIndicator = document.getElementById('dash-ind-journal');
    if (journalIndicator) {
      const isDone = todayJourney['morning_intention'] || todayJourney['evening_reflection'];
      journalIndicator.className = `stat-check-indicator ${isDone ? 'done' : ''}`;
      journalIndicator.textContent = isDone ? '✓' : '';
    }

    // Random or daily mantra
    const mantraIndex = new Date().getDate() % SACRED_MANTRAS.length;
    const mantra = SACRED_MANTRAS[mantraIndex];
    const mantraTextEl = document.getElementById('dash-mantra-text');
    if (mantraTextEl) {
      mantraTextEl.textContent = `"${mantra.text}"`;
    }

    // Recent Notes Snippets
    renderRecentNotesPreview();
  }

  function renderRecentNotesPreview() {
    const container = document.getElementById('dash-recent-notes-list');
    if (!container) return;

    if (!State.journalEntries || State.journalEntries.length === 0) {
      container.innerHTML = `
        <div style="padding: 16px 8px; text-align: center;">
          <p style="color: var(--text-muted); font-size: 0.88rem; font-style: italic; margin-bottom: 12px; line-height: 1.45;">
            Nenhuma reflexão registrada ainda neste navegador. Seus dados permanecem 100% privados e locais.
          </p>
          <button class="action-btn-secondary" style="margin: 0 auto; font-size: 0.8rem;" onclick="window.PortalSagrado.navigateTo('journal')">
            Registrar Primeira Reflexão &rarr;
          </button>
        </div>
      `;
      return;
    }

    const recent = State.journalEntries.slice(0, 2);
    container.innerHTML = recent.map(entry => `
      <div class="recent-note-item" onclick="window.PortalSagrado.navigateTo('journal')">
        <div class="note-item-date">${formatShortDate(entry.date)} • ${entry.mood || 'Reflexão'}</div>
        <div class="note-item-snippet">${entry.morningReflection || entry.insights || entry.freeNotes || 'Sem texto'}</div>
      </div>
    `).join('');
  }

  // =========================================================================
  // Morning & Evening Practice Rooms
  // =========================================================================

  function renderMorningPractice() {
    const today = State.currentDate;
    const day = getDayJourney(today);
    const isCompleted = day['morning_video'] && day['morning_practice'];

    const btn = document.getElementById('btn-toggle-morning-complete');
    if (btn) {
      btn.className = `btn-complete-toggle ${isCompleted ? 'completed' : ''}`;
      btn.innerHTML = isCompleted 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Prática Matinal Concluída`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> Marcar como Concluída`;
    }

    // Reflection field
    const textarea = document.getElementById('morning-reflection-input');
    if (textarea) {
      const saved = (State.reflectionsData[today] && State.reflectionsData[today].morning) || '';
      textarea.value = saved;
    }
  }

  function toggleMorningComplete() {
    const today = State.currentDate;
    if (!State.journeyData[today]) {
      State.journeyData[today] = {};
    }
    const day = State.journeyData[today];
    const currentlyDone = day['morning_video'] && day['morning_practice'];
    const newState = !currentlyDone;
    day['morning_video'] = newState;
    day['morning_practice'] = newState;
    saveJourneyData();
    if (newState) {
      showToast('Prática matinal da Matriz de Alma concluída!', '🌟');
    } else {
      showToast('Prática matinal desmarcada');
    }
    renderDashboard();
    renderJourney();
    renderMorningPractice();
  }

  function renderEveningPractice() {
    const today = State.currentDate;
    const day = getDayJourney(today);
    const isCompleted = day['evening_video'] && day['evening_practice'];

    const btn = document.getElementById('btn-toggle-evening-complete');
    if (btn) {
      btn.className = `btn-complete-toggle ${isCompleted ? 'completed' : ''}`;
      btn.innerHTML = isCompleted 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Prática Noturna Concluída`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> Marcar como Concluída`;
    }

    // Reflection field
    const textarea = document.getElementById('evening-reflection-input');
    if (textarea) {
      const saved = (State.reflectionsData[today] && State.reflectionsData[today].evening) || '';
      textarea.value = saved;
    }
  }

  function toggleEveningComplete() {
    const today = State.currentDate;
    if (!State.journeyData[today]) {
      State.journeyData[today] = {};
    }
    const day = State.journeyData[today];
    const currentlyDone = day['evening_video'] && day['evening_practice'];
    const newState = !currentlyDone;
    day['evening_video'] = newState;
    day['evening_practice'] = newState;
    saveJourneyData();
    if (newState) {
      showToast('Sessão de EFT noturna concluída!', '🕊️');
    } else {
      showToast('Prática noturna desmarcada');
    }
    renderDashboard();
    renderJourney();
    renderEveningPractice();
  }

  function savePracticeReflection(period) {
    const today = State.currentDate;
    const textareaId = period === 'morning' ? 'morning-reflection-input' : 'evening-reflection-input';
    const statusId = period === 'morning' ? 'morning-reflection-status' : 'evening-reflection-status';

    const textarea = document.getElementById(textareaId);
    if (!textarea) return;

    if (!State.reflectionsData[today]) {
      State.reflectionsData[today] = {};
    }
    State.reflectionsData[today][period] = textarea.value.trim();
    saveReflectionsData();

    // Also auto-sync to today's journal entry
    syncReflectionToJournal(today, period, textarea.value.trim());

    // Automatically mark the journal task checked
    const taskKey = period === 'morning' ? 'morning_intention' : 'evening_reflection';
    const day = getDayJourney(today);
    if (textarea.value.trim().length > 0 && !day[taskKey]) {
      day[taskKey] = true;
      saveJourneyData();
      renderDashboard();
    }

    const statusEl = document.getElementById(statusId);
    if (statusEl) {
      statusEl.textContent = 'Salvo no Diário Sagrado ✓';
      setTimeout(() => { statusEl.textContent = 'Salvo localmente'; }, 3000);
    }
    showToast(`Reflexão ${period === 'morning' ? 'matinal' : 'noturna'} salva com sucesso`, '✍️');
  }

  function syncReflectionToJournal(dateStr, period, text) {
    let entry = State.journalEntries.find(e => e.date === dateStr);
    if (!entry) {
      entry = {
        id: 'entry_' + Date.now(),
        date: dateStr,
        mood: '✨ Plena & Próspera',
        morningReflection: '',
        eveningReflection: '',
        insights: '',
        freeNotes: '',
        createdAt: new Date().toISOString()
      };
      State.journalEntries.unshift(entry);
    }

    if (period === 'morning') {
      entry.morningReflection = text;
    } else {
      entry.eveningReflection = text;
    }
    entry.updatedAt = new Date().toISOString();
    saveJournalEntries();
  }

  // =========================================================================
  // Study Library Logic & In-App Continuous Scroll PDF Reader
  // =========================================================================

  let activePdfDoc = null;
  let activePdfUrl = null;
  let pdfRenderTasks = {};
  let pdfCurrentPage = 1;
  let pdfZoomScale = 1.0;
  let isPdfZoomAuto = true;
  let observerInstance = null;
  let zenObserverInstance = null;

  function selectPdfDocument(docId) {
    if (!PDF_DOCS[docId]) return;
    State.activePdfId = docId;

    // Update active tab buttons
    document.querySelectorAll('.lib-tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-doc') === docId) {
        btn.classList.add('active');
      }
    });

    renderLibrary();
  }

  function renderLibrary() {
    const doc = PDF_DOCS[State.activePdfId];
    if (!doc) return;

    // Update Header Card
    const titleEl = document.getElementById('lib-doc-title');
    if (titleEl) titleEl.textContent = doc.title;

    const subtitleEl = document.getElementById('lib-doc-subtitle');
    if (subtitleEl) subtitleEl.textContent = `${doc.subtitle} • ${doc.author}`;

    const pagesEl = document.getElementById('lib-doc-pages');
    if (pagesEl) pagesEl.textContent = `${doc.pages} páginas`;

    const sizeEl = document.getElementById('lib-doc-size');
    if (sizeEl) sizeEl.textContent = doc.size;

    // Update Download Button
    const downloadBtn = document.getElementById('lib-btn-download');
    if (downloadBtn) {
      downloadBtn.href = doc.originalFile;
      downloadBtn.setAttribute('download', doc.title + '.pdf');
    }

    // Update New Tab Button
    const newTabBtn = document.getElementById('lib-btn-newtab');
    if (newTabBtn) {
      newTabBtn.href = doc.safeFile;
    }

    // Load PDF in Native Continuous Scrolling In-App Reader
    loadPdfDocument(doc.safeFile, 'pdf-canvas-container', 'pdf-loading-state');
  }

  async function loadPdfDocument(url, targetContainerId = 'pdf-canvas-container', loadingOverlayId = 'pdf-loading-state') {
    const container = document.getElementById(targetContainerId);
    const loadingOverlay = document.getElementById(loadingOverlayId);
    if (!container) return;

    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    container.innerHTML = '';
    pdfRenderTasks = {};

    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF.js engine is not ready');
      }

      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/pdf.worker.min.js';

      const loadingTask = window.pdfjsLib.getDocument({
        url: url
      });

      const pdf = await loadingTask.promise;
      activePdfDoc = pdf;
      activePdfUrl = url;

      // Update page counter in toolbar
      const pageCountEl = document.getElementById('pdf-page-count');
      if (pageCountEl) pageCountEl.textContent = pdf.numPages;

      const pageInput = document.getElementById('pdf-page-input');
      if (pageInput) {
        pageInput.max = pdf.numPages;
        pageInput.value = 1;
      }

      // Read page 1 dimensions for aspect ratio
      const firstPage = await pdf.getPage(1);
      const baseViewport = firstPage.getViewport({ scale: 1.0 });
      const pageAspectRatio = baseViewport.height / baseViewport.width;

      const scrollParent = container.parentElement;
      const viewportWidth = scrollParent ? scrollParent.clientWidth : 750;
      const initialPageWidth = Math.min(viewportWidth - 32, 850);
      const initialPageHeight = Math.round(initialPageWidth * pageAspectRatio);

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const pageCard = document.createElement('div');
        pageCard.className = 'pdf-page-card loading';
        pageCard.id = `${targetContainerId}-card-${pageNum}`;
        pageCard.setAttribute('data-page-num', pageNum);
        pageCard.style.width = `${initialPageWidth}px`;
        pageCard.style.minHeight = `${initialPageHeight}px`;

        const canvas = document.createElement('canvas');
        canvas.id = `${targetContainerId}-canvas-${pageNum}`;
        pageCard.appendChild(canvas);

        const badge = document.createElement('span');
        badge.className = 'pdf-page-badge';
        badge.textContent = `Página ${pageNum} de ${pdf.numPages}`;
        pageCard.appendChild(badge);

        container.appendChild(pageCard);
      }

      // Hide loading overlay
      if (loadingOverlay) loadingOverlay.style.display = 'none';

      // Setup IntersectionObserver for Lazy Page Rendering
      const isZen = targetContainerId.includes('zen');
      let observer = isZen ? zenObserverInstance : observerInstance;
      if (observer) observer.disconnect();

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page-num'), 10);
            renderCanvasPage(pageNum, targetContainerId);

            // Update page indicator as user scrolls
            pdfCurrentPage = pageNum;
            if (pageInput && document.activeElement !== pageInput) {
              pageInput.value = pageNum;
            }
            const zenIndicator = document.getElementById('zen-page-indicator');
            if (zenIndicator) {
              zenIndicator.textContent = `Página ${pageNum} de ${pdf.numPages}`;
            }
          }
        });
      }, {
        root: scrollParent,
        rootMargin: '350px 0px 350px 0px',
        threshold: 0.05
      });

      if (isZen) {
        zenObserverInstance = observer;
      } else {
        observerInstance = observer;
      }

      document.querySelectorAll(`#${targetContainerId} .pdf-page-card`).forEach(card => {
        observer.observe(card);
      });

      // Render first 2 pages immediately
      renderCanvasPage(1, targetContainerId);
      if (pdf.numPages > 1) {
        renderCanvasPage(2, targetContainerId);
      }

    } catch (err) {
      console.warn('Fallback para iframe devido a:', err);
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      const fallbackContainer = document.getElementById('pdf-fallback-container');
      const fallbackIframe = document.getElementById('lib-pdf-iframe');
      if (fallbackContainer && fallbackIframe) {
        fallbackContainer.style.display = 'block';
        fallbackIframe.src = `${url}#toolbar=1&navpanes=0&scrollbar=1`;
        if (container.parentElement) container.parentElement.style.display = 'none';
      }
    }
  }

  async function renderCanvasPage(pageNum, targetContainerId = 'pdf-canvas-container') {
    if (!activePdfDoc || pageNum < 1 || pageNum > activePdfDoc.numPages) return;
    const taskKey = `${targetContainerId}-${pageNum}`;
    if (pdfRenderTasks[taskKey]) return; // already rendering or rendered

    const card = document.getElementById(`${targetContainerId}-card-${pageNum}`);
    const canvas = document.getElementById(`${targetContainerId}-canvas-${pageNum}`);
    if (!canvas || !card) return;

    pdfRenderTasks[taskKey] = true;

    try {
      const page = await activePdfDoc.getPage(pageNum);
      const scrollParent = card.parentElement ? card.parentElement.parentElement : null;
      const containerWidth = scrollParent ? scrollParent.clientWidth : 800;

      let targetWidth;
      if (isPdfZoomAuto) {
        targetWidth = Math.min(containerWidth - 32, 850);
      } else {
        targetWidth = Math.round((Math.min(containerWidth - 32, 850)) * pdfZoomScale);
      }

      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const scale = targetWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      // Support High-DPI screens (Retina displays on iPhone 16 Pro Max are 2x or 3x)
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      card.style.width = `${Math.floor(viewport.width)}px`;
      card.style.minHeight = `${Math.floor(viewport.height)}px`;
      card.classList.remove('loading');

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (e) {
      console.error(`Erro ao renderizar página ${pageNum}:`, e);
      pdfRenderTasks[taskKey] = false;
    }
  }

  function goToPdfPage(pageNum) {
    if (!activePdfDoc) return;
    pageNum = parseInt(pageNum, 10);
    if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
    if (pageNum > activePdfDoc.numPages) pageNum = activePdfDoc.numPages;

    pdfCurrentPage = pageNum;
    const pageInput = document.getElementById('pdf-page-input');
    if (pageInput) pageInput.value = pageNum;

    const card = document.getElementById(`pdf-canvas-container-card-${pageNum}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function prevPdfPage() {
    goToPdfPage(pdfCurrentPage - 1);
  }

  function nextPdfPage() {
    goToPdfPage(pdfCurrentPage + 1);
  }

  function zoomPdf(delta) {
    isPdfZoomAuto = false;
    pdfZoomScale = Math.max(0.6, Math.min(2.5, pdfZoomScale + delta));
    const badge = document.getElementById('pdf-zoom-level');
    if (badge) badge.textContent = `${Math.round(pdfZoomScale * 100)}%`;
    reRenderVisiblePages();
  }

  function fitPdfWidth() {
    isPdfZoomAuto = true;
    pdfZoomScale = 1.0;
    const badge = document.getElementById('pdf-zoom-level');
    if (badge) badge.textContent = 'Ajustar';
    reRenderVisiblePages();
  }

  function reRenderVisiblePages() {
    pdfRenderTasks = {};
    if (activePdfDoc) {
      for (let i = 1; i <= activePdfDoc.numPages; i++) {
        const card = document.getElementById(`pdf-canvas-container-card-${i}`);
        if (card && !card.classList.contains('loading')) {
          renderCanvasPage(i, 'pdf-canvas-container');
        }
      }
    }
  }

  function openZenModal() {
    const doc = PDF_DOCS[State.activePdfId];
    if (!doc) return;

    const modal = document.getElementById('zen-modal');
    const modalTitle = document.getElementById('zen-modal-title-text');
    const zenIndicator = document.getElementById('zen-page-indicator');

    if (modalTitle) modalTitle.textContent = `${doc.title} (${doc.pages} páginas)`;
    if (zenIndicator) zenIndicator.textContent = `Página 1 de ${doc.pages}`;

    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load in Zen scroll container
    loadPdfDocument(doc.safeFile, 'zen-pdf-canvas-container');
  }

  function closeZenModal() {
    const modal = document.getElementById('zen-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    if (zenObserverInstance) zenObserverInstance.disconnect();
  }

  // =========================================================================
  // My Daily Journey Checklist Renderer
  // =========================================================================

  function renderJourney() {
    const dateInput = document.getElementById('journey-date-picker');
    if (dateInput) {
      dateInput.value = State.selectedDate;
    }

    const titleEl = document.getElementById('journey-selected-date-text');
    if (titleEl) {
      titleEl.textContent = formatDisplayDate(State.selectedDate);
    }

    const day = getDayJourney(State.selectedDate);
    const stats = calculateDayStats(State.selectedDate);

    // Percentage & Counter
    const percentEl = document.getElementById('journey-progress-percent');
    if (percentEl) percentEl.textContent = `${stats.percent}%`;

    const counterEl = document.getElementById('journey-tasks-counter');
    if (counterEl) counterEl.textContent = `${stats.completedCount} de ${stats.totalCount} hábitos praticados`;

    // Render Checklist Items
    const morningList = document.getElementById('journey-morning-checklist');
    const eveningList = document.getElementById('journey-evening-checklist');

    const morningTasks = DAILY_TASK_KEYS.filter(t => t.period === 'morning');
    const eveningTasks = DAILY_TASK_KEYS.filter(t => t.period === 'evening');

    if (morningList) {
      morningList.innerHTML = morningTasks.map(task => {
        const isChecked = !!day[task.id];
        return `
          <div class="checklist-item ${isChecked ? 'checked' : ''}" onclick="window.PortalSagrado.toggleTask('${State.selectedDate}', '${task.id}')">
            <div class="checklist-custom-checkbox">
              ${isChecked ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <div class="checklist-item-content">
              <div class="checklist-item-title">${task.label}</div>
              <div class="checklist-item-desc">${task.icon} Conexão sagrada matinal</div>
            </div>
          </div>
        `;
      }).join('');
    }

    if (eveningList) {
      eveningList.innerHTML = eveningTasks.map(task => {
        const isChecked = !!day[task.id];
        return `
          <div class="checklist-item ${isChecked ? 'checked' : ''}" onclick="window.PortalSagrado.toggleTask('${State.selectedDate}', '${task.id}')">
            <div class="checklist-custom-checkbox">
              ${isChecked ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <div class="checklist-item-content">
              <div class="checklist-item-title">${task.label}</div>
              <div class="checklist-item-desc">${task.icon} Pacificação e autocuidado noturno</div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Weekly Pills Bar
    renderWeeklyOverview();

    // Streak stats
    const streak = calculateStreak();
    const streakEl = document.getElementById('journey-current-streak');
    if (streakEl) streakEl.textContent = streak;
  }

  function renderWeeklyOverview() {
    const container = document.getElementById('journey-weekly-pills');
    if (!container) return;

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const pills = [];

    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${dayNum}`;

      const stats = calculateDayStats(dateStr);
      const isToday = dateStr === State.currentDate;
      const isSelected = dateStr === State.selectedDate;
      const isCompleted = stats.percent === 100;
      const hasAny = stats.completedCount > 0;

      let pillClass = 'week-day-pill';
      if (isToday) pillClass += ' today';
      if (isCompleted) pillClass += ' completed';

      pills.push(`
        <div class="${pillClass}" style="cursor: pointer;" onclick="window.PortalSagrado.setSelectedDate('${dateStr}')">
          <div class="week-day-name">${weekdays[d.getDay()]}</div>
          <div class="week-day-status">${hasAny ? `${stats.percent}%` : '—'}</div>
        </div>
      `);
    }

    container.innerHTML = pills.join('');
  }

  function setSelectedDate(dateStr) {
    State.selectedDate = dateStr;
    renderJourney();
  }

  // =========================================================================
  // Personal Journal Logic
  // =========================================================================

  function renderJournal() {
    const listContainer = document.getElementById('journal-entries-list');
    const searchInput = document.getElementById('journal-search-input');
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    let entries = [...State.journalEntries];

    if (query) {
      entries = entries.filter(e => {
        return (e.morningReflection && e.morningReflection.toLowerCase().includes(query)) ||
               (e.eveningReflection && e.eveningReflection.toLowerCase().includes(query)) ||
               (e.insights && e.insights.toLowerCase().includes(query)) ||
               (e.freeNotes && e.freeNotes.toLowerCase().includes(query)) ||
               (e.date && e.date.includes(query));
      });
    }

    // Sort by date descending
    entries.sort((a, b) => b.date.localeCompare(a.date));

    if (!listContainer) return;

    if (entries.length === 0) {
      if (query) {
        listContainer.innerHTML = `
          <div class="recent-note-item" style="border-left-color: var(--text-soft); text-align: center; padding: 24px;">
            <p style="color: var(--text-muted); font-size: 0.9rem;">Nenhuma reflexão encontrada para "${escapeHtml(query)}".</p>
          </div>
        `;
      } else {
        listContainer.innerHTML = `
          <div class="recent-note-item" style="border-left: 3px solid var(--border-gold); background: var(--bg-surface); text-align: center; padding: 32px 20px; border-radius: var(--radius-md);">
            <div style="font-size: 1.8rem; margin-bottom: 8px;">🕊️</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--plum-deep); margin-bottom: 6px;">Seu Diário Sagrado está Pronto</h4>
            <p style="color: var(--text-muted); font-size: 0.86rem; max-width: 400px; margin: 0 auto; line-height: 1.5;">
              Seus registros são 100% confidenciais e salvos exclusivamente no armazenamento deste navegador. Escreva sua primeira reflexão ao lado.
            </p>
          </div>
        `;
      }
      return;
    }

    listContainer.innerHTML = entries.map(entry => `
      <div class="journal-entry-card" id="journal-card-${entry.id}">
        <div class="entry-card-header">
          <span class="entry-card-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${formatDisplayDate(entry.date)}
          </span>
          <span class="entry-card-energy">${entry.mood || '✨ Plena & Próspera'}</span>
        </div>

        ${entry.morningReflection ? `
          <div class="entry-section-snippet">
            <span class="entry-section-label">☀️ Matriz de Alma (Manhã)</span>
            <p class="entry-section-text">${escapeHtml(entry.morningReflection)}</p>
          </div>
        ` : ''}

        ${entry.eveningReflection ? `
          <div class="entry-section-snippet">
            <span class="entry-section-label">🌙 Liberação EFT (Noite)</span>
            <p class="entry-section-text">${escapeHtml(entry.eveningReflection)}</p>
          </div>
        ` : ''}

        ${entry.insights ? `
          <div class="entry-section-snippet">
            <span class="entry-section-label">💎 Insights & Revelações</span>
            <p class="entry-section-text">${escapeHtml(entry.insights)}</p>
          </div>
        ` : ''}

        ${entry.freeNotes ? `
          <div class="entry-section-snippet">
            <span class="entry-section-label">🕊️ Anotações Livres</span>
            <p class="entry-section-text">${escapeHtml(entry.freeNotes)}</p>
          </div>
        ` : ''}

        <div class="entry-card-footer">
          <button class="btn-entry-icon" title="Editar entrada" onclick="window.PortalSagrado.editJournalEntry('${entry.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-entry-icon delete" title="Excluir entrada" onclick="window.PortalSagrado.deleteJournalEntry('${entry.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  function saveJournalEntry() {
    const dateInput = document.getElementById('journal-input-date');
    const morningInput = document.getElementById('journal-input-morning');
    const eveningInput = document.getElementById('journal-input-evening');
    const insightsInput = document.getElementById('journal-input-insights');
    const notesInput = document.getElementById('journal-input-notes');

    const dateVal = dateInput ? dateInput.value : State.currentDate;
    const morningVal = morningInput ? morningInput.value.trim() : '';
    const eveningVal = eveningInput ? eveningInput.value.trim() : '';
    const insightsVal = insightsInput ? insightsInput.value.trim() : '';
    const notesVal = notesInput ? notesInput.value.trim() : '';

    // Selected Mood Chip
    const activeChip = document.querySelector('.energy-chip.active');
    const moodVal = activeChip ? activeChip.textContent.trim() : '✨ Plena & Próspera';

    if (!morningVal && !eveningVal && !insightsVal && !notesVal) {
      showToast('Por favor, escreva ao menos uma reflexão antes de salvar', '⚠️');
      return;
    }

    if (State.editingEntryId) {
      const idx = State.journalEntries.findIndex(e => e.id === State.editingEntryId);
      if (idx !== -1) {
        State.journalEntries[idx] = {
          ...State.journalEntries[idx],
          date: dateVal,
          mood: moodVal,
          morningReflection: morningVal,
          eveningReflection: eveningVal,
          insights: insightsVal,
          freeNotes: notesVal,
          updatedAt: new Date().toISOString()
        };
      }
      State.editingEntryId = null;
      showToast('Entrada do diário atualizada ✓', '✨');
    } else {
      // Check if entry for date exists, if so merge
      const existing = State.journalEntries.find(e => e.date === dateVal);
      if (existing) {
        existing.mood = moodVal;
        if (morningVal) existing.morningReflection = morningVal;
        if (eveningVal) existing.eveningReflection = eveningVal;
        if (insightsVal) existing.insights = insightsVal;
        if (notesVal) existing.freeNotes = notesVal;
        existing.updatedAt = new Date().toISOString();
        showToast('Entrada do dia atualizada com sucesso ✓', '✨');
      } else {
        const newEntry = {
          id: 'entry_' + Date.now(),
          date: dateVal,
          mood: moodVal,
          morningReflection: morningVal,
          eveningReflection: eveningVal,
          insights: insightsVal,
          freeNotes: notesVal,
          createdAt: new Date().toISOString()
        };
        State.journalEntries.unshift(newEntry);
        showToast('Nova reflexão sagrada guardada no diário ✓', '✨');
      }
    }

    // Keep reflections synced
    if (!State.reflectionsData[dateVal]) State.reflectionsData[dateVal] = {};
    if (morningVal) State.reflectionsData[dateVal].morning = morningVal;
    if (eveningVal) State.reflectionsData[dateVal].evening = eveningVal;
    saveReflectionsData();

    saveJournalEntries();
    clearJournalForm();
    renderJournal();
    renderDashboard();
  }

  function editJournalEntry(entryId) {
    const entry = State.journalEntries.find(e => e.id === entryId);
    if (!entry) return;

    State.editingEntryId = entryId;

    const dateInput = document.getElementById('journal-input-date');
    const morningInput = document.getElementById('journal-input-morning');
    const eveningInput = document.getElementById('journal-input-evening');
    const insightsInput = document.getElementById('journal-input-insights');
    const notesInput = document.getElementById('journal-input-notes');

    if (dateInput) dateInput.value = entry.date;
    if (morningInput) morningInput.value = entry.morningReflection || '';
    if (eveningInput) eveningInput.value = entry.eveningReflection || '';
    if (insightsInput) insightsInput.value = entry.insights || '';
    if (notesInput) notesInput.value = entry.freeNotes || '';

    // Set mood chip
    document.querySelectorAll('.energy-chip').forEach(chip => {
      chip.classList.remove('active');
      if (chip.textContent.trim() === entry.mood) {
        chip.classList.add('active');
      }
    });

    const header = document.querySelector('.journal-editor-header h3');
    if (header) header.textContent = 'Editar Entrada do Diário';

    // Scroll to editor form
    document.querySelector('.journal-editor-card')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Editando reflexão selecionada', '📝');
  }

  function deleteJournalEntry(entryId) {
    if (!confirm('Deseja realmente excluir esta entrada do seu Diário Sagrado?')) {
      return;
    }

    State.journalEntries = State.journalEntries.filter(e => e.id !== entryId);
    saveJournalEntries();
    renderJournal();
    renderDashboard();
    showToast('Entrada removida do diário', '🗑️');
  }

  function clearJournalForm() {
    State.editingEntryId = null;
    const morningInput = document.getElementById('journal-input-morning');
    const eveningInput = document.getElementById('journal-input-evening');
    const insightsInput = document.getElementById('journal-input-insights');
    const notesInput = document.getElementById('journal-input-notes');

    if (morningInput) morningInput.value = '';
    if (eveningInput) eveningInput.value = '';
    if (insightsInput) insightsInput.value = '';
    if (notesInput) notesInput.value = '';

    const header = document.querySelector('.journal-editor-header h3');
    if (header) header.textContent = 'Nova Entrada Sagrada';
  }

  function exportJournalData() {
    exportBackupJSON();
  }

  function exportBackupJSON() {
    const backupData = {
      app: 'Meu Portal Sagrado',
      version: '1.1',
      exportedAt: new Date().toISOString(),
      currentDate: State.currentDate,
      journeyData: State.journeyData,
      reflectionsData: State.reflectionsData,
      journalEntries: State.journalEntries,
      settings: State.settings
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-portal-sagrado-backup-${State.currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup completo exportado em JSON', '💾');
  }

  function triggerRestoreFileInput() {
    const input = document.getElementById('restore-file-input');
    if (input) {
      input.value = '';
      input.click();
    }
  }

  function handleRestoreFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const json = JSON.parse(e.target.result);

        // Validation: verify structure
        const hasJournal = Array.isArray(json.journalEntries);
        const hasJourney = json.journeyData && typeof json.journeyData === 'object';
        const hasReflections = (json.reflectionsData || json.reflections) && typeof (json.reflectionsData || json.reflections) === 'object';

        if (!hasJournal && !hasJourney && !hasReflections) {
          alert('Arquivo de backup inválido. Não foram encontradas anotações ou dados do Portal Sagrado.');
          return;
        }

        const journalCount = hasJournal ? json.journalEntries.length : 0;
        const msg = `Arquivo válido detectado (${journalCount} entradas de diário).\n\nDeseja restaurar este backup no seu navegador? Os dados atuais serão atualizados com as informações do backup.`;

        if (confirm(msg)) {
          if (hasJournal) State.journalEntries = json.journalEntries;
          if (hasJourney) State.journeyData = json.journeyData;
          if (hasReflections) State.reflectionsData = json.reflectionsData || json.reflections;
          if (json.settings) State.settings = { ...State.settings, ...json.settings };

          saveJournalEntries();
          saveJourneyData();
          saveReflectionsData();
          saveSettings();

          renderDashboard();
          renderJourney();
          renderJournal();
          renderMorningPractice();
          renderEveningPractice();

          closePrivacyModal();
          showToast('Backup restaurado com sucesso no seu navegador! ✨', '📥');
        }
      } catch (err) {
        alert('Erro ao ler arquivo de backup: o arquivo não contém JSON válido.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  function resetAllLocalData() {
    const confirm1 = confirm('ATENÇÃO: Deseja apagar todos os registros, hábitos e reflexões salvos neste navegador?\n\nEsta ação apagará permanentemente o conteúdo local deste dispositivo (a menos que você tenha feito o download de um backup em JSON).');
    if (!confirm1) return;

    try {
      localStorage.removeItem(STORAGE_KEYS.JOURNEY);
      localStorage.removeItem(STORAGE_KEYS.REFLECTIONS);
      localStorage.removeItem(STORAGE_KEYS.JOURNAL);
    } catch (_) {}

    State.journeyData = {};
    State.reflectionsData = {};
    State.journalEntries = [];

    renderDashboard();
    renderJourney();
    renderJournal();
    renderMorningPractice();
    renderEveningPractice();

    closePrivacyModal();
    showToast('Dados locais apagados com sucesso.', '🧹');
  }

  function openMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function exportJournalAsText() {
    let content = `# MEU PORTAL SAGRADO — DIÁRIO PESSOAL DE ESTUDOS\n`;
    content += `Exportado em: ${formatDisplayDate(State.currentDate)}\n\n`;
    content += `========================================================\n\n`;

    State.journalEntries.forEach(entry => {
      content += `DATA: ${formatDisplayDate(entry.date)} [${entry.mood || 'Normal'}]\n`;
      content += `--------------------------------------------------------\n`;
      if (entry.morningReflection) {
        content += `[MANHÃ - MATRIZ DE ALMA]\n${entry.morningReflection}\n\n`;
      }
      if (entry.eveningReflection) {
        content += `[NOITE - LIBERAÇÃO EFT]\n${entry.eveningReflection}\n\n`;
      }
      if (entry.insights) {
        content += `[INSIGHTS & REVELAÇÕES]\n${entry.insights}\n\n`;
      }
      if (entry.freeNotes) {
        content += `[ANOTAÇÕES LIVRES]\n${entry.freeNotes}\n\n`;
      }
      content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario-sagrado-${State.currentDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Diário exportado em formato texto (.txt)', '📄');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }

  function setupVideoEmbeds() {
    const isFile = window.location.protocol === 'file:';
    const origin = !isFile ? window.location.origin : '';

    const morningFrame = document.getElementById('morning-video-iframe');
    const eveningFrame = document.getElementById('evening-video-iframe');

    // YouTube requires origin parameter on embeds for strict API handshake
    if (origin) {
      if (morningFrame) {
        morningFrame.src = `https://www.youtube.com/embed/lis25LXrSj8?rel=0&modestbranding=1&origin=${encodeURIComponent(origin)}`;
      }
      if (eveningFrame) {
        eveningFrame.src = `https://www.youtube.com/embed/03G-sYb2PW0?rel=0&modestbranding=1&origin=${encodeURIComponent(origin)}`;
      }
    }

    if (isFile) {
      document.querySelectorAll('.local-protocol-warning').forEach(el => {
        el.style.display = 'flex';
      });
    }
  }

  // =========================================================================
  // Initialisation & Event Listeners
  // =========================================================================

  function init() {
    loadPersistedData();

    // Default dates in form inputs
    const journalDateInput = document.getElementById('journal-input-date');
    if (journalDateInput) journalDateInput.value = State.currentDate;

    const journeyDateInput = document.getElementById('journey-date-picker');
    if (journeyDateInput) {
      journeyDateInput.value = State.selectedDate;
      journeyDateInput.addEventListener('change', (e) => {
        State.selectedDate = e.target.value || State.currentDate;
        renderJourney();
      });
    }

    // Hash routing
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      navigateTo(hash);
    } else {
      navigateTo('dashboard');
    }

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && h !== State.activeSection) {
        navigateTo(h);
      }
    });

    // Mobile Drawer Controls
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', toggleMobileMenu);
    }

    const closeBtn = document.getElementById('sidebar-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileMenu);
    }

    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileMenu);
    }

    // Mood Selector Chips
    document.querySelectorAll('.energy-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.energy-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Journal Search Live Filter
    const searchInput = document.getElementById('journal-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderJournal();
      });
    }

    // Ambience sound setup
    updateAmbienceUI();

    // YouTube Embeds & Protocol Detection (Fix for Error 153)
    setupVideoEmbeds();

    // Restore File Input Listener
    const restoreInput = document.getElementById('restore-file-input');
    if (restoreInput) {
      restoreInput.addEventListener('change', handleRestoreFile);
    }

    // Setup global API
    window.PortalSagrado = {
      navigateTo,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,
      toggleTask,
      toggleMorningComplete,
      toggleEveningComplete,
      selectPdfDocument,
      goToPdfPage,
      prevPdfPage,
      nextPdfPage,
      zoomPdf,
      fitPdfWidth,
      openZenModal,
      closeZenModal,
      openPrivacyModal,
      closePrivacyModal,
      savePracticeReflection,
      saveJournalEntry,
      editJournalEntry,
      deleteJournalEntry,
      clearJournalForm,
      exportJournalData,
      exportBackupJSON,
      triggerRestoreFileInput,
      handleRestoreFile,
      resetAllLocalData,
      exportJournalAsText,
      toggleAmbience,
      setSelectedDate,
      getState: () => State
    };
  }

  document.addEventListener('DOMContentLoaded', init);
})();
