/* ============================================================
   NEWPORT CHESS OUTREACH — CONTENT DATA
   ------------------------------------------------------------
   All editable site content lives here, separate from markup
   and logic. This is the seed of a future CMS/database: every
   array below maps cleanly to a future database table (see
   ARCHITECTURE.md → Database Schema). To make a content change
   today, a non-technical admin can edit this file with any
   text editor and follow the existing pattern for each entry.
   ============================================================ */

const SITE_DATA = {

  /* Homepage impact statistics — update numbers as they change. */
  // stats: [
  //   { value: 2400, suffix: "+", label: "Students Served" },
  //   { value: 38, suffix: "", label: "Camps Hosted" },
  //   { value: 65, suffix: "+", label: "Community Events" },
  //   { value: 5200, suffix: "+", label: "Volunteer Hours" }
  // ],

  /* Featured announcements — add a new object to feature it on the homepage. */
  announcements: [
    {
      category: "Upcoming Events",
      date: "July 27-31 2026",
      title: "Summer Chess Camp registration is open",
      excerpt: "A one weeklong sessions for grades 3-8, beginner through advanced. Early-bird pricing ends July 1.",
      link: "events.html"
    },
    {
      category: "Upcoming Events",
      date: "July 12 2026",
      title: "July Summer Tournament",
      excerpt: "Unrated Section open to anyone, regardless of membership or not. USCF + NWSRS rated section is only for players with a prior USCF membership. There are no age requirements for this tournament.",
      link: "events.html"
    },
    // {
    //   category: "Community Updates",
    //   date: "May 2026",
    //   title: "New partnership with three Newport County libraries",
    //   excerpt: "Free weekly drop-in chess clubs now meet at the Middletown, Newport, and Portsmouth branch libraries.",
    //   link: "about.html"
    // },
  ],

  /* Events & camps — used on the homepage (upcoming) and the Events page (full list). */
  events: [
    {
      slug: "summer-chess-camp-2026",
      title: "Knight4Life Summer Camp",
      category: "Camps",
      date: "July 27–31, 2026",
      time: "9:30 AM – 2:30 PM",
      location: "Newport High School, Bellevue, WA",
      ageRange: "Grades 3–8 (exceptions can be made)",
      cost: "$299",
      costCents: 29900,  
      short: "A full week of instruction, puzzles, and friendly tournament play for beginner through advanced players.",
      
      description: "**Knight4Life Summer Camp — Where Every Move Matters.** Five days. All skill levels. One unforgettable week. Knight4Life Summer Camp is a student-led chess program where beginners and experienced players alike learn, compete, and grow together. Hosted in partnership with Wise Camps, campers benefit from a structured, well-supervised environment with experienced staff supporting safety and daily operations throughout the week. Each day follows a thoughtfully designed curriculum—from tactical puzzles and team challenges to a Swiss-format tournament on Thursday and a Grand Finale celebration on Friday. Campers are grouped by skill level from day one, ensuring every child receives age-appropriate instruction, meaningful challenges, and personalized support. From a workshop with our guest titled player to mentorship from volunteers on state-placing high school teams, campers build confidence, critical thinking, and sportsmanship both on and off the board. Beyond chess, campers earn team points, solve daily puzzles, form new friendships, and leave with personalized achievement certificates and camp swag. It's educational, engaging, and a whole lot of fun. Whether your child is just learning the game or has been playing for years, there's a place for them here. Spots are limited—register today.",
      schedule: [
        { time: "9:30 – 9:45 AM", activity: "Arrival & morning puzzle" },
        { time: "9:30 – 10:30 AM", activity: "Lessons and Workshops" },
        { time: "10:30 – 11:45 PM", activity: "Puzzles and Challenges" },
        { time: "11:45 – 12:45 PM", activity: "Lunch + Choose Your Own Adventure" },
        { time: "12:45 – 2:15 PM", activity: "Lessons, Workshops, and Games" },
        { time: "2:15 – 2:45 PM", activity: "Debrief, Wrap-up, and Pick-up" },

      ],
      materials: ["Comfortable clothing", "Refillable water bottle", "Lunch (contact us if 'bring your own' for a lower price)"],
      refundPolicy: "Full refund up to 7 days before camp start. 50% refund 3-6 days before camp. No refunds less than 2 days before camp has begun, though credit toward a future session is available.",
      faqs: [
        { q: "Does my camper need chess experience?", a: "No — campers are grouped by experience level on the first morning, and our beginner track assumes no prior knowledge." },
        { q: "Is before/after care available?", a: "Drop-off begins at 9:10 AM. Limited after-care until 4:00 PM is available for an additional fee — note this during registration or contact us directly ASAP." },
        { q: "What if my camper needs to miss a day?", a: "Let us know in advance where possible. We're not able to prorate fees for missed days, but campers are welcome to rejoin the following day." }
      ]
    },
    {
      slug: "newport-july-tournament",
      title: "July Summer Tournament",
      category: "Tournaments",
      date: "July 12, 2026",
      time: "9:15 AM – 7:00 PM",
      location: "960 Newport Way NW, Issaquah, WA 98027",
      ageRange: "All ages",
      cost: "Free!",
      costCents: 0,  
      short: "A six-round 30|0 Swiss tournament with sections for every rating level, from first-timers to experienced competitors.",
      description: "Unrated Section open to anyone, regardless of membership or not. USCF + NWSRS rated section is only for players with a prior USCF membership. There are no age requirements for this tournament.",
      schedule: [
        { time: "9:15 – 9:45 AM", activity: "Check-in & pairings posted" },
        { time: "10:00 AM – 12:15 PM", activity: "Rounds 1–2" },
        { time: "12:15 – 1:15 PM", activity: "Lunch break" },
        { time: "1:30 – 6:15 PM", activity: "Rounds 3–6" },
        { time: "6:30 – 7:00 PM", activity: "Awards ceremony" }
      ],
      materials: ["Digital chess clock if you have one (loaners available)", "Pencil for scorekeeping (provided if needed)"],
      faqs: [
        { q: "Is this tournament USCF rated?", a: "Yes — a current or new USCF membership is required and can be added during registration." },
        { q: "Can I request a bye for a round?", a: "Half-point byes for rounds 1, 2, or 5 can be requested at check-in, subject to tournament rules." }
      ]
    },
    // {
    //   slug: "tactics-workshop-october-2026",
    //   title: "Tactics & Endgames Workshop",
    //   category: "Workshops",
    //   date: "October 11, 2026",
    //   time: "4:00 PM – 6:00 PM",
    //   location: "Newport Public Library",
    //   ageRange: "Ages 9+",
    //   cost: "$15",
    //   short: "A focused two-hour workshop on pattern recognition and converting an advantage into a win.",
    //   description: "Led by a National Master, this workshop covers the tactical motifs and endgame technique that decide most scholastic games: forks, pins, back-rank ideas, and basic king-and-pawn endings. Includes guided puzzle-solving and a short Q&A.",
    //   schedule: [
    //     { time: "4:00 – 4:45 PM", activity: "Tactical motifs walkthrough" },
    //     { time: "4:45 – 5:30 PM", activity: "Guided puzzle sets" },
    //     { time: "5:30 – 6:00 PM", activity: "Endgame technique & Q&A" }
    //   ],
    //   materials: ["Notebook for notes (optional)"],
    //   refundPolicy: "Full refund up to 48 hours before the workshop.",
    //   faqs: [
    //     { q: "Do I need to bring a chess set?", a: "No — all puzzles are presented on screen, and printed diagrams are provided." }
    //   ]
    // },
    // {
    //   slug: "library-outreach-series",
    //   title: "Library Drop-In Chess Club",
    //   category: "Community",
    //   date: "Every Thursday, year-round",
    //   time: "4:00 PM – 5:30 PM",
    //   location: "Rotating: Middletown, Newport & Portsmouth libraries",
    //   ageRange: "All ages, free",
    //   cost: "Free",
    //   short: "A free, no-registration-required chess club open to the whole community — boards provided.",
    //   description: "Our community outreach program brings boards, clocks, and volunteer coaches to local libraries every week. No registration or experience required — just show up and play. This program is supported entirely by volunteer hours and community donations.",
    //   schedule: [
    //     { time: "4:00 – 4:15 PM", activity: "Open play begins" },
    //     { time: "4:15 – 5:00 PM", activity: "Casual games & light coaching" },
    //     { time: "5:00 – 5:30 PM", activity: "Puzzle of the week challenge" }
    //   ],
    //   materials: ["Nothing required — boards and sets are provided"],
    //   refundPolicy: "Not applicable — this program is free and does not require registration.",
    //   faqs: [
    //     { q: "Do I need to register in advance?", a: "No — this is a free drop-in program. Just arrive any time during the session." }
    //   ]
    // }
  ],

  /* Board of directors */
  board: [
    { name: "Daniel Zhang", role: "President", bio: "Daniel founded Newport Chess Outreach in 2026 inspired by his lifelong passion for chess and community services", linkedin: "#" },

  ],

  /* Organizational values */
  values: [
    { title: "Education", text: "We teach chess as a tool for sharper thinking, not just competition — every lesson builds transferable skills." },
    { title: "Leadership", text: "Chess teaches young people to plan, take responsibility for decisions, and learn from setbacks." },
    { title: "Community", text: "We bring chess into libraries, schools, and community centers so geography and cost are never barriers." },
    { title: "Inclusion", text: "Every program is built to welcome first-time players alongside experienced competitors, regardless of background." },
    { title: "Excellence", text: "From camp curriculum to tournament direction, we hold our programs to a high, consistent standard." }
  ],

  /* Contact page FAQ preview */
  faqs: [
    { q: "How do I register for an event or camp?", a: "Visit the Events & Camps page, choose a listing, and select \"Register.\" You'll complete a short multi-step form covering guardian, emergency contact, and participant details." },
    { q: "What is your refund policy?", a: "Refund windows vary slightly by event and are listed on each event's detail page. In general, full refunds are available when canceling at least one to two weeks in advance." },
    { q: "How can I volunteer?", a: "We're always looking for coaches, tournament directors, and event-day help. Send us a message using the contact form and tell us a bit about your background." },
    { q: "How can my business sponsor an event?", a: "We offer several sponsorship tiers for camps, tournaments, and our annual gala. Reach out through the contact form and our development team will follow up with details." }
  ]
};
