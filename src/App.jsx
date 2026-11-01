import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, Star, Volume2, Award, 
  Printer, Lock, Sparkles, PenTool, Eraser, ChevronLeft
} from 'lucide-react';

// --- SEMUA MODUL MINGGUAN DIBUKA (UNLOCKED) ---
const WEEKLY_MODULES = [
  {
    id: 'week-1',
    week: 'Minggu 1',
    title: 'Pulau Waktu (Jam & Menit)',
    subtitle: 'Jam Analog, Digital, Waktu Tepat & Pecahan Menit',
    icon: '🏝️',
    color: 'from-amber-400 to-orange-500',
    unlocked: true,
  },
  {
    id: 'week-2',
    week: 'Minggu 2',
    title: 'Lembah Penjumlahan Susun',
    subtitle: 'Penjumlahan & Pengurangan Ratusan',
    icon: '⛰️',
    color: 'from-sky-400 to-blue-500',
    unlocked: true,
  },
  {
    id: 'week-3',
    week: 'Minggu 3',
    title: 'Hutan Perkalian Ceria',
    subtitle: 'Konsep Perkalian Sebagai Penjumlahan Berulang',
    icon: '🌳',
    color: 'from-emerald-400 to-teal-500',
    unlocked: true,
  },
  {
    id: 'week-4',
    week: 'Minggu 4',
    title: 'Istana Bangun Datar',
    subtitle: 'Mengenal Sisi, Sudut, dan Titik Sudut',
    icon: '🏰',
    color: 'from-purple-400 to-indigo-500',
    unlocked: true,
  }
];

const SOAL_CERITA = [
  {
    id: 1,
    cerita: "Siti mulai sarapan pagi pukul 06.00 tepat. Jarum pendek menunjuk ke angka 6, dan jarum panjang menunjuk ke angka berapa?",
    jam: 6,
    menit: 0,
    pilihan: ["Angka 12", "Angka 6", "Angka 3", "Angka 9"],
    jawaban: "Angka 12"
  },
  {
    id: 2,
    cerita: "Budi bermain sepak bola di lapangan pukul 04.15 sore. Itu artinya pukul empat lewat lima belas menit. Di angka berapakah jarum panjang berada?",
    jam: 4,
    menit: 15,
    pilihan: ["Angka 3", "Angka 6", "Angka 9", "Angka 12"],
    jawaban: "Angka 3"
  },
  {
    id: 3,
    cerita: "Lani membaca buku cerita mulai pukul 07.00 dan selesai pukul 07.30. Berapa menit Lani membaca buku?",
    jam: 7,
    menit: 30,
    pilihan: ["30 Menit", "15 Menit", "45 Menit", "10 Menit"],
    jawaban: "30 Menit"
  },
  {
    id: 4,
    cerita: "Ayah pulang kerja pukul 05.45 sore. Jarum panjang menunjuk tepat ke angka 9. Bagaimana tulisan jam digitalnya?",
    jam: 5,
    menit: 45,
    pilihan: ["05:45", "05:15", "05:30", "09:05"],
    jawaban: "05:45"
  }
];

