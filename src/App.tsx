import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { IconType } from 'react-icons'
import {
  GiMusicalNotes, GiGuitar, GiDrum, GiFlute, GiGong, GiRingingBell, GiMaracas, GiXylophone,
  GiDrumKit, GiTambourine, GiViolin, GiHarp, GiGrandPiano, GiBanjo, GiTrumpet, GiClarinet,
  GiSaxophone, GiPanFlute, GiMusicalKeyboard, GiGuitarHead, GiGuitarBassHead,
} from 'react-icons/gi'
import {
  FaMusic, FaLandmark, FaBalanceScale, FaAlignLeft, FaSlidersH, FaDrumSteelpan, FaDrum,
  FaSearch, FaListUl, FaCommentDots, FaHeadphones, FaGlobeAsia, FaBullseye, FaArrowRight,
  FaLeaf, FaCloud, FaChevronLeft, FaChevronRight, FaExpand,
} from 'react-icons/fa'
import { LuDrum } from 'react-icons/lu'
import { MdPiano } from 'react-icons/md'
import { PiWaveform } from 'react-icons/pi'
import './App.css'

const COL = { idio: '#D4880F', memb: '#E4577A', chord: '#2FA58F', aero: '#4F7BD9', elec: '#9B5DE5' }

type Item = { icon: IconType; name: string; cap: string; tag?: string; color?: string; image?: string; source?: string }
type Card = { icon: IconType; color: string; head: string; body: string; image: string; source: string; imageLabel: string; note: string }

type Slide =
  | { kind: 'cover' }
  | { kind: 'cards2'; title: string; lead: string; cards: [Card, Card] }
  | { kind: 'row'; title: string; eyebrow?: string; lead?: string; color?: string; items: Item[]; pill?: string }
  | { kind: 'steps' }
  | { kind: 'flow' }
  | { kind: 'interp' }

const family = (
  n: number, title: string, lead: string, color: string, pill: string,
  items: [IconType, string, string][],
): Slide => ({
  kind: 'row', title, eyebrow: `FAMILY ${n} OF 5`, lead, color, pill,
  items: items.map(([icon, name, cap]) => ({ icon, name, cap, ...instrumentPhotos[name] })),
})

const commonsPhoto = (image: string, file: string) => ({
  image: `/instruments/${image}`,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ', '_'))}`,
})

const commonsSource = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ', '_'))}`

const instrumentPhotos: Record<string, Pick<Item, 'image' | 'source'>> = {
  Bell: commonsPhoto('bell.jpg', 'Bell in Japanese Garden NBG 100 crop LR.jpg'),
  Maracas: commonsPhoto('maracas.jpg', 'Maracas.jpg'),
  'Agung Gong': commonsPhoto('agung.jpg', 'COLLECTIE TROPENMUSEUM Gong hangend in een standaard onderdeel van gamelan Semar Pagulingan TMnr 1340-13.jpg'),
  Kulintang: commonsPhoto('kulintang.jpg', 'Mindanao Bangsamoro Islamic Musical Instruments.jpg'),
  Steelpan: commonsPhoto('steelpan.jpg', 'Steelpan Instruments at Trinidad and Tobago Carnival.jpg'),
  'Snare Drum': commonsPhoto('snare-drum.jpg', 'Caisse claire.jpg'),
  'Bass Drum': commonsPhoto('bass-drum.jpg', 'Gran cassa.jpg'),
  Dabakan: commonsPhoto('dabakan.jpg', 'Dabakan 2.jpg'),
  'Drum Kit': commonsPhoto('drum-kit.jpg', 'A drum kit made by Mapex Drums - Cacon Photos- Copyleft - Creative Commons 11.jpg'),
  Tambourine: commonsPhoto('tambourine.jpg', 'Pandeiro new 30-09-07.jpg'),
  Guitar: commonsPhoto('guitar.jpg', 'Guitarra eléctrica.JPG'),
  Violin: commonsPhoto('violin.png', 'Violin VL100.png'),
  Harp: commonsPhoto('harp.jpg', 'Harp guitar, Germany, 1994 (replica of 1920 harp-guitar by W.J.Dyer & Bros.) - MIM PHX.jpg'),
  Piano: commonsPhoto('piano.jpg', 'Steinway Vienna 002.JPG'),
  Kudyapi: commonsPhoto('kudyapi.jpg', 'Kaamulan Festival 2016 - 26167600132 cropped.jpg'),
  Flute: commonsPhoto('flute.jpg', 'Shinobue and other flutes-3.jpg'),
  Trumpet: commonsPhoto('trumpet.jpg', 'Yamaha Trumpet YTR-8335LA crop.jpg'),
  Clarinet: commonsPhoto('clarinet.png', 'Leitner+Kraus 410 320.png'),
  Saxophone: commonsPhoto('saxophone.png', 'Eight saxophone sizes smaller.png'),
  Tongali: commonsPhoto('tongali.jpg', 'Kalaleng Tongali Tinglayan Kalinga2.jpg'),
  Synthesizer: commonsPhoto('synthesizer.jpg', 'R.A.Moog minimoog 2.jpg'),
  'E-Keyboard': commonsPhoto('e-keyboard.jpg', 'YamahaKeyboard-2.jpg'),
  'Electric Guitar': commonsPhoto('electric-guitar.jpg', 'G&L Legacy Guitar.JPG'),
  'Electric Bass': commonsPhoto('electric-bass.jpg', 'Fender Precision Bass.jpg'),
  'Drum Machine': commonsPhoto('drum-machine.jpg', 'Elektron Analog RYTM - 2014 NAMM Show.jpg'),
}

