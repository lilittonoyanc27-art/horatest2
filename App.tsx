import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Undo2
} from 'lucide-react';

// --- Types ---

interface ScrambleQuestion {
  id: number;
  questionArm: string;
  correctWords: string[];
  image: string;
}

// --- Data ---

const TIME_SCRAMBLE_DATA: ScrambleQuestion[] = [
  {
    id: 1,
    questionArm: "Ժամը մեկն է",
    correctWords: ["Es", "la", "una"],
    image: "https://picsum.photos/seed/clock_1_scramble/600/400"
  },
  {
    id: 2,
    questionArm: "Ժամը երեքն է",
    correctWords: ["Son", "las", "tres"],
    image: "https://picsum.photos/seed/clock_3_scramble/600/400"
  },
  {
    id: 3,
    questionArm: "Ուղիղ ժամը հինգն է",
    correctWords: ["Son", "las", "cinco", "en", "punto"],
    image: "https://picsum.photos/seed/clock_5_scramble/600/400"
  },
  {
    id: 4,
    questionArm: "Ժամը վեցն անց կես",
    correctWords: ["Son", "las", "seis", "y", "media"],
    image: "https://picsum.photos/seed/clock_630_scramble/600/400"
  },
  {
    id: 5,
    questionArm: "Ժամը ութն անց քառորդ",
    correctWords: ["Son", "las", "ocho", "y", "cuarto"],
    image: "https://picsum.photos/seed/clock_815_scramble/600/400"
  },
  {
    id: 6,
    questionArm: "Տասից տաս է պակաս (9:50)",
    correctWords: ["Son", "las", "diez", "menos", "diez"],
    image: "https://picsum.photos/seed/clock_950_scramble/600/400"
  },
  {
    id: 7,
    questionArm: "Առավոտյան ժամը յոթն է",
    correctWords: ["Son", "las", "siete", "de", "la", "mañana"],
    image: "https://picsum.photos/seed/clock_7am_scramble/600/400"
  },
  {
    id: 8,
    questionArm: "Կեսգիշեր է",
    correctWords: ["Es", "medianoche"],
    image: "https://picsum.photos/seed/clock_midnight_scramble/600/400"
  },
  {
    id: 9,
    questionArm: "Ժամը չորսն անց քսանհինգ",
    correctWords: ["Son", "las", "cuatro", "y", "veinticinco"],
    image: "https://picsum.photos/seed/clock_425_scramble/600/400"
  },
  {
    id: 10,
    questionArm: "Ժամը տասնմեկն անց քառորդ",
    correctWords: ["Son", "las", "once", "y", "cuarto"],
    image: "https://picsum.photos/seed/clock_1115_scramble/600/400"
  }
];