export default function App() {
  const [screen, setScreen] = useState('map');
  const [activeTab, setActiveTab] = useState('eksplor');
  
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem('mtk_sd2_stars');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // State Kuis Variatif (Jam & Menit)
  const [quizTargetH, setQuizTargetH] = useState(3);
  const [quizTargetM, setQuizTargetM] = useState(0);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');

  const [storyIdx, setStoryIdx] = useState(0);
  const [storyFeedback, setStoryFeedback] = useState('');
  const [showScratchpad, setShowScratchpad] = useState(false);

  const [frameStyle, setFrameStyle] = useState('bear');
  const [customName, setCustomName] = useState('Karya Jamku');

  const audioCtxRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('mtk_sd2_stars', stars.toString());
  }, [stars]);

  useEffect(() => {
    generateVariedQuiz();
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSound = (type) => {
    try {
      const ctx = initAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  };

  const playChime = () => {
    try {
      const ctx = initAudio();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t = ctx.currentTime + idx * 0.1;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {}
  };

  const getReadableTime = (h, m) => {
    const angkaKata = [
      '', 'satu', 'dua', 'tiga', 'empat', 'lima', 
      'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas'
    ];
    const hWord = angkaKata[h] || h;
    if (m === 0) return `Pukul ${hWord} tepat`;
    if (m === 15) return `Pukul ${hWord} lewat lima belas menit`;
    if (m === 30) return `Pukul ${hWord} lewat tiga puluh menit`;
    if (m === 45) return `Pukul ${hWord} lewat empat puluh lima menit`;
    return `Pukul ${hWord} lewat ${m} menit`;
  };

  const speakText = (textToSpeak) => {
    playChime();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.lang = 'id-ID';
      utter.rate = 0.88;
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
      if (idVoice) utter.voice = idVoice;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  const changeTime = (dh, dm) => {
    let newH = hour + dh;
    let newM = minute + dm;

    if (newM >= 60) {
      newM = 0;
      newH += 1;
    } else if (newM < 0) {
      newM = 45;
      newH -= 1;
    }

    if (newH > 12) newH = 1;
    if (newH < 1) newH = 12;

    setHour(newH);
    setMinute(newM);
    speakText(getReadableTime(newH, newM));
  };

  // --- GENERATE KUIS VARIATIF (JAM TEPAT & PECAHAN MENIT) ---
  const generateVariedQuiz = () => {
    const randH = Math.floor(Math.random() * 12) + 1;
    const possibleMinutes = [0, 15, 30, 45];
    const randM = possibleMinutes[Math.floor(Math.random() * possibleMinutes.length)];
    
    setQuizTargetH(randH);
    setQuizTargetM(randM);

    const correctStr = `${randH.toString().padStart(2, '0')}:${randM.toString().padStart(2, '0')}`;
    setQuizCorrectAnswer(correctStr);

    const opts = [correctStr];
    while (opts.length < 4) {
      const hOpt = Math.floor(Math.random() * 12) + 1;
      const mOpt = possibleMinutes[Math.floor(Math.random() * possibleMinutes.length)];
      const optStr = `${hOpt.toString().padStart(2, '0')}:${mOpt.toString().padStart(2, '0')}`;
      if (!opts.includes(optStr)) {
        opts.push(optStr);
      }
    }
    opts.sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
    setQuizFeedback('');
  };

  const handleQuizAnswer = (selected) => {
    if (selected === quizCorrectAnswer) {
      playSound('correct');
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 1);
      setQuizFeedback('🎉 Hebat! Jawabanmu Benar! (+1 ⭐)');
      speakText(`Hebat! Pukul ${quizTargetH} lewat ${quizTargetM} menit!`);
      setTimeout(() => generateVariedQuiz(), 1600);
    } else {
      playSound('wrong'); // Suara salah berbunyi di sini
      const pesanSalah = 'Coba perhatikan lagi posisi jarum pendek dan panjangnya ya 😊';
      setQuizFeedback(pesanSalah);
      speakText(pesanSalah); // Suara bacaan bantuan juga berbunyi
    }
  };

  const handleStoryAnswer = (pilihan) => {
    const currentQ = SOAL_CERITA[storyIdx];
    if (pilihan === currentQ.jawaban) {
      playSound('correct');
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 2);
      setStoryFeedback('🌟 Pintar sekali! (+2 ⭐)');
      setTimeout(() => {
        setStoryFeedback('');
        setStoryIdx((prev) => (prev + 1) % SOAL_CERITA.length);
      }, 1600);
    } else {
      playSound('wrong');
      const pesanSalah = 'Belum tepat, ayo baca ceritanya pelan-pelan lagi 😊';
      setStoryFeedback(pesanSalah);
      speakText(pesanSalah);
    }
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#d97706';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderAnalogClock = (h, m, interactive = false, size = 256) => {
    const radius = size / 2;
    const numRadius = radius - 34;
    const minLabelRadius = radius - 12;
    const hourDeg = (h % 12) * 30 + m * 0.5;
    const minDeg = m * 6;

    return (
      <div 
        className="relative bg-white rounded-full border-[10px] border-blue-500 shadow-inner flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        {Array.from({ length: 12 }).map((_, idx) => {
          const val = idx * 5;
          const angle = (val * 6 - 90) * (Math.PI / 180);
          const x = radius - 10 + minLabelRadius * Math.cos(angle);
          const y = radius - 10 + minLabelRadius * Math.sin(angle);
          return (
            <span
              key={`m-${val}`}
              className="absolute text-[9px] font-bold text-blue-500 w-5 h-5 flex items-center justify-center -ml-2.5 -mt-2.5 pointer-events-none opacity-80"
              style={{ left: x, top: y }}
            >
              {val.toString().padStart(2, '0')}
            </span>
          );
        })}

        {Array.from({ length: 12 }).map((_, idx) => {
          const num = idx + 1;
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const x = radius - 10 + numRadius * Math.cos(angle);
          const y = radius - 10 + numRadius * Math.sin(angle);
          return (
            <button
              key={`h-${num}`}
              type="button"
              disabled={!interactive}
              onClick={() => {
                if (interactive) {
                  setHour(num);
                  speakText(getReadableTime(num, minute));
                }
              }}
              className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full font-bold text-slate-800 flex items-center justify-center text-sm z-10 transition ${
                interactive ? 'hover:bg-amber-300 active:scale-125 cursor-pointer' : ' cursor-default'
              } ${interactive && h === num ? 'bg-amber-200 ring-2 ring-amber-400' : ''}`}
              style={{ left: x, top: y }}
            >
              {num}
            </button>
          );
        })}

        <div
          className="absolute w-2.5 bg-rose-500 rounded-full origin-bottom shadow-md transition-transform duration-300 pointer-events-none"
          style={{
            height: radius * 0.45,
            bottom: '50%',
            transform: `rotate(${hourDeg}deg)`
          }}
        />

        <div
          className="absolute w-1.5 bg-blue-600 rounded-full origin-bottom shadow-md transition-transform duration-300 pointer-events-none"
          style={{
            height: radius * 0.68,
            bottom: '50%',
            transform: `rotate(${minDeg}deg)`
          }}
        />

        <div className="absolute w-4 h-4 bg-slate-800 rounded-full border-2 border-white z-20 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 text-slate-800 pb-16 select-none font-sans">
      
      <header className="bg-white/95 backdrop-blur sticky top-0 z-30 px-4 py-3 shadow-sm border-b-2 border-amber-200">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-500 text-white p-2 rounded-2xl shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-amber-600 leading-tight">
                Petualangan Matematika
              </h1>
              <p className="text-xs text-slate-500 font-semibold">SD Kelas 2 • Kurikulum Mingguan</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {screen !== 'map' && (
              <button
                onClick={() => {
                  playSound('pop');
                  setScreen('map');
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Peta
              </button>
            )}
            <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1 border border-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{stars}</span>
            </div>
            <button
              onClick={() => speakText(getReadableTime(hour, minute))}
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-xl shadow active:scale-95 transition"
              title="Tes Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* LAYAR 1: PETA MINGGUAN (SEMUA UNLOCKED) */}
      {screen === 'map' && (
        <main className="max-w-xl mx-auto px-4 mt-5 space-y-4">
          <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-amber-200 flex items-center gap-3">
            <div className="text-4xl">🐱</div>
            <div>
              <h2 className="font-extrabold text-sm text-amber-700">Halo Petualang Cilik!</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Semua pulau misi sudah terbuka! Pilih pulau materi belajarmu di bawah ini.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {WEEKLY_MODULES.map((mod) => (
              <div
                key={mod.id}
                onClick={() => {
                  playSound('pop');
                  setScreen(mod.id);
                }}
                className="relative rounded-3xl p-5 border-2 bg-white border-amber-300 shadow-lg hover:scale-[1.01] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-3xl shadow-md text-white`}>
                      {mod.icon}
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 mb-1">
                        {mod.week}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-800">{mod.title}</h3>
                      <p className="text-xs text-slate-500">{mod.subtitle}</p>
                    </div>
                  </div>
                  <div>
                    <span className="bg-emerald-500 text-white px-3 py-2 rounded-xl font-bold text-xs shadow flex items-center gap-1">
                      Main <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* LAYAR 2: MINGGU 1 */}
      {screen === 'week-1' && (
        <main className="max-w-xl mx-auto px-4 mt-3">
          
          <div className="grid grid-cols-5 gap-1.5 bg-white p-1.5 rounded-2xl shadow-sm border border-amber-200 mb-3 text-center">
            {[
              { id: 'eksplor', label: '🧭 Jam' },
              { id: 'tepat', label: '🎯 Kuis' },
              { id: 'pecahan', label: '🍰 Menit' },
              { id: 'cerita', label: '📖 Cerita' },
              { id: 'karya', label: '🎨 Karya' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  playSound('pop');
                  setActiveTab(t.id);
                }}
                className={`py-2 px-1 rounded-xl font-bold text-xs transition ${
                  activeTab === t.id
                    ? 'bg-amber-500 text-white shadow'
                    : 'text-slate-600 hover:bg-amber-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3 flex items-center gap-3 shadow-sm mb-3">
            <div className={`text-3xl transition-transform ${isSpeaking ? 'scale-125 animate-bounce' : ''}`}>
              🐱
            </div>
            <p className="text-xs font-medium text-slate-700 leading-snug">
              {activeTab === 'eksplor' && 'Sentuh angka 1 sampai 12 pada jam atau tekan tombol di bawah untuk memutar jarum!'}
              {activeTab === 'tepat' && 'Tebak jam dan pecahan menit yang ditunjukkan pada jarum jam!'}
              {activeTab === 'pecahan' && 'Bayangkan jam seperti kue bundar! Ketuk kartu 15, 30, atau 45 menit untuk melihat jarumnya.'}
              {activeTab === 'cerita' && 'Yuk bantu teman-teman kita membaca waktu kegiatan sehari-hari!'}
              {activeTab === 'karya' && 'Pilih bingkai kesukaanmu lalu cetak untuk digunting dan ditempel di karton!'}
            </p>
          </div>

          {activeTab === 'eksplor' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-amber-200 flex flex-col items-center">
              <div className="my-2">
                {renderAnalogClock(hour, minute, true, 256)}
              </div>

              <p className="text-[11px] font-semibold text-slate-400 mt-2 mb-2 text-center">
                👆 Sentuh angka 1 – 12 di dalam jam untuk memindahkan jarum pendek
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold mb-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-3 h-3 bg-rose-500 rounded-full inline-block" />
                  Jarum Pendek = Jam
                </span>
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-3 bg-blue-600 rounded-full inline-block" />
                  Jarum Panjang = Menit
                </span>
              </div>

              <div className="bg-slate-900 text-emerald-400 px-6 py-2.5 rounded-2xl font-mono text-4xl font-bold shadow tracking-widest border-2 border-slate-700 flex items-center justify-center gap-1">
                <span>{hour.toString().padStart(2, '0')}</span>
                <span className="animate-pulse">:</span>
                <span>{minute.toString().padStart(2, '0')}</span>
              </div>

              <button
                onClick={() => speakText(getReadableTime(hour, minute))}
                className="mt-3 w-full max-w-xs bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 px-4 py-2.5 rounded-2xl flex items-center justify-between active:scale-95 transition shadow-sm"
              >
                <div className="text-left">
                  <p className="text-[10px] font-bold text-amber-700 uppercase">Dibaca (Ketuk untuk suara):</p>
                  <p className="text-sm font-extrabold">{getReadableTime(hour, minute)}</p>
                </div>
                <span className="text-xl bg-white p-1.5 rounded-xl shadow-sm">📣</span>
              </button>

              <div className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mt-4">
                <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Atur Cepat:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => changeTime(0, 15)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs shadow active:scale-95 transition"
                  >
                    +15 Menit
                  </button>
                  <button
                    onClick={() => changeTime(0, -15)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-xs active:scale-95 transition"
                  >
                    -15 Menit
                  </button>
                  <button
                    onClick={() => changeTime(1, 0)}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs shadow active:scale-95 transition"
                  >
                    +1 Jam
                  </button>
                  <button
                    onClick={() => {
                      setHour(12);
                      setMinute(0);
                      speakText(getReadableTime(12, 0));
                    }}
                    className="bg-amber-400 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs shadow active:scale-95 transition"
                  >
                    Reset (12.00)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUB-MODUL: KUIS VARIATIF (JAM & MENIT) */}
          {activeTab === 'tepat' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-sky-200 flex flex-col items-center text-center">
              <span className="bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded-full text-xs">
                Tantangan Kuis Jam & Menit Variatif
              </span>
              <h2 className="text-lg font-extrabold text-slate-700 mt-1 mb-2">
                Pukul Berapakah Ini?
              </h2>

              <div className="my-2">
                {renderAnalogClock(quizTargetH, quizTargetM, false, 220)}
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs mt-4">
                {quizOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleQuizAnswer(opt)}
                    className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold py-3 rounded-2xl text-sm shadow transition"
                  >
                    Pukul {opt}
                  </button>
                ))}
              </div>

              {quizFeedback && (
                <div className={`mt-4 font-bold text-sm px-4 py-2 rounded-xl border ${quizFeedback.includes('🎉') ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                  {quizFeedback}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pecahan' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-emerald-200 space-y-3">
              <div className="text-center mb-2">
                <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                  Pecahan Waktu Menit
                </span>
                <h2 className="text-lg font-extrabold text-slate-700 mt-1">
                  Lebih 15, 30, dan 45 Menit
                </h2>
              </div>

              {[
                {
                  m: 15,
                  title: 'Lebih 15 Menit (Seperempat Jam)',
                  desc: 'Jarum panjang menunjuk ke Angka 3. (15 menit = 3 × 5 menit)',
                  bg: 'bg-amber-50 border-amber-300 text-amber-900',
                  slice: 'top-0 right-0 w-8 h-8 bg-amber-400'
                },
                {
                  m: 30,
                  title: 'Lebih 30 Menit (Setengah Jam)',
                  desc: 'Jarum panjang menunjuk ke Angka 6. (Setengah lingkaran penuh)',
                  bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
                  slice: 'top-0 right-0 w-8 h-16 bg-emerald-400'
                },
                {
                  m: 45,
                  title: 'Lebih 45 Menit (Tiga Perempat Jam)',
                  desc: 'Jarum panjang menunjuk ke Angka 9. (45 menit)',
                  bg: 'bg-rose-50 border-rose-300 text-rose-900',
                  slice: 'inset-0 bg-rose-400'
                }
              ].map((item) => (
                <div
                  key={item.m}
                  onClick={() => {
                    setMinute(item.m);
                    setActiveTab('eksplor');
                    speakText(getReadableTime(hour, item.m));
                  }}
                  className={`${item.bg} border-2 rounded-2xl p-3.5 flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition shadow-sm`}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-slate-700 relative overflow-hidden bg-white flex-shrink-0">
                    <div className={`absolute ${item.slice}`} />
                    {item.m === 45 && <div className="absolute top-0 left-0 w-8 h-8 bg-white" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm">{item.title}</h3>
                    <p className="text-xs opacity-85 mt-0.5">{item.desc}</p>
                    <span className="inline-block mt-1.5 text-[11px] font-bold underline">
                      👉 Ketuk untuk lihat di jam
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cerita' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-amber-200 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs">
                  Soal Cerita #{storyIdx + 1} dari {SOAL_CERITA.length}
                </span>
                <button
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1 border border-purple-300"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  {showScratchpad ? 'Tutup Coretan' : 'Papan Coretan'}
                </button>
              </div>

              <div className="my-2">
                {renderAnalogClock(SOAL_CERITA[storyIdx].jam, SOAL_CERITA[storyIdx].menit, false, 190)}
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center my-2 w-full">
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                  "{SOAL_CERITA[storyIdx].cerita}"
                </p>
                <button
                  onClick={() => speakText(SOAL_CERITA[storyIdx].cerita)}
                  className="mt-2 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                >
                  🔊 Bacakan Soal
                </button>
              </div>

              {showScratchpad && (
                <div className="w-full my-2 bg-slate-50 border-2 border-dashed border-purple-300 rounded-2xl p-2 flex flex-col items-center">
                  <div className="flex justify-between w-full px-2 mb-1">
                    <span className="text-[10px] font-bold text-purple-700">Area Coret-Coret Hitungan:</span>
                    <button onClick={clearCanvas} className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <Eraser className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={130}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                    className="bg-white rounded-xl border border-slate-200 touch-none w-full max-w-[300px]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
                {SOAL_CERITA[storyIdx].pilihan.map((pil) => (
                  <button
                    key={pil}
                    onClick={() => handleStoryAnswer(pil)}
                    className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-3 px-2 rounded-2xl text-xs sm:text-sm shadow transition"
                  >
                    {pil}
                  </button>
                ))}
              </div>

              {storyFeedback && (
                <div className={`mt-3 font-bold text-sm px-4 py-2 rounded-xl border ${storyFeedback.includes('🌟') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                  {storyFeedback}
                </div>
              )}
            </div>
          )}

          {activeTab === 'karya' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-purple-200 flex flex-col items-center">
              <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs">
                Tugas Membuat Karya Jam Analog
              </span>
              <h2 className="text-lg font-extrabold text-slate-700 mt-1">
                Desain & Cetak Jam Karaktermu
              </h2>

              <div className="flex flex-wrap justify-center gap-2 my-3">
                {[
                  { id: 'bear', label: '🐻 Beruang' },
                  { id: 'cat', label: '🐱 Kucing' },
                  { id: 'classic', label: '⭕ Klasik' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      playSound('pop');
                      setFrameStyle(st.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition ${
                      frameStyle === st.id
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Pola
                </button>
              </div>

              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Tulis Namamu..."
                className="border-2 border-purple-200 rounded-xl px-3 py-1.5 text-center font-bold text-xs text-purple-800 mb-3 focus:outline-none focus:border-purple-500"
              />

              <div className="border-2 border-dashed border-purple-300 p-5 rounded-3xl bg-purple-50/40 flex flex-col items-center w-full">
                <p className="font-extrabold text-sm text-purple-800 mb-3">{customName}</p>

                <div className="relative flex items-center justify-center my-2">
                  {frameStyle === 'bear' && (
                    <>
                      <div className="absolute -top-3 -left-3 w-16 h-16 bg-amber-400 rounded-full border-4 border-amber-600" />
                      <div className="absolute -top-3 -right-3 w-16 h-16 bg-amber-400 rounded-full border-4 border-amber-600" />
                    </>
                  )}
                  {frameStyle === 'cat' && (
                    <>
                      <div className="absolute -top-3 -left-2 w-14 h-14 bg-pink-400 rotate-45 border-4 border-pink-600" />
                      <div className="absolute -top-3 -right-2 w-14 h-14 bg-pink-400 -rotate-45 border-4 border-pink-600" />
                    </>
                  )}
                  <div className="z-10">
                    {renderAnalogClock(hour, minute, false, 210)}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center mt-3">
                  Gunting pola jam dan jarum ini, tempel di kardus/karton, lalu pasang jarumnya di titik tengah!
                </p>
              </div>
            </div>
          )}

        </main>
      )}
    </div>
  );
}