const SLIDES: Slide[] = [
  { kind: 'cover' },
  { kind: 'cards2', title: 'Musical Periods', lead: 'Explore how musical style changed across two influential eras.', cards: [
    { icon: FaLandmark, color: COL.idio, head: 'Baroque', body: 'Known for its many musical details and decorations.', image: '/instruments/bach.jpg', source: commonsSource('Johann Sebastian Bach.jpg'), imageLabel: '1600s–1750s · ornate and expressive', note: 'Think: intricate melodies and harpsichord.' },
    { icon: FaBalanceScale, color: COL.chord, head: 'Classical', body: 'Simpler, more balanced, and more organized to listen to.', image: '/instruments/mozart-family.jpg', source: commonsSource('Mozart family crop.jpg'), imageLabel: '1750s–1820s · clear and balanced', note: 'Think: symmetry, clarity, and orchestra.' } ] },
  { kind: 'cards2', title: 'Melody and Harmony', lead: 'Listen for the tune in front—and the sounds that support it.', cards: [
    { icon: FaMusic, color: COL.memb, head: 'Melody', body: 'The main tune of a song—the part we often sing along to.', image: '/instruments/melody-pianist.jpg', source: commonsSource('Adela Verne, concert pianist (SAYRE 9984).jpg'), imageLabel: 'THE MAIN TUNE', note: 'Follow the notes you would hum.' },
    { icon: GiMusicalNotes, color: COL.aero, head: 'Harmony', body: 'Notes played together to support the melody and make the sound fuller.', image: '/instruments/orchestra.jpg', source: commonsSource('The Cleveland Orchestra being conducted by Daniel Reith at Severance Hall January 15th 2023.jpg'), imageLabel: 'SUPPORTING NOTES', note: 'Listen to how the parts blend.' } ] },
  { kind: 'cards2', title: 'Homophonic and Polyphonic Textures', lead: 'Musical texture describes how melodies move together.', cards: [
    { icon: FaAlignLeft, color: COL.elec, head: 'Homophonic', body: 'One main melody accompanied by chords.', image: '/instruments/chorale-score.jpg', source: commonsSource('Bach Matthäuspassion O Haupt voll Blut und Wunden.jpg'), imageLabel: 'ONE LEADING MELODY', note: 'The voices move together in support.' },
    { icon: FaSlidersH, color: COL.chord, head: 'Polyphonic', body: 'Two or more independent melodies played at the same time.', image: '/instruments/polyphony-score.png', source: commonsSource('BachFugueBar.png'), imageLabel: 'MANY INTERWEAVING MELODIES', note: 'Follow each melody as it weaves in.' } ] },
  { kind: 'row', title: 'Classification of Instruments', items: [
    { icon: GiGuitar, color: COL.chord, name: 'Guitar', tag: 'String', cap: 'Makes sound when the strings are plucked or strummed.' },
    { icon: GiDrum, color: COL.memb, name: 'Drum', tag: 'Percussion', cap: 'Makes sound when struck.' },
    { icon: GiFlute, color: COL.aero, name: 'Flute', tag: 'Wind', cap: 'Makes sound when blown into, as air passes through it.' },
    { icon: GiGong, color: COL.idio, name: 'Gong', tag: 'Percussion', cap: 'Makes sound when struck, as the metal vibrates.' } ] },
  family(1, 'Idiophones', 'The body of the instrument itself vibrates to produce sound.', COL.idio,
    'Philippine examples: kulintang and agung gongs', [
    [GiRingingBell, 'Bell', 'Struck; the metal body rings.'],
    [GiMaracas, 'Maracas', 'Shaken; the hollow shells vibrate.'],
    [GiGong, 'Agung Gong', 'Hanging gong; the metal body vibrates.'],
    [GiXylophone, 'Kulintang', 'Row of small gongs, played with sticks.'],
    [FaDrumSteelpan, 'Steelpan', 'Struck metal pan; the metal vibrates.'] ]),
  family(2, 'Membranophones', 'Sound is produced mainly by a stretched membrane vibrating.', COL.memb,
    'Philippine example: the dabakan', [
    [GiDrum, 'Snare Drum', 'Stretched skin struck with sticks.'],
    [FaDrum, 'Bass Drum', 'Large drum with a deep, low sound.'],
    [LuDrum, 'Dabakan', 'Philippine single-headed hand drum.'],
    [GiDrumKit, 'Drum Kit', 'Snare, bass, and tom drums together.'],
    [GiTambourine, 'Tambourine', 'Skin head with jingles; hit or shaken.'] ]),
  family(3, 'Chordophones', 'Sound is produced by vibrating strings: plucked, bowed, or struck.', COL.chord,
    'Philippine example: kudyapi or kutiyapi and other traditional lutes', [
    [GiGuitar, 'Guitar', 'Strings are plucked or strummed.'],
    [GiViolin, 'Violin', 'Strings are bowed.'],
    [GiHarp, 'Harp', 'Strings are plucked by the fingers.'],
    [GiGrandPiano, 'Piano', 'Strings are struck by hammers.'],
    [GiBanjo, 'Kudyapi', 'Philippine two-string lute (lute-type icon).'] ]),
  family(4, 'Aerophones', 'Sound is produced mainly by vibrating air.', COL.aero,
    'Philippine example: the tongali and other traditional bamboo flutes', [
    [GiFlute, 'Flute', 'Air is blown across the opening.'],
    [GiTrumpet, 'Trumpet', 'Lips buzz and the air column vibrates.'],
    [GiClarinet, 'Clarinet', 'A single reed vibrates with the air.'],
    [GiSaxophone, 'Saxophone', 'A reed and the air inside a metal tube.'],
    [GiPanFlute, 'Tongali', 'Philippine bamboo nose flute (flute icon).'] ]),
  family(5, 'Electrophones', 'Sound is generated or shaped by electronic circuitry.', COL.elec,
    'Electric guitars: strings vibrate, then amplified. Class depends on the system used', [
    [GiMusicalKeyboard, 'Synthesizer', 'Creates sound electronically.'],
    [MdPiano, 'E-Keyboard', 'Sound comes from electronic circuits.'],
    [GiGuitarHead, 'Electric Guitar', 'Strings plus electronic amplification.'],
    [GiGuitarBassHead, 'Electric Bass', 'Strings plus pickups and amplifier.'],
    [PiWaveform, 'Drum Machine', 'Electronic sound generation.'] ]),
  { kind: 'steps' },
  { kind: 'flow' },
  { kind: 'interp' },
]

