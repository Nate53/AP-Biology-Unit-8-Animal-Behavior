import { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, Trophy, ClipboardList, ChevronDown, ChevronUp, Check, X, Copy, RotateCcw, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ─── Translations ────────────────────────────────────────────────────
const T = {
  appTitle: { en: 'Animal Behavior & Communication', es: 'Comportamiento Animal y Comunicación' },
  subtitle: { en: 'AP Biology — Unit 8: Ecology', es: 'Biología AP — Unidad 8: Ecología' },
  enterName: { en: 'Enter your name to begin', es: 'Ingresa tu nombre para comenzar' },
  namePlaceholder: { en: 'Your name...', es: 'Tu nombre...' },
  start: { en: 'Start Learning', es: 'Comenzar a Aprender' },
  learn: { en: 'Learn', es: 'Aprender' },
  challenge: { en: 'Challenge', es: 'Desafío' },
  compile: { en: 'Compile & Submit', es: 'Compilar y Enviar' },
  checkAnswer: { en: 'Check Answer', es: 'Verificar Respuesta' },
  correct: { en: 'Correct!', es: '¡Correcto!' },
  incorrect: { en: 'Incorrect.', es: 'Incorrecto.' },
  revealModel: { en: 'Reveal Model Answer', es: 'Mostrar Respuesta Modelo' },
  hideModel: { en: 'Hide Model Answer', es: 'Ocultar Respuesta Modelo' },
  compileBtn: { en: 'Compile Responses', es: 'Compilar Respuestas' },
  copyBtn: { en: 'Copy to Clipboard', es: 'Copiar al Portapapeles' },
  copied: { en: 'Copied!', es: '¡Copiado!' },
  reset: { en: 'Reset', es: 'Reiniciar' },
  biozoneRef: { en: 'Biozone Activities 217–228', es: 'Actividades Biozone 217–228' },
  conceptCheck: { en: 'Concept Check', es: 'Verificación de Concepto' },
  points: { en: 'points', es: 'puntos' },
  yourResponse: { en: 'Your response...', es: 'Tu respuesta...' },
};

const t = (key, lang) => T[key]?.[lang] || T[key]?.en || key;

// ─── Rich Text (supports **bold**) ───────────────────────────────────
const RichText = ({ text, className = '' }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

// ─── Concept Check MCQ ──────────────────────────────────────────────
const ConceptCheckMCQ = ({ question, options, correctIndex, explanation, lang }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="concept-check-box">
      <p className="font-semibold text-amber-800 mb-3">{t('conceptCheck', lang)}</p>
      <p className="mb-3 text-gray-700">{question}</p>
      <div className="space-y-2 mb-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !revealed && setSelected(i)}
            className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all text-sm ${
              revealed
                ? i === correctIndex
                  ? 'bg-green-100 border-green-400 text-green-800 font-semibold'
                  : i === selected
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-white border-gray-200 text-gray-500'
                : i === selected
                ? 'bg-brand-100 border-brand-400 text-brand-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          disabled={selected === null}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm disabled:opacity-40 hover:bg-amber-600 transition-colors"
        >
          {t('checkAnswer', lang)}
        </button>
      )}
      {revealed && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${selected === correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-semibold">{selected === correctIndex ? t('correct', lang) : t('incorrect', lang)}</p>
          <p className="mt-1">{explanation}</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 1: STIMULI, PHEROMONES & FIGHT-OR-FLIGHT
// ═══════════════════════════════════════════════════════════════════════
const StimuliSection = ({ lang }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [fofStage, setFofStage] = useState(0); // fight-or-flight walkthrough

  const signalTypes = [
    {
      title: lang === 'es' ? 'Feromonas' : 'Pheromones',
      icon: '🧪',
      desc: lang === 'es'
        ? 'Señales químicas producidas por un animal y liberadas al ambiente externo que afectan el **comportamiento o fisiología** de otros miembros de la misma especie.'
        : 'Chemical signals produced by an animal and released into the external environment that affect the **behavior or physiology** of other members of the same species.',
      examples: lang === 'es'
        ? ['Abejas reina liberan feromonas para mantener el orden social', 'Hormigas marcan senderos con feromonas para guiar a las demás al alimento', 'Mamíferos marcan territorio con feromonas en orina', 'Polillas hembras liberan feromonas sexuales detectables a kilómetros']
        : ['Queen bees release pheromones to maintain social order in the hive', 'Ants lay trail pheromones to guide others to food sources', 'Mammals mark territory with pheromones in urine', 'Female moths release sex pheromones detectable from kilometers away'],
      color: 'purple',
    },
    {
      title: lang === 'es' ? 'COVs Vegetales' : 'Plant VOCs',
      icon: '🌿',
      desc: lang === 'es'
        ? 'Los **compuestos orgánicos volátiles (COVs)** son liberados por plantas atacadas por herbívoros. Viajan por el aire y actúan como señales entre plantas, advirtiendo a las vecinas que activen sus defensas.'
        : '**Volatile organic compounds (VOCs)** are released by plants under herbivore attack. They travel through the air and act as signals between plants, warning neighbors to activate their own defenses.',
      examples: lang === 'es'
        ? ['Plantas dañadas liberan COVs que atraen depredadores de los herbívoros', 'COVs activan genes de defensa en plantas vecinas', 'Las plantas de tabaco liberan COVs que atraen avispas parasitoides', 'Acacias producen taninos cuando plantas vecinas liberan etileno']
        : ['Damaged plants release VOCs that attract predators of herbivores', 'VOCs activate defense-related genes in neighboring plants', 'Tobacco plants release VOCs that attract parasitoid wasps', 'Acacias produce tannins when neighboring plants release ethylene'],
      color: 'green',
    },
    {
      title: lang === 'es' ? 'Respuesta de Lucha o Huida' : 'Fight-or-Flight Response',
      icon: '⚡',
      desc: lang === 'es'
        ? 'Una serie de cambios fisiológicos que preparan al cuerpo para **responder a un peligro**. La médula adrenal secreta **epinefrina** (adrenalina) y norepinefrina bajo control del sistema nervioso simpático.'
        : 'A series of physiological changes that prepare the body to **respond to danger**. The adrenal medulla secretes **epinephrine** (adrenaline) and norepinephrine under sympathetic nervous system control.',
      examples: lang === 'es'
        ? ['Aumenta frecuencia cardíaca y presión arterial', 'Hígado convierte glucógeno a glucosa para energía', 'Sangre se desvía a músculos (lejos del intestino/riñones)', 'Bronquios se dilatan para mayor ingreso de oxígeno', 'Tasa metabólica aumenta']
        : ['Heart rate and blood pressure increase', 'Liver converts glycogen to glucose for energy', 'Blood flow diverted to muscles (away from gut/kidneys)', 'Bronchioles dilate for greater oxygen intake', 'Metabolic rate increases'],
      color: 'red',
    },
    {
      title: lang === 'es' ? 'Respuestas Násticas (Plantas)' : 'Nastic Responses (Plants)',
      icon: '🌱',
      desc: lang === 'es'
        ? 'Respuestas vegetales **no direccionales** a un estímulo. A diferencia de los tropismos, la dirección de la respuesta no depende de la dirección del estímulo. Ejemplo clásico: la **Mimosa pudica**.'
        : 'Plant responses that are **non-directional** — the direction of the response is independent of the direction of the stimulus. Classic example: the **Mimosa pudica** (sensitive plant).',
      examples: lang === 'es'
        ? ['Mimosa cierra sus hojas al contacto (tigmonastia)', 'Las células del pulvino pierden turgencia por salida de K+ y agua', 'Colapso de hojas puede reducir daño por herbívoros o conservar agua', 'La respuesta es reversible — las hojas se reabren después de minutos']
        : ['Mimosa closes its leaves when touched (thigmonasty)', 'Pulvinus cells lose turgor as K+ and water exit', 'Leaf collapse may reduce herbivore damage or conserve water', 'Response is reversible — leaves reopen after several minutes'],
      color: 'blue',
    },
  ];

  const colorMap = {
    purple: { bg: 'bg-purple-50', border: 'border-purple-300', title: 'text-purple-800', dot: 'bg-purple-400' },
    green: { bg: 'bg-green-50', border: 'border-green-300', title: 'text-green-800', dot: 'bg-green-400' },
    red: { bg: 'bg-red-50', border: 'border-red-300', title: 'text-red-800', dot: 'bg-red-400' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', title: 'text-blue-800', dot: 'bg-blue-400' },
  };

  const fofSteps = lang === 'es'
    ? [
        { label: 'Estímulo', icon: '🐺', desc: 'Depredador detectado — señal de estrés percibida' },
        { label: 'Hipotálamo', icon: '🧠', desc: 'Activa el sistema nervioso simpático' },
        { label: 'Médula Adrenal', icon: '💊', desc: 'Secreta epinefrina y norepinefrina al torrente sanguíneo' },
        { label: 'Cambios Fisiológicos', icon: '💓', desc: 'Aumenta FC, PA, glucosa; sangre a músculos; bronquios se dilatan' },
        { label: 'Respuesta', icon: '🏃', desc: '¡Luchar o huir! Rendimiento físico maximizado' },
      ]
    : [
        { label: 'Stimulus', icon: '🐺', desc: 'Predator detected — stress signal perceived' },
        { label: 'Hypothalamus', icon: '🧠', desc: 'Activates the sympathetic nervous system' },
        { label: 'Adrenal Medulla', icon: '💊', desc: 'Secretes epinephrine & norepinephrine into blood' },
        { label: 'Physiological Changes', icon: '💓', desc: 'Increased HR, BP, glucose; blood to muscles; bronchioles dilate' },
        { label: 'Response', icon: '🏃', desc: 'Fight or flee! Peak physical performance' },
      ];

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🔬</span>
        {lang === 'es' ? 'Estímulos, Feromonas y Respuestas' : 'Stimuli, Pheromones & Responses'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'Los organismos detectan y responden a estímulos ambientales para sobrevivir. Las **feromonas** son señales químicas entre miembros de la misma especie, mientras que los **COVs** permiten la comunicación entre plantas. La respuesta de **lucha o huida** prepara a los animales para enfrentar amenazas.'
          : 'Organisms detect and respond to environmental stimuli to survive. **Pheromones** are chemical signals between members of the same species, while **VOCs** enable plant-to-plant communication. The **fight-or-flight** response prepares animals to face threats.'
        } />
      </p>

      {/* Signal Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {signalTypes.map((st, i) => {
          const c = colorMap[st.color];
          const isOpen = activeCard === i;
          return (
            <button
              key={i}
              onClick={() => setActiveCard(isOpen ? null : i)}
              className={`text-left ${c.bg} border ${c.border} rounded-xl p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{st.icon}</span>
                  <span className={`font-semibold ${c.title}`}>{st.title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <p className="text-sm text-gray-600"><RichText text={st.desc} /></p>
              {isOpen && (
                <ul className="mt-3 space-y-1.5">
                  {st.examples.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`${c.dot} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}></span>
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>

      {/* Fight-or-Flight Interactive Walkthrough */}
      <div className="interactive-box">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '⚡ Ruta de Lucha o Huida — Paso a Paso' : '⚡ Fight-or-Flight Pathway — Step by Step'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {lang === 'es'
            ? 'Haz clic en cada paso para recorrer la cascada de lucha o huida.'
            : 'Click through each step to walk through the fight-or-flight cascade.'}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-1 mb-4">
          {fofSteps.map((step, i) => (
            <button
              key={i}
              onClick={() => setFofStage(i)}
              className={`flex-1 rounded-xl p-3 text-center transition-all border-2 ${
                i <= fofStage
                  ? 'bg-red-50 border-red-300 shadow-sm'
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{step.icon}</div>
              <div className={`font-semibold text-xs ${i <= fofStage ? 'text-red-800' : 'text-gray-500'}`}>{step.label}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-lg p-4 border border-red-100">
          <p className="text-sm text-gray-700">
            <strong className="text-red-700">{fofSteps[fofStage].label}:</strong> {fofSteps[fofStage].desc}
          </p>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setFofStage(Math.max(0, fofStage - 1))}
            disabled={fofStage === 0}
            className="px-3 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-50"
          >
            ← {lang === 'es' ? 'Anterior' : 'Back'}
          </button>
          <button
            onClick={() => setFofStage(Math.min(fofSteps.length - 1, fofStage + 1))}
            disabled={fofStage === fofSteps.length - 1}
            className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm disabled:opacity-30 hover:bg-brand-700"
          >
            {lang === 'es' ? 'Siguiente' : 'Next'} →
          </button>
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? '¿Cuál es la diferencia clave entre una feromona y una hormona?'
          : 'What is the key difference between a pheromone and a hormone?'}
        options={
          lang === 'es'
            ? ['Las feromonas solo las producen insectos', 'Las feromonas se liberan al ambiente externo y afectan a otros individuos de la misma especie', 'Las hormonas viajan más lejos que las feromonas', 'Las feromonas solo afectan el comportamiento reproductivo']
            : ['Pheromones are only produced by insects', 'Pheromones are released externally and affect other individuals of the same species', 'Hormones travel farther than pheromones', 'Pheromones only affect reproductive behavior']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Las feromonas se liberan al ambiente externo y afectan a otros miembros de la misma especie. Las hormonas actúan internamente dentro del mismo organismo. Las feromonas pueden afectar el comportamiento, la fisiología y el orden social, no solo la reproducción.'
          : 'Pheromones are released into the external environment and affect other members of the same species. Hormones act internally within the same organism. Pheromones can affect behavior, physiology, and social order — not just reproduction.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 2: COMMUNICATION
// ═══════════════════════════════════════════════════════════════════════
const CommunicationSection = ({ lang }) => {
  const [activeChannel, setActiveChannel] = useState(0);

  const channels = [
    {
      name: lang === 'es' ? 'Visual' : 'Visual',
      icon: '👁️',
      color: 'blue',
      desc: lang === 'es'
        ? 'Señales transmitidas a través de colores corporales, patrones, posturas o exhibiciones. Efectivas a distancias cortas y requieren línea de visión. Incluyen bioluminiscencia, coloración de advertencia y exhibiciones de cortejo.'
        : 'Signals transmitted through body colors, patterns, postures, or displays. Effective at short distances and require line of sight. Include bioluminescence, warning coloration, and courtship displays.',
      examples: lang === 'es'
        ? ['Exhibiciones de plumaje en aves del paraíso durante el cortejo', 'Bioluminiscencia en peces abisales para atraer parejas', 'Expresiones faciales en primates para señales sociales', 'Coloración de advertencia (aposematismo) en ranas venenosas']
        : ['Plumage displays in birds of paradise during courtship', 'Bioluminescence in deep-sea fish to attract mates', 'Facial expressions in primates for social signals', 'Warning coloration (aposematism) in poison dart frogs'],
    },
    {
      name: lang === 'es' ? 'Auditivo' : 'Auditory',
      icon: '🔊',
      color: 'green',
      desc: lang === 'es'
        ? 'Señales de sonido que pueden viajar **largas distancias** e incluso en la oscuridad. Los cantos de aves señalan territorio y estado reproductivo. Las ballenas envían mensajes a través de cientos de kilómetros de océano.'
        : 'Sound signals that can travel **long distances** and even work in darkness. Bird songs signal territory and reproductive fitness. Whales send messages across hundreds of kilometers of ocean.',
      examples: lang === 'es'
        ? ['Cantos de aves para defender territorios y atraer parejas', 'Cantos de ballenas jorobadas audibles a cientos de km', 'Llamadas de alarma en suricatas con significados específicos', 'Grillos macho cantan frotando sus alas (estridulación)']
        : ['Bird songs to defend territories and attract mates', 'Humpback whale songs audible hundreds of km away', 'Alarm calls in meerkats with specific meanings', 'Male crickets chirp by rubbing wings (stridulation)'],
    },
    {
      name: lang === 'es' ? 'Químico (Olfativo)' : 'Chemical (Olfactory)',
      icon: '👃',
      color: 'purple',
      desc: lang === 'es'
        ? 'Las feromonas y marcas de olor se dispersan por el aire o se depositan en el ambiente. Son **duraderas** y funcionan sin contacto visual. Ideales para marcaje territorial y señalización reproductiva a larga distancia.'
        : 'Pheromones and scent marks are dispersed through the air or deposited in the environment. They are **long-lasting** and work without line of sight. Ideal for territory marking and long-distance reproductive signaling.',
      examples: lang === 'es'
        ? ['Hormigas depositan feromonas de sendero hacia fuentes de alimento', 'Perros marcan territorio con orina', 'Polillas macho detectan feromonas femeninas con antenas plumosas', 'Abejas liberan feromonas de alarma cuando pican']
        : ['Ants deposit trail pheromones to food sources', 'Dogs mark territory with urine', 'Male moths detect female pheromones with feathery antennae', 'Bees release alarm pheromones when they sting'],
    },
    {
      name: lang === 'es' ? 'Táctil' : 'Tactile',
      icon: '🤝',
      color: 'amber',
      desc: lang === 'es'
        ? 'El contacto físico es importante en interacciones cooperativas y agresivas. El acicalamiento en primates fortalece lazos sociales. Las arañas macho envían señales por vibración en la tela para evitar ser comidas.'
        : 'Physical contact is important in cooperative and aggressive interactions. Grooming in primates strengthens social bonds. Male spiders send vibratory signals through the web to avoid being eaten.',
      examples: lang === 'es'
        ? ['Acicalamiento en primates para cohesión social', 'Arañas macho vibran la tela como señal de cortejo', 'Las abejas se alimentan entre sí por trofalaxia', 'Contacto entre madre y cría para formación de vínculo']
        : ['Grooming in primates for social cohesion', 'Male spiders vibrate the web as a courtship signal', 'Bees feed each other by trophallaxis', 'Mother-offspring contact for bonding'],
    },
  ];

  const channelColors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', active: 'bg-blue-600', dot: 'bg-blue-400' },
    green: { bg: 'bg-green-50', border: 'border-green-300', active: 'bg-green-600', dot: 'bg-green-400' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-300', active: 'bg-purple-600', dot: 'bg-purple-400' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-300', active: 'bg-amber-600', dot: 'bg-amber-400' },
  };

  const ch = channels[activeChannel];
  const cc = channelColors[ch.color];

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">📡</span>
        {lang === 'es' ? 'Comunicación Animal' : 'Animal Communication'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'La comunicación es la transmisión de una señal de un **emisor** a un **receptor**. Las señales pueden ser visuales, auditivas, químicas o táctiles. Las señales **ritualizadas** siguen un patrón fijo y no varían — esto previene la malinterpretación.'
          : 'Communication is the transmission of a signal from a **sender** to a **receiver**. Signals can be visual, auditory, chemical, or tactile. **Ritualized** signals follow a fixed pattern and do not vary — this prevents miscommunication.'
        } />
      </p>

      {/* Communication Model Diagram */}
      <div className="interactive-box mb-5">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? 'Modelo de Comunicación' : 'Communication Model'}
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          {[
            { label: lang === 'es' ? 'Emisor' : 'Sender', icon: '🦁', sub: lang === 'es' ? 'Transmite la señal' : 'Transmits signal' },
            { label: '→', icon: '', sub: '' },
            { label: lang === 'es' ? 'Canal' : 'Channel', icon: '📡', sub: lang === 'es' ? 'Visual, auditivo, químico, táctil' : 'Visual, auditory, chemical, tactile' },
            { label: '→', icon: '', sub: '' },
            { label: lang === 'es' ? 'Receptor' : 'Receiver', icon: '🦊', sub: lang === 'es' ? 'Detecta y decodifica' : 'Detects & decodes' },
          ].map((step, i) =>
            step.icon ? (
              <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-brand-100 flex-1 min-w-0">
                <div className="text-2xl mb-1">{step.icon}</div>
                <div className="font-semibold text-brand-700 text-sm">{step.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{step.sub}</div>
              </div>
            ) : (
              <div key={i} className="text-brand-400 font-bold text-xl hidden sm:block">→</div>
            )
          )}
        </div>
        <div className="mt-3 bg-white rounded-lg p-3 border border-brand-100 text-sm text-gray-600">
          <RichText text={lang === 'es'
            ? '**Contexto** determina el significado: la misma exhibición puede ocurrir en cortejo, dominancia, depredación o forrajeo.'
            : '**Context** determines meaning: the same display may occur during courtship, dominance, predation, or foraging.'
          } />
        </div>
      </div>

      {/* Channel Explorer */}
      <div className="interactive-box">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '🔎 Explorador de Canales de Comunicación' : '🔎 Communication Channel Explorer'}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {channels.map((chan, i) => (
            <button
              key={i}
              onClick={() => setActiveChannel(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeChannel === i
                  ? `${channelColors[chan.color].active} text-white shadow-md`
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {chan.icon} {chan.name}
            </button>
          ))}
        </div>

        <div className={`${cc.bg} border ${cc.border} rounded-xl p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{ch.icon}</span>
            <h4 className="text-lg font-bold text-gray-800">{ch.name}</h4>
          </div>
          <p className="text-sm text-gray-700 mb-4"><RichText text={ch.desc} /></p>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{lang === 'es' ? 'Ejemplos' : 'Examples'}</p>
          <ul className="space-y-1.5">
            {ch.examples.map((ex, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className={`${cc.dot} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}></span>
                {ex}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? '¿Cuál es la principal ventaja de las señales ritualizadas en la comunicación animal?'
          : 'What is the main advantage of ritualized signals in animal communication?'}
        options={
          lang === 'es'
            ? ['Permiten la comunicación entre diferentes especies', 'Se transmiten siempre de la misma manera, previniendo malinterpretaciones', 'Solo requieren contacto visual', 'Son más fuertes que otros tipos de señales']
            : ['They allow communication between different species', 'They are always delivered the same way, preventing miscommunication', 'They only require visual contact', 'They are louder than other signal types']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Las señales ritualizadas siguen un patrón fijo — siempre se presentan de la misma manera. Esto previene la malinterpretación y asegura resultados predecibles, evitando consecuencias desfavorables como agresión innecesaria o fracaso en el apareamiento.'
          : 'Ritualized signals follow a fixed pattern — they are always delivered the same way. This prevents miscommunication and ensures predictable outcomes, avoiding unfavorable consequences like unnecessary aggression or failure to mate.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 3: COURTSHIP, TERRITORIES & MATING
// ═══════════════════════════════════════════════════════════════════════
const CourtshipSection = ({ lang }) => {
  const [activeDemo, setActiveDemo] = useState('courtship');

  const demos = {
    courtship: {
      title: lang === 'es' ? 'Cortejo y Selección Sexual' : 'Courtship & Sexual Selection',
      icon: '💃',
      content: lang === 'es'
        ? 'El **cortejo** se refiere al comportamiento de los animales antes, durante y justo después del apareamiento. Las hembras a menudo eligen pareja basándose en rasgos que indican **aptitud genética** — esto es **selección intersexual** (elección femenina). Las exhibiciones de cortejo pueden incluir danzas elaboradas, regalos de comida o exhibiciones de plumaje.'
        : '**Courtship** refers to the behavior of animals just before, during, and just after mating. Females often choose mates based on traits indicating **genetic fitness** — this is **intersexual selection** (female choice). Courtship displays may include elaborate dances, food gifts, or plumage displays.',
      details: [
        {
          label: lang === 'es' ? 'Selección Intersexual' : 'Intersexual Selection',
          desc: lang === 'es'
            ? 'Un sexo (generalmente la hembra) elige pareja basándose en exhibiciones, ornamentos o regalos. Las hembras invierten más en la descendencia, así que son selectivas.'
            : 'One sex (usually female) chooses mates based on displays, ornaments, or gifts. Females invest more in offspring, so they are choosier.',
          example: lang === 'es' ? 'Ej: Pavo real con cola más grande = más parejas' : 'Ex: Peacock with larger tail = more mates',
        },
        {
          label: lang === 'es' ? 'Selección Intrasexual' : 'Intrasexual Selection',
          desc: lang === 'es'
            ? 'Competencia entre miembros del mismo sexo (generalmente machos) por acceso a parejas. Incluye combate, exhibiciones de dominancia y defensa de territorio.'
            : 'Competition between members of the same sex (usually males) for access to mates. Includes combat, dominance displays, and territory defense.',
          example: lang === 'es' ? 'Ej: Ciervos machos pelean con sus astas durante la temporada de celo' : 'Ex: Male deer fight with antlers during rutting season',
        },
      ],
    },
    territory: {
      title: lang === 'es' ? 'Territorios y Leks' : 'Territories & Leks',
      icon: '🏔️',
      content: lang === 'es'
        ? 'Un **territorio** es un área defendida que proporciona acceso exclusivo a recursos. El propósito de establecer un territorio es **atraer hembras para el apareamiento**. En el **lek**, múltiples machos se exhiben en un área central, y los machos dominantes en el centro obtienen más parejas.'
        : 'A **territory** is a defended area that provides exclusive access to resources. The purpose of establishing a territory during breeding season is to **attract females for mating**. In a **lek**, multiple males display in a central arena, and dominant males near the center gain more mates.',
      details: [
        {
          label: lang === 'es' ? 'Defensa Territorial' : 'Territory Defense',
          desc: lang === 'es'
            ? 'Los machos defienden territorios mediante el canto, exhibiciones visuales y confrontación directa. Un canto de mejor calidad o más prolongado indica mayor aptitud.'
            : 'Males defend territories through song, visual displays, and direct confrontation. Higher quality or longer song indicates greater fitness.',
          example: lang === 'es' ? 'Ej: Gorriones con canto fuerte tienen territorios invadidos con menor frecuencia' : 'Ex: Song sparrows with louder songs have territories invaded less often',
        },
        {
          label: lang === 'es' ? 'Sistema de Lek' : 'Lek System',
          desc: lang === 'es'
            ? 'Machos compiten en áreas de exhibición (leks). Las hembras visitan y eligen. Los machos en el centro del lek son más dominantes y obtienen más parejas.'
            : 'Males compete in display arenas (leks). Females visit and choose. Males at the center of the lek are more dominant and gain more mates.',
          example: lang === 'es' ? 'Ej: Topi y urogallos forman leks durante la temporada de apareamiento' : 'Ex: Topi antelopes and sage grouse form leks during mating season',
        },
      ],
    },
  };

  const current = demos[activeDemo];

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🦚</span>
        {lang === 'es' ? 'Cortejo, Territorios y Apareamiento' : 'Courtship, Territories & Mating'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'Los comportamientos reproductivos son moldeados por la **selección sexual**. Los machos típicamente compiten por acceso a las hembras, mientras que las hembras eligen pareja basándose en señales de aptitud genética.'
          : 'Reproductive behaviors are shaped by **sexual selection**. Males typically compete for access to females, while females choose mates based on signals of genetic fitness.'
        } />
      </p>

      <div className="interactive-box">
        <div className="flex gap-2 mb-4">
          {Object.entries(demos).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveDemo(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeDemo === key
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-brand-50'
              }`}
            >
              {val.icon} {val.title}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 mb-4 border border-brand-100">
          <p className="text-sm text-gray-700"><RichText text={current.content} /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {current.details.map((d, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-brand-700 mb-2">{d.label}</h4>
              <p className="text-sm text-gray-600 mb-2">{d.desc}</p>
              <p className="text-xs text-gray-500 italic">{d.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bird Song Quality Interactive */}
      <div className="interactive-box mt-5">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '🎵 Calidad del Canto y Éxito Territorial' : '🎵 Song Quality & Territorial Success'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          <RichText text={lang === 'es'
            ? 'En muchas especies de aves, la **calidad del canto** correlaciona con el éxito territorial. Machos con cantos más fuertes, complejos o prolongados mantienen territorios más grandes y se aparean con más hembras.'
            : 'In many bird species, **song quality** correlates with territorial success. Males with louder, more complex, or longer songs maintain larger territories and mate with more females.'
          } />
        </p>
        <div className="bg-white rounded-lg p-4 border border-brand-100">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={[
              { songQuality: 1, territory: 0.5, mates: 0.3 },
              { songQuality: 2, territory: 1.2, mates: 0.7 },
              { songQuality: 3, territory: 2.0, mates: 1.2 },
              { songQuality: 4, territory: 3.1, mates: 1.8 },
              { songQuality: 5, territory: 4.5, mates: 2.5 },
              { songQuality: 6, territory: 5.2, mates: 3.0 },
              { songQuality: 7, territory: 6.0, mates: 3.6 },
              { songQuality: 8, territory: 6.5, mates: 4.2 },
              { songQuality: 9, territory: 6.8, mates: 4.5 },
              { songQuality: 10, territory: 7.0, mates: 4.8 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="songQuality" label={{ value: lang === 'es' ? 'Calidad del Canto' : 'Song Quality (1-10)', position: 'insideBottom', offset: -5, fontSize: 12 }} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="territory" stroke="#5f7148" strokeWidth={2} name={lang === 'es' ? 'Tamaño Territorio (ha)' : 'Territory Size (ha)'} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="mates" stroke="#c96c27" strokeWidth={2} name={lang === 'es' ? 'Parejas por Temporada' : 'Mates per Season'} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {lang === 'es'
              ? 'Datos modelados a partir de estudios en gorriones cantores y carboneros'
              : 'Data modeled from studies on song sparrows and great tits'}
          </p>
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? 'En un sistema de lek, ¿por qué los machos en el centro tienen mayor éxito reproductivo?'
          : 'In a lek system, why do males at the center have greater reproductive success?'}
        options={
          lang === 'es'
            ? ['Están más cerca de las fuentes de alimento', 'Son los más dominantes y las hembras los prefieren', 'Son los más jóvenes y enérgicos', 'Están protegidos de los depredadores por los machos periféricos']
            : ['They are closest to food sources', 'They are the most dominant and females prefer them', 'They are the youngest and most energetic', 'They are protected from predators by peripheral males']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Los machos centrales en un lek son los más dominantes y la posición central correlaciona con éxito en el combate y exhibiciones superiores. Las hembras visitan el lek y preferentemente se aparean con los machos centrales, que demuestran mayor aptitud.'
          : 'Central males in a lek are the most dominant, and the center position correlates with winning fights and superior displays. Females visit the lek and preferentially mate with central males, who demonstrate greater fitness.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 4: SOCIAL BEHAVIOR — HERDS, FLOCKS & COOPERATION
// ═══════════════════════════════════════════════════════════════════════
const SocialBehaviorSection = ({ lang }) => {
  const [activeGroup, setActiveGroup] = useState(null);

  const groupTypes = [
    {
      title: lang === 'es' ? 'Cardúmenes (Peces)' : 'Schools (Fish)',
      icon: '🐟',
      benefits: lang === 'es'
        ? ['Mejor detección de depredadores por el movimiento conjunto', 'Confusión del depredador: difícil seleccionar un individuo', 'Mejor hidrodinámica: menor gasto energético al nadar', 'Reducida probabilidad de captura individual']
        : ['Better predator detection through group movement', 'Predator confusion: hard to single out one individual', 'Better hydrodynamics: less energy spent swimming', 'Reduced probability of individual capture'],
      color: 'blue',
    },
    {
      title: lang === 'es' ? 'Manadas (Mamíferos)' : 'Herds (Mammals)',
      icon: '🦬',
      benefits: lang === 'es'
        ? ['Muchos vigías detectan peligro mientras otros se alimentan', 'El estampido confunde al depredador', 'Las crías están protegidas en el centro del grupo', 'Reducción del riesgo individual (efecto de dilución)']
        : ['Many lookouts detect danger while others feed', 'Stampeding confuses the predator', 'Young are protected in the center of the group', 'Reduced individual risk (dilution effect)'],
      color: 'amber',
    },
    {
      title: lang === 'es' ? 'Bandadas (Aves)' : 'Flocks (Birds)',
      icon: '🦅',
      benefits: lang === 'es'
        ? ['Formación en V reduce gasto energético en migración', 'Mayor eficiencia al localizar alimento', 'Protección por números contra depredadores', 'Aprendizaje social: los jóvenes aprenden rutas migratorias']
        : ['V-formation reduces energy expenditure in migration', 'Greater efficiency in locating food', 'Protection through numbers against predators', 'Social learning: young learn migration routes'],
      color: 'green',
    },
    {
      title: lang === 'es' ? 'Defensa Grupal' : 'Group Defense',
      icon: '🛡️',
      benefits: lang === 'es'
        ? ['Bueyes almizcleros forman círculo defensivo con crías adentro', 'Monos colobos rojos: más machos = más éxito contra chimpancés', 'Mobbing: aves pequeñas acosan a depredadores cooperativamente', 'Ovejas forman rebaños apretados dificultando aislar individuos']
        : ['Musk oxen form a defensive circle with young inside', 'Red colobus monkeys: more males = more success vs chimpanzees', 'Mobbing: small birds harass predators cooperatively', 'Sheep form tight flocks making it hard to isolate individuals'],
      color: 'red',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', title: 'text-blue-800', dot: 'bg-blue-400' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-300', title: 'text-amber-800', dot: 'bg-amber-400' },
    green: { bg: 'bg-green-50', border: 'border-green-300', title: 'text-green-800', dot: 'bg-green-400' },
    red: { bg: 'bg-red-50', border: 'border-red-300', title: 'text-red-800', dot: 'bg-red-400' },
  };

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🐺</span>
        {lang === 'es' ? 'Comportamiento Social y Cooperación' : 'Social Behavior & Cooperation'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'Vivir en grupos proporciona ventajas como **mejor detección de depredadores**, **confusión del depredador** y **forrajeo cooperativo**. Sin embargo, también tiene costos: mayor competencia por recursos y mayor riesgo de enfermedades.'
          : 'Living in groups provides advantages like **improved predator detection**, **predator confusion**, and **cooperative foraging**. However, it also has costs: increased competition for resources and greater disease risk.'
        } />
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {groupTypes.map((gt, i) => {
          const c = colorMap[gt.color];
          const isOpen = activeGroup === i;
          return (
            <button
              key={i}
              onClick={() => setActiveGroup(isOpen ? null : i)}
              className={`text-left ${c.bg} border ${c.border} rounded-xl p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{gt.icon}</span>
                  <span className={`font-semibold ${c.title}`}>{gt.title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {isOpen && (
                <ul className="mt-3 space-y-1.5">
                  {gt.benefits.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`${c.dot} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}></span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>

      {/* Cooperative Foraging Examples */}
      <div className="interactive-box">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '🤝 Forrajeo Cooperativo' : '🤝 Cooperative Foraging'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              animal: lang === 'es' ? 'Leonas' : 'Lionesses',
              icon: '🦁',
              desc: lang === 'es'
                ? 'Cazan en grupo coordinado. Acorralan presas más grandes que las que podrían abatir solas. El éxito grupal supera al individual.'
                : 'Hunt in coordinated groups. Corner prey larger than they could take down alone. Group success exceeds individual success.',
            },
            {
              animal: lang === 'es' ? 'Ballenas Jorobadas' : 'Humpback Whales',
              icon: '🐋',
              desc: lang === 'es'
                ? 'Usan "red de burbujas": nadan en círculo soplando burbujas para encerrar peces, luego suben a alimentarse juntas.'
                : 'Use "bubble netting": swim in circles blowing bubbles to corral fish, then rise together to feed.',
            },
            {
              animal: lang === 'es' ? 'Hormigas Soldado' : 'Army Ants',
              icon: '🐜',
              desc: lang === 'es'
                ? 'Marchan en columnas masivas barriendo todo a su paso. Las obreras pueden someter presas mucho más grandes cooperativamente.'
                : 'March in massive columns sweeping everything in their path. Workers can subdue prey much larger than themselves cooperatively.',
            },
          ].map((ex, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-3xl mb-2">{ex.icon}</div>
              <h4 className="font-semibold text-brand-700 mb-1 text-sm">{ex.animal}</h4>
              <p className="text-xs text-gray-600">{ex.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hunting Success vs Group Size Chart */}
      <div className="interactive-box mt-5">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '📊 Tamaño de Grupo vs. Éxito de Caza (Chimpancés)' : '📊 Group Size vs. Hunting Success (Chimpanzees)'}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          <RichText text={lang === 'es'
            ? 'El éxito de caza en chimpancés **aumenta con el tamaño del grupo** hasta un óptimo, después del cual la coordinación se vuelve más difícil y el éxito se estabiliza o disminuye.'
            : 'Hunting success in chimpanzees **increases with group size** up to an optimum, after which coordination becomes harder and success plateaus or declines.'
          } />
        </p>
        <div className="bg-white rounded-lg p-4 border border-brand-100">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={[
              { hunters: 1, success: 15 },
              { hunters: 2, success: 35 },
              { hunters: 3, success: 55 },
              { hunters: 4, success: 68 },
              { hunters: 5, success: 78 },
              { hunters: 6, success: 84 },
              { hunters: 7, success: 88 },
              { hunters: 8, success: 85 },
              { hunters: 9, success: 80 },
              { hunters: 10, success: 74 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hunters" label={{ value: lang === 'es' ? 'Número de Cazadores' : 'Number of Hunters', position: 'insideBottom', offset: -5, fontSize: 12 }} />
              <YAxis label={{ value: lang === 'es' ? '% Éxito' : '% Success', angle: -90, position: 'insideLeft', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="success" stroke="#5f7148" strokeWidth={2.5} name={lang === 'es' ? '% Éxito de Caza' : '% Hunting Success'} dot={{ r: 4, fill: '#5f7148' }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {lang === 'es'
              ? 'El éxito alcanza un máximo con ~7 cazadores, luego declina por dificultades de coordinación'
              : 'Success peaks at ~7 hunters, then declines due to coordination difficulties'}
          </p>
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? '¿Cuál de las siguientes NO es una ventaja de vivir en grupo?'
          : 'Which of the following is NOT an advantage of group living?'}
        options={
          lang === 'es'
            ? ['Efecto de dilución — menor riesgo individual de depredación', 'Mayor competencia por parejas y alimento', 'Confusión del depredador al atacar al grupo', 'Mayor detección de depredadores con muchos vigías']
            : ['Dilution effect — lower individual predation risk', 'Increased competition for mates and food', 'Predator confusion when attacking a group', 'Improved predator detection with many lookouts']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Mayor competencia por parejas y alimento es un COSTO de la vida en grupo, no una ventaja. Los otros tres son beneficios clásicos: el efecto de dilución reduce el riesgo individual, la confusión del depredador dificulta atacar a uno, y más vigías detectan amenazas antes.'
          : 'Increased competition for mates and food is a COST of group living, not an advantage. The other three are classic benefits: the dilution effect reduces individual risk, predator confusion makes targeting harder, and more lookouts detect threats sooner.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 5: HONEYBEE COMMUNICATION & EUSOCIALITY
// ═══════════════════════════════════════════════════════════════════════
const HoneybeeSection = ({ lang }) => {
  const [danceType, setDanceType] = useState('waggle');
  const [foodAngle, setFoodAngle] = useState(45);
  const [foodDist, setFoodDist] = useState(500);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (danceType === 'waggle') {
      // Draw honeycomb background
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) {
        for (let y = 0; y < h; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Gravity arrow (up)
      ctx.fillStyle = '#6B7280';
      ctx.font = '10px sans-serif';
      ctx.fillText('↑ ' + (lang === 'es' ? 'Arriba (opuesto a gravedad)' : 'Up (opposite gravity)'), 8, 16);

      // Sun position indicator
      const sunAngle = (foodAngle * Math.PI) / 180;
      const sunX = w / 2 + Math.sin(sunAngle) * 80;
      const sunY = 40;
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(w - 30, 30, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400E';
      ctx.font = '9px sans-serif';
      ctx.fillText(lang === 'es' ? 'Sol' : 'Sun', w - 40, 52);

      // Waggle line (angle relative to vertical = angle to sun)
      const centerX = w / 2;
      const centerY = h / 2;
      const lineLength = 50 + (foodDist / 1000) * 40; // longer = farther
      const angleRad = ((foodAngle - 90) * Math.PI) / 180; // Convert to canvas angle (0 = up)
      const waggleAngle = (-foodAngle * Math.PI) / 180;

      // Draw figure-8 path
      const endX = centerX + Math.sin(waggleAngle) * lineLength;
      const endY = centerY - Math.cos(waggleAngle) * lineLength;

      // Return loops
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);

      // Right return loop
      ctx.beginPath();
      ctx.arc(
        (centerX + endX) / 2 + Math.cos(waggleAngle) * 25,
        (centerY + endY) / 2 - Math.sin(waggleAngle) * 25,
        30, waggleAngle - Math.PI / 2, waggleAngle + Math.PI / 2
      );
      ctx.stroke();

      // Left return loop
      ctx.beginPath();
      ctx.arc(
        (centerX + endX) / 2 - Math.cos(waggleAngle) * 25,
        (centerY + endY) / 2 + Math.sin(waggleAngle) * 25,
        30, waggleAngle + Math.PI / 2, waggleAngle + 3 * Math.PI / 2
      );
      ctx.stroke();

      ctx.setLineDash([]);

      // Waggle run (straight line)
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Bee emoji at center
      ctx.font = '20px sans-serif';
      ctx.fillText('🐝', centerX - 10, centerY + 8);

      // Angle indicator
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY - lineLength);
      ctx.stroke();
      ctx.setLineDash([]);

      // Angle arc
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, -Math.PI / 2, waggleAngle - Math.PI / 2, foodAngle > 0);
      ctx.stroke();
      ctx.fillStyle = '#EF4444';
      ctx.font = '11px sans-serif';
      ctx.fillText(`${foodAngle}°`, centerX + 28, centerY - 10);

      // Legend
      const lx = 8, ly = h - 55;
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(lx, ly, 175, 48, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#374151';
      ctx.font = '10px sans-serif';
      ctx.fillText(lang === 'es' ? `Ángulo: ${foodAngle}° del sol` : `Angle: ${foodAngle}° from sun`, lx + 8, ly + 16);
      ctx.fillText(lang === 'es' ? `Distancia: ~${foodDist}m (duración del meneo)` : `Distance: ~${foodDist}m (waggle duration)`, lx + 8, ly + 32);
      ctx.fillText(lang === 'es' ? `Velocidad del meneo → velocidad` : `Waggle speed → how close`, lx + 8, ly + 44);

    } else {
      // Round dance
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) {
        for (let y = 0; y < h; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Round dance circle
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Direction arrows
      ctx.fillStyle = '#B45309';
      // Clockwise arrow at top
      ctx.beginPath();
      ctx.moveTo(cx + 40, cy - 5);
      ctx.lineTo(cx + 48, cy);
      ctx.lineTo(cx + 40, cy + 5);
      ctx.fill();

      ctx.font = '20px sans-serif';
      ctx.fillText('🐝', cx - 10, cy + 8);

      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.fillText(lang === 'es' ? 'Danza circular' : 'Round dance', cx - 35, cy + 65);
      ctx.font = '10px sans-serif';
      ctx.fillText(lang === 'es' ? 'Alimento muy cerca (<50m)' : 'Food very close (<50m)', cx - 55, cy + 80);
      ctx.fillText(lang === 'es' ? 'No indica dirección' : 'No direction indicated', cx - 50, cy + 93);
    }
  }, [danceType, foodAngle, foodDist, lang]);

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🐝</span>
        {lang === 'es' ? 'Comunicación en Abejas y Eusocialidad' : 'Honeybee Communication & Eusociality'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'Las abejas melíferas usan una sofisticada **danza de meneo** para comunicar la dirección y distancia de las fuentes de alimento. Son **eusociales**: tienen castas reproductivas y no reproductivas, cuidado cooperativo de las crías y generaciones superpuestas.'
          : 'Honeybees use a sophisticated **waggle dance** to communicate the direction and distance of food sources. They are **eusocial**: having reproductive and non-reproductive castes, cooperative brood care, and overlapping generations.'
        } />
      </p>

      {/* Waggle Dance Simulator */}
      <div className="interactive-box">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '💃 Simulador de Danza de las Abejas' : '💃 Bee Dance Simulator'}
        </h3>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setDanceType('waggle')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              danceType === 'waggle' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {lang === 'es' ? '∞ Danza de Meneo' : '∞ Waggle Dance'}
          </button>
          <button
            onClick={() => setDanceType('round')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              danceType === 'round' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {lang === 'es' ? '⭕ Danza Circular' : '⭕ Round Dance'}
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} width={300} height={250} className="rounded-lg border border-amber-200" />
        </div>

        {danceType === 'waggle' && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                {lang === 'es' ? `Ángulo desde el sol: ${foodAngle}°` : `Angle from sun: ${foodAngle}°`}
              </label>
              <input
                type="range" min="0" max="180" value={foodAngle}
                onChange={e => setFoodAngle(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                {lang === 'es' ? `Distancia al alimento: ~${foodDist}m` : `Food distance: ~${foodDist}m`}
              </label>
              <input
                type="range" min="100" max="2000" step="100" value={foodDist}
                onChange={e => setFoodDist(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        )}

        <div className="mt-4 bg-white rounded-lg p-3 border border-amber-100 text-sm text-gray-600">
          <RichText text={danceType === 'waggle'
            ? (lang === 'es'
                ? 'El **ángulo del meneo** respecto a la vertical indica el ángulo de la fuente de alimento respecto al sol. La **duración** del tramo recto indica la distancia. Cuanto más rápido el meneo, más **cerca** la fuente.'
                : 'The **waggle angle** relative to vertical indicates the angle of the food source relative to the sun. The **duration** of the straight run indicates distance. The faster the waggle, the **closer** the source.')
            : (lang === 'es'
                ? 'La **danza circular** se usa cuando el alimento está **muy cerca** (menos de 50m). La abeja simplemente gira en un círculo, estimulando a las otras abejas a buscar cerca de la colmena. No indica dirección específica.'
                : 'The **round dance** is used when food is **very close** (less than 50m). The bee simply turns in a circle, stimulating other workers to search near the hive. It does not indicate a specific direction.')
          } />
        </div>
      </div>

      {/* Eusociality Table */}
      <div className="mt-5">
        <h3 className="font-semibold text-gray-700 mb-3">
          {lang === 'es' ? '🏛️ Eusocialidad en las Abejas' : '🏛️ Eusociality in Honeybees'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-brand-100">
                <th className="px-3 py-2 text-left text-brand-800">{lang === 'es' ? 'Casta' : 'Caste'}</th>
                <th className="px-3 py-2 text-left text-brand-800">{lang === 'es' ? 'Ploidía' : 'Ploidy'}</th>
                <th className="px-3 py-2 text-left text-brand-800">{lang === 'es' ? 'Rol' : 'Role'}</th>
                <th className="px-3 py-2 text-left text-brand-800">{lang === 'es' ? 'Parentesco' : 'Relatedness'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                [lang === 'es' ? '👑 Reina' : '👑 Queen', lang === 'es' ? 'Diploide (2n)' : 'Diploid (2n)', lang === 'es' ? 'Pone huevos; única hembra reproductiva' : 'Lays eggs; only reproductive female', '—'],
                [lang === 'es' ? '🐝 Obreras' : '🐝 Workers', lang === 'es' ? 'Diploide (2n)' : 'Diploid (2n)', lang === 'es' ? 'Forrajeo, defensa, cuidado de crías, danza' : 'Foraging, defense, brood care, dancing', lang === 'es' ? 'r = 0.75 entre hermanas' : 'r = 0.75 between sisters'],
                [lang === 'es' ? '🔵 Zánganos' : '🔵 Drones', lang === 'es' ? 'Haploide (n)' : 'Haploid (n)', lang === 'es' ? 'Apareamiento con la reina; mueren después' : 'Mate with queen; die afterward', lang === 'es' ? 'Comparten genes idénticos del padre' : 'Share identical genes from father'],
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 border-t border-gray-100">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-amber-50 rounded-lg p-3 border border-amber-200 text-sm text-gray-700">
          <RichText text={lang === 'es'
            ? '💡 Las obreras comparten **75%** de sus genes entre sí (r = 0.75) porque el padre haploide contribuye genes idénticos a todas sus hijas. Esto explica por qué las obreras "sacrifican" su propia reproducción — al ayudar a la reina a producir más hermanas, transmiten más de sus propios genes que si se reprodujeran ellas mismas.'
            : '💡 Workers share **75%** of their genes with each other (r = 0.75) because the haploid father contributes identical genes to all daughters. This explains why workers "sacrifice" their own reproduction — by helping the queen produce more sisters, they pass on more of their own genes than if they reproduced themselves.'
          } />
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? '¿Qué referencia ambiental usan las abejas para orientarse durante la danza de meneo?'
          : 'What environmental reference do honeybees use to orient during the waggle dance?'}
        options={
          lang === 'es'
            ? ['El campo magnético de la Tierra', 'La posición del sol durante el día', 'La dirección del viento', 'Las estrellas por la noche']
            : ['Earth\'s magnetic field', 'The position of the sun during the day', 'The direction of the wind', 'The stars at night']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Las abejas usan la posición del sol como referencia. El ángulo del tramo recto de la danza respecto a la vertical en el panal indica el ángulo de la fuente de alimento respecto al sol. Las abejas ajustan su danza a lo largo del día para compensar el movimiento del sol.'
          : 'Honeybees use the sun\'s position as a reference. The angle of the waggle run relative to vertical on the comb indicates the angle of the food source relative to the sun. Bees adjust their dance throughout the day to compensate for the sun\'s movement.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 6: KIN SELECTION & ALTRUISM
// ═══════════════════════════════════════════════════════════════════════
const KinSelectionSection = ({ lang }) => {
  const [r, setR] = useState(0.5);
  const [b, setB] = useState(10);
  const [c, setC] = useState(3);
  const rB = r * b;
  const altruismFavored = rB > c;

  // Cooperative breeding data (black-backed jackals)
  const jackalData = [
    { adults: 1, survival: 0.12 },
    { adults: 2, survival: 0.26 },
    { adults: 3, survival: 0.42 },
    { adults: 4, survival: 0.55 },
    { adults: 5, survival: 0.64 },
    { adults: 6, survival: 0.70 },
  ];

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🧬</span>
        {lang === 'es' ? 'Selección por Parentesco y Altruismo' : 'Kin Selection & Altruism'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? '**El altruismo** es un comportamiento que beneficia a otro individuo a un costo para el que lo realiza. Parece contradecir la selección natural — ¿por qué ayudar a otros a expensas propias? La respuesta es la **selección por parentesco**: al ayudar a parientes que comparten tus genes, estás promoviendo indirectamente la transmisión de tus propios genes.'
          : '**Altruism** is behavior that benefits another individual at a cost to the performer. It seems to contradict natural selection — why help others at your own expense? The answer is **kin selection**: by helping relatives who share your genes, you are indirectly promoting the transmission of your own genes.'
        } />
      </p>

      {/* Hamilton's Rule Calculator */}
      <div className="interactive-box">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '📐 Calculadora de la Regla de Hamilton' : '📐 Hamilton\'s Rule Calculator'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          <RichText text={lang === 'es'
            ? 'La **Regla de Hamilton** predice cuándo la selección natural favorecerá el comportamiento altruista: **rB > C**, donde **r** = coeficiente de parentesco, **B** = beneficio reproductivo para el receptor, y **C** = costo reproductivo para el altruista.'
            : '**Hamilton\'s Rule** predicts when natural selection will favor altruistic behavior: **rB > C**, where **r** = coefficient of relatedness, **B** = reproductive benefit to recipient, and **C** = reproductive cost to altruist.'
          } />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              <strong>r</strong> ({lang === 'es' ? 'Parentesco' : 'Relatedness'}): {r.toFixed(2)}
            </label>
            <input type="range" min="0" max="1" step="0.125" value={r} onChange={e => setR(Number(e.target.value))} className="w-full accent-brand-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{lang === 'es' ? 'No relacionado' : 'Unrelated'}</span>
              <span>{lang === 'es' ? 'Clon' : 'Clone'}</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              <strong>B</strong> ({lang === 'es' ? 'Beneficio' : 'Benefit'}): {b}
            </label>
            <input type="range" min="1" max="20" value={b} onChange={e => setB(Number(e.target.value))} className="w-full accent-green-600" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              <strong>C</strong> ({lang === 'es' ? 'Costo' : 'Cost'}): {c}
            </label>
            <input type="range" min="1" max="20" value={c} onChange={e => setC(Number(e.target.value))} className="w-full accent-red-600" />
          </div>
        </div>

        {/* Result */}
        <div className={`rounded-xl p-5 text-center border-2 ${altruismFavored ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <p className="text-lg font-bold mb-2">
            rB = {r.toFixed(2)} × {b} = <span className="text-brand-700">{rB.toFixed(2)}</span>
            <span className="mx-2">{altruismFavored ? '>' : '≤'}</span>
            C = <span className="text-red-600">{c}</span>
          </p>
          <p className={`text-sm font-semibold ${altruismFavored ? 'text-green-700' : 'text-red-700'}`}>
            {altruismFavored
              ? (lang === 'es' ? '✓ Altruismo FAVORECIDO por selección natural' : '✓ Altruism FAVORED by natural selection')
              : (lang === 'es' ? '✗ Altruismo NO favorecido por selección natural' : '✗ Altruism NOT favored by natural selection')}
          </p>
        </div>

        {/* Common r values reference */}
        <div className="mt-4 bg-white rounded-lg p-4 border border-brand-100">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{lang === 'es' ? 'Valores comunes de r' : 'Common r values'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {[
              { rel: lang === 'es' ? 'Clon / Gemelo idéntico' : 'Clone / Identical twin', val: '1.0' },
              { rel: lang === 'es' ? 'Padre-hijo / Hermano' : 'Parent-offspring / Sibling', val: '0.5' },
              { rel: lang === 'es' ? 'Medio-hermano / Tío' : 'Half-sibling / Uncle', val: '0.25' },
              { rel: lang === 'es' ? 'Primo hermano' : 'First cousin', val: '0.125' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setR(Number(item.val))}
                className="bg-gray-50 rounded-lg p-2 border border-gray-200 hover:bg-brand-50 hover:border-brand-300 transition-colors text-center"
              >
                <span className="font-bold text-brand-700 block">{item.val}</span>
                <span className="text-xs text-gray-500">{item.rel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Black-backed Jackal Cooperative Breeding */}
      <div className="interactive-box mt-5">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '🐕 Cría Cooperativa: Chacales de Lomo Negro' : '🐕 Cooperative Breeding: Black-backed Jackals'}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          <RichText text={lang === 'es'
            ? 'En los chacales de lomo negro, las crías de camadas anteriores se quedan como **ayudantes** para criar a los nuevos cachorros. Más adultos ayudantes = mayor supervivencia de cachorros. Los ayudantes son parientes cercanos (r ≈ 0.5), así que al ayudar a criar hermanos, transmiten sus propios genes indirectamente.'
            : 'In black-backed jackals, offspring from previous litters stay as **helpers** to raise new pups. More adult helpers = higher pup survival. Helpers are close relatives (r ≈ 0.5), so by helping raise siblings, they pass on their own genes indirectly.'
          } />
        </p>
        <div className="bg-white rounded-lg p-4 border border-brand-100">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={jackalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="adults" label={{ value: lang === 'es' ? 'Número de Adultos en la Familia' : 'Number of Adults in Family', position: 'insideBottom', offset: -5, fontSize: 12 }} />
              <YAxis label={{ value: lang === 'es' ? 'Supervivencia Cachorros' : 'Pup Survival', angle: -90, position: 'insideLeft', fontSize: 11 }} domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <Tooltip formatter={v => `${(v * 100).toFixed(0)}%`} />
              <Line type="monotone" dataKey="survival" stroke="#5f7148" strokeWidth={2.5} name={lang === 'es' ? 'Supervivencia de Cachorros' : 'Pup Survival'} dot={{ r: 5, fill: '#5f7148' }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {lang === 'es'
              ? 'Relación lineal positiva entre número de ayudantes adultos y supervivencia de cachorros'
              : 'Positive linear relationship between number of adult helpers and pup survival'}
          </p>
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? 'Según la regla de Hamilton, ¿por qué una abeja obrera sacrifica su propia reproducción para ayudar a la reina?'
          : 'According to Hamilton\'s rule, why does a worker honeybee sacrifice its own reproduction to help the queen?'}
        options={
          lang === 'es'
            ? ['Las obreras no tienen capacidad de reproducirse', 'Las obreras comparten 75% de genes con sus hermanas (r = 0.75), más que con sus propias crías (r = 0.5)', 'La reina las obliga mediante feromonas', 'Las obreras no saben que están emparentadas']
            : ['Workers are incapable of reproducing', 'Workers share 75% of genes with sisters (r = 0.75), more than with their own offspring (r = 0.5)', 'The queen forces them through pheromones', 'Workers don\'t know they are related']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Debido a la haplodiploidía, las obreras comparten r = 0.75 con sus hermanas pero solo r = 0.5 con sus propias hijas potenciales. Según rB > C, es genéticamente más rentable ayudar a la reina a producir más hermanas que reproducirse ellas mismas. Este es el fundamento genético de la eusocialidad.'
          : 'Due to haplodiploidy, workers share r = 0.75 with their sisters but only r = 0.5 with their own potential daughters. According to rB > C, it is genetically more profitable to help the queen produce more sisters than to reproduce themselves. This is the genetic basis of eusociality.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// GLOSSARY
// ═══════════════════════════════════════════════════════════════════════
const glossaryTerms = [
  { en: ['Pheromone', 'A chemical produced by an animal and released externally that affects the behavior or physiology of other members of the same species.'], es: ['Feromona', 'Una sustancia química producida por un animal y liberada al exterior que afecta el comportamiento o la fisiología de otros miembros de la misma especie.'], category: 'stimuli' },
  { en: ['Fight-or-Flight Response', 'A physiological response to stress involving epinephrine release from the adrenal medulla, increasing heart rate, blood pressure, and glucose availability.'], es: ['Respuesta de Lucha o Huida', 'Una respuesta fisiológica al estrés que involucra la liberación de epinefrina de la médula adrenal, aumentando la frecuencia cardíaca, presión arterial y disponibilidad de glucosa.'], category: 'stimuli' },
  { en: ['Volatile Organic Compounds (VOCs)', 'Chemicals released by plants under herbivore attack that warn neighboring plants to activate defense genes.'], es: ['Compuestos Orgánicos Volátiles (COVs)', 'Sustancias químicas liberadas por plantas bajo ataque de herbívoros que advierten a las plantas vecinas para activar genes de defensa.'], category: 'stimuli' },
  { en: ['Nastic Response', 'A non-directional plant response to a stimulus (e.g., Mimosa pudica closing leaves when touched — thigmonasty).'], es: ['Respuesta Nástica', 'Una respuesta vegetal no direccional a un estímulo (ej: Mimosa pudica cerrando hojas al contacto — tigmonastia).'], category: 'stimuli' },

  { en: ['Ritualized Signal', 'A signal that follows a fixed pattern and does not vary, preventing miscommunication between sender and receiver.'], es: ['Señal Ritualizada', 'Una señal que sigue un patrón fijo y no varía, previniendo la malinterpretación entre emisor y receptor.'], category: 'communication' },
  { en: ['Visual Signal', 'Communication through body colors, patterns, postures, or displays; requires line of sight.'], es: ['Señal Visual', 'Comunicación a través de colores corporales, patrones, posturas o exhibiciones; requiere línea de visión.'], category: 'communication' },
  { en: ['Auditory Signal', 'Sound-based communication that can travel long distances and work in darkness (e.g., bird song, whale calls).'], es: ['Señal Auditiva', 'Comunicación basada en sonido que puede viajar largas distancias y funcionar en la oscuridad (ej: canto de aves, llamadas de ballenas).'], category: 'communication' },
  { en: ['Chemical Signal', 'Communication via pheromones or scent marks; long-lasting and does not require line of sight.'], es: ['Señal Química', 'Comunicación mediante feromonas o marcas de olor; duradera y no requiere línea de visión.'], category: 'communication' },
  { en: ['Tactile Signal', 'Communication through physical contact (e.g., grooming in primates, trophallaxis in bees).'], es: ['Señal Táctil', 'Comunicación a través del contacto físico (ej: acicalamiento en primates, trofalaxia en abejas).'], category: 'communication' },

  { en: ['Courtship', 'Behavior of animals before, during, and after mating that allows mate assessment and species recognition.'], es: ['Cortejo', 'Comportamiento de los animales antes, durante y después del apareamiento que permite la evaluación de pareja y el reconocimiento de especie.'], category: 'courtship' },
  { en: ['Intersexual Selection', 'Mate choice — one sex (usually female) selects mates based on displays, ornaments, or gifts indicating genetic fitness.'], es: ['Selección Intersexual', 'Elección de pareja — un sexo (generalmente la hembra) selecciona pareja basándose en exhibiciones, ornamentos o regalos que indican aptitud genética.'], category: 'courtship' },
  { en: ['Intrasexual Selection', 'Competition between members of the same sex (usually males) for access to mates.'], es: ['Selección Intrasexual', 'Competencia entre miembros del mismo sexo (generalmente machos) por acceso a parejas.'], category: 'courtship' },
  { en: ['Territory', 'A defended area that provides exclusive access to resources and mates; established through song, display, or confrontation.'], es: ['Territorio', 'Un área defendida que proporciona acceso exclusivo a recursos y parejas; establecido mediante canto, exhibición o confrontación.'], category: 'courtship' },
  { en: ['Lek', 'A communal display arena where males compete for female attention; dominant males near the center gain the most mates.'], es: ['Lek', 'Un área de exhibición comunal donde los machos compiten por la atención de las hembras; los machos dominantes en el centro obtienen más parejas.'], category: 'courtship' },

  { en: ['Dilution Effect', 'In a group, each individual has a lower probability of being the one caught by a predator.'], es: ['Efecto de Dilución', 'En un grupo, cada individuo tiene menor probabilidad de ser capturado por un depredador.'], category: 'social' },
  { en: ['Predator Confusion', 'A group of moving animals makes it difficult for a predator to single out and track one individual.'], es: ['Confusión del Depredador', 'Un grupo de animales en movimiento dificulta que un depredador seleccione y persiga a un individuo.'], category: 'social' },
  { en: ['Cooperative Foraging', 'Group hunting or feeding that increases success rate beyond what individuals could achieve alone.'], es: ['Forrajeo Cooperativo', 'Caza o alimentación grupal que aumenta la tasa de éxito más allá de lo que los individuos lograrían solos.'], category: 'social' },
  { en: ['Group Defense', 'Cooperative defensive behavior such as musk ox circles, mobbing, or coordinated alarm calls.'], es: ['Defensa Grupal', 'Comportamiento defensivo cooperativo como los círculos de bueyes almizcleros, mobbing o llamadas de alarma coordinadas.'], category: 'social' },
  { en: ['Mobbing', 'A group of smaller animals cooperatively harassing a predator to drive it away from nests or young.'], es: ['Mobbing', 'Un grupo de animales pequeños que acosan cooperativamente a un depredador para alejarlo de los nidos o crías.'], category: 'social' },

  { en: ['Waggle Dance', 'A figure-8 dance by honeybees that communicates the direction (angle relative to sun) and distance (duration) of food.'], es: ['Danza de Meneo', 'Una danza en forma de 8 realizada por abejas melíferas que comunica la dirección (ángulo respecto al sol) y distancia (duración) del alimento.'], category: 'honeybee' },
  { en: ['Round Dance', 'A circular dance performed when food is very close (<50m); does not indicate direction.'], es: ['Danza Circular', 'Una danza circular realizada cuando el alimento está muy cerca (<50m); no indica dirección.'], category: 'honeybee' },
  { en: ['Eusociality', 'The highest level of social organization: reproductive division of labor, cooperative brood care, and overlapping generations.'], es: ['Eusocialidad', 'El nivel más alto de organización social: división reproductiva del trabajo, cuidado cooperativo de crías y generaciones superpuestas.'], category: 'honeybee' },
  { en: ['Haplodiploidy', 'Sex determination system in bees: females are diploid (2n), males are haploid (n). This results in r = 0.75 between sisters.'], es: ['Haplodiploidía', 'Sistema de determinación del sexo en abejas: las hembras son diploides (2n), los machos son haploides (n). Esto resulta en r = 0.75 entre hermanas.'], category: 'honeybee' },

  { en: ['Altruism', 'Behavior that benefits another individual at a cost to the performer; explained by kin selection when directed at relatives.'], es: ['Altruismo', 'Comportamiento que beneficia a otro individuo a un costo para quien lo realiza; explicado por selección de parentesco cuando se dirige a parientes.'], category: 'kin' },
  { en: ['Kin Selection', 'Natural selection favoring behaviors that increase the reproductive success of relatives, even at a cost to the individual.'], es: ['Selección por Parentesco', 'Selección natural que favorece comportamientos que aumentan el éxito reproductivo de parientes, incluso a un costo para el individuo.'], category: 'kin' },
  { en: ['Hamilton\'s Rule (rB > C)', 'Altruism is favored when r (relatedness) × B (benefit to recipient) > C (cost to altruist).'], es: ['Regla de Hamilton (rB > C)', 'El altruismo es favorecido cuando r (parentesco) × B (beneficio al receptor) > C (costo al altruista).'], category: 'kin' },
  { en: ['Coefficient of Relatedness (r)', 'The probability that two individuals share a particular allele due to common descent. Parent-offspring: r = 0.5; siblings: r = 0.5.'], es: ['Coeficiente de Parentesco (r)', 'La probabilidad de que dos individuos compartan un alelo particular por descendencia común. Padre-hijo: r = 0.5; hermanos: r = 0.5.'], category: 'kin' },
  { en: ['Inclusive Fitness', 'An individual\'s own reproductive success PLUS the effect of their actions on the reproductive success of relatives, weighted by relatedness.'], es: ['Aptitud Inclusiva', 'El éxito reproductivo propio de un individuo MÁS el efecto de sus acciones en el éxito reproductivo de parientes, ponderado por parentesco.'], category: 'kin' },
  { en: ['Reciprocal Altruism', 'Cooperation between unrelated individuals based on expectation of future reciprocation (e.g., vampire bat blood sharing).'], es: ['Altruismo Recíproco', 'Cooperación entre individuos no emparentados basada en la expectativa de reciprocidad futura (ej: murciélagos vampiro compartiendo sangre).'], category: 'kin' },
];

const categoryLabels = {
  stimuli: { en: 'Stimuli & Responses', es: 'Estímulos y Respuestas' },
  communication: { en: 'Communication', es: 'Comunicación' },
  courtship: { en: 'Courtship & Territories', es: 'Cortejo y Territorios' },
  social: { en: 'Social Behavior', es: 'Comportamiento Social' },
  honeybee: { en: 'Honeybee Communication', es: 'Comunicación de Abejas' },
  kin: { en: 'Kin Selection & Altruism', es: 'Selección por Parentesco y Altruismo' },
};

const categoryColors = {
  stimuli: 'bg-red-100 text-red-800 border-red-200',
  communication: 'bg-blue-100 text-blue-800 border-blue-200',
  courtship: 'bg-purple-100 text-purple-800 border-purple-200',
  social: 'bg-green-100 text-green-800 border-green-200',
  honeybee: 'bg-amber-100 text-amber-800 border-amber-200',
  kin: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

const Glossary = ({ lang }) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = glossaryTerms.filter(term => {
    const [termName, termDef] = term[lang] || term.en;
    const matchesSearch = !search || termName.toLowerCase().includes(search.toLowerCase()) || termDef.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || term.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">📖</span>
        {lang === 'es' ? 'Glosario' : 'Glossary'}
      </h2>
      <p className="text-gray-600 mb-4">
        {lang === 'es'
          ? 'Referencia rápida de todos los términos clave cubiertos en esta unidad.'
          : 'Quick reference for all key terms covered in this unit.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={lang === 'es' ? '🔍 Buscar un término...' : '🔍 Search for a term...'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="all">{lang === 'es' ? 'Todas las secciones' : 'All sections'}</option>
          {Object.entries(categoryLabels).map(([key, labels]) => (
            <option key={key} value={key}>{labels[lang] || labels.en}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        {lang === 'es'
          ? `Mostrando ${filtered.length} de ${glossaryTerms.length} términos`
          : `Showing ${filtered.length} of ${glossaryTerms.length} terms`}
      </p>

      {(filterCat === 'all' ? Object.keys(categoryLabels) : [filterCat]).map(cat => {
        const termsInCat = filtered.filter(t => t.category === cat);
        if (termsInCat.length === 0) return null;
        return (
          <div key={cat} className="mb-5">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${categoryColors[cat]}`}>
              {(categoryLabels[cat]?.[lang] || categoryLabels[cat]?.en)}
            </div>
            <div className="space-y-2">
              {termsInCat.map((term, i) => {
                const [termName, termDef] = term[lang] || term.en;
                return (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-brand-300 transition-colors">
                    <span className="font-semibold text-brand-800">{termName}</span>
                    <span className="text-gray-400 mx-2">—</span>
                    <span className="text-sm text-gray-600">{termDef}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CHALLENGE QUESTIONS
// ═══════════════════════════════════════════════════════════════════════
const challengeQuestions = {
  en: [
    {
      id: 'q1',
      title: 'Communication & Signals',
      points: 4,
      text: '(a) Define a ritualized signal and explain one advantage of ritualized signals in animal communication. (1pt)\n(b) Compare the advantages of chemical (olfactory) communication versus visual communication for an animal that is active at night in a dense forest. (1pt)\n(c) Explain how the honeybee waggle dance communicates both the direction and distance of a food source. Include the role of the sun as a reference. (1pt)\n(d) When is the round dance used instead of the waggle dance? Explain why the round dance does not need to communicate direction. (1pt)',
      model: '(a) A ritualized signal is one that follows a fixed pattern and is always delivered the same way. Advantage: It prevents miscommunication and ensures predictable outcomes — for example, preventing an interaction from escalating to aggression or resulting in failure to breed.\n(b) Chemical signals are better suited for nocturnal forest animals because they: (1) don\'t require line of sight, (2) can travel through dense vegetation, (3) persist in the environment even after the sender leaves, and (4) work in darkness. Visual signals require light and line of sight, both of which are limited at night in a forest.\n(c) Direction: The angle of the waggle run relative to vertical on the comb corresponds to the angle of the food source relative to the sun. Distance: The duration and speed of the waggle run indicates how far the food is — longer waggle runs = more distant food. The sun serves as the reference point for direction, and bees adjust their dance throughout the day as the sun moves.\n(d) The round dance is used when food is very close (less than 50m). Direction information is unnecessary because at such short distances, bees leaving the hive can simply search the immediate area and will quickly locate the food source through its scent.',
    },
    {
      id: 'q2',
      title: 'Courtship & Sexual Selection',
      points: 4,
      text: '(a) Distinguish between intersexual and intrasexual selection. Give one example of each. (1pt)\n(b) Explain why females are typically the "choosier" sex. Relate your answer to parental investment. (1pt)\n(c) In a lek mating system, males at the center of the lek mate more frequently. Explain why this pattern exists and how it relates to female choice. (1pt)\n(d) A researcher finds that male birds with louder, more complex songs maintain larger territories. Explain how song quality could be an honest signal of male fitness. (1pt)',
      model: '(a) Intersexual selection: One sex chooses mates from the other (mate choice). Example: Female peacocks choose males with the largest, most colorful tail displays. Intrasexual selection: Competition between members of the same sex for access to mates. Example: Male deer fight with antlers during the rut; winners gain access to harems.\n(b) Females typically invest more in offspring (larger gametes, pregnancy, lactation, parental care). Because their investment per offspring is higher, each mating decision has greater consequences for their fitness. They benefit from being selective to ensure they mate with high-quality males. Males, with lower per-offspring investment, benefit from mating as often as possible.\n(c) Males at the center of the lek are the most dominant — they have won competitive interactions to gain and hold the central position. Females visit the lek and preferentially choose center males because central position is a reliable indicator of superior fighting ability, health, and genetic quality. This creates a positive feedback: the best males attract the most mates.\n(d) Song quality could be an honest signal because: (1) Producing loud, complex songs requires energy, so only well-nourished males can sustain it. (2) Song complexity may correlate with brain development and overall health. (3) Maintaining a territory while singing exposes males to predators, so only fit males survive. (4) Song quality may indicate freedom from parasites, since parasitized birds sing less.',
    },
    {
      id: 'q3',
      title: 'Social Behavior & Cooperation',
      points: 4,
      text: '(a) Describe TWO benefits and ONE cost of living in a group for prey animals. (1pt)\n(b) Explain the concept of "predator confusion" and describe how schooling fish use it as a defense strategy. (1pt)\n(c) Using the example of musk oxen, explain how group defense provides advantages over individual defense against wolves. (1pt)\n(d) Cooperative hunting success in chimpanzees increases with group size up to about 7 hunters, then declines. Explain why success might decrease with very large hunting groups. (1pt)',
      model: '(a) Benefits: (1) Dilution effect — each individual has a lower probability of being caught by the predator. (2) Many eyes — more group members act as lookouts, increasing predator detection while others feed. Cost: Increased competition for food and mates among group members, plus greater visibility to predators and higher disease transmission rates.\n(b) Predator confusion occurs when a group of moving animals makes it difficult for a predator to single out and track one individual. Schooling fish maintain constant spacing and change direction rapidly and synchronously. When a predator attacks, the school contracts and individuals scatter, creating visual confusion. The predator cannot focus on one target, reducing capture success.\n(c) When wolves attack, musk oxen form a defensive circle with adults facing outward (horns out) and young calves protected in the center. This presents an intimidating wall of horns that is difficult to penetrate. No individual is isolated, reducing each animal\'s chance of being singled out. An individual musk ox alone on the open steppe has little natural cover and is more vulnerable. Group defense is more likely to be successful than individual defense.\n(d) With very large hunting groups: (1) Coordination becomes more difficult — individuals may interfere with each other\'s strategies. (2) There is a greater chance that prey are alerted to the group\'s presence and flee before the hunt begins. (3) Communication between hunters becomes harder. (4) The per-capita share of food decreases, reducing each individual\'s energetic benefit even if the hunt succeeds.',
    },
    {
      id: 'q4',
      title: 'Kin Selection & Hamilton\'s Rule',
      points: 4,
      text: '(a) State Hamilton\'s rule and define each variable. Explain how this rule predicts when altruistic behavior will be favored by natural selection. (1pt)\n(b) Explain why worker honeybees sacrifice their own reproduction to help the queen, using the concept of haplodiploidy and the coefficient of relatedness (r). (1pt)\n(c) In black-backed jackals, offspring from previous litters stay as helpers to raise new pups. Using Hamilton\'s rule, explain why this behavior is adaptive. (1pt)\n(d) Explain reciprocal altruism using the example of vampire bat blood sharing. Why does this form of altruism occur between unrelated individuals? (1pt)',
      model: '(a) Hamilton\'s rule: rB > C, where r = coefficient of relatedness (probability two individuals share an allele by common descent), B = reproductive benefit to the recipient of the altruistic act, C = reproductive cost to the altruist. Natural selection favors altruism when the genetic benefit (rB) outweighs the cost (C). Essentially, helping relatives can pass on your genes indirectly.\n(b) Due to haplodiploidy, the queen\'s mate (drone) is haploid, so all his sperm are genetically identical. This means all worker daughters of the same father share 100% of paternal genes and 50% of maternal genes on average, giving r = 0.75 between sisters. Workers would only share r = 0.5 with their own daughters. So by Hamilton\'s rule, helping the queen produce more sisters (rB = 0.75 × B) is genetically more profitable than producing their own offspring (rB = 0.5 × B), as long as B is similar.\n(c) Helpers are siblings (r = 0.5) of the new pups. By helping raise siblings, they increase the pups\' survival (B is high — data shows a strong positive correlation between number of helpers and pup survival). The cost (C) is delaying their own reproduction. Hamilton\'s rule (0.5 × B > C) is satisfied because the survival benefit per helper is substantial. Helpers also gain experience in parenting that benefits them when they eventually breed.\n(d) Vampire bats that successfully feed will regurgitate blood to roost-mates who failed to feed that night. This is reciprocal altruism: the cost to the donor is small (sharing surplus blood), but the benefit to the recipient is large (preventing starvation). Bats remember who shared with them and reciprocate in the future, while refusing to share with "cheaters." This occurs between unrelated individuals because: (1) bats live in stable social groups, (2) they interact repeatedly, (3) they can recognize individuals and remember past interactions, and (4) the cost of sharing is low relative to the benefit of receiving.',
    },
  ],
  es: [
    {
      id: 'q1',
      title: 'Comunicación y Señales',
      points: 4,
      text: '(a) Define una señal ritualizada y explica una ventaja de las señales ritualizadas en la comunicación animal. (1pt)\n(b) Compara las ventajas de la comunicación química (olfativa) versus la visual para un animal nocturno en un bosque denso. (1pt)\n(c) Explica cómo la danza de meneo de las abejas comunica tanto la dirección como la distancia de una fuente de alimento. Incluye el rol del sol como referencia. (1pt)\n(d) ¿Cuándo se usa la danza circular en lugar de la danza de meneo? Explica por qué la danza circular no necesita comunicar dirección. (1pt)',
      model: '(a) Una señal ritualizada sigue un patrón fijo y siempre se presenta de la misma manera. Ventaja: Previene la malinterpretación y asegura resultados predecibles — por ejemplo, evita que una interacción escale a agresión o que fracase el apareamiento.\n(b) Las señales químicas son mejores para animales nocturnos en bosques porque: (1) no requieren línea de visión, (2) viajan a través de la vegetación densa, (3) persisten en el ambiente, y (4) funcionan en la oscuridad. Las señales visuales requieren luz y línea de visión, ambas limitadas de noche en un bosque.\n(c) Dirección: El ángulo del tramo de meneo respecto a la vertical corresponde al ángulo de la fuente de alimento respecto al sol. Distancia: La duración y velocidad del meneo indica la distancia. El sol es el punto de referencia y las abejas ajustan la danza durante el día.\n(d) La danza circular se usa cuando el alimento está muy cerca (menos de 50m). La información de dirección es innecesaria porque a tan corta distancia, las abejas pueden buscar en el área inmediata y encontrar el alimento por su olor.',
    },
    {
      id: 'q2',
      title: 'Cortejo y Selección Sexual',
      points: 4,
      text: '(a) Distingue entre selección intersexual e intrasexual. Da un ejemplo de cada una. (1pt)\n(b) Explica por qué las hembras típicamente son el sexo más "selectivo." Relaciona tu respuesta con la inversión parental. (1pt)\n(c) En un sistema de lek, los machos en el centro se aparean más frecuentemente. Explica por qué existe este patrón. (1pt)\n(d) Un investigador encuentra que aves macho con cantos más fuertes y complejos mantienen territorios más grandes. Explica cómo la calidad del canto podría ser una señal honesta de aptitud. (1pt)',
      model: '(a) Selección intersexual: Un sexo elige pareja del otro. Ejemplo: Pavas reales eligen machos con las colas más grandes. Selección intrasexual: Competencia entre miembros del mismo sexo. Ejemplo: Ciervos machos pelean con astas durante el celo.\n(b) Las hembras típicamente invierten más en la descendencia (gametos más grandes, gestación, lactancia). Cada decisión de apareamiento tiene mayores consecuencias. Se benefician de ser selectivas para asegurar machos de alta calidad.\n(c) Los machos centrales son los más dominantes — ganaron interacciones competitivas. Las hembras los prefieren porque la posición central indica aptitud superior. Esto crea retroalimentación positiva: los mejores machos atraen más parejas.\n(d) La calidad del canto es señal honesta porque: (1) requiere energía, (2) correlaciona con salud, (3) exponerse cantando indica aptitud, (4) puede indicar ausencia de parásitos.',
    },
    {
      id: 'q3',
      title: 'Comportamiento Social y Cooperación',
      points: 4,
      text: '(a) Describe DOS beneficios y UN costo de vivir en grupo para animales presa. (1pt)\n(b) Explica el concepto de "confusión del depredador" y cómo los peces en cardúmenes lo usan como defensa. (1pt)\n(c) Usando el ejemplo de los bueyes almizcleros, explica cómo la defensa grupal supera a la individual contra lobos. (1pt)\n(d) El éxito de caza cooperativa en chimpancés aumenta hasta ~7 cazadores, luego declina. Explica por qué. (1pt)',
      model: '(a) Beneficios: (1) Efecto de dilución — menor probabilidad individual de captura. (2) Muchos vigías detectan depredadores mientras otros se alimentan. Costo: Mayor competencia por alimento y parejas, mayor visibilidad y transmisión de enfermedades.\n(b) La confusión del depredador ocurre cuando un grupo en movimiento dificulta seleccionar un individuo. Los peces mantienen espaciado constante y cambian dirección sincrónicamente. Al atacar, el cardumen se contrae y dispersa, creando confusión visual.\n(c) Los bueyes almizcleros forman un círculo defensivo con adultos hacia afuera (cuernos expuestos) y crías en el centro. Presentan una barrera intimidante. Ningún individuo queda aislado. Un buey solo en la estepa tiene poca protección natural.\n(d) Con grupos muy grandes: (1) la coordinación se dificulta, (2) mayor probabilidad de alertar a la presa, (3) comunicación más difícil, (4) la porción de alimento per cápita disminuye.',
    },
    {
      id: 'q4',
      title: 'Selección por Parentesco y Regla de Hamilton',
      points: 4,
      text: '(a) Enuncia la regla de Hamilton y define cada variable. Explica cómo predice cuándo se favorece el altruismo. (1pt)\n(b) Explica por qué las abejas obreras sacrifican su reproducción para ayudar a la reina, usando haplodiploidía y r. (1pt)\n(c) En chacales de lomo negro, crías de camadas previas se quedan como ayudantes. Explica por qué usando la regla de Hamilton. (1pt)\n(d) Explica el altruismo recíproco usando el ejemplo de los murciélagos vampiro. ¿Por qué ocurre entre individuos no emparentados? (1pt)',
      model: '(a) Regla de Hamilton: rB > C, donde r = coeficiente de parentesco, B = beneficio reproductivo al receptor, C = costo reproductivo al altruista. El altruismo es favorecido cuando el beneficio genético (rB) supera el costo (C). Ayudar a parientes transmite genes indirectamente.\n(b) Por haplodiploidía, el padre es haploide y su esperma es idéntico. Las obreras hermanas comparten 100% de genes paternos y 50% maternos, dando r = 0.75. Solo compartirían r = 0.5 con sus propias hijas. Por Hamilton, ayudar a la reina a producir hermanas (0.75 × B) es más rentable genéticamente.\n(c) Los ayudantes son hermanos (r = 0.5) de los nuevos cachorros. Más ayudantes = mayor supervivencia. El costo es retrasar la propia reproducción. La regla (0.5 × B > C) se cumple porque el beneficio en supervivencia es sustancial.\n(d) Los murciélagos vampiro exitosos regurgitan sangre a compañeros que no lograron alimentarse. El costo es pequeño pero el beneficio es grande (evitar la inanición). Recuerdan quién compartió y reciprocan. Ocurre entre no emparentados porque: (1) grupos sociales estables, (2) interacciones repetidas, (3) reconocimiento individual, (4) bajo costo de compartir.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [started, setStarted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('learn');
  const [responses, setResponses] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [modelRevealed, setModelRevealed] = useState({ q1: false, q2: false, q3: false, q4: false });
  const [compiled, setCompiled] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const qs = challengeQuestions[lang] || challengeQuestions.en;

  const compileResponses = () => {
    const header = `Animal Behavior & Communication — Challenge Responses\nStudent Name: ${studentName}\nDate: ${new Date().toLocaleDateString()}\n${'═'.repeat(50)}\n`;
    const body = qs.map((q, i) => {
      return `\nQuestion ${i + 1}: ${q.title} (${q.points} ${t('points', lang)})\n${q.text}\n\nMy Response:\n${responses[q.id] || '[No response entered]'}\n\nModel Answer:\n${q.model}\n${'─'.repeat(40)}`;
    }).join('\n');
    setCompiled(header + body);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiled);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = compiled;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const LangToggle = () => (
    <div className="flex gap-1">
      <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-brand-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>EN</button>
      <button onClick={() => setLang('es')} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'es' ? 'bg-brand-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>ES</button>
    </div>
  );

  // ─── Landing Page ──────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-coyote-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <img src="/laughing-coyote-logo.jpg" alt="Laughing Coyote Education" className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md object-cover" />
          <h1 className="text-2xl font-bold text-brand-800 mb-1">{t('appTitle', lang)}</h1>
          <p className="text-gray-500 text-sm mb-6">{t('subtitle', lang)}</p>
          <div className="flex justify-center mb-6">
            <LangToggle />
          </div>
          <label className="text-sm text-gray-600 block mb-2 text-left">{t('enterName', lang)}</label>
          <input
            type="text"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            placeholder={t('namePlaceholder', lang)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            onKeyDown={e => e.key === 'Enter' && studentName.trim() && setStarted(true)}
          />
          <button
            onClick={() => setStarted(true)}
            disabled={!studentName.trim()}
            className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-40 transition-colors"
          >
            {t('start', lang)}
          </button>
        </div>
      </div>
    );
  }

  // ─── Main App ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/laughing-coyote-logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <h1 className="text-sm font-bold text-brand-800">{t('appTitle', lang)}</h1>
              <p className="text-xs text-gray-400">{studentName}</p>
            </div>
          </div>
          <LangToggle />
        </div>
        {/* Nav tabs */}
        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-2">
          {[
            { id: 'learn', label: t('learn', lang), icon: <BookOpen size={16} /> },
            { id: 'challenge', label: t('challenge', lang), icon: <Trophy size={16} /> },
            { id: 'compile', label: t('compile', lang), icon: <ClipboardList size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab flex items-center gap-1.5 ${activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'learn' && (
          <>
            {/* Section Jump Nav */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {lang === 'es' ? 'Ir a la sección' : 'Jump to section'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'section-stimuli', icon: '🔬', label: lang === 'es' ? 'Estímulos y Feromonas' : 'Stimuli & Pheromones' },
                  { id: 'section-communication', icon: '📡', label: lang === 'es' ? 'Comunicación' : 'Communication' },
                  { id: 'section-courtship', icon: '🦚', label: lang === 'es' ? 'Cortejo y Territorios' : 'Courtship & Territories' },
                  { id: 'section-social', icon: '🐺', label: lang === 'es' ? 'Comportamiento Social' : 'Social Behavior' },
                  { id: 'section-honeybee', icon: '🐝', label: lang === 'es' ? 'Abejas y Eusocialidad' : 'Honeybees & Eusociality' },
                  { id: 'section-kin', icon: '🧬', label: lang === 'es' ? 'Selección por Parentesco' : 'Kin Selection' },
                  { id: 'section-glossary', icon: '📖', label: lang === 'es' ? 'Glosario' : 'Glossary' },
                ].map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      const el = document.getElementById(sec.id);
                      if (el) {
                        const yOffset = -120;
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 hover:shadow-sm transition-all"
                  >
                    <span>{sec.icon}</span> {sec.label}
                  </button>
                ))}
              </div>
            </div>

            <div id="section-stimuli"><StimuliSection lang={lang} /></div>
            <div id="section-communication"><CommunicationSection lang={lang} /></div>
            <div id="section-courtship"><CourtshipSection lang={lang} /></div>
            <div id="section-social"><SocialBehaviorSection lang={lang} /></div>
            <div id="section-honeybee"><HoneybeeSection lang={lang} /></div>
            <div id="section-kin"><KinSelectionSection lang={lang} /></div>
            <div id="section-glossary"><Glossary lang={lang} /></div>
          </>
        )}

        {activeTab === 'challenge' && (
          <>
            {qs.map((q, i) => (
              <div key={q.id} className="challenge-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-brand-800">
                    {lang === 'es' ? 'Pregunta' : 'Question'} {i + 1}: {q.title}
                  </h3>
                  <span className="bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                    {q.points} {t('points', lang)}
                  </span>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 mb-4 font-sans">{q.text}</pre>
                <textarea
                  value={responses[q.id]}
                  onChange={e => setResponses({ ...responses, [q.id]: e.target.value })}
                  placeholder={t('yourResponse', lang)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-y"
                />
                <button
                  onClick={() => setModelRevealed({ ...modelRevealed, [q.id]: !modelRevealed[q.id] })}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  {modelRevealed[q.id] ? t('hideModel', lang) : t('revealModel', lang)}
                </button>
                {modelRevealed[q.id] && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-green-800 font-sans">{q.model}</pre>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {activeTab === 'compile' && (
          <div className="challenge-card">
            <h3 className="font-bold text-brand-800 mb-4">{t('compile', lang)}</h3>
            <button
              onClick={compileResponses}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors mb-4"
            >
              {t('compileBtn', lang)}
            </button>
            {compiled && (
              <>
                <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto mb-3 font-sans">
                  {compiled}
                </pre>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    copySuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-coyote-500 text-white hover:bg-coyote-600'
                  }`}
                >
                  {copySuccess ? <><Check size={14} /> {t('copied', lang)}</> : <><Copy size={14} /> {t('copyBtn', lang)}</>}
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <img src="/laughing-coyote-logo.jpg" alt="Logo" className="w-5 h-5 rounded-full object-cover" />
            <span>Laughing Coyote Education</span>
          </div>
          <span>{t('biozoneRef', lang)}</span>
        </div>
      </footer>
    </div>
  );
}
