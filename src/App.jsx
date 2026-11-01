import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, Star, Volume2, Printer, Sparkles, PenTool, Eraser, ChevronLeft
} from 'lucide-react';

const WEEKLY_MODULES = [
  {
    id: 'week-1',
    week: 'Minggu 1',
    title: 'Pulau Waktu (Jam & Menit)',
    subtitle: 'Jam Analog, Digital, Kuis Variatif & Pecahan Menit',
    icon: '🏝️',
    color: 'from-amber-400 to-orange-500',
    unlocked: true,
  },
  {
    id: 'week-2',
    week: 'Minggu 2',
    title: 'Lembah Hitung Cepat Dunia',
    subtitle: 'Metode Jepang (Make-10), Blok Montessori & Lompat Belanda',
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

const SHAPES_QUIZ = [
  { name: 'Segitiga', icon: '🔺', sides: 3, corners: 3, desc: 'Memiliki 3 sisi lurus dan 3 titik sudut.' },
  { name: 'Persegi', icon: '🟦', sides: 4, corners: 4, desc: 'Memiliki 4 sisi sama panjang dan 4 titik sudut.' },
  { name: 'Persegi Panjang', icon: '▭', sides: 4, corners: 4, desc: 'Memiliki 4 sisi (2 pasang sejajar) dan 4 titik sudut.' },
  { name: 'Segi Lima', icon: '⬠', sides: 5, corners: 5, desc: 'Memiliki 5 sisi dan 5 titik sudut.' },
  { name: 'Segi Enam', icon: '⬡', sides: 6, corners: 6, desc: 'Memiliki 6 sisi dan 6 titik sudut.' },
  { name: 'Lingkaran', icon: '🟡', sides: 1, corners: 0, desc: 'Memiliki 1 sisi lengkung dan 0 titik sudut.' }
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

  // Minggu 1: Kuis Variatif
  const [quizTargetH, setQuizTargetH] = useState(3);
  const [quizTargetM, setQuizTargetM] = useState(15);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');

  // Minggu 1: Soal Cerita & Coretan
  const [storyIdx, setStoryIdx] = useState(0);
  const [storyFeedback, setStoryFeedback] = useState('');
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Minggu 1: Karya DIY
  const [frameStyle, setFrameStyle] = useState('bear');
  const [customName, setCustomName] = useState('Karya Jamku');

  // Minggu 2: Metode Dunia (Make-10 Jepang, Blok Nilai Tempat, Garis Lompat Belanda)
  const [w2Tab, setW2Tab] = useState('make10');
  
  // Sub-fitur 1: Make-10 (Sakuranbo Jepang & Ten-Frame)
  const [m10A, setM10A] = useState(8);
  const [m10B, setM10B] = useState(5);
  const [m10Options, setM10Options] = useState([]);
  const [m10Feedback, setM10Feedback] = useState('');

  // Sub-fitur 2: Blok Nilai Tempat (Montessori / Finlandia)
  const [w2Num1, setW2Num1] = useState(124);
  const [w2Num2, setW2Num2] = useState(132);
  const [w2Op, setW2Op] = useState('+');
  const [w2Options, setW2Options] = useState([]);
  const [w2Feedback, setW2Feedback] = useState('');

  // Sub-fitur 3: Garis Bilangan Lompat (Belanda)
  const [jumpTarget, setJumpTarget] = useState(104);
  const [jumpStart, setJumpStart] = useState(97);
  const [jumpOptions, setJumpOptions] = useState([]);
  const [jumpFeedback, setJumpFeedback] = useState('');

  // Minggu 3: Perkalian Ceria
  const [w3Groups, setW3Groups] = useState(3);
  const [w3Items, setW3Items] = useState(4);
  const [w3Options, setW3Options] = useState([]);
  const [w3Feedback, setW3Feedback] = useState('');

  // Minggu 4: Bangun Datar
  const [w4Idx, setW4Idx] = useState(0);
  const [w4Feedback, setW4Feedback] = useState('');

  const audioCtxRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('mtk_sd2_stars', stars.toString());
  }, [stars]);

  useEffect(() => {
    generateVariedQuiz();
    generateMake10Quiz();
    generateW2Quiz();
    generateJumpQuiz();
    generateW3Quiz();
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
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.setValueAtTime(170, now + 0.18);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
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

  const speakText = (textToSpeak, tone = 'normal') => {
    if (tone === 'wrong') {
      playSound('wrong');
    } else if (tone === 'correct') {
      playSound('correct');
    } else {
      playSound('pop');
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.lang = 'id-ID';
      utter.rate = 0.9;
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
    if (newM >= 60) { newM = 0; newH += 1; }
    else if (newM < 0) { newM = 45; newH -= 1; }
    if (newH > 12) newH = 1;
    if (newH < 1) newH = 12;
    setHour(newH);
    setMinute(newM);
    speakText(getReadableTime(newH, newM));
  };

  // --- LOGIKA MINGGU 1 ---
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
      if (!opts.includes(optStr)) opts.push(optStr);
    }
    opts.sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
    setQuizFeedback('');
  };

  const handleQuizAnswer = (selected) => {
    if (selected === quizCorrectAnswer) {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 1);
      setQuizFeedback('🎉 Hebat! Jawabanmu Benar! (+1 ⭐)');
      speakText(`Hebat! Jawabanmu benar, ${getReadableTime(quizTargetH, quizTargetM)}`, 'correct');
      setTimeout(() => generateVariedQuiz(), 1800);
    } else {
      const pesanSalah = 'Ups, belum tepat! Ayo perhatikan lagi jarum pendek dan panjangnya ya.';
      setQuizFeedback('💡 ' + pesanSalah);
      speakText(pesanSalah, 'wrong');
    }
  };

  const handleStoryAnswer = (pilihan) => {
    const currentQ = SOAL_CERITA[storyIdx];
    if (pilihan === currentQ.jawaban) {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 2);
      setStoryFeedback('🌟 Pintar sekali! (+2 ⭐)');
      speakText('Pintar sekali! Jawabanmu benar!', 'correct');
      setTimeout(() => {
        setStoryFeedback('');
        setStoryIdx((prev) => (prev + 1) % SOAL_CERITA.length);
      }, 1800);
    } else {
      const pesanSalah = 'Ups, belum tepat! Ayo baca ceritanya pelan-pelan lagi ya.';
      setStoryFeedback('💡 ' + pesanSalah);
      speakText(pesanSalah, 'wrong');
    }
  };

  // --- LOGIKA MINGGU 2: 1. METODE MAKE-10 (JEPANG & SINGAPURA) ---
  const generateMake10Quiz = () => {
    const a = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, atau 9
    const need = 10 - a;
    const b = Math.floor(Math.random() * (9 - need)) + need + 1;
    setM10A(a);
    setM10B(b);
    const ans = a + b;
    const opts = [ans];
    while (opts.length < 4) {
      const fake = ans + (Math.floor(Math.random() * 5) - 2);
      if (fake > 10 && !opts.includes(fake)) opts.push(fake);
    }
    opts.sort(() => Math.random() - 0.5);
    setM10Options(opts);
    setM10Feedback('');
  };

  const handleMake10Answer = (val) => {
    const ans = m10A + m10B;
    const need = 10 - m10A;
    const rem = m10B - need;
    if (val === ans) {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 2);
      setM10Feedback(`🎉 Hebat! ${m10A} + ${need} jadi 10, ditambah ${rem} = ${ans}! (+2 ⭐)`);
      speakText(`Hebat! Sepuluh ditambah ${rem} sama dengan ${ans}`, 'correct');
      setTimeout(() => generateMake10Quiz(), 2000);
    } else {
      const msg = `Ups! Penuhkan dulu menjadi 10: ${m10A} ditambah ${need} jadi 10, lalu tambahkan sisanya ${rem}.`;
      setM10Feedback('💡 ' + msg);
      speakText(msg, 'wrong');
    }
  };

  // --- LOGIKA MINGGU 2: 2. BLOK NILAI TEMPAT (MONTESSORI / FINLANDIA) ---
  const generateW2Quiz = () => {
    const isAdd = Math.random() > 0.4;
    const h1 = Math.floor(Math.random() * 2) + 1;
    const t1 = Math.floor(Math.random() * 4) + 2;
    const u1 = Math.floor(Math.random() * 4) + 3;

    const h2 = 1;
    const t2 = Math.floor(Math.random() * 2) + 1;
    const u2 = Math.floor(Math.random() * 3) + 1;

    const n1 = h1 * 100 + t1 * 10 + u1;
    const n2 = h2 * 100 + t2 * 10 + u2;

    setW2Num1(n1);
    setW2Num2(n2);
    setW2Op(isAdd ? '+' : '-');
    const ans = isAdd ? n1 + n2 : n1 - n2;
    const opts = [ans];
    while (opts.length < 4) {
      const fake = ans + (Math.floor(Math.random() * 5) - 2) * 10 + (Math.floor(Math.random() * 3) - 1);
      if (fake > 0 && !opts.includes(fake)) opts.push(fake);
    }
    opts.sort(() => Math.random() - 0.5);
    setW2Options(opts);
    setW2Feedback('');
  };

  const handleW2Answer = (val) => {
    const ans = w2Op === '+' ? w2Num1 + w2Num2 : w2Num1 - w2Num2;
    if (val === ans) {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 2);
      setW2Feedback('🎉 Luar Biasa! Hitungan Blok Nilai Tempatmu Tepat! (+2 ⭐)');
      speakText(`Luar biasa! Hasilnya adalah ${ans}`, 'correct');
      setTimeout(() => generateW2Quiz(), 1800);
    } else {
      const msg = 'Ups, belum tepat! Hitung blok Ratusan, Puluhan, dan Satuannya ya.';
      setW2Feedback('💡 ' + msg);
      speakText(msg, 'wrong');
    }
  };

  // --- LOGIKA MINGGU 2: 3. GARIS LOMPAT (BELANDA) ---
  const generateJumpQuiz = () => {
    const start = Math.floor(Math.random() * 5) + 94; // 94 s.d. 98
    const target = Math.floor(Math.random() * 6) + 102; // 102 s.d. 107
    setJumpStart(start);
    setJumpTarget(target);
    const ans = target - start;
    const opts = [ans];
    while (opts.length < 4) {
      const fake = ans + (Math.floor(Math.random() * 5) - 2);
      if (fake > 0 && !opts.includes(fake)) opts.push(fake);
    }
    opts.sort(() => Math.random() - 0.5);
    setJumpOptions(opts);
    setJumpFeedback('');
  };

  const handleJumpAnswer = (val) => {
    const ans = jumpTarget - jumpStart;
    const step1 = 100 - jumpStart;
    const step2 = jumpTarget - 100;
    if (val === ans) {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 2);
      setJumpFeedback(`🎉 Cerdas! Lompat ${step1} ke 100, lalu lompat ${step2} = ${ans}! (+2 ⭐)`);
      speakText(`Cerdas sekali! ${step1} ditambah ${step2} sama dengan ${ans}`, 'correct');
      setTimeout(() => generateJumpQuiz(), 2000);
    } else {
      const msg = `Ups! Jumlahkan dua lompatannya: ${step1} ditambah ${step2}.`;
      setJumpFeedback('💡 ' + msg);
      speakText(msg, 'wrong');
    }
  };

  // --- LOGIKA MINGGU 3 & 4 ---
  const generateW3Quiz = () => {
    const g = Math.floor(Math.random() * 4) + 2;
    const it = Math.floor(Math.random() * 5) + 2;
    setW3Groups(g);
    setW3Items(it);
    const ans = g * it;
    const opts = [ans];
    while (opts.length < 4) {
      const fake = ans + (Math.floor(Math.random() * 7) - 3);
      if (fake > 0 && !opts.includes(fake)) opts.push(fake);
    }
    opts.sort(() => Math.random() - 0.5);
    setW3Options(opts);
    setW3Feedback('');
  };

  const handleW3Answer = (val) => {
    const ans = w3Groups * w3Items;
    if (val === ans) {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 2);
      setW3Feedback('🎉 Benar Sekali! Kamu Jago Perkalian! (+2 ⭐)');
      speakText(`Benar sekali! ${w3Groups} dikali ${w3Items} sama dengan ${ans}`, 'correct');
      setTimeout(() => generateW3Quiz(), 1800);
    } else {
      const msg = 'Ups, belum tepat! Coba jumlahkan semua apel di dalam kotak ya.';
      setW3Feedback('💡 ' + msg);
      speakText(msg, 'wrong');
    }
  };

  const handleW4Answer = (sidesChosen) => {
    const currentShape = SHAPES_QUIZ[w4Idx];
    if (sidesChosen === currentShape.sides) {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      setStars(s => s + 2);
      setW4Feedback(`🎉 Hebat! ${currentShape.name} punya ${currentShape.sides} sisi! (+2 ⭐)`);
      speakText(`Hebat! ${currentShape.name} memiliki ${currentShape.sides} sisi!`, 'correct');
      setTimeout(() => {
        setW4Feedback('');
        setW4Idx((prev) => (prev + 1) % SHAPES_QUIZ.length);
      }, 1800);
    } else {
      const msg = `Ups, belum tepat! Ayo hitung lagi jumlah garis tepi pada ${currentShape.name}.`;
      setW4Feedback('💡 ' + msg);
      speakText(msg, 'wrong');
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

  const stopDraw = () => { isDrawingRef.current = false; };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
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
          style={{ height: radius * 0.45, bottom: '50%', transform: `rotate(${hourDeg}deg)` }}
        />

        <div
          className="absolute w-1.5 bg-blue-600 rounded-full origin-bottom shadow-md transition-transform duration-300 pointer-events-none"
          style={{ height: radius * 0.68, bottom: '50%', transform: `rotate(${minDeg}deg)` }}
        />

        <div className="absolute w-4 h-4 bg-slate-800 rounded-full border-2 border-white z-20 pointer-events-none" />
      </div>
    );
  };

  // Helper visualisasi blok ratusan-puluhan-satuan
  const splitDigits = (num) => {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const u = num % 10;
    return { h, t, u };
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
              <p className="text-xs text-slate-500 font-semibold">SD Kelas 2 • Metode Terbaik Dunia</p>
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

      {screen === 'map' && (
        <main className="max-w-xl mx-auto px-4 mt-5 space-y-4">
          <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-amber-200 flex items-center gap-3">
            <div className="text-4xl">🐱</div>
            <div>
              <h2 className="font-extrabold text-sm text-amber-700">Halo Petualang Cilik!</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Semua 4 Pulau Misi sudah terbuka! Pilih pulau materi yang ingin kamu mainkan hari ini.
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
                  <span className="bg-emerald-500 text-white px-3 py-2 rounded-xl font-bold text-xs shadow flex items-center gap-1">
                    Main <Sparkles className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* MINGGU 1: PULAU WAKTU */}
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
                  activeTab === t.id ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-amber-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3 flex items-center gap-3 shadow-sm mb-3">
            <div className={`text-3xl transition-transform ${isSpeaking ? 'scale-125 animate-bounce' : ''}`}>🐱</div>
            <p className="text-xs font-medium text-slate-700 leading-snug">
              {activeTab === 'eksplor' && 'Sentuh angka 1 sampai 12 pada jam atau tekan tombol di bawah untuk memutar jarum!'}
              {activeTab === 'tepat' && 'Perhatikan jarum pendek merah (jam) dan jarum panjang biru (menit: 00, 15, 30, atau 45)!'}
              {activeTab === 'pecahan' && 'Bayangkan jam seperti kue bundar! Ketuk kartu 15, 30, atau 45 menit untuk melihat jarumnya.'}
              {activeTab === 'cerita' && 'Yuk bantu teman-teman kita membaca waktu kegiatan sehari-hari!'}
              {activeTab === 'karya' && 'Pilih bingkai kesukaanmu lalu cetak untuk digunting dan ditempel di karton!'}
            </p>
          </div>

          {activeTab === 'eksplor' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-amber-200 flex flex-col items-center">
              <div className="my-2">{renderAnalogClock(hour, minute, true, 256)}</div>
              <p className="text-[11px] font-semibold text-slate-400 mt-2 mb-2 text-center">
                👆 Sentuh angka 1 – 12 di dalam jam untuk memindahkan jarum pendek
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold mb-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-3 h-3 bg-rose-500 rounded-full inline-block" /> Jarum Pendek = Jam
                </span>
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-3 bg-blue-600 rounded-full inline-block" /> Jarum Panjang = Menit
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
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => changeTime(0, 15)} className="bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow">+15 Menit</button>
                  <button onClick={() => changeTime(0, -15)} className="bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs">-15 Menit</button>
                  <button onClick={() => changeTime(1, 0)} className="bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs shadow">+1 Jam</button>
                  <button onClick={() => { setHour(12); setMinute(0); speakText(getReadableTime(12, 0)); }} className="bg-amber-400 text-white font-bold py-2.5 rounded-xl text-xs shadow">Reset (12.00)</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tepat' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-sky-200 flex flex-col items-center text-center">
              <span className="bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded-full text-xs">
                Tantangan Kuis Waktu Variatif (00, 15, 30, 45 Menit)
              </span>
              <h2 className="text-lg font-extrabold text-slate-700 mt-1 mb-2">Pukul Berapakah Ini?</h2>
              <div className="my-2">{renderAnalogClock(quizTargetH, quizTargetM, false, 220)}</div>
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
                <div className={`mt-4 font-bold text-sm px-4 py-2 rounded-xl border ${quizFeedback.includes('🎉') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                  {quizFeedback}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pecahan' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-emerald-200 space-y-3">
              <div className="text-center mb-2">
                <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">Pecahan Waktu Menit</span>
                <h2 className="text-lg font-extrabold text-slate-700 mt-1">Lebih 15, 30, dan 45 Menit</h2>
              </div>
              {[
                { m: 15, title: 'Lebih 15 Menit (Seperempat Jam)', desc: 'Jarum panjang menunjuk ke Angka 3. (15 menit = 3 × 5 menit)', bg: 'bg-amber-50 border-amber-300 text-amber-900', slice: 'top-0 right-0 w-8 h-8 bg-amber-400' },
                { m: 30, title: 'Lebih 30 Menit (Setengah Jam)', desc: 'Jarum panjang menunjuk ke Angka 6. (Setengah lingkaran penuh)', bg: 'bg-emerald-50 border-emerald-300 text-emerald-900', slice: 'top-0 right-0 w-8 h-16 bg-emerald-400' },
                { m: 45, title: 'Lebih 45 Menit (Tiga Perempat Jam)', desc: 'Jarum panjang menunjuk ke Angka 9. (45 menit)', bg: 'bg-rose-50 border-rose-300 text-rose-900', slice: 'inset-0 bg-rose-400' }
              ].map((item) => (
                <div
                  key={item.m}
                  onClick={() => { setMinute(item.m); setActiveTab('eksplor'); speakText(getReadableTime(hour, item.m)); }}
                  className={`${item.bg} border-2 rounded-2xl p-3.5 flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition shadow-sm`}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-slate-700 relative overflow-hidden bg-white flex-shrink-0">
                    <div className={`absolute ${item.slice}`} />
                    {item.m === 45 && <div className="absolute top-0 left-0 w-8 h-8 bg-white" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm">{item.title}</h3>
                    <p className="text-xs opacity-85 mt-0.5">{item.desc}</p>
                    <span className="inline-block mt-1.5 text-[11px] font-bold underline">👉 Ketuk untuk lihat di jam</span>
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
                  <PenTool className="w-3.5 h-3.5" /> {showScratchpad ? 'Tutup Coretan' : 'Papan Coretan'}
                </button>
              </div>
              <div className="my-2">{renderAnalogClock(SOAL_CERITA[storyIdx].jam, SOAL_CERITA[storyIdx].menit, false, 190)}</div>
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center my-2 w-full">
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">"{SOAL_CERITA[storyIdx].cerita}"</p>
                <button onClick={() => speakText(SOAL_CERITA[storyIdx].cerita)} className="mt-2 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                  🔊 Bacakan Soal
                </button>
              </div>
              {showScratchpad && (
                <div className="w-full my-2 bg-slate-50 border-2 border-dashed border-purple-300 rounded-2xl p-2 flex flex-col items-center">
                  <div className="flex justify-between w-full px-2 mb-1">
                    <span className="text-[10px] font-bold text-purple-700">Area Coret-Coret Hitungan:</span>
                    <button onClick={clearCanvas} className="text-[10px] font-bold text-rose-600 flex items-center gap-1"><Eraser className="w-3 h-3" /> Hapus</button>
                  </div>
                  <canvas ref={canvasRef} width={300} height={130} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} className="bg-white rounded-xl border border-slate-200 touch-none w-full max-w-[300px]" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
                {SOAL_CERITA[storyIdx].pilihan.map((pil) => (
                  <button key={pil} onClick={() => handleStoryAnswer(pil)} className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-3 px-2 rounded-2xl text-xs sm:text-sm shadow transition">
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
              <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs">Tugas Membuat Karya Jam Analog</span>
              <h2 className="text-lg font-extrabold text-slate-700 mt-1">Desain & Cetak Jam Karaktermu</h2>
              <div className="flex flex-wrap justify-center gap-2 my-3">
                {[
                  { id: 'bear', label: '🐻 Beruang' },
                  { id: 'cat', label: '🐱 Kucing' },
                  { id: 'classic', label: '⭕ Klasik' },
                ].map((st) => (
                  <button key={st.id} onClick={() => { playSound('pop'); setFrameStyle(st.id); }} className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition ${frameStyle === st.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                    {st.label}
                  </button>
                ))}
                <button onClick={() => window.print()} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5" /> Cetak Pola
                </button>
              </div>
              <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Tulis Namamu..." className="border-2 border-purple-200 rounded-xl px-3 py-1.5 text-center font-bold text-xs text-purple-800 mb-3" />
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
                  <div className="z-10">{renderAnalogClock(hour, minute, false, 210)}</div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* MINGGU 2: LEMBAH HITUNG CEPAT DUNIA */}
      {screen === 'week-2' && (
        <main className="max-w-xl mx-auto px-4 mt-3">
          {/* Sub-Tab Metode Dunia */}
          <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 rounded-2xl shadow-sm border border-sky-200 mb-3 text-center">
            {[
              { id: 'make10', label: '🍒 Genap 10 (Jepang)' },
              { id: 'blocks', label: '🧱 Blok (Finlandia)' },
              { id: 'jump', label: '🐸 Lompat (Belanda)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  playSound('pop');
                  setW2Tab(t.id);
                }}
                className={`py-2 px-1 rounded-xl font-bold text-xs transition ${
                  w2Tab === t.id ? 'bg-sky-500 text-white shadow' : 'text-slate-600 hover:bg-sky-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* METODE 1: SAKURANBO / MAKE-10 (JEPANG & SINGAPURA) */}
          {w2Tab === 'make10' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-sky-200 flex flex-col items-center text-center">
              <span className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full text-xs">
                Metode Sakuranbo Jepang & Number Bonds Singapura
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-2">
                Berapakah {m10A} + {m10B} ?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">
                Jangan hitung pakai jari! Penuhkan dulu kotak pertama menjadi <strong>10</strong>:
              </p>

              {/* Visualisasi Ten-Frames */}
              <div className="flex flex-wrap justify-center gap-4 my-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full">
                <div>
                  <p className="text-[11px] font-bold text-slate-600 mb-1.5">Kotak 10 Pertama (Jadi 10!):</p>
                  <div className="grid grid-cols-5 gap-1.5 bg-white p-2 rounded-xl border-2 border-slate-300">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                          i < m10A
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-400 text-amber-950 animate-pulse ring-2 ring-amber-500'
                        }`}
                      >
                        {i < m10A ? '🔴' : '🟡'}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-600 mb-1.5">Sisa di Kotak Kedua:</p>
                  <div className="grid grid-cols-5 gap-1.5 bg-white p-2 rounded-xl border-2 border-slate-300">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const rem = m10B - (10 - m10A);
                      return (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            i < rem ? 'bg-amber-400 shadow-sm' : 'bg-slate-100'
                          }`}
                        >
                          {i < rem ? '🟡' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Diagram Cabang Ceri (Sakuranbo) */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 my-2 w-full max-w-xs">
                <p className="text-xs font-extrabold text-amber-900">
                  🍒 Pecah angka {m10B} menjadi <span className="underline">{10 - m10A}</span> dan <span className="underline">{m10B - (10 - m10A)}</span>:
                </p>
                <p className="text-sm font-black text-emerald-700 mt-1">
                  ({m10A} + {10 - m10A}) + {m10B - (10 - m10A)} = 10 + {m10B - (10 - m10A)} = ?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs mt-2">
                {m10Options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleMake10Answer(opt)}
                    className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-extrabold py-3 rounded-2xl text-lg shadow transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {m10Feedback && (
                <div className={`mt-4 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl border ${m10Feedback.includes('🎉') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                  {m10Feedback}
                </div>
              )}
            </div>
          )}

          {/* METODE 2: BLOK NILAI TEMPAT (MONTESSORI & FINLANDIA) */}
          {w2Tab === 'blocks' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-sky-200 flex flex-col items-center text-center">
              <span className="bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded-full text-xs">
                Metode Blok Nilai Tempat (Finlandia & Montessori)
              </span>
              <h2 className="text-lg font-extrabold text-slate-700 mt-1">
                Hitung Ratusan, Puluhan, dan Satuannya!
              </h2>

              {/* Visualisasi Blok */}
              <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 my-3 space-y-2 text-left">
                {[
                  { label: `Angka Pertama (${w2Num1})`, val: splitDigits(w2Num1) },
                  { label: `${w2Op === '+' ? 'Ditambah (+)' : 'Dikurang (-)'} Angka Kedua (${w2Num2})`, val: splitDigits(w2Num2) }
                ].map((row, rIdx) => (
                  <div key={rIdx} className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="text-[11px] font-extrabold text-slate-600 mb-1">{row.label}:</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-sky-50 p-1.5 rounded-lg border border-sky-200">
                        <span className="block text-[10px] font-bold text-sky-800">Ratusan ({row.val.h}00)</span>
                        <div className="text-sm mt-0.5">{'🟦'.repeat(row.val.h)}</div>
                      </div>
                      <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                        <span className="block text-[10px] font-bold text-amber-800">Puluhan ({row.val.t}0)</span>
                        <div className="text-sm mt-0.5">{'🟨'.repeat(row.val.t)}</div>
                      </div>
                      <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                        <span className="block text-[10px] font-bold text-emerald-800">Satuan ({row.val.u})</span>
                        <div className="text-sm mt-0.5">{'🟢'.repeat(row.val.u)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 text-amber-300 font-mono text-3xl font-extrabold px-8 py-4 rounded-2xl mb-3 shadow-inner border-2 border-slate-700 tracking-widest text-right">
                <div>{w2Num1}</div>
                <div className="border-b-2 border-amber-300 pb-1 mb-1 flex justify-between gap-6">
                  <span>{w2Op}</span>
                  <span>{w2Num2}</span>
                </div>
                <div className="text-emerald-400 text-center">?</div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
                {w2Options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleW2Answer(opt)}
                    className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-extrabold py-3 rounded-2xl text-lg shadow transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {w2Feedback && (
                <div className={`mt-4 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl border ${w2Feedback.includes('🎉') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                  {w2Feedback}
                </div>
              )}
            </div>
          )}

          {/* METODE 3: GARIS BILANGAN LOMPAT (BELANDA) */}
          {w2Tab === 'jump' && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-sky-200 flex flex-col items-center text-center">
              <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                Metode Garis Lompat Katak (Belanda)
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-2">
                Berapakah {jumpTarget} - {jumpStart} ?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">
                Daripada meminjam angka yang rumit, hitung lompatan katak dari <strong>{jumpStart}</strong> menuju <strong>{jumpTarget}</strong> lewat jembatan <strong>100</strong>!
              </p>

              {/* Visualisasi Garis Bilangan Lompat */}
              <div className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 my-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-emerald-800 px-2 mb-1">
                  <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
                    🐸 Lompat +{100 - jumpStart}
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
                    🐸 Lompat +{jumpTarget - 100}
                  </span>
                </div>

                <div className="relative flex items-center justify-between w-full pt-4 pb-2 px-2">
                  <div className="absolute left-4 right-4 top-6 h-1.5 bg-emerald-400 rounded-full" />
                  {[jumpStart, 100, jumpTarget].map((pt, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full border-4 border-white shadow ${idx === 1 ? 'bg-amber-500' : 'bg-emerald-600'}`} />
                      <span className="mt-1 font-extrabold text-sm text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-sm font-black text-emerald-900 mt-3">
                  Total Lompatan = {100 - jumpStart} + {jumpTarget - 100} = ?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs mt-3">
                {jumpOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleJumpAnswer(opt)}
                    className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold py-3 rounded-2xl text-lg shadow transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {jumpFeedback && (
                <div className={`mt-4 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl border ${jumpFeedback.includes('🎉') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                  {jumpFeedback}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* MINGGU 3: HUTAN PERKALIAN CERIA */}
      {screen === 'week-3' && (
        <main className="max-w-xl mx-auto px-4 mt-4">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-emerald-200 flex flex-col items-center text-center">
            <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">Minggu 3 • Perkalian Sebagai Penjumlahan Berulang</span>
            <h2 className="text-lg font-extrabold text-slate-700 mt-2">
              Berapakah {w3Groups} × {w3Items} ?
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Ada {w3Groups} keranjang, masing-masing berisi {w3Items} apel:
            </p>

            <div className="flex flex-wrap justify-center gap-3 my-3">
              {Array.from({ length: w3Groups }).map((_, gIdx) => (
                <div key={gIdx} className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex flex-wrap gap-1 max-w-[110px] justify-center shadow-sm">
                  {Array.from({ length: w3Items }).map((__, iIdx) => (
                    <span key={iIdx} className="text-2xl">🍎</span>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-4">
              Penjumlahan berulang: {Array.from({ length: w3Groups }).map(() => w3Items).join(' + ')} = ?
            </p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {w3Options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleW3Answer(opt)}
                  className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-lg shadow transition"
                >
                  {opt} Apel
                </button>
              ))}
            </div>

            {w3Feedback && (
              <div className={`mt-4 font-bold text-sm px-4 py-2 rounded-xl border ${w3Feedback.includes('🎉') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                {w3Feedback}
              </div>
            )}
          </div>
        </main>
      )}

      {/* MINGGU 4: ISTANA BANGUN DATAR */}
      {screen === 'week-4' && (
        <main className="max-w-xl mx-auto px-4 mt-4">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-200 flex flex-col items-center text-center">
            <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs">Minggu 4 • Mengenal Sisi & Sudut Bangun Datar</span>
            <h2 className="text-xl font-extrabold text-slate-800 mt-2">{SHAPES_QUIZ[w4Idx].name}</h2>
            <div className="text-7xl my-4">{SHAPES_QUIZ[w4Idx].icon}</div>
            <p className="text-xs text-slate-600 mb-4 max-w-xs">{SHAPES_QUIZ[w4Idx].desc}</p>

            <p className="font-extrabold text-sm text-purple-800 mb-3">
              Berapa jumlah sisi yang dimiliki {SHAPES_QUIZ[w4Idx].name}?
            </p>

            <div className="grid grid-cols-5 gap-2 w-full max-w-xs">
              {[1, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => handleW4Answer(num)}
                  className="bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-extrabold py-3 rounded-2xl text-xs shadow transition"
                >
                  {num} Sisi
                </button>
              ))}
            </div>

            {w4Feedback && (
              <div className={`mt-4 font-bold text-sm px-4 py-2 rounded-xl border ${w4Feedback.includes('🎉') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                {w4Feedback}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}