// --- Helper ---
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<{ text: string; originalIndex: number }[]>([]);
  const [shuffledPool, setShuffledPool] = useState<{ text: string; isPicked: boolean }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = TIME_SCRAMBLE_DATA[currentIdx];
  const progress = ((currentIdx + 1) / TIME_SCRAMBLE_DATA.length) * 100;

  // Initialize pool when question changes
  useEffect(() => {
    const shuffled = shuffleArray(currentQuestion.correctWords).map(text => ({
      text,
      isPicked: false
    }));
    setShuffledPool(shuffled);
    setSelectedWords([]);
    setIsCorrect(null);
  }, [currentIdx]);

  const handleWordPick = (index: number) => {
    if (isCorrect !== null) return;
    if (shuffledPool[index].isPicked) return;

    const word = shuffledPool[index].text;
    
    // Update pool
    const newPool = [...shuffledPool];
    newPool[index].isPicked = true;
    setShuffledPool(newPool);

    // Add to selected
    setSelectedWords(prev => [...prev, { text: word, originalIndex: index }]);
  };

  const handleUndo = () => {
    if (isCorrect !== null || selectedWords.length === 0) return;

    const lastWord = selectedWords[selectedWords.length - 1];
    
    // Update pool
    const newPool = [...shuffledPool];
    newPool[lastWord.originalIndex].isPicked = false;
    setShuffledPool(newPool);

    // Remove from selected
    setSelectedWords(prev => prev.slice(0, -1));
  };

  const checkAnswer = () => {
    const userSentence = selectedWords.map(w => w.text).join(' ');
    const correctSentence = currentQuestion.correctWords.join(' ');

    if (userSentence === correctSentence) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < TIME_SCRAMBLE_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#1e40af] bg-gradient-to-b from-[#1e40af] to-[#3b82f6] flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <header className="p-6 flex flex-col gap-4 max-w-2xl mx-auto w-full z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Spanish Time Scramble</h1>
          </div>
          <div className="text-sm font-bold bg-white/20 px-4 py-2 rounded-full border border-white/30">
            {currentIdx + 1} / {TIME_SCRAMBLE_DATA.length}
          </div>
        </div>
        
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-200 to-white shadow-[0_0_15px_rgba(255,255,255,0.6)]"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-2xl mx-auto w-full overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full -z-10" />

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={currentIdx}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="w-full"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-[40px] overflow-hidden border border-white/20 shadow-2xl flex flex-col">
                {/* Image & Question */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img 
                    src={currentQuestion.image} 
                    alt="Clock" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <p className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-lg">
                      {currentQuestion.questionArm}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col gap-8">
                  {/* Result Area */}
                  <div className="min-h-[80px] p-4 bg-black/20 rounded-2xl border-2 border-dashed border-white/20 flex flex-wrap gap-2 items-center justify-center">
                    {selectedWords.length === 0 && (
                      <span className="text-white/30 font-bold italic">Ընտրեք բառերը...</span>
                    )}
                    {selectedWords.map((word, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-4 py-2 bg-white text-[#1e40af] rounded-xl font-black text-lg shadow-lg"
                      >
                        {word.text}
                      </motion.div>
                    ))}
                  </div>

                  {/* Word Pool */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {shuffledPool.map((word, i) => (
                      <div key={i} className="relative">
                        {/* The Gray Block (Placeholder) */}
                        <div className={`px-5 py-3 rounded-xl font-black text-lg transition-colors ${
                          word.isPicked ? 'bg-white/10 text-transparent border border-white/5' : 'bg-transparent text-transparent'
                        }`}>
                          {word.text}
                        </div>
                        
                        {/* The Actual Button */}
                        {!word.isPicked && (
                          <button
                            onClick={() => handleWordPick(i)}
                            className="absolute inset-0 px-5 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-black text-lg shadow-md transition-all active:scale-95 border border-white/10"
                          >
                            {word.text}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <button
                        onClick={handleUndo}
                        disabled={selectedWords.length === 0 || isCorrect !== null}
                        className="flex-1 py-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all border border-white/10"
                      >
                        <Undo2 className="w-5 h-5" />
                        Ջնջել
                      </button>
                      <button
                        onClick={checkAnswer}
                        disabled={selectedWords.length === 0 || isCorrect !== null}
                        className="flex-[2] py-4 bg-white text-[#1e40af] hover:bg-blue-50 disabled:opacity-50 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95"
                      >
                        Ստուգել
                      </button>
                    </div>

                    <AnimatePresence>
                      {isCorrect !== null && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="flex flex-col gap-4"
                        >
                          <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold ${
                            isCorrect ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-6 h-6" />
                                Ճիշտ է:
                              </>
                            ) : (
                              <>
                                <XCircle className="w-6 h-6" />
                                Սխալ է: Ճիշտ պատասխանն է՝ {currentQuestion.correctWords.join(' ')}
                              </>
                            )}
                          </div>
                          <button
                            onClick={nextQuestion}
                            className="w-full py-5 bg-white text-[#1e40af] rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            {currentIdx === TIME_SCRAMBLE_DATA.length - 1 ? 'Արդյունքներ' : 'Հաջորդը'}
                            <ArrowRight className="w-6 h-6" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-[40px] p-12 border border-white/20 shadow-2xl text-center w-full"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-[#1e40af] shadow-2xl">
                <Trophy className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black mb-4">Թեստն ավարտվեց:</h2>
              <p className="text-xl text-blue-100 mb-10">
                Դուք հավաքեցիք <span className="text-white font-black text-3xl">{score}</span> միավոր {TIME_SCRAMBLE_DATA.length}-ից:
              </p>
              
              <button
                onClick={resetQuiz}
                className="w-full py-5 bg-white text-[#1e40af] rounded-[24px] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                Կրկնել թեստը
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer info */}
      <footer className="p-6 text-center text-white/40 text-sm font-medium">
        Իսպաներենի ժամանակի թեստ • Master Spanish Time
      </footer>
    </div>
  );
}