const st = (i: number, c?: string): CSSProperties => ({ '--i': i, '--c': c } as CSSProperties)

function Badge({ Icon, color, i, big }: { Icon: IconType; color: string; i: number; big?: boolean }) {
  return <div className={`badge pop ${big ? 'big' : ''}`} style={st(i, color)}><Icon /></div>
}

function View({ s }: { s: Slide }) {
  switch (s.kind) {
    case 'cover':
      return (
        <div className="cover">
          <div className="cover-text">
            <p className="eyebrow fade" style={st(0)}>MUSIC</p>
            <h1 className="fade" style={st(1)}>Music Appreciation</h1>
            <p className="gold fade" style={st(2)}>Periods, elements, instruments, and interpretation</p>
            <div className="members fade" style={st(3)}>
              <p>Presented by</p>
              <ol>
                {['Ace Estrabela', 'Andrew Devera', 'Daniela Dela Cruz', 'Joy Jasareno'].map(name => (
                  <li key={name}>{name}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="disc pop" style={st(2)}><GiMusicalNotes className="spin-note" /></div>
          <div className="eq">{Array.from({ length: 14 }, (_, k) => <span key={k} style={st(k)} />)}</div>
        </div>
      )
    case 'cards2':
      return (
        <>
          <h2 className="title fade">{s.title}</h2>
          <p className="lead fade" style={st(1)}>{s.lead}</p>
          <div className="two">
            {s.cards.map((c, i) => (
              <div className="card feature-card pop" style={st(i + 1, c.color)} key={c.head}>
                <a className="feature-photo" href={c.source} target="_blank" rel="noopener noreferrer"
                  aria-label={`View image source for ${c.head} on Wikimedia Commons`}>
                  <img src={c.image} alt={c.head} />
                  <span className="feature-photo-label">{c.imageLabel}</span>
                  <span className="feature-photo-source">Photo source ↗</span>
                </a>
                <div className="feature-body">
                  <div className="card-head"><Badge Icon={c.icon} color={c.color} i={i + 2} /><h3>{c.head}</h3></div>
                  <p>{c.body}</p>
                  <div className="feature-note"><span style={{ backgroundColor: c.color }} />{c.note}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )
    case 'row':
      return (
        <>
          {s.eyebrow && <p className="eyebrow fade">{s.eyebrow}</p>}
          <h2 className="title fade">{s.title}</h2>
          {s.lead && <p className="lead fade" style={st(1)}>{s.lead}</p>}
          <div className="row">
            {s.items.map((it, i) => {
              const c = it.color ?? s.color ?? COL.chord
              return (
                <div className="card item pop" style={st(i + 1, c)} key={it.name}>
                  {it.image && it.source && (
                    <a className="item-photo" href={it.source} target="_blank" rel="noopener noreferrer"
                      aria-label={`View the ${it.name} photo source and license on Wikimedia Commons`}>
                      <img src={it.image} alt={it.name} loading="lazy" />
                      <span>Photo source ↗</span>
                    </a>
                  )}
                  <div className="item-copy">
                    {!it.image && <Badge Icon={it.icon} color={c} i={i + 2} big />}
                    <h3>{it.name}</h3>
                    {it.tag && <span className="tag">{it.tag}</span>}
                    <p>{it.cap}</p>
                  </div>
                </div>
              )
            })}
          </div>
          {s.pill && <div className="pill pop" style={st(7, s.color)}>{s.pill}</div>}
        </>
      )
    case 'steps': {
      const steps: [IconType, string, string, string][] = [
        [FaSearch, 'Identify', 'Find the instrument\u2019s main sound source.', COL.idio],
        [FaListUl, 'Determine', 'Is it a vibrating body, membrane, string, air column, or electronic sound generation?', COL.memb],
        [FaCommentDots, 'Explain', 'Give a reason for your choice.', COL.chord],
      ]
      return (
        <>
          <p className="eyebrow fade">HOW TO CLASSIFY</p>
          <h2 className="title fade">Classification Procedure</h2>
          <div className="row three">
            {steps.map(([Ic, h, b, c], i) => (
              <div className="card pop step" style={st(i + 1, c)} key={h}>
                <div className="card-head"><Badge Icon={Ic} color={c} i={i + 2} /><h3>{i + 1}. {h}</h3></div>
                <p>{b}</p>
              </div>
            ))}
          </div>
          <div className="practice pop" style={st(5)}>
            <span>PRACTICE</span>
            <p>Classify five instruments from pictures or recordings and give a reason for each classification.</p>
          </div>
        </>
      )
    }
    case 'flow': {
      const f: [IconType, string, string, string][] = [
        [FaHeadphones, 'Listening', 'Listening evidence', COL.memb],
        [FaGlobeAsia, 'Knowing history and culture', 'Context', COL.chord],
        [FaBullseye, 'Accurate interpretation', 'Truer meaning', COL.aero],
      ]
      return (
        <>
          <h2 className="title fade">Importance of Listening Evidence and Context</h2>
          <p className="lead fade" style={st(1)}>This matters because it helps us better understand the meaning of music.</p>
          <div className="flow">
            {f.map(([Ic, h, sub, c], i) => (
              <div className="flow-part" key={h}>
                <div className="card item pop" style={st(i * 2 + 1, c)}>
                  <Badge Icon={Ic} color={c} i={i * 2 + 2} big /><h3>{h}</h3><p>{sub}</p>
                </div>
                {i < 2 && <FaArrowRight className="arrow pop" style={st(i * 2 + 2)} />}
              </div>
            ))}
          </div>
          <p className="foot fade" style={st(6)}>By listening and learning its history and culture, our interpretation becomes more accurate.</p>
        </>
      )
    }
    case 'interp': {
      const r: [IconType, string, string][] = [
        [FaAlignLeft, 'Lyrics', COL.memb], [FaMusic, 'Melody', COL.elec], [FaCloud, 'Soft instrumental sounds', COL.aero],
      ]
      return (
        <>
          <h2 className="title fade">Musical Interpretation</h2>
          <div className="interp">
            <div className="interp-left">
              <div className="song pop" style={st(1)}><Badge Icon={FaLeaf} color={COL.chord} i={1} /><h3>{'\u201C'}Leaves{'\u201D'} by Ben&amp;Ben</h3></div>
              <p className="big fade" style={st(2)}>For us, it is about hope and moving forward in life.</p>
              <p className="small fade" style={st(3)}>You can feel it in the lyrics, melody, and soft instrumental sounds, which give an emotional and comforting feeling.</p>
            </div>
            <div className="interp-right">
              {r.map(([Ic, t, c], i) => (
                <div className="card row-card pop" style={st(i + 2, c)} key={t}><Badge Icon={Ic} color={c} i={i + 3} /><h3>{t}</h3></div>
              ))}
            </div>
          </div>
        </>
      )
    }
  }
}

export default function App() {
  const [n, setN] = useState(0)
  const go = useCallback((d: number) => setN(v => Math.min(SLIDES.length - 1, Math.max(0, v + d))), [])
  const fullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen())

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1) }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) go(-1)
      else if (e.key === 'Home') setN(0)
      else if (e.key === 'End') setN(SLIDES.length - 1)
      else if (e.key.toLowerCase() === 'f') fullscreen()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go])

  return (
    <div className="app">
      <div className="stage">
        <div className="staff" />
        <GiMusicalNotes className="float f1" /><FaMusic className="float f2" /><GiMusicalNotes className="float f3" />
        <section className={`slide k-${SLIDES[n].kind}`} key={n}><View s={SLIDES[n]} /></section>
        <div className="bar">
          <button onClick={() => go(-1)} disabled={n === 0} aria-label="Previous"><FaChevronLeft /></button>
          <div className="dots">
            {SLIDES.map((_, i) => <i key={i} className={i === n ? 'on' : ''} onClick={() => setN(i)} />)}
          </div>
          <span className="count">{n + 1} / {SLIDES.length}</span>
          <button onClick={fullscreen} aria-label="Fullscreen"><FaExpand /></button>
          <button onClick={() => go(1)} disabled={n === SLIDES.length - 1} aria-label="Next"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  )
}
