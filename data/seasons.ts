export type SeasonEvent = {
  date: string;
  title: string;
  description: string;
  stat: string;
  clip: string;
};

export type Season = {
  id: string;
  title: string;
  record: string;
  summary: string;
  heroImage: string;
  coachImage: string;
  teamImage: string;
  analytics: { label: string; value: string }[];
  events: SeasonEvent[];
};

export const seasons: Season[] = [
  {
    id: "2022-2023",
    title: "2022–23 National Championship Run",
    record: "31–8",
    summary:
      "A dominant March run capped by UConn winning the 2023 national title.",
    heroImage:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80",
    coachImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
    teamImage:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1200&q=80",
    analytics: [
      { label: "Overall Record", value: "31–8" },
      { label: "Tournament Record", value: "6–0" },
      { label: "Seed", value: "4" },
      { label: "Title", value: "National Champions" },
    ],
    events: [
      {
        date: "March 17, 2023",
        title: "Round of 64 vs Iona",
        description:
          "UConn survives early pressure, then takes over in the second half to begin the tournament run.",
        stat: "Won 87–63",
        clip: "Add YouTube or NCAA highlight embed here",
      },
      {
        date: "March 19, 2023",
        title: "Round of 32 vs Saint Mary’s",
        description:
          "A sharp two-way performance sends UConn comfortably into the Sweet 16.",
        stat: "Won 70–55",
        clip: "Add game highlights",
      },
      {
        date: "March 23, 2023",
        title: "Sweet 16 vs Arkansas",
        description:
          "The Huskies handle a dangerous Arkansas team and keep building momentum.",
        stat: "Won 88–65",
        clip: "Add game highlights",
      },
      {
        date: "March 25, 2023",
        title: "Elite Eight vs Gonzaga",
        description:
          "One of the most convincing wins of the run puts UConn in the Final Four.",
        stat: "Won 82–54",
        clip: "Add game highlights",
      },
      {
        date: "April 1, 2023",
        title: "Final Four vs Miami",
        description:
          "UConn controls the game and punches its ticket to the national championship.",
        stat: "Won 72–59",
        clip: "Add game highlights",
      },
      {
        date: "April 3, 2023",
        title: "National Championship vs San Diego State",
        description:
          "The Huskies finish the job and claim another national title.",
        stat: "Won 76–59",
        clip: "Add title game highlights",
      },
    ],
  },
  {
    id: "2023-2024",
    title: "2023–24 Repeat Championship Run",
    record: "37–3",
    summary:
      "A powerhouse season that ended with UConn repeating as national champions.",
    heroImage:
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1400&q=80",
    coachImage:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80",
    teamImage:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
    analytics: [
      { label: "Overall Record", value: "37–3" },
      { label: "Tournament Record", value: "6–0" },
      { label: "Seed", value: "1" },
      { label: "Title", value: "National Champions" },
    ],
    events: [
      {
        date: "March 22, 2024",
        title: "Round of 64 vs Stetson",
        description:
          "UConn opens the tournament with a comfortable first-round win.",
        stat: "Won 91–52",
        clip: "Add game highlights",
      },
      {
        date: "March 24, 2024",
        title: "Round of 32 vs Northwestern",
        description:
          "The Huskies stay on track and move into the second weekend.",
        stat: "Won 75–58",
        clip: "Add game highlights",
      },
      {
        date: "March 28, 2024",
        title: "Sweet 16 vs San Diego State",
        description:
          "A rematch of the previous title game ends the same way: UConn in control.",
        stat: "Won 82–52",
        clip: "Add game highlights",
      },
      {
        date: "March 30, 2024",
        title: "Elite Eight vs Illinois",
        description:
          "A devastating second-half surge sends UConn back to the Final Four.",
        stat: "Won 77–52",
        clip: "Add game highlights",
      },
      {
        date: "April 6, 2024",
        title: "Final Four vs Alabama",
        description:
          "The offense catches fire and UConn reaches another championship game.",
        stat: "Won 86–72",
        clip: "Add game highlights",
      },
      {
        date: "April 8, 2024",
        title: "National Championship vs Purdue",
        description:
          "UConn completes the repeat and cements its modern dynasty status.",
        stat: "Won 75–60",
        clip: "Add title game highlights",
      },
    ],
  },
];
