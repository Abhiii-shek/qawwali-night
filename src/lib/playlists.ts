export interface Track {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  duration: string;
  videoId: string;
}

export interface Playlist {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tracks: Track[];
}

export const PLAYLISTS: Playlist[] = [
  {
    id: "mehfil-e-qawwali",
    name: "01 — MEHFIL-E-QAWAALI",
    subtitle: "रूहानी शाम • Classic Gathering",
    description: "Intimate late-night courtyard mehfil with harmonium and clappers",
    tracks: [
      {
        id: "track-01",
        title: "Tumhein Dillagi Bhool Jani Paray Gi (تمہیں دِل لگی بھول جانی پڑے گی)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Qawwali",
        year: 1990,
        duration: "18:04",
        videoId: "q4NVp-aFZSw",
      },
      {
        id: "track-02",
        title: "Allah Hoo (اللہ ھو)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Allah Hoo",
        year: 2022,
        duration: "27:15",
        videoId: "2fAc8DjmnuE",
      },
      {
        id: "track-03",
        title: "Mere Rashke Qamar (میرے رشکِ قمر)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Original Complete Version",
        year: 2017,
        duration: "18:43",
        videoId: "gY01irEl8Eo",
      },
      {
        id: "track-04",
        title: "Kali Kali Zulfon Ke Phande Na (کالی کالی زلفوں کے پھندے نہ)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Original Version",
        year: 2022,
        duration: "16:20",
        videoId: "Uv44rzOfz0w",
      },
      {
        id: "track-05",
        title: "Mera Piya Ghar Aaya (میرا پیا گھر آیا)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Live in Concert — WOMAD",
        year: 1988,
        duration: "10:45",
        videoId: "e3g8hlyfg5E",
      },
      {
        id: "track-06",
        title: "Gham Hai Ya Khushi Hai Tu (غم ہے یا خوشی ہے تو)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Gham Hai Ya Khushi Hai Tu",
        year: 1988,
        duration: "14:10",
        videoId: "eId3SgMdmiI",
      },
      {
        id: "track-07",
        title: "Shahbaz Qalandar (شہباز قلندر)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Live — Royal Oak, Birmingham",
        year: 1983,
        duration: "18:23",
        videoId: "xxjKw7HZQEI",
      },
      {
        id: "track-08",
        title: "Haq Ali Ali Maula Ali Ali (حق علی علی مولا علی علی)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Live in UK",
        year: 1983,
        duration: "15:30",
        videoId: "XW3frG5igCQ",
      },
    ],
  },
  {
    id: "sufi-raat",
    name: "02 — SUFI RAAT",
    subtitle: "इबादत और सुर • Mystic Night",
    description: "Deep spiritual echo from old alleys, velvet carpets, and burning incense",
    tracks: [
      {
        id: "sufi-01",
        title: "Allah Hoo (اللہ ھو)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Qawwali",
        year: 1990,
        duration: "27:15",
        videoId: "2fAc8DjmnuE",
      },
      {
        id: "sufi-02",
        title: "Ye Jo Halka Halka Suroor Hai (یہ جو ہلکا ہلکا سرور ہے)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Qawwali",
        year: 1980,
        duration: "19:05",
        videoId: "6YQ1E3s9b3w",
      },
      {
        id: "sufi-03",
        title: "Dam Mast Qalandar (دم مست قلندر)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Sufi Qawwali",
        year: 1990,
        duration: "12:40",
        videoId: "SKZAiWSquA0",
      },
      {
        id: "sufi-04",
        title: "Haq Ali Ali (حق علی علی)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Sufi Qawwali",
        year: 1985,
        duration: "15:30",
        videoId: "XW3frG5igCQ",
      },
      {
        id: "sufi-05",
        title: "Shahbaaz Qalandar (شہباز قلندر)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Sufi Qawwali",
        year: 1985,
        duration: "18:23",
        videoId: "xxjKw7HZQEI",
      },
      {
        id: "sufi-06",
        title: "Ya Haiyyo Ya Qayyum (یا حی یا قیوم)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Sufi Qawwali",
        year: 1994,
        duration: "30:00",
        videoId: "J_k2m8X0b6g",
      },
      {
        id: "sufi-07",
        title: "Sanson Ki Mala Pe (سانسوں کی مالا پہ)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Sufi Qawwali",
        year: 1993,
        duration: "10:05",
        videoId: "14D-_B2Tjsc",
      },
      {
        id: "sufi-08",
        title: "Mast Mast (مست مست)",
        artist: "Nusrat Fateh Ali Khan",
        film: "Traditional Qawwali",
        year: 1990,
        duration: "06:45",
        videoId: "KWZGAExj-es",
      },
    ],
  },
  {
    id: "yaadon-ki-mehfil",
    name: "03 — YAADON KI MEHFIL",
    subtitle: "पुरानी यादें • Golden Vintage Era",
    description: "Cassette tape acoustics, warm hanging bulbs, and midnight memories",
    tracks: [
      {
        id: "track-07",
        title: "Kun Faya Kun (कुन फ़ाया कुन)",
        artist: "A.R. Rahman, Javed Ali, Mohit Chauhan",
        film: "Rockstar • T-Series Official",
        year: 2011,
        duration: "07:53",
        videoId: "T94PHkuydcw",
      },
      {
        id: "track-08",
        title: "Khwaja Mere Khwaja (ख्वाजा मेरे ख्वाजा)",
        artist: "A.R. Rahman",
        film: "Jodhaa Akbar • T-Series Official",
        year: 2008,
        duration: "06:56",
        videoId: "L3q_4bL7Kz0",
      },
      {
        id: "track-09",
        title: "Allah Hoo (अल्लाह हू - Live Mehfil)",
        artist: "Sami Brothers / Traditional Qawwals",
        film: "Heritage Recording 1994",
        year: 1994,
        duration: "08:30",
        videoId: "lY3PqK0-H0A",
      },
    ],
  },
];
