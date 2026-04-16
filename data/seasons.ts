/** Per-game row. Set `opponentLogo` to a path under `public/` (e.g. `/logos/stetson.png`). */
export type SeasonEvent = {
  round: string;
  date: string;
  opponent: string;
  /** Optional logo file path (under `public/`) shown next to the opponent name. */
  opponentLogo?: string;
  stat: string;
  description: string;
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
  /** Optional UConn logo path under `public/` (e.g. `/logos/uconn.png`) on every game card. */
  uconnLogo?: string;
  analytics: { label: string; value: string }[];
  events: SeasonEvent[];
};

export const seasons: Season[] = [
  {
    id: "2022-2023",
    title: "2022-23 The Return",
    record: "31-8",
    summary:
      "A dominant March run that culminated in UConn's fifth national title, marking a return to the top and ushering in the Dan Hurley era.",
    heroImage:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80",
    coachImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
    teamImage:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1200&q=80",
    uconnLogo: "/logos/uconn.png",
    analytics: [
      { label: "Overall Record", value: "31-8" },
      { label: "Tournament Record", value: "6-0" },
      { label: "Seed", value: "4" },
    ],
    events: [
      {
        round: "Round of 64",
        date: "March 17, 2023",
        opponent: "Iona",
        opponentLogo: "/logos/iona.png",
        stat: "Won 87-63",
        description:
          "UConn survives early pressure, then takes over in the second half to begin the tournament run.",
        clip: "Add YouTube or NCAA highlight embed here",
      },
      {
        round: "Round of 32",
        date: "March 19, 2023",
        opponent: "Saint Mary's",
        opponentLogo: "/logos/saint-marys.png",
        stat: "Won 70-55",
        description:
          "A sharp two-way performance sends UConn comfortably into the Sweet 16.",
        clip: "Add game highlights",
      },
      {
        round: "Sweet 16",
        date: "March 23, 2023",
        opponent: "Arkansas",
        opponentLogo: "/logos/arkansas.png",
        stat: "Won 88-65",
        description:
          "The Huskies handle a dangerous Arkansas team and keep building momentum.",
        clip: "Add game highlights",
      },
      {
        round: "Elite Eight",
        date: "March 25, 2023",
        opponent: "Gonzaga",
        opponentLogo: "/logos/gonzaga.png",
        stat: "Won 82-54",
        description:
          "One of the most convincing wins of the run puts UConn in the Final Four.",
        clip: "Add game highlights",
      },
      {
        round: "Final Four",
        date: "April 1, 2023",
        opponent: "Miami",
        opponentLogo: "/logos/miami.png",
        stat: "Won 72-59",
        description:
          "UConn controls the game and punches its ticket to the national championship.",
        clip: "Add game highlights",
      },
      {
        round: "National Championship",
        date: "April 3, 2023",
        opponent: "San Diego State",
        opponentLogo: "/logos/sdsu.png",
        stat: "Won 76-59",
        description:
          "The Huskies finish the job and claim another national title.",
        clip: "Add title game highlights",
      },
    ],
  },
  {
    id: "2023-2024",
    title: "2023-24 Back to Back",
    record: "37-3",
    summary:
      "A powerhouse season that ended with UConn repeating as national champions and capturing its sixth title, highlighted by the program's first-ever No. 1 overall seed in the NCAA Tournament.",
    heroImage:
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1400&q=80",
    coachImage:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80",
    teamImage:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
    uconnLogo: "/logos/uconn.png",
    analytics: [
      { label: "Overall Record", value: "37-3" },
      { label: "Tournament Record", value: "6-0" },
      { label: "Seed", value: "1" },
    ],
    events: [
      {
        round: "Round of 64",
        date: "March 22, 2024",
        opponent: "Stetson",
        opponentLogo: "/logos/stetson.png",
        stat: "Won 91-52",
        description:
          "UConn opens the tournament with a comfortable first-round win.",
        clip: "Add game highlights",
      },
      {
        round: "Round of 32",
        date: "March 24, 2024",
        opponent: "Northwestern",
        opponentLogo: "/logos/northwestern.png",
        stat: "Won 75-58",
        description:
          "The Huskies stay on track and move into the second weekend.",
        clip: "Add game highlights",
      },
      {
        round: "Sweet 16",
        date: "March 28, 2024",
        opponent: "San Diego State",
        opponentLogo: "/logos/sdsu.png",
        stat: "Won 82-52",
        description:
          "A rematch of the previous title game ends the same way: UConn in control.",
        clip: "Add game highlights",
      },
      {
        round: "Elite Eight",
        date: "March 30, 2024",
        opponent: "Illinois",
        opponentLogo: "/logos/illinois.png",
        stat: "Won 77-52",
        description:
          "A 30-0 run sends UConn back to the Final Four.",
        clip: "Add game highlights",
      },
      {
        round: "Final Four",
        date: "April 6, 2024",
        opponent: "Alabama",
        opponentLogo: "/logos/alabama.png",
        stat: "Won 86-72",
        description:
          "The offense catches fire and UConn reaches another championship game.",
        clip: "Add game highlights",
      },
      {
        round: "National Championship",
        date: "April 8, 2024",
        opponent: "Purdue",
        opponentLogo: "/logos/purdue.png",
        stat: "Won 75-60",
        description:
          "UConn completes the repeat and cements its modern dynasty status.",
        clip: "Add title game highlights",
      },
    ],
  },
